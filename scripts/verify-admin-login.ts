// Uses the requested secret ONLY inside this server-side development process.
// Never print HTTP bodies, cookies, passwords, hashes or original exceptions.
import assert from "node:assert/strict";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, pool } from "../server/db";
import { adminCredentials } from "../shared/schema";
import { bootstrapAdminAccount, ADMIN_EMAIL } from "../server/adminBootstrap";
let stage = "development configuration";
try {
  assert.equal(process.env.NODE_ENV, "development");
  const password = process.env.URBANGRID_ADMIN_INITIAL_PASSWORD;
  assert(password && process.env.REPLIT_DEV_DOMAIN);
  const base = new URL(`https://${process.env.REPLIT_DEV_DOMAIN}`).origin;
  let cookie = "";
  const api = async (path: string, body?: Record<string, string>) => {
    const response = await fetch(base + path, { method: body ? "POST" : "GET", redirect: "manual",
      headers: { Cookie: cookie, Origin: base, ...(body ? { "Content-Type": "application/x-www-form-urlencoded" } : {}) },
      ...(body ? { body: new URLSearchParams(body).toString() } : {}) });
    cookie = response.headers.getSetCookie().map(c => c.split(";")[0]).find(c => c.startsWith("urbangrid.sid=")) || cookie;
    return response;
  };
  stage = "persistent hash and bootstrap idempotence";
  const [before] = await db.select().from(adminCredentials).where(eq(adminCredentials.username, ADMIN_EMAIL));
  assert(before); assert.match(before.passwordHash, /^\$2[aby]\$12\$/);
  assert(await bcrypt.compare(password, before.passwordHash));
  assert.equal((await bootstrapAdminAccount()).changed, false);
  const [after] = await db.select().from(adminCredentials).where(eq(adminCredentials.username, ADMIN_EMAIL));
  assert.equal(after.userId, before.userId);
  assert.equal(after.passwordHash, before.passwordHash);
  assert.equal(after.credentialVersion, before.credentialVersion);
  stage = "anonymous access protection";
  assert.equal((await api("/api/admin/leads")).status, 401);
  assert.equal((await api("/api/admin/bookings")).status, 401);
  stage = "login configuration";
  const configResponse = await api("/api/admin/login-config");
  assert.equal(configResponse.status, 200);
  const config = await configResponse.json();
  assert.deepEqual(Object.keys(config).sort(), ["csrfToken", "username"]);
  assert.equal(config.username, ADMIN_EMAIL);
  stage = "native form login";
  const previousCookie = cookie;
  const response = await api("/api/admin/login", { username: ADMIN_EMAIL, password, csrfToken: config.csrfToken });
  assert.equal(response.status, 303);
  stage = "form redirect";
  assert.equal(response.headers.get("location"), "/admin");
  stage = "session regeneration and cookie protection";
  assert.notEqual(cookie, previousCookie);
  const cookieFlags = response.headers.getSetCookie().join(" ");
  assert.match(cookieFlags, /;\s*HttpOnly(?:;|$)/i);
  // The development preview proxy was observed rewriting Lax to None+Secure
  // for iframe previews. Never accept None without Secure or outside replit.dev.
  const securePreviewCookie = new URL(base).hostname.endsWith(".replit.dev") &&
    /SameSite=None/i.test(cookieFlags) && /;\s*Secure(?:;|$)/i.test(cookieFlags);
  assert(/SameSite=Lax/i.test(cookieFlags) || securePreviewCookie);
  stage = "safe signed-in identity";
  const identityResponse = await api("/api/auth/user");
  assert.equal(identityResponse.status, 200);
  const identity = await identityResponse.json();
  assert.equal(identity.email, ADMIN_EMAIL); assert.equal(identity.role, "admin");
  assert(!JSON.stringify(identity).includes(password));
  assert(!JSON.stringify(identity).includes(after.passwordHash));
  stage = "protected leads and bookings";
  assert.equal((await api("/api/admin/leads")).status, 200);
  assert.equal((await api("/api/admin/bookings")).status, 200);
  stage = "logout revocation";
  assert.equal((await api("/api/admin/logout")).status, 302);
  assert.equal((await api("/api/admin/leads")).status, 401);
  assert.equal((await api("/api/admin/bookings")).status, 401);
  console.log("PASS development admin native-form login, persisted bcrypt credential, idempotent bootstrap, safe identity, session regeneration, protected leads/bookings and logout.");
} catch {
  console.error(`FAIL development admin verification at ${stage}; credentials and response bodies withheld.`);
  process.exitCode = 1;
} finally { await pool.end(); }