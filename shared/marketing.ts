export interface MarketingSummary {
  range: { from: string | null; to: string | null; timezone: string; basis: string };
  includeNonSales: boolean;
  totalLeads: number;
  countsByStage: Record<string, number>;
  countsBySource: Record<string, number>;
  sources: string[];
  funnel: {
    leads: number; qualified: number; quoted: number; booked: number; completed: number; lost: number;
    leadToBookingRate: number | null;
  };
  activity: Record<string, number>;
  valuesByCurrency: Array<{
    currency: string; quoteValueMinor: number; quotedLeads: number;
    bookedRevenueMinor: number; completedRevenueMinor: number;
    bookedOrCompletedRevenueMinor: number; revenueRecordedLeads: number;
  }>;
  attribution: {
    withAttribution: number; withFirstAndLastTouch: number; withUtmSource: number;
    withGclid: number; withGbraid: number; withWbraid: number; withAnyClickId: number;
    completenessRate: number | null;
  };
  legacyLifecycleWithoutTimestamps: number;
  notes: string[];
}