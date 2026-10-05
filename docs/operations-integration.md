# UrbanGrid → Strata Surveyor booking delivery

For the current cross-country identity, normal-booking mapping and authenticated
lifecycle reconciliation contract, see [Country-site integration contract](country-site-integration-contract.md).
Normal successful booking deliveries now retain allowlisted receiver IDs too;
the earlier Development-test-only ID capture limitation no longer applies.
Status polling needs the approved `URBANGRID_OPERATIONS_STATUS_URL`; it does not
infer an endpoint from the portal URL. Lifecycle never records payment or bypasses
the existing report-release gate.

Development only until explicitly configured and published. No historical
bookings are backfilled: only bookings created with this integration installed
receive a creation event. Both customer and admin-created bookings are covered.

## Secure configuration

- `URBANGRID_NETWORK_INTEGRATION_KEY`: a cryptographically random shared key,
  stored only in Replit Secrets. Use at least 48 random bytes (e.g. 96 hexadecimal
  characters). The receiver can store the displayed SHA-256 fingerprint and
  compare it with the hash of the incoming header, without sharing the raw key.
  Never put it
  in source, a URL, browser code, logs or chat.
- `URBANGRID_OPERATIONS_INTEGRATION_URL`: the exact HTTPS development ingestion
  endpoint, set as a **development** environment variable. It must not contain
  credentials, a query or fragment. Do not infer it from the public marketing URL.
  Development is configured to
  `https://ewyxbbfktyhmmwocvmqs.supabase.co/functions/v1/urbangrid-integration`.
- Production delivery requires a separately configured production endpoint.
  No development URL is hardcoded or copied to production.

## Request contract

`POST` JSON, TLS verification enabled, 10-second timeout, no redirect following.

Headers:

- `x-urbangrid-key`: private shared secret.
- `Idempotency-Key`: stable event ID.
- `Content-Type: application/json`.

Body is defined in `shared/operationsIntegration.ts`. The envelope uses `eventId`,
`type: "booking.created"`, `schemaVersion: 1`, `occurredAt` and `data.booking`.
Booking fields are flattened within `data.booking`, including `id` (website
booking ID), `leadId`, property/schedule/quote fields and `customer`.
IDs remain the original database
booking/lead IDs. Event IDs have the form
`urbangrid.<environment>.booking.created.v1.<bookingId>`.

The payload is the persisted **creation-time** snapshot, including customer,
property, service, quote in minor units, Dubai schedule, attribution, booking
status and initial unpaid payment status. It is not a live status/payment feed.
No access-link capabilities, cookies, integration secrets or gateway secrets
are included.

Receiver requirements: hash the private header with SHA-256 and authenticate
against the configured fingerprint using constant-time comparison; reject
unsupported schema versions; durably deduplicate event ID
and reject same-ID/different-payload conflicts; persist the job before returning
2xx. Duplicate deliveries must return the original successful acknowledgment
without creating another job. Only 2xx is treated as success. A conflict/401/
redirect is retained as a failure, not treated as successful delivery.

## Durability and recovery

The creation snapshot is inserted into the dedicated outbox in the same
transaction as the booking and its existing lead changes. Both become visible
only on successful commit; a failed transaction stores neither. This avoids
the crash gap of a separate post-commit insert. No receiver HTTP request runs in
the booking transaction or customer request path. Existing booking audits and
customer confirmation behavior are unchanged.

A 20-second worker delivers committed events in batches of up to 10.
PostgreSQL row locks and 60-second leases coordinate
replicas. Expired leases are reclaimable. Lease tokens prevent stale workers
from acknowledging newer attempts. Delivery is **at least once**, not exactly
once; receiver deduplication is mandatory.

Failures retry indefinitely with exponential backoff (30 seconds to 1 hour,
plus up to 5 seconds jitter). Missing configuration pauses delivery. Events are
not discarded and customer requests never wait for an operations HTTP request.
Receiver response bodies/errors are never persisted or logged. Synthetic
Development tests may retain only allowlisted Order/Job/Project identifiers
from a bounded successful response (maximum 64 KiB); other fields are discarded.

## Health

`GET /api/admin/integrations/operations/status` uses existing admin
authentication and `Cache-Control: no-store`. It returns configuration state,
safe endpoint, SHA-256 key fingerprint, pending/failed/delivered counts, recovery
last attempt outcome and worker heartbeat. No event/customer payloads
or raw key are returned. `failed` means retryable failure; `pending` includes
in-flight events. There is no separate enqueue-recovery backlog with the atomic outbox.

The Acquisition admin page includes these diagnostics, metadata for the latest
100 events, and a retry button for failed deliveries. Retry uses
`POST /api/admin/integrations/operations/events/:eventId/retry` with an empty JSON
body, existing admin authentication, same-origin validation and booking CSRF.
It schedules delivery rather than making the admin request wait for Strata.
The latest failure code/status/time are retained even after a successful retry.
Receiver bodies are discarded to avoid storing echoed secrets or customer data,
except for the explicitly allowlisted synthetic-test identifiers.

## Development end-to-end test and cleanup

The health view offers **Send test event** only in Development with the exact
configured Development receiver. `POST /api/admin/integrations/operations/test`
requires admin authentication, same-origin booking CSRF and empty JSON `{}`.
It creates a synthetic lead, inspection booking and ordinary outbox event in
one transaction, or reuses an existing unfinished test. The booking/outbox are
flagged `is_integration_test`; the lead source and payload `data.booking.recordType`
are `integration_test`. The contact uses reserved `example.invalid`, no phone,
and a property clearly labeled DO NOT DISPATCH. No customer notification,
public form, payment or conversion services are invoked. Synthetic records are
excluded from sales/acquisition and booking totals.

The normal worker/private key sends `booking.created`. Admin event metadata
shows delivered/failed status and safe returned receiver identifiers if available.
A 2xx acknowledgment alone does not prove the receiver created all three objects;
returned identifiers supply additional receiver-side evidence.

**Cleanup test** calls
`POST /api/admin/integrations/operations/events/:eventId/cleanup` with
`{"confirm":true}`, existing admin authentication and CSRF. It locks the event,
rejects in-flight/ordinary/production/payment-linked records, and checks all
synthetic markers before deleting that local outbox/booking/lead and related
local audit/history in one transaction. Cleanup does **not** delete remote
Strata Order/Job/Project records. Production and other receiver URLs cannot use
these test actions. No publication is included.

## Database and checks

Apply the additive migration to the appropriate database before running this
version: `npx tsx scripts/migrate-operations-outbox.ts`. Do not run broad schema
replacement commands. This work applies it only to the configured development
database; any future production rollout must apply it separately.

Run `NODE_ENV=development npx tsx scripts/test-operations-integration.ts` and
`npm run test:residential-bookings`. Synthetic integration checks use a rolled
back transaction and stubbed delivery/email transports; they never send
customer data to the development receiver.