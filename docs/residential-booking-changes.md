# Unpublished residential booking and post-inspection payment flow

## Current business rules
- Single-property residential inspections, including large villas, confirm without any upfront payment.
- Exact displayed term: **100% payment after inspection and before release of the final report.**
- Shared integer-fils pricing retains the established whole-area tiers, minimums, reinspection/DLP rate and 5% VAT. No whole-AED rounding or size-based exclusion of large villas.
- Whole-building/common-area assignments, RFS, BCS/BCA, RCA, commercial, multi-unit (including two units), consultancy, fit-out and other nonstandard work use Custom Quote/contact lead capture.
- Staff explicitly marks the physical inspection completed before any payment request or external-payment record is accepted.
- Payment requests collect the full outstanding amount. Paid status derives from verified real Ziina payments or authorized staff-recorded external payments, net of refunds. Test payments do not count as cash, Paid, report clearance or payment conversions.
- Report clearance displays **Ready for Release — payment cleared** only after inspection completion and full payment. Nothing automatically sends or publishes a report.

## Files changed
Shared:
- `shared/inspectionPricing.ts` — authoritative pricing, service eligibility and label mapping.
- `shared/booking.ts` — strict public/admin input and response contracts.
- `shared/schema.ts` — additive booking, payment and audit tables; no deposit columns.

Backend:
- `server/bookingService.ts` — atomic booking/lead creation, quote snapshots, retry deduplication, payment reservation/verification, external receipts/refunds, completion and notification claims.
- `server/bookingRoutes.ts` — public/session-capability and authenticated admin endpoints, CSRF/rate controls, signed webhook.
- `server/bookingReporting.ts` — full booked quote value, actual net cash, outstanding payments, completed service value and source/campaign grouping.
- `server/ziina.ts` — fixed official API host, timeout, integer-fils requests, provider response validation and raw-body HMAC verification.
- `server/residentialChat.ts` — deterministic quote/custom-scope routing and current terms.
- `server/email.ts` — escaped residential confirmation email with private booking link and no upfront-payment wording.
- `server/leadPipeline.ts` — reusable transaction-aware updater; existing milestones and history semantics retained.
- `server/routes.ts` — route registration, deterministic chat/email prices, custom-quote routing, disabled new upfront Stripe checkout, booking/admin SEO shells.
- `server/index.ts` — preserve exact Ziina webhook bytes; exclude private access-link paths from visitor/log persistence.

Frontend:
- `client/src/lib/bookingApi.ts` — API/session/CSRF helpers and deduplicated booking/payment events.
- `client/src/pages/BookInspection.tsx` — mobile-first cream/emerald booking form and exact quote.
- `client/src/pages/BookingReturn.tsx` — private booking/status and post-inspection full-payment flow.
- `client/src/pages/admin/Bookings.tsx` — completion/payment actions, external receipts, private links, offline booking creation, audit and summary.
- `client/src/App.tsx` — lazy routes and existing admin-access guard.
- `client/src/pages/admin/ManageLeads.tsx` — bookings navigation only.
- `client/src/components/ChatWidget.tsx` — residential booking and Custom Quote CTAs; old cart actions hidden.
- `client/src/components/CartDrawer.tsx` — residential action routes to booking, not upfront Stripe checkout.
- `client/src/pages/ServiceDetail.tsx` — eligible residential vs custom CTA and current payment terms.
- `client/src/pages/Services.tsx` — area-based residential/custom price labels.

Migration/verification/documentation:
- `migrations/0002_residential_bookings.sql` — additive development migration.
- `scripts/test-residential-bookings.ts` — isolated provider/email and rollback-only database/API tests.
- `scripts/test-admin-spa.mjs` — extend actual production-renderer checks to booking and admin-booking routes.
- `scripts/test-lead-ui.mjs` — extend isolated protected-component fixtures to the booking ledger.
- `package.json` — new residential test command.
- `docs/residential-booking-changes.md` — this inventory and activation checklist.
- `.agents/memory/MEMORY.md`, `.agents/memory/residential-payment-terms.md` — preserve the corrected standing business rules.

## Schema and migration
New tables: `inspection_bookings`, `inspection_payments`, `booking_audit`.

Bookings store linked lead, unique submission/reference, residential scope, property details, preferred date/time, immutable base/VAT/total, attribution, status and physical-inspection-completion timestamp. Confirmation delivery has claim/sent timestamps.

Payments default to `full`; support `refund`, real/test metadata, unique provider/operation/reference identifiers and exact integer-fils amounts. A partial unique index permits at most one active Ziina intent per booking. Booking monetary invariants and positive AED payments are checked at database level.

The additive migration was applied **only to the development database**. No production schema/data changes, new startup migrations or publication were performed. Review the production schema through the existing database workflow before any future release.

## Routes
Pages:
- `/book-inspection` — noindex,follow; self-canonical; not added to sitemap.
- `/book-inspection/return` — noindex,nofollow private status page.
- `/admin/bookings` — existing admin gate; production SPA allowlist extended.
- `/booking-access/:reference/:token` — server-only capability handoff to HttpOnly session; redirects to token-free return URL, no-store/no-referrer/noindex, excluded from request/visitor logs.

Public API:
- `GET /api/bookings/config`
- `POST /api/bookings`
- `GET /api/bookings/:reference`
- `POST /api/bookings/:reference/pay` — full outstanding payment, physically completed inspection only.
- `POST /api/bookings/:reference/verify`
- `POST /api/ziina/webhook` — disabled without a secret; official IPs, exact raw-body HMAC, then authoritative provider GET.

Authenticated admin API:
- `GET/POST /api/admin/bookings`
- `GET /api/admin/bookings/:id/audit`
- `POST /api/admin/bookings/:id/action`
- `POST /api/admin/bookings/:id/external-payment`
- `POST /api/admin/bookings/:id/access-link`
- `POST /api/admin/bookings/:id/request-payment`

New upfront requests to `/api/checkout` return 410; existing Stripe orders/webhook/client code is retained, not replaced or migrated.

## Tracking and preservation
Existing GTM-NGVDWWRF, consent, attribution, generate_lead, WhatsApp and call tracking remain in place. No Ads tags or direct parallel analytics configurations were added.

A newly created valid residential booking may emit `booking_confirmed`. Creating a booking never emits `payment_completed`. Real verified online post-inspection payments may emit `payment_completed`, deduplicated by persisted payment ID. Staff-recorded external payments are visible in the ledger; no browser conversion is fabricated on their recording.

Chat-form to booking continuation can reuse its session-authorized lead/submission key. No arbitrary email-to-lead matching or public monetary/lifecycle updates are accepted.

Summary cash is net receipts after recorded refunds, excluding test payments. Completed revenue is completed service quote value, not an assertion of cash receipt. Date filters are Dubai creation-date cohorts; list is latest 100 matching records, aggregates cover all matching records.

## Remaining Ziina activation
No usable Ziina credentials were configured during implementation. Booking and offline payment operations work without them; online payment request setup explicitly remains pending.

1. Provide server-side `ZIINA_API_TOKEN` with `write_payment_intents` authorization. Never put this token in frontend code.
2. Keep `ZIINA_TEST_MODE=true` for the first real-provider tests. Default is test mode; only explicit `false` permits live charging.
3. For signed webhook delivery, configure `ZIINA_WEBHOOK_SECRET` and register the account webhook with Ziina at the reachable `/api/ziina/webhook` URL using the same secret. A locally configured secret is not proof of provider registration/connectivity.
4. Set `BOOKING_PUBLIC_BASE_URL` to the reviewed reachable site URL for links produced from webhook notifications. Browser-origin requests derive same-origin return links automatically.
5. Verify real-provider full payment after staff inspection completion, pending/failed/canceled paths, raw signed webhook, idempotent retry and AED amount/currency matching in test mode.
6. Confirm outbound email setup and sender; real development bookings can email customers/staff. Automated tests use an isolated notification transport.
7. Review schema/release prerequisites separately. **Do not publish or enable live payment automatically.**

Real-provider checkout/webhook connectivity is not verified without credentials. Application/provider-state tests use controlled server-side doubles and rollback all synthetic rows; they do not place real charges or send test emails.