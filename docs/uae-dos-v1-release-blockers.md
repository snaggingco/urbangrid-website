# UAE DOS v1 release-blocker handoff

Scope: UAE repository only, based on local commit `ed46e820`. No publication,
Production database writes, Production endpoint changes, other country work,
real customer messages/payments or analytics conversions are authorized here.

## Changes and verification

- Resolve the existing 22 TypeScript errors without suppressing diagnostics.
  Correct dynamic Drizzle query types, inspector field/filter consistency,
  React property/nullability, Stripe checkout/migration types, Replit identity
  typing, p-retry AbortError import and missing image-response handling.
- Patch the affected runtime dependencies and compatible transitive versions.
  Keep Express 4, the current React/design system and Tailwind 3. Vite 6.4.3 is
  the maintained compatible tooling update; the production build/first-paint
  checks verify existing routes, SEO ownership and consent ordering.
- Declare the previously implicit server nanoid dependency explicitly.
- Correct the isolated auth fixture to use the real restore function signature
  and string credential version. Production authentication code is unchanged.
- Add process-restart tests, with separate worker child processes and stubbed
  transports. They persist one labeled Development-only fixture, kill workers
  after claims, verify no early lease reuse, advance only fixture deadlines to
  simulate expiry, then recover delivery/status with unchanged event snapshots.
  HTTP 503 remains visible across processes with the five-minute retry deadline.
  Lifecycle replay leaves one receipt. Cleanup guards identity and payment
  absence and removes only the fixture.

Passed release checks:

- `npm run check`: no TypeScript diagnostics.
- `npm run build`: production frontend, first-paint markup and server bundle.
- `npm run test:operations-restart`: persisted delivery/status recovery,
  visible failure/backoff and lifecycle deduplication across child processes.
- `npm run test:operations-integration`: 20 rollback-only checks.
- `npm run test:operations-lifecycle`: 8 rollback-only checks.
- `NODE_ENV=development npx tsx scripts/test-operations-status-contract.ts`.
- `npm run test:admin-acquisition`: 9 rollback-only checks.
- `npm run test:residential-bookings`: 18 rollback-only checks, stubbed
  notifications/provider responses; no real provider charges or messages.
- `npm run test:lead-pipeline`: 19 rollback-only checks.
- `npm run test:admin-operations-auth`: synthetic identity/session verification.
- `npm run test:admin-operations-ui` and `npm run test:admin-spa`:
  isolated browser fixtures, protected access, diagnostics/reconcile failures,
  mobile layout, production shells/404s, SEO and consent ordering.

The real Development test is not rerun. Its retained evidence remains checked
2026-10-04T22:28:15.548Z, with creation/status/duplicate HTTP 200 and confirmed
duplicate protection. Original Order/Job/Project mappings are preserved.
The restart test asserts that this evidence is unchanged after cleanup.

## Security scope

The dependency audit went from 1 critical / 26 high findings to 0 critical /
7 high findings (all dependencies). The remaining high chain is the existing
Tailwind build tooling: typography, tailwindcss, tailwindcss-animate, fast-glob,
micromatch, chokidar and braces. It compiles trusted repository files; customer
booking/status paths do not submit patterns to that compiler. The Production
dependency classification still lists six of these because of package placement,
not because they are a demonstrated public request exploit.

Do not claim a vulnerability-free repository. A forced Tailwind replacement or
downgrade is excluded from this minimal release fix because it can change the
site design. Lower-severity dependency debt is also retained for separate work.

## Production readiness: blocked, no Production mutations

Read-only managed Production schema inspection found no:

- `operations_delivery_outbox`
- `operations_lifecycle`
- `operations_lifecycle_events`
- `operations_integration_checks`
- `inspection_bookings.is_integration_test`
- `inspection_bookings.strata_identifiers`
- `inspection_bookings.strata_last_sync_at`

The additive migration chain `0004` through `0009` needs explicit approved
Production application/review. The existing `db:migrate-operations` command only
covers `0004` through `0006`: do not assume it applies the complete chain, and
never run it against Production as part of build, startup or this handoff.

The Production configuration inventory and .replit Production scope contain
neither `URBANGRID_OPERATIONS_INTEGRATION_URL` nor
`URBANGRID_OPERATIONS_STATUS_URL`. Production needs approved values for both.
`URBANGRID_NETWORK_INTEGRATION_KEY` exists as a secret, but its Production
receiver match is not tested; do not disclose or infer its value.
No Strata Production request was made.

The existing public Autoscale deployment at https://urbangrid.ae reports a
successful build. Its deployed commit SHA is unavailable from deployment
metadata; do not identify local/release-branch HEAD as the live commit.

## Autoscale execution arrangement

Database rows, leases and retry deadlines survive process loss. Startup drains
due work, but no work runs while Autoscale is at zero. Authenticated admin retry
and reconciliation are manual recovery, not a scheduler or continuous SLA.

No authenticated scheduling service, machine-authenticated queue-drain route,
or scheduled deployment is configured. Do not reuse the lifecycle callback
as a worker trigger or claim a timer/public keepalive is reliable scheduling.

Replit supports always-on Reserved VM and cron-like Scheduled Deployments:
https://docs.replit.com/features/publishing/deployment-types

Smallest no-new-endpoint alternative is an approved always-on Reserved VM for
the existing server/worker, instead of Autoscale. To retain Autoscale, configure
a separate scheduled runner that awaits both existing cycle functions and closes
the database pool, sharing the correct Production DATABASE_URL and the two
approved receiver URLs plus URBANGRID_NETWORK_INTEGRATION_KEY. Its schedule,
entry command and secure configuration are not currently provisioned. A
one-minute schedule would give periodic processing, not uninterrupted execution
or a guarantee during receiver/database outages.

No deployment target, scheduling service or Production configuration is changed
by this release-blocker work.

## Git synchronization

GitHub read/fetch access succeeded. The verified remote is
https://github.com/snaggingco/urbangrid-website.git. Fetched remote main is an
ancestor of the local implementation; no remote-only newer commits were found.
The normal release-branch push failed with "Invalid username or token":
write authentication is blocked. No additional push retry was made, and no
branch was synchronized remotely. The release remains on the local
`release/uae-dos-v1-blockers-20261004` branch.
Do not modify remote main, force-push, publish, or open an automatic rollout.