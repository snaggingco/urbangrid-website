import { z } from "zod";
import { calendarDate } from "./leads";

export const acquisitionFiltersSchema = z.object({
  from: calendarDate.optional(),
  to: calendarDate.optional(),
}).strict().refine(v => !v.from || !v.to || v.from <= v.to, "From date must not follow to date");

export type AcquisitionMetrics = {
  leads: number;
  bookedLeads: number;
  eligibleBookings: number;
  leadToBookingRate: number | null;
  bookedValueMinor: number;
  completedServiceValueMinor: number;
  netCashCollectedMinor: number;
  outstandingMinor: number;
  averageBookedValueMinor: number | null;
  gclidLeads: number;
  gclidRate: number | null;
};
export type AcquisitionGroup = AcquisitionMetrics & { source: string; medium: string; campaign: string };
export type AcquisitionReport = {
  range: { from: string | null; to: string | null; timezone: "Europe/London"; basis: "lead_created_date_cohort" };
  attributionModel: "first_touch";
  currency: "GBP";
  totals: AcquisitionMetrics;
  groups: AcquisitionGroup[];
  notes: string[];
};