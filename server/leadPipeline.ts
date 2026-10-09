import { and, count, desc, eq, gte, lt, sql, type SQL } from "drizzle-orm";
import { db } from "./db";
import { contactSubmissions as leads, leadStageHistory } from "@shared/schema";
import { leadStages, nonSalesSources, type LeadFilters, type LeadUpdate } from "@shared/leads";
import type { MarketingSummary } from "@shared/marketing";
import { londonDayBoundary } from "./ukDates";

export type LeadListOptions = Partial<LeadFilters> & { isRead?: boolean; limit?: number };

// London calendar-day boundaries must be calculated separately across DST.
export function dateBounds(filters: Pick<LeadListOptions, "from" | "to">) {
  return {
    from: filters.from ? londonDayBoundary(filters.from) : undefined,
    until: filters.to ? londonDayBoundary(filters.to, true) : undefined,
  };
}

// Classify old career records without rewriting their original data.
export const effectiveSource = sql<string>`case
  when ${leads.message} ilike 'Career application for %' then 'career_application'
  when ${leads.message} ilike 'Broker Referral Application%' then 'broker_referral'
  when ${leads.message} ilike 'Sample report download request%' then 'sample_report'
  else coalesce(nullif(trim(${leads.leadSource}), ''), 'legacy_unspecified') end`;

export function leadConditions(filters: LeadListOptions, includeDate = true) {
  const conditions: SQL[] = [];
  if (!filters.includeNonSales) {
    conditions.push(sql`${effectiveSource} not in (${sql.join(nonSalesSources.map(source => sql`${source}`), sql`, `)})`);
  }
  if (filters.stage) conditions.push(eq(leads.stage, filters.stage));
  if (filters.source) conditions.push(sql`${effectiveSource} = ${filters.source}`);
  if (typeof filters.isRead === "boolean") conditions.push(eq(leads.isRead, filters.isRead));
  if (includeDate) {
    const bounds = dateBounds(filters);
    if (bounds.from) conditions.push(gte(leads.createdAt, bounds.from));
    if (bounds.until) conditions.push(lt(leads.createdAt, bounds.until));
  }
  return and(...conditions);
}

export async function listLeads(filters: LeadListOptions = {}) {
  return db.select().from(leads).where(leadConditions(filters))
    .orderBy(desc(leads.createdAt), desc(leads.id)).limit(filters.limit ?? 25).offset(filters.offset ?? 0);
}

export async function countLeads(filters: LeadListOptions = {}) {
  const [row] = await db.select({ total: count() }).from(leads).where(leadConditions(filters));
  return row.total;
}

export function lifecyclePatch(current: typeof leads.$inferSelect, update: LeadUpdate, now: Date) {
  const { note: _note, ...fields } = update;
  const changed = update.stage !== undefined && update.stage !== current.stage;
  const patch: Partial<typeof leads.$inferInsert> = { ...fields };
  if (changed) {
    patch.stageUpdatedAt = now;
    const milestones = {
      qualified: "qualifiedAt", quoted: "quotedAt", booked: "bookedAt",
      completed: "completedAt", lost: "lostAt",
    } as const;
    const key = milestones[update.stage as keyof typeof milestones];
    if (key && !current[key]) patch[key] = now;
  }
  return { changed, patch };
}

export async function updateLead(id: number, update: LeadUpdate) {
  return db.transaction(tx => updateLeadInTransaction(tx, id, update));
}

export type LeadTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
export async function updateLeadInTransaction(tx: LeadTransaction, id: number, update: LeadUpdate) {
    // Serialize concurrent edits so each transition has the true preceding stage.
    const [current] = await tx.select().from(leads).where(eq(leads.id, id)).for("update");
    if (!current) return undefined;
    const now = new Date();
    const { changed, patch } = lifecyclePatch(current, update, now);
    if (changed && update.stage === "lost" && !(update.lostReason ?? current.lostReason)?.trim()) {
      throw new Error("LOST_REASON_REQUIRED");
    }
    const [saved] = await tx.update(leads).set(patch).where(eq(leads.id, id)).returning();
    if (changed) {
      await tx.insert(leadStageHistory).values({
        leadId: id, fromStage: current.stage, toStage: update.stage!, changedAt: now,
        note: update.note || null,
      });
    }
    return saved;
}

export async function leadHistory(id: number) {
  return db.select().from(leadStageHistory).where(eq(leadStageHistory.leadId, id))
    .orderBy(desc(leadStageHistory.changedAt), desc(leadStageHistory.id));
}

const touchHas = (key: string) => sql`(
  nullif(${leads.attribution}->'firstTouch'->>${key}, '') is not null or
  nullif(${leads.attribution}->'lastTouch'->>${key}, '') is not null)`;
const firstAndLast = sql`jsonb_typeof(${leads.attribution}->'firstTouch') = 'object'
  and jsonb_typeof(${leads.attribution}->'lastTouch') = 'object'`;
const filteredCount = (condition: SQL) => sql<number>`count(*) filter (where ${condition})::int`;

export async function marketingSummary(filters: LeadListOptions): Promise<MarketingSummary> {
  // A consistent read-only snapshot, with database-side aggregates only (no PII fetched).
  return db.transaction(async tx => {
    const where = leadConditions(filters);
    const [totals] = await tx.select({
      total: count(),
      qualified: filteredCount(sql`${leads.qualifiedAt} is not null`),
      quoted: filteredCount(sql`${leads.quotedAt} is not null`),
      booked: filteredCount(sql`${leads.bookedAt} is not null`),
      completed: filteredCount(sql`${leads.completedAt} is not null`),
      lost: filteredCount(sql`${leads.lostAt} is not null`),
      withAttribution: filteredCount(sql`${leads.attribution} is not null`),
      withFirstAndLastTouch: filteredCount(firstAndLast),
      withUtmSource: filteredCount(touchHas("utm_source")),
      withGclid: filteredCount(touchHas("gclid")),
      withGbraid: filteredCount(touchHas("gbraid")),
      withWbraid: filteredCount(touchHas("wbraid")),
      withAnyClickId: filteredCount(sql`${touchHas("gclid")} or ${touchHas("gbraid")} or ${touchHas("wbraid")}`),
      legacy: filteredCount(sql`(${leads.stage} = 'qualified' and ${leads.qualifiedAt} is null)
        or (${leads.stage} = 'quoted' and ${leads.quotedAt} is null)
        or (${leads.stage} = 'booked' and ${leads.bookedAt} is null)
        or (${leads.stage} = 'completed' and ${leads.completedAt} is null)
        or (${leads.stage} = 'lost' and ${leads.lostAt} is null)`),
    }).from(leads).where(where);
    const stageRows = await tx.select({ stage: leads.stage, total: count() }).from(leads).where(where).groupBy(leads.stage);
    const sourceRows = await tx.select({ source: effectiveSource, total: count() }).from(leads).where(where).groupBy(effectiveSource);
    // Currency buckets prevent accidental addition of AED and other currencies.
    const quoteRows = await tx.select({
      currency: leads.quoteCurrency, amount: sql<string>`coalesce(sum(${leads.quoteValueMinor}),0)::text`,
      total: count(leads.quoteValueMinor),
    }).from(leads).where(where).groupBy(leads.quoteCurrency);
    const revenueRows = await tx.select({
      currency: leads.revenueCurrency,
      booked: sql<string>`coalesce(sum(${leads.revenueAmountMinor}) filter (where ${leads.stage} = 'booked'),0)::text`,
      completed: sql<string>`coalesce(sum(${leads.revenueAmountMinor}) filter (where ${leads.stage} = 'completed'),0)::text`,
      total: filteredCount(sql`${leads.revenueAmountMinor} is not null and ${leads.stage} in ('booked','completed')`),
    }).from(leads).where(where).groupBy(leads.revenueCurrency);
    const values = new Map<string, MarketingSummary["valuesByCurrency"][number]>();
    function bucket(currency: string) {
      if (!values.has(currency)) values.set(currency, {
        currency, quoteValueMinor: 0, quotedLeads: 0, bookedRevenueMinor: 0,
        completedRevenueMinor: 0, bookedOrCompletedRevenueMinor: 0, revenueRecordedLeads: 0,
      });
      return values.get(currency)!;
    }
    for (const row of quoteRows) Object.assign(bucket(row.currency), { quoteValueMinor: Number(row.amount), quotedLeads: row.total });
    for (const row of revenueRows) Object.assign(bucket(row.currency), {
      bookedRevenueMinor: Number(row.booked), completedRevenueMinor: Number(row.completed),
      bookedOrCompletedRevenueMinor: Number(row.booked) + Number(row.completed), revenueRecordedLeads: row.total,
    });
    const bounds = dateBounds(filters);
    const activityConditions = [leadConditions(filters, false)];
    if (bounds.from) activityConditions.push(gte(leadStageHistory.changedAt, bounds.from));
    if (bounds.until) activityConditions.push(lt(leadStageHistory.changedAt, bounds.until));
    const activityRows = await tx.select({ stage: leadStageHistory.toStage, total: count() })
      .from(leadStageHistory).innerJoin(leads, eq(leads.id, leadStageHistory.leadId))
      .where(and(...activityConditions)).groupBy(leadStageHistory.toStage);
    const allSourceRows = await tx.select({ source: effectiveSource }).from(leads)
      .where(leadConditions({ includeNonSales: filters.includeNonSales })).groupBy(effectiveSource);
    const countsByStage = Object.fromEntries(leadStages.map(stage => [stage, 0]));
    for (const row of stageRows) countsByStage[row.stage] = row.total;
    return {
      range: { from: filters.from ?? null, to: filters.to ?? null, timezone: "Europe/London", basis: "lead_created_date_cohort" },
      includeNonSales: filters.includeNonSales ?? false, totalLeads: totals.total, countsByStage,
      countsBySource: Object.fromEntries(sourceRows.map(row => [row.source, row.total])),
      sources: allSourceRows.map(row => row.source).sort(),
      funnel: {
        leads: totals.total, qualified: totals.qualified, quoted: totals.quoted, booked: totals.booked,
        completed: totals.completed, lost: totals.lost,
        leadToBookingRate: totals.total ? totals.booked / totals.total : null,
      },
      activity: Object.fromEntries(leadStages.map(stage => [stage, activityRows.find(row => row.stage === stage)?.total ?? 0])),
      valuesByCurrency: Array.from(values.values()).sort((a, b) => a.currency.localeCompare(b.currency)),
      attribution: {
        withAttribution: totals.withAttribution, withFirstAndLastTouch: totals.withFirstAndLastTouch,
        withUtmSource: totals.withUtmSource, withGclid: totals.withGclid, withGbraid: totals.withGbraid,
        withWbraid: totals.withWbraid, withAnyClickId: totals.withAnyClickId,
        completenessRate: totals.total ? totals.withFirstAndLastTouch / totals.total : null,
      },
      legacyLifecycleWithoutTimestamps: totals.legacy,
      notes: [
        "Date filters are inclusive London calendar dates, including GMT/BST changes. Counts describe leads created in that range.",
        "Funnel milestones count only observed dedicated timestamps. Skipped stages and legacy timestamps are not invented.",
        "Activity counts stage-transition events in the period, including older leads and repeat transitions, not unique bookings.",
        "Revenue is staff-recorded actual revenue, not automatically reconciled Stripe payment or cash collection.",
        "Non-sales sources and legacy career messages are excluded unless includeNonSales=true.",
      ],
    };
  }, { isolationLevel: "repeatable read", accessMode: "read only" });
}