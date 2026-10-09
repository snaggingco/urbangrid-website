# UrbanGrid Network v1: reusable country website foundation

This repository remains the UAE application, not a replacement for every
country's website. GitHub main is authoritative; adopt this work through a
reviewed feature branch. Nothing here publishes or migrates a sibling site.

## Stable imports and ownership

| Module | Responsibility |
|---|---|
| `shared/network/country.ts` | AE/SA/GB metadata, currency, locale, timezone, CTA/service/legal adapter and one central login |
| `shared/network/leadContract.ts` | Existing lead envelope and schema, stable event IDs, category mapping and campaign-only source page |
| `shared/network/attribution.ts` | Acquisition touch construction; existing first/last-touch schema stays in `shared/leads.ts` |
| `shared/network/outbox.ts` | Proven retry/lease/batch constants, acknowledgement and site-identity predicates |
| `server/networkLeadSync.ts` | Reusable PostgreSQL/Drizzle enqueue + leased worker; schema imports must point to the adopting site's own database |
| `server/storage.ts` | Reference transaction: contact and event commit together; submission UUID deduplicates retries |
| `server/network/runtime.ts` | Registration, environment recipient gates and country-scoped secret/database resolution |
| `server/network/recipient.ts` | HTTPS URL validation and private credential format; no raw diagnostic output |
| `server/network/transport.ts` | Frozen event POST, timeout, no redirect following, injectable tests |
| `shared/network/measurement.ts` | PII-safe analytics projection, consent/host gates, country CTA matching |
| `shared/network/privacy.ts` | Existing consent semantics; not legal text or legal approval |
| `shared/network/health.ts` | Exact build SHA verification contract |
| `server/networkGatewayHealth.ts` | Aggregate operator-only diagnostic, no customer data or credential values |

AE metadata is AED / en-AE (ar-AE supported) / Asia/Dubai / urbangrid.ae /
urbangrid-website. Saudi is SAR / en-SA (ar-SA supported) / Asia/Riyadh /
urbangrid-sa. UK is GBP / en-GB / Europe/London / urbangrid.co.uk /
urbangrid-uk. Saudi's canonical domain is intentionally unresolved: the existing
rollout record does not establish one. Supply its registered domain explicitly.

Saudi and UK CTA phones, WhatsApp, service availability and local privacy approval
are not inherited from UAE. `adoptCountrySite` requires approved country inputs.
Compliance labels identify UAE PDPL, Saudi PDPL, and UK GDPR/PECR review needs;
they do not assert compliance, professional certification or regulatory approval.

## Country adapter procedure (development only until separately approved)

1. Start from the sibling site's existing code and routes. Import focused modules;
   do not replace its pages, service copy, SEO metadata or URL map. Saudi may
   retain its UAE-aligned design. UK keeps its custom URLs and content.
2. Define a country-owned `adoptCountrySite` adapter with registered canonical
   domain, approved international CTA numbers (digits only), services and reviewed
   privacy policy. Do not use a missing contact as a reason to inherit UAE numbers.
3. Register the exact client, country, domain and event permissions in Network.
   Local configuration validation is not proof of remote registration. Remote
   accepted processing plus direct Network readback establishes acceptance.
4. Provision an independent database and dedicated integration credential for
   the market. Use existing secrets tooling; never copy or print UAE secrets.
   No schema/database changes are performed by this foundation request.
5. Wire the adopting site's contact table and outbox schema to its independent
   database. Inside one transaction, insert the contact with submission UUID;
   create a `lead.created` event only for a newly inserted contact, and reuse the
   same event ID across all worker retries. Retain unique submission and event
   indexes, row locks with skip-locked, attempt ownership and abandoned leases.
6. Import the worker into the country-owned entry point, not the UAE
   `server/index.ts`. The UAE entry point intentionally refuses other markets:
   it still owns UAE staff mail, accounts, prices, payment providers and pages.
   Do not copy those integrations. Use country-local notification/account
   adapters and preserve any existing sibling booking behavior. No checkout is
   introduced by this foundation.
7. Keep one Login destination: `NETWORK_LOGIN_URL`. Protect local diagnostics
   with the site's real operator authentication. Never expose event payloads,
   customer fields, fingerprints or keys in public health responses.
8. Reuse campaign touch/schema and sanitized measurement helpers. Keep host-local
   attribution storage and the current first/last-touch semantics. Acquisition
   data is private enquiry context; analytics receives only sanitized fields.
   Each country owns its GTM/GA4 destination and policy controller. UAE retains
   its existing tag IDs, denied-before-consent defaults and single GTM event
   bridge. WhatsApp/call clicks are not confirmed leads or payments.
9. Expose the existing `{commit,builtAt}` build contract and verify the exact
   approved SHA, not just a successful HTTP response.

## Server configuration contract

Public server settings:

| Country | Country code | Domain | Client code | Database secret | Integration secret |
|---|---|---|---|---|---|
| AE | AE | urbangrid.ae | urbangrid-website | DATABASE_URL | URBANGRID_NETWORK_INTEGRATION_KEY |
| SA | SA | registered Saudi domain | urbangrid-sa | URBANGRID_SA_DATABASE_URL | URBANGRID_SA_NETWORK_INTEGRATION_KEY |
| GB | GB | urbangrid.co.uk | urbangrid-uk | URBANGRID_GB_DATABASE_URL | URBANGRID_GB_NETWORK_INTEGRATION_KEY |

Set `URBANGRID_COUNTRY_CODE`, `URBANGRID_SITE_DOMAIN`,
`URBANGRID_NETWORK_CLIENT_CODE`, `URBANGRID_NETWORK_INTEGRATION_URL`.
AE alone retains legacy inference from its platform-bound `urbangrid.ae` domain
and the operations-endpoint fallback. SA/GB must explicitly declare identity and
their scoped secrets. Generic UAE secrets never substitute for scoped secrets;
matching UAE key values/database targets are rejected when available to compare.
Separate deployments must restrict secret access to their own market; code
cannot prove isolation from another deployment's secrets that it cannot see.
An unregistered production clone also cannot connect to the generic UAE database.
Only the existing UAE development harness may use its development database while
delivery identity is unset; gateway delivery still remains disabled.

Production recipient:
`https://nzbewemalujbhnjbrpcs.supabase.co/functions/v1/urbangrid-integration`.
Development recipient:
`https://ewyxbbfktyhmmwocvmqs.supabase.co/functions/v1/urbangrid-integration`.
Cross-environment delivery, other hosts/function paths, HTTP, URL credentials,
query strings/fragments, IP literals and local/private suffixes are rejected.
Receiver authentication must independently enforce country/client/domain scope.
Use credentials meeting the proven website's 48+ printable-character requirement.

Missing delivery configuration preserves the locally accepted enquiry and
durable queue but does not claim/send it. Snapshot identity is never rewritten
on retry. A queued identity mismatch is retained as a failed event, not sent using
another country's key. Operators must resolve invalid events explicitly; the
worker does not delete data or automatically relabel historical events.

## Tests and adoption acceptance

- `pnpm check`
- `pnpm build`
- `pnpm test:country-network`: pure fixtures, no database/email/remote calls
- `pnpm test:network-outbox`: development PostgreSQL, transaction rollback,
  stubbed transport; no migrations, staff email or Live receiver requests
- Existing pipeline, booking, operations and lifecycle test scripts remain valid.

The contract suite covers currencies/config, missing/mismatched identities and
secrets, database isolation, recipient validation, identical UAE event shape,
categories, attribution, consent/privacy, CTA tracking, exact build SHA and
transport acknowledgement. The database suite checks transactional persistence,
deduplication, outage/retry recovery, abandoned leases, concurrent cycles,
cross-country snapshot rejection and configuration-safe diagnostics.

For each future country rollout, separately authorize one labeled development
lead through its normal form and verify local persistence, outbox, processed
Network inbox, exactly one Network lead row and stored attribution, including
duplicate replay. Test browser consent/analytics and custom routes independently.
Do not create orders/jobs, financial transactions or customer notifications as
part of a raw-lead foundation test. Publish only after country acceptance and
explicit approval. India remains outside scope.

The previous UAE Live transport test is documented separately in
`UAE_LIVE_LEAD_VERIFICATION.md`; it does not prove Saudi/UK readiness or direct
Network lead-row readback. This branch performs no new Live lead test.

## Feature-branch verification — 9 October 2026

Local verification passed:

| Command | Result |
|---|---|
| `pnpm check` | TypeScript passed |
| `pnpm build` | Vite, public first-paint output and server bundle passed |
| `pnpm test:country-network` | 32 pure contract checks |
| `pnpm test:network-outbox` | 13 PostgreSQL outbox checks |
| `pnpm test:lead-pipeline` | 19 pipeline checks |
| `pnpm test:residential-bookings` | 20 booking/payment-safeguard checks |
| `pnpm test:operations-integration` | 20 integration checks |
| `pnpm test:operations-lifecycle` | 8 lifecycle checks |
| `pnpm test:lead-ui` | 2 isolated protected component render checks |
| `node scripts/test-consent-browser.mjs` | 7 development mobile/browser consent scenarios |

All database fixtures were rolled back. Test email, provider and Network delivery
were isolated/stubbed. The browser suite mocks POSTs and performs no actual
contact submission. The existing development workflow was restarted once and
served on port 5000; a mobile contact-page screenshot showed the existing layout
and privacy banner. Signed-in management UI was not browser-verified; protected
components were fixture-rendered and existing API auth checks passed.

No production data, secrets, configuration, migrations or publication were
changed. No Saudi, UK or India repository or production site was changed. There
is no guarantee of launch readiness for other markets until their country inputs
and separate acceptance tests are complete. This is a verified source foundation,
not a completed multi-country production rollout.

The connected GitHub App accepted ordinary source-tree writes but rejected a
tree containing a workflow-file edit. The existing CI workflow is therefore
unchanged; no workflow permission was widened. The commands above were verified
locally, not claimed as new GitHub Actions runs.
