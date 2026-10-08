# Multi-country website launch acceptance — repeatable v1

**Authoritative source:** `main` in snaggingco/urbangrid-website.
**Development:** GPT + GitHub CI. **Website hosting:** Replit deployment only, with no Replit Agent changes.
**Operations:** one Strata login (`https://app.stratasurveyor.com`); all sites send to the existing central Network integration.

## Country-specific manifest (non-secret example)

| Market | Website | Country code | Currency | State |
|---|---|---|---|---|
| UAE | urbangrid.ae | AE | AED | Reference candidate, live gateway delivery **unverified** |
| UK | urbangrid.co.uk | GB | GBP | Market & credentials not yet verified in the Network |
| Saudi Arabia | Country-domain to be confirmed | SA | SAR | Market & credentials not yet verified in the Network |
| India | urbansnag.in | IN | INR | Existing lead-producing site; **do not change or deploy** without separate authorization |

For each new country maintain these server-side values independently:
- `URBANGRID_NETWORK_CLIENT_CODE`: distinct integration registration (e.g. `urbangrid-uk`)
- `URBANGRID_COUNTRY_CODE`: ISO country code
- `URBANGRID_SITE_DOMAIN`: actual canonical site domain
- `URBANGRID_NETWORK_INTEGRATION_URL`: central *production* Supabase gateway URL
- `URBANGRID_NETWORK_INTEGRATION_KEY`: site-scoped random secret registered only by fingerprint in Network
- site-specific phone, email, consent text, local services, currency, time zone, legal entity, tax presentation and language

**No secrets, public keys or admin login credentials in GitHub documentation.**

## Per-country onboarding checklist

1. Register the country market, active geographic service areas, currencies, service/price rules and eligible verified providers in the Network.
2. Register a dedicated `integration_clients` record with exactly that site's country and domain, active `lead.created`/`lead.updated` event permissions and scoped secret fingerprint. Do not share UAE's private key with UK/KSA.
3. Prepare country-specific SEO: indexed local URLs, accurate local entity/contact data, canonical tags, country service copy, structured data, sitemaps, Google Ads tags and privacy/consent.
4. Provision the independent website PostgreSQL database; apply the additive lead-outbox migration before exposing public forms.
5. Configure the five runtime variables and verify only presence/country fingerprint, never disclose the secret.
6. Confirm a **test** submission passes Contact and consultancy pathways; capture origin domain, country, service, first/last campaign touch and click IDs without recording unnecessary PII.
7. Confirm Network lead is stored *exactly once* when the same idempotency event is retried. Simulate a temporary Network failure and confirm queue recovery.
8. Qualify the lead in Strata; manually choose the appropriate configured service and area; create Order → Job → Project with correct currency and attribution.
9. Verify approved inspector/partner can accept, conduct work, submit to QA, and produce a draft then authorized report without an online-checkout prerequisite.
10. Verify observability: queue counts, errors, failed retries, acceptance records, operator permissions, conversion reporting and rollback steps.
11. Only then run country advertising and register completion of the first live lead.

## Production acceptance evidence

Store in the deployment record: Git SHA, migration applied/version, CI run, domain and UTC timestamp, test lead/event ID, Network inbox processed receipt, lead/order/job/project ID, attribution/currency, and reviewer sign-off. Never declare a country launch complete based on a successful HTTP response alone.

## Current blockers

- The present chat connection can inspect and publish the existing Replit deployment, but it **cannot sync a specific GitHub SHA into Replit's workspace without separate deployment integration**. Publishing the old workspace would not prove this release.
- The UAE Network already has its registered client and AED market, but the live central inbox still needs an end-to-end *website* lead event.
- UK, KSA and future markets need separate integration credentials, configured market data, privacy/localization and production tests.
