# UrbanGrid country-site integration contract

## Ownership and compatibility

Country sites own public content, consent, acquisition attribution, validated
enquiries, country-specific quotations/bookings and their verified payment ledger.
Strata Surveys (`https://app.stratasurveyor.com/`) is the public login destination
and operational system for scheduling, inspections, QA and report lifecycle.
Website administration remains a separate authenticated internal URL, not public navigation.

Keep country-site GitHub repositories as the canonical source. Preserve local
commits and newer working files before synchronizing; never reset or force-push
over divergent history. Publishing is a separate approved operation.

The existing UAE `booking.created` v1 envelope is backward compatible. Never
rebuild already-enqueued payloads or change their event IDs. New country sites
must agree the contract with the receiver before sending real records.

## Identity and creation event

Required envelope: `eventId`, `type: booking.created`, `schemaVersion: 1`,
`source: urbangrid`, `environment: development | production`, `occurredAt` (ISO
8601), and `data.booking`.

Booking data:

| Group | Fields |
| --- | --- |
| Source identity | `siteId` (canonical country host), ISO country, market, numeric local `id` / `leadId`, globally scoped `bookingIdentity` / `leadIdentity`, stable `bookingReference` |
| Customer | Name, email, telephone; only the server-to-server payload contains these |
| Property | Property type, area and its unit, bedrooms, development/project, location/address, local administrative region (`emirate` in AE) |
| Service | Stable service key; service catalog and country pricing are website-authoritative |
| Scheduling | Inspection date, time window and IANA timezone |
| Money | Currency, integer minor-unit base/VAT/total, payment status, actual collected cash and outstanding amount; quote is not revenue |
| Acquisition | Lead source, sanitized first/last-touch UTM and click identifiers, landing-page context and capture timestamps |
| Test isolation | Explicit `recordType: integration_test`, only for authorized Development tests |

UAE additions are `country: AE`, `market: UAE`, `siteId: urbangrid.ae`,
`leadIdentity: ug-ae-lead-{leadId}`, and `bookingIdentity: ug-ae-booking-{id}`.
Existing UAE v1 event IDs remain `urbangrid.{environment}.booking.created.v1.{id}`.
Other countries must namespace event IDs by site/country and environment, e.g.
`urbangrid.gb.production.booking.created.v1.{id}`. Never reuse AE IDs.

Commit booking and frozen event atomically. Delivery is at least once. Send HTTPS
POST with `x-urbangrid-key` from private configuration and
`Idempotency-Key: {eventId}`. The receiver must deduplicate before acknowledging
durable receipt. Outages do not undo customer bookings. Retain failures/retries.
Return allowlisted `orderId`, `jobId`, `projectId`, `reportId` (camel/snake case or nested
order/job/project/report objects are supported). Missing IDs do not make a successful
acknowledgment fail; do not invent IDs. Store IDs on the booking and delivery records,
including normal bookings; lifecycle snapshots can add a later report ID.
IDs must be UUIDs, positive numeric IDs, or recognized ORDER/ORD/JOB/PROJECT/PROJ/PRJ/REPORT/RPT
prefixed identifiers. Do not persist arbitrary response bodies.

## Authenticated status reconciliation

Configure **`URBANGRID_OPERATIONS_STATUS_URL`** with the receiver's approved HTTPS
status endpoint. This is distinct from `URBANGRID_OPERATIONS_INTEGRATION_URL`.
The URL must have no credentials, query string, fragment or local/IP hostname.
The website does **not** guess the remote endpoint from a public portal URL.
The Strata team must provide this URL and implement/confirm the response below.

GET query parameters: `bookingId`, `bookingReference`, creation `eventId`,
`source=urbangrid`, `country=AE`, `environment`. Authenticate with the private
`x-urbangrid-key` header. Redirects are forbidden, timeout is 10 seconds and JSON
is limited to 64 KiB. Never log credential, customer or response contents.

The approved Development endpoint is
`https://ewyxbbfktyhmmwocvmqs.supabase.co/functions/v1/urbangrid-status`,
configured only in Development as `URBANGRID_OPERATIONS_STATUS_URL`.

The actual function returns `bookingId` as a string, `lifecycleStatus`, `mappings`,
`order`, `job`, nullable `assignment`/`report`, and `synchronizedAt`. The server
validates booking identity and order/job/project mapping consistency, then
normalizes this response to the snapshot below. Revision ordering uses the
receiver records' modification timestamps at microsecond precision (stored as
bigint), not `synchronizedAt`, which changes on each GET. Payment fields are ignored.
Strata project identifiers can use the explicit `ug-job-` + 32 hexadecimal digits
format. A null report ID is not replaced with an invented ID.

The normalized snapshot is also the accepted versioned callback contract:

```json
{
  "schemaVersion": 1,
  "source": "strata-surveyor",
  "environment": "development",
  "country": "AE",
  "bookingId": 123,
  "bookingReference": "UG-2026-ABCDEF123456",
  "eventId": "strata.job.JOB-123.lifecycle.4",
  "version": 4,
  "occurredAt": "2026-10-04T12:00:00Z",
  "status": "qa_approved",
  "identifiers": {"orderId": "ORDER-123", "jobId": "JOB-123", "projectId": "PROJECT-123"}
}
```

`version` is a positive, monotonically increasing per-booking integer assigned
by Strata. `eventId` is globally unique and stable for a revision. Accepted states:
`booked`, `scheduled`, `inspection_started`, `inspection_completed`, `qa_approved`,
`report_released`. The legacy `report_published` wire value is accepted and
normalized to `qa_approved`; it never implies report release.

The website validates country/environment and both booking identities before
applying a snapshot. Duplicate events are durable no-ops; reused event IDs with
different contents or bookings, mapping conflicts, same-version changes and
status regressions are rejected. Older revisions do not overwrite newer state.
Apply status, ID mapping and audit atomically under the booking row lock.

The worker checks delivered normal bookings in leased batches, retries status
failures after five minutes and stops polling at `report_released`.
An authenticated, CSRF-protected admin Reconcile action provides manual recovery.
This action runs reconciliation during the request, independently of timer activity,
and remains available after scale-to-zero wake-up. Persistent queue leases expire
so interrupted worker requests can be retried. The read-only admin diagnostics
section never triggers delivery or reconciliation. Successful sync timestamps and
failure codes are persisted for manual as well as worker reconciliation.
Automatic polling depends on the web process running; an always-on/scheduled
worker is needed for a continuous delivery SLA on scale-to-zero hosting.
For an explicitly authorized real Development verification, stop the ordinary
worker and run `NODE_ENV=development npx tsx scripts/verify-strata-development.ts --confirm-development-write`.
Never add this command to CI, build, startup or
automatic tests. It refuses unrelated queued events and creates one quarantined
fixture. Creation acknowledges order/job IDs; status supplies the project mapping.
Duplicate creation acknowledgments contain `duplicate: true` without repeating
IDs, so compare authoritative status mappings before and after replaying the same
frozen event. Successful verification evidence survives website fixture cleanup
and powers the timestamped Development-health label. It is not a continuous
receiver availability probe. No approved remote cleanup endpoint is known.
Development synthetic records can be manually reconciled when both local and
remote test identities are explicit; automatic polling excludes these records.

Alternatively Strata can POST this same snapshot to
`/api/integrations/strata/lifecycle` with the same private authentication header.
The public browser cannot send trusted lifecycle updates. Payload replay protection
is shared between polling and callbacks.

## Payment and report safety

Operational status is separate from money and report-release eligibility.
Authenticated inspection completion (including later stages that imply completion)
may establish physical completion, but never records cash or changes prices.
QA/published/released states never mark the website paid, create a payment or
publish/send a report. The AE rule remains **100% payment after inspection and
before release of the final report**. Lost/cancelled bookings remain closed.
Strata must enforce the same release rule independently; a premature remote
publication is displayed as operational history, not permission to release here.

## Commercial measurement contract

Keep engagement tracking; do not convert it into a lead. `form_start`, generic
`click` and unrelated telephone/WhatsApp links are not primary business conversions.

| Site event | Distinct stage | Evidence |
| --- | --- | --- |
| `generate_lead` | `lead_submitted` | Backend returns a persisted, validated lead ID |
| `whatsapp_click` | `whatsapp_intent` | Click to the business WhatsApp recipient; not a confirmed conversation |
| `call_click` | `call_intent` | Click to a business telephone number; not a qualified/completed call |
| `booking_confirmed` | `booking_confirmed` | Backend confirms the persisted booking; quote is not cash |
| `purchase` | `payment_received` | Completed actual payment ledger entry; Ziina must be verified and non-test |

Events carry `event_category`, `commercial_stage` and
`is_primary_business_conversion`; unrecognized/engagement events are false.
Use a stable per-payment `transaction_id`. Deduplicate booking/payment browser
retries. Do not emit test payments, pending payments, refunds or quote value as
purchase revenue. No customer contact values enter browser measurement.

The sole GA4 destination is G-ZX4B5QJGB4; GTM-NGVDWWRF owns Ads firing.
Do not introduce direct Ads calls or a second GA4 property. Preserve explicit
consent and production-host gating.

**External configuration required:** Repository code cannot change GA4 key-event
markings or published GTM/Ads goals. In GA4, unmark `form_start` and generic `click`
as key events while leaving Enhanced Measurement engagement enabled. In GTM,
conversion triggers must use the explicit commercial allowlist above (or the true
classification flag), not every click/form event. Decide which commercial stages
are primary bidding goals versus secondary observation; never label intent as a
qualified lead or count every stage as a distinct customer. These external changes
require authorized GA4/GTM/Ads access and are not part of a website publish.

## Validation and rollout

Apply the additive lifecycle migration in Development; confirm the production
schema through the project's managed publish flow when publication is authorized.
Run the rollback-only integration/lifecycle tests and intercepted browser
measurement tests. Verify authentication/CSRF, duplicate and conflicting updates,
out-of-order revisions, normal mapping IDs, retry leases and unchanged payment gates.
Before production rollout, confirm the Strata status URL, real response contract,
receiver deduplication and external conversion settings. Never auto-send historical
bookings, send real test notifications, or run destructive remote cleanup.