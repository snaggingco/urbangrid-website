// Isolated checks of real route handlers and the built UI. No application
// startup, real submissions, authentication changes or advertising delivery.
import assert from "node:assert/strict";
import fs from "node:fs";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import vm from "node:vm";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import express from "express";
import ts from "typescript";
import WebSocket from "ws";
import { renderPublic } from "./test-admin-spa.mjs";

const source = fs.readFileSync("server/routes.ts", "utf8");
const require = createRequire(import.meta.url);
function loadTS(file, imports = {}) {
  const exports = {};
  const context = vm.createContext({ exports, require: name => imports[name] ?? require(name) });
  vm.runInContext(ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
  }).outputText, context);
  return exports;
}
const asset = loadTS("shared/assetTagging.ts");
const resources = loadTS("shared/seoResources.ts", { "./inspectionPricing": loadTS("shared/inspectionPricing.ts") });
const publicSchema = loadTS("shared/pageStructuredData.ts", {
  "./faqs": loadTS("shared/faqs.ts"), "./publicFAQs": loadTS("shared/publicFAQs.ts"),
  "./seoResources": resources, "./assetTagging": asset,
  "./companyRegistration": loadTS("shared/companyRegistration.ts"),
});
const schema = loadTS("server/schema.ts", { "../shared/pageStructuredData": publicSchema });
for (const route of ["/", "/about"]) {
  const graph = publicSchema.pageStructuredData(route, "UrbanGrid", "Property inspections")["@graph"];
  const entities = graph.filter(node => ["Organization", "LocalBusiness"].includes(node["@type"]));
  assert.equal(entities.length, route === "/" ? 2 : 1);
  for (const entity of entities) {
    assert.equal(entity.legalName, "URBANGRID REAL ESTATE CONSULTANCIES L.L.C");
    assert.deepEqual(Array.from(entity.identifier, id => id.value), ["60346", "1254374"]);
    assert(entity.identifier.every(id => id["@type"] === "PropertyValue" && typeof id.propertyID === "string"));
    assert(!entity.hasCredential && !entity.aggregateRating && !entity.review);
  }
}
console.log("PASS homepage/About legal identity and Schema.org PropertyValue identifiers; no fake credential/review markup");
const handlers = new Map();
const context = vm.createContext({
  fs, path, console, URL, process: { env: { NODE_ENV: "production" } },
  buildDir: path.resolve("dist"), injectFirstPaint: html => html,
  preloadDubaiRoute: html => html,
  ...asset, ...schema, ...resources, ...publicSchema,
  app: { get: (url, handler) => handlers.set(url, handler) },
});
const chunks = [
  source.slice(source.indexOf("  const serveSPAWithMeta ="), source.indexOf("  const corePages")),
  source.slice(source.indexOf("  const corePages"), source.indexOf("  const serviceSSRData")),
  source.slice(source.indexOf("  const serviceSSRData"), source.indexOf("  // Server-side rendered blog pages")),
  source.slice(source.indexOf("  // Sitemap\n"), source.indexOf("  // Redirects for old sitemap paths")),
];
assert(chunks.every(chunk => chunk.length > 100), "Actual route extraction failed");
vm.runInContext(ts.transpileModule(chunks.join("\n").replaceAll("import.meta.dirname", "buildDir"), {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
}).outputText, context);

function response() {
  return { headers: {}, code: 200, body: "",
    setHeader(key, value) { this.headers[key.toLowerCase()] = value; },
    status(value) { this.code = value; return this; },
    type(value) { this.headers["content-type"] = value; return this; },
    send(value) { this.body = value; return this; },
  };
}
const services = vm.runInContext("Object.entries(serviceSSRData).map(([slug, s]) => `/services/${s.category}/${slug}`)", context);
assert.equal(services.length, 16);
services.push(asset.assetTaggingService.path);
function renderService(url) {
  const res = response();
  const handler = url === asset.assetTaggingService.path
    ? handlers.get(url) : handlers.get("/services/:category/:slug");
  const [, , category, slug] = url.split("/");
  handler({ params: { category, slug } }, res, () => { throw Error("Service renderer fell through"); });
  return res;
}
for (const url of services) {
  const page = renderService(url);
  assert.equal(page.code, 200);
  assert(page.body.includes(`<link rel="canonical" href="https://urbangrid.ae${url}">`));
  assert(page.body.includes('content="index, follow"'));
}
const assetPage = renderService(asset.assetTaggingService.path);
const json = JSON.parse(assetPage.body.match(/<script id="asset-tagging-schema" type="application\/ld\+json">([^<]+)<\/script>/)[1]);
assert(json["@graph"].some(item => item["@type"] === "Service" && item.url.endsWith(asset.assetTaggingService.path)));
assert(json["@graph"].some(item => item["@type"] === "BreadcrumbList"));
assert(!/RERA approved|RERA certified|RERA certification/i.test(assetPage.body));
const unknown = renderService("/services/technical-inspections/not-a-service");
assert.equal(unknown.code, 404);
const sitemap = response();
handlers.get("/sitemap.xml")({}, sitemap);
for (const url of services) assert.equal(sitemap.body.split(`<loc>https://urbangrid.ae${url}</loc>`).length, 2);
assert.equal((sitemap.body.match(/<loc>https:\/\/urbangrid\.ae\/services\//g) || []).length, 17);
console.log("PASS: all 17 production service handlers, self-canonicals, genuine unknown-service 404, asset Service/Breadcrumb schema and sitemap");

const seoPaths = ["/", "/pricing", "/sample-report", "/services", "/locations/dubai"];
function renderSEO(url) {
  const res = response();
  const request = { params: { emirate: "dubai" } };
  const handler = handlers.get(url) || handlers.get("/locations/:emirate");
  assert(handler, `Missing SEO route ${url}`);
  handler(request, res, () => { throw Error(`SEO renderer fell through: ${url}`); });
  return res;
}
for (const url of seoPaths) {
  const page = renderSEO(url);
  assert.equal(page.code, 200);
  assert(page.body.includes(`<link rel="canonical" href="https://urbangrid.ae${url === "/" ? "/" : url}">`));
  assert(page.body.includes('content="index, follow"'));
  assert.equal(sitemap.body.split(`<loc>https://urbangrid.ae${url === "/" ? "/" : url}</loc>`).length, 2);
  if (url === "/pricing" || url === "/sample-report" || url === "/locations/dubai") assert(page.body.includes('"BreadcrumbList"'));
}
const llms = response();
const llmsCode = source.slice(source.indexOf("  app.get('/llms.txt'"), source.indexOf("  // ── SEO", source.indexOf("  app.get('/llms.txt'")));
// Extract only this registration; avoid running unrelated API handlers.
const llmsEnd = llmsCode.indexOf("  });");
vm.runInContext(ts.transpileModule(llmsCode.slice(0, llmsEnd + 5), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } }).outputText, context);
llms.type = () => llms;
handlers.get("/llms.txt")({}, llms);
const llmsURLs = Array.from(llms.body.matchAll(/\]\(https:\/\/urbangrid\.ae([^)]+)\)/g), match => match[1]);
for (const url of llmsURLs) {
  assert(sitemap.body.includes(`<loc>https://urbangrid.ae${url}</loc>`) || url === "/sitemap.xml" || url === "/robots.txt", `Stale llms URL: ${url}`);
}
console.log("PASS: pricing/sample production routes, indexability, breadcrumbs, sitemap and all llms discovery targets");

const app = express();
app.get("/api/auth/user", (_req, res) => res.status(401).json({ message: "Unauthorized" }));
app.get("/api/stats", (_req, res) => res.json({ propertiesInspected: 40000, defectsFound: 600000, citiesCovered: 7 }));
app.get("/sitemap.xml", (_req, res) => res.type("xml").send(sitemap.body));
for (const url of services) app.get(url, (_req, res) => { const page = renderService(url); res.status(page.code).type("html").send(page.body); });
for (const url of ["/", "/pricing", "/sample-report", "/services", "/contact", "/blog", "/about", "/locations/dubai"]) {
  app.get(url, (_req, res) => { const page = renderSEO(url); res.status(page.code).type("html").send(page.body); });
}
app.get("/book-inspection", (_req, res) => res.type("html").send(fs.readFileSync("dist/public/index.html", "utf8")));
app.use("/api", (_req, res) => res.status(405).json({ message: "No real submissions in navigation tests" }));
app.use(express.static("dist/public", { index: false }));
const server = await new Promise(resolve => { const s = app.listen(0, "127.0.0.1", () => resolve(s)); });
const base = `http://127.0.0.1:${server.address().port}`;
const directory = await mkdtemp(path.join(os.tmpdir(), "ug-hierarchy-"));
const chrome = spawn("/repl/tools/bin/chromium", [
  "--headless=new", "--no-sandbox", "--disable-dev-shm-usage",
  "--remote-debugging-port=0", `--user-data-dir=${directory}`, "about:blank",
], { stdio: "ignore" });
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
let socket;
try {
  let port;
  for (let n = 0; n < 100; n++) {
    try { port = (await readFile(path.join(directory, "DevToolsActivePort"), "utf8")).split("\n")[0]; break; }
    catch { await sleep(100); }
  }
  assert(port, "Browser did not start");
  const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  socket = new WebSocket(targets.find(target => target.type === "page").webSocketDebuggerUrl);
  await new Promise(resolve => socket.once("open", resolve));
  let sequence = 0;
  const pending = new Map();
  socket.on("message", raw => {
    const message = JSON.parse(raw);
    if (!pending.has(message.id)) return;
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    message.error ? reject(Error(message.error.message)) : resolve(message.result);
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++sequence;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async expression => {
    const result = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw Error(result.exceptionDetails.text);
    return result.result.value;
  };
  async function wait(expression) {
    for (let n = 0; n < 100; n++) { if (await evaluate(expression)) return; await sleep(100); }
    throw Error(`Timed out: ${expression}`);
  }
  async function visit(url) {
    await send("Page.navigate", { url: base + url });
    await wait("!!document.querySelector('footer button') && !document.querySelector('#hero-skeleton')");
  }
  const clickText = label => evaluate(`[...document.querySelectorAll('header button')].find(b => b.textContent.trim() === ${JSON.stringify(label)})?.click()`);
  await send("Page.enable");
  await send("Network.enable");
  await send("Network.setBlockedURLs", { urls: ["*google-analytics.com*", "*googletagmanager.com*", "*doubleclick.net*", "*googleadservices.com*", "*facebook.net*"] });
  await send("Emulation.setDeviceMetricsOverride", { width: 1366, height: 900, deviceScaleFactor: 1, mobile: false });
  await visit("/");
  const homeLinks = await evaluate("[...document.querySelectorAll('main a')].map(a => a.getAttribute('href'))");
  for (const url of services) assert(homeLinks.includes(url), `Missing direct homepage service link: ${url}`);
  assert(homeLinks.includes("/locations/dubai"));
  assert(homeLinks.includes("/services"));
  assert(homeLinks.includes("/book-inspection"));
  const hero = await evaluate("document.querySelector('main section').innerText");
  assert(!hero.includes("Reserve Fund Study") && !hero.includes("Reinstatement Cost Assessment"));
  const homeText = await evaluate("document.querySelector('main').innerText");
  assert(await evaluate("document.getElementById('residential-inspections').getBoundingClientRect().top < document.getElementById('building-consultancy').getBoundingClientRect().top"));
  assert(homeText.includes("100%") && /after inspection/i.test(homeText) && /report released after payment/i.test(homeText));
  assert.equal(await evaluate("document.querySelector('h1').textContent.replace(/\\s+/g,' ').trim()"), "Property Snagging & Inspection Services in Dubai & UAE");
  await evaluate("[...document.querySelectorAll('header summary')].find(b => b.textContent.trim() === 'Services').click()");
  await wait("[...document.querySelectorAll('header a')].some(a => a.getAttribute('href') === '/services/asset-tagging-inventory' && a.getBoundingClientRect().width > 0)");
  const headerLinks = await evaluate("[...document.querySelectorAll('header a')].map(a => a.getAttribute('href'))");
  for (const url of services) assert(headerLinks.includes(url), `Missing menu service: ${url}`);
  await evaluate("[...document.querySelectorAll('header summary')].find(b => b.textContent.trim() === 'Services').focus()");
  await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape" });
  await wait("!document.querySelector('header details[open]')");
  await evaluate("[...document.querySelectorAll('header summary')].find(b => b.textContent.trim() === 'Services').click()");
  await evaluate("[...document.querySelectorAll('header a')].find(a=>a.getAttribute('href')==='/services#building-consultancy').click()");
  await wait("location.pathname === '/services' && location.hash === '#building-consultancy' && !!document.getElementById('building-consultancy')");
  await wait("document.getElementById('building-consultancy').getBoundingClientRect().top < 150");
  console.log("PASS: desktop services menu, all 17 direct homepage links, residential-first order, hero and payment journey");

  await visit("/services");
  await wait("!!document.getElementById('building-consultancy')");
  const indexLinks = await evaluate("[...document.querySelectorAll('main a')].map(a => a.getAttribute('href'))");
  for (const url of services) assert(indexLinks.includes(url), `Missing service index link: ${url}`);
  assert(await evaluate("!!document.getElementById('residential-inspections')"));
  assert(await evaluate("[...document.querySelectorAll('#residential-inspections a')].some(a => a.getAttribute('href') === '/book-inspection')"));
  assert(await evaluate("[...document.querySelectorAll('#building-consultancy a')].some(a => a.getAttribute('href') === '/contact')"));
  for (const url of ["/pricing", "/sample-report", "/services/property-snagging/new-build-snagging", "/services/property-snagging/dlp-snagging", "/services/property-snagging/secondary-market", "/locations/dubai"]) {
    await visit(url);
    await wait(`document.querySelector('link[rel=canonical]')?.href === 'https://urbangrid.ae${url}' && !!document.querySelector('#public-page-schema')`);
    const check = await evaluate(`(() => {
      const graph = JSON.parse(document.querySelector('#public-page-schema').textContent)['@graph'];
      const text = document.querySelector('main')?.textContent || document.body.textContent;
      return { types: graph.map(n => n['@type']), text,
        faqs: graph.filter(n => n['@type'] === 'FAQPage').flatMap(n => n.mainEntity),
        links: [...document.querySelectorAll('a')].map(a => a.getAttribute('href')),
        h1s: [...document.querySelectorAll('h1')].map(n => n.textContent.trim())
      };
    })()`);
    assert(check.types.includes("BreadcrumbList"), `Missing breadcrumb schema: ${url}`);
    assert.equal(check.h1s.length, 1);
    for (const faq of check.faqs) {
      assert(check.text.includes(faq.name), `Hidden FAQ question: ${url}`);
      assert(check.text.includes(faq.acceptedAnswer.text), `Hidden FAQ answer: ${url}`);
    }
    if (url.startsWith("/services/property-snagging/")) {
      assert(check.links.includes("/pricing") && check.links.includes("/sample-report"));
      assert(check.links.includes("/book-inspection"));
    }
    if (url === "/pricing") {
      for (const example of resources.pricingExamples) assert(check.text.includes(example.total));
      assert(check.links.includes("/book-inspection"));
    }
    if (url === "/sample-report") assert(check.links.includes("/sample-report.pdf") && check.links.includes("/book-inspection"));
  }
  // Client navigation must replace (rather than retain) prior page schema.
  await visit("/pricing");
  await evaluate("[...document.querySelectorAll('a')].find(a => a.getAttribute('href') === '/sample-report').click()");
  await wait("location.pathname === '/sample-report' && document.querySelector('link[rel=canonical]')?.href === 'https://urbangrid.ae/sample-report'");
  assert.equal(await evaluate("document.querySelectorAll('#public-page-schema').length"), 1);
  assert(await evaluate("!document.querySelector('#public-page-schema').textContent.includes('/pricing#residential-pricing')"));
  console.log("PASS: resource/core residential/Dubai rendering, worked prices, visible FAQ parity, contextual links and SPA schema replacement");
  await visit(asset.assetTaggingService.path);
  await wait("document.title.includes('Asset Tagging')");
  assert.equal(await evaluate("document.querySelector('link[rel=canonical]').href"), `https://urbangrid.ae${asset.assetTaggingService.path}`);
  assert(await evaluate("[...document.querySelectorAll('main a')].some(a => a.textContent.includes('Request Custom Quote') && a.getAttribute('href') === '/contact')"));
  assert.equal(await evaluate("document.querySelectorAll('#asset-tagging-schema').length"), 1);
  await evaluate("[...document.querySelectorAll('main a')].find(a => a.textContent.includes('Request Custom Quote')).click()");
  await wait("location.pathname === '/contact' && !!document.querySelector('form')");
  console.log("PASS: visible service index, anchors, booking/custom-quote CTAs, restored asset UI and contact navigation");

  await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await visit("/");
  assert(await evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), "Mobile horizontal overflow");
  await evaluate("[...document.querySelectorAll('header button')].find(b => /open menu|open navigation|toggle menu|menu/i.test(b.getAttribute('aria-label') || '') && b.getBoundingClientRect().width > 0)?.click()");
  await wait("[...document.querySelectorAll('header button,[role=dialog] button')].some(b=>b.textContent.trim()==='Services' && b.getBoundingClientRect().width>0)");
  await evaluate("[...document.querySelectorAll('header button,[role=dialog] button')].find(b=>b.textContent.trim()==='Services' && b.getBoundingClientRect().width>0)?.click()");
  await wait("[...document.querySelectorAll('a')].some(a=>a.getAttribute('href')==='/services/asset-tagging-inventory' && a.getBoundingClientRect().width>0 && getComputedStyle(a).visibility!=='hidden')");
  await evaluate("document.querySelector('[role=dialog] a[href=\"/services/asset-tagging-inventory\"]').click()");
  await wait("location.pathname === '/services/asset-tagging-inventory' && document.querySelector('main h1')?.textContent.includes('Asset Tagging')");
  await wait("!document.querySelector('[role=dialog]')");
  assert(!await evaluate("!!document.querySelector('[role=dialog]')"), "Mobile menu remained open");
  const footerLinks = await evaluate("[...document.querySelectorAll('footer a')].map(a => a.getAttribute('href'))");
  for (const url of services) assert(footerLinks.includes(url), `Missing footer service: ${url}`);
  for (const url of ["/privacy-policy", "/terms-of-service", "/locations/dubai", "/contact", "/broker-referrals", "/careers"]) assert(footerLinks.includes(url), `Missing retained footer link: ${url}`);
  assert(await evaluate("[...document.querySelectorAll('footer button')].some(b=>b.textContent.trim()==='Cookie preferences')"));
  console.log("PASS: mobile service menu, link navigation/closure, no horizontal overflow and complete compact footer");
} finally {
  socket?.close();
  chrome.kill("SIGTERM");
  await new Promise(resolve => server.close(resolve));
  await sleep(200);
  await rm(directory, { recursive: true, force: true });
}