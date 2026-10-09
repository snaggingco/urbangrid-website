// Production-render fixture: no application startup, database, email, payments
// or real sign-in. The auth response is deliberately slow to prove independence.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import express from "express";
import compression from "compression";
import WebSocket from "ws";
import { renderPublic } from "./test-admin-spa.mjs";

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const app = express();
app.use(compression());
app.get("/api/auth/user", (_req, res) => setTimeout(() => res.status(401).json({ message: "Unauthorized" }), 2500));
for (const route of ["/", "/locations/dubai"]) {
  app.get(route, (_req, res) => {
    const page = renderPublic(route);
    res.status(page.code).type("html").send(page.body);
  });
}
app.use(express.static("dist/public", { index: false }));
app.use("/api", (_req, res) => res.sendStatus(405));
const server = await new Promise(resolve => {
  const listening = app.listen(0, "127.0.0.1", () => resolve(listening));
});
const origin = `http://127.0.0.1:${server.address().port}`;
const chrome = spawn("/repl/tools/bin/chromium", [
  "--headless", "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage",
  "--remote-debugging-port=0", `--user-data-dir=/tmp/ug-render-check-${Date.now()}`, "about:blank",
], { stdio: ["ignore", "ignore", "pipe"] });
let socket;
const results = [];
try {
  const address = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(Error("Browser startup timed out")), 15000);
    chrome.stderr.on("data", data => {
      const match = data.toString().match(/DevTools listening on (ws:\/\/\S+)/);
      if (match) { clearTimeout(timer); resolve(match[1]); }
    });
  });
  socket = new WebSocket(address);
  await new Promise((resolve, reject) => { socket.once("open", resolve); socket.once("error", reject); });
  const pending = new Map();
  let id = 0;
  socket.on("message", raw => {
    const response = JSON.parse(raw);
    if (!pending.has(response.id)) return;
    const { resolve, reject } = pending.get(response.id);
    pending.delete(response.id);
    response.error ? reject(Error(response.error.message)) : resolve(response.result);
  });
  const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
    pending.set(++id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
  });
  const evaluate = async (session, expression) => {
    const result = await send("Runtime.evaluate", { expression, returnByValue: true }, session);
    if (result.exceptionDetails) throw Error(result.exceptionDetails.text);
    return result.result.value;
  };
  const snapshot = `() => {
    const h = document.querySelector('h1'), r = h?.getBoundingClientRect();
    return {h1:h?.innerText.replace(/\\s+/g,' ').trim(),font:h&&getComputedStyle(h).fontSize,
      rect:r&&{x:r.x,y:r.y,width:r.width,height:r.height},header:!!document.querySelector('header'),
      skeleton:!!document.getElementById('hero-skeleton'),fonts:document.fonts.status,
      earlyControlsHeld:[...document.querySelectorAll('#hero-skeleton a,#hero-skeleton button')]
        .every(e=>e.hasAttribute('inert'))};
  }`;
  const instrumentation = `
    window.__render={states:[],shifts:[],paints:[],lcp:[]};
    const snap=${snapshot}; let last='';
    new MutationObserver(()=> {
      const root=document.getElementById('root'); if(!root)return;
      const h=document.querySelector('h1');
      const phase=document.getElementById('hero-skeleton')?'first-paint':h?'react-page':
        root.querySelector('.animate-spin')?'spinner':'empty';
      if(phase===last)return;last=phase;
      window.__render.states.push({time:Math.round(performance.now()),phase});
    }).observe(document,{childList:true,subtree:true});
    new PerformanceObserver(list=>{for(const e of list.getEntries()){
      window.__render.paints.push({name:e.name,time:Math.round(e.startTime)});
      if(e.name==='first-contentful-paint')window.__render.first=snap();
    }}).observe({type:'paint',buffered:true});
    new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)
      window.__render.shifts.push({time:Math.round(e.startTime),value:e.value,
        sources:e.sources.map(s=>s.node?.tagName)});
    }).observe({type:'layout-shift',buffered:true});
    new PerformanceObserver(list=>{for(const e of list.getEntries())
      window.__render.lcp.push(Math.round(e.startTime));
    }).observe({type:'largest-contentful-paint',buffered:true});
  `;
  for (const [name, route, width, height, mobile] of [
    ["home-desktop", "/", 1366, 900, false],
    ["home-mobile", "/", 390, 844, true],
    ["dubai-mobile", "/locations/dubai", 402, 874, true],
  ]) {
    if (process.env.PUBLIC_RENDER_SCENARIO && process.env.PUBLIC_RENDER_SCENARIO !== name) continue;
    for (let run = 1; run <= 3; run++) {
      const { targetId } = await send("Target.createTarget", { url: "about:blank" });
      const { sessionId: session } = await send("Target.attachToTarget", { targetId, flatten: true });
      await send("Page.enable", {}, session);
      await send("Runtime.enable", {}, session);
      await send("Network.enable", {}, session);
      await send("Network.setCacheDisabled", { cacheDisabled: true }, session);
      await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile }, session);
      await send("Network.emulateNetworkConditions", {
        offline: false, latency: 150, downloadThroughput: 200000, uploadThroughput: 100000,
      }, session);
      await send("Emulation.setCPUThrottlingRate", { rate: 4 }, session);
      await send("Page.addScriptToEvaluateOnNewDocument", { source: instrumentation }, session);
      await send("Page.navigate", { url: origin + route }, session);
      await delay(8000);
      const data = await evaluate(session, `JSON.stringify({
        ...window.__render,final:(${snapshot})(),
        auth:performance.getEntriesByType('resource').filter(e=>e.name.includes('/api/auth/user'))
          .map(e=>({start:Math.round(e.startTime),end:Math.round(e.responseEnd)})),
        fieldsEnabled:[...document.querySelectorAll('#dubai-quote input')].every(e=>!e.matches(':disabled'))
      })`);
      const result = { name, run, ...JSON.parse(data) };
      result.cls = result.shifts.reduce((sum, shift) => sum + shift.value, 0);
      assert(result.cls < 0.01, `${name} exceeded the render-stability CLS budget`);
      assert(result.first?.skeleton && result.first.header);
      assert(result.first.earlyControlsHeld);
      assert.equal(result.first.h1, result.final.h1);
      assert.equal(result.first.font, result.final.font);
      assert(!result.states.some(state => ["spinner", "empty"].includes(state.phase)), JSON.stringify(result));
      assert(result.states.find(state => state.phase === "react-page").time < result.auth[0].end);
      assert(result.fieldsEnabled);
      results.push(result);
      console.log(JSON.stringify(result));
      if (run === 1) {
        const shot = await send("Page.captureScreenshot", { format: "png" }, session);
        await fs.writeFile(`/tmp/ug-fixed-${name}.png`, Buffer.from(shot.data, "base64"));
      }
      await send("Target.closeTarget", { targetId });
    }
  }
  await fs.writeFile("/tmp/ug-render-results.json", JSON.stringify(results, null, 2));
} finally {
  socket?.close();
  chrome.kill();
  await new Promise(resolve => server.close(resolve));
}