import assert from "node:assert/strict";
import crypto from "node:crypto";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { count, eq } from "drizzle-orm";
import { db, pool } from "../server/db";
import { inspectionBookings as bookings, contactSubmissions as leads,
  operationsDeliveryOutbox as outbox, operationsLifecycle as lifecycle,
  operationsLifecycleEvents as receipts, inspectionPayments, bookingAudit,
  leadStageHistory, operationsIntegrationChecks } from "../shared/schema";
import { createInspectionBooking } from "../server/bookingService";
import { bookingInputSchema } from "../shared/booking";
import { runOperationsDeliveryCycle } from "../server/operationsIntegration";
import { runReconciliationCycle } from "../server/operationsLifecycle";

assert.equal(process.env.NODE_ENV, "development", "Development only");
const mode = process.argv[2];
const eventId = process.argv[3];
const expectedHash = process.argv[4];
const ids = { orderId: "ORDER-RESTART", jobId: "JOB-RESTART", projectId: "PROJECT-RESTART" };
const key = crypto.randomBytes(48).toString("hex");
const hash = (value: unknown) => crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");

// Children import only services, never server/index: no email, analytics, Stripe
// startup, real HTTP transport or ordinary background worker can run.
if (mode) {
  try {
    const [row] = await db.select().from(outbox).where(eq(outbox.eventId, eventId));
    assert(row);
    assert.equal(row.environment, "development");
    assert.equal(row.payload.data.booking.recordType, "integration_test");
    assert.equal(hash(row.payload), expectedHash);
    assert.equal((await db.select({ n: count() }).from(outbox))[0].n, 1);
    process.env.URBANGRID_NETWORK_INTEGRATION_KEY = key;
    process.env.URBANGRID_OPERATIONS_STATUS_URL = "https://status.example.invalid/booking";
    let requests = 0;
    if (mode.startsWith("delivery")) {
      await runOperationsDeliveryCycle({
        config: { endpoint: "https://delivery.example.invalid/event", key },
        send: async (_endpoint, _key, payload) => {
          requests++;
          assert.equal(hash(payload), expectedHash);
          assert.equal(payload.eventId, eventId);
          if (mode === "delivery-crash") process.exit(73); // Receipt before local acknowledgment.
          return { ok: true, httpStatus: 200, errorCode: null,
            receiverIdentifiers: ids, duplicate: true };
        },
      });
    } else {
      globalThis.fetch = async (url) => {
        assert(String(url).startsWith("https://status.example.invalid/booking?"));
        requests++;
        if (mode === "status-crash") process.exit(73);
        if (mode === "status-fail") return new Response(null, { status: 503 });
        return Response.json({
          schemaVersion: 1, source: "strata-surveyor", environment: "development", country: "AE",
          bookingId: row.bookingId, bookingReference: row.payload.data.booking.bookingReference,
          eventId: `strata.restart.${row.bookingId}.1`, version: 1,
          occurredAt: "2026-01-01T00:00:00Z", status: "scheduled", identifiers: ids,
        });
      };
      await runReconciliationCycle();
    }
    assert.equal(requests, mode.endsWith("skip") ? 0 : 1);
  } finally { await pool.end(); }
} else {
  const tables = [leads, bookings, inspectionPayments, bookingAudit, leadStageHistory,
    outbox, lifecycle, receipts];
  const counts = async () => Promise.all(tables.map(async table =>
    (await db.select({ n: count() }).from(table))[0].n));
  const before = await counts();
  const evidence = await db.select().from(operationsIntegrationChecks);
  assert.equal(before[5], 0, "Refuse restart tests with unrelated queued/delivered events");
  let leadId: number | undefined;
  let fixtureEvent: string | undefined;
  const child = async (step: string, digest: string, exit = 0) => {
    const process = spawn(globalThis.process.execPath,
      ["--import", "tsx", fileURLToPath(import.meta.url), step, fixtureEvent!, digest],
      { env: { ...globalThis.process.env, NODE_ENV: "development" }, stdio: ["ignore", "pipe", "pipe"] });
    let output = "";
    process.stdout.on("data", chunk => { output += chunk; });
    process.stderr.on("data", chunk => { output += chunk; });
    const code = await new Promise<number | null>((resolve, reject) => {
      process.once("error", reject);
      process.once("close", resolve);
    });
    // Do not print raw child errors, which may contain database connection details.
    assert.equal(code, exit, `Restart child ${step} failed; output SHA256 ${hash(output)}`);
  };
  try {
    const result = await createInspectionBooking(bookingInputSchema.parse({
      submissionKey: crypto.randomUUID(), name: "Synthetic Development restart test",
      email: "restart@example.invalid", phone: "+971000000000",
      service: "new-build-snagging", propertyType: "Apartment", areaSqft: 1000,
      project: "SYNTHETIC ONLY", location: "NO DISPATCH", emirate: "Dubai",
      inspectionDate: "2099-01-03", timeWindow: "Morning (9am–12pm)",
    }));
    leadId = result.leadId;
    const [original] = await db.select().from(outbox).where(eq(outbox.bookingId, result.booking.id));
    assert(original);
    fixtureEvent = original.eventId;
    const payload = { ...original.payload, data: { booking: {
      ...original.payload.data.booking, recordType: "integration_test" as const,
    } } };
    await db.transaction(async tx => {
      await tx.update(leads).set({ leadSource: "integration_test", enquiryType: "integration_test" })
        .where(eq(leads.id, leadId!));
      await tx.update(bookings).set({ isIntegrationTest: true }).where(eq(bookings.id, result.booking.id));
      await tx.update(outbox).set({ isIntegrationTest: true, payload }).where(eq(outbox.eventId, fixtureEvent!));
    });
    const row = async () => (await db.select().from(outbox).where(eq(outbox.eventId, fixtureEvent!)))[0];
    const digest = hash((await row()).payload);
    await child("delivery-crash", digest, 73);
    assert.equal((await row()).status, "processing");
    assert((await row()).leaseToken);
    await child("delivery-skip", digest);
    // Simulate passage of lease time on this one synthetic row, never alter retry policy.
    await db.update(outbox).set({ leaseExpiresAt: new Date(0) }).where(eq(outbox.eventId, fixtureEvent));
    await child("delivery-recover", digest);
    assert.equal((await row()).status, "delivered");
    assert.equal((await row()).attempts, 2);
    assert.equal(hash((await row()).payload), digest);
    assert.deepEqual((await row()).receiverIdentifiers, ids);
    console.log("PASS process death after delivery: persisted lease, no early claim, safe replay with frozen event and mappings");

    // Only this labeled fixture enters the normal polling selector for this test.
    // The booking/lead remain quarantined from reporting; all fetches are stubbed.
    await db.update(outbox).set({ isIntegrationTest: false }).where(eq(outbox.eventId, fixtureEvent));
    await child("status-crash", digest, 73);
    assert((await row()).leaseToken);
    await child("status-skip", digest);
    await db.update(outbox).set({ leaseExpiresAt: new Date(0), nextReconcileAt: new Date(0) })
      .where(eq(outbox.eventId, fixtureEvent));
    await child("status-fail", digest);
    assert.equal((await row()).reconcileErrorCode, "HTTP_503");
    assert.equal((await row()).leaseToken, null);
    assert((await row()).nextReconcileAt.getTime() > Date.now() + 290_000);
    await child("status-skip", digest);
    console.log("PASS restarted status worker retains visible HTTP_503 and durable five-minute retry schedule");
    await db.update(outbox).set({ nextReconcileAt: new Date(0) }).where(eq(outbox.eventId, fixtureEvent));
    await child("status-recover", digest);
    assert.equal((await row()).reconcileErrorCode, null);
    const [progress] = await db.select().from(lifecycle).where(eq(lifecycle.bookingId, result.booking.id));
    assert.equal(progress.status, "scheduled");
    await db.update(outbox).set({ nextReconcileAt: new Date(0) }).where(eq(outbox.eventId, fixtureEvent));
    await child("status-recover", digest);
    assert.equal((await db.select({ n: count() }).from(receipts).where(eq(receipts.bookingId, result.booking.id)))[0].n, 1);
    console.log("PASS new status process recovers mappings/status; repeated lifecycle receipt is a durable no-op");
  } finally {
    if (leadId !== undefined) await db.transaction(async tx => {
      const [fixture] = await tx.select().from(leads).where(eq(leads.id, leadId!)).for("update");
      assert.equal(fixture.email, "restart@example.invalid");
      assert.equal(fixture.name, "Synthetic Development restart test");
      const [booking] = await tx.select().from(bookings).where(eq(bookings.leadId, leadId!));
      if (booking) {
        assert.equal((await tx.select({ n: count() }).from(inspectionPayments)
          .where(eq(inspectionPayments.bookingId, booking.id)))[0].n, 0);
        await tx.delete(receipts).where(eq(receipts.bookingId, booking.id));
        await tx.delete(lifecycle).where(eq(lifecycle.bookingId, booking.id));
        await tx.delete(outbox).where(eq(outbox.bookingId, booking.id));
        await tx.delete(bookingAudit).where(eq(bookingAudit.bookingId, booking.id));
        await tx.delete(bookings).where(eq(bookings.id, booking.id));
      }
      await tx.delete(leadStageHistory).where(eq(leadStageHistory.leadId, leadId!));
      await tx.delete(leads).where(eq(leads.id, leadId!));
    });
    assert.deepEqual(await counts(), before, "Only the synthetic fixture may be cleaned up");
    assert.deepEqual(await db.select().from(operationsIntegrationChecks), evidence,
      "Retain the passed real Development receiver evidence");
    await pool.end();
  }
  console.log("PASS restart fixtures removed; real verification unchanged; no external HTTP/messages/payments/conversions");
}