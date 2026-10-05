import { z } from "zod";

export const lifecycleStatuses = [
  "booked", "scheduled", "inspection_started", "inspection_completed",
  "qa_approved", "report_released",
] as const;
export type LifecycleStatus = typeof lifecycleStatuses[number];
export const lifecycleSchema = z.object({
  schemaVersion: z.literal(1),
  source: z.literal("strata-surveyor"),
  environment: z.enum(["development", "production"]),
  country: z.literal("AE"),
  // Monotonic per-booking revision assigned by Strata, not the browser.
  version: z.number().int().min(1),
  eventId: z.string().min(1).max(160).regex(/^[A-Za-z0-9._:-]+$/),
  occurredAt: z.string().datetime({ offset: true }),
  bookingId: z.number().int().positive(),
  bookingReference: z.string().regex(/^UG-(?:\d{4}-[A-F0-9]{12}|TEST-[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12})$/),
  // Preserve the previous wire contract without treating publication as release.
  status: z.enum([...lifecycleStatuses, "report_published"]),
  identifiers: z.object({
    orderId: z.string().min(1).max(128).optional(),
    jobId: z.string().min(1).max(128).optional(),
    projectId: z.string().min(1).max(128).optional(),
    reportId: z.string().min(1).max(128).optional(),
  }).strict().optional(),
}).strict();
export type LifecycleSnapshot = z.infer<typeof lifecycleSchema>;

export function lifecycleRank(status: string) {
  return lifecycleStatuses.indexOf(normalizeLifecycleStatus(status) as LifecycleStatus);
}

export function normalizeLifecycleStatus(status: string) {
  return status === "report_published" ? "qa_approved" : status;
}