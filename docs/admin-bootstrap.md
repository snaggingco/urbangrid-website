# Unpublished admin bootstrap and login

- Sign in at `/admin/login` with the fixed username/email **info@urbangrid.ae**.
- Set **URBANGRID_ADMIN_INITIAL_PASSWORD** using Replit Secrets. Use a strong password of 12–72 UTF-8 bytes; bcrypt silently truncates longer inputs, so those are rejected.
- There is no default password and no fallback to `ADMIN_PASSWORD`, `ADMIN_USERNAME` or `ADMIN_EMAIL`.
- Restart the development application after setting/changing the secret. Startup idempotently creates or promotes the existing email account and stores a bcrypt cost-12 hash in private `admin_credentials`, separate from ordinary user API data.
- Unchanged secrets retain the same account, hash and credential version. Changing the secret replaces the hash and invalidates older admin sessions.
- Old legacy admin sessions must sign in again. Inspector authentication remains separate and cannot access admin APIs.
- The server requires same-origin CSRF-protected sign-in; failed attempts are limited to five per 15 minutes per IP per running process. Sessions regenerate on login, use HttpOnly/SameSite=Lax cookies (Secure in production), and recheck current credential version and admin role on each authenticated request.
- Authentication request paths are excluded from visitor and response-payload logs. Exceptions in bootstrap/auth/verification are replaced with constant generic messages; no plaintext/hash is returned in user APIs or written to source/config files.

## Changes
- `shared/schema.ts`: additive private `adminCredentials` table.
- `migrations/0003_admin_credentials.sql`: additive development migration only; no startup DDL.
- `server/adminBootstrap.ts`: server-only secret-backed bootstrap and safe identity lookups.
- `server/adminAuth.ts`: persistent authentication, session revalidation, CSRF and rate limiting.
- `server/routes.ts`: await bootstrap and use the central role/identity-aware admin guard for existing protected endpoints.
- `server/index.ts`: exclude auth routes from visitor/request payload logs.
- `client/src/pages/admin/AdminLogin.tsx`: fixed admin email, CSRF hidden field and disabled sign-in until secure initialization; never reads the password secret.
- `scripts/test-admin-auth.ts`: generated synthetic credentials, auth-only server and rollback-only database fixtures; no real email/payment startup.
- `scripts/verify-admin-login.ts`: actual development native-form login using the secret internally, with sanitized pass/fail output and read-only checks of protected leads/bookings. No booking/lead mutation or staff email.
- `package.json`: `test:admin-auth` and `verify:admin-login`.

## Verification
Run `npm run test:admin-auth` for isolated safeguards. After the secret is configured and the development workflow restarted, run `npm run verify:admin-login` to verify the actual login, account/hash idempotence, admin identity and protected leads/bookings access. It uses the development preview domain; it never prints credentials, cookies, API bodies or raw exceptions.

No automatic publication, production schema/data change, or modification to residential pricing/payment/report-release rules.

The additive schema migration was applied only to development. Isolated authentication safeguards, lead/booking regressions, protected-component fixtures and the production build passed. The existing 22 unrelated type-check errors remain.

The requested secret is configured and actual development native-form login passed: persisted bcrypt credential, unchanged hash/account on repeat bootstrap, safe signed-in identity, regenerated session, authenticated leads/bookings access and access rejection after logout. No credential values or API response bodies were printed. The login page was visually checked; signed-in admin screens were verified through their authenticated APIs, not a signed-in browser.

The development preview proxy was observed changing the app's SameSite=Lax cookie to SameSite=None with Secure and HttpOnly. The development verifier accepts that only on the runtime-managed replit.dev preview domain with both protection flags; application/production cookie settings were not weakened.