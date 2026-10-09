import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import connectPg from "connect-pg-simple";
import type { Express, Request, RequestHandler } from "express";
import crypto from "node:crypto";
import { ADMIN_EMAIL, bootstrapAdminAccount, authenticateAdmin, restoreAdminSession, type AdminIdentity } from "./adminBootstrap";
import { websiteDatabaseUrl } from "./network/runtime";
import { databaseConfigured } from "./db";
import { ukEnvironment } from "./ukRuntime";

declare module "express-session" { interface SessionData { adminLoginCsrf?: string } }
const failures = new Map<string, { count: number; until: number }>();
function attemptKey(req: Request) { return crypto.createHash("sha256").update(req.ip || "unknown").digest("hex"); }
function loginCsrf(req: Request) { return req.session.adminLoginCsrf ||= crypto.randomBytes(32).toString("hex"); }
function loginUser(user: AdminIdentity) {
  return { type: "admin", credentialVersion: user.credentialVersion,
    claims: { sub: user.id, email: user.email, first_name: user.firstName, last_name: user.lastName, role: "admin" } };
}
export const isAdminAuthenticated: RequestHandler = (req, res, next) => {
  const user = req.user as ReturnType<typeof loginUser> | undefined;
  if (req.isAuthenticated() && user?.type === "admin" && user.claims.role === "admin" && user.claims.email === ADMIN_EMAIL) return next();
  res.status(401).json({ message: "Unauthorized" });
};
export async function setupLocalAuth(app: Express, testSessionStore?: session.Store) {
  if (!databaseConfigured && !testSessionStore) return;
  const ukSessionSecret = process.env.URBANGRID_GB_SESSION_SECRET;
  if (!ukSessionSecret) throw new Error("Dedicated UK session secret is required for UK authentication");
  let ready = false;
  try { ready = (await bootstrapAdminAccount()).configured; }
  catch {
    // Never log the original exception: DB bind parameters can contain a hash.
    console.warn("Admin authentication is unavailable; check server configuration.");
  }

  const PgSessionStore = connectPg(session);
  const sessionStore = testSessionStore || new PgSessionStore({
    conString: websiteDatabaseUrl(ukEnvironment(process.env)),
    createTableIfMissing: false,
    tableName: "sessions",
  });

  // Setup session middleware for passport
  app.use(session({
    secret: ukSessionSecret,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    name: "urbangrid.sid",
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 8 * 60 * 60 * 1000,
    },
  }));

  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Serialize user for session storage
  passport.serializeUser((user: any, done) => {
    done(null, user.type === "admin" ? {
      type: "admin", id: user.claims.sub, credentialVersion: user.credentialVersion,
    } : user);
  });

  // Deserialize user from session
  passport.deserializeUser(async (user: any, done) => {
    if (user.type === "inspector") return done(null, user);
    if (!ready || user.type !== "admin" || typeof user.id !== "string" || typeof user.credentialVersion !== "string") return done(null, false);
    try {
      const current = await restoreAdminSession(user.id, user.credentialVersion);
      done(null, current ? loginUser(current) : false);
    } catch { done(null, false); }
  });

  // Local strategy for super admin
  passport.use('local', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  }, async (username, password, done) => {
    try {
      const user = ready ? await authenticateAdmin(username, password) : null;
      done(null, user ? loginUser(user) : false);
    } catch { done(null, false); }
  }));

  // Admin login routes
  app.get("/api/admin/login-config", (req, res) => {
    res.set("Cache-Control", "no-store").json({ username: ADMIN_EMAIL, csrfToken: loginCsrf(req) });
  });
  app.post('/api/admin/login', (req, res, next) => {
    res.set("Cache-Control", "no-store");
    let sameOrigin = false;
    try {
      const from = new URL(req.get("origin") || "");
      sameOrigin = from.host === req.get("host") && ["https:", ...(process.env.NODE_ENV !== "production" ? ["http:"] : [])].includes(from.protocol);
    } catch { /* Reject missing/invalid Origin without exposing request details. */ }
    const token = req.body?.csrfToken;
    const expected = req.session.adminLoginCsrf;
    if (!sameOrigin || typeof token !== "string" || !/^[a-f0-9]{64}$/.test(token) || !expected || token.length !== expected.length ||
        !crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected))) {
      return res.status(403).json({ message: "Refresh the sign-in page and try again." });
    }
    const now = Date.now(), key = attemptKey(req);
    failures.forEach((value, address) => { if (value.until <= now) failures.delete(address); });
    if ((failures.get(key)?.count || 0) >= 5 || (failures.size >= 10000 && !failures.has(key))) {
      return res.status(429).json({ message: "Too many sign-in attempts. Try again later." });
    }
    // Reserve before async password verification, so parallel requests cannot
    // all pass the limit while previous attempts are still being checked.
    const bucket = failures.get(key) || { count: 0, until: now + 15 * 60 * 1000 };
    bucket.count++; failures.set(key, bucket);
    passport.authenticate("local", (error: unknown, user: any) => {
      if (error || !user) {
        return res.redirect(303, "/admin/login?error=1");
      }
      req.logIn(user, err => {
        if (err) return res.status(503).json({ message: "Sign-in is unavailable. Try again later." });
        failures.delete(key);
        // Passport regenerates the session on sign-in; do not retain the anonymous session ID.
        req.session.save(err => err ? res.status(503).json({ message: "Sign-in is unavailable. Try again later." }) : res.redirect(303, "/admin"));
      });
    })(req, res, next);
  });

  app.get('/api/admin/logout', (req, res) => {
    req.logout(() => {
      req.session.destroy(() => {
        res.clearCookie("urbangrid.sid", { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production" });
        res.redirect('/');
      });
    });
  });

  app.get('/api/admin/login', (req, res) => {
    res.set("Cache-Control", "no-store").set("X-Robots-Tag", "noindex, nofollow");
    const error = req.query.error;
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Admin Login - UrbanGrid</title>
        <style>
          body { font-family: Inter, sans-serif; background: #f9fafb; margin: 0; padding: 2rem; }
          .container { max-width: 400px; margin: 0 auto; background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
          .logo { color: #064E3B; font-size: 2rem; font-weight: bold; text-align: center; margin-bottom: 2rem; }
          .form-group { margin-bottom: 1rem; }
          label { display: block; margin-bottom: 0.5rem; color: #374151; font-weight: 500; }
          input { width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 6px; font-size: 1rem; }
          input:focus { outline: none; border-color: #064E3B; box-shadow: 0 0 0 3px rgba(6, 78, 59, 0.1); }
          button { width: 100%; background: #064E3B; color: white; padding: 0.75rem; border: none; border-radius: 6px; font-size: 1rem; font-weight: 600; cursor: pointer; }
          button:hover { background: #065f46; }
          .error { color: #dc2626; margin-bottom: 1rem; padding: 0.5rem; background: #fee2e2; border-radius: 4px; }
          .back-link { text-align: center; margin-top: 1rem; }
          .back-link a { color: #064E3B; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">UrbanGrid</div>
          <h2 style="text-align: center; margin-bottom: 2rem; color: #374151;">Admin Login</h2>
          ${error ? '<div class="error">Invalid username or password</div>' : ''}
          <form method="POST" action="/api/admin/login">
            <input type="hidden" name="csrfToken" value="${loginCsrf(req)}" />
            <div class="form-group">
              <label for="username">Admin email</label>
              <input type="email" id="username" name="username" autocomplete="username" value="${ADMIN_EMAIL}" readonly required />
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" name="password" autocomplete="current-password" required />
            </div>
            <button type="submit">Login</button>
          </form>
          <div class="back-link">
            <a href="/">← Back to Website</a>
          </div>
        </div>
      </body>
      </html>
    `);
  });
}