// Actual production bundle, isolated localhost fixture server, no database,
// real identity, notifications, public submissions or external network access.
import express from "express";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import WebSocket from "ws";
import { renderAdmin } from "./test-admin-spa.mjs";

const metrics = { leads: 2, bookedLeads: 1, eligibleBookings: 1, leadToBookingRate: .5,
  bookedValueMinor: 105000, completedServiceValueMinor: 0, netCashCollectedMinor: 0,
  outstandingMinor: 105000, averageBookedValueMinor: 105000, gclidLeads: 1, gclidRate: .5 };
const report = { range: { from: "2026-10-04", to: "2026-10-31", timezone: "Asia/Dubai", basis: "lead_created_date_cohort" },
  attributionModel: "first_touch", currency: "AED", totals: metrics,
  groups: [{ ...metrics, source: "google", medium: "cpc", campaign: "SYNTHETIC CAMPAIGN" }], notes: [] };
const lead = { id: 11, name: "Synthetic original enquiry", email: "fixture@example.invalid", phone: null,
  stage: "new", createdAt: "2026-10-04T00:00:00Z" };
let posted, reportMode = "normal", authorized = true;
let integrationMode = "normal", retryShouldFail = true, retryRequests = 0;
let syntheticFixture = null, sendTestRequests = 0, cleanupRequests = 0;
const integrationEvent = { eventId: "urbangrid.development.booking.created.v1.41", bookingId: 41,
  bookingReference: "UG-OPS-FIXTURE", status: "failed", attempts: 3,
  lastAttemptAt: "2026-10-04T10:00:00Z", httpStatus: 503, errorCode: "HTTP_503",
  nextAttemptAt: "2026-10-04T11:00:00Z", deliveredAt: null, createdAt: "2026-10-04T09:00:00Z",
  lastFailureAt: "2026-10-04T10:00:00Z", lastFailureCode: "HTTP_503", lastFailureHttpStatus: 503 };
const fixtureFingerprint = "a".repeat(64);
const reportRequests = [];
let reconcileRequests = 0, reconcileShouldFail = true;
const returnReference = "UG-2026-ABCDEF123456";
const returnBooking = {
  id: 42, leadId: 7, bookingReference: returnReference, service: "new-build-snagging",
  propertyType: "Apartment", areaSqft: 1000, bedrooms: null, project: "Synthetic property",
  location: "Synthetic community", emirate: "Dubai", inspectionDate: "2099-01-03",
  timeWindow: null, status: "booked", leadStage: "booked", baseMinor: 100000, vatMinor: 5000,
  quoteTotalMinor: 105000, currency: "AED", cashCollectedMinor: 0, amountOutstandingMinor: 105000,
  paymentStatus: "unpaid", paymentSetup: "online payment setup pending", reportStatus: "Awaiting payment",
  inspectionCompletedAt: "2026-10-04T12:00:00Z", payments: [],
  operations: { status: "qa_approved", version: 4, lastReconciledAt: "2026-10-04T12:30:00Z" },
};
const app = express(); app.use(express.json());
app.use("/api", (req, res) => {
  res.set("Cache-Control", "no-store");
  if (req.path === "/auth/user") return authorized ? res.json({ id: "fixture", role: "admin", email: "admin@example.invalid" }) : res.status(401).json({});
  if (req.path === "/admin/acquisition") {
    reportRequests.push(req.query);
    if (reportMode === "error") return res.status(500).json({ message: "Synthetic report error" });
    return res.json(reportMode === "empty" ? { ...report, groups: [], totals: { ...metrics, leads: 0 } } : report);
  }
  if (req.path === "/admin/integrations/operations/status") {
    if (integrationMode === "error") return res.status(503).json({ message: "Synthetic diagnostic error" });
    const empty = integrationMode === "empty", configured = integrationMode !== "unconfigured";
    return res.json({ integration: "strata-surveyor", schemaVersion: 1, environment: integrationMode === "production" ? "production" : "development",
      developmentTestsAvailable: integrationMode !== "production",
      configured, endpoint: "https://operations.example.invalid/api/events", keyConfigured: configured,
      statusReconciliationConfigured: configured,
      developmentVerification: integrationMode === "healthy" ? { healthy: true, checkedAt: "2026-10-04T22:30:00Z" } : null,
      configurationIssue: configured ? null : "INTEGRATION_KEY_MISSING", keyFingerprint: configured ? fixtureFingerprint : null,
      counts: { pending: empty ? 0 : integrationEvent.status === "pending" ? 1 : 0,
        failed: empty ? 0 : integrationEvent.status === "failed" ? 1 : 0, delivered: syntheticFixture ? 1 : 0, processing: 0, awaitingEnqueue: 0 },
      lastDelivery: empty ? null : syntheticFixture || integrationEvent, workerRunning: true,
      lastWorkerTickAt: "2026-10-04T10:30:00Z", retryPolicy: "Automatic bounded backoff.",
      events: empty ? [] : [syntheticFixture, integrationEvent].filter(Boolean) });
  }
  if (req.method === "POST" && req.path === `/admin/integrations/operations/reconcile/${integrationEvent.bookingId}`) {
    assert.equal(req.get("x-csrf-token"), "fixture-only");
    assert.equal(req.get("x-urbangrid-key"), undefined);
    assert.deepEqual(req.body, {});
    reconcileRequests++;
    if (reconcileShouldFail) return res.status(502).json({ message: "RAW_SECRET_SHOULD_NEVER_RENDER" });
    integrationEvent.lifecycleStatus = "qa_approved";
    integrationEvent.lastReconcileAt = "2026-10-04T12:30:00Z";
    return res.json({ applied: true, status: "qa_approved" });
  }
  if (req.path === `/bookings/${returnReference}`) return res.json({ booking: returnBooking });
  if (req.method === "POST" && req.path === "/admin/integrations/operations/test") {
    assert.equal(req.get("x-csrf-token"), "fixture-only");
    assert.equal(req.get("x-urbangrid-key"), undefined);
    assert.deepEqual(req.body, {});
    sendTestRequests++;
    syntheticFixture = { ...integrationEvent, eventId: "urbangrid.development.booking.created.v1.99",
      bookingId: 99, bookingReference: "UG-TEST-ONLY", status: "delivered", isIntegrationTest: true,
      deliveredAt: "2026-10-04T12:00:00Z", receiverIdentifiers: {
        orderId: "11111111-1111-4111-8111-111111111111",
        jobId: "22222222-2222-4222-8222-222222222222",
        projectId: "33333333-3333-4333-8333-333333333333",
      } };
    return res.status(202).json({ created: true, eventId: syntheticFixture.eventId, bookingId: 99 });
  }
  if (req.method === "POST" && req.path === "/admin/integrations/operations/events/urbangrid.development.booking.created.v1.99/cleanup") {
    assert.equal(req.get("x-csrf-token"), "fixture-only");
    assert.equal(req.get("x-urbangrid-key"), undefined);
    assert.deepEqual(req.body, { confirm: true });
    cleanupRequests++;
    syntheticFixture = null;
    return res.json({ ok: true, receiverRecordsDeleted: false });
  }
  if (req.method === "POST" && req.path === `/admin/integrations/operations/events/${integrationEvent.eventId}/retry`) {
    assert.equal(req.get("x-csrf-token"), "fixture-only");
    assert.equal(req.get("x-urbangrid-key"), undefined, "Browser must never send integration key");
    assert.deepEqual(req.body, {});
    retryRequests++;
    if (retryShouldFail) return res.status(503).json({ message: "RAW_SECRET_SHOULD_NEVER_RENDER" });
    integrationEvent.status = "pending";
    return res.json({ ok: true, eventId: integrationEvent.eventId });
  }
  if (req.path === "/admin/booking-leads") return res.json({ leads: [lead] });
  if (req.path === "/bookings/config") return res.json({ csrfToken: "fixture-only" });
  if (req.path === "/admin/bookings") {
    if (req.method === "POST") {
      posted = req.body;
      return res.json({ booking: { bookingReference: "UG-FIXTURE-ONLY" } });
    }
    return res.json({ bookings: [], summary: { bookedValueMinor: 0, cashCollectedMinor: 0,
      paymentOutstandingMinor: 0, completedRevenueMinor: 0, bySource: [] },
      paymentSetup: { onlinePaymentEnabled: false, testMode: true, webhookEnabled: false }, notes: [] });
  }
  return res.status(401).json({ message: "No other fixture APIs permitted" });
});
app.use(express.static("dist/public", { index: false }));
app.get("/admin/*", (req, res) => res.type("html").send(renderAdmin(req.path).body));
const publicHtml = await readFile("dist/public/index.html", "utf8");
app.get("/book-inspection/return", (_req, res) => res.type("html").send(publicHtml));
const server = app.listen(0, "127.0.0.1"); await new Promise(r => server.once("listening", r));
const base = `http://127.0.0.1:${server.address().port}`;
const directory = await mkdtemp(path.join(os.tmpdir(), "ug-ops-ui-"));
const browser = spawn("/repl/tools/bin/chromium", ["--headless=new", "--no-sandbox", "--disable-dev-shm-usage",
  "--remote-debugging-port=0", `--user-data-dir=${directory}`, "about:blank"], { stdio: "ignore" });
const sleep = ms => new Promise(r => setTimeout(r, ms));
let socket;
try {
  let port;
  for (let i = 0; i < 100; i++) {
    try { port = (await readFile(path.join(directory, "DevToolsActivePort"), "utf8")).split("\n")[0]; break; }
    catch { await sleep(100); }
  }
  assert(port);
  const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  socket = new WebSocket(targets.find(t => t.type === "page").webSocketDebuggerUrl);
  await new Promise(r => socket.once("open", r));
  let sequence = 0; const pending = new Map(); const exceptions = [];
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++sequence; pending.set(id, { resolve, reject }); socket.send(JSON.stringify({ id, method, params }));
  });
  socket.on("message", raw => {
    const message = JSON.parse(raw), promise = pending.get(message.id);
    if (promise) { pending.delete(message.id); message.error ? promise.reject(Error(message.error.message)) : promise.resolve(message.result); }
    if (message.method === "Runtime.exceptionThrown") exceptions.push(message.params.exceptionDetails.text);
    if (message.method === "Fetch.requestPaused") {
      const { requestId, request } = message.params;
      void send(request.url.startsWith(base + "/") ? "Fetch.continueRequest" : "Fetch.failRequest",
        { requestId, ...(request.url.startsWith(base + "/") ? {} : { errorReason: "Aborted" }) });
    }
  });
  async function evaluate(expression) {
    const result = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    return result.result.value;
  }
  async function wait(expression) {
    for (let i = 0; i < 100; i++) {
      if (await evaluate(`(() => { try { return !!(${expression}); } catch { return false; } })()`)) return;
      await sleep(100);
    }
    throw Error("UI assertion timed out: " + expression);
  }
  const click = label => evaluate(`[...document.querySelectorAll('button')].find(b => b.textContent.trim() === ${JSON.stringify(label)}).click()`);
  async function field(label, value) {
    await evaluate(`(() => { const e = [...document.querySelectorAll('label')].find(l => l.textContent.trim().startsWith(${JSON.stringify(label)})).querySelector('input');
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(e, ${JSON.stringify(value)});
      e.dispatchEvent(new Event('input', {bubbles:true})); e.dispatchEvent(new Event('change', {bubbles:true})); })()`);
  }
  await send("Runtime.enable"); await send("Page.enable");
  await send("Fetch.enable", { patterns: [{ urlPattern: "*" }] });
  await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await send("Page.navigate", { url: base + "/admin/acquisition" });
  await wait(`document.querySelector('table')?.innerText.includes('SYNTHETIC CAMPAIGN')`);
  await wait("document.body.innerText.includes('UG-OPS-FIXTURE')");
  const diagnostics = "[aria-label=\"Operations integration delivery diagnostics\"]";
  assert(!(await evaluate("document.body.innerText")).includes("Cleanup test"), "Ordinary bookings cannot be cleaned up");
  assert((await evaluate(`document.querySelector(${JSON.stringify(diagnostics)}).innerText`)).includes(fixtureFingerprint));
  assert((await evaluate(`document.querySelector(${JSON.stringify(diagnostics)}).innerText`)).includes("HTTP_503"));
  await click("Retry");
  await wait("document.body.innerText.includes('Retry was not accepted (HTTP 503)')");
  assert(!(await evaluate("document.body.innerText")).includes("RAW_SECRET_SHOULD_NEVER_RENDER"));
  retryShouldFail = false;
  await click("Retry");
  await wait(`document.querySelector('table[aria-label="Operations outbox management"] tbody tr').innerText.toLowerCase().includes('pending')`);
  assert.equal(retryRequests, 2);
  assert(await evaluate(`document.querySelector('table[aria-label="Operations outbox management"] tbody button').disabled`));
  assert(await evaluate(`document.querySelector('[aria-label="Read-only operations diagnostics"]').querySelectorAll('button').length === 0`));
  integrationMode = "unconfigured";
  await click("Refresh status");
  await wait("document.body.innerText.includes('INTEGRATION_KEY_MISSING')");
  assert(await evaluate("[...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Send test event').disabled"));
  assert(!(await evaluate(`document.querySelector(${JSON.stringify(diagnostics)}).innerText`)).includes(fixtureFingerprint));
  integrationMode = "error";
  await click("Refresh status");
  await wait("document.body.innerText.includes('Could not load delivery diagnostics')");
  integrationMode = "normal";
  await click("Refresh status");
  await wait("document.body.innerText.includes('UG-OPS-FIXTURE')");
  await click("Send test event");
  await wait("document.body.innerText.includes('UG-TEST-ONLY')");
  assert.equal(sendTestRequests, 1);
  for (const label of ["Receiver Order:", "Receiver Job:", "Receiver Project:", "INTEGRATION_TEST"]) {
    assert((await evaluate("document.body.innerText")).includes(label));
  }
  await click("Cleanup test");
  await wait("document.body.innerText.includes('Strata receiver records are not deleted')");
  assert.equal(cleanupRequests, 0, "Cleanup requires explicit confirmation");
  await click("Cancel");
  assert.equal(cleanupRequests, 0);
  await click("Cleanup test"); await click("Confirm cleanup");
  await wait("!document.body.innerText.includes('UG-TEST-ONLY')");
  assert.equal(cleanupRequests, 1);
  assert((await evaluate("document.body.innerText")).includes("UG-OPS-FIXTURE"));
  integrationEvent.status = "delivered";
  integrationEvent.receiverIdentifiers = { orderId: "ORDER-42", jobId: "JOB-42", projectId: "PROJECT-42" };
  await click("Refresh status");
  await wait("document.body.innerText.includes('JOB-42')");
  await click("Reconcile");
  await wait("document.body.innerText.includes('No result was confirmed')");
  assert(!(await evaluate("document.body.innerText")).includes("RAW_SECRET_SHOULD_NEVER_RENDER"));
  reconcileShouldFail = false;
  await click("Reconcile");
  await wait("document.body.innerText.includes('qa_approved')");
  assert.equal(reconcileRequests, 2);
  integrationMode = "unconfigured"; await click("Refresh status");
  await wait("document.body.innerText.includes('Pending configuration')");
  assert(!(await evaluate(`document.querySelector(${JSON.stringify(diagnostics)}).innerText`)).includes("Reconcile\n"));
  integrationMode = "normal"; await click("Refresh status");
  await wait("document.body.innerText.includes('Reconcile')");
  integrationMode = "production"; await click("Refresh status");
  await wait("document.body.innerText.includes('production · schema')");
  assert(!(await evaluate("document.body.innerText")).includes("Send test event"));
  integrationMode = "normal"; await click("Refresh status");
  await wait("document.body.innerText.includes('Send test event')");
  const text = await evaluate("document.body.innerText");
  for (const label of ["Lead creation cohort", "Eligible bookings", "Completed service", "Net cash", "Outstanding", "Average booked", "GCLID", "Unknown", "first-touch"]) {
    assert(text.toLowerCase().includes(label.toLowerCase()), `Acquisition UI must define/display ${label}`);
  }
  await field("Created from", "2026-10-04"); await field("Created to", "2026-10-31");
  await sleep(400);
  assert(reportRequests.some(q => q.from === "2026-10-04" && q.to === "2026-10-31"));
  await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  assert(await evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), "Report must not overflow the mobile viewport");
  reportMode = "empty"; integrationMode = "empty"; await send("Page.reload");
  await wait("document.body.innerText.includes('No eligible enquiries')");
  await wait("document.body.innerText.includes('No booking events yet')");
  reportMode = "error"; await send("Page.reload");
  await wait("!!document.querySelector('[role=alert]')");
  await wait("document.body.innerText.includes('No booking events yet')");
  assert((await evaluate("document.body.innerText")).includes("Retry"));
  reportMode = "normal"; await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await send("Page.navigate", { url: base + "/admin/bookings" });
  await wait(`document.body.innerText.includes('New offline booking')`);
  await click("＋ New offline booking"); await click("Link existing enquiry");
  await field("Search sales enquiries", "fixture");
  await wait("document.body.innerText.includes('Synthetic original enquiry')");
  await evaluate(`[...document.querySelectorAll('li button')].find(b=>b.textContent.includes('Synthetic original enquiry')).click()`);
  await wait("document.body.innerText.toLowerCase().includes('original enquiry selected')");
  assert(await evaluate(`[...document.querySelectorAll('input[type=email]')].some(e=>e.readOnly && e.value==='fixture@example.invalid')`));
  for (const [label, value] of [["Area", "1000"], ["Project", "SYNTHETIC PROPERTY"], ["Location", "FIXTURE ONLY"], ["Inspection date", "2099-02-01"]]) await field(label, value);
  await evaluate("document.querySelector('form').requestSubmit()");
  await wait("document.body.innerText.includes('UG-FIXTURE-ONLY')");
  assert.equal(posted.existingLeadId, lead.id); assert.equal(posted.name, lead.name);
  assert.equal(posted.email, lead.email); assert.equal(posted.phone, ""); assert(!posted.attribution);
  assert(await evaluate("![...(window.dataLayer||[])].some(e=>['generate_lead','lead_submission','booking_confirmed','payment_completed'].includes(e.event))"),
    "Admin fixture workflow must not emit customer conversion events");
  await click("Link existing enquiry"); await field("Search sales enquiries", "fixture");
  await wait("document.body.innerText.includes('Synthetic original enquiry')");
  await evaluate(`[...document.querySelectorAll('li button')].find(b=>b.textContent.includes('Synthetic original enquiry')).click()`);
  await click("New enquiry"); await sleep(100);
  assert(await evaluate(`[...document.querySelectorAll('input[type=email]')].some(e=>!e.readOnly && e.value==='')`));
  authorized = false; await send("Page.navigate", { url: base + "/admin/acquisition" });
  await wait("document.body.innerText.includes('Admin sign in')");
  await send("Page.navigate", { url: base + `/book-inspection/return?booking=${returnReference}` });
  await wait(`document.body.innerText.includes('${returnReference}')`);
  await wait("document.body.innerText.includes('qa_approved')");
  const customerCopy = await evaluate("document.body.innerText");
  assert(customerCopy.includes("Awaiting payment"));
  assert(!customerCopy.includes("payment cleared"));
  assert(customerCopy.includes("does not confirm payment"));
  await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  assert(await evaluate("document.documentElement.scrollWidth <= innerWidth + 1"));
  assert.equal(exceptions.length, 0, "No uncaught JavaScript exceptions");
  integrationMode = "healthy";
  authorized = true;
  await send("Page.navigate", { url: base + "/admin/acquisition" });
  await wait("document.body.innerText.includes('Development integration healthy')");
  assert(await evaluate("document.body.innerText.includes('Real Development verification:')"));
  console.log("PASS durable Development health status renders with real-verification timestamp.");
  console.log("PASS actual admin UI: report dates/metrics/empty/error, mobile layout, protected access, existing lead selection and payload, fresh enquiry reset and no customer conversion events. Fixtures only.");
  console.log("PASS operations diagnostics UI: fingerprint/endpoint/counts/errors, secret-safe CSRF retry, disabled non-failed retries, unconfigured/error/empty states, diagnostics independent of acquisition failures and mobile containment.");
  console.log("PASS synthetic test UI: Development-only availability, disabled unconfigured sending, CSRF test action, receiver IDs, explicit cleanup/cancel, ordinary-record protection and production hiding.");
  console.log("PASS lifecycle UI: normal receiver IDs, CSRF reconcile success/safe failure/configuration, private booking query, operational status separate from unpaid/report gate, mobile containment.");
} catch (error) {
  console.error("FAIL fixture UI:", error.message);
  throw error;
} finally {
  socket?.close();
  const exited = new Promise(resolve => browser.once("exit", resolve));
  if (browser.exitCode === null && browser.signalCode === null) { browser.kill("SIGKILL"); await exited; }
  await new Promise(r => server.close(r));
  await rm(directory, { recursive: true, force: true, maxRetries: 10, retryDelay: 100 });
}