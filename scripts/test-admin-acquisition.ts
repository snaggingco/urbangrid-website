// Development rollback fixtures only. No app startup, real submissions,
// notifications, payment providers, auth bootstrap or production access.
import assert from "node:assert/strict";
import crypto from "node:crypto";
import express from "express";
import session from "express-session";
import { count, eq } from "drizzle-orm";
import { db, pool } from "../server/db";
import { contactSubmissions as leads, inspectionBookings as bookings, inspectionPayments as payments,
  bookingAudit, leadStageHistory, operationsDeliveryOutbox } from "../shared/schema";
import { bookingInputSchema, adminBookingInputSchema, type BookingInput } from "../shared/booking";
import { dateBounds } from "../server/leadPipeline";
import { createInspectionBooking, createAdminInspectionBooking } from "../server/bookingService";
import { acquisitionReport } from "../server/acquisitionReporting";
import { registerLeadRoutes } from "../server/leadRoutes";
import { registerBookingRoutes } from "../server/bookingRoutes";

async function main() {
assert.equal(process.env.NODE_ENV, "development");
const rollback = new Error("ROLLBACK_ACQUISITION_FIXTURES");
const tables = [leads, bookings, payments, bookingAudit, leadStageHistory, operationsDeliveryOutbox];
const counts = () => Promise.all(tables.map(async t => (await db.select({ n: count() }).from(t))[0].n));
const before = await counts();
const originalSelect = db.select, originalTransaction = db.transaction, originalExecute = db.execute;
let passed = 0;
const check = (label: string, fn: () => void) => { fn(); passed++; console.log("PASS", label); };
const form = (extra: Partial<BookingInput> = {}): BookingInput => ({
  submissionKey: crypto.randomUUID(), name: "Synthetic operations fixture", email: "operations@example.invalid",
  phone: "+971500000000", service: "new-build-snagging", propertyType: "Apartment",
  areaSqft: 1000, project: "FIXTURE ONLY", location: "NOT A REAL PROPERTY", emirate: "Dubai",
  inspectionDate: "2099-02-01", ...extra,
});
try {
  await db.transaction(async tx => {
    db.select = tx.select.bind(tx) as typeof db.select;
    db.transaction = tx.transaction.bind(tx) as typeof db.transaction;
    db.execute = tx.execute.bind(tx) as typeof db.execute;
    const touch = { landingPage: "https://example.invalid/fixture", capturedAt: "2099-01-01T00:00:00.000Z",
      utm_source: "google", utm_medium: "cpc", utm_campaign: "fixture-campaign", gclid: "FIXTURE-GCLID",
      gbraid: "FIXTURE-GBRAID", wbraid: "FIXTURE-WBRAID" };
    const attribution = { firstTouch: touch, lastTouch: { ...touch, utm_source: "different-last-source" } };
    const [original] = await tx.insert(leads).values({
      name: form().name, email: form().email, phone: null, message: "FIXTURE ONLY pre-existing sales enquiry",
      leadSource: "contact", createdAt: new Date("2099-01-01T00:00:00Z"),
      stage: "qualified", qualifiedAt: new Date("2099-01-01T01:00:00Z"),
      revenueAmountMinor: 12345, submissionKey: crypto.randomUUID(), attribution,
    }).returning();
    await tx.insert(leadStageHistory).values({ leadId: original.id, fromStage: "new", toStage: "qualified",
      changedAt: original.qualifiedAt!, note: "Prior fixture history" });
    const linkedInput = { ...form({ phone: "" }), existingLeadId: original.id,
      attribution: { firstTouch: { ...touch, utm_source: "spoofed" }, lastTouch: touch } };
    const leadCount = (await tx.select({ n: count() }).from(leads))[0].n;
    const linked = await createAdminInspectionBooking(linkedInput, "fixture-admin");
    const replay = await createAdminInspectionBooking(linkedInput, "fixture-admin");
    const [saved] = await tx.select().from(leads).where(eq(leads.id, original.id));
    const history = await tx.select().from(leadStageHistory).where(eq(leadStageHistory.leadId, original.id));
    check("linked booking reuses enquiry and retry creates no duplicate lead/booking", () => {
      assert.equal(linked.leadId, original.id); assert.equal(linked.createdLead, false);
      assert.equal(replay.booking.id, linked.booking.id); assert.equal(replay.createdBooking, false);
      assert.equal((saved.createdAt as Date).getTime(), original.createdAt!.getTime());
      assert.equal(saved.submissionKey, original.submissionKey);
    });
    assert.equal((await tx.select({ n: count() }).from(leads))[0].n, leadCount);
    check("original identity, attribution, click IDs, history and staff revenue preserved", () => {
      assert.deepEqual(saved.attribution, attribution); assert.deepEqual(linked.booking.attribution, attribution);
      assert.equal(saved.revenueAmountMinor, 12345); assert.equal(saved.phone, null);
      assert.equal(saved.qualifiedAt!.getTime(), original.qualifiedAt!.getTime());
      assert.equal(saved.quotedAt, null); assert.equal(saved.stage, "booked");
      assert(saved.bookedAt); assert.equal(saved.bookingReference, linked.booking.bookingReference);
      assert.equal(history.length, 2); assert.equal(history[0].note, "Prior fixture history");
      assert(!history.some(h => h.toStage === "quoted"));
    });
    await assert.rejects(() => createInspectionBooking(form(), "customer", original.id), /staff-only/);
    await assert.rejects(() => createAdminInspectionBooking({ ...linkedInput, name: "Different person" }, "fixture-admin"), /contact must match/);
    check("public schema rejects admin linking and new staff bookings keep normal validation", () => {
      assert.equal(bookingInputSchema.safeParse(linkedInput).success, false);
      assert.equal(adminBookingInputSchema.safeParse(form({ phone: "" })).success, false);
    });
    // A second inspection on one lead must not make conversion rate exceed 100%.
    await createAdminInspectionBooking({ ...linkedInput, submissionKey: crypto.randomUUID(), project: "SECOND FIXTURE" }, "fixture-admin");
    await tx.update(bookings).set({ status: "completed", inspectionCompletedAt: new Date("2099-02-01T00:00:00Z") })
      .where(eq(bookings.id, linked.booking.id));
    const ledger = (status: string, amountMinor: number, testMode = false) => ({
      bookingId: linked.booking.id, leadId: original.id, operationId: crypto.randomUUID(), provider: "fixture",
      paymentType: status === "refunded" ? "refund" : "full", status, amountMinor, metadata: { testMode },
    });
    await tx.insert(payments).values([ledger("completed", 105000), ledger("refunded", 20000),
      ledger("completed", 99000, true), ledger("refunded", 10000, true), ledger("pending", 5000)]);

    async function newFixture(status: string, leadStage?: string, a?: typeof attribution) {
      const created = await createInspectionBooking(form({ attribution: a }));
      await tx.update(leads).set({ createdAt: new Date("2099-01-02T00:00:00Z"),
        ...(leadStage ? { stage: leadStage } : {}) }).where(eq(leads.id, created.leadId));
      await tx.update(bookings).set({ status }).where(eq(bookings.id, created.booking.id));
      return created;
    }
    const direct = await newFixture("booked");
    const [directLead] = await tx.select().from(leads).where(eq(leads.id, direct.leadId));
    check("direct residential booking without Qualified remains a measurable booking", () => {
      assert.equal(directLead.qualifiedAt, null); assert(directLead.bookedAt);
    });
    for (const status of ["lost", "canceled", "cancelled"]) {
      const excluded = await newFixture(status);
      await tx.insert(payments).values({ ...ledger("completed", 50000), bookingId: excluded.booking.id, leadId: excluded.leadId });
    }
    await newFixture("booked", "lost"); // Lead loss must not leave eligible revenue behind.
    await tx.insert(leads).values([
      { name: "Unbooked fixture", email: "unbooked@example.invalid", message: "Fixture", leadSource: "contact",
        createdAt: new Date("2099-01-03T00:00:00Z") },
      { name: "Non-sales fixture", email: "career@example.invalid", message: "Career application for Fixture",
        createdAt: new Date("2099-01-03T00:00:00Z"), leadSource: null },
      { name: "Outside fixture", email: "outside@example.invalid", message: "Fixture", leadSource: "contact",
        createdAt: new Date("2098-12-31T19:59:59Z") },
      { name: "Dubai edge fixture", email: "edge@example.invalid", message: "Fixture", leadSource: "contact",
        createdAt: new Date("2099-01-31T20:00:00Z") },
    ]);
    const filters = { from: "2099-01-01", to: "2099-01-31" };
    const report = await acquisitionReport(filters);
    check("cohort totals, distinct inspections, bounded conversion and VAT-inclusive average", () => {
      assert.equal(report.totals.leads, 7); assert.equal(report.totals.bookedLeads, 2);
      assert.equal(report.totals.eligibleBookings, 3); assert.equal(report.totals.leadToBookingRate, 2 / 7);
      assert.equal(report.totals.bookedValueMinor, 315000);
      assert.equal(report.totals.completedServiceValueMinor, 105000);
      assert.equal(report.totals.averageBookedValueMinor, 105000);
    });
    check("ledger excludes test/pending payments, subtracts refunds and computes balance per booking", () => {
      assert.equal(report.totals.netCashCollectedMinor, 85000);
      assert.equal(report.totals.outstandingMinor, 230000);
    });
    check("first-touch source/medium/campaign, Unknown, GCLID rates and linked original creation cohort", () => {
      const google = report.groups.find(g => g.source === "google")!;
      const unknown = report.groups.find(g => g.source === "Unknown")!;
      assert.equal(google.leads, 1); assert.equal(google.eligibleBookings, 2);
      assert.equal(google.medium, "cpc"); assert.equal(google.campaign, "fixture-campaign");
      assert.equal(google.leadToBookingRate, 1); assert.equal(google.gclidRate, 1);
      assert.equal(unknown.leads, 6); assert.equal(unknown.eligibleBookings, 1);
      assert.equal(unknown.gclidRate, 0); assert.equal(report.totals.gclidRate, 1 / 7);
      assert.equal(report.attributionModel, "first_touch");
    });
    const bounds = dateBounds(filters);
    check("inclusive Dubai dates and truthful zero-denominator empty report", () => {
      assert.equal(bounds.from!.toISOString(), "2098-12-31T20:00:00.000Z");
      assert.equal(bounds.until!.toISOString(), "2099-01-31T20:00:00.000Z");
    });
    const empty = await acquisitionReport({ from: "2099-12-01", to: "2099-12-01" });
    assert.equal(empty.groups.length, 0); assert.equal(empty.totals.leadToBookingRate, null);
    assert.equal(empty.totals.averageBookedValueMinor, null);

    const app = express(); app.use(express.json());
    app.use(session({ secret: "synthetic-fixture-only", resave: false, saveUninitialized: false }));
    const admin: express.RequestHandler = (req, res, next) => {
      if (req.get("x-fixture-admin") === "yes") next(); else res.status(401).json({ message: "Unauthorized" });
    };
    registerLeadRoutes(app, admin);
    registerBookingRoutes(app, admin, { notify: async () => true });
    const server = app.listen(0, "127.0.0.1"); await new Promise<void>(r => server.once("listening", r));
    const base = `http://127.0.0.1:${(server.address() as { port: number }).port}`;
    try {
      for (const path of ["/api/admin/acquisition", "/api/admin/booking-leads"]) {
        assert.equal((await fetch(base + path)).status, 401);
      }
      const bad = await fetch(base + "/api/admin/acquisition?from=2026-02-30", { headers: { "x-fixture-admin": "yes" } });
      assert.equal(bad.status, 400);
      const response = await fetch(base + "/api/admin/acquisition?from=2099-01-01&to=2099-01-31",
        { headers: { "x-fixture-admin": "yes" } });
      assert.equal(response.status, 200); assert.equal(response.headers.get("cache-control"), "no-store");
      assert.deepEqual((await response.json()).totals, report.totals);
      const lookup = await fetch(base + `/api/admin/booking-leads?q=${original.id}`, { headers: { "x-fixture-admin": "yes" } });
      const found = await lookup.json();
      assert(found.leads.some((l: { id: number }) => l.id === original.id));
      assert(!("attribution" in found.leads[0]));
      // Mutating admin route still requires CSRF even with an authenticated fixture.
      const rejected = await fetch(base + "/api/admin/bookings", { method: "POST",
        headers: { "content-type": "application/json", "x-fixture-admin": "yes", origin: base },
        body: JSON.stringify(linkedInput) });
      assert.equal(rejected.status, 403);
      check("new endpoints require admin, validate dates, disable caching and retain booking CSRF", () => {});
    } finally { await new Promise<void>(r => server.close(() => r())); }
    throw rollback;
  });
} catch (error) {
  if (error !== rollback) throw error;
} finally {
  db.select = originalSelect; db.transaction = originalTransaction; db.execute = originalExecute;
  try { assert.deepEqual(await counts(), before, "All synthetic database fixtures must roll back"); }
  finally { await pool.end(); }
}
console.log(`PASS ${passed} acquisition/linking checks; fixtures rolled back; no notifications or production writes.`);
}
main().catch(error => { console.error(error); process.exitCode = 1; });