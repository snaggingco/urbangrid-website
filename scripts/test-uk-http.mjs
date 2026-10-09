import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";

// Test a built, unconfigured UK onboarding instance. Never submit against a
// configured live/dev customer database or invoke customer notification flows.
if (process.env.URBANGRID_GB_DATABASE_URL) {
  throw new Error("This static HTTP test must run without a configured UK database");
}
const port = 5199;
const base = `http://127.0.0.1:${port}`;
const child = spawn(process.execPath, ["dist/index.js"], {
  env: { ...process.env, NODE_ENV: "production", PORT: String(port) },
  stdio: ["ignore", "pipe", "pipe"],
});
let logs = "";
child.stdout.on("data", chunk => { logs += String(chunk); });
child.stderr.on("data", chunk => { logs += String(chunk); });
try {
  let ready = false;
  for (let i = 0; i < 100; i++) {
    try { ready = (await fetch(`${base}/health`)).ok; } catch {}
    if (ready) break;
    if (child.exitCode !== null) throw new Error("Built UK server exited during startup");
    await delay(100);
  }
  assert(ready, "Built UK server must start without inherited database connections");
  const home = await (await fetch(`${base}/`)).text();
  assert.match(home, /https:\/\/urbangrid\.co\.uk/);
  assert.match(home, /UrbanGrid UK/);
  assert.match(home, /7436 597890/);
  assert.doesNotMatch(home, /urbangrid\.ae|AED\s*\d|\+971|GTM-NGVDWWRF|G-ZX4B5QJGB4|AW-11443889137/);
  const london = await fetch(`${base}/locations/london`);
  assert.equal(london.status, 200);
  assert.match(await london.text(), /London/);
  const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
  assert.doesNotMatch(sitemap, /urbangrid\.ae|locations\/dubai|book-inspection|checkout/);
  const paths = [...sitemap.matchAll(/<loc>https:\/\/urbangrid\.co\.uk([^<]*)<\/loc>/g)].map(m => m[1]);
  assert.equal(paths.filter(p => p.startsWith("/services/")).length, 17);
  for (const path of paths) {
    const response = await fetch(`${base}${path}`);
    assert.equal(response.status, 200, `Public UK route must work: ${path}`);
    assert.doesNotMatch(await response.text(), /urbangrid\.ae|AED\s*\d|\+971/, path);
  }
  assert.equal((await fetch(`${base}/api/launch-readiness`)).status, 503);
  assert.equal((await fetch(`${base}/api/auth/user`)).status, 401);
  const blog = await (await fetch(`${base}/api/blog`)).json();
  assert.deepEqual(blog.posts, []);
  for (const path of ["/api/contact", "/api/consultation", "/api/quick-contact", "/api/chat/lead", "/api/career-application"]) {
    const response = await fetch(`${base}${path}`, {
      method: "POST", headers: { "Content-Type": "application/json", Origin: base },
      body: JSON.stringify({ name: "Synthetic UK fixture", email: "fixture@example.invalid", message: "Must not persist" }),
    });
    assert.equal(response.status, 503);
    assert.equal((await response.json()).code, "UK_DATABASE_NOT_CONFIGURED");
  }
  for (const path of ["/api/bookings", "/api/checkout", "/api/stripe/webhook", "/api/ziina/webhook", "/api/admin/bookings"]) {
    assert.equal((await fetch(`${base}${path}`, { method: "POST" })).status, 410, path);
  }
  for (const path of ["/book-inspection", "/checkout", "/booking-access/fixture"]) {
    const response = await fetch(`${base}${path}`, { redirect: "manual" });
    assert.equal(response.status, 302);
    assert.equal(response.headers.get("location"), "/contact");
  }
  assert.equal((await fetch(`${base}/locations/dubai`)).status, 410);
  assert.equal((await fetch(`${base}/blog/uae-fixture`)).status, 404);
  assert.equal((await fetch(`${base}/not-a-real-page`)).status, 404);
  const llms = await (await fetch(`${base}/llms.txt`)).text();
  assert.match(llms, /28 Manchester Street/);
  assert.doesNotMatch(llms, /urbangrid\.ae|\+971|AED\s*\d/);
  const chat = await fetch(`${base}/api/chat`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: [{ role: "user", content: "What is your inspection price?" }] }),
  });
  assert.equal(chat.status, 200);
  const reply = await chat.text();
  assert.match(reply, /custom quote/);
  assert.doesNotMatch(reply, /AED\s*\d|VAT\s*5%|\+971/);
  console.log("Built UK HTTP checks passed: public routes, all 17 services, SEO, enquiry fail-closed, disabled payments, assistant and country isolation.");
} catch (error) {
  // Do not print process logs: they could contain connector/environment data.
  console.error(error.message);
  process.exitCode = 1;
} finally {
  child.kill("SIGTERM");
}
