// Exercise the actual production renderer and page allowlist without starting
// another application (startup runs Stripe housekeeping and report scheduling).
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";
import { createRequire } from "node:module";

const source = fs.readFileSync("server/routes.ts", "utf8");
const rendererStart = source.indexOf("  const serveSPAWithMeta =");
const rendererEnd = source.indexOf("  const corePages", rendererStart);
const adminStart = source.indexOf('  for (const path of ["/admin"');
const adminEnd = source.indexOf("  // Final 404 catch-all", adminStart);
const catchallEnd = source.indexOf("  const httpServer", adminEnd);
assert(rendererStart >= 0 && rendererEnd > rendererStart && adminStart >= 0 && catchallEnd > adminEnd);
const handlers = new Map();
let fallback;
const context = vm.createContext({
  fs, path, console, URL, require: createRequire(import.meta.url), exports: {},
  process: { env: { NODE_ENV: "production" } },
  buildDir: path.resolve("dist"),
  app: { get: (url, handler) => handlers.set(url, handler), use: handler => { fallback = handler; } },
});
vm.runInContext(ts.transpileModule(
  fs.readFileSync("server/firstPaint.ts", "utf8").replaceAll("import.meta.dirname", "buildDir"),
  { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, esModuleInterop: true } },
).outputText, context);
context.injectFirstPaint = context.exports.injectFirstPaint;
context.preloadDubaiRoute = context.exports.preloadDubaiRoute;
const code = (source.slice(rendererStart, rendererEnd) +
  source.slice(adminStart, catchallEnd)).replaceAll("import.meta.dirname", "buildDir");
vm.runInContext(ts.transpileModule(code, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
}).outputText, context);

function response() {
  return { headers: {}, code: 200, body: "",
    setHeader(key, value) { this.headers[key.toLowerCase()] = value; },
    set(key, value) { this.setHeader(key, value); return this; },
    status(value) { this.code = value; return this; },
    send(value) { this.body = value; return this; },
  };
}
for (const url of ["/admin", "/admin/login", "/admin/leads", "/admin/bookings", "/admin/acquisition"]) {
  const res = response();
  handlers.get(url)({}, res, () => { throw new Error("Production admin renderer unexpectedly fell through"); });
  assert.equal(res.code, 200);
  assert.equal(res.headers["x-robots-tag"], "noindex, nofollow");
  assert.match(res.body, /<meta name="robots" content="noindex, nofollow">/);
  assert.match(res.body, /id="root"/);
  assert.match(res.body, /\/assets\/[^"]+\.js/);
  console.log("PASS production admin SPA shell:", url);
}
for (const [url, robots] of [["/book-inspection", "noindex, follow"], ["/book-inspection/return", "noindex, nofollow"]]) {
  const res = response();
  handlers.get(url)({}, res, () => { throw new Error("Booking production renderer unexpectedly fell through"); });
  assert.equal(res.code, 200); assert.equal(res.headers["x-robots-tag"], robots);
  assert.ok(res.body.includes(`<meta name="robots" content="${robots}">`));
  assert.ok(res.body.includes(`<link rel="canonical" href="https://urbangrid.ae${url}">`));
  console.log("PASS production booking SPA shell and robots:", url);
}
const unknown = response();
fallback({ method: "GET", path: "/admin/unknown-page" }, unknown, () => { throw new Error("Unknown page should not bypass 404"); });
assert.equal(unknown.code, 404);
console.log("PASS unknown pages still return genuine 404");

for (const variable of ["corePages", "locationPages"]) {
  const start = source.indexOf(`  const ${variable}`);
  const end = source.indexOf("];", start) + 2;
  assert(start >= 0 && end > start);
  vm.runInContext(ts.transpileModule(source.slice(start, end), {
    compilerOptions: { target: ts.ScriptTarget.ES2022 },
  }).outputText, context);
}
const pages = vm.runInContext("[...corePages,...locationPages]", context);
const home = pages.find(page => page.path === "/");
const dubai = pages.find(page => page.path === "/locations/dubai");
assert.equal(home.title, "Property Snagging Dubai & UAE | From AED 800 | UrbanGrid");
assert.equal(home.h1, "Property Snagging & Inspection Services in Dubai & UAE");
assert.equal(dubai.title, "Dubai Inspection Services & Community Coverage | UrbanGrid");
assert.equal(dubai.h1, "Property Inspection Coverage Across Dubai");
console.log("PASS unpublished homepage and Dubai SEO ownership preserved");
const allowlist = Array.from(handlers.keys());
assert(allowlist.includes("/admin/acquisition"), "Acquisition must boot on a production deep link");
assert(!allowlist.some(url => url.startsWith("/api")));
assert(source.includes('registerLeadRoutes(app, isAdminAuthenticated)'));
console.log("PASS SPA allowlist does not grant access to admin APIs");

export function renderPublic(url) {
  const page = pages.find(page => page.path === url);
  assert(page);
  const res = response();
  vm.runInContext("serveSPAWithMeta", context)(res, () => {
    throw new Error("Public renderer unexpectedly fell through");
  }, { ...page, canonical: `https://urbangrid.ae${url === "/" ? "/" : url}` });
  return res;
}
export function renderAdmin(url) {
  const res = response();
  assert(handlers.has(url));
  handlers.get(url)({}, res, () => { throw new Error("Admin fixture renderer fell through"); });
  return res;
}

for (const url of ["/", "/locations/dubai"]) {
  const res = renderPublic(url);
  assert.equal(res.code, 200);
  assert.match(res.body, /<header/);
  assert.match(res.body, /id="hero-skeleton"/);
  assert.match(res.body, /<h1 class=/);
  assert.match(res.body, /rel="preload" as="font"/);
  assert.match(res.body, /<fieldset disabled style="display:contents">/);
  assert.match(res.body, /<a inert href=/);
  assert.equal((res.body.match(/<h1\b/g) || []).length, 1);
  assert(res.body.indexOf('"consent", "default"') < res.body.indexOf('src="/assets/'));
  if (url === "/locations/dubai") {
    assert.match(res.body, /rel="modulepreload" crossorigin href="\/assets\/Dubai-/);
    assert.match(res.body, /id="dubai-quote"/);
    assert.doesNotMatch(res.body, /Ask Nova AI/);
  } else {
    assert.match(res.body, /Independent property inspection across the UAE/);
    assert.doesNotMatch(res.body, /40,000\+ UAE properties inspected|600,000\+ defects/);
    assert.match(res.body, /href="\/contact"/);
  }
  console.log("PASS shared production first-paint markup, SEO, consent ordering:", url);
}