import type { Request } from "express";
import { and, asc, eq, lte, or, sql } from "drizzle-orm";
import { db } from "./db";
import { contactSubmissions, websiteLeadOutbox, type InsertContactSubmission } from "@shared/schema";

/** Commit the website contact and Network event atomically; retry remote delivery asynchronously. */
type Extras = {
  category?: unknown; service?: unknown; company?: unknown; projectName?: unknown;
  location?: unknown; sourcePage?: unknown; landingPage?: unknown;
  referrer?: unknown; attribution?: unknown;
};
const clipped = (v: unknown, max = 255) => typeof v === "string" ? v.trim().slice(0, max) : "";
const trackingKeys = ["utm_source","utm_medium","utm_campaign","utm_content","utm_term","gclid","gbraid","wbraid","msclkid","fbclid"];
function cleanTracking(raw: unknown): Record<string,string> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const input = raw as Record<string,unknown>;
  return Object.fromEntries(trackingKeys.flatMap(key => {
    const value=clipped(input[key],256); return value ? [[key,value]] : [];
  }));
}
function inferCategory(service: string, candidate: string, channel: string) {
  if (["residential","consultancy","technical"].includes(candidate)) return candidate;
  if (channel === "sample-report-download") return "residential";
  if (/reserve|condition|allocation|reinstatement|asset|due diligence|completion|consultancy/i.test(service)) return "consultancy";
  if (/structural|thermo|acoustic|noise|dilapidation/i.test(service)) return "technical";
  return "residential";
}

export async function saveAndQueueWebsiteLead(
  submission: InsertContactSubmission, req: Request, channel: string, extras: Extras = {}
) {
  const clientCode = process.env.URBANGRID_NETWORK_CLIENT_CODE || "urbangrid-website";
  const countryCode = (process.env.URBANGRID_COUNTRY_CODE || "AE").toUpperCase();
  const sourceDomain = (process.env.URBANGRID_SITE_DOMAIN || "urbangrid.ae").toLowerCase();
  const sourcePage = clipped(extras.sourcePage,600) || clipped(req.get("referer"),600) || "/";
  const service = clipped(extras.service,160) || clipped(submission.enquiryType,160) || channel;
  const category = inferCategory(service,clipped(extras.category),channel);
  return db.transaction(async tx => {
    const [saved] = await tx.insert(contactSubmissions).values(submission).returning();
    const eventId = clientCode + ".lead.created." + saved.id;
    const envelope = {
      eventId, eventType: "lead.created", schemaVersion: 1,
      payload: {
        countryCode, sourceDomain, sourcePage,
        attribution: cleanTracking(extras.attribution),
        context: {
          channel, landingPage: clipped(extras.landingPage,600) || undefined,
          referrer: clipped(extras.referrer,600) || undefined
        },
        lead: {
          id: String(saved.id), name:saved.name, email:saved.email, phone:saved.phone,
          category, service, company:clipped(extras.company),
          projectName:clipped(extras.projectName),location:clipped(extras.location),
          message:saved.message
        }
      }
    };
    await tx.insert(websiteLeadOutbox).values({
      contactId:saved.id,eventId,clientCode,envelope
    });
    return saved;
  });
}

let running=false;
let started=false;
export async function deliverPendingNetworkLeads() {
  if (running) return;
  const url=process.env.URBANGRID_NETWORK_INTEGRATION_URL;
  const key=process.env.URBANGRID_NETWORK_INTEGRATION_KEY;
  if (!url || !key) return;
  let endpoint: URL;
  try {
    endpoint = new URL(url);
    if(endpoint.protocol !== "https:" || key.length<32) return;
  } catch { return; }
  running=true;
  try {
    const now=new Date();
    const expiredLease=new Date(now.getTime()-120000);
    const pending=await db.select().from(websiteLeadOutbox).where(or(
      and(or(eq(websiteLeadOutbox.status,"pending"),eq(websiteLeadOutbox.status,"retry")),
          lte(websiteLeadOutbox.nextAttemptAt,now)),
      and(eq(websiteLeadOutbox.status,"sending"),lte(websiteLeadOutbox.updatedAt,expiredLease))
    )).orderBy(asc(websiteLeadOutbox.createdAt)).limit(20);
    for(const item of pending) {
      const [claimed]=await db.update(websiteLeadOutbox).set({
        status:"sending",attempts:sql.raw("attempts + 1"),updatedAt:new Date()
      }).where(and(
        eq(websiteLeadOutbox.id,item.id),eq(websiteLeadOutbox.status,item.status),
        eq(websiteLeadOutbox.updatedAt,item.updatedAt)
      )).returning();
      if(!claimed) continue;
      let errorMessage:string|null=null;
      try {
        const resp=await fetch(endpoint.toString(),{
          method:"POST",
          headers:{"content-type":"application/json","x-urbangrid-key":key,"x-urbangrid-client":item.clientCode},
          body:JSON.stringify(item.envelope),
          signal:AbortSignal.timeout(12000)
        });
        const body=await resp.json().catch(()=>({})) as {accepted?:boolean};
        if(resp.ok && body.accepted===true){
          await db.update(websiteLeadOutbox).set({
            status:"delivered",deliveredAt:new Date(),lastError:null,updatedAt:new Date()
          }).where(eq(websiteLeadOutbox.id,item.id));
          continue;
        }
        errorMessage="Network HTTP "+resp.status;
      } catch(e) { errorMessage=e instanceof Error?e.name:"network_error"; }
      const seconds=Math.min(3600,30*Math.pow(2,Math.min(claimed.attempts,7)));
      await db.update(websiteLeadOutbox).set({
        status:"retry",nextAttemptAt:new Date(Date.now()+seconds*1000),
        lastError:(errorMessage||"delivery_failed").slice(0,200),updatedAt:new Date()
      }).where(eq(websiteLeadOutbox.id,item.id));
    }
  } catch(e){
    console.error("Network outbox delivery error:",e instanceof Error?e.message:"unknown");
  } finally { running=false; }
}
export function startNetworkLeadWorker() {
  if(started)return;
  started=true;
  void deliverPendingNetworkLeads();
  const handle=setInterval(()=>void deliverPendingNetworkLeads(),60000);
  handle.unref();
}
