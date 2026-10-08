import crypto from "node:crypto";
import { and, asc, eq, lte, or, sql } from "drizzle-orm";
import { db } from "./db";
import { websiteLeadOutbox, type contactSubmissions } from "@shared/schema";
import { operationsEndpoint, validOperationsKey } from "./operationsContract";

type Lead = typeof contactSubmissions.$inferSelect;
type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

const keys = ["utm_source","utm_medium","utm_campaign","utm_term","utm_content","utm_id",
              "gclid","gbraid","wbraid"] as const;
const clip = (s: unknown,n=255) => typeof s==="string" ? s.trim().slice(0,n) : "";
const category = (service:string,source:string)=>{
  if(source === "sample_report" || source === "sample-report-download")return "residential";
  if(/reserve|due diligence|consultancy|condition|allocation|reinstatement|asset|completion/i.test(service))return "consultancy";
  if(/structural|thermograph|acoustic|noise|dilapidation/i.test(service))return "technical";
  return "residential";
};
function canonicalPage(raw:unknown) {
  try {
    const url=new URL(clip(raw,2000));
    const params=new URLSearchParams();
    for(const key of keys){
      const value=url.searchParams.get(key);
      if(value)params.set(key,value.slice(0,255));
    }
    return (url.pathname||"/") + (params.size?"?"+params.toString():"");
  }catch{return "/";}
}
function countrySettings() {
  // The reference UAE site can identify itself via its platform-bound custom
  // domain. Cloned sites do not inherit an unconditional UAE fallback.
  const boundDomains=(process.env.REPLIT_DOMAINS || "").split(",")
    .map(host=>host.trim().toLowerCase().replace(/^www\./,""));
  const isUaeReference=boundDomains.includes("urbangrid.ae");
  const clientCode=process.env.URBANGRID_NETWORK_CLIENT_CODE || "urbangrid-website";
  const countryCode=process.env.URBANGRID_COUNTRY_CODE || (isUaeReference?"AE":"");
  const sourceDomain=process.env.URBANGRID_SITE_DOMAIN || (isUaeReference?"urbangrid.ae":"");
  return {clientCode,countryCode:countryCode.toUpperCase(),sourceDomain:sourceDomain.toLowerCase().replace(/^www\./,"")};
}
function eventForLead(lead:Lead) {
  const settings=countrySettings();
  const raw=lead.attribution || null;
  const first=raw?.firstTouch, last=raw?.lastTouch;
  const attribution:Record<string,unknown>={
    firstTouch:first || undefined,lastTouch:last || undefined
  };
  for(const key of keys) {
    const value=clip(last?.[key] || first?.[key],500);
    if(value)attribution[key]=value;
  }
  const service=clip(lead.enquiryType,160) || "General Enquiry";
  const source=clip(lead.leadSource,100) || "contact";
  return {
    eventId:settings.clientCode+".lead.created."+lead.id,
    eventType:"lead.created",schemaVersion:1,
    payload:{
      countryCode:settings.countryCode,sourceDomain:settings.sourceDomain,
      sourcePage:canonicalPage(last?.landingPage || first?.landingPage),
      attribution,
      context:{channel:source,firstLandingPage:canonicalPage(first?.landingPage),referrer:clip(last?.referrer,500)},
      lead:{
        id:String(lead.id),name:lead.name,email:lead.email,phone:lead.phone,
        category:category(service,source),service,message:lead.message,
      }
    }
  };
}
export async function queueNetworkLead(lead:Lead,tx:Tx) {
  if(["integration_test","career","career_application"].includes(lead.leadSource||"")) return;
  const event=eventForLead(lead);
  await tx.insert(websiteLeadOutbox).values({
    contactId:lead.id,eventId:event.eventId,clientCode:countrySettings().clientCode,
    envelope:event
  }).onConflictDoNothing({target:websiteLeadOutbox.eventId});
}

const POLL_MS=30_000;
const LEASE_MS=120_000;
let running=false,started=false;
async function claimNext() {
  const now=new Date();
  return db.transaction(async tx=>{
    const [row]=await tx.select().from(websiteLeadOutbox)
      .where(or(
        and(or(eq(websiteLeadOutbox.status,"pending"),eq(websiteLeadOutbox.status,"failed")),
          lte(websiteLeadOutbox.nextAttemptAt,now)),
        and(eq(websiteLeadOutbox.status,"sending"),lte(websiteLeadOutbox.updatedAt,new Date(now.getTime()-LEASE_MS)))
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
  const conf=countrySettings();
  const raw=process.env.URBANGRID_NETWORK_INTEGRATION_URL ||
    process.env.URBANGRID_OPERATIONS_INTEGRATION_URL;
  const endpoint=operationsEndpoint(raw);
  const key=process.env.URBANGRID_NETWORK_INTEGRATION_KEY;
  if(!endpoint || !validOperationsKey(key) ||
     !/^[A-Z]{2}$/.test(conf.countryCode) ||
     !/^[a-z0-9.-]+\.[a-z]{2,}$/.test(conf.sourceDomain))return;
  // Never silently send production leads to development credentials.
  if(process.env.NODE_ENV==="production" &&
     new URL(endpoint).hostname!=="nzbewemalujbhnjbrpcs.supabase.co")return;
  running=true;
  try{
    for(let i=0;i<15;i++){
      const task=await claimNext();
      if(!task)break;
      const {record,leaseId}=task;
      let ok=false,reason="network_failed";
      try{
        const response=await fetch(endpoint,{
          method:"POST",redirect:"error",signal:AbortSignal.timeout(10_000),
          headers:{"content-type":"application/json",
            "x-urbangrid-key":key,
            "x-urbangrid-client":record.clientCode,
            "Idempotency-Key":record.eventId},
          body:JSON.stringify(record.envelope)
        });
        const result=await response.json().catch(()=>null) as {accepted?:boolean}|null;
        ok=response.ok && result?.accepted===true;
        reason=ok ? "" : "HTTP_"+response.status;
      }catch{/* Don't log secrets or customer data. */}
      const now=new Date();
      const delay=Math.min(3600_000,30_000*2**Math.min(record.attempts,7));
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
  const timer=setInterval(()=>void flushNetworkLeadOutbox(),POLL_MS);
  timer.unref();
}
