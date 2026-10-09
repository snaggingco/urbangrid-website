// Run against development only. All POSTs and the advertising pixel are mocked.
// This exercises actual React UI without submitting leads or recording clicks.
import { spawn } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import assert from "node:assert/strict";
import WebSocket from "ws";

const base = process.argv[2] || `https://${process.env.REPLIT_DEV_DOMAIN}`;
assert(new URL(base).hostname.endsWith(".replit.dev"), "Use the development preview only");
const directory = await mkdtemp(path.join(os.tmpdir(), "ug-consent-browser-"));
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const chromium = spawn("/repl/tools/bin/chromium", [
  "--headless=new", "--no-sandbox", "--disable-dev-shm-usage",
  "--remote-debugging-port=0", `--user-data-dir=${directory}`, "about:blank",
], { stdio: "ignore" });
let socket;
const runtimeErrors = [];

try {
  let port;
  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      port = (await readFile(path.join(directory, "DevToolsActivePort"), "utf8")).split("\n")[0];
      break;
    } catch { await sleep(100); }
  }
  assert(port, "Chromium must start");
  const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  socket = new WebSocket(targets.find(target => target.type === "page").webSocketDebuggerUrl);
  await new Promise(resolve => socket.once("open", resolve));
  let sequence = 0;
  const pending = new Map();
  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = ++sequence;
      pending.set(id, { resolve, reject });
      socket.send(JSON.stringify({ id, method, params }));
    });
  }
  socket.on("message", raw => {
    const message = JSON.parse(raw);
    const request = pending.get(message.id);
    if (request) {
      pending.delete(message.id);
      if (message.error) request.reject(Error(JSON.stringify(message.error)));
      else request.resolve(message.result);
    }
    if (message.method === "Runtime.exceptionThrown") {
      runtimeErrors.push(message.params.exceptionDetails.text);
    }
  });
  async function evaluate(expression) {
    const result = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) {
      throw Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    }
    return result.result.value;
  }
  async function wait(expression) {
    for (let attempt = 0; attempt < 100; attempt++) {
      if (await evaluate(`Boolean(${expression})`)) return;
      await sleep(200);
    }
    throw Error(`Timed out waiting for: ${expression}`);
  }
  // Static first-paint forms/headings precede React. Wait for its commit and
  // the mounted footer before using controls or checking restored UI state.
  const reactReady = `!document.querySelector('#hero-skeleton') && [...document.querySelectorAll('footer button')].some(button => button.textContent.trim() === 'Cookie preferences')`;
  const banner = 'document.querySelector("aside[aria-labelledby=ug-consent-title]")';
  async function choose(label) {
    await evaluate(`[...document.querySelectorAll('aside button')].find(button => button.textContent.trim() === ${JSON.stringify(label)}).click()`);
    await sleep(100);
  }
  const snapshot = () => evaluate(`({
    state: window.urbanGridConsent.getState(),
    commands: window.dataLayer.filter(item => item[0] === 'consent').map(item => ({ operation: item[1], settings: item[2] })),
    pixelCalls: window.__testPixelCalls,
    events: window.dataLayer.filter(item => item.event).map(item => item.event)
  })`);
  const reopen = async () => {
    await wait(reactReady);
    await evaluate(`[...document.querySelectorAll('footer button')].find(button => button.textContent.trim() === 'Cookie preferences').click()`);
  };
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 360, height: 640, deviceScaleFactor: 1, mobile: true });
  await send("Page.addScriptToEvaluateOnNewDocument", { source: `
    window.__testPixelCalls = [];
    window.oaiq = function() { window.__testPixelCalls.push(Array.from(arguments)); };
    const originalFetch = window.fetch;
    window.fetch = function(input, init) {
      const method = (init?.method || input?.method || "GET").toUpperCase();
      if (method !== "GET" && method !== "HEAD") {
        return Promise.resolve(new Response('{"success":true}', {
          status: 200, headers: {"Content-Type":"application/json"}
        }));
      }
      return originalFetch.apply(this, arguments);
    };
  ` });
  await send("Page.navigate", { url: base + "/locations/dubai?utm_source=consent-regression&utm_medium=test&gclid=consent-test" });
  await wait(`${banner} && document.querySelector('#dubai-name')`);
  await sleep(100);
  let state = await snapshot();
  assert.equal(state.state.choice, null);
  assert.equal(state.commands.length, 1);
  assert.equal(state.pixelCalls.length, 0);
  const layout = await evaluate(`(() => {
    const element = ${banner};
    const rect = element.getBoundingClientRect();
    return {
      top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right,
      heights: [...element.querySelectorAll('button')].map(button => button.getBoundingClientRect().height),
      launcherHidden: getComputedStyle(document.querySelector('[data-analytics-region="floating_mobile"]')).visibility === 'hidden'
    };
  })()`);
  assert(layout.top >= 0 && layout.bottom <= 640);
  assert(layout.left >= 0 && layout.right <= 360);
  assert(layout.heights.every(height => height >= 44));
  assert(layout.launcherHidden);
  const attribution = await evaluate(`JSON.parse(localStorage.getItem('ug_lead_attribution_v1'))`);
  assert.equal(attribution.firstTouch.utm_source, "consent-regression");
  assert.equal(attribution.firstTouch.gclid, "consent-test");
  console.log("PASS: Fresh mobile banner, touch targets, collision handling, and original attribution capture");

  assert.equal(await evaluate(`/non[- ]essential/i.test(${banner}.textContent)`), false);
  await choose("Reject");
  assert(!(await evaluate(`Boolean(${banner})`)));
  state = await snapshot();
  assert.equal(state.state.choice, "rejected");
  assert(state.state.persisted);
  assert(Object.values(state.commands.at(-1).settings).every(value => value === "denied"));
  assert.equal(state.events.length, 0);
  await send("Page.reload");
  await wait(`window.urbanGridConsent && document.querySelector('#dubai-name') && (${reactReady})`);
  state = await snapshot();
  assert.equal(state.state.choice, "rejected");
  assert.equal(state.commands.length, 2);
  assert(!(await evaluate(`Boolean(${banner})`)));
  console.log("PASS: Rejection persists, restores denial early, and suppresses repeated prompts");

  await reopen();
  await wait(banner);
  await evaluate(`${banner}.querySelector('a[href="/privacy-policy"]').click()`);
  await wait(`location.pathname === '/privacy-policy' && document.querySelector('main h1')?.textContent.includes('Privacy')`);
  assert(await evaluate(`Boolean(${banner})`));
  console.log("PASS: Privacy Policy link and footer preference reopening");
  await choose("Accept");
  state = await snapshot();
  assert.equal(state.state.choice, "accepted");
  assert(Object.values(state.commands.at(-1).settings).every(value => value === "granted"));
  assert.equal(state.pixelCalls.filter(call => call[0] === "init").length, 0);
  assert.equal(state.events.length, 0);
  await send("Page.reload");
  await wait(`window.urbanGridConsent && document.querySelector('main h1') && (${reactReady})`);
  state = await snapshot();
  assert.equal(state.state.choice, "accepted");
  assert.equal(state.commands.length, 2);
  assert.equal(state.pixelCalls.filter(call => call[0] === "init").length, 0);
  assert(!(await evaluate(`Boolean(${banner})`)));
  console.log("PASS: Acceptance persists and restores all four grants early; development trackers remain disabled");

  await evaluate(`
    document.addEventListener('click', event => {
      if (event.target.closest('a[href^="tel:"], a[href*="wa.me"]')) event.preventDefault();
    }, true);
    document.querySelector('a[href^="https://wa.me/971567427634"]').click();
    document.querySelector('a[href="tel:+971585686852"]').click();
  `);
  state = await snapshot();
  assert.equal(state.events.filter(event => event === "whatsapp_click").length, 0);
  assert.equal(state.events.filter(event => event === "call_click").length, 0);
  assert.equal(state.pixelCalls.filter(call => call[0] === "measure").length, 0);
  assert.equal(state.events.filter(event => event === "generate_lead").length, 0);
  console.log("PASS: Development contact clicks and consent changes emit no production measurement events");

  await send("Page.navigate", { url: base + "/contact" });
  await wait(`document.querySelector('main form') && window.urbanGridConsent?.getState().choice === 'accepted'`);
  assert(!(await evaluate(`Boolean(${banner})`)));
  console.log("PASS: Existing contact form loads with saved preference; no submission");

  await evaluate("localStorage.clear()");
  await send("Page.reload");
  await wait(banner);
  await evaluate(`Object.defineProperty(window, 'localStorage', { configurable: true, get() { throw Error('Blocked test storage'); } }); true`);
  await choose("Accept");
  state = await snapshot();
  assert.equal(state.state.choice, "accepted");
  assert(!state.state.persisted);
  assert(await evaluate(`${banner}.textContent.includes('could not be saved')`));
  assert(await evaluate(`${banner}.textContent.includes('accept optional cookies applies for this visit')`));
  assert.equal(await evaluate(`/non[- ]essential/i.test(${banner}.textContent)`), false);
  await evaluate(`[...document.querySelectorAll('aside button')].find(button => button.textContent.includes('Continue with this choice')).click()`);
  await sleep(100);
  assert(!(await evaluate(`Boolean(${banner})`)));
  assert.deepEqual(runtimeErrors, []);
  console.log("PASS: Blocked storage gives accurate session-only feedback; no runtime exceptions");
} finally {
  socket?.close();
  chromium.kill("SIGTERM");
  if (chromium.exitCode === null) {
    await Promise.race([new Promise(resolve => chromium.once("exit", resolve)), sleep(2000)]);
  }
  await rm(directory, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
}