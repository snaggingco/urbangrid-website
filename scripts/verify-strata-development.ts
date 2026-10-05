import assert from "node:assert/strict";
import crypto from "node:crypto";
import { writeFile } from "node:fs/promises";
import { count, eq } from "drizzle-orm";
import { db, pool } from "../server/db";
import { inspectionBookings as bookings, operationsDeliveryOutbox as outbox,
  operationsLifecycle as lifecycle, inspectionPayments as payments, operationsIntegrationChecks } from "../shared/schema";
import { createOperationsTestRecord, cleanupOperationsTestRecord, developmentTestsAvailable } from "../server/operationsTestRecords";
import { runOperationsDeliveryCycle } from "../server/operationsIntegration";
import { sendOperationsEvent, extractReceiverIdentifiers } from "../server/operationsTransport";
import { reconcileBooking, LifecycleError } from "../server/operationsLifecycle";

// Explicit one-off verification, never an automatic test/build/startup step.
// Does not import notification services, server startup or payment providers.
const creation = "https://ewyxbbfktyhmmwocvmqs.supabase.co/functions/v1/urbangrid-integration";
const status = "https://ewyxbbfktyhmmwocvmqs.supabase.co/functions/v1/urbangrid-status";
const result: Record<string, unknown> = {};
const shape = (v: unknown, depth = 0): unknown => depth > 5 ? "truncated" :
  v === null ? "null" : Array.isArray(v) ? ["array", v.length] :
  typeof v === "object" ? Object.fromEntries(Object.entries(v as Record<string, unknown>)
    .map(([k, val]) => [k, shape(val, depth + 1)])) : typeof v;
try {
  assert.equal(process.env.NODE_ENV, "development");
  assert(process.argv.includes("--confirm-development-write"), "Explicit Development-write flag required");
  assert(developmentTestsAvailable());
  assert.equal(process.env.URBANGRID_OPERATIONS_INTEGRATION_URL, creation);
  assert.equal(process.env.URBANGRID_OPERATIONS_STATUS_URL, status);
  const key = process.env.URBANGRID_NETWORK_INTEGRATION_KEY;
  assert(key, "Private integration key missing");
  const existing = await db.select().from(outbox);
  // Keep the ordinary worker stopped during this script. Refuse any other event
  // so the test can never dispatch an unrelated customer booking.
  assert(existing.length === 0 || (existing.length === 1 && existing[0].isIntegrationTest),
    "Unrelated outbox events prevent isolated verification");
  const fixture = existing[0] ? { created: false, eventId: existing[0].eventId, bookingId: existing[0].bookingId } :
    await createOperationsTestRecord();
  result.eventId = fixture.eventId;
  result.bookingId = fixture.bookingId;
  let [row] = await db.select().from(outbox).where(eq(outbox.eventId, fixture.eventId));
  result.bookingReference = row.payload.data.booking.bookingReference;
  assert(row.isIntegrationTest && row.environment === "development");
  if (row.status !== "delivered") {
    await db.update(outbox).set({ nextAttemptAt: new Date() }).where(eq(outbox.eventId, row.eventId));
    await runOperationsDeliveryCycle({ batchSize: 1 });
    [row] = await db.select().from(outbox).where(eq(outbox.eventId, fixture.eventId));
  }
  result.creationHttpStatus = row.lastHttpStatus;
  result.creationDeliveryStatus = row.status;
  result.identifiers = row.receiverIdentifiers;
  assert.equal(row.status, "delivered", "Creation delivery failed");
  assert(row.receiverIdentifiers?.orderId && row.receiverIdentifiers.jobId,
    "Actual acknowledgment missing order/job mappings");
  const [booking] = await db.select().from(bookings).where(eq(bookings.id, row.bookingId));
  assert.deepEqual(booking.strataIdentifiers, row.receiverIdentifiers);
  const transport: typeof fetch = async (url, options) => {
    assert.equal(new URL(String(url)).origin + new URL(String(url)).pathname, status);
    const response = await fetch(url, options);
    result.statusHttpStatus = response.status;
    const body = await response.clone().json().catch(() => null);
    // Debug evidence contains types/allowlisted IDs only, never response bodies.
    result.statusResponseShape = shape(body);
    result.statusIdentifiers = extractReceiverIdentifiers(body);
    if (body && typeof body === "object") {
      const safeId = (v: unknown) => typeof v === "string" && v !== key &&
        /^[A-Za-z0-9_.:-]{1,128}$/.test(v) ? v : null;
      result.actualStatusIdentity = { bookingId: safeId(body.bookingId),
        sourceBookingId: safeId(body.order?.source_booking_id) };
      result.actualStatusMappings = Object.fromEntries(["orderId", "jobId", "projectId", "reportId"]
        .map(k => [k, safeId(body.mappings?.[k])]));
      if (typeof body.lifecycleStatus === "string" && body.lifecycleStatus !== key &&
          /^[a-z_]{1,40}$/.test(body.lifecycleStatus)) result.remoteLifecycleStatus = body.lifecycleStatus;
    }
    if (body && typeof body === "object" && ["booked", "scheduled", "inspection_started",
      "inspection_completed", "qa_approved", "report_released"].includes(body.status)) {
      result.remoteLifecycleStatus = body.status;
    }
    return response;
  };
  let statusFailure: unknown;
  try {
    result.reconciliation = await reconcileBooking(row.bookingId, transport);
    const [stored] = await db.select().from(lifecycle).where(eq(lifecycle.bookingId, row.bookingId));
    result.storedLifecycleStatus = stored.status;
    result.storedIdentifiers = stored.receiverIdentifiers;
  } catch (error) {
    statusFailure = error;
    result.statusFailure = error instanceof LifecycleError ? error.code : "STATUS_CONTRACT_INVALID";
    if (error && typeof error === "object" && "issues" in error) {
      result.statusValidationIssues = (error as { issues: { path: string[]; code: string }[] }).issues
        .map(issue => ({ path: issue.path, code: issue.code }));
    } else if (error instanceof Error &&
        ["STATUS_IDENTITY_OR_MAPPING_MISMATCH", "STATUS_IDENTIFIERS_INVALID", "STATUS_CLOCK_INVALID"].includes(error.message)) {
      result.statusFailure = error.message;
    }
  }
  if (statusFailure) throw statusFailure;
  const duplicate = await sendOperationsEvent(creation, key, row.payload, async (url, options) => {
    const response = await fetch(url, options);
    const body = await response.clone().json().catch(() => null);
    result.duplicateResponseShape = shape(body);
    const candidates: Record<string, string> = {};
    const visit = (value: unknown, path = "", depth = 0) => {
      if (depth > 5 || !value || typeof value !== "object" || Array.isArray(value)) return;
      for (const [name, item] of Object.entries(value)) {
        const next = path ? `${path}.${name}` : name;
        if (typeof item === "string" && item !== key &&
            /^(?:id|order_?id|job_?id|project_?id|report_?id|order|job|project|report)$/i.test(name) &&
            /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(item)) candidates[next] = item;
        else visit(item, next, depth + 1);
      }
    };
    visit(body);
    result.duplicateReturnedIds = candidates;
    // Retain only an explicit boolean acknowledgment, not arbitrary receiver text.
    if (body && typeof body === "object") {
      for (const name of ["duplicate", "deduplicated", "idempotent"]) {
        if (typeof body[name] === "boolean") result[name] = body[name];
      }
    }
    return response;
  });
  result.duplicateHttpStatus = duplicate.httpStatus;
  result.duplicateIdentifiers = duplicate.receiverIdentifiers;
  assert(duplicate.ok, "Duplicate delivery failed");
  assert.equal(result.duplicate, true, "Receiver did not acknowledge durable deduplication");
  await reconcileBooking(row.bookingId, transport);
  const [afterDuplicate] = await db.select().from(lifecycle).where(eq(lifecycle.bookingId, row.bookingId));
  assert.deepEqual(afterDuplicate.receiverIdentifiers, result.storedIdentifiers,
    "Duplicate delivery changed Strata order/job/project mappings");
  result.duplicateIdentifiers = afterDuplicate.receiverIdentifiers;
  result.duplicateMappingCheck = "unchanged";
  const [persistedBooking] = await db.select().from(bookings).where(eq(bookings.id, row.bookingId));
  assert.deepEqual(persistedBooking.strataIdentifiers, afterDuplicate.receiverIdentifiers);
  assert((result.storedIdentifiers as { projectId?: string })?.projectId,
    "Actual receiver responses missing required project mapping");
  const [ledger] = await db.select({ n: count() }).from(payments).where(eq(payments.bookingId, row.bookingId));
  assert.equal(ledger.n, 0);
  result.websiteCleanup = await cleanupOperationsTestRecord(row.eventId);
  const evidence = {
    creationEndpoint: creation, statusEndpoint: status,
    keyFingerprint: crypto.createHash("sha256").update(key).digest("hex"),
    creationHttpStatus: row.lastHttpStatus!, statusHttpStatus: Number(result.statusHttpStatus),
    duplicateHttpStatus: duplicate.httpStatus!, identifiers: afterDuplicate.receiverIdentifiers!,
    duplicateConfirmed: true,
  };
  await db.insert(operationsIntegrationChecks).values({ environment: "development", evidence })
    .onConflictDoUpdate({ target: operationsIntegrationChecks.environment, set: { evidence, checkedAt: new Date() } });
  result.passed = true;
} catch (error) {
  result.passed = false;
  result.failure = error instanceof LifecycleError ? error.code :
    error instanceof assert.AssertionError ? error.message.split("\n")[0] : "VERIFICATION_FAILED";
  // Leave a failed fixture quarantined for diagnosis; never retry with new IDs.
  process.exitCode = 1;
} finally {
  await writeFile("/tmp/uae-real-integration-result.json", JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result));
  await pool.end();
}