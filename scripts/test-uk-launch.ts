import assert from "node:assert/strict";
import { assertUkApplication, ukDatabaseConfiguration, ukEnvironment, UK_SITE_IDENTITY } from "../server/ukRuntime";
import { londonDayBoundary } from "../server/ukDates";
import { ukAssistantReply } from "../server/ukAssistant";
import { createLeadEnvelope, leadEnvelopeSchema } from "../shared/network/leadContract";
import { networkRuntime, LIVE_NETWORK_HOST, DEVELOPMENT_NETWORK_HOST } from "../server/network/runtime";
import { leadEventMatchesSite } from "../shared/network/outbox";
import { canonicalOrigin } from "../shared/siteConfig";
import { getSitemapUrls } from "../server/sitemap";

// Pure configuration fixtures only; no real database, customers, credentials or mail.
const db = "postgres://fixture:invalid@uk-fixture.invalid/uk";
const uae = "postgres://fixture:invalid@uae-fixture.invalid/uae";
const key = "fixture-not-a-real-key-" + "x".repeat(80);
assertUkApplication({});
assert.equal(canonicalOrigin, "https://urbangrid.co.uk");
assert.equal(ukDatabaseConfiguration({ DATABASE_URL: uae, NEON_DATABASE_URL: uae }).configured, false);
assert.throws(() => assertUkApplication({ URBANGRID_COUNTRY_CODE: "AE" }));
assert.throws(() => assertUkApplication({ URBANGRID_NETWORK_CLIENT_CODE: "urbangrid-website" }));
assert.throws(() => assertUkApplication({ URBANGRID_SITE_DOMAIN: "urbangrid.ae" }));
assert.throws(() => ukDatabaseConfiguration({ URBANGRID_GB_DATABASE_URL: uae, DATABASE_URL: uae }));
assert.throws(() => ukDatabaseConfiguration({ URBANGRID_GB_DATABASE_URL: uae, NEON_DATABASE_URL: uae }));
assert.throws(() => ukDatabaseConfiguration({ URBANGRID_GB_DATABASE_URL: "not-a-url", NEON_DATABASE_URL: uae }));
assert.equal(ukDatabaseConfiguration({ URBANGRID_GB_DATABASE_URL: db, DATABASE_URL: uae }).configured, true);
const managed = { DATABASE_URL: db, REPL_ID: "uk-project", URBANGRID_DATABASE_PROVIDER: "replit-managed", URBANGRID_MANAGED_DATABASE_REPL_ID: "uk-project" };
assert.equal(ukDatabaseConfiguration(managed).configured, true);
assert.equal(ukDatabaseConfiguration({ ...managed, REPL_ID: "another-project" }).configured, false);
assert.equal(ukDatabaseConfiguration({ ...managed, REPL_ID: undefined, NODE_ENV: "production", REPLIT_DOMAINS: "uk-deployment.replit.app", URBANGRID_MANAGED_DATABASE_SITE_DOMAIN: "uk-deployment.replit.app" }).configured, true);
const env = ukEnvironment({
  NODE_ENV: "development", DATABASE_URL: uae, URBANGRID_GB_DATABASE_URL: db,
  URBANGRID_GB_NETWORK_INTEGRATION_KEY: key,
  URBANGRID_NETWORK_INTEGRATION_URL: `https://${DEVELOPMENT_NETWORK_HOST}/functions/v1/urbangrid-integration`,
});
assert.equal(networkRuntime(env)?.countryCode, "GB");
assert.equal(networkRuntime({ ...env, URBANGRID_GB_NETWORK_INTEGRATION_KEY: undefined }), null);
assert.equal(networkRuntime({ ...env, URBANGRID_NETWORK_INTEGRATION_KEY: key }), null);
assert.equal(networkRuntime({ ...env, NODE_ENV: "production" }), null);
assert.equal(networkRuntime({
  ...env, NODE_ENV: "production",
  URBANGRID_NETWORK_INTEGRATION_URL: `https://${LIVE_NETWORK_HOST}/functions/v1/urbangrid-integration`,
})?.clientCode, "urbangrid-uk");

assert.equal(londonDayBoundary("2026-01-10").toISOString(), "2026-01-10T00:00:00.000Z");
assert.equal(londonDayBoundary("2026-07-10").toISOString(), "2026-07-09T23:00:00.000Z");
assert.equal(londonDayBoundary("2026-03-29", true).getTime() - londonDayBoundary("2026-03-29").getTime(), 23 * 3600000);
assert.equal(londonDayBoundary("2026-10-25", true).getTime() - londonDayBoundary("2026-10-25").getTime(), 25 * 3600000);
assert.throws(() => londonDayBoundary("2026-02-30"));

const event = createLeadEnvelope({
  id: 1, name: "Synthetic UK fixture", email: "fixture@example.invalid", phone: null,
  message: "UK launch contract fixture", enquiryType: "Reserve Fund Study", leadSource: "london_quote", attribution: null,
}, UK_SITE_IDENTITY);
assert.equal(leadEnvelopeSchema.safeParse(event).success, true);
assert.equal(event.eventId, "urbangrid-uk.lead.created.1");
assert.equal(event.payload.countryCode, "GB");
assert.equal(event.payload.sourceDomain, "urbangrid.co.uk");
assert.equal(event.payload.lead.category, "consultancy");
assert.equal(leadEventMatchesSite(event, UK_SITE_IDENTITY), true);
assert.equal(leadEventMatchesSite(event, { ...UK_SITE_IDENTITY, countryCode: "AE" }), false);
const sitemap = getSitemapUrls(canonicalOrigin, []);
assert.equal(sitemap.filter(p => p.loc.includes("/services/")).length, 17);
assert(sitemap.some(p => p.loc.endsWith("/locations/london")));
assert(sitemap.every(p => p.loc.startsWith("https://urbangrid.co.uk/")));
assert(!sitemap.some(p => /dubai|abu-dhabi|book-inspection|checkout|sample-report/.test(p.loc)));
for (const prompt of ["price AED 800", "RERA approved?", "Dubai contact", "sample report", "hello"]) {
  const reply = ukAssistantReply(prompt);
  assert(!/\+971|info@urbangrid\.ae|AED\s*\d|VAT\s*5%/.test(reply));
  assert(reply.includes("[SHOW_CUSTOM_QUOTE_LINK]"));
}
console.log("UK launch checks passed: identity, database/key isolation, environment targets, GMT/BST, lead contract, services and assistant.");
