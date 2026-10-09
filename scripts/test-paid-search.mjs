// Run against development only: npx tsx scripts/test-paid-search.mjs https://$REPLIT_DEV_DOMAIN
// Test leads/click logs are removed in finally. Production advertising scripts stay disabled.
// The real route handlers run in an isolated local server with email transport stubbed.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";
import WebSocket from "ws";
import express from "express";
import nodemailer from "nodemailer";
import { eq, like } from "drizzle-orm";
import { contactSubmissions, conversionLogs, insertContactSubmissionSchema } from "../shared/schema.ts";
import { leadStages, leadUpdateSchema } from "../shared/leads.ts";

const base = process.argv[2];
assert(base, "Pass the development preview URL");
const hostname = new URL(base).hostname;
assert(hostname.endsWith(".replit.dev") || ["localhost", "127.0.0.1"].includes(hostname), "Never run test submissions against production");
const { db, pool } = await import("../server/db.ts");
const { storage } = await import("../server/storage.ts");
let notifications = 0;
const originalTransport = nodemailer.createTransport;
nodemailer.createTransport = () => ({ sendMail: async () => { notifications++; } });
const { registerRoutes } = await import("../server/routes.ts");
const testApp = express();
testApp.use(express.json());
const testServer = await registerRoutes(testApp);
await new Promise((resolve) => testServer.listen(0, "127.0.0.1", resolve));
const apiBase = `http://127.0.0.1:${testServer.address().port}`;
const marker = `ug_test_${randomUUID()}`;
const keys = new Set();
const dir = await mkdtemp(path.join(os.tmpdir(), "ug-test-"));
const child = spawn(process.env.CHROMIUM_BIN || "/repl/tools/bin/chromium", [
  "--headless=new", "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage",
  "--remote-debugging-port=0", `--user-data-dir=${dir}`, "about:blank",
], { stdio: "ignore" });
let ws;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

try {
  let port;
  for (let i = 0; i < 100; i++) {
    try { port = (await readFile(path.join(dir, "DevToolsActivePort"), "utf8")).split("\n")[0]; break; } catch {}
    await delay(100);
  }
  assert(port, "Chromium must start");
  const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  ws = new WebSocket(targets.find((target) => target.type === "page").webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { ws.on("open", resolve); ws.on("error", reject); });
  let sequence = 0;
  const pending = new Map();
  const posts = [];
  let failNext = false;
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++sequence;
    pending.set(id, (result) => result.error ? reject(new Error(JSON.stringify(result.error))) : resolve(result.result));
    ws.send(JSON.stringify({ id, method, params }));
  });
  ws.on("message", async (data) => {
    const message = JSON.parse(data);
    if (message.id && pending.has(message.id)) {
      pending.get(message.id)(message);
      pending.delete(message.id);
    }
    if (message.method === "Fetch.requestPaused") {
      const { requestId, request } = message.params;
      if (request.method === "POST") {
        const body = JSON.parse(request.postData);
        posts.push(body);
        keys.add(body.submissionKey);
        if (failNext) {
          failNext = false;
          await send("Fetch.fulfillRequest", {
            requestId, responseCode: 503,
            responseHeaders: [{ name: "Content-Type", value: "application/json" }],
            body: Buffer.from('{"message":"Test server failure"}').toString("base64"),
          });
          return;
        }
      }
      if (request.method === "POST") {
        const response = await fetch(`${apiBase}/api/contact`, {
          method: "POST", headers: { "Content-Type": "application/json" }, body: request.postData,
        });
        await send("Fetch.fulfillRequest", {
          requestId, responseCode: response.status,
          responseHeaders: [{ name: "Content-Type", value: "application/json" }],
          body: Buffer.from(await response.text()).toString("base64"),
        });
      } else {
        await send("Fetch.continueRequest", { requestId });
      }
    }
  });
  const evaluate = async (expression) => {
    const result = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
    return result.result.value;
  };
  const waitFor = async (expression) => {
    for (let i = 0; i < 150; i++) {
      if (await evaluate(expression)) return;
      await delay(100);
    }
    throw new Error(`Timed out: ${expression}`);
  };
  const navigate = async (url) => {
    await send("Page.navigate", { url });
    await waitFor("Boolean(document.querySelector('#dubai-name'))");
  };
  await send("Page.enable");
  await send("Page.addScriptToEvaluateOnNewDocument", { source: "window.__gtagCalls = []; window.gtag = (...args) => window.__gtagCalls.push(args); window.oaiq = () => {};" });
  await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await send("Fetch.enable", { patterns: [{ urlPattern: "*/api/contact", requestStage: "Request" }] });
  const firstUrl = `${base}/locations/dubai?utm_source=google&utm_medium=cpc&utm_campaign=${marker}_first&utm_term=snagging+dubai&utm_content=search&gclid=test_first_gclid&gbraid=test_first_gbraid&wbraid=test_first_wbraid`;
  await navigate(firstUrl);
  const first = await evaluate("JSON.parse(localStorage.getItem('ug_lead_attribution_v1'))");
  assert.equal(first.firstTouch.gclid, "test_first_gclid");
  await evaluate("document.querySelector('a[href=\"/contact\"]').click()");
  await waitFor("Boolean(document.querySelector('#message'))");
  const internal = await evaluate("JSON.parse(localStorage.getItem('ug_lead_attribution_v1'))");
  assert.deepEqual(internal, first, "Internal navigation must retain campaign attribution");
  const lastUrl = `${base}/locations/dubai?utm_source=google&utm_medium=cpc&utm_campaign=${marker}_last&utm_term=villa+snagging+dubai&utm_content=private%40example.invalid&gclid=test_last_gclid&gbraid=test_last_gbraid&wbraid=test_last_wbraid&email=private%40example.invalid&text=private-message#private-fragment`;
  await navigate(lastUrl);
  const attribution = await evaluate("JSON.parse(localStorage.getItem('ug_lead_attribution_v1'))");
  assert.deepEqual(attribution.firstTouch, first.firstTouch, "First touch survives reload and later campaigns");
  assert.equal(attribution.lastTouch.gclid, "test_last_gclid");
  assert.equal(attribution.lastTouch.gbraid, "test_last_gbraid");
  assert.equal(attribution.lastTouch.wbraid, "test_last_wbraid");
  assert.equal(attribution.lastTouch.utm_campaign, `${marker}_last`);
  const fields = { "dubai-name": "Paid Search Test", "dubai-email": `${marker}@example.invalid`, "dubai-phone": "+971500000000", "dubai-community": "Test Dubai community" };
  const fill = async () => {
    await evaluate(`(() => {
      const values = ${JSON.stringify(fields)};
      for (const [id,value] of Object.entries(values)) {
        const input = document.getElementById(id);
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,value);
        input.dispatchEvent(new Event('input',{bubbles:true}));
      }
      const select = document.getElementById('dubai-property-type');
      select.value = 'Villa'; select.dispatchEvent(new Event('change',{bubbles:true}));
    })()`);
    await delay(50);
  };
  const eventCounts = () => evaluate(`(() => {
    const events = (window.dataLayer || []).filter(item => item && item.event);
    return Object.fromEntries(['generate_lead','conversion','whatsapp_click','call_click'].map(name => [name, events.filter(item => item.event === name).length]));
  })()`);
  await fill();
  failNext = true;
  await evaluate("document.querySelector('#dubai-name').form.requestSubmit()");
  await waitFor("Boolean(document.querySelector('#dubai-quote [role=\"alert\"]'))");
  assert.equal(await evaluate("document.querySelector('#dubai-name').value"), fields["dubai-name"]);
  assert.equal((await eventCounts()).conversion, 0, "Failed request must not fire a conversion");
  assert.equal((await eventCounts()).generate_lead, 0);
  await evaluate("document.querySelector('#dubai-name').form.requestSubmit()");
  await waitFor("Boolean(document.querySelector('#dubai-quote [role=\"status\"]'))");
  assert.equal((await eventCounts()).conversion, 0, "Application code must not fire Google Ads conversions");
  assert.equal((await eventCounts()).generate_lead, 0, "Development success must not emit production measurement");
  const request = posts.at(-1);
  assert.deepEqual(request.attribution, attribution);
  const [lead] = await db.select().from(contactSubmissions).where(eq(contactSubmissions.submissionKey, request.submissionKey));
  assert(lead, "Confirmed lead must exist in the database");
  assert.deepEqual(lead.attribution, attribution);
  assert.equal(lead.stage, "new");
  assert.equal(lead.revenueAmountMinor, null, "No fabricated revenue");
  // Production payloads/routing are verified with intercepted Google scripts
  // in test-ga4-business-events.mjs. This real-API fixture stays development-only.
  assert.equal(await evaluate("window.dataLayer.some(item => item.event === 'generate_lead')"), false);
  await evaluate("document.querySelector('#dubai-quote button').click()");
  await fill();
  await evaluate("document.querySelector('#dubai-name').form.requestSubmit()");
  await waitFor("Boolean(document.querySelector('#dubai-quote [role=\"status\"]'))");
  assert.equal(posts.at(-1).submissionKey, request.submissionKey);
  assert.equal((await eventCounts()).conversion, 0);
  assert.equal((await eventCounts()).generate_lead, 0);
  await evaluate(`(async () => { const analytics = await import('/src/lib/analytics.ts'); analytics.installContactClickTracking(); analytics.installContactClickTracking(); })()`);
  await evaluate(`document.addEventListener('click', event => {
    const link = event.target.closest?.('a');
    if (link && (/^tel:/.test(link.href) || link.href.includes('wa.me'))) event.preventDefault();
  }); document.querySelector('a[href="tel:+971585686852"]').click(); document.querySelector('a[href="https://wa.me/971567427634"]').click();`);
  await delay(600);
  assert.deepEqual(await eventCounts(), { generate_lead: 0, conversion: 0, whatsapp_click: 0, call_click: 0 });
  await evaluate(`(() => {
    const business = document.querySelector('a[href="https://wa.me/971567427634"]');
    const nested = document.createElement('span'); business.append(nested); nested.click(); nested.remove();
    const otherPhone = document.createElement('a'); otherPhone.href = 'tel:+971500000000'; document.body.append(otherPhone); otherPhone.click(); otherPhone.remove();
    const share = document.createElement('a'); share.href = 'https://wa.me/?text=share'; document.body.append(share); share.click(); share.remove();
    const otherWhatsapp = document.createElement('a'); otherWhatsapp.href = 'https://wa.me/971500000000'; document.body.append(otherWhatsapp); otherWhatsapp.click(); otherWhatsapp.remove();
  })()`);
  assert.deepEqual(await eventCounts(), { generate_lead: 0, conversion: 0, whatsapp_click: 0, call_click: 0 }, "Development must remain measurement-free");
  await evaluate(`history.replaceState(null, '', '/locations/dubai?utm_source=bing&utm_campaign=${marker}_no_click_id'); document.querySelector('a[href="https://wa.me/971567427634"]').click();`);
  assert.equal((await eventCounts()).whatsapp_click, 0);
  assert.equal(await evaluate("window.__gtagCalls.length"), 0, "Application must not call gtag at all");
  assert.equal(await evaluate("window.dataLayer.some(item => item && item[0] === 'event')"), false, "No development Google business-event commands");
  assert.equal(await evaluate("performance.getEntriesByType('resource').filter(item => item.name.includes('googletagmanager.com')).length"), 0, "Development tests must not send production advertising events");
  for (const stage of leadStages.slice(1)) {
    const updated = await storage.updateContactSubmissionStage(lead.id, { stage, revenueAmountMinor: null });
    assert.equal(updated.stage, stage);
    assert.deepEqual(updated.attribution, attribution, "Lifecycle updates must retain original attribution");
  }
  const unauthorized = await fetch(`${apiBase}/api/admin/leads`);
  assert.equal(unauthorized.status, 401, "Lead PII must be admin-only");
  const unauthorizedUpdate = await fetch(`${apiBase}/api/admin/leads/${lead.id}`, {
    method: "PATCH", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stage: "booked", revenueAmountMinor: null }),
  });
  assert.equal(unauthorizedUpdate.status, 401);
  assert.equal(leadUpdateSchema.safeParse({ stage: "new", revenueAmountMinor: -1 }).success, false);
  assert.equal(leadUpdateSchema.safeParse({ stage: "invented", revenueAmountMinor: null }).success, false);
  assert.equal(leadUpdateSchema.safeParse({ stage: "new", revenueAmountMinor: 12.5 }).success, false);
  assert.equal(leadUpdateSchema.safeParse({ stage: "new", revenueAmountMinor: null, attribution }).success, false, "Stage API rejects attribution edits");
  const publicFields = insertContactSubmissionSchema.parse({ ...request, stage: "completed", revenueAmountMinor: 100 });
  assert.equal("stage" in publicFields, false);
  assert.equal("revenueAmountMinor" in publicFields, false, "Public forms cannot invent outcomes/revenue");
  for (const endpoint of ["/api/consultation", "/api/quick-contact", "/api/sample-report-download", "/api/chat/lead"]) {
    const submissionKey = randomUUID();
    keys.add(submissionKey);
    const body = { name: "Paid Search Test", email: `${marker}@example.invalid`, phone: "+971500000000", type: "booking", serviceType: "Stage 1 snagging", attribution, submissionKey };
    const response = await fetch(apiBase + endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    assert.equal(response.status, 201, `${endpoint} saves successfully`);
    const result = await response.json();
    const [saved] = await db.select().from(contactSubmissions).where(eq(contactSubmissions.id, result.leadId));
    assert.deepEqual(saved.attribution, attribution, `${endpoint} persists attribution`);
    const repeat = await fetch(apiBase + endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    assert.equal(repeat.status, 200);
    assert.equal((await repeat.json()).leadId, result.leadId);
  }
  await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await navigate(lastUrl);
  assert.equal(await evaluate("document.documentElement.scrollWidth <= window.innerWidth"), true, "Mobile must not overflow");
  const primaryVisible = await evaluate(`(() => { const link = document.querySelector('a[href="#dubai-quote"]'); const rect=link.getBoundingClientRect(); return rect.top >= 0 && rect.bottom <= innerHeight; })()`);
  assert(primaryVisible, "Dominant quote action must be above the fold on mobile");
  assert.equal(notifications, 5, "Only one notification per saved lead; transport is stubbed");
  console.log("PASS: Mobile submissions, no development production-measurement events, attribution persistence, lead APIs, lifecycle retention, and admin protection.");
} finally {
  ws?.close();
  child.kill("SIGTERM");
  if (child.exitCode === null) await Promise.race([new Promise((resolve) => child.once("exit", resolve)), delay(2000)]);
  for (const key of keys) await db.delete(contactSubmissions).where(eq(contactSubmissions.submissionKey, key));
  await db.delete(conversionLogs).where(like(conversionLogs.path, `%${marker}%`));
  await new Promise((resolve) => { testServer.close(resolve); testServer.closeAllConnections(); });
  nodemailer.createTransport = originalTransport;
  await pool.end();
  await rm(dir, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
}