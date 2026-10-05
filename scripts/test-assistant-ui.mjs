// Production browser fixture. Chat uses real deterministic knowledge, with
// injected transport failures. No app startup, credentials, leads or payments.
import assert from "node:assert/strict";
import fs from "node:fs";
import fsp from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import { spawn } from "node:child_process";
import express from "express";
import WebSocket from "ws";
import ts from "typescript";
import { renderPublic } from "./test-admin-spa.mjs";

const require = createRequire(import.meta.url);
function load(file, imports = {}) {
  const exports = {};
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
  }).outputText, { exports, require: n => imports[n] ?? require(n), console });
  return exports;
}
const pricing = load("shared/inspectionPricing.ts");
const knowledge = load("server/assistantKnowledge.ts", {
  "@shared/inspectionPricing": pricing,
  "@shared/publicFAQs": load("shared/publicFAQs.ts"),
  "@shared/companyRegistration": load("shared/companyRegistration.ts"),
  "./residentialChat": load("server/residentialChat.ts", { "@shared/inspectionPricing": pricing }),
});
const app = express();
app.use(express.json());
let mode = "ok", requests = 0, blockedSubmissions = 0;
app.get("/api/auth/user", (_req, res) => res.sendStatus(401));
app.get("/api/stats", (_req, res) => res.json({}));
app.post("/api/chat", async (req, res) => {
  requests++;
  const messages = req.body.messages;
  const text = messages.at(-1).content;
  const reply = knowledge.verifiedAssistantReply(text, messages.slice(0, -1)) || "Please confirm access and availability with our team at /contact.";
  const currentMode = mode;
  if (currentMode === "timeout") return;
  if (currentMode === "http-error") return res.status(503).json({ error: "Unavailable" });
  res.type("text/event-stream");
  if (currentMode === "sse-error") return res.end('data: {"error":"Chat unavailable"}\n\n');
  if (currentMode === "empty") return res.end('data: {"done":true}\n\n');
  if (currentMode === "delay") await new Promise(r => setTimeout(r, 600));
  const packet = `data: ${JSON.stringify({ content: reply })}\n\ndata: {"done":true}\n\n`;
  // Exercise split SSE frames and UTF-8 decoding.
  res.write(packet.slice(0, 19));
  setTimeout(() => res.end(packet.slice(19)), 20);
});
app.use("/api", (req, res) => {
  if (req.method === "POST") blockedSubmissions++;
  res.sendStatus(405);
});
app.use("/assets", (req, _res, next) => {
  if (/ChatWidget-/.test(req.path)) setTimeout(next, 500);
  else next();
});
app.use(express.static(process.env.AUDIT_BUILD_DIR || "dist/public", { index: false }));
for (const p of ["/", "/about", "/services", "/pricing", "/sample-report", "/contact", "/book-inspection"]) {
  app.get(p, (_req, res) => res.type("html").send(process.env.AUDIT_BUILD_DIR || ["/pricing", "/sample-report"].includes(p)
    ? fs.readFileSync(path.join(process.env.AUDIT_BUILD_DIR || "dist/public", "index.html"), "utf8")
    : renderPublic(p).body));
}
const server = await new Promise(resolve => { const s = app.listen(0, "127.0.0.1", () => resolve(s)); });
const base = `http://127.0.0.1:${server.address().port}`;
const dir = await fsp.mkdtemp(path.join(os.tmpdir(), "ug-assistant-ui-"));
const chrome = spawn("/repl/tools/bin/chromium", [
  "--headless=new", "--no-sandbox", "--disable-dev-shm-usage",
  "--remote-debugging-port=0", `--user-data-dir=${dir}`, "about:blank",
], { stdio: "ignore" });
const sleep = ms => new Promise(r => setTimeout(r, ms));
let socket;
const errors = [];
try {
  let port;
  for (let i = 0; i < 100; i++) {
    try { port = (await fsp.readFile(path.join(dir, "DevToolsActivePort"), "utf8")).split("\n")[0]; break; }
    catch { await sleep(100); }
  }
  assert(port);
  const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  socket = new WebSocket(targets.find(t => t.type === "page").webSocketDebuggerUrl);
  await new Promise(r => socket.once("open", r));
  let id = 0;
  const pending = new Map();
  socket.on("message", raw => {
    const m = JSON.parse(raw);
    if (m.method === "Runtime.exceptionThrown") errors.push(m.params.exceptionDetails.text);
    if (pending.has(m.id)) {
      const p = pending.get(m.id); pending.delete(m.id);
      m.error ? p.reject(Error(m.error.message)) : p.resolve(m.result);
    }
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    pending.set(++id, { resolve, reject }); socket.send(JSON.stringify({ id, method, params }));
  });
  const ev = async expression => {
    const r = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) throw Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
    return r.result.value;
  };
  const wait = async (expression, timeout = 12000) => {
    for (let n = 0; n < timeout / 100; n++) { if (await ev(expression)) return; await sleep(100); }
    throw Error(`Timeout: ${expression}`);
  };
  const dialog = `document.querySelector('[role="dialog"][aria-labelledby="nova-chat-title"]')`;
  const visible = `${dialog} && getComputedStyle(${dialog}).display !== 'none'`;
  const messageInput = `document.querySelector('input[aria-label="Message UrbanGrid AI Assistant"]')`;
  const clickText = async text => ev(`[...${dialog}.querySelectorAll('button')].find(b=>b.textContent.trim()===${JSON.stringify(text)}).click()`);
  const sendText = async text => {
    await wait(`${messageInput} && !${messageInput}.disabled`);
    await ev(`(()=>{const n=${messageInput};Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(n,${JSON.stringify(text)});n.dispatchEvent(new Event('input',{bubbles:true}))})()`);
    await ev(`${messageInput}.closest('form').requestSubmit()`);
  };
  await send("Page.enable"); await send("Runtime.enable"); await send("Network.enable");
  await send("Network.setBlockedURLs", { urls: ["*googletagmanager.com*", "*google-analytics.com*", "*doubleclick.net*", "*facebook.net*"] });
  // Accelerate only the chat's 30s timeout; production timeout stays unchanged.
  await send("Page.addScriptToEvaluateOnNewDocument", { source: `
    const nativeTimeout=window.setTimeout;window.setTimeout=(fn,ms,...args)=>nativeTimeout(fn,ms===30000?1000:ms,...args);
    window.__auditCLS=0;window.__auditShifts=[];new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput){window.__auditCLS+=e.value;window.__auditShifts.push({v:e.value,s:e.sources.map(s=>({tag:s.node?.tagName,cls:s.node?.className}))})}}).observe({type:'layout-shift',buffered:true});
  ` });
  const navigate = async (p, width, height) => {
    // Resize an empty document, not a previously rendered page. Otherwise CDP
    // viewport changes can be counted as BODY shifts in the next sample.
    await send("Page.navigate", { url: "about:blank" });
    await wait("location.href === 'about:blank'");
    await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: width < 768 });
    await send("Page.navigate", { url: base + p });
    await wait(`location.pathname === ${JSON.stringify(p)} && document.readyState === 'complete' && !!document.querySelector('footer') && !!document.querySelector('button[aria-label="Open UrbanGrid AI Assistant"],button[aria-label="Chat with Nova AI"]')`);
    await sleep(300);
    await ev(`[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='Reject non-essential')?.click()`);
  };
  const open = async () => {
    await ev(`[...document.querySelectorAll('button[aria-label="Open UrbanGrid AI Assistant"]')].find(b=>b.getBoundingClientRect().width>0).click()`);
    await wait(visible);
  };
  if (!process.env.AUDIT_LAYOUT_ONLY) {
  await navigate("/", 375, 667);
  assert(!(await ev(visible)));
  await ev("window.scrollTo(0,document.documentElement.scrollHeight*.6)");
  await sleep(300);
  assert(!(await ev(visible)), "Scroll must not open chat");
  await ev("window.scrollTo(0,0)");
  await ev(`[...document.querySelectorAll('button[aria-label="Open UrbanGrid AI Assistant"]')].find(b=>b.getBoundingClientRect().width>0).click()`);
  await wait(`document.body.innerText.includes('Opening UrbanGrid AI Assistant')`);
  await wait(visible);
  await wait(`document.activeElement === ${messageInput}`);
  const mobile = await ev(`(()=>{const d=${dialog};return {rect:d.getBoundingClientRect().toJSON(),modal:d.getAttribute('aria-modal'),title:document.getElementById(d.getAttribute('aria-labelledby')).innerText,bar:getComputedStyle(document.querySelector('[data-analytics-region="floating_mobile"]')).display,targets:[...d.querySelectorAll('button,a')].filter(n=>n.getBoundingClientRect().width>0&&!n.closest('[role="log"]')).map(n=>({label:n.textContent||n.getAttribute('aria-label'),h:n.getBoundingClientRect().height,w:n.getBoundingClientRect().width})),links:[...d.querySelectorAll('a')].map(n=>n.getAttribute('href'))}})()`);
  assert(mobile.rect.top >= 0 && mobile.rect.bottom <= 667 && mobile.rect.right <= 375);
  assert.equal(mobile.bar, "none");
  assert(mobile.title.includes("AI Assistant"));
  for (const t of mobile.targets) assert(t.h >= 43 && t.w >= 43, JSON.stringify(t));
  for (const href of ["/book-inspection", "/contact", "tel:+971585686852"]) assert(mobile.links.includes(href));
  assert(mobile.links.some(h => h.startsWith("https://wa.me/971567427634")));
  await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
  assert(await ev(`getComputedStyle(${dialog}).transitionProperty === 'none' || getComputedStyle(${dialog}).transitionDuration === '0s'`));
  await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape" });
  await wait(`!(${visible})`);
  await wait(`document.activeElement?.getAttribute('aria-label') === 'Open UrbanGrid AI Assistant'`);
  await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Tab", code: "Tab" });
  assert(!(await ev(`${dialog}.contains(document.activeElement)`)));
  await open();
  await ev(`${dialog}.querySelector('button[aria-label="Minimize chat"]').click()`);
  assert(await ev(`${dialog}.getBoundingClientRect().height`) < 90);
  assert(!(await ev(messageInput)));
  await ev(`${dialog}.querySelector('button[aria-label="Expand chat"]').click()`);
  await clickText("View sample report");
  await wait(`${dialog}.querySelector('a[href="/sample-report.pdf"]') !== null`);
  await send("Page.captureScreenshot", { format: "png" }).then(r => fsp.writeFile("/tmp/ug-assistant-mobile.png", Buffer.from(r.data, "base64")));
  console.log("PASS mobile 375x667: initial loading, bounds, no scroll opening/overlap, 44px controls, AI label, Escape/focus, hidden/minimized controls, reduced motion, clickable real sample");
  await sendText("Are you RERA approved?");
  await wait(`${dialog}.innerText.includes('60346') && !${messageInput}.disabled`);
  assert(await ev(`${dialog}.innerText.includes('1254374') && ${dialog}.innerText.includes('9 November 2027') && ${dialog}.innerText.includes('not RERA approval') && !!${dialog}.querySelector('a[href="/about#regulatory-registration"]')`));
  console.log("PASS assistant verified office registration and clickable credentials link; approval/endorsement excluded");
  await sendText("Get a price estimate");
  await wait(`${dialog}.innerText.includes('Which residential inspection')`);
  await sendText("resale");
  await wait(`${dialog}.innerText.includes('area in square feet')`);
  await sendText("1500");
  await wait(`${dialog}.innerText.includes('1,417.50')`);
  await sendText("DLP inspection");
  await wait(`${dialog}.innerText.includes('contract/warranty')`);
  await sendText("Talk to a person");
  await wait(`${dialog}.innerText.includes('confirm uncertain details')`);
  console.log("PASS all suggestion intents, conversational calculator inputs, DLP and persistent real handoffs");
  for (const failure of ["http-error", "sse-error", "empty", "timeout"]) {
    console.log(`Checking recovery: ${failure}`);
    mode = failure;
    await sendText("Can you confirm access?");
    await wait(`${dialog}.querySelector('[role="alert"]') && ${dialog}.innerText.includes('Retry')`);
    assert.equal(await ev(`${messageInput}.disabled`), false);
    mode = "ok";
    await clickText("Retry");
    await wait(`!${dialog}.querySelector('[role="alert"]') && !${messageInput}.disabled`);
  }
  mode = "delay";
  const before = requests;
  await sendText("Confirm access");
  await ev(`${messageInput}.closest('form').requestSubmit();${messageInput}.closest('form').requestSubmit()`);
  await wait(`${messageInput}.disabled`);
  await sleep(700);
  await wait(`!${messageInput}.disabled`);
  assert.equal(requests - before, 1);
  mode = "ok";
  console.log("PASS HTTP/SSE/empty/timeout recovery with Retry and handoffs; one request for duplicate sends");
  await navigate("/", 1366, 900);
  await open();
  const desktop = await ev(`${dialog}.getBoundingClientRect().toJSON()`);
  assert(desktop.top >= 0 && desktop.bottom <= 900);
  await ev(`document.querySelector('button[aria-label="Close chat"]').click()`);
  await wait(`!(${visible})`);
  await ev(`[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='Get a price estimate'&&b.getBoundingClientRect().width>0).click()`);
  await wait(`${visible} && ${dialog}.innerText.includes('Which residential inspection')`);
  await wait(`!${messageInput}.disabled`);
  await ev(`[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='What does snagging include?'&&b.getBoundingClientRect().width>0).click()`);
  await wait(`${dialog}.innerText.includes('selected MEP functions')`);
  console.log("PASS desktop opening/closure, preserved history and repeated hero prompts while open");
  }
  const layout = [];
  for (const p of ["/", "/services", "/pricing", "/sample-report"]) {
    for (const width of [375, 1366]) {
      await navigate(p, width, width === 375 ? 667 : 900);
      const r = await ev(`({path:location.pathname,width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,cls:window.__auditCLS,shifts:window.__auditShifts,book:!!document.querySelector('a[href="/book-inspection"]'),pdf:!!document.querySelector('a[href="/sample-report.pdf"]')})`);
      assert(!r.overflow && r.book, JSON.stringify(r));
      if (p === "/sample-report") assert(r.pdf);
      layout.push(r);
    }
  }
  console.log("LAYOUT " + JSON.stringify(layout));
  if (process.env.AUDIT_BASELINE_LAYOUT) {
    const before = JSON.parse(await fsp.readFile(process.env.AUDIT_BASELINE_LAYOUT, "utf8"));
    for (const r of layout.filter(r => r.path !== "/")) {
      const b = before.find(b => b.path === r.path && b.width === r.width);
      assert(b && r.cls <= b.cls + .01, `New cold-load CLS regression: ${JSON.stringify(r)}`);
    }
    console.log("PASS no added services/pricing/sample-report cold-load CLS versus pre-polish assets");
  }
  if (process.env.AUDIT_LAYOUT_ONLY) {
    await fsp.writeFile(process.env.AUDIT_LAYOUT_OUTPUT || "/tmp/ui-polish-layout.json", JSON.stringify(layout, null, 2));
  } else {
  await navigate("/", 1366, 900);
  await wait(`!!document.querySelector('#phone')`);
  assert(await ev(`document.querySelector('#phone').labels.length>0`));
  await ev(`[...document.querySelectorAll('summary')].find(n=>n.textContent.includes('Resources')).click()`);
  for (const href of ["/pricing", "/sample-report", "/blog"]) assert(await ev(`!!document.querySelector('header details[open] a[href="${href}"]')`));
  await navigate("/", 375, 667);
  await ev(`document.querySelector('button[aria-label="Open navigation menu"]').click()`);
  await wait(`!!document.querySelector('nav[aria-label="Mobile navigation"]')`);
  await ev(`[...document.querySelector('nav[aria-label="Mobile navigation"]').querySelectorAll('button')].find(n=>n.textContent.includes('Resources')).click()`);
  for (const href of ["/pricing", "/sample-report", "/blog"]) assert(await ev(`!!document.querySelector('nav[aria-label="Mobile navigation"] a[href="${href}"]')`));
  for (const width of [375, 1366]) {
    await navigate("/", width, width === 375 ? 667 : 900);
    const trustLink = `document.querySelector('a[href="/about#regulatory-registration"]')`;
    assert(await ev(`${trustLink}?.closest('.border-b').innerText.includes('RERA Registered') && ${trustLink}.closest('.border-b').getBoundingClientRect().height < 180`));
    await ev(`${trustLink}.scrollIntoView({block:'center'});${trustLink}.click()`);
    await wait(`location.pathname === '/about' && location.hash === '#regulatory-registration' && !!document.getElementById('regulatory-registration')`);
    await wait(`(()=>{const r=document.getElementById('regulatory-registration').getBoundingClientRect();return r.top >= 60 && r.top <= 130})()`);
    const facts = await ev(`document.getElementById('regulatory-registration').innerText`);
    for (const text of ["URBANGRID REAL ESTATE CONSULTANCIES L.L.C", "60346", "1254374", "Property Observer", "Real Estate Consultancies", "9 November 2027", "Dubai Land Department", "Real Estate Office Registration Certificate"]) {
      assert(facts.includes(text), `Missing regulatory fact: ${text}`);
    }
    assert(facts.includes("not an endorsement") && facts.includes("approval of inspection reports"));
    assert(await ev(`!document.getElementById('regulatory-registration').querySelector('img') && document.documentElement.scrollWidth <= innerWidth`));
    assert.equal(await ev(`document.querySelector('link[rel="canonical"]').href`), "https://urbangrid.ae/about");
  }
  console.log("PASS compact homepage authority, mobile/desktop deep-link positioning, complete About facts, no invented certificate image, preserved About canonical");
  assert.equal(blockedSubmissions, 0);
  assert.deepEqual(errors, []);
  console.log("PASS desktop/mobile Resources, associated homepage phone label, layouts/CTAs, no horizontal overflow, no real submissions or runtime exceptions");
  console.log(JSON.stringify(layout));
  }
} finally {
  socket?.close();
  const exited = new Promise(resolve => chrome.once("exit", resolve));
  chrome.kill("SIGKILL"); await exited;
  server.closeAllConnections(); await new Promise(resolve => server.close(resolve));
  await fsp.rm(dir, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
}