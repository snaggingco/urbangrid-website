// Isolated browser fixture: real site helpers + Google's published scripts.
// ALL browser requests are intercepted. Only Google script GETs are fetched by
// Node; collection requests are recorded and fulfilled locally, never delivered.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import WebSocket from "ws";
import { build } from "esbuild";

const html = await readFile("dist/public/index.html", "utf8");
const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
  .filter(m => !/type=["']module|application\/ld\+json/.test(m[1])).map(m => m[2]);
const consent = scripts.find(s => s.includes('"consent", "default"'));
const gtm = scripts.find(s => s.includes("new Date().getTime(),event:'gtm.js'"));
const pixel = scripts.find(s => s.includes("startPixel"));
const compiled = await build({
  stdin: { contents: `
    import * as analytics from './client/src/lib/analytics';
    import { submitLead } from './client/src/lib/leads';
    import { createBooking } from './client/src/lib/bookingApi';
    import { getAttribution, captureAttribution } from './client/src/lib/attribution';
    captureAttribution(true);
    analytics.installContactClickTracking();
    window.fixture = { ...analytics, submitLead, createBooking, getAttribution };
  `, resolveDir: process.cwd(), loader: "ts" },
  bundle: true, write: false, format: "esm", platform: "browser",
});
const fixtureScript = compiled.outputFiles[0].text;
const baselineCompiled = await build({
  stdin: { contents: `
    import * as analytics from './client/src/lib/analytics';
    import { submitLead } from './client/src/lib/leads';
    import { createBooking } from './client/src/lib/bookingApi';
    import { getAttribution, captureAttribution } from './client/src/lib/attribution';
    captureAttribution(true); analytics.installContactClickTracking();
    window.fixture = { ...analytics, submitLead, createBooking, getAttribution };
  `, resolveDir: process.cwd(), loader: "ts" },
  bundle: true, write: false, format: "esm", platform: "browser",
  plugins: [{ name: "legacy-event-baseline", setup(builder) {
    builder.onLoad({ filter: /ga4BusinessEvents\.ts$/ }, () => ({
      contents: `export function canMeasureBusinessEvents() {
        return ['urbangrid.ae','www.urbangrid.ae'].includes(location.hostname) &&
          window.urbanGridConsent.getState().choice === 'accepted';
      }
      export function sendGa4BusinessEvent(event) { window.dataLayer.push(event); }`,
      loader: "ts",
    }));
  } }],
});
const fixtureHtml = `<!doctype html><html><head><script>${consent}</script>
<script>${pixel}</script></head><body>
<a id="whatsapp" href="https://wa.me/971567427634" target="_blank">WhatsApp</a>
<a id="call" href="tel:+971567427634">Call</a>
<a id="share" href="https://wa.me/?text=share" target="_blank">Share</a>
<form id="example"><input name="fixture_field"></form>
<script>${gtm}</script><script type="module" src="/fixture.js"></script></body></html>`;
const directory = await mkdtemp(path.join(os.tmpdir(), "ug-ga4-fixture-"));
const browser = spawn("/repl/tools/bin/chromium", [
  "--headless=new", "--no-sandbox", "--disable-dev-shm-usage",
  "--remote-debugging-port=0", `--user-data-dir=${directory}`, "about:blank",
], { stdio: "ignore" });
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
let socket;
const googleScripts = new Map();
const requests = [];
let leadResponse = { leadId: 501 };
let apiStatus = 200;
let businessSenderEnabled = true;
let beaconBodies = [];
const errors = [];
try {
  let port;
  for (let i = 0; i < 100; i++) {
    try { port = (await readFile(path.join(directory, "DevToolsActivePort"), "utf8")).split("\n")[0]; break; }
    catch { await sleep(100); }
  }
  assert(port, "Chromium starts");
  const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  socket = new WebSocket(targets.find(t => t.type === "page").webSocketDebuggerUrl);
  await new Promise(resolve => socket.once("open", resolve));
  let sequence = 0;
  const pending = new Map();
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++sequence; pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
  socket.on("message", raw => {
    const message = JSON.parse(raw);
    const promise = pending.get(message.id);
    if (promise) {
      pending.delete(message.id);
      message.error ? promise.reject(Error(message.error.message)) : promise.resolve(message.result);
    }
    if (message.method === "Runtime.exceptionThrown") errors.push(message.params.exceptionDetails.text);
    if (message.method === "Fetch.requestPaused") void intercept(message.params).catch(error => errors.push(error.message));
  });
  async function fulfill(requestId, body, type = "text/javascript", status = 200) {
    await send("Fetch.fulfillRequest", {
      requestId, responseCode: status,
      responseHeaders: [{ name: "Content-Type", value: type }, { name: "Access-Control-Allow-Origin", value: "*" }],
      body: Buffer.from(body).toString("base64"),
    });
  }
  async function intercept({ requestId, request, networkId }) {
    const url = new URL(request.url);
    let body = request.postData || "";
    if (!body && request.postDataEntries) body = request.postDataEntries.map(entry => Buffer.from(entry.bytes || "", "base64").toString()).join("");
    if (!body && request.hasPostData && networkId) {
      try { body = (await send("Network.getRequestPostData", { requestId: networkId })).postData; } catch {}
    }
    requests.push({ url: request.url, method: request.method, body });
    if (url.pathname === "/fixture.js") return fulfill(requestId, businessSenderEnabled ? fixtureScript : baselineCompiled.outputFiles[0].text);
    if (url.pathname === "/fixture-second.js") return fulfill(requestId, fixtureScript);
    if (url.pathname.startsWith("/api/")) return fulfill(requestId, JSON.stringify(leadResponse), "application/json", apiStatus);
    if (request.method === "GET" && url.hostname === "www.googletagmanager.com"
        && ["/gtm.js", "/gtag/js", "/gtag/destination"].includes(url.pathname)) {
      if (!googleScripts.has(request.url)) {
        googleScripts.set(request.url, fetch(request.url).then(async response => {
          assert(response.ok, `Public Google script GET: ${response.status}`);
          return response.text();
        }));
      }
      return fulfill(requestId, await googleScripts.get(request.url));
    }
    if (url.hostname === "bzrcdn.openai.com") return fulfill(requestId, "window.oaiq = function() {};");
    if (url.pathname === "/fixture") return fulfill(requestId, fixtureHtml, "text/html");
    // Google collection, Ads conversions, other third-party resources: NONE
    // leave the browser. Return an empty success to let tags finish locally.
    return fulfill(requestId, "", "text/plain");
  }
  async function evaluate(expression) {
    const source = /\bawait\b/.test(expression) ? `(async () => { ${expression} })()` : expression;
    const result = await send("Runtime.evaluate", { expression: source, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    return result.result.value;
  }
  async function wait(expression) {
    for (let i = 0; i < 100; i++) {
      if (await evaluate(`Boolean(${expression})`)) return;
      await sleep(100);
    }
    throw Error(`Timed out: ${expression}`);
  }
  await send("Page.enable"); await send("Runtime.enable"); await send("Network.enable");
  await send("Fetch.enable", { patterns: [{ urlPattern: "*" }] });
  await send("Page.addScriptToEvaluateOnNewDocument", {
    source: `try { localStorage.clear(); sessionStorage.clear(); } catch (_) {}
      window.__fixtureBeacons = [];
      const beacon = navigator.sendBeacon.bind(navigator);
      navigator.sendBeacon = function(url, data) {
        const record = { url: String(url), body: '' };
        window.__fixtureBeacons.push(record);
        if (data instanceof Blob) data.text().then(text => record.body = text);
        else record.body = String(data || '');
        return beacon(url, data);
      };`,
  });
  async function load(hostname) {
    await send("Page.navigate", { url: "about:blank" });
    requests.length = 0; errors.length = 0; beaconBodies = [];
    leadResponse = { leadId: 501 }; apiStatus = 200;
    await send("Page.navigate", { url: `https://${hostname}/fixture?utm_source=fixture&utm_medium=test&email=private%40example.com` });
    await wait("window.fixture && window.urbanGridConsent");
    await evaluate("document.addEventListener('click', e => e.preventDefault()); localStorage.removeItem('ug_privacy_consent_v1')");
  }
  const events = () => evaluate("window.dataLayer.filter(x => x && x.event && ['whatsapp_click','call_click','generate_lead'].includes(x.event)).map(x=>x.event)");
  const ga4Commands = () => evaluate("window.dataLayer.filter(x => x[0] === 'event').map(x => Array.from(x))");
  const googleRequests = () => requests.filter(r => /googletagmanager\.com|google-analytics\.com|googleadservices\.com|doubleclick\.net|bzr(cdn)?\.openai\.com/.test(new URL(r.url).hostname));
  const collected = () => requests.flatMap(request => {
    if (!new URL(request.url).pathname.endsWith("/g/collect")) return [];
    const query = new URL(request.url).searchParams;
    const body = request.body || beaconBodies.find(b => b.url === request.url)?.body || "";
    const lines = body ? body.split("\n") : [""];
    return lines.map(line => {
      const parameters = new URLSearchParams(query);
      for (const [key, value] of new URLSearchParams(line)) parameters.set(key, value);
      return parameters;
    }).filter(parameters => parameters.get("tid") === "G-ZX4B5QJGB4");
  });
  const businessHits = () => collected().filter(p => ["whatsapp_click", "call_click", "generate_lead"].includes(p.get("en")));
  const adsLabels = () => requests.filter(r => /\/(?:pagead\/)?(?:1p-)?conversion\/11443889137/.test(new URL(r.url).pathname))
    .map(r => new URL(r.url).searchParams.get("label")).filter(Boolean).sort();
  const action = () => evaluate("document.querySelector('#whatsapp').click(); document.querySelector('#call').click();");

  // No choice: no loader, no custom measurement, no replay on later acceptance.
  await load("urbangrid.ae");
  await action();
  await evaluate("fixture.trackLeadSubmission(500, 'contact', fixture.getAttribution())");
  assert.deepEqual(await events(), []);
  assert.deepEqual(await ga4Commands(), []);
  assert.equal(googleRequests().length, 0);
  await evaluate("urbanGridConsent.setChoice('rejected')");
  await action(); assert.equal(googleRequests().length, 0);

  // Baseline: original plain custom-event objects, no explicit GA4 command.
  businessSenderEnabled = false;
  await evaluate("urbanGridConsent.setChoice('accepted')");
  await wait("window.google_tag_manager && window.google_tag_manager['GTM-NGVDWWRF']");
  await sleep(1500);
  requests.length = 0;
  await action();
  await evaluate("await fixture.submitLead('/api/contact', { leadSource: 'contact' })");
  await sleep(2500);
  const baselineAds = adsLabels();
  console.log("Baseline intercepted Ads labels:", baselineAds);
  assert(baselineAds.includes("SwulCOLwwo4dEPHH79Aq"), "Baseline WhatsApp Ads conversion runs");
  assert(baselineAds.includes("0pJuCLfZ8YgbEPHH79Aq") && baselineAds.includes("QkcVCLjAho8dEPHH79Aq"), "Both existing call conversion actions run");
  assert(baselineAds.includes("FQVyCI3QhY8dEPHH79Aq"), "Baseline lead conversion runs");

  // Same actions, one GA4-routed entry each; Ads request paths must be unchanged.
  businessSenderEnabled = true;
  await load("urbangrid.ae");
  // Each fixture page starts with fresh first-party preferences.
  await evaluate("urbanGridConsent.setChoice('accepted')");
  await wait("window.google_tag_manager && window.google_tag_manager['GTM-NGVDWWRF']");
  await sleep(1500);
  requests.length = 0;
  await evaluate("fixture.installContactClickTracking(); fixture.installContactClickTracking()");
  await action();
  await evaluate("await fixture.submitLead('/api/contact', { leadSource: 'contact' }); await fixture.submitLead('/api/contact', { leadSource: 'contact' });");
  await wait("window.dataLayer.filter(x=>x[0]==='event').length===3");
  await sleep(6500);
  beaconBodies = await evaluate("window.__fixtureBeacons");
  assert.deepEqual(await events(), ["whatsapp_click", "call_click", "generate_lead"]);
  const commands = await ga4Commands();
  assert.deepEqual(commands.map(x => x[1]), ["whatsapp_click", "call_click", "generate_lead"]);
  assert(commands.every(x => x[2].send_to === "G-ZX4B5QJGB4"));
  assert(commands.every(x => Object.keys(x[2]).filter(key => key !== "send_to").length <= 25));
  assert(commands.every(x => !JSON.stringify(x[2]).includes("private%40") && !JSON.stringify(x[2]).includes("private@example")));
  assert.equal(await evaluate("dataLayer.filter(x=>x[0]==='event').length"), 3, "One entry per action, not a second push for Ads");
  console.log("Intercepted GA4 business hits:", businessHits().map(p => p.get("en")));
  console.log("With GA4 enabled, intercepted Ads labels:", adsLabels());
  assert.deepEqual(businessHits().map(p => p.get("en")).sort(), ["call_click", "generate_lead", "whatsapp_click"]);
  assert.deepEqual(adsLabels(), baselineAds, "GA4 addition leaves actual intercepted Ads request paths unchanged");
  assert.equal(collected().filter(p => p.get("en") === "page_view").length, 0, "Business sender adds no page view");

  // Invalid IDs, failures, duplicate module instances and retries do not emit.
  await evaluate("for (const id of [0,-1,1.5,NaN]) fixture.trackLeadSubmission(id,'contact',fixture.getAttribution())");
  await evaluate("await import('/fixture-second.js'); fixture.trackLeadSubmission(501,'contact',fixture.getAttribution())");
  assert.equal((await ga4Commands()).length, 3);
  apiStatus = 503;
  await evaluate("await fixture.submitLead('/api/contact',{leadSource:'failed'}).catch(()=>{})");
  apiStatus = 200; leadResponse = { success: true };
  await evaluate("await fixture.submitLead('/api/contact',{leadSource:'missing_id'}).catch(()=>{})");
  leadResponse = { leadId: 0 };
  await evaluate("await fixture.submitLead('/api/contact',{leadSource:'invalid_id'}).catch(()=>{})");
  assert.equal((await ga4Commands()).length, 3);
  // Existing-lead booking does not invent a new lead event.
  leadResponse = { booking: { bookingReference: "fixture" }, createdLead: false, createdBooking: false, leadId: 502 };
  await evaluate("await fixture.createBooking({})");
  assert.equal((await ga4Commands()).length, 3);
  await evaluate("document.querySelector('#share').click()");
  assert.equal((await ga4Commands()).length, 3);
  // A new persisted booking lead emits once; retrying the same ID does not.
  leadResponse = { booking: { bookingReference: "fixture" }, createdLead: true, createdBooking: false, leadId: 502 };
  await evaluate("await fixture.createBooking({}); await fixture.createBooking({})");
  assert.equal((await ga4Commands()).length, 4);
  // Even blocked session storage plus another helper/module cannot duplicate it.
  await evaluate("Object.defineProperty(window, 'sessionStorage', { value: { getItem() { throw Error('blocked'); }, setItem() { throw Error('blocked'); } } }); await import('/fixture-second.js?blocked'); fixture.trackLeadSubmission(502,'contact',fixture.getAttribution())");
  assert.equal((await ga4Commands()).length, 4);
  await sleep(6500);
  beaconBodies = await evaluate("window.__fixtureBeacons");
  assert.equal(businessHits().filter(p => p.get("epn.lead_id") === "502").length, 1);
  await evaluate("urbanGridConsent.setChoice('rejected')");
  const beforeRevocation = businessHits().length;
  await action(); await evaluate("fixture.trackLeadSubmission(503,'contact',fixture.getAttribution())");
  await sleep(1000);
  assert.equal((await ga4Commands()).length, 4);
  assert.equal(businessHits().length, beforeRevocation);
  assert.equal(await evaluate("window['ga-disable-G-ZX4B5QJGB4']"), true);
  assert.equal(await evaluate("dataLayer.filter(x=>x.event==='gtm.js').length"), 1);
  assert.equal(await evaluate("dataLayer.some(x=>x[0]==='event'&&x[1]==='form_start')"), false);
  assert.deepEqual(errors, []);

  // Explicit accepted consent still cannot enable trackers on a non-live host.
  for (const hostname of ["localhost", "127.0.0.1", "fixture.replit.dev", "fixture.repl.co", "fixture.replit.app", "example.com"]) {
    await load(hostname);
    await evaluate("urbanGridConsent.setChoice('accepted')");
    await action(); await evaluate("fixture.trackLeadSubmission(504,'contact',fixture.getAttribution())");
    await sleep(100);
    assert.equal(googleRequests().length, 0, `${hostname}: no production trackers`);
    assert.deepEqual(await events(), []);
    assert.deepEqual(await ga4Commands(), []);
  }
  await load("www.urbangrid.ae");
  await evaluate("urbanGridConsent.setChoice('accepted')");
  await action(); await sleep(6500);
  beaconBodies = await evaluate("window.__fixtureBeacons");
  assert.deepEqual(businessHits().map(p=>p.get("en")).sort(), ["call_click", "whatsapp_click"]);
  await evaluate(`(() => {
    const booking = { id: 901, leadId: 9901, currency: 'AED', quoteTotalMinor: 999999,
      payments: [
        { id: 901, paymentType: 'full', amountMinor: 12500, status: 'completed', provider: 'ziina', completedAt: '2026-10-04T12:00:00Z', verifiedOnline: true },
        { id: 902, paymentType: 'full', amountMinor: 99999, status: 'pending', provider: 'ziina', completedAt: null, verifiedOnline: false },
        { id: 903, paymentType: 'full', amountMinor: 99999, status: 'completed', provider: 'ziina', completedAt: '2026-10-04T12:00:00Z', verifiedOnline: false },
        { id: 904, paymentType: 'refund', amountMinor: 99999, status: 'completed', provider: 'cash', completedAt: '2026-10-04T12:00:00Z', verifiedOnline: false }
      ] };
    fixture.trackConfirmedBooking(booking); fixture.trackConfirmedBooking(booking);
    fixture.trackVerifiedPayments(booking); fixture.trackVerifiedPayments(booking);
    fixture.trackEngagement('form_start', 'residential_booking');
    fixture.trackEngagement('click', 'footer_navigation');
  })()`);
  const stages = await evaluate("Array.from(dataLayer).filter(x => x[0] === 'event' && ['booking_confirmed','purchase','form_start','click'].includes(x[1])).map(x => [x[1],x[2],x.is_primary_business_conversion])");
  assert.deepEqual(stages.map(x => x[0]), ["booking_confirmed", "purchase", "form_start", "click"]);
  assert.deepEqual(stages.map(x => x[2]), [true, true, false, false]);
  assert.equal(stages[0][1].value, undefined, "Booking quote is never collected revenue");
  assert.equal(stages[1][1].value, 125);
  assert.equal(stages[1][1].transaction_id, "ug-ae-payment-901");
  assert(stages.every(x => x[1].send_to === "G-ZX4B5QJGB4"));
  await sleep(6500);
  beaconBodies = await evaluate("window.__fixtureBeacons");
  assert.deepEqual(collected().filter(p => ["booking_confirmed", "purchase"].includes(p.get("en")))
    .map(p => p.get("en")).sort(), ["booking_confirmed", "purchase"]);
  assert.deepEqual(errors, []);
  console.log("PASS commercial stages: one confirmed booking and verified actual payment, no quote/test/pending/refund revenue, stable transaction IDs, preserved non-primary engagement.");
  console.log("PASS: Real Google scripts generated exactly one intercepted GA4 hit per business event, unchanged Ads request paths, preserved GTM events, post-success/deduplicated leads, invalid/failure/retry checks, consent denial/revocation, both live hosts, and six non-live host exclusions. No collection requests delivered.");
} finally {
  socket?.close(); browser.kill("SIGTERM");
  await new Promise(resolve => browser.once("exit", resolve));
  await rm(directory, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 });
}