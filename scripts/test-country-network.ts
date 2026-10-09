import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { COUNTRY_PROFILES, countryProfile, adoptCountrySite, NETWORK_LOGIN_URL } from "../shared/network/country";
import { createLeadEnvelope, campaignPage, leadEnvelopeSchema } from "../shared/network/leadContract";
import { campaignTouch } from "../shared/network/attribution";
import { contactClick, safeCampaignValue, safePageUrl, measurementAllowed, UAE_MEASUREMENT } from "../shared/network/measurement";
import { PRIVACY_CONTRACT } from "../shared/network/privacy";
import { buildMatchesRelease } from "../shared/network/health";
import { leadAcknowledged, leadRetryDelay, leadEventMatchesSite, LEAD_LEASE_MS } from "../shared/network/outbox";
import { resolveSiteIdentity, networkRuntime, websiteDatabaseUrl, assertUaeApplication } from "../server/network/runtime";
import { integrationEndpoint } from "../server/network/recipient";
import { sendLeadEvent } from "../server/network/transport";

let passed = 0;
function check(label: string, run: () => void) { run(); passed++; console.log("PASS", label); }
const live = "https://nzbewemalujbhnjbrpcs.supabase.co/functions/v1/urbangrid-integration";
const dev = "https://ewyxbbfktyhmmwocvmqs.supabase.co/functions/v1/urbangrid-integration";
const key = "fixture-not-a-real-credential-".repeat(3);
const ae = { NODE_ENV: "production", REPLIT_DOMAINS: "www.urbangrid.ae,urbangrid.replit.app",
  URBANGRID_OPERATIONS_INTEGRATION_URL: live, URBANGRID_NETWORK_INTEGRATION_KEY: key,
  DATABASE_URL: "postgresql://fixture:fixture@ae.invalid/ae" };
const identity = { countryCode: "AE", sourceDomain: "urbangrid.ae", clientCode: "urbangrid-website" };
check("exact registered currencies/timezones/locales; no invented Saudi domain", () => {
  assert.deepEqual(Object.values(COUNTRY_PROFILES).map(p => p.currency), ["AED", "SAR", "GBP"]);
  assert.equal(COUNTRY_PROFILES.AE.timezone, "Asia/Dubai");
  assert.equal(COUNTRY_PROFILES.SA.timezone, "Asia/Riyadh");
  assert.equal(COUNTRY_PROFILES.GB.timezone, "Europe/London");
  assert.equal(COUNTRY_PROFILES.GB.locale, "en-GB");
  assert.equal(COUNTRY_PROFILES.SA.domain, null);
});
check("unknown country and prototype keys fail closed", () => {
  for (const code of ["IN", "US", "", "toString", "__proto__"]) assert.throws(() => countryProfile(code));
});
check("UAE runtime keeps platform-bound legacy defaults", () => {
  assert.deepEqual(resolveSiteIdentity(ae), identity);
  assert.equal(networkRuntime(ae)?.key, key);
  assert.equal(websiteDatabaseUrl(ae), ae.DATABASE_URL);
});
check("explicit UAE matches legacy envelope identity", () => {
  assert.deepEqual(resolveSiteIdentity({ ...ae, REPLIT_DOMAINS: "", URBANGRID_COUNTRY_CODE: "ae",
    URBANGRID_SITE_DOMAIN: "www.urbangrid.ae", URBANGRID_NETWORK_CLIENT_CODE: "urbangrid-website" }), identity);
});
check("unbound development or clone cannot infer UAE delivery", () => {
  for (const host of ["clone.invalid", "urbangrid.ae.evil.invalid", "localhost", ""]) {
    assert.equal(networkRuntime({ ...ae, REPLIT_DOMAINS: host }), null);
  }
});
check("unregistered production clone cannot connect to generic UAE database", () => {
  assert.throws(() => websiteDatabaseUrl({ ...ae, REPLIT_DOMAINS: "clone.invalid" }));
  assert.throws(() => websiteDatabaseUrl({ ...ae, URBANGRID_COUNTRY_CODE: "IN" }));
});
check("invalid country/domain/client cannot deliver", () => {
  for (const fields of [
    { URBANGRID_COUNTRY_CODE: "IN" }, { URBANGRID_SITE_DOMAIN: "example.invalid" },
    { URBANGRID_NETWORK_CLIENT_CODE: "urbangrid-uk" }, { URBANGRID_SITE_DOMAIN: "https://urbangrid.ae" },
  ]) assert.equal(networkRuntime({ ...ae, ...fields }), null);
});
check("market metadata does not grant service or privacy launch approval", () => {
  assert.equal(COUNTRY_PROFILES.GB.services.length, 3);
  assert.equal(COUNTRY_PROFILES.GB.compliance.localReviewRequired, true);
  assert.equal(COUNTRY_PROFILES.SA.cta.phones.length, 0);
  assert.throws(() => adoptCountrySite({ country: "GB", domain: "urbangrid.co.uk",
    cta: { phones: [], whatsapp: null }, services: [], privacyReviewed: false }));
  const profile = adoptCountrySite({ country: "GB", domain: "urbangrid.co.uk",
    cta: { phones: ["447700900000"], whatsapp: null }, services: ["residential"], privacyReviewed: true });
  assert.equal(profile.compliance.localReviewRequired, false);
  assert.equal(profile.currency, "GBP");
  assert.throws(() => adoptCountrySite({ country: "SA", domain: "urbangrid.ae",
    cta: { phones: ["966500000000"], whatsapp: null }, services: ["residential"], privacyReviewed: true }));
});
for (const code of ["SA", "GB"] as const) {
  const env = { ...ae, REPLIT_DOMAINS: code === "GB" ? "urbangrid.co.uk" : "sa-fixture.invalid",
    URBANGRID_COUNTRY_CODE: code, URBANGRID_SITE_DOMAIN: code === "GB" ? "urbangrid.co.uk" : "sa-fixture.invalid",
    URBANGRID_NETWORK_CLIENT_CODE: COUNTRY_PROFILES[code].clientCode };
  check(code + " missing scoped secrets never uses UAE credentials/database", () => {
    assert.equal(networkRuntime(env), null);
    assert.throws(() => websiteDatabaseUrl(env));
  });
  const isolated = { ...env, [`URBANGRID_${code}_DATABASE_URL`]: `postgresql://fixture:fixture@${code.toLowerCase()}.invalid/${code}`,
    [`URBANGRID_${code}_NETWORK_INTEGRATION_KEY`]: key + "-" + code };
  check(code + " accepts independent registered configuration", () => {
    assert.equal(networkRuntime(isolated)?.countryCode, code);
    assert.equal(networkRuntime(isolated)?.clientCode, COUNTRY_PROFILES[code].clientCode);
    assert.notEqual(websiteDatabaseUrl(isolated), ae.DATABASE_URL);
  });
  check(code + " copied UAE secret or DB target is rejected", () => {
    assert.equal(networkRuntime({ ...isolated, [`URBANGRID_${code}_NETWORK_INTEGRATION_KEY`]: key }), null);
    assert.throws(() => websiteDatabaseUrl({ ...isolated, [`URBANGRID_${code}_DATABASE_URL`]:
      "postgresql://other:other@ae.invalid/ae" }));
    assert.equal(networkRuntime({ ...isolated, REPLIT_DOMAINS: "urbangrid.ae" }), null);
  });
  check(code + " cannot accidentally launch the UAE booking/email application", () => assert.throws(() => assertUaeApplication(isolated)));
}
check("recipient policy forbids redirects/credentials/query/IP/private hosts", () => {
  for (const value of ["http://example.invalid", "https://u:p@example.invalid", "https://127.0.0.1", "https://[::1]",
    "https://localhost", "https://example.local", live + "?key=x", live + "#fragment"]) assert.equal(integrationEndpoint(value), null);
  assert.equal(integrationEndpoint(live), live);
  assert.equal(networkRuntime({ ...ae, URBANGRID_OPERATIONS_INTEGRATION_URL: live.replace("urbangrid-integration", "other") }), null);
});
check("development and production recipients are environment-isolated", () => {
  assert.equal(networkRuntime({ ...ae, NODE_ENV: "development" }), null);
  assert.equal(networkRuntime({ ...ae, NODE_ENV: "development", URBANGRID_OPERATIONS_INTEGRATION_URL: dev })?.endpoint, dev);
  assert.equal(networkRuntime({ ...ae, URBANGRID_OPERATIONS_INTEGRATION_URL: dev }), null);
});
const touch = campaignTouch("https://urbangrid.ae/contact?utm_source=google&utm_campaign=fixture&gclid=fixture-only&email=secret#private",
  "https://example.invalid", "2026-10-09T00:00:00Z");
const lead = { id: 77, name: "Fixture", email: "fixture@example.invalid", phone: null, enquiryType: "Property Snagging",
  message: "Synthetic isolated fixture", leadSource: "contact", attribution: { firstTouch: touch, lastTouch: touch } };
const event = createLeadEnvelope(lead, identity);
check("stable UAE event shape, attribution and event ID remain compatible", () => {
  assert.equal(event.eventId, "urbangrid-website.lead.created.77");
  assert.equal(leadEnvelopeSchema.safeParse(event).success, true);
  assert.deepEqual(event, {
    eventId: "urbangrid-website.lead.created.77", eventType: "lead.created", schemaVersion: 1,
    payload: { countryCode: "AE", sourceDomain: "urbangrid.ae",
      sourcePage: "/contact?utm_source=google&utm_campaign=fixture&gclid=fixture-only",
      attribution: { firstTouch: touch, lastTouch: touch, utm_source: "google", utm_campaign: "fixture", gclid: "fixture-only" },
      context: { channel: "contact", firstLandingPage: "/contact?utm_source=google&utm_campaign=fixture&gclid=fixture-only",
        referrer: "https://example.invalid" },
      lead: { id: "77", name: "Fixture", email: "fixture@example.invalid", phone: null,
        category: "residential", service: "Property Snagging", message: "Synthetic isolated fixture" } },
  });
});
check("lead categories retain consultancy, technical and sample-report semantics", () => {
  assert.equal(createLeadEnvelope({ ...lead, enquiryType: "Reserve Fund Study" }, identity).payload.lead.category, "consultancy");
  assert.equal(createLeadEnvelope({ ...lead, enquiryType: "Structural Survey" }, identity).payload.lead.category, "technical");
  assert.equal(createLeadEnvelope({ ...lead, enquiryType: "Structural Survey", leadSource: "sample_report" }, identity).payload.lead.category, "residential");
});
check("schema refuses unsupported markets and malformed lead identities", () => {
  assert.equal(leadEnvelopeSchema.safeParse({ ...event, payload: { ...event.payload, countryCode: "IN" } }).success, false);
  assert.equal(leadEnvelopeSchema.safeParse({ ...event, schemaVersion: 2 }).success, false);
});
check("persisted events cannot be delivered using another country identity", () => {
  assert.equal(leadEventMatchesSite(event, identity), true);
  assert.equal(leadEventMatchesSite(event, { ...identity, countryCode: "GB" }), false);
  assert.equal(leadEventMatchesSite(event, { ...identity, clientCode: "urbangrid-uk" }), false);
});
check("retry schedule and abandoned-lease interval match proven worker", () => {
  assert.deepEqual([0, 1, 2, 7, 20].map(leadRetryDelay), [30000, 60000, 120000, 3600000, 3600000]);
  assert.equal(LEAD_LEASE_MS, 120000);
});
check("only accepted:true and HTTP success acknowledge durable receipt", () => {
  for (const result of [null, {}, { accepted: "true" }, { accepted: false }]) assert.equal(leadAcknowledged(true, result), false);
  assert.equal(leadAcknowledged(false, { accepted: true }), false);
  assert.equal(leadAcknowledged(true, { accepted: true, duplicate: true }), true);
});
check("measurement rejects PII and unknown queries while acquisition preserves original touch", () => {
  assert(touch.landingPage.includes("email=secret"));
  assert(!campaignPage(touch.landingPage).includes("email"));
  assert(!safePageUrl(touch.landingPage)!.includes("email"));
  assert.equal(safeCampaignValue("utm_campaign", "customer@example.invalid"), null);
  assert.equal(safeCampaignValue("utm_source", "+971 50 000 0000"), null);
});
check("analytics retain UAE GTM owner, consent and host gates; no inherited sibling tags", () => {
  assert.equal(measurementAllowed(UAE_MEASUREMENT, "urbangrid.ae", "accepted"), true);
  for (const choice of [null, "rejected"]) assert.equal(measurementAllowed(UAE_MEASUREMENT, "urbangrid.ae", choice), false);
  assert.equal(measurementAllowed(UAE_MEASUREMENT, "urbangrid.co.uk", "accepted"), false);
  assert.equal(measurementAllowed({ ...UAE_MEASUREMENT, measurementId: null }, "urbangrid.ae", "accepted"), false);
  assert.equal(PRIVACY_CONTRACT.contactClickIsLead, false);
});
check("existing UAE phone and WhatsApp tracking matches exactly", () => {
  assert.equal(contactClick("tel:+971585686852", "https://urbangrid.ae", COUNTRY_PROFILES.AE.cta), "call_click");
  assert.equal(contactClick("https://wa.me/971567427634?text=private", "https://urbangrid.ae", COUNTRY_PROFILES.AE.cta), "whatsapp_click");
  assert.equal(contactClick("https://api.whatsapp.com/send?phone=971567427634", "https://urbangrid.ae", COUNTRY_PROFILES.AE.cta), "whatsapp_click");
  assert.equal(contactClick("tel:+447700900000", "https://urbangrid.ae", COUNTRY_PROFILES.AE.cta), undefined);
});
check("one central login and no changes to country route ownership", () => {
  assert.equal(NETWORK_LOGIN_URL, "https://app.stratasurveyor.com/");
  for (const file of ["client/src/components/Header.tsx", "client/src/pages/Login.tsx"]) {
    assert(readFileSync(file, "utf8").includes("NETWORK_LOGIN_URL"));
  }
  assert(readFileSync("server/ukRoutes.ts", "utf8").includes('"/api/admin/network-gateway-health", isAdminAuthenticated'));
  assert(readFileSync("server/index.ts", "utf8").includes('from "./ukRoutes"'));
});
check("build verification requires the exact approved SHA", () => {
  const sha = "a".repeat(40);
  assert.equal(buildMatchesRelease({ commit: sha, builtAt: "fixture" }, sha), true);
  assert.equal(buildMatchesRelease({ commit: "unknown", builtAt: "fixture" }, sha), false);
  assert.equal(buildMatchesRelease({ commit: sha, builtAt: "fixture" }, "short"), false);
});
const runtime = networkRuntime(ae)!;
let captured: RequestInit | undefined;
const fakeFetch: typeof fetch = async (_url, init) => { captured = init; return new Response(JSON.stringify({ accepted: true }), { status: 200 }); };
assert.deepEqual(await sendLeadEvent(event, event.eventId, runtime, fakeFetch), { ok: true, reason: "" });
check("transport freezes event, reuses idempotency headers and rejects redirect following", () => {
  assert.equal(captured?.redirect, "error");
  assert.equal(JSON.parse(captured?.body as string).eventId, event.eventId);
  assert.equal((captured?.headers as Record<string, string>)["Idempotency-Key"], event.eventId);
  assert.equal((captured?.headers as Record<string, string>)["x-urbangrid-client"], identity.clientCode);
});
for (const response of [new Response("{}", { status: 200 }), new Response("{}", { status: 401 }),
  new Response("{}", { status: 503 }), new Response("not-json", { status: 200 })]) {
  assert.equal((await sendLeadEvent(event, event.eventId, runtime, async () => response)).ok, false);
}
check("transport rejects false/missing acknowledgements, malformed JSON and HTTP failures", () => {});
assert.deepEqual(await sendLeadEvent(event, event.eventId, runtime, async () => { throw new Error("fixture private data"); }),
  { ok: false, reason: "network_failed" });
check("transport never exposes thrown error/customer/credential values", () => {});
console.log(`${passed} country/network contracts passed; no database, email or external Network requests.`);
