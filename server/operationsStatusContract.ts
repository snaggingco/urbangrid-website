import crypto from "node:crypto";
import { z } from "zod";
import { lifecycleSchema, normalizeLifecycleStatus } from "@shared/operationsLifecycle";
import type { OperationsEnvironment } from "@shared/operationsIntegration";
import { extractReceiverIdentifiers } from "./operationsTransport";

// Actual Strata status-function response. Money fields are deliberately ignored.
const actualStatus = z.object({
  bookingId: z.string(),
  lifecycleStatus: z.enum(["booked", "scheduled", "inspection_started",
    "inspection_completed", "qa_approved", "report_released", "report_published"]),
  mappings: z.object({
    orderId: z.string(), jobId: z.string(), projectId: z.string(),
    reportId: z.string().nullable().optional(),
  }),
  order: z.object({ id: z.string(), source_booking_id: z.string(), updated_at: z.string().datetime({ offset: true }) }),
  job: z.object({ id: z.string(), project_id: z.string(), updated_at: z.string().datetime({ offset: true }) }),
  assignment: z.object({ updated_at: z.string().datetime({ offset: true }).optional() }).nullable().optional(),
  report: z.object({ updated_at: z.string().datetime({ offset: true }).optional() }).nullable().optional(),
});

export function normalizeStatusResponse(raw: unknown,
  identity: { bookingId: number; bookingReference: string; eventId: string },
  environment: OperationsEnvironment) {
  // Retain the established versioned snapshot contract for callbacks/receivers.
  if (raw && typeof raw === "object" && "schemaVersion" in raw) return lifecycleSchema.parse(raw);
  const response = actualStatus.parse(raw);
  const matchesIdentity = (id: string) => [String(identity.bookingId),
    `ug-ae-booking-${identity.bookingId}`, identity.bookingReference].includes(id);
  if (!matchesIdentity(response.bookingId) || !matchesIdentity(response.order.source_booking_id) ||
      response.order.id !== response.mappings.orderId || response.job.id !== response.mappings.jobId ||
      response.job.project_id !== response.mappings.projectId) throw new Error("STATUS_IDENTITY_OR_MAPPING_MISMATCH");
  const identifiers = extractReceiverIdentifiers({ mappings: response.mappings });
  if (!identifiers?.orderId || !identifiers.jobId || !identifiers.projectId ||
      (response.mappings.reportId && identifiers.reportId !== response.mappings.reportId)) {
    throw new Error("STATUS_IDENTIFIERS_INVALID");
  }
  // Receiver-owned record clocks provide durable ordering, not synchronizedAt,
  // which changes on every GET. Preserve PostgreSQL microsecond precision.
  const clocks = [response.order.updated_at, response.job.updated_at,
    response.assignment?.updated_at, response.report?.updated_at].filter((v): v is string => Boolean(v));
  const microseconds = (iso: string) => Date.parse(iso) * 1000 +
    Number((iso.match(/\.(\d+)/)?.[1] || "").padEnd(6, "0").slice(3, 6));
  clocks.sort((a, b) => microseconds(a) - microseconds(b));
  const occurredAt = clocks[clocks.length - 1];
  const version = microseconds(occurredAt);
  if (!Number.isSafeInteger(version) || version < 1) throw new Error("STATUS_CLOCK_INVALID");
  const status = normalizeLifecycleStatus(response.lifecycleStatus);
  const digest = crypto.createHash("sha256").update(JSON.stringify({ version, status, identifiers })).digest("hex");
  return lifecycleSchema.parse({ schemaVersion: 1, source: "strata-surveyor", country: "AE",
    environment, bookingId: identity.bookingId, bookingReference: identity.bookingReference,
    eventId: `strata.${environment}.${identity.bookingId}.${digest}`, version, occurredAt, status, identifiers });
}