# UrbanGrid Country Website -> Network Gateway (v1)

## Reference pattern
One local SEO/acquisition site per country, one central operations app at https://app.stratasurveyor.com. Do not deploy another operator application or create a second login domain.

The UAE reference site stores each contact/consultation/quick-contact/sample-report enquiry in its PostgreSQL contact table **and** in `website_lead_outbox` in a single database transaction. The background worker delivers an event to the central Supabase Edge Function; a 200 response with `accepted: true` marks it delivered. Transient failure causes exponential retry. The receiving Network deduplicates event IDs and the (integration client, lead ID) pair.

## Required per-country private runtime configuration
Set these server-side only (never in Vite/frontend variables, source code or GitHub):

- `URBANGRID_NETWORK_INTEGRATION_URL` — for Live: `https://nzbewemalujbhnjbrpcs.supabase.co/functions/v1/urbangrid-integration`
- `URBANGRID_NETWORK_INTEGRATION_KEY` — 32+ character private integration key issued for the country site
- `URBANGRID_NETWORK_CLIENT_CODE` — unique registered code for that site, e.g. `urbangrid-uk`; the original UAE client uses `urbangrid-website`
- `URBANGRID_COUNTRY_CODE` — ISO 3166-1 alpha-2, e.g. `AE`, `GB`, `SA`
- `URBANGRID_SITE_DOMAIN` — canonical origin domain, e.g. `urbangrid.ae`

The new worker intentionally does **not** send if country or domain is unconfigured. It also includes the actual inbound site host in each event to prevent cloned sites being silently attributed to UAE. Contact forms remain locally persisted if gateway configuration is absent.

## Register country in Network first
Each country site needs its own active `integration_clients` row:
- unique `client_code`
- `key_sha256` fingerprint of the private key (never the raw key)
- `country_code` and exact `source_domain`
- allowed events at least `lead.created`, `lead.updated`; booking events are optional

Also configure the country's `markets`, active `service_areas`, service coverage, pricing/currency and provider coverage before converting leads into jobs. A website's country/domain is verified against the server-side integration client registration; the client cannot override it.

## Lead contract
The gateway sends `eventId`, `eventType`, `schemaVersion`, and `payload` with `countryCode`, `sourceDomain`, `sourcePage`, `attribution` (UTMs, click IDs), `context` (channel, landing page, referring site), and `lead` (local ID, name, email/phone, category, service, project/location, message).

Only form submissions become named leads. A WhatsApp or call click without identifying customer details is a conversion event, not a CRM lead. Preserve campaign tagging on the destination site.

## Operator workflow
Country website -> Network Leads -> Contacted -> Qualified/Quoted -> explicit Convert -> Order + Job + Project -> Assignment -> QA -> Report. Do not create project/order records from every raw contact.

## Deployment checklist
1. Preserve country-specific SEO: URLs, local content, meta, canonicals, schema, contact phone/currency. Keep the India site untouched unless explicitly authorized.
2. Apply `migrations/20261008_network_lead_outbox.sql` to the site's PostgreSQL DB BEFORE publishing the new server code. Do not use destructive `db:push` on a live database.
3. Ensure all five server-side settings above point to the intended Network environment.
4. Build/typecheck. Confirm contact + consultancy selection, consultation, quick contact and sample report work.
5. Submit one clearly marked internal test through the website, then confirm: local contact saved, outbox delivered, Network `integration_inbox` processed, single `network_leads` row with correct country/campaign data, visible in Network Dashboard.
6. Retry the exact event ID and confirm no duplicate lead; simulate temporary Network outage and confirm retry succeeds.
7. Qualify internal test and verify Order, Job, Project and source attribution; delete test-only records with due care.
8. Publish after all acceptance tests pass. Monitor failed outbox rows and report any credential/route errors.

The UAE site is the reference implementation, not a public multi-country landing-page template. Countries should use their own indexed local website and share only the Network operations layer.

## Canonical development and deployment policy
- **GitHub is the authoritative application source.** Until the tracked reconciliation PR #15 is resolved, the validated UAE production source is `release/uae-dos-v1-blockers-20261004`, not the older `main` tree. Once unified, `main` will become canonical.
- GPT uses GitHub pull requests and GitHub Actions to change, review and validate code.
- Replit is a deployment/hosting runtime only, not an independent agent/editor for application logic.
- Website database is PostgreSQL/Neon. Schema changes must be additive, tested and version-controlled.
- The initial UAE runtime identifies its market from explicitly configured environment values or a bound `urbangrid.ae` domain. A cloned site must register a different Network integration client and country settings.
- Publish only a validated commit and verify that deployment matches its SHA before calling it live.
