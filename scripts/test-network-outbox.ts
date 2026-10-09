// Real PostgreSQL transactions; every fixture is rolled back, all delivery is stubbed.
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { and, eq, sql } from "drizzle-orm";
import { db, pool } from "../server/db";
import { storage } from "../server/storage";
import { contactSubmissions, websiteLeadOutbox as outbox } from "../shared/schema";
import { flushNetworkLeadOutbox } from "../server/networkLeadSync";
import { getNetworkDeliveryHealth } from "../server/networkGatewayHealth";

let passed = 0;
function check(label: string, fn: () => void) { fn(); passed++; console.log("PASS", label); }
const keys = ["URBANGRID_COUNTRY_CODE", "URBANGRID_SITE_DOMAIN", "URBANGRID_NETWORK_CLIENT_CODE",
  "URBANGRID_NETWORK_INTEGRATION_URL", "URBANGRID_NETWORK_INTEGRATION_KEY", "REPLIT_DOMAINS"] as const;
const priorEnv = Object.fromEntries(keys.map(key => [key, process.env[key]]));
const originalFetch = globalThis.fetch;
const rollback = new Error("rollback isolated network fixtures");
try {
  // The environment is changed only within this test process, never via Replit settings.
  Object.assign(process.env, {
    URBANGRID_COUNTRY_CODE: "AE", URBANGRID_SITE_DOMAIN: "urbangrid.ae",
    URBANGRID_NETWORK_CLIENT_CODE: "urbangrid-website", REPLIT_DOMAINS: "urbangrid.ae",
    URBANGRID_NETWORK_INTEGRATION_URL: "https://ewyxbbfktyhmmwocvmqs.supabase.co/functions/v1/urbangrid-integration",
    URBANGRID_NETWORK_INTEGRATION_KEY: "fixture-not-a-real-credential-".repeat(3),
  });
  await db.transaction(async tx => {
    const original = { transaction: db.transaction, select: db.select, update: db.update };
    db.transaction = tx.transaction.bind(tx) as typeof db.transaction;
    db.select = tx.select.bind(tx) as typeof db.select;
    db.update = tx.update.bind(tx) as typeof db.update;
    const prefix = "network-foundation-fixture-" + crypto.randomUUID();
    const fixtureInput = (source = "contact") => ({
      name: prefix, email: "fixture@example.invalid", phone: "", message: "Isolated synthetic fixture; never contact",
      leadSource: source, submissionKey: crypto.randomUUID(),
      attribution: { firstTouch: { landingPage: "https://urbangrid.ae/contact?utm_campaign=isolated-fixture", capturedAt: "2026-10-09T00:00:00Z",
        utm_campaign: "isolated-fixture" }, lastTouch: { landingPage: "https://urbangrid.ae/contact?utm_campaign=isolated-fixture",
        capturedAt: "2026-10-09T00:00:00Z", utm_campaign: "isolated-fixture" } },
    });
    // Keep unrelated development rows outside the fixture worker's due set.
    await tx.update(outbox).set({ nextAttemptAt: new Date("2199-01-01"), updatedAt: new Date("2199-01-01") })
      .where(sql`${outbox.status} <> 'delivered'`);
    let requests = 0;
    let fail = true;
    globalThis.fetch = (async (_url, init) => {
      requests++;
      assert.equal(init?.redirect, "error");
      const event = JSON.parse(init?.body as string);
      assert(event.payload.lead.name.startsWith(prefix), "Refuse to send any existing customer's event");
      return new Response(JSON.stringify({ accepted: !fail }), { status: fail ? 503 : 200 });
    }) as typeof fetch;
    try {
      const input = fixtureInput();
      const first = await storage.saveContactSubmission(input);
      const second = await storage.saveContactSubmission(input);
      check("normal contact persistence and network event commit together", () => {
        assert.equal(first.created, true);
        assert.equal(second.created, false);
        assert.equal(first.submission.id, second.submission.id);
      });
      const id = first.submission.id;
      let rows = await tx.select().from(outbox).where(eq(outbox.contactId, id));
      check("duplicate submission produces exactly one immutable outbox event", () => {
        assert.equal(rows.length, 1);
        assert.equal(rows[0].eventId, `urbangrid-website.lead.created.${id}`);
        assert.equal(rows[0].status, "pending");
        assert.equal((rows[0].envelope as any).payload.attribution.utm_campaign, "isolated-fixture");
      });
      const frozen = JSON.stringify(rows[0].envelope);
      await flushNetworkLeadOutbox();
      rows = await tx.select().from(outbox).where(eq(outbox.contactId, id));
      check("receiver outage retains failed queue with bounded exponential retry", () => {
        assert.equal(rows[0].status, "failed"); assert.equal(rows[0].attempts, 1);
        assert.equal(rows[0].lastError, "HTTP_503"); assert.equal(rows[0].deliveredAt, null);
        assert(rows[0].nextAttemptAt.getTime() > Date.now() + 50000);
      });
      await flushNetworkLeadOutbox();
      check("not-yet-due event is not retried", () => assert.equal(requests, 1));
      fail = false;
      await tx.update(outbox).set({ nextAttemptAt: new Date(0) }).where(eq(outbox.contactId, id));
      await flushNetworkLeadOutbox();
      rows = await tx.select().from(outbox).where(eq(outbox.contactId, id));
      check("due retry succeeds with original payload and one event", () => {
        assert.equal(rows.length, 1); assert.equal(rows[0].status, "delivered"); assert.equal(rows[0].attempts, 2);
        assert(rows[0].deliveredAt); assert.equal(rows[0].lastError, null);
        assert.equal(JSON.stringify(rows[0].envelope), frozen);
      });
      await flushNetworkLeadOutbox();
      check("delivered events are not sent twice by worker", () => assert.equal(requests, 2));
      const stranded = await storage.saveContactSubmission(fixtureInput());
      await tx.update(outbox).set({ status: "sending", attempts: 1, lastError: "abandoned-fixture-lease",
        updatedAt: new Date(Date.now() - 180000) }).where(eq(outbox.contactId, stranded.submission.id));
      await Promise.all([flushNetworkLeadOutbox(), flushNetworkLeadOutbox()]);
      const reclaimed = await tx.select().from(outbox).where(eq(outbox.contactId, stranded.submission.id));
      check("abandoned lease recovered; concurrent cycles do not double-send", () => {
        assert.equal(reclaimed[0].status, "delivered"); assert.equal(reclaimed[0].attempts, 2);
        assert.equal(requests, 3);
      });
      const quarantined = await storage.saveContactSubmission(fixtureInput());
      const q = (await tx.select().from(outbox).where(eq(outbox.contactId, quarantined.submission.id)))[0];
      await tx.update(outbox).set({ envelope: { ...(q.envelope as any),
        payload: { ...(q.envelope as any).payload, countryCode: "GB" } } }).where(eq(outbox.id, q.id));
      await flushNetworkLeadOutbox();
      const rejected = (await tx.select().from(outbox).where(eq(outbox.id, q.id)))[0];
      check("another market's stored payload cannot use UAE credential", () => {
        assert.equal(requests, 3); assert.equal(rejected.status, "failed"); assert.equal(rejected.lastError, "invalid_country_event");
      });
      const waiting = await storage.saveContactSubmission(fixtureInput());
      process.env.URBANGRID_NETWORK_INTEGRATION_KEY = "";
      await flushNetworkLeadOutbox();
      const unclaimed = (await tx.select().from(outbox).where(eq(outbox.contactId, waiting.submission.id)))[0];
      check("missing credential leaves accepted enquiry pending and unclaimed", () => {
        assert.equal(unclaimed.attempts, 0); assert.equal(unclaimed.status, "pending"); assert.equal(requests, 3);
      });
      const health = await getNetworkDeliveryHealth();
      check("operator diagnostic aggregates only, with fail-closed configuration", () => {
        assert.equal(health.configuration.deliveryConfigured, false);
        assert.equal(health.configuration.integrationKeyValidFormat, false);
        assert(!JSON.stringify(health).includes(prefix));
        assert(!JSON.stringify(health).includes("fixture-not-a-real"));
      });
      process.env.URBANGRID_NETWORK_INTEGRATION_KEY = "fixture-not-a-real-credential-".repeat(3);
      for (const source of ["integration_test", "career", "career_application"]) {
        const excluded = await storage.saveContactSubmission(fixtureInput(source));
        assert.equal((await tx.select().from(outbox).where(eq(outbox.contactId, excluded.submission.id))).length, 0);
      }
      check("non-sales integration/career sources do not create Network events", () => {});
      const atomicInput = fixtureInput();
      let rolledBackId: number | undefined;
      try {
        await tx.transaction(async nested => {
          const [lead] = await nested.insert(contactSubmissions).values(atomicInput).returning();
          rolledBackId = lead.id;
          await nested.insert(outbox).values({ contactId: lead.id, eventId: q.eventId,
            clientCode: "urbangrid-website", envelope: {} }); // Force unique-event failure.
        });
        assert.fail("Expected a unique constraint failure");
      } catch (error) { assert.notEqual((error as Error).message, "Expected a unique constraint failure"); }
      check("queue write failure rolls back associated contact insertion", () => assert(rolledBackId));
      assert.equal((await tx.select().from(contactSubmissions).where(and(eq(contactSubmissions.id, rolledBackId!),
        eq(contactSubmissions.submissionKey, atomicInput.submissionKey)))).length, 0);
      check("failed nested transaction leaves no unqueued enquiry", () => {});
    } finally {
      db.transaction = original.transaction; db.select = original.select; db.update = original.update;
      globalThis.fetch = originalFetch;
    }
    throw rollback;
  });
} catch (error) {
  if (error !== rollback) throw error;
} finally {
  globalThis.fetch = originalFetch;
  for (const key of keys) {
    if (priorEnv[key] === undefined) delete process.env[key]; else process.env[key] = priorEnv[key];
  }
  await pool.end();
}
console.log(`${passed} network outbox checks passed; all fixtures rolled back, no emails or external delivery.`);
