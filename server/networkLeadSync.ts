import crypto from "node:crypto";
import { and, asc, eq, lte, or, sql } from "drizzle-orm";
import { db } from "./db";
import { websiteLeadOutbox, type contactSubmissions } from "@shared/schema";
import { networkRuntime, resolveSiteIdentity } from "./network/runtime";
import { createLeadEnvelope, leadEnvelopeSchema } from "@shared/network/leadContract";
import { LEAD_POLL_MS, LEAD_LEASE_MS, LEAD_BATCH_SIZE, leadRetryDelay, leadEventMatchesSite } from "@shared/network/outbox";
import { sendLeadEvent } from "./network/transport";
import { ukEnvironment } from "./ukRuntime";

type Lead = typeof contactSubmissions.$inferSelect;
type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

export async function queueNetworkLead(lead:Lead,tx:Tx) {
  if(["integration_test","career","career_application"].includes(lead.leadSource||"")) return;
  // Local enquiry persistence remains available while delivery configuration is
  // incomplete. Such events cannot pass the worker's registered-site checks.
   const identity = resolveSiteIdentity(ukEnvironment(process.env));
   if (!identity || identity.countryCode !== "GB") throw new Error("UK lead identity is incomplete");
   const baseEvent=createLeadEnvelope(lead, identity);
   const event = { ...baseEvent, payload: { ...baseEvent.payload,
     context: { ...baseEvent.payload.context, currency: "GBP", timezone: "Europe/London" } } };
  await tx.insert(websiteLeadOutbox).values({
    contactId:lead.id,eventId:event.eventId,clientCode:identity.clientCode,
    envelope:event
  }).onConflictDoNothing({target:websiteLeadOutbox.eventId});
}

let running=false,started=false;
async function claimNext() {
  const now=new Date();
  return db.transaction(async tx=>{
    const [row]=await tx.select().from(websiteLeadOutbox)
      .where(or(
        and(or(eq(websiteLeadOutbox.status,"pending"),eq(websiteLeadOutbox.status,"failed")),
          lte(websiteLeadOutbox.nextAttemptAt,now)),
        and(eq(websiteLeadOutbox.status,"sending"),lte(websiteLeadOutbox.updatedAt,new Date(now.getTime()-LEAD_LEASE_MS)))
      ))
      .orderBy(asc(websiteLeadOutbox.createdAt)).limit(1).for("update",{skipLocked:true});
    if(!row)return null;
    const leaseId=crypto.randomUUID();
    const [claimed]=await tx.update(websiteLeadOutbox)
      .set({status:"sending",attempts:row.attempts+1,lastError:leaseId,updatedAt:now})
      .where(eq(websiteLeadOutbox.id,row.id)).returning();
    return {record:claimed,leaseId};
  });
}
export async function flushNetworkLeadOutbox() {
  if(running)return;
   const runtime = networkRuntime(ukEnvironment(process.env));
  if (!runtime) return;
  running=true;
  try{
    for(let i=0;i<LEAD_BATCH_SIZE;i++){
      const task=await claimNext();
      if(!task)break;
      const {record,leaseId}=task;
      const valid = record.clientCode === runtime.clientCode &&
        record.eventId === (record.envelope as { eventId?: string })?.eventId &&
        leadEventMatchesSite(record.envelope, runtime) && leadEnvelopeSchema.safeParse(record.envelope).success;
      const { ok, reason } = valid
        ? await sendLeadEvent(record.envelope, record.eventId, runtime)
        : { ok: false, reason: "invalid_country_event" };
      const now=new Date();
      const delay=leadRetryDelay(record.attempts);
      await db.update(websiteLeadOutbox).set({
        status:ok?"delivered":"failed",lastError:ok?null:reason,
        nextAttemptAt:new Date(now.getTime()+delay),
        deliveredAt:ok?now:null,updatedAt:now
      }).where(and(eq(websiteLeadOutbox.id,record.id),
        eq(websiteLeadOutbox.status,"sending"),
        eq(websiteLeadOutbox.lastError,leaseId)));
    }
  }catch(e){console.warn("[Network Leads] delivery cycle deferred; queued leads retained.")}
  finally{running=false;}
}
export function startNetworkLeadWorker(){
  if(started)return;
  started=true;
  void flushNetworkLeadOutbox();
  const timer=setInterval(()=>void flushNetworkLeadOutbox(),LEAD_POLL_MS);
  timer.unref();
}
