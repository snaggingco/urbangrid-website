import { z } from "zod";

export const attributionKeys = [
  "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
  "utm_id", "gclid", "gbraid", "wbraid",
] as const;

export const touchSchema = z.object({
  utm_source: z.string().max(500).optional(),
  utm_medium: z.string().max(500).optional(),
  utm_campaign: z.string().max(500).optional(),
  utm_term: z.string().max(500).optional(),
  utm_content: z.string().max(500).optional(),
  utm_id: z.string().max(500).optional(),
  gclid: z.string().max(500).optional(),
  gbraid: z.string().max(500).optional(),
  wbraid: z.string().max(500).optional(),
  landingPage: z.string().max(2000),
  referrer: z.string().max(2000).optional(),
  capturedAt: z.string().datetime(),
});

export const attributionSchema = z.object({
  firstTouch: touchSchema,
  lastTouch: touchSchema,
});
export type AttributionTouch = z.infer<typeof touchSchema>;
export type LeadAttribution = z.infer<typeof attributionSchema>;

export const leadStages = ["new", "qualified", "quoted", "booked", "completed", "lost"] as const;
const money = z.number().int().min(0).max(2147483647).nullable().optional();
export const calendarDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value =>
  !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value,
  "Enter a valid calendar date");
export const leadUpdateSchema = z.object({
  stage: z.enum(leadStages).optional(),
  revenueAmountMinor: money,
  quoteValueMinor: money,
  quoteCurrency: z.string().regex(/^[A-Z]{3}$/).optional(),
  inspectionDate: calendarDate.nullable().optional(),
  bookingReference: z.string().trim().max(255).nullable().optional(),
  lostReason: z.string().trim().max(1000).nullable().optional(),
  note: z.string().trim().max(1000).nullable().optional(),
}).strict().refine(value => Object.keys(value).some(key => key !== "note"), "No lead fields to update");
export type LeadUpdate = z.infer<typeof leadUpdateSchema>;

export const leadFiltersSchema = z.object({
  stage: z.enum(leadStages).optional(),
  source: z.string().trim().min(1).max(100).optional(),
  from: calendarDate.optional(),
  to: calendarDate.optional(),
  includeNonSales: z.enum(["true", "false"]).default("false").transform(value => value === "true"),
  offset: z.coerce.number().int().min(0).max(1000000).default(0),
}).refine(value => !value.from || !value.to || value.from <= value.to, "From date must not follow to date");
export type LeadFilters = z.infer<typeof leadFiltersSchema>;
export const nonSalesSources = ["career", "career_application", "broker_referral", "sample_report", "integration_test"] as const;