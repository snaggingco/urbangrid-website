import assert from "node:assert/strict";
import express from "express";
import { eq, count, sql } from "drizzle-orm";
import { db, pool } from "../server/db";
import { contactSubmissions as leads, leadStageHistory, insertContactSubmissionSchema } from "../shared/schema";
import { leadFiltersSchema, leadUpdateSchema } from "../shared/leads";
import { dateBounds, marketingSummary, updateLead, leadHistory, listLeads } from "../server/leadPipeline";
import { registerLeadRoutes } from "../server/leadRoutes";

assert.equal(process.env.NODE_ENV, "development", "Integration tests are development-only");
const rollback = new Error("TEST_ROLLBACK");
const before = await db.select({ total: count() }).from(leads);
const beforeHistory = await db.select({ total: count() }).from(leadStageHistory);
let passed = 0;
function check(label: string, fn: () => void) { fn(); passed++; console.log("PASS", label); }
const filters = leadFiltersSchema.parse({ source: "pipeline_test", from: "2099-01-01", to: "2099-01-31" });
check("inclusive Dubai dates", () => {
  assert.equal(dateBounds(filters).from!.toISOString(), "2098-12-31T20:00:00.000Z");
  assert.equal(dateBounds(filters).until!.toISOString(), "2099-01-31T20:00:00.000Z");
});
check("validation rejects invalid dates, stages, negative/fractional money and immutable fields", () => {
  for (const query of [{ from: "2026-02-30" }, { from: "2026-02-29" }, { from: "2026-10-04", to: "2026-10-01" },
    { stage: "fake" }, { offset: -1 }, { includeNonSales: "yes" }]) assert.equal(leadFiltersSchema.safeParse(query).success, false);
  for (const update of [{}, { note: "alone" }, { revenueAmountMinor: -1 }, { quoteValueMinor: 1.5 },
    { attribution: {} }, { qualifiedAt: new Date() }, { inspectionDate: "2026-02-30" },
    { stage: "fake" }, { quoteCurrency: "aed" }]) assert.equal(leadUpdateSchema.safeParse(update).success, false);
  assert.equal(leadUpdateSchema.safeParse({ stage: "quoted", revenueAmountMinor: null }).success, true);
  assert.equal(leadUpdateSchema.safeParse({ revenueAmountMinor: 12345 }).success, true);
});
check("public input cannot write lifecycle, quote or revenue columns", () => {
  const parsed = insertContactSubmissionSchema.parse({ name: "Test fixture", email: "test@example.invalid", message: "Fixture",
    stage: "completed", quoteValueMinor: 999, revenueAmountMinor: 999, bookedAt: new Date() });
  assert.equal("stage" in parsed, false);
  assert.equal("bookedAt" in parsed, false);
  assert.equal("quoteValueMinor" in parsed, false);
  assert.equal("revenueAmountMinor" in parsed, false);
});

try {
  await db.transaction(async tx => {
    // Route handlers and services share this test transaction. Their nested
    // transactions use SAVEPOINTs, retaining real atomic rollback semantics.
    const oldSelect = db.select, oldTransaction = db.transaction;
    db.select = tx.select.bind(tx) as typeof db.select;
    db.transaction = tx.transaction.bind(tx) as typeof db.transaction;
    const app = express();
    app.use(express.json());
    registerLeadRoutes(app, (req, res, next) => {
      if (req.headers["x-test-admin"] === "yes") next();
      else res.status(401).json({ message: "Unauthorized" });
    });
    const server = app.listen(0, "127.0.0.1");
    await new Promise<void>(resolve => server.once("listening", resolve));
    const address = server.address() as { port: number };
    const base = `http://127.0.0.1:${address.port}`;
    const request = (path: string, body?: unknown, authorized = true) => fetch(base + path, {
      method: body === undefined ? "GET" : "PATCH",
      headers: { ...(authorized ? { "x-test-admin": "yes" } : {}), "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    try {
      const capturedAt = "2099-01-05T10:00:00.000Z";
      const touch = { landingPage: "https://example.invalid/fixture", capturedAt, utm_source: "google", gclid: "fixture-only" };
      const first = await tx.insert(leads).values({
        name: "Pipeline fixture", email: "fixture@example.invalid", message: "Synthetic test; no email",
        leadSource: "pipeline_test", createdAt: new Date(capturedAt),
        attribution: { firstTouch: touch, lastTouch: { ...touch, gbraid: "fixture-only", wbraid: "fixture-only" } },
        submissionKey: "00000000-0000-4000-8000-000000000099",
      }).returning();
      const id = first[0].id;
      await tx.insert(leads).values([
        { name: "Career fixture", email: "career@example.invalid", message: "Career application for Engineer", leadSource: null, createdAt: new Date(capturedAt) },
        { name: "Broker fixture", email: "broker@example.invalid", message: "Broker Referral Application", leadSource: null, createdAt: new Date(capturedAt) },
        { name: "Sample fixture", email: "sample@example.invalid", message: "Sample report download request", leadSource: null, createdAt: new Date(capturedAt) },
        { name: "Explicit career fixture", email: "career2@example.invalid", message: "Career", leadSource: "career_application", createdAt: new Date(capturedAt) },
      ]);
      const dateOnly = leadFiltersSchema.parse({ from: "2099-01-01", to: "2099-01-31" });
      let summary = await marketingSummary(dateOnly);
      check("default excludes non-sales including legacy careers", () => assert.equal(summary.totalLeads, 1));
      summary = await marketingSummary({ ...dateOnly, includeNonSales: true });
      check("explicit inclusion restores all non-sales rows", () => assert.equal(summary.totalLeads, 5));
      const duplicate = await tx.insert(leads).values({
        name: "Duplicate", email: "fixture@example.invalid", message: "Duplicate",
        submissionKey: "00000000-0000-4000-8000-000000000099",
      }).onConflictDoNothing({ target: leads.submissionKey }).returning();
      check("existing submission-key deduplication retained", () => assert.equal(duplicate.length, 0));
      for (const stage of ["qualified", "quoted", "booked", "completed"] as const) {
        const res = await request(`/api/admin/leads/${id}`, { stage, note: `Fixture ${stage}` });
        assert.equal(res.status, 200);
      }
      let lead = (await tx.select().from(leads).where(eq(leads.id, id)))[0];
      const originalStageDate = lead.stageUpdatedAt.getTime();
      const originalBookedDate = lead.bookedAt!.getTime();
      const savedAttribution = JSON.stringify(lead.attribution);
      check("all milestones and four history transitions persisted", () => {
        assert(lead.qualifiedAt && lead.quotedAt && lead.bookedAt && lead.completedAt);
      });
      assert.equal((await leadHistory(id)).length, 4);
      const res = await request(`/api/admin/leads/${id}`, {
        revenueAmountMinor: 125000, quoteValueMinor: 130000,
        inspectionDate: "2099-01-10", bookingReference: "FIXTURE-ONLY",
      });
      assert.equal(res.status, 200);
      lead = (await tx.select().from(leads).where(eq(leads.id, id)))[0];
      check("value-only update preserves stage timestamps, history and attribution", () => {
        assert.equal(lead.stageUpdatedAt.getTime(), originalStageDate);
        assert.equal(lead.bookedAt!.getTime(), originalBookedDate);
        assert.equal(JSON.stringify(lead.attribution), savedAttribution);
        assert.equal(lead.inspectionDate, "2099-01-10");
      });
      assert.equal((await leadHistory(id)).length, 4);
      const badLost = await request(`/api/admin/leads/${id}`, { stage: "lost" });
      check("lost requires a reason", () => assert.equal(badLost.status, 400));
      await updateLead(id, { stage: "lost", lostReason: "Synthetic reason" });
      await updateLead(id, { stage: "booked" });
      lead = (await tx.select().from(leads).where(eq(leads.id, id)))[0];
      check("reentry retains first booking timestamp and records another transition", () => {
        assert.equal(lead.bookedAt!.getTime(), originalBookedDate); assert(lead.lostAt);
      });
      assert.equal((await leadHistory(id)).length, 6);
      summary = await marketingSummary(filters);
      check("aggregate values, funnel and marketing identifiers are accurate", () => {
        assert.equal(summary.totalLeads, 1); assert.equal(summary.countsByStage.booked, 1);
        assert.equal(summary.funnel.booked, 1); assert.equal(summary.funnel.leadToBookingRate, 1);
        assert.equal(summary.valuesByCurrency[0].quoteValueMinor, 130000);
        assert.equal(summary.valuesByCurrency[0].bookedRevenueMinor, 125000);
        assert.equal(summary.valuesByCurrency[0].completedRevenueMinor, 0);
        assert.equal(summary.attribution.withGclid, 1); assert.equal(summary.attribution.withGbraid, 1);
        assert.equal(summary.attribution.withWbraid, 1); assert.equal(summary.attribution.withAnyClickId, 1);
        assert.equal(summary.attribution.completenessRate, 1);
        const output = JSON.stringify(summary);
        for (const forbidden of ["fixture@example.invalid", "Pipeline fixture", "FIXTURE-ONLY", "fixture-only"]) assert(!output.includes(forbidden));
      });
      const activity = await marketingSummary({ source: "pipeline_test" });
      check("transition activity includes repeat bookings without double-counting unique funnel bookings", () => {
        assert.equal(activity.activity.booked, 2); assert.equal(activity.funnel.booked, 1);
      });
      // Force history persistence to fail after the update; the real SAVEPOINT
      // must roll back both operations, rather than leaving an unlogged stage.
      const nestedTransaction = db.transaction;
      db.transaction = (async callback => tx.transaction(async nested => {
        const insert = nested.insert.bind(nested);
        nested.insert = ((table: unknown) => {
          if (table === leadStageHistory) throw new Error("TEST_HISTORY_FAILURE");
          return insert(table as any);
        }) as typeof nested.insert;
        return callback(nested as any);
      })) as typeof db.transaction;
      try { await assert.rejects(updateLead(id, { stage: "completed" }), /TEST_HISTORY_FAILURE/); }
      finally { db.transaction = nestedTransaction; }
      lead = (await tx.select().from(leads).where(eq(leads.id, id)))[0];
      check("failed history insertion atomically rolls back the stage change", () => assert.equal(lead.stage, "booked"));
      for (const path of ["/api/admin/leads", `/api/admin/leads/${id}/history`, "/api/admin/marketing-summary"]) {
        assert.equal((await request(path, undefined, false)).status, 401);
      }
      assert.equal((await request(`/api/admin/leads/${id}`, { stage: "lost" }, false)).status, 401);
      check("all reporting and editing endpoints reject anonymous access", () => {});
      assert.equal((await request("/api/admin/marketing-summary?from=2026-02-30")).status, 400);
      assert.equal((await request(`/api/admin/leads/${id}`, { attribution: {} })).status, 400);
      assert.equal((await request("/api/admin/leads/0", { stage: "booked" })).status, 400);
      assert.equal((await request("/api/admin/leads/2147483647", { stage: "booked" })).status, 404);
      check("API validation returns explicit errors", () => {});
      const listed = await request("/api/admin/leads?from=2099-01-01&to=2099-01-31&source=pipeline_test&stage=booked");
      const data = await listed.json();
      check("stage/source/date list filters and response compatibility", () => { assert.equal(data.total, 1); assert.equal(data.leads[0].id, id); });
      assert.equal((await listLeads({ ...filters, offset: 25 })).length, 0);
      // No guessed milestones for legacy stages.
      await tx.insert(leads).values({ name: "Legacy", email: "legacy@example.invalid", message: "Legacy",
        leadSource: "pipeline_test", stage: "booked", createdAt: new Date(capturedAt) });
      summary = await marketingSummary(filters);
      check("legacy stage dates are not fabricated", () => {
        assert.equal(summary.legacyLifecycleWithoutTimestamps, 1); assert.equal(summary.funnel.booked, 1);
      });
      // Ensure currencies cannot be silently added together.
      await tx.insert(leads).values({ name: "Other currency", email: "currency@example.invalid", message: "Currency",
        leadSource: "pipeline_test", quoteValueMinor: 100, quoteCurrency: "USD", createdAt: new Date(capturedAt) });
      summary = await marketingSummary(filters);
      check("quote totals are bucketed by currency", () => {
        assert.equal(summary.valuesByCurrency.find(v => v.currency === "USD")!.quoteValueMinor, 100);
        assert.equal(summary.valuesByCurrency.find(v => v.currency === "AED")!.quoteValueMinor, 130000);
      });
    } finally {
      db.select = oldSelect; db.transaction = oldTransaction;
      await new Promise<void>(resolve => server.close(() => resolve()));
    }
    throw rollback;
  });
} catch (error) { if (error !== rollback) throw error; }
finally { /* Pool stays open for the post-rollback preservation check. */ }
const after = await db.select({ total: count() }).from(leads);
const afterHistory = await db.select({ total: count() }).from(leadStageHistory);
check("all synthetic rows and history rolled back; existing records retained", () => {
  assert.deepEqual(after, before); assert.deepEqual(afterHistory, beforeHistory);
});
await pool.end();
console.log(`${passed} lead-pipeline checks passed; no public forms submitted or emails sent.`);