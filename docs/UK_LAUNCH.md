# UrbanGrid UK launch

This project is UK-only. It uses the shared Strata operations platform with a
dedicated GB website database and GB integration client. The public service
catalogue is retained; all services launch as enquiries and custom quotes.
Online booking, checkout, payment webhooks and UAE staff notifications are disabled.

## Public facts

The creator supplied the Google business listing for UrbanGrid UK. It lists
urbangrid.co.uk, +44 7436 597890, 28 Manchester Street, London W1U 7LE,
United Kingdom, and London and nearby areas. The site does not assume that this
address is a registered legal office. No UK email address, legal company name,
registration number, professional accreditation, WhatsApp availability, VAT
registration or standard prices have been verified.

## Configuration and acceptance blockers

- Put a **new, empty, dedicated UK** PostgreSQL connection in
  `URBANGRID_GB_DATABASE_URL`. Never use a UAE database or a branch that copies
  UAE personal/customer data. Runtime and migration configuration reject the
  inherited generic database target.
- Initialize the UK schema only, then apply the UK lead-currency defaults.
  Do not run a schema push against an existing UAE database. No production
  schema changes were applied as part of this localisation.
- Register `GB`, source domain `urbangrid.co.uk`, client `urbangrid-uk`,
  service areas and approved providers in the shared platform.
- Add its **GB-scoped** credential as `URBANGRID_GB_NETWORK_INTEGRATION_KEY`.
  Do not reuse `URBANGRID_NETWORK_INTEGRATION_KEY`.
- Use the existing Development gateway for preview tests and the Production
  gateway only for published production. The gateway target is checked.
- For local staff access, set `URBANGRID_GB_ADMIN_EMAIL`,
  `URBANGRID_GB_ADMIN_INITIAL_PASSWORD` and `URBANGRID_GB_SESSION_SECRET`.
  The old UAE admin credentials and session secret are not used.
- Optional UK mail uses only `URBANGRID_GB_NOTIFICATION_EMAIL`,
  `URBANGRID_GB_EMAIL_FROM`, `URBANGRID_GB_SMTP_HOST`,
  `URBANGRID_GB_SMTP_PORT`, `URBANGRID_GB_SMTP_USER`,
  `URBANGRID_GB_SMTP_PASS`. Until configured, enquiries remain in the UK
  dashboard and durable Network outbox, not an inherited staff mailbox.
- Confirm legal identity, UK privacy notice, retention, data processor/transfer
  arrangements, service terms and cancellation rights before launch.
- Supply UK-owned analytics destinations if tracking is wanted. The UAE
  marketing tags must remain disabled on this site.

Without the UK database, the app deliberately serves a **static onboarding
preview**. Every enquiry/admin request returns an explicit unavailable response
instead of silently writing to UAE data or pretending a submission succeeded.
`/api/launch-readiness` reports configuration only, not legal or delivery approval.

## Verification

`npx tsx scripts/test-uk-launch.ts` uses synthetic configuration and no real
database, mail or customers. `npm run check` and `npm run build` check the UK
frontend and production first-paint output.

Before publishing, use reserved synthetic contact details against Development:
prove UK enquiry + outbox commit together, retrying a submission creates one
lead, the Network receiver durably stores the UK lead once, and gateway outages
retain queued enquiries. Confirm admin access and customer-facing errors.
An acknowledged request alone is not proof of an order/job/project lifecycle.

The lead worker runs in the web process. It does not execute while Autoscale is
scaled to zero; arrange a separately authorized scheduler or always-running
worker before promising unattended delivery.
