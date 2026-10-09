import assert from "node:assert/strict";
import crypto from "node:crypto";
import express from "express";
import session from "express-session";
import { count, eq } from "drizzle-orm";
import { db, pool } from "../server/db";
import { inspectionBookings as bookings, inspectionPayments as payments, bookingAudit, contactSubmissions as leads, leadStageHistory, operationsDeliveryOutbox } from "../shared/schema";
import { bookingInputSchema, externalPaymentSchema } from "../shared/booking";
import { calculateInspectionPrice as price, serviceFromLabel } from "../shared/inspectionPricing";
import { createInspectionBooking, createBookingPayment, bookingView, verifyBookingPayments,
  manualBookingStatus, recordExternalPayment, sendBookingConfirmation, bookingAccessToken, accessMatches } from "../server/bookingService";
import { bookingReport } from "../server/bookingReporting";
import { registerBookingRoutes } from "../server/bookingRoutes";
import { residentialChatReply } from "../server/residentialChat";
import { verifyZiinaSignature, type PaymentProvider, type ZiinaIntent } from "../server/ziina";
assert.equal(process.env.NODE_ENV, "development", "Rollback-only development tests");
let passed = 0, emailCount = 0;
const check = (name: string, fn: () => void) => { fn(); passed++; console.log("PASS", name); };
const notify = async () => { emailCount++; return true; }; // Never deliver synthetic email.
const origin = "https://booking-test.invalid";
const input = () => bookingInputSchema.parse({
  name: "Residential test", email: "bookings@example.invalid", phone: "+971500000000",
  service: "new-build-snagging", propertyType: "Villa", areaSqft: 1234.56, project: "Synthetic project",
  location: "Test community", emirate: "Dubai", inspectionDate: "2099-01-03", timeWindow: "Morning",
  submissionKey: crypto.randomUUID(),
});
check("authoritative whole-area tiers, minimum, half-price reinspections and VAT in fils", () => {
  assert.equal(price("new-build-snagging", 799).totalMinor, 84000);
  assert.equal(price("new-build-snagging", 1000).totalMinor, 105000);
  assert.equal(price("new-build-snagging", 1000.01).totalMinor, 94501);
  assert.equal(price("new-build-snagging", 2000).totalMinor, 189000);
  assert.equal(price("new-build-snagging", 2000.01).totalMinor, 168001);
  assert.equal(price("new-build-snagging", 3000).totalMinor, 252000);
  assert.equal(price("new-build-snagging", 4000).totalMinor, 315000);
  assert.equal(price("new-build-snagging", 4000.01).totalMinor, 294001);
  assert.equal(price("new-build-snagging", 1234.56).totalMinor, 116666);
  assert.equal(price("dlp-inspection", 1000).totalMinor, 52500);
  assert.equal(price("de-snagging", 700).totalMinor, 42000);
  assert.equal(price("move-in-move-out", 1000).totalMinor, 84000);
  assert.equal(price("move-in-move-out", 10000).totalMinor, 525000);
  assert.equal(price("new-build-snagging", 25000).totalMinor, 1837500);
  assert.equal(serviceFromLabel("secondary-market"), "secondary-market-inspection");
});
check("all multi-unit, commercial and custom scopes excluded; no public money/stage fields", () => {
  for (const service of ["reserve-fund-study", "common-area", "commercial", "consultancy", "building-condition-survey"])
    assert.throws(() => price(service, 1500));
  assert.throws(() => price("new-build-snagging", 1000, 2));
  for (const area of [0, -1, 0.001, Infinity, 1000001]) assert.throws(() => price("new-build-snagging", area));
  assert.equal(bookingInputSchema.safeParse({ ...input(), quoteTotalMinor: 1 }).success, false);
  assert.equal(bookingInputSchema.safeParse({ ...input(), status: "completed" }).success, false);
  assert.equal(bookingInputSchema.safeParse({ ...input(), propertyType: "Office" }).success, false);
  assert.equal(externalPaymentSchema.safeParse({ paymentType: "deposit" }).success, false);
});
check("deterministic chat quotes use exact fils; custom scopes never get residential quote", () => {
  assert.match(residentialChatReply("Booking details: Service Type: Stage 1, Built-Up Area: 1234.56 sq.ft")!, /1,166.66/);
  assert.match(residentialChatReply("2 units new-build 1500 sq.ft")!, /Custom Quote/);
  assert.match(residentialChatReply("large villa inspection price")!, /Large villas are eligible/);
  assert.match(residentialChatReply("RFS price")!, /Custom Quote/);
});
check("webhook signature checks exact raw body and rejects tampering", () => {
  const raw = Buffer.from('{"event":"payment_intent.status.updated"}'), secret = "synthetic-not-a-real-secret";
  const signature = crypto.createHmac("sha256", secret).update(raw).digest("hex");
  assert.equal(verifyZiinaSignature(raw, signature, secret), true);
  assert.equal(verifyZiinaSignature(Buffer.from("{}"), signature, secret), false);
  assert.equal(verifyZiinaSignature(raw, "00", secret), false);
});
const tables = [bookings, payments, bookingAudit, leads, leadStageHistory, operationsDeliveryOutbox];
const counts = async () => Promise.all(tables.map(async table => (await db.select({ n: count() }).from(table))[0].n));
const before = await counts();
const rollback = new Error("ROLLBACK_RESIDENTIAL_TESTS");
try {
  await db.transaction(async tx => {
    const oldSelect = db.select, oldTransaction = db.transaction, oldInsert = db.insert;
    db.select = tx.select.bind(tx) as typeof db.select;
    db.insert = tx.insert.bind(tx) as typeof db.insert;
    db.transaction = tx.transaction.bind(tx) as typeof db.transaction;
    const app = express();
    app.use(express.json());
    app.use(session({ secret: "synthetic-session-for-test-only", resave: false, saveUninitialized: false }));
    registerBookingRoutes(app, (req, res, next) => req.get("x-test-admin") === "yes" ? next() : res.status(401).json({ message: "Unauthorized" }), { notify });
    const server = app.listen(0);
    await new Promise<void>(r => server.once("listening", r));
    const base = `http://127.0.0.1:${(server.address() as any).port}`;
    let cookie = "", csrf = "";
    const api = async (path: string, body?: unknown, extra = {}) => {
      const response = await fetch(base + path, { method: body === undefined ? "GET" : "POST",
        redirect: "manual", headers: { Cookie: cookie, Origin: base, "Content-Type": "application/json", "X-CSRF-Token": csrf, ...extra },
        ...(body !== undefined ? { body: JSON.stringify(body) } : {}) });
      cookie = response.headers.get("set-cookie")?.split(";")[0] || cookie;
      return response;
    };
    try {
      const form = input();
      const created = await createInspectionBooking(form);
      let view = await bookingView(created.booking);
      const [lead] = await db.select().from(leads).where(eq(leads.id, created.leadId));
      check("booking confirmed without payment, quote stored separately and lead booked", () => {
        assert.equal(view.status, "booked"); assert.equal(view.paymentStatus, "unpaid"); assert.equal(lead.stage, "booked");
        assert.equal(lead.quoteValueMinor, 116666); assert.equal(lead.revenueAmountMinor, null);
        assert.equal(view.cashCollectedMinor, 0); assert.equal(view.payments.length, 0);
        assert.equal(view.inspectionCompletedAt, null); assert.equal(view.reportStatus, "Awaiting physical inspection");
      });
      const retry = await createInspectionBooking(form);
      check("retry reuses one lead and one booking without stage downgrade", () => {
        assert.equal(retry.booking.id, created.booking.id); assert.equal(retry.createdLead, false); assert.equal(retry.createdBooking, false);
      });
      await assert.rejects(() => createInspectionBooking({ ...form, areaSqft: 2000 }), /already saved/);
      await sendBookingConfirmation(view.id, origin, notify);
      await sendBookingConfirmation(view.id, origin, notify);
      check("confirmation email is claimed once with isolated transport", () => assert.equal(emailCount, 1));
      let currentStatus: ZiinaIntent["status"] = "pending", createCalls = 0, mismatch = false, simulated = false;
      const intents = new Map<string, ZiinaIntent>();
      const fake: PaymentProvider = {
        enabled: () => true, testMode: () => simulated,
        create: async (amount, ref, op) => {
          createCalls++;
          const result: ZiinaIntent = { id: `test-${op}`, operation_id: op, amount, currency_code: "AED",
            status: "requires_payment_instrument", redirect_url: "https://pay.ziina.com/synthetic", account_id: "test-account" };
          intents.set(result.id, result); return result;
        },
        retrieve: async id => ({ ...intents.get(id)!, status: currentStatus, ...(mismatch ? { amount: 1 } : {}) }),
      };
      await assert.rejects(() => createBookingPayment(view.id, "full", origin, fake), /only after/);
      await assert.rejects(() => recordExternalPayment(view.id, { paymentType: "full", amountMinor: 116666,
        paidAt: new Date().toISOString(), reference: "premature", providerNote: "Synthetic", provider: "bank_transfer" }, "test", origin, notify), /only after/);
      check("provider and external payment creation both blocked before physical completion", () => assert.equal(createCalls, 0));
      await manualBookingStatus(view.id, "completed", "Physical inspection completed — synthetic test", "test");
      const payment = await createBookingPayment(view.id, "full", origin, fake);
      await createBookingPayment(view.id, "full", origin, fake);
      check("post-inspection request is full outstanding fils and reuses active intent", () => {
        assert.equal(createCalls, 1); assert.equal(intents.values().next().value!.amount, 116666);
      });
      view = await verifyBookingPayments(view.id, origin, fake, notify);
      check("pending provider response cannot mark Paid or release-ready", () => {
        assert.equal(view.paymentStatus, "pending"); assert.equal(view.cashCollectedMinor, 0); assert.equal(view.reportStatus, "Awaiting payment");
      });
      currentStatus = "completed"; mismatch = true;
      await assert.rejects(() => verifyBookingPayments(view.id, origin, fake, notify), /mismatch/);
      mismatch = false;
      view = await verifyBookingPayments(view.id, origin, fake, notify);
      await verifyBookingPayments(view.id, origin, fake, notify);
      check("verified completion recorded exactly once; paid and ready without sending reports", () => {
        assert.equal(view.cashCollectedMinor, 116666); assert.equal(view.paymentStatus, "paid");
        assert.equal(view.reportStatus, "Ready for Release — payment cleared"); assert.equal(view.payments[0].verifiedOnline, true);
      });
      await assert.rejects(() => createBookingPayment(view.id, "full", origin, fake), /already covered/);
      const manual = await createInspectionBooking(input(), "test");
      await manualBookingStatus(manual.booking.id, "completed", "Physical inspection complete", "test");
      const external = { paymentType: "full", amountMinor: 116666, paidAt: new Date().toISOString(),
        reference: crypto.randomUUID(), providerNote: "Verified external Ziina transfer", provider: "ziina_manual" };
      await recordExternalPayment(manual.booking.id, external, "test", origin, notify);
      await recordExternalPayment(manual.booking.id, external, "test", origin, notify);
      const [manualRow] = await db.select().from(bookings).where(eq(bookings.id, manual.booking.id));
      const manualView = await bookingView(manualRow);
      check("external full payment is audited, idempotent and clears report-payment status", () => {
        assert.equal(manualView.cashCollectedMinor, 116666); assert.equal(manualView.paymentStatus, "paid");
        assert.equal(manualView.payments.length, 1); assert.equal(manualView.reportStatus, "Ready for Release — payment cleared");
      });
      await assert.rejects(() => recordExternalPayment(manualRow.id, { ...external, amountMinor: 1 }, "test", origin, notify), /different details/);
      await recordExternalPayment(manualRow.id, { ...external, paymentType: "refund", amountMinor: 1000, reference: crypto.randomUUID() }, "test", origin, notify);
      const refunded = await bookingView(manualRow);
      check("refund netted from cash and revokes release readiness", () => {
        assert.equal(refunded.cashCollectedMinor, 115666); assert.equal(refunded.reportStatus, "Awaiting payment");
      });
      const testBooking = await createInspectionBooking(input());
      await manualBookingStatus(testBooking.booking.id, "completed", "Synthetic test physical completion", "test");
      simulated = true;
      await createBookingPayment(testBooking.booking.id, "full", origin, fake);
      const simulatedView = await verifyBookingPayments(testBooking.booking.id, origin, fake, notify);
      check("Ziina test completion does not count cash, Paid, release-ready or payment conversion", () => {
        assert.equal(simulatedView.cashCollectedMinor, 0); assert.equal(simulatedView.paymentStatus, "test_completed");
        assert.equal(simulatedView.payments[0].verifiedOnline, false); assert.equal(simulatedView.reportStatus, "Awaiting payment");
      });
      const report = await bookingReport({ from: "2026-01-01", to: "2099-12-31" });
      check("financial summary does not multiply quote values on payment joins and excludes test cash", () => {
        assert.equal(report.summary.cashCollectedMinor, 232332); // 116666 + 115666
        assert.equal(report.summary.bookedValueMinor, 349998);
      });
      simulated = false;
      currentStatus = "failed";
      await createBookingPayment(testBooking.booking.id, "full", origin, fake);
      const failedView = await verifyBookingPayments(testBooking.booking.id, origin, fake, notify);
      currentStatus = "canceled";
      await createBookingPayment(testBooking.booking.id, "full", origin, fake);
      const canceledView = await verifyBookingPayments(testBooking.booking.id, origin, fake, notify);
      check("failed and canceled provider states remain unpaid and retryable without release readiness", () => {
        assert.equal(failedView.paymentStatus, "failed"); assert.equal(canceledView.paymentStatus, "canceled");
        assert.equal(canceledView.cashCollectedMinor, 0); assert.equal(canceledView.reportStatus, "Awaiting payment");
      });
      csrf = (await (await api("/api/bookings/config")).json()).csrfToken;
      check("private reference without session ownership is not authorization", () => assert.equal(accessMatches(created.booking, "0".repeat(64)), false));
      assert.equal((await api(`/api/bookings/${created.booking.bookingReference}`)).status, 403);
      assert.equal((await api("/api/admin/bookings")).status, 401);
      assert.equal((await api("/api/bookings", input(), { Origin: "https://attacker.invalid" })).status, 403);
      assert.equal((await api("/api/bookings", input(), { "X-CSRF-Token": "" })).status, 403);
      assert.equal((await api("/api/bookings", { ...input(), quoteTotalMinor: 1 })).status, 400);
      const apiForm = input(), response = await api("/api/bookings", apiForm);
      assert.equal(response.status, 201);
      const body = await response.json();
      assert.equal(body.booking.status, "booked"); assert.equal(body.booking.paymentStatus, "unpaid");
      assert.equal((await api(`/api/bookings/${body.booking.bookingReference}`)).status, 200);
      assert.equal((await api("/api/bookings", apiForm)).status, 200);
      assert.equal((await api(`/api/bookings/${body.booking.bookingReference}/pay`, { paymentType: "deposit", amountMinor: 1 })).status, 400);
      const link = `/booking-access/${created.booking.bookingReference}/${bookingAccessToken(created.booking)}`;
      const access = await api(link);
      assert.equal(access.status, 303); assert.equal(access.headers.get("referrer-policy"), "no-referrer");
      assert.ok(!access.headers.get("location")!.includes(bookingAccessToken(created.booking)));
      assert.equal((await api(`/api/bookings/${created.booking.bookingReference}`)).status, 200);
      check("real API handlers enforce auth, CSRF, strict inputs, private session access and create without checkout", () => {});
      const previousEnvironment = process.env.NODE_ENV;
      try {
        process.env.NODE_ENV = "production";
        const syntheticInput = { ...input(),
          name: "UrbanGrid PRODUCTION INTEGRATION TEST — NO DISPATCH",
          email: "fixture@example.invalid", phone: "+971000000000",
          project: "INTEGRATION TEST ONLY" };
        const synthetic = await createInspectionBooking(syntheticInput, "integration_smoke");
        const duplicate = await createInspectionBooking(syntheticInput, "integration_smoke");
        const previousEmailCount = emailCount, previousCreateCalls = createCalls;
        await sendBookingConfirmation(synthetic.booking.id, origin, notify);
        const [event] = await tx.select().from(operationsDeliveryOutbox)
          .where(eq(operationsDeliveryOutbox.bookingId, synthetic.booking.id));
        check("Production smoke is quarantined in lead/booking/outbox, suppresses notifications and replays one booking", () => {
          assert.equal(synthetic.booking.isIntegrationTest, true);
          assert.equal(duplicate.booking.id, synthetic.booking.id);
          assert.equal(duplicate.createdBooking, false);
          assert.equal(emailCount, previousEmailCount);
          assert.equal(event.isIntegrationTest, true);
          assert.equal(event.payload.data.booking.recordType, "integration_test");
          assert.equal(event.payload.data.booking.sendNotifications, false);
          assert.equal(event.payload.data.booking.customer.phone, null);
        });
        await assert.rejects(() => createBookingPayment(synthetic.booking.id, "full", origin, fake), /Synthetic bookings/);
        await assert.rejects(() => recordExternalPayment(synthetic.booking.id, {
          paymentType: "full", amountMinor: 116666, paidAt: new Date().toISOString(),
          reference: "synthetic-blocked", provider: "bank_transfer", providerNote: "Synthetic",
        }, "test", origin, notify), /Synthetic bookings/);
        check("Production smoke cannot create provider charges or record external cash", () => assert.equal(createCalls, previousCreateCalls));
        process.env.NODE_ENV = "development";
        await assert.rejects(() => createInspectionBooking(syntheticInput, "integration_smoke"), /Authorized synthetic/);
      } finally {
        process.env.NODE_ENV = previousEnvironment;
      }
    } finally {
      db.select = oldSelect; db.transaction = oldTransaction; db.insert = oldInsert;
      await new Promise<void>(r => server.close(() => r()));
    }
    throw rollback;
  });
} catch (e) { if (e !== rollback) throw e; }
assert.deepEqual(await counts(), before, "All synthetic records rolled back");
await pool.end();
console.log(`${passed} residential booking checks passed; all fixtures rolled back; no real email or provider calls.`);