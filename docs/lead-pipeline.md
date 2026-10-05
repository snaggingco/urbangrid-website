# Marketing-to-operations reporting

## Storage and schema rollout

Keep `public.contact_submissions` as the source of truth. The lifecycle schema is additive: no records, old columns, attribution, or submission keys are replaced. `shared/schema.ts` is authoritative; `migrations/0001_lead_pipeline.sql` is the reviewable additive SQL equivalent.

Use the existing `npm run db:push` development flow, reviewing the proposed changes. Never add schema mutation to application startup or a publish build hook. Production has not been changed. For the managed database, a future user-initiated Publish applies the schema diff; do not select overwrite-data.

## Authenticated endpoints

- `GET /api/admin/leads`: `{leads,total}`, 25 rows/page.
- `PATCH /api/admin/leads/:id`: optional structured fields; existing stage/revenue payloads remain accepted.
- `GET /api/admin/leads/:id/history`: `{history}`, newest transition first.
- `GET /api/admin/marketing-summary`: aggregates only, no names, emails, phones, messages or raw attribution.

Filters: `stage`, `source`, `from`, `to`, `includeNonSales`, and list-only `offset`. Dates are valid `YYYY-MM-DD`, inclusive Dubai calendar days; omit dates for all time. All endpoints require the existing admin session; there is no public reporting token.

Default sales reports exclude `career`, `career_application`, `broker_referral`, and `sample_report`. Known legacy career, broker and sample-download messages are excluded even without a source, without modifying the original rows. Set `includeNonSales=true` to include these explicitly. Other empty legacy sources appear as `legacy_unspecified`; never fabricate attribution for them.

## Reporting definitions

- Counts by stage describe current stage for the selected creation-date cohort.
- Funnel milestones count observed first entry into each stage using dedicated timestamps. Moving directly from new to booked does not invent qualification or quoting.
- Stage activity counts actual transition events in the selected period, including older leads and repeat transitions. It is not a unique-booking metric.
- `stage_updated_at` changes only on a stage transition; revenue/quote/date/reference-only saves do not change lifecycle dates.
- Re-entering a stage preserves its first timestamp and creates another history row. History and updates commit together with a row lock.
- Legacy progressed stages without milestone timestamps remain explicitly flagged, not backfilled with guessed dates.
- Values are minor units, grouped by currency. Revenue subtotals reflect current booked/completed stages. Quote sums are recorded quote values, not collected payments.
- Actual revenue is manually verified by staff. There is no automatic Stripe reconciliation, offline conversion upload, or bidding change.
- Attribution completeness means both touch objects are present; separate UTM and click-ID counts identify captured marketing identifiers. These are not proof of a paid booking.

The report supports scheduled read-only querying in future, but no weekly email job is installed by this change. Public form emails, GTM, consent, and click/lead events are unchanged.

## Verification

Run `npm run build`, `npm run test:lead-pipeline`, `npm run test:admin-spa`, `npm run test:lead-ui`, and `node scripts/test-consent-preferences.mjs`.
The integration tests target the development database, use synthetic rows inside a rollback-only transaction, and never submit public forms or deliver notification emails.