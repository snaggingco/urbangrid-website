// Isolated auth-only server and rollback transaction; no email/Stripe/report startup.
import assert from "node:assert/strict";
import crypto from "node:crypto";
import express from "express";
import session from "express-session";
import { count, eq } from "drizzle-orm";
import { db, pool } from "../server/db";
import { adminCredentials, users } from "../shared/schema";
import { bootstrapAdminAccount, authenticateAdmin, restoreAdminSession, ADMIN_EMAIL, ADMIN_PASSWORD_SECRET } from "../server/adminBootstrap";
import { setupLocalAuth, isAdminAuthenticated } from "../server/adminAuth";
import { setupInspectorAuth } from "../server/inspectorAuth";

const originalSecret = process.env[ADMIN_PASSWORD_SECRET];
const originalLegacy = process.env.ADMIN_PASSWORD;
const rollback = new Error("ROLLBACK_ADMIN_AUTH_TEST");
const tables = [users, adminCredentials];
const counts = async () => Promise.all(tables.map(async table => (await db.select({ n: count() }).from(table))[0].n));
let stage = "initialization";
try {
  assert.equal(process.env.NODE_ENV, "development");
  const before = await counts();
  delete process.env[ADMIN_PASSWORD_SECRET];
  process.env.ADMIN_PASSWORD = crypto.randomUUID();
  assert.equal((await bootstrapAdminAccount()).configured, false, "Legacy secret must not enable bootstrap");
  process.env[ADMIN_PASSWORD_SECRET] = crypto.randomUUID();
  const password = process.env[ADMIN_PASSWORD_SECRET]!;
  await db.transaction(async tx => {
    const oldSelect = db.select, oldTransaction = db.transaction;
    db.select = tx.select.bind(tx) as typeof db.select;
    db.transaction = tx.transaction.bind(tx) as typeof db.transaction;
    let server: ReturnType<express.Express["listen"]> | undefined;
    try {
      stage = "bootstrap and idempotence";
      await bootstrapAdminAccount();
      const [first] = await db.select().from(adminCredentials).where(eq(adminCredentials.username, ADMIN_EMAIL));
      assert.match(first.passwordHash, /^\$2[aby]\$12\$/);
      assert.notEqual(first.passwordHash, password);
      assert.equal((await bootstrapAdminAccount()).changed, false);
      const [second] = await db.select().from(adminCredentials).where(eq(adminCredentials.username, ADMIN_EMAIL));
      assert.equal(second.userId, first.userId);
      assert.equal(second.passwordHash, first.passwordHash);
      assert.equal(second.credentialVersion, first.credentialVersion);
      const app = express();
      app.set("trust proxy", 1);
      app.use(express.urlencoded({ extended: false }));
      app.use(express.json());
      await setupLocalAuth(app, new session.MemoryStore());
      setupInspectorAuth(app);
      app.get("/test/protected", isAdminAuthenticated, (_req, res) => res.json({ ok: true }));
      app.post("/test/inspector-session", (req, res) => req.logIn({
        type: "inspector", claims: { sub: "fixture", role: "inspector", email: "fixture@example.invalid" },
      }, () => res.json({ ok: true })));
      server = app.listen(0, "127.0.0.1");
      await new Promise<void>(r => server!.once("listening", r));
      const base = `http://127.0.0.1:${(server.address() as { port: number }).port}`;
      let cookie = "";
      const api = async (path: string, body?: Record<string, unknown>, origin = base, testIp?: string) => {
        const response = await fetch(base + path, { method: body ? "POST" : "GET", redirect: "manual",
          headers: { Cookie: cookie, Origin: origin, "Content-Type": "application/json",
            ...(testIp ? { "X-Forwarded-For": testIp } : {}) },
          ...(body ? { body: JSON.stringify(body) } : {}) });
        cookie = response.headers.getSetCookie().map(c => c.split(";")[0]).find(c => c.startsWith("urbangrid.sid=")) || cookie;
        return response;
      };
      stage = "login CSRF and rejected credentials";
      assert.equal((await api("/test/protected")).status, 401);
      const config = await (await api("/api/admin/login-config")).json();
      assert.deepEqual(Object.keys(config).sort(), ["csrfToken", "username"]);
      assert.equal(config.username, ADMIN_EMAIL);
      const csrfToken = config.csrfToken;
      const body = { username: ADMIN_EMAIL, password, csrfToken };
      assert.equal((await api("/api/admin/login", { ...body, csrfToken: "" })).status, 403);
      assert.equal((await api("/api/admin/login", { ...body, csrfToken: "é".repeat(64) })).status, 403);
      assert.equal((await api("/api/admin/login", body, "https://attacker.invalid")).status, 403);
      assert.equal((await api("/api/admin/login", { ...body, username: "admin" })).headers.get("location"), "/admin/login?error=1");
      assert.equal((await api("/api/admin/login", { ...body, password: crypto.randomUUID() })).headers.get("location"), "/admin/login?error=1");
      stage = "successful login and session fixation protection";
      const anonymousCookie = cookie;
      const success = await api("/api/admin/login", body);
      assert.equal(success.status, 303); assert.equal(success.headers.get("location"), "/admin");
      assert.notEqual(cookie, anonymousCookie);
      assert.match(success.headers.getSetCookie().join(" "), /HttpOnly/);
      assert.match(success.headers.getSetCookie().join(" "), /SameSite=Lax/);
      const authenticated = await (await api("/api/auth/user")).json();
      assert.equal(authenticated.email, ADMIN_EMAIL); assert.equal(authenticated.role, "admin");
      assert(!JSON.stringify(authenticated).includes(password));
      assert(!JSON.stringify(authenticated).includes(first.passwordHash));
      assert.equal((await api("/test/protected")).status, 200);
      stage = "password rotation and revoked sessions";
      const rotated = crypto.randomUUID();
      process.env[ADMIN_PASSWORD_SECRET] = rotated;
      assert.equal((await bootstrapAdminAccount()).changed, true);
      assert.equal(await authenticateAdmin(ADMIN_EMAIL, password), null);
      assert(await authenticateAdmin(ADMIN_EMAIL, rotated));
      assert.equal(await restoreAdminSession(first.userId, first.credentialVersion), null);
      assert.equal((await api("/test/protected")).status, 401);
      const renewed = await (await api("/api/admin/login-config")).json();
      assert.equal((await api("/api/admin/login", { username: ADMIN_EMAIL, password: rotated, csrfToken: renewed.csrfToken })).status, 303);
      await tx.update(users).set({ role: "user" }).where(eq(users.id, first.userId));
      assert.equal((await api("/test/protected")).status, 401);
      await tx.update(users).set({ role: "admin" }).where(eq(users.id, first.userId));
      stage = "inspector isolation and logout";
      await api("/test/inspector-session", {});
      assert.equal((await (await api("/api/auth/user")).json()).role, "inspector");
      assert.equal((await api("/test/protected")).status, 401);
      await api("/api/admin/logout");
      assert.equal((await api("/api/auth/user")).status, 401);
      stage = "login rate limiting";
      const rateConfig = await (await api("/api/admin/login-config")).json();
      for (let i = 0; i < 5; i++) assert.equal((await api("/api/admin/login", {
        username: ADMIN_EMAIL, password: crypto.randomUUID(), csrfToken: rateConfig.csrfToken,
      })).status, 303);
      assert.equal((await api("/api/admin/login", { username: ADMIN_EMAIL, password: rotated, csrfToken: rateConfig.csrfToken })).status, 429);
      stage = "concurrent login rate limiting";
      const simultaneous = await Promise.all(Array.from({ length: 6 }, () => api("/api/admin/login", {
        username: ADMIN_EMAIL, password: crypto.randomUUID(), csrfToken: rateConfig.csrfToken,
      }, base, "192.0.2.42")));
      assert.equal(simultaneous.filter(r => r.status === 303).length, 5);
      assert.equal(simultaneous.filter(r => r.status === 429).length, 1);
    } finally {
      if (server) await new Promise<void>(r => server!.close(() => r()));
      db.select = oldSelect; db.transaction = oldTransaction;
    }
    throw rollback;
  }).catch(error => { if (error !== rollback) throw error; });
  assert.deepEqual(await counts(), before);
  console.log("PASS admin bootstrap, bcrypt hashing, idempotence, CSRF, login, session regeneration, rotation/revocation, inspector isolation, logout and rate limiting.");
  console.log("All authentication fixtures rolled back; no real credentials, provider calls or notifications used.");
} catch {
  console.error(`FAIL admin authentication check at ${stage}; credentials and response bodies withheld.`);
  process.exitCode = 1;
} finally {
  if (originalSecret === undefined) delete process.env[ADMIN_PASSWORD_SECRET]; else process.env[ADMIN_PASSWORD_SECRET] = originalSecret;
  if (originalLegacy === undefined) delete process.env.ADMIN_PASSWORD; else process.env.ADMIN_PASSWORD = originalLegacy;
  await pool.end();
}