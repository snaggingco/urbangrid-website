import { sql } from "drizzle-orm";
import { db } from "./db";
import { contactSubmissions as leads } from "@shared/schema";
import { acquisitionFiltersSchema, type AcquisitionGroup, type AcquisitionMetrics, type AcquisitionReport } from "@shared/acquisition";
import { leadConditions } from "./leadPipeline";

const amountKeys = ["leads", "bookedLeads", "eligibleBookings", "bookedValueMinor",
  "completedServiceValueMinor", "netCashCollectedMinor", "outstandingMinor", "gclidLeads"] as const;
type Aggregate = Pick<AcquisitionMetrics, typeof amountKeys[number]>;
const empty = (): Aggregate => Object.fromEntries(amountKeys.map(k => [k, 0])) as Aggregate;
function metrics(row: Aggregate): AcquisitionMetrics {
  return { ...row,
    leadToBookingRate: row.leads ? row.bookedLeads / row.leads : null,
    averageBookedValueMinor: row.eligibleBookings ? row.bookedValueMinor / row.eligibleBookings : null,
    gclidRate: row.leads ? row.gclidLeads / row.leads : null };
}

// One aggregate-only query: no customer identities or capped booking-list totals.
export async function acquisitionReport(raw: { from?: string; to?: string }): Promise<AcquisitionReport> {
  const filters = acquisitionFiltersSchema.parse(raw);
  const result = await db.execute(sql`
    with cohort as (
      select ${leads.id} as id, ${leads.stage} as stage,
        coalesce(nullif(btrim(${leads.attribution}->'firstTouch'->>'utm_source'), ''), 'Unknown') as source,
        coalesce(nullif(btrim(${leads.attribution}->'firstTouch'->>'utm_medium'), ''), 'Unknown') as medium,
        coalesce(nullif(btrim(${leads.attribution}->'firstTouch'->>'utm_campaign'), ''), 'Unknown') as campaign,
        (nullif(btrim(${leads.attribution}->'firstTouch'->>'gclid'), '') is not null
          or nullif(btrim(${leads.attribution}->'lastTouch'->>'gclid'), '') is not null) as gclid
      from ${leads}
      where ${leadConditions({ ...filters, includeNonSales: false })}
    ), eligible as (
      select b.id, b.lead_id, b.quote_total_minor, b.status, b.inspection_completed_at,
        coalesce((select sum(case
          when p.status = 'completed' then p.amount_minor
          when p.status = 'refunded' then -p.amount_minor else 0 end)
          from inspection_payments p where p.booking_id = b.id and p.currency = 'GBP'
            and coalesce((p.metadata->>'testMode')::boolean, false) = false), 0) as cash
      from inspection_bookings b join cohort c on c.id = b.lead_id
      where b.currency = 'GBP' and b.status in ('booked', 'completed') and c.stage not in ('lost', 'canceled', 'cancelled')
    ), per_lead as (
      select lead_id, count(*) as bookings, sum(quote_total_minor) as value,
        sum(case when status = 'completed' and inspection_completed_at is not null
          then quote_total_minor else 0 end) as completed_value,
        sum(cash) as cash, sum(greatest(quote_total_minor - cash, 0)) as outstanding
      from eligible group by lead_id
    )
    select c.source, c.medium, c.campaign,
      count(*)::int as leads,
      count(*) filter (where coalesce(b.bookings, 0) > 0)::int as "bookedLeads",
      coalesce(sum(b.bookings), 0)::bigint as "eligibleBookings",
      coalesce(sum(b.value), 0)::bigint as "bookedValueMinor",
      coalesce(sum(b.completed_value), 0)::bigint as "completedServiceValueMinor",
      coalesce(sum(b.cash), 0)::bigint as "netCashCollectedMinor",
      coalesce(sum(b.outstanding), 0)::bigint as "outstandingMinor",
      count(*) filter (where c.gclid)::int as "gclidLeads"
    from cohort c left join per_lead b on b.lead_id = c.id
    group by c.source, c.medium, c.campaign
    order by count(*) desc, c.source, c.medium, c.campaign
  `);
  const totals = empty();
  const groups: AcquisitionGroup[] = result.rows.map(row => {
    const values = empty();
    for (const key of amountKeys) {
      values[key] = Number(row[key]);
      if (!Number.isSafeInteger(values[key])) throw new Error("Acquisition aggregate is outside the supported integer range");
      totals[key] += values[key];
    }
    return { source: String(row.source), medium: String(row.medium), campaign: String(row.campaign), ...metrics(values) };
  });
  return {
    range: { from: filters.from ?? null, to: filters.to ?? null, timezone: "Europe/London", basis: "lead_created_date_cohort" },
    attributionModel: "first_touch", currency: "GBP", totals: metrics(totals), groups,
    notes: [
      "Inclusive London calendar dates (including GMT/BST changes) select sales leads by lead creation time. UK online booking/payment is disabled for this enquiries-only launch.",
      "All subsequent recorded bookings and payments for the selected lead cohort are included, even if recorded outside the date range.",
      "Source, medium and campaign use the lead's first-touch UTM fields only. Missing values remain Unknown; intake form source is not acquisition source.",
      "Eligible inspections are distinct booked/completed booking records whose lead is not lost/cancelled. Lost/cancelled bookings are excluded from every booking and value metric.",
      "Lead-to-booking rate is unique leads with at least one eligible inspection divided by leads; multiple inspections never inflate the rate above 100%.",
      "Recorded quote and service values are not collected cash. Tax treatment must be confirmed in the individual UK quote.",
      "Net cash is the eligible bookings' payment ledger, excluding test payments and subtracting recorded refunds. Outstanding is calculated per eligible booking.",
      "Staff-entered lead revenue is separate and is neither included nor overwritten. GCLID presence means a nonblank GCLID on either lead touch.",
      "Advertising spend and cost per booked inspection are joined externally; this report does not collect spend or send ad conversions.",
    ],
  };
}