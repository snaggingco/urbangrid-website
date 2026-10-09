// Exercise the unchanged real auth implementation with synthetic identities
// and an in-memory session store. Never bootstrap or access real credentials.
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import express from "express";
import session from "express-session";
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";

const source = fs.readFileSync("server/adminAuth.ts", "utf8");
for (const file of ["server/adminAuth.ts", "server/adminBootstrap.ts", "server/replitAuth.ts", "server/inspectorAuth.ts"]) {
  assert.equal(fs.readFileSync(file, "utf8"), execFileSync("git", ["show", `HEAD:${file}`], { encoding: "utf8" }),
    "Existing authentication/session source must remain unchanged");
}
let version = 1;
const identity = () => ({ id: "fixture-admin", email: "admin@example.invalid", firstName: "Synthetic", lastName: "Admin", credentialVersion: String(version) });
const fakeBootstrap = {
  ADMIN_EMAIL: "admin@example.invalid",
  bootstrapAdminAccount: async () => ({ configured: true }),
  authenticateAdmin: async (email, password) => email === "admin@example.invalid" && password === "synthetic-only" ? identity() : null,
  restoreAdminSession: async (id, credentialVersion) =>
    id === "fixture-admin" && credentialVersion === String(version) ? identity() : null,
};
const realRequire = createRequire(import.meta.url);
const context = vm.createContext({
  exports: {}, console, Buffer, URL,
  process: { env: { NODE_ENV: "production", SESSION_SECRET: "synthetic-session-only" } },
  require: name => name === "./adminBootstrap" ? fakeBootstrap : realRequire(name),
});
vm.runInContext(ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, esModuleInterop: true },
}).outputText, context);
const app = express();
app.set("trust proxy", true); app.use(express.json());
await context.exports.setupLocalAuth(app, new session.MemoryStore());
for (const endpoint of ["/api/admin/acquisition", "/api/admin/booking-leads", "/api/admin/bookings"]) {
  app.get(endpoint, context.exports.isAdminAuthenticated, (_req, res) => res.json({ fixture: true }));
}
const server = app.listen(0, "127.0.0.1");
await new Promise(resolve => server.once("listening", resolve));
const base = `http://127.0.0.1:${server.address().port}`;
let cookie = "", csrf = "";
async function request(url, body, extra = {}) {
  const response = await fetch(base + url, {
    method: body ? "POST" : "GET", redirect: "manual",
    headers: { "x-forwarded-proto": "https", origin: base.replace("http:", "https:"),
      cookie, "content-type": "application/json", ...extra }, ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const setCookie = response.headers.get("set-cookie");
  if (setCookie) cookie = setCookie.split(";")[0];
  return response;
}
const login = () => request("/api/admin/login", { username: "admin@example.invalid", password: "synthetic-only", csrfToken: csrf });
try {
  assert.equal((await request("/api/admin/acquisition")).status, 401);
  const config = await request("/api/admin/login-config");
  csrf = (await config.json()).csrfToken;
  const anonymousCookie = cookie;
  assert.match(config.headers.get("set-cookie"), /HttpOnly/i);
  assert.match(config.headers.get("set-cookie"), /Secure/i);
  assert.match(config.headers.get("set-cookie"), /SameSite=Lax/i);
  assert.equal((await request("/api/admin/login", { username: "admin@example.invalid", password: "synthetic-only" })).status, 403);
  assert.equal((await request("/api/admin/login", { username: "admin@example.invalid", password: "synthetic-only", csrfToken: csrf },
    { origin: "https://different.example.invalid" })).status, 403);
  assert.equal((await login()).status, 303);
  assert.notEqual(cookie, anonymousCookie, "Successful login regenerates the session ID");
  for (const endpoint of ["/api/admin/acquisition", "/api/admin/booking-leads", "/api/admin/bookings"]) {
    assert.equal((await request(endpoint)).status, 200);
  }
  const signedCookie = cookie;
  assert.equal((await request("/api/admin/logout")).status, 302);
  cookie = signedCookie;
  assert.equal((await request("/api/admin/acquisition")).status, 401, "Logout destroys the old server session");
  cookie = ""; csrf = (await (await request("/api/admin/login-config")).json()).csrfToken;
  await login(); version++;
  assert.equal((await request("/api/admin/acquisition")).status, 401, "Credential version change invalidates session restoration");
  cookie = ""; csrf = (await (await request("/api/admin/login-config")).json()).csrfToken;
  for (let i = 0; i < 5; i++) {
    assert.equal((await request("/api/admin/login", { username: "admin@example.invalid", password: "wrong-fixture", csrfToken: csrf })).status, 303);
  }
  assert.equal((await login()).status, 429, "Failed-login rate limit remains enforced");
  console.log("PASS unchanged admin auth: protected endpoints, secure/HttpOnly/Lax cookies, CSRF/origin, session rotation/restoration/logout and rate limiting; synthetic fixtures only.");
} finally { await new Promise(resolve => server.close(resolve)); }