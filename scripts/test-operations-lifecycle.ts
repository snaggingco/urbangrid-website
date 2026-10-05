import assert from "node:assert/strict";
import crypto from "node:crypto";
import express from "express";
import { count, eq } from "drizzle-orm";
import { db, pool } from "../server/db";
import { contactSubmissions, inspectionBookings, inspectionPayments, bookingAudit,
  leadStageHistory, operationsDeliveryOutbox as outbox, operationsLifecycle as lifecycle,
  operationsLifecycleEvents as receipts } from "../shared/schema";
import { bookingInputSchema } from "../shared/booking";
import { createInspectionBooking, bookingByReference, bookingView } from "../server/bookingService";
import { applyLifecycleSnapshot, fetchLifecycleSnapshot, reconcileBooking, registerLifecycleRoutes,
  LifecycleError } from "../server/operationsLifecycle";
import { sendOperationsEvent } from "../server/operationsTransport";
import { measurementClassification } from "../shared/commercialEvents";
import { canonicalUrl, isNonIndexablePath } from "../shared/siteConfig";
import { getSitemapUrls } from "../server/sitemap";

assert.equal(process.env.NODE_ENV, "development", "Rollback-only Development verification");
const tables = [contactSubmissions, inspectionBookings, inspectionPayments, bookingAudit,
  leadStageHistory, outbox, lifecycle, receipts];
const counts = async () => Promise.all(tables.map(async table =>
  (await db.select({ n: count() }).from(table))[0].n));
const before = await counts();
let passed = 0;
const pass = (name: string) => { passed++; console.log("PASS", name); };
const rollback = new Error("ROLLBACK_LIFECYCLE_TESTS");
const key = crypto.randomBytes(48).toString("hex");
const previousKey = process.env.URBANGRID_NETWORK_INTEGRATION_KEY;
const previousUrl = process.env.URBANGRID_OPERATIONS_STATUS_URL;
let server: ReturnType<express.Express["listen"]> | undefined;
try {
  assert.equal(canonicalUrl("https://www.urbangrid.ae/about/?utm_source=x#section"), "https://urbangrid.ae/about");
  assert(isNonIndexablePath("/book-inspection/return"));
  assert(isNonIndexablePath("/admin/login"));
  assert(!isNonIndexablePath("/about"));
  const sitemap = getSitemapUrls("https://www.urbangrid.ae", [{ slug: "test-published", updatedAt: new Date() }]);
  assert(sitemap.every(url => url.loc.startsWith("https://urbangrid.ae/")));
  assert(!sitemap.some(url => isNonIndexablePath(new URL(url.loc).pathname)));
  pass("canonical normalization and private-route sitemap exclusion");
  for (const name of ["form_start", "click", "page_view"]) {
    assert.deepEqual(measurementClassification(name), {
      event_category: "engagement", commercial_stage: "none", is_primary_business_conversion: false,
    });
  }
  assert.equal(measurementClassification("whatsapp_click").commercial_stage, "whatsapp_intent");
  assert.equal(measurementClassification("call_click").commercial_stage, "call_intent");
  assert.equal(measurementClassification("booking_confirmed").commercial_stage, "booking_confirmed");
  assert.equal(measurementClassification("purchase").commercial_stage, "payment_received");
  pass("engagement classification is separate from every commercial stage");
  await db.transaction(async tx => {
    const originals = { select: db.select, insert: db.insert, update: db.update, transaction: db.transaction };
    db.select = tx.select.bind(tx) as typeof db.select;
    db.insert = tx.insert.bind(tx) as typeof db.insert;
    db.update = tx.update.bind(tx) as typeof db.update;
    db.transaction = tx.transaction.bind(tx) as typeof db.transaction;
    process.env.URBANGRID_NETWORK_INTEGRATION_KEY = key;
    process.env.URBANGRID_OPERATIONS_STATUS_URL = "https://status.example.invalid/booking";
    try {
      const result = await createInspectionBooking(bookingInputSchema.parse({
        submissionKey: crypto.randomUUID(), name: "Synthetic lifecycle test",
        email: "lifecycle@example.invalid", phone: "+971500000000",
        service: "new-build-snagging", propertyType: "Apartment", areaSqft: 1000,
        project: "Synthetic project", location: "Synthetic location", emirate: "Dubai",
        inspectionDate: "2099-01-03",
      }));
      const booking = result.booking;
      const [delivery] = await db.select().from(outbox).where(eq(outbox.bookingId, booking.id));
      assert.equal(delivery.payload.data.booking.country, "AE");
      assert.equal(delivery.payload.data.booking.leadIdentity, `ug-ae-lead-${booking.leadId}`);
      const ids = { orderId: "ORDER-123", jobId: "JOB-123", projectId: "PROJECT-123" };
      const acknowledgment = await sendOperationsEvent("https://receiver.example.invalid/events", key,
        delivery.payload, (async () => new Response(JSON.stringify({ identifiers: ids,
          echoedSecret: key, customer: { email: "discard@example.invalid" } }), { status: 200 })) as typeof fetch);
      assert.deepEqual(acknowledgment.receiverIdentifiers, ids);
      assert(!JSON.stringify(acknowledgment).includes(key));
      pass("normal booking acknowledgment captures only allowlisted mapping IDs");
      await db.update(outbox).set({ status: "delivered", receiverIdentifiers: ids })
        .where(eq(outbox.eventId, delivery.eventId));
      const snapshot = (version: number, status: string) => ({
        schemaVersion: 1, source: "strata-surveyor", country: "AE", environment: "development",
        bookingId: booking.id, bookingReference: booking.bookingReference,
         eventId: `strata.test.${booking.id}.${version + 1}`, version: version + 1, status,
        occurredAt: new Date().toISOString(), identifiers: ids,
      });
       await applyLifecycleSnapshot(snapshot(0, "booked"));
       assert.equal((await bookingView(await bookingByReference(booking.bookingReference))).operations?.status, "booked");
       const scheduled = snapshot(1, "scheduled");
      assert.equal((await applyLifecycleSnapshot(scheduled)).applied, true);
      assert.equal((await applyLifecycleSnapshot(scheduled)).applied, false);
      await assert.rejects(applyLifecycleSnapshot({ ...scheduled, status: "qa_approved" }),
        (error: unknown) => error instanceof LifecycleError && error.code === "EVENT_ID_CONFLICT");
      pass("durable duplicate no-op; event ID reuse with changed contents rejected");
      await applyLifecycleSnapshot(snapshot(2, "inspection_started"));
      await applyLifecycleSnapshot(snapshot(3, "inspection_completed"));
      let current = await bookingByReference(booking.bookingReference);
      assert(current.inspectionCompletedAt);
      let view = await bookingView(current);
      assert.equal(view.cashCollectedMinor, 0);
      assert.equal(view.paymentStatus, "unpaid");
      assert.equal(view.reportStatus, "Awaiting payment");
      assert.equal(view.operations?.status, "inspection_completed");
      assert.equal(view.operations?.identifiers, undefined);
      assert.deepEqual((await bookingView(current, undefined, true)).operations?.identifiers, ids);
      pass("authenticated physical completion unlocks existing payment gate, not payment/release");
      const qa = snapshot(4, "qa_approved");
      await applyLifecycleSnapshot(qa);
      assert.equal((await applyLifecycleSnapshot(scheduled)).applied, false);
      const stale = snapshot(2, "scheduled");
      stale.eventId += ".older";
      assert.equal((await applyLifecycleSnapshot(stale)).applied, false);
      await assert.rejects(applyLifecycleSnapshot(snapshot(5, "inspection_started")), LifecycleError);
      await assert.rejects(applyLifecycleSnapshot({ ...snapshot(5, "report_published"), environment: "production" }), LifecycleError);
      await assert.rejects(applyLifecycleSnapshot({ ...snapshot(5, "report_published"), country: "GB" }));
      await assert.rejects(applyLifecycleSnapshot({ ...snapshot(5, "report_published"), bookingReference: "UG-2026-FFFFFFFFFFFF" }), LifecycleError);
      await assert.rejects(applyLifecycleSnapshot({ ...snapshot(5, "report_published"), identifiers: { jobId: "JOB-456" } }), LifecycleError);
      await assert.rejects(applyLifecycleSnapshot({ ...snapshot(5, "report_published"), occurredAt: "2099-01-01T00:00:00Z" }), LifecycleError);
       assert.equal((await db.select().from(lifecycle).where(eq(lifecycle.bookingId, booking.id)))[0].version, 5);
      pass("out-of-order, cross-environment, wrong-booking, mapping and regression protections");
       await applyLifecycleSnapshot(snapshot(5, "report_published"));
       assert.equal((await db.select().from(lifecycle).where(eq(lifecycle.bookingId, booking.id)))[0].status, "qa_approved");
       const terminal = { ...snapshot(6, "report_released"), identifiers: { ...ids, reportId: "REPORT-123" } };
      const transport = (async (url, options) => {
        const request = new URL(String(url));
        assert.equal(request.searchParams.get("bookingId"), String(booking.id));
        assert.equal(request.searchParams.get("country"), "AE");
        assert.equal(options?.method, "GET");
        assert.equal(options?.redirect, "error");
        assert.equal((options?.headers as Record<string, string>)["x-urbangrid-key"], key);
        assert(options?.signal);
        return new Response(JSON.stringify(terminal));
      }) as typeof fetch;
      await reconcileBooking(booking.id, transport);
      const identity = { bookingId: booking.id, bookingReference: booking.bookingReference, eventId: delivery.eventId };
      await assert.rejects(fetchLifecycleSnapshot(process.env.URBANGRID_OPERATIONS_STATUS_URL!, key, identity,
        (async () => new Response(JSON.stringify({ ...terminal, bookingId: booking.id + 1 }))) as typeof fetch), LifecycleError);
      await assert.rejects(fetchLifecycleSnapshot(process.env.URBANGRID_OPERATIONS_STATUS_URL!, key, identity,
        (async () => new Response("x".repeat(65537))) as typeof fetch));
      current = await bookingByReference(booking.bookingReference);
       assert.deepEqual(current.strataIdentifiers, terminal.identifiers);
       assert(current.strataLastSyncAt);
      view = await bookingView(current);
      assert.equal(view.cashCollectedMinor, 0);
      assert.equal(view.reportStatus, "Awaiting payment");
      assert.equal(view.status, booking.status);
      pass("bounded authenticated polling validates identity; report released does not fabricate cash");
      const app = express();
      app.use(express.json());
      registerLifecycleRoutes(app, (_req, res) => { res.status(401).json({ message: "Login required" }); },
        (_req, res) => { res.status(403).json({ message: "CSRF required" }); });
      server = app.listen(0, "127.0.0.1");
      await new Promise<void>(resolve => server!.on("listening", resolve));
      const origin = `http://127.0.0.1:${(server.address() as { port: number }).port}`;
      const send = (headers: Record<string, string>) => fetch(`${origin}/api/integrations/strata/lifecycle`,
        { method: "POST", headers: { "Content-Type": "application/json", ...headers }, body: JSON.stringify(terminal) });
      assert.equal((await send({})).status, 401);
      assert.equal((await send({ "x-urbangrid-key": "x".repeat(key.length) })).status, 401);
      const duplicate = await send({ "x-urbangrid-key": key });
      assert.equal(duplicate.status, 200);
      assert.equal((await duplicate.json()).applied, false);
      assert.equal((await fetch(`${origin}/api/admin/integrations/operations/reconcile/${booking.id}`, { method: "POST" })).status, 401);
      pass("callbacks reject unauthenticated callers; admin reconciliation requires admin authentication");
    } finally {
      Object.assign(db, originals);
      if (server) await new Promise<void>(resolve => server!.close(() => resolve()));
    }
    throw rollback;
  });
} catch (error) { if (error !== rollback) throw error; }
finally {
  if (previousKey === undefined) delete process.env.URBANGRID_NETWORK_INTEGRATION_KEY;
  else process.env.URBANGRID_NETWORK_INTEGRATION_KEY = previousKey;
  if (previousUrl === undefined) delete process.env.URBANGRID_OPERATIONS_STATUS_URL;
  else process.env.URBANGRID_OPERATIONS_STATUS_URL = previousUrl;
}
assert.deepEqual(await counts(), before);
await pool.end();
console.log(`${passed} lifecycle checks passed; all synthetic records rolled back; no external delivery/email.`);