# UAE Production operations release

Production alone is configured for the approved receiver project:

- `URBANGRID_OPERATIONS_INTEGRATION_URL`:
  `https://nzbewemalujbhnjbrpcs.supabase.co/functions/v1/urbangrid-integration`
- `URBANGRID_OPERATIONS_STATUS_URL`:
  `https://nzbewemalujbhnjbrpcs.supabase.co/functions/v1/urbangrid-status`
- The existing `URBANGRID_NETWORK_INTEGRATION_KEY` remains private.

Development remains on its separate `ewyxbbfktyhmmwocvmqs` project. Existing
Development verification evidence is not replaced by Production smoke evidence.
Environment settings and new server code require a new publish to become active.

## Independent execution

The existing authorized UAE GitHub repository has Actions enabled and is public.
Use its standard Ubuntu runner, not a hosting upgrade or a new paid service.
The versioned template `docs/uae-operations-reconciliation.workflow.yml` must be
installed as `.github/workflows/uae-operations-reconciliation.yml` on
the repository's default `main` branch because release-only branch schedules do
not execute. Other default-branch application files must remain unchanged;
synchronize the complete website source separately to its release branch.

The current OAuth connection grants `repo` but not GitHub's separate `workflow`
scope. Normal source writes succeed, but workflow tree creation is rejected.
The scheduler is therefore **not activated by this template**. An authorized
repository owner can add the template using GitHub's web editor on `main`, or
provide a workflow-capable authorization. Do not overwrite unrelated files or
try to evade provider permissions. The encrypted Actions secret is already set.

The existing integration credential is stored using GitHub's public-key
sealed-box encryption as an Actions repository secret. Never store it in
workflow YAML, git, client code, docs or command output.

Every five minutes the external runner POSTs to the authenticated
`/api/integrations/operations/tick` and awaits up to three deliveries plus three
status reconciliations. The request wakes sleeping Autoscale; database leases,
frozen events, retry deadlines and receipt deduplication retain ownership across
process loss and overlapping internal/external workers.

Successful HTTP acceptance does not establish a healthy queue. Inspect retained
failure diagnostics and mappings. GitHub schedules may be delayed or dropped;
this is periodic independent execution, not a strict five-minute SLA or continuous
processing guarantee. A successful job and later scheduled runs against the
published route are release evidence. An in-process timer is not.
Public-repository schedules can also be automatically disabled after prolonged
repository inactivity; monitor workflow state and re-enable if necessary.

## Controlled website smoke

Command: `node scripts/verify-uae-production-smoke.mjs --production`.

This script refuses to create any booking unless the authenticated worker route
of the new Production release succeeds. It uses the ordinary website booking
endpoint, its real CSRF/session flow and booking service, with a private
server-to-server synthetic marker. The marker requires the existing credential,
Production environment, exact synthetic name/project prefixes, `@example.invalid`
email and the non-customer placeholder phone.

The service atomically quarantines the lead, booking and outbox. Website emails
are skipped both in the route and the notification service; provider and
external-payment creation are rejected for the fixture. The outbound event has
`recordType: integration_test`, null telephone and explicit no-email/SMS/
notification flags. No checkout, browser analytics, Ads event or real customer
contact is used.

The stable submission UUID ensures rerunning this check reuses one fixture.
Its private replay/reconcile route refuses ordinary bookings and sends the
original persisted event unchanged. Verify persisted Order/Job/Project mappings,
the receiver's explicit duplicate flag, returned lifecycle status and duplicate
website submission identity. Keep this clearly labeled evidence; do not delete
or replay historical customer leads.

The existing Development test UI/cleanup guards stay Development-only.

## Release completion

Typecheck, production build, existing booking/payment/lead/acquisition/lifecycle/
outbox checks and new isolated machine-auth/synthetic safeguards must pass.
Production verification cannot be claimed until the new build is published and
the controlled website-originated check and independent scheduled runs succeed.
Do not silently switch the existing Autoscale deployment to another target.
