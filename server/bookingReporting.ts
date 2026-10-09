import { and, desc, eq, gte, lt, sql, type SQL } from "drizzle-orm";
import { db } from "./db";
import { inspectionBookings as b, inspectionPayments as p, contactSubmissions as l } from "@shared/schema";
import { dateBounds } from "./leadPipeline";
import { bookingView } from "./bookingService";
import { ziina } from "./ziina";
export async function bookingReport(filters: { from?: string; to?: string; source?: string }) {
  const source = sql<string>`coalesce(nullif(${b.attribution}->'lastTouch'->>'utm_source',''),
    nullif(${b.attribution}->'firstTouch'->>'utm_source',''), ${l.leadSource}, 'unspecified')`;
  const campaign = sql<string>`coalesce(nullif(${b.attribution}->'lastTouch'->>'utm_campaign',''),
    nullif(${b.attribution}->'firstTouch'->>'utm_campaign',''), 'unattributed')`;
  const gclid = sql<string>`coalesce(nullif(${b.attribution}->'lastTouch'->>'gclid',''),
    nullif(${b.attribution}->'firstTouch'->>'gclid',''), '')`;
  const bounds = dateBounds(filters);
  const conditions: SQL[] = [eq(b.isIntegrationTest, false)];
  if (bounds.from) conditions.push(gte(b.createdAt, bounds.from));
  if (bounds.until) conditions.push(lt(b.createdAt, bounds.until));
  if (filters.source) conditions.push(eq(source, filters.source));
  // Correlated ledger sum: no payment joins that multiply booking values.
  const collected = sql<number>`coalesce((select sum(case
    when ip.status = 'completed' then ip.amount_minor
    when ip.status = 'refunded' then -ip.amount_minor else 0 end)
    from inspection_payments ip where ip.booking_id = ${b.id}
      and coalesce((ip.metadata->>'testMode')::boolean,false) = false),0)::bigint`;
  const booked = sql`${b.status} in ('booked','completed') and ${l.stage} != 'lost'`;
  const sums = {
    bookedValueMinor: sql<string>`coalesce(sum(case when ${booked} then ${b.quoteTotalMinor} else 0 end),0)::text`,
    cashCollectedMinor: sql<string>`coalesce(sum(${collected}),0)::text`,
    paymentOutstandingMinor: sql<string>`coalesce(sum(case when ${booked} then greatest(${b.quoteTotalMinor}-${collected},0) else 0 end),0)::text`,
    completedRevenueMinor: sql<string>`coalesce(sum(case when ${b.inspectionCompletedAt} is not null and ${b.status}!='lost' then ${b.quoteTotalMinor} else 0 end),0)::text`,
  };
  const [totals] = await db.select(sums).from(b).innerJoin(l, eq(l.id, b.leadId)).where(and(...conditions));
  const groups = await db.select({ source, campaign,
    gclidPresent: sql<boolean>`(${gclid}) != ''`, bookings: sql<number>`count(*)::int`,
    bookedValueMinor: sums.bookedValueMinor, cashCollectedMinor: sums.cashCollectedMinor,
  }).from(b).innerJoin(l, eq(l.id, b.leadId)).where(and(...conditions)).groupBy(source, campaign, sql`(${gclid}) != ''`);
  const rows = await db.select({ booking: b }).from(b).innerJoin(l, eq(l.id, b.leadId))
    .where(and(...conditions)).orderBy(desc(b.createdAt)).limit(100);
  return {
    bookings: await Promise.all(rows.map(row => bookingView(row.booking, ziina, true))),
    summary: { ...Object.fromEntries(Object.entries(totals).map(([key, value]) => [key, Number(value)])),
      bySource: groups.map(row => ({ ...row, bookedValueMinor: Number(row.bookedValueMinor), cashCollectedMinor: Number(row.cashCollectedMinor) })) },
    paymentSetup: { onlinePaymentEnabled: ziina.enabled(), testMode: ziina.testMode(), webhookEnabled: Boolean(process.env.ZIINA_WEBHOOK_SECRET) },
    notes: ["Creation-date cohort; cash is net of recorded refunds and excludes Ziina test payments.",
      "Booked value is full booked quote value, not cash. Completed revenue is completed service value, not cash reconciliation.",
      "List limited to most recent 100 matching bookings; totals include all matching bookings."],
  };
}