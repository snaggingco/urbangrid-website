import assert from "node:assert/strict";
import crypto from "node:crypto";
import express from "express";
import session from "express-session";
import { count, eq } from "drizzle-orm";
import { db, pool } from "../server/db";
import { bookingAudit, contactSubmissions, inspectionBookings, inspectionPayments,
  leadStageHistory, operationsDeliveryOutbox as outbox } from "../shared/schema";
import { bookingInputSchema } from "../shared/booking";
import { createInspectionBooking, manualBookingStatus } from "../server/bookingService";
import { registerBookingRoutes } from "../server/bookingRoutes";
import { operationsEndpoint } from "../server/operationsContract";
import { enqueueOperationsEvent, operationsIntegrationHealth, operationsRetryDelay,
  runOperationsDeliveryCycle } from "../server/operationsIntegration";
import { sendOperationsEvent } from "../server/operationsTransport";
import { extractReceiverIdentifiers } from "../server/operationsTransport";
import { cleanupOperationsTestRecord, createOperationsTestRecord } from "../server/operationsTestRecords";
import { bookingReport } from "../server/bookingReporting";
import { acquisitionReport } from "../server/acquisitionReporting";

assert.equal(process.env.NODE_ENV, "development", "Development rollback-only tests");
let passed = 0;
const pass = (name: string) => { passed++; console.log("PASS", name); };
const key = crypto.randomBytes(48).toString("hex"); // Synthetic test key, never printed or persisted.
const config = { endpoint: "https://operations.example.invalid/api/events", key };
const tables = [contactSubmissions, inspectionBookings, inspectionPayments, bookingAudit, leadStageHistory, outbox];
const counts = async () => Promise.all(tables.map(async t => (await db.select({ n: count() }).from(t))[0].n));
const before = await counts();
const previousKey = process.env.URBANGRID_NETWORK_INTEGRATION_KEY;
const previousUrl = process.env.URBANGRID_OPERATIONS_INTEGRATION_URL;
const rollback = new Error("ROLLBACK_OPERATIONS_TESTS");
const input = () => bookingInputSchema.parse({
  submissionKey: crypto.randomUUID(), name: "Synthetic operations test",
  email: "operations-test@example.invalid", phone: "+971500000000",
  service: "new-build-snagging", propertyType: "Villa", areaSqft: 1234.56,
  project: "Synthetic project", location: "Synthetic community", emirate: "Dubai",
  inspectionDate: "2099-01-03", timeWindow: "Morning",
  attribution: { firstTouch: { utm_source: "google", utm_medium: "cpc", utm_campaign: "synthetic",
    gclid: "synthetic-click", landingPage: "/book-inspection", capturedAt: "2026-10-04T00:00:00Z" },
    lastTouch: { utm_source: "direct", landingPage: "/book-inspection", capturedAt: "2026-10-04T01:00:00Z" } },
});

try {
  for (const invalid of [undefined, "http://example.com/events", "https://key@example.com",
    "https://localhost/events", "https://127.0.0.1/events", "https://[::1]/events",
    "https://api.internal/events", "https://example.com/events?key=x", "https://example.com/#token"]) {
    assert.equal(operationsEndpoint(invalid), null);
  }
  assert.equal(operationsEndpoint(config.endpoint), config.endpoint);
  pass("HTTPS-only configured destination; reject credentials, query secrets, local/IP URLs");
  assert(operationsRetryDelay(1) >= 30_000);
  assert(operationsRetryDelay(1000) <= 3_605_000);
  pass("exponential backoff is bounded and failed events are retained");

  await db.transaction(async tx => {
    const originals = { select: db.select, insert: db.insert, update: db.update, transaction: db.transaction, execute: db.execute };
    db.execute = tx.execute.bind(tx) as typeof db.execute;
    db.select = tx.select.bind(tx) as typeof db.select;
    db.insert = tx.insert.bind(tx) as typeof db.insert;
    db.update = tx.update.bind(tx) as typeof db.update;
    db.transaction = tx.transaction.bind(tx) as typeof db.transaction;
    process.env.URBANGRID_NETWORK_INTEGRATION_KEY = key;
    process.env.URBANGRID_OPERATIONS_INTEGRATION_URL = config.endpoint;
    let server: ReturnType<express.Express["listen"]> | undefined;
    try {
      const form = input();
      const result = await createInspectionBooking(form);
      const [row] = await db.select().from(outbox).where(eq(outbox.bookingId, result.booking.id));
      assert.equal(row.status, "pending");
      assert.equal(row.attempts, 0);
      assert.equal(row.payload.schemaVersion, 1);
      assert.equal(row.payload.type, "booking.created");
      assert.equal(row.payload.data.booking.id, result.booking.id);
      assert.equal(row.payload.data.booking.leadId, result.leadId);
      assert.deepEqual(row.payload.data.booking.attribution, form.attribution);
      assert.equal(row.payload.data.booking.customer.email, form.email);
      assert.equal(row.payload.data.booking.areaSqft, 1234.56);
      assert.equal(row.payload.data.booking.service, form.service);
      assert.equal(row.payload.data.booking.quoteTotalMinor, result.booking.quoteTotalMinor);
      assert.equal(row.payload.data.booking.inspectionDate, form.inspectionDate);
      assert.equal(row.payload.data.booking.status, "booked");
      assert.equal(row.payload.data.booking.paymentStatus, "unpaid");
      assert.equal(row.payload.data.booking.bookingReference, result.booking.bookingReference);
      for (const field of ["bedrooms", "project", "location", "emirate", "timeWindow", "baseMinor", "vatMinor", "currency"]) {
        assert.equal(row.payload.data.booking[field as keyof typeof row.payload.data.booking],
          result.booking[field as keyof typeof result.booking]);
      }
      assert.equal(row.payload.data.booking.propertyType, form.propertyType);
      assert.deepEqual(row.payload.data.booking.customer, { name: form.name, email: form.email, phone: form.phone });
      assert.equal(row.payload.occurredAt, result.booking.createdAt.toISOString());
      assert(!Object.hasOwn(row.payload, "eventType"));
      assert(!Object.hasOwn(row.payload, "payload"));
      assert(!JSON.stringify(row).includes(key));
      pass("confirmed booking queues version-1 persisted customer/property/quote/schedule/attribution snapshot");
      assert.equal((await pool.query("SELECT event_id FROM operations_delivery_outbox WHERE event_id = $1", [row.eventId])).rows.length, 0);
      pass("separate worker connection cannot see or deliver an uncommitted event");

      const repeat = await createInspectionBooking(form);
      assert.equal(repeat.createdBooking, false);
      await enqueueOperationsEvent(row.payload);
      assert.equal((await db.select().from(outbox).where(eq(outbox.bookingId, result.booking.id))).length, 1);
      pass("booking retries produce one stable idempotent event ID");

      const transaction = db.transaction;
      const beforeFailedCommit = await counts();
      const failedCommit = new Error("Synthetic failed commit");
      db.transaction = ((fn: Parameters<typeof db.transaction>[0]) =>
        transaction(async inner => { await fn(inner); throw failedCommit; })) as typeof db.transaction;
      await assert.rejects(createInspectionBooking(input()), error => error === failedCommit);
      db.transaction = transaction;
      assert.deepEqual(await counts(), beforeFailedCommit);
      pass("failed booking transaction stores neither booking nor event; atomic outbox has no post-commit crash gap");

      await manualBookingStatus(result.booking.id, "completed", "Synthetic physical completion", "synthetic-test");
      const [snapshot] = await db.select().from(outbox).where(eq(outbox.eventId, row.eventId));
      assert.deepEqual(snapshot.payload, row.payload);
      pass("creation snapshot remains unchanged by later booking status updates");

      let requests = 0;
      const failure = await sendOperationsEvent(config.endpoint, key, row.payload, (async (url, options) => {
        requests++;
        assert.equal(url, config.endpoint);
        assert.equal(options?.redirect, "error");
        assert(options?.signal);
        assert.equal((options?.headers as Record<string, string>)["x-urbangrid-key"], key);
        assert.equal((options?.headers as Record<string, string>)["Idempotency-Key"], row.eventId);
        assert(!String(options?.body).includes(key));
        return new Response(key, { status: 503 }); // Receiver echo must never reach logs/queue.
      }) as typeof fetch);
      assert.deepEqual(failure, { ok: false, httpStatus: 503, errorCode: "HTTP_503" });
      assert.equal(requests, 1);
      pass("secret is only a private header; redirects disabled, timeout set, response echoes discarded");

      let deliveredId = "";
      await runOperationsDeliveryCycle({ config, batchSize: 1, send: async (_url, _key, event) => {
        deliveredId = event.eventId;
        return failure;
      } });
      const [failed] = await db.select().from(outbox).where(eq(outbox.eventId, row.eventId));
      assert.equal(failed.status, "failed");
      assert.equal(failed.attempts, 1);
      assert(failed.nextAttemptAt.getTime() > Date.now());
      assert.equal(failed.lastErrorCode, "HTTP_503");
      assert(!JSON.stringify(failed).includes(key));
      await db.update(outbox).set({ nextAttemptAt: new Date(0) }).where(eq(outbox.eventId, row.eventId));
      await runOperationsDeliveryCycle({ config, batchSize: 1, send: async (_url, _key, event) => {
        assert.equal(event.eventId, deliveredId);
        await runOperationsDeliveryCycle({ config, batchSize: 1, send: async () => {
          throw new Error("Active lease must not be claimed by another worker");
        } });
        return { ok: true, httpStatus: 201, errorCode: null };
      } });
      const [delivered] = await db.select().from(outbox).where(eq(outbox.eventId, row.eventId));
      assert.equal(delivered.status, "delivered");
      assert.equal(delivered.attempts, 2);
      assert(delivered.deliveredAt);
      assert.equal(delivered.lastFailureCode, "HTTP_503");
      assert.equal(delivered.lastFailureHttpStatus, 503);
      assert(delivered.lastFailureAt);
      pass("outage retries preserve event ID; leases prevent competing delivery; success persists acknowledgment");
      pass("last failure remains available for diagnostics after successful delivery");

      await db.update(outbox).set({ status: "processing", leaseExpiresAt: new Date(0),
        nextAttemptAt: new Date(0), leaseToken: crypto.randomUUID() }).where(eq(outbox.eventId, row.eventId));
      await runOperationsDeliveryCycle({ config, batchSize: 1, send: async () => ({ ok: true, httpStatus: 204, errorCode: null }) });
      assert.equal((await db.select().from(outbox).where(eq(outbox.eventId, row.eventId)))[0].attempts, 3);
      pass("expired process lease recovers after restart without losing the event");

      await db.update(outbox).set({ status: "pending", nextAttemptAt: new Date(0) }).where(eq(outbox.eventId, row.eventId));
      const replacementLease = crypto.randomUUID();
      await runOperationsDeliveryCycle({ config, batchSize: 1, send: async () => {
        await db.update(outbox).set({ leaseToken: replacementLease }).where(eq(outbox.eventId, row.eventId));
        return { ok: true, httpStatus: 200, errorCode: null };
      } });
      assert.equal((await db.select().from(outbox).where(eq(outbox.eventId, row.eventId)))[0].status, "processing");
      pass("stale worker cannot acknowledge a delivery owned by a replacement lease");

      const app = express();
      app.use(express.json());
      app.use(session({ secret: "synthetic-test-session-not-a-real-secret", resave: false, saveUninitialized: false }));
      registerBookingRoutes(app, (req, res, next) => req.get("x-test-admin") === "yes"
        ? next() : res.status(401).json({ message: "Unauthorized" }), { notify: async () => true });
      server = app.listen(0);
      await new Promise<void>(resolve => server!.once("listening", resolve));
      const base = `http://127.0.0.1:${(server.address() as { port: number }).port}`;
      const route = "/api/admin/integrations/operations/status";
      assert.equal((await fetch(base + route)).status, 401);
      const response = await fetch(base + route, { headers: { "x-test-admin": "yes" } });
      assert.equal(response.status, 200);
      assert.equal(response.headers.get("cache-control"), "no-store");
      const health = await response.json();
      assert.equal(health.keyFingerprint, crypto.createHash("sha256").update(key).digest("hex"));
      assert.equal(health.configured, true);
      assert(health.counts.pending >= 1);
      assert(health.lastDelivery);
      assert(health.events.find((event: { eventId: string }) => event.eventId === row.eventId));
      assert(!JSON.stringify(health).includes(key));
      assert(!JSON.stringify(health).includes(form.email));
      pass("admin-only health exposes counts/last status/fingerprint, never secret or customer payload");

      const retryPath = `${route.replace("/status", "")}/events/${encodeURIComponent(row.eventId)}/retry`;
      assert.equal((await fetch(base + retryPath, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" })).status, 401);
      assert.equal((await fetch(base + retryPath, { method: "POST", headers: { "x-test-admin": "yes", "Content-Type": "application/json" }, body: "{}" })).status, 403);
      const bookingConfig = await fetch(base + "/api/bookings/config");
      const csrf = (await bookingConfig.json()).csrfToken;
      const cookie = bookingConfig.headers.get("set-cookie")!.split(";")[0];
      const retry = async (origin = base, token = csrf) => fetch(base + retryPath, {
        method: "POST", headers: { "x-test-admin": "yes", "Content-Type": "application/json",
          Origin: origin, Cookie: cookie, "x-csrf-token": token }, body: "{}",
      });
      assert.equal((await retry("https://untrusted.example.invalid")).status, 403);
      assert.equal((await retry(base, "wrong")).status, 403);
      assert.equal((await retry()).status, 409); // processing is not retryable.
      await db.update(outbox).set({ status: "failed", nextAttemptAt: new Date(Date.now() + 3_600_000) }).where(eq(outbox.eventId, row.eventId));
      const healthFailed = await operationsIntegrationHealth();
      assert(healthFailed.counts.failed >= 1);
      const attemptsBeforeRetry = (await db.select().from(outbox).where(eq(outbox.eventId, row.eventId)))[0].attempts;
      assert.equal((await retry()).status, 200);
      const [requeued] = await db.select().from(outbox).where(eq(outbox.eventId, row.eventId));
      assert.equal(requeued.status, "pending");
      assert.equal(requeued.attempts, attemptsBeforeRetry);
      assert.equal(requeued.lastFailureCode, "HTTP_503");
      assert(requeued.nextAttemptAt.getTime() <= Date.now());
      assert.equal((await retry()).status, 409);
      pass("retry action requires admin, same-origin and valid CSRF; only failed events requeue with stable IDs and retained errors");

      process.env.URBANGRID_OPERATIONS_INTEGRATION_URL = "https://ewyxbbfktyhmmwocvmqs.supabase.co/functions/v1/urbangrid-integration";
      const testPath = "/api/admin/integrations/operations/test";
      const testAction = (path: string, body: unknown = {}) => fetch(base + path, {
        method: "POST", headers: { "x-test-admin": "yes", "Content-Type": "application/json",
          Origin: base, Cookie: cookie, "x-csrf-token": csrf }, body: JSON.stringify(body),
      });
      const preSyntheticCounts = await counts();
      const summaryBeforeTest = (await bookingReport({})).summary;
      const acquisitionBeforeTest = (await acquisitionReport({})).totals;
      assert.equal((await fetch(base + testPath, { method: "POST" })).status, 401);
      assert.equal((await fetch(base + testPath, { method: "POST", headers: { "x-test-admin": "yes" } })).status, 403);
      assert.equal((await testAction(testPath, { email: "not-permitted@example.invalid" })).status, 400);
      const testResponse = await testAction(testPath);
      assert.equal(testResponse.status, 202);
      const synthetic = await testResponse.json();
      assert.equal(synthetic.created, true);
      assert.equal((await (await testAction(testPath)).json()).created, false);
      const [testBooking] = await db.select().from(inspectionBookings).where(eq(inspectionBookings.id, synthetic.bookingId));
      const [testLead] = await db.select().from(contactSubmissions).where(eq(contactSubmissions.id, testBooking.leadId));
      const [testEvent] = await db.select().from(outbox).where(eq(outbox.eventId, synthetic.eventId));
      assert.equal(testBooking.isIntegrationTest, true);
      assert.equal(testBooking.confirmationSentAt, null);
      assert.equal(testBooking.confirmationClaimedAt, null);
      assert.equal(testLead.leadSource, "integration_test");
      assert.equal(testLead.phone, null);
      assert(testLead.email.endsWith("@example.invalid"));
      assert.equal(testEvent.payload.data.booking.recordType, "integration_test");
      assert.equal(testEvent.isIntegrationTest, true);
      assert.equal(testEvent.status, "pending");
      assert.equal((await pool.query("SELECT event_id FROM operations_delivery_outbox WHERE event_id = $1", [synthetic.eventId])).rows.length, 0);
      assert.deepEqual((await bookingReport({})).summary, summaryBeforeTest);
      assert.deepEqual((await acquisitionReport({})).totals, acquisitionBeforeTest);
      assert(!(await bookingReport({})).bookings.some(b => b.id === synthetic.bookingId));
      pass("admin-only strict Development test atomically creates quarantined synthetic records, reuses active tests, suppresses confirmations and excludes sales metrics");
      const cleanupPath = `/api/admin/integrations/operations/events/${synthetic.eventId}/cleanup`;
      assert.equal((await testAction(cleanupPath, { confirm: false })).status, 400);
      assert.equal((await testAction(`/api/admin/integrations/operations/events/${row.eventId}/cleanup`, { confirm: true })).status, 409);
      await db.update(outbox).set({ status: "processing" }).where(eq(outbox.eventId, synthetic.eventId));
      assert.equal((await testAction(cleanupPath, { confirm: true })).status, 409);
      await db.update(outbox).set({ status: "pending" }).where(eq(outbox.eventId, synthetic.eventId));
      const previousNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "production";
      try {
        assert.equal((await testAction(testPath)).status, 404);
        assert.equal((await testAction(cleanupPath, { confirm: true })).status, 404);
        await assert.rejects(createOperationsTestRecord());
        await assert.rejects(cleanupOperationsTestRecord(synthetic.eventId));
      } finally { process.env.NODE_ENV = previousNodeEnv; }
      pass("test and cleanup reject production, real records, unconfirmed deletion and in-flight delivery");
      const ids = { orderId: crypto.randomUUID(), jobId: crypto.randomUUID(), projectId: crypto.randomUUID(), reportId: crypto.randomUUID() };
      assert.equal(extractReceiverIdentifiers({ orderId: key, jobId: "Bearer reflected credential", projectId: { secret: key } }), null);
      await db.update(outbox).set({ status: "delivered" }).where(eq(outbox.eventId, row.eventId));
      await runOperationsDeliveryCycle({ config: { endpoint: process.env.URBANGRID_OPERATIONS_INTEGRATION_URL, key }, batchSize: 1,
        send: (url, privateKey, event) => sendOperationsEvent(url, privateKey, event, (async (_url, options) => {
          assert.equal((options?.headers as Record<string, string>)["x-urbangrid-key"], key);
          assert.equal(JSON.parse(String(options?.body)).data.booking.recordType, "integration_test");
          return Response.json({ order_id: ids.orderId, job: { id: ids.jobId }, data: { projectId: ids.projectId, report_id: ids.reportId }, secret: key });
        }) as typeof fetch),
      });
      const [acknowledged] = await db.select().from(outbox).where(eq(outbox.eventId, synthetic.eventId));
      assert.equal(acknowledged.status, "delivered");
      assert.deepEqual(acknowledged.receiverIdentifiers, ids);
      const [mappedBooking] = await db.select().from(inspectionBookings).where(eq(inspectionBookings.id, synthetic.bookingId));
      assert.deepEqual(mappedBooking.strataIdentifiers, ids);
      assert(mappedBooking.strataLastSyncAt);
      assert(!JSON.stringify(acknowledged).includes(key));
      const visibleTest = (await operationsIntegrationHealth()).events.find(e => e.eventId === synthetic.eventId);
      assert.deepEqual(visibleTest?.receiverIdentifiers, ids);
      pass("synthetic event uses ordinary worker/private header and stores only allowlisted receiver identifiers, never echoed credentials");
      assert.equal((await testAction(cleanupPath, { confirm: true })).status, 200);
      assert.deepEqual(await counts(), preSyntheticCounts);
      pass("confirmed cleanup deletes only synthetic local booking/lead/outbox records and leaves ordinary records unchanged");

      delete process.env.URBANGRID_OPERATIONS_INTEGRATION_URL;
      assert.equal((await operationsIntegrationHealth()).configured, false);
      await runOperationsDeliveryCycle({ send: async () => { throw new Error("Unconfigured integration must not send"); } });
      pass("missing configuration retains queue and sends no data externally");
    } finally {
      if (server) await new Promise<void>((resolve, reject) => server!.close(error => error ? reject(error) : resolve()));
      Object.assign(db, originals);
    }
    throw rollback;
  });
} catch (error) {
  if (error !== rollback) throw error;
} finally {
  if (previousKey === undefined) delete process.env.URBANGRID_NETWORK_INTEGRATION_KEY;
  else process.env.URBANGRID_NETWORK_INTEGRATION_KEY = previousKey;
  if (previousUrl === undefined) delete process.env.URBANGRID_OPERATIONS_INTEGRATION_URL;
  else process.env.URBANGRID_OPERATIONS_INTEGRATION_URL = previousUrl;
}
assert.deepEqual(await counts(), before, "All synthetic business records and delivery events rolled back");
pass("verification leaves existing lead/booking/payment/audit/outbox counts unchanged");
await pool.end();
console.log(`${passed} operations integration checks passed; no external delivery or real email sent.`);