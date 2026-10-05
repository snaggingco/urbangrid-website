import { z } from "zod";
import { attributionSchema, calendarDate } from "./leads";
import { residentialServices } from "./inspectionPricing";
const clean = (max: number) => z.string().trim().min(1).max(max).refine(s => !/[<>\x00-\x08]/.test(s), "Use plain text");
export const bookingInputSchema = z.object({
  submissionKey: z.string().uuid(),
  service: z.enum(residentialServices.map(s => s.key) as [typeof residentialServices[number]["key"], ...typeof residentialServices[number]["key"][]]),
  propertyType: z.enum(["Apartment", "Villa", "Townhouse", "Penthouse"]),
  areaSqft: z.coerce.number().positive().max(1000000).refine(n => Math.abs(n * 100 - Math.round(n * 100)) < 0.000001),
  bedrooms: z.enum(["Studio", "1", "2", "3", "4", "5", "6+"]).optional(),
  project: clean(255), location: clean(255),
  emirate: z.enum(["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah", "Fujairah", "Umm Al Quwain"]),
  inspectionDate: calendarDate,
  timeWindow: z.string().trim().max(100).optional(),
  name: clean(255).refine(s => s.length >= 2), email: z.string().trim().email().max(255),
  phone: z.string().trim().regex(/^\+?[\d\s()-]{7,50}$/),
  attribution: attributionSchema.nullable().optional(),
}).strict();
export type BookingInput = z.infer<typeof bookingInputSchema>;
// Admin-only extension. A linked enquiry may legitimately have no phone.
// The public booking schema and customer validation are unchanged.
export const adminBookingInputSchema = bookingInputSchema.extend({
  existingLeadId: z.number().int().positive().optional(),
  phone: z.string().trim().max(50),
}).superRefine((value, ctx) => {
  if (!value.existingLeadId) {
    const { existingLeadId: _id, ...customerFields } = value;
    const result = bookingInputSchema.safeParse(customerFields);
    if (!result.success) result.error.issues.forEach(issue => ctx.addIssue(issue));
  }
});
export type AdminBookingInput = z.infer<typeof adminBookingInputSchema>;
export const paymentTypes = ["full", "refund"] as const;
export const externalPaymentSchema = z.object({
  paymentType: z.enum(["full", "refund"]), amountMinor: z.number().int().positive().max(2147483647),
  paidAt: z.string().datetime(), reference: clean(255), providerNote: clean(1000),
  provider: z.enum(["ziina_manual", "bank_transfer", "cash", "other"]),
}).strict();
export type BookingView = {
  id: number; leadId: number; bookingReference: string; service: string; propertyType: string;
  areaSqft: number; bedrooms: string | null; project: string; location: string; emirate: string;
  inspectionDate: string; timeWindow: string | null; status: string; leadStage: string;
  baseMinor: number; vatMinor: number; quoteTotalMinor: number;
  currency: string; cashCollectedMinor: number;
  amountOutstandingMinor: number; paymentStatus: string; paymentSetup: string;
  reportStatus: string; inspectionCompletedAt: string | null;
  payments: { id: number; paymentType: string; amountMinor: number; status: string; provider: string; completedAt: string | null; verifiedOnline: boolean }[];
  leadSource?: string | null; campaign?: string | null; gclid?: string | null;
  operations?: {
    status: string | null; version: number | null;
    identifiers?: import("./operationsIntegration").OperationsReceiverIdentifiers | null;
    lastReconciledAt: string | null; errorCode?: string | null;
  };
};