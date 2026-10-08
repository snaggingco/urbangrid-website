# UAE production lead verification — 8 October 2026

## Scope and safety

Verified the existing UAE production release without publishing or changing
application code, credentials, configuration, schema, customer records or
bookings. The India website was not inspected or changed.

One authorized synthetic contact enquiry was submitted through the normal
production `POST /api/contact` path. Its name and message explicitly say
`SYNTHETIC TEST — DO NOT CONTACT OR BOOK`. It uses
`uae-gateway-test@example.invalid`, with no phone number. The normal staff
notification path was left intact; no client notification or financial
transaction was requested. The synthetic record is retained, not deleted.
It is a normal contact-source record and must not be mistaken for a genuine
sales enquiry in reporting.

## Observed evidence

- `/api/build-info`: commit
  `a3e079be9fd9e8a46f2e3aefd2c08ce395535abf`, built
  `2026-10-08T23:07:02.484Z`.
- Authenticated `/api/admin/network-gateway-health`: HTTP 200; endpoint present,
  live target, credential format, country, source domain and client configuration
  checks all true. Verification session logged out. No credential was printed,
  replaced or changed.
- Initial normal contact request: HTTP 201, website lead ID `83`.
- Identical website request with the same submission key: HTTP 200, same lead
  ID. Read-only production SQL confirmed exactly one lead and one outbox event.
- Event: `urbangrid-website.lead.created.83`; client `urbangrid-website`,
  country `AE`, domain `urbangrid.ae`.
- Campaign marker: `UAE-LIVE-E2E-4ed6276d-defd-4a31-9629-fee58f9cc235`.
  Website first/last-touch attribution and the outbound envelope retained it.
  Source `replit_synthetic`, medium `integration_test`.
- Outbox: delivered, one worker attempt, delivered at
  `2026-10-08T23:20:23.871Z`.
- Replay of the exact persisted event to the existing production integration
  endpoint: HTTP 200, `accepted: true`, `duplicate: true`, `status: processed`,
  inbox ID `4e560251-82fe-4d29-8384-03807f4dc577`, processed at
  `2026-10-08T23:20:23.258+00:00`.
- A final read-only aggregate confirmed one event, one delivered event, one
  worker attempt and preserved outbound campaign.
- Production request logs show the contact POST 201 at 23:20:10 UTC and
  duplicate POST 200 at 23:20:17 UTC.

## Verification boundaries

The test used the normal live website HTTP submission endpoint, not a browser
form interaction. Browser validation, browser attribution capture and analytics
delivery were not tested by this run.

The deployed worker marks delivered only for an HTTP-success response with
`accepted: true`; the explicit receiver replay separately confirmed processed
duplicate acknowledgement. Neither is a direct read of the Network lead row.

Receiver repository source shows lead ingestion persists `network_leads` and
attribution before successful processing; repository source alone does not
establish the receiver's deployed revision or the actual stored row. The
available status function reads bookings, not leads. No authenticated Network
operator session or receiver database access was available. Direct verification
of the Network lead row, its UUID, its stored attribution and remote row count
remains outstanding; do not claim fully verified end-to-end lead storage.

To close the gap, use authenticated read-only Network access to inspect the UAE
lead with client `urbangrid-website`, source lead ID `83` and the campaign marker
above. Do not convert it to an order, job or booking, contact it, or create
another synthetic lead.
