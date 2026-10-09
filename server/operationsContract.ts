export { integrationEndpoint as operationsEndpoint, validIntegrationKey as validOperationsKey } from "./network/recipient";
import type { contactSubmissions, inspectionBookings } from "@shared/schema";
import type { BookingCreatedOperationsEvent, OperationsEnvironment } from "@shared/operationsIntegration";

export const operationsEnvironment = (): OperationsEnvironment =>
  process.env.NODE_ENV === "production" ? "production" : "development";


export function bookingCreatedEvent(
  booking: typeof inspectionBookings.$inferSelect,
  lead: typeof contactSubmissions.$inferSelect,
  environment = operationsEnvironment(),
): BookingCreatedOperationsEvent {
  return {
    eventId: `urbangrid.${environment}.booking.created.v1.${booking.id}`,
    type: "booking.created", schemaVersion: 1, source: "urbangrid", environment,
    occurredAt: booking.createdAt.toISOString(),
    data: { booking: {
      id: booking.id, leadId: booking.leadId,
      country: "AE", market: "UAE", siteId: "urbangrid.ae",
      leadIdentity: `ug-ae-lead-${booking.leadId}`, bookingIdentity: `ug-ae-booking-${booking.id}`,
      bookingReference: booking.bookingReference,
      customer: { name: lead.name, email: lead.email, phone: lead.phone },
      propertyType: booking.propertyType, areaSqft: booking.areaHundredths / 100,
      bedrooms: booking.bedrooms, project: booking.project, location: booking.location, emirate: booking.emirate,
      service: booking.service,
      baseMinor: booking.baseMinor, vatMinor: booking.vatMinor, quoteTotalMinor: booking.quoteTotalMinor, currency: booking.currency,
      inspectionDate: booking.inspectionDate, timeWindow: booking.timeWindow, timeZone: "Asia/Dubai",
      status: booking.status, paymentStatus: "unpaid", cashCollectedMinor: 0,
      amountOutstandingMinor: booking.quoteTotalMinor,
      leadSource: lead.leadSource, attribution: booking.attribution ?? null,
    } },
  };
}