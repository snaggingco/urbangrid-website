import { z } from "zod";
import { attributionKeys, type LeadAttribution } from "../leads";
import type { SiteIdentity } from "./country";

const clip = (value: unknown, max = 255) => typeof value === "string" ? value.trim().slice(0, max) : "";
export function campaignPage(raw: unknown) {
  try {
    const url = new URL(clip(raw, 2000));
    const params = new URLSearchParams();
    for (const key of attributionKeys) {
      const value = url.searchParams.get(key);
      if (value) params.set(key, value.slice(0, 255));
    }
    return (url.pathname || "/") + (params.size ? "?" + params.toString() : "");
  } catch { return "/"; }
}

export const leadEnvelopeSchema = z.object({
  eventId: z.string().min(1).max(200), eventType: z.literal("lead.created"), schemaVersion: z.literal(1),
  payload: z.object({
    countryCode: z.enum(["AE", "SA", "GB"]), sourceDomain: z.string().regex(/^[a-z0-9.-]+\.[a-z]{2,}$/),
    sourcePage: z.string().max(2000), attribution: z.record(z.unknown()), context: z.record(z.unknown()),
    lead: z.object({
      id: z.string().min(1), name: z.string().min(1).max(255), email: z.string().email(),
      phone: z.string().nullable(), category: z.enum(["residential", "consultancy", "technical"]),
      service: z.string().max(160), message: z.string().max(10000),
    }),
  }),
});
export type LeadEnvelope = z.infer<typeof leadEnvelopeSchema>;
export interface WebsiteLead {
  id: number; name: string; email: string; phone: string | null; message: string;
  enquiryType: string | null; leadSource: string | null; attribution: LeadAttribution | null;
}

export function createLeadEnvelope(lead: WebsiteLead, identity: SiteIdentity) {
  const first = lead.attribution?.firstTouch, last = lead.attribution?.lastTouch;
  const attribution: Record<string, unknown> = { firstTouch: first || undefined, lastTouch: last || undefined };
  for (const key of attributionKeys) {
    const value = clip(last?.[key] || first?.[key], 500);
    if (value) attribution[key] = value;
  }
  const service = clip(lead.enquiryType, 160) || "General Enquiry";
  const source = clip(lead.leadSource, 100) || "contact";
  const category = ["sample_report", "sample-report-download"].includes(source) ? "residential"
    : /reserve|due diligence|consultancy|condition|allocation|reinstatement|asset|completion/i.test(service) ? "consultancy"
    : /structural|thermograph|acoustic|noise|dilapidation/i.test(service) ? "technical" : "residential";
  return {
    eventId: `${identity.clientCode}.lead.created.${lead.id}`, eventType: "lead.created" as const, schemaVersion: 1 as const,
    payload: {
      countryCode: identity.countryCode, sourceDomain: identity.sourceDomain,
      sourcePage: campaignPage(last?.landingPage || first?.landingPage), attribution,
      context: { channel: source, firstLandingPage: campaignPage(first?.landingPage), referrer: clip(last?.referrer, 500) },
      lead: { id: String(lead.id), name: lead.name, email: lead.email, phone: lead.phone, category,
        service, message: lead.message },
    },
  };
}
