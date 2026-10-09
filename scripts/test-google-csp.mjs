// Read-only regression check: execute just the security middleware in a VM.
// No server startup, Google requests, conversions, or database writes.
// Run after npm run build: node scripts/test-google-csp.mjs [development-url]
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

// Original policy snapshot: changes beyond these three explicit additions
// require a deliberate review rather than silently weakening the allowlist.
const original = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://googleads.g.doubleclick.net https://www.googleadservices.com https://replit.com https://bzrcdn.openai.com",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "img-src 'self' data: blob: https: https://bzr.openai.com",
  "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://www.googletagmanager.com https://www.google.com https://googleads.g.doubleclick.net https://ad.doubleclick.net https://stats.g.doubleclick.net https://*.replit.dev wss://*.replit.dev https://bzr.openai.com https://bzrcdn.openai.com",
  "frame-src 'self' https://www.googletagmanager.com https://td.doubleclick.net https://www.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' https://checkout.stripe.com",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

function parse(policy) {
  assert(policy, "An enforcing CSP header must be present");
  const entries = policy.split(";").map(part => part.trim().split(/\s+/));
  const result = new Map(entries.map(([name, ...values]) => [name, values]));
  assert.equal(result.size, entries.length, "No duplicate directives");
  for (const values of result.values()) {
    assert.equal(new Set(values).size, values.length, "No duplicate allowed origins");
  }
  return result;
}

function verify(policy, label) {
  const expected = parse(original);
  expected.get("script-src").push("https://www.google.com");
  expected.get("connect-src").push(
    "https://pagead2.googlesyndication.com",
    "https://www.googleadservices.com",
  );
  const actual = parse(policy);
  assert.deepEqual([...actual.keys()].sort(), [...expected.keys()].sort(), `${label}: preserve every directive`);
  for (const [directive, values] of expected) {
    assert.deepEqual([...actual.get(directive)].sort(), [...values].sort(),
      `${label}: ${directive} must retain its original allowlist and only approved additions`);
  }
  assert(!actual.get("connect-src").includes("*"));
  assert(!actual.get("connect-src").includes("https:"));
  assert(!actual.has("script-src-elem"), "Existing script-src governs scripts; do not add a conflicting override");
}

let sourcePolicy;
for (const file of ["server/index.ts", "dist/index.js"]) {
  const source = await readFile(file, "utf8");
  const header = source.indexOf("Content-Security-Policy");
  const start = source.lastIndexOf("app.use(", header);
  const end = source.indexOf("\n});", header);
  assert(header >= 0 && start >= 0 && end > header, `${file}: find security middleware`);
  const headers = new Map();
  let nextCalls = 0;
  const context = vm.createContext({
    app: {
      use(callback) {
        callback({}, { setHeader(name, value) { headers.set(name, value); } }, () => nextCalls++);
      },
    },
  });
  vm.runInContext(source.slice(start, end + 4), context);
  assert.equal(nextCalls, 1);
  assert.equal(headers.get("Strict-Transport-Security"), "max-age=31536000; includeSubDomains; preload");
  assert.equal(headers.get("X-Content-Type-Options"), "nosniff");
  assert.equal(headers.get("X-Frame-Options"), "DENY");
  assert.equal(headers.get("X-XSS-Protection"), "1; mode=block");
  assert.equal(headers.get("Referrer-Policy"), "strict-origin-when-cross-origin");
  assert.equal(headers.get("Permissions-Policy"), "camera=(), microphone=(), geolocation=(), usb=()");
  assert(!headers.has("Content-Security-Policy-Report-Only"));
  const policy = headers.get("Content-Security-Policy");
  verify(policy, file);
  if (sourcePolicy) assert.equal(policy, sourcePolicy, "Production policy matches source");
  else sourcePolicy = policy;
}

if (process.argv[2]) {
  const base = new URL(process.argv[2]);
  assert(base.hostname.endsWith(".replit.dev") || ["localhost", "127.0.0.1"].includes(base.hostname),
    "Use development only: the production site changes after the user publishes");
  for (const pathname of ["/", "/locations/dubai", "/contact"]) {
    const response = await fetch(new URL(pathname, base));
    assert.equal(response.status, 200);
    const policy = response.headers.get("content-security-policy");
    verify(policy, pathname);
    assert.equal(policy, sourcePolicy, `${pathname}: server emits the updated policy`);
    assert.equal(response.headers.get("content-security-policy-report-only"), null);
  }
}

console.log("PASS: Source, production build, and requested dev routes preserve the original CSP/security headers and add only the three approved Google origins.");