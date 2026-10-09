import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { once } from "node:events";
import { pool } from "../server/db";
import { websiteMarket } from "../server/network/application";
import { resolveSiteIdentity } from "../server/network/runtime";
import { leadEventMatchesSite } from "../shared/network/outbox";

// Exercise the built production entry point using development data only.
assert.equal(process.env.NODE_ENV, "development");
// Workspace copies can retain a production environment label. Prove the actual
// database target with a fresh marker inserted through executeSql(development).
const developmentMarker = process.env.SAUDI_STARTUP_TEST_DEVELOPMENT_MARKER;
assert.ok(developmentMarker?.startsWith("/__saudi-startup-dev-proof-"));
const proof = await pool.query("SELECT id FROM visitor_logs WHERE path = $1", [developmentMarker]);
assert.equal(proof.rows.length, 1, "Database is not the verified development target; refusing to write fixtures");
assert.equal(websiteMarket(process.env), "SA");
const port = 5107;
const origin = `http://127.0.0.1:${port}`;
const submissionKey = randomUUID();
let leadId: number | undefined;
const credentialsBefore = JSON.stringify((await pool.query(
  "SELECT row_to_json(a) AS record FROM admin_credentials a ORDER BY username",
)).rows);
const child = spawn(process.execPath, ["dist/index.js"], {
  // Simulate publishing, where REPL_ID is not guaranteed to be available.
  env: { ...process.env, NODE_ENV: "production", PORT: String(port), REPL_ID: "",
    REPLIT_DOMAINS: process.env.URBANGRID_MANAGED_DATABASE_SITE_DOMAIN },
  stdio: "ignore", // Never include credentials or customer data in test output.
});
try {
  let ready = false;
  for (let i = 0; i < 80; i++) {
    assert.equal(child.exitCode, null, "Production-mode server exited before readiness");
    try { ready = (await fetch(`${origin}/health`)).status === 200; } catch { /* Wait for startup. */ }
    if (ready) break;
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  assert.equal(ready, true, "Production-mode server did not become ready");
  for (const path of ["/", "/health", "/api/build-info", "/api/blog"]) {
    assert.equal((await fetch(`${origin}${path}`)).status, 200, path);
  }
  for (const path of ["/api/bookings/config", "/api/chat", "/api/stripe/webhook", "/api/checkout"]) {
    assert.equal((await fetch(`${origin}${path}`, { method: "POST" })).status, 503, path);
  }
  assert.equal((await fetch(`${origin}/api/admin/leads`)).status, 401);
  const badContact = await fetch(`${origin}/api/contact`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: "{}",
  });
  assert.equal(badContact.status, 400);
  const body = JSON.stringify({ name: "Saudi startup fixture", email: "startup-fixture@example.invalid",
    phone: "+966500000000", message: "Isolated startup verification fixture", submissionKey });
  const send = () => fetch(`${origin}/api/contact`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body,
  });
  const first = await send();
  const result = await first.json();
  leadId = result.leadId;
  assert.equal(first.status, 201);
  assert.equal(typeof leadId, "number");
  const repeated = await send();
  assert.equal(repeated.status, 200);
  assert.equal((await repeated.json()).leadId, leadId);
  const queued = await pool.query("SELECT envelope FROM website_lead_outbox WHERE contact_id = $1", [leadId]);
  assert.equal(queued.rows.length, 1);
  assert.equal(leadEventMatchesSite(queued.rows[0].envelope, resolveSiteIdentity(process.env)!), true);
  assert.equal(JSON.stringify((await pool.query(
    "SELECT row_to_json(a) AS record FROM admin_credentials a ORDER BY username",
  )).rows), credentialsBefore, "Startup must not rotate existing admin credentials");
  console.log("PASS production-mode startup, root readiness, blog, auth protection, Saudi integration gates, enquiry persistence/deduplication/queue and unchanged admin credentials.");
} finally {
  if (child.exitCode === null) {
    child.kill("SIGTERM");
    await once(child, "exit");
  }
  // Remove only this fixture, including when an assertion fails.
  const fixture = await pool.query("SELECT id FROM contact_submissions WHERE submission_key = $1", [submissionKey]);
  for (const row of fixture.rows) {
    await pool.query("DELETE FROM website_lead_outbox WHERE contact_id = $1", [row.id]);
    await pool.query("DELETE FROM contact_submissions WHERE id = $1", [row.id]);
  }
  await pool.end();
}
