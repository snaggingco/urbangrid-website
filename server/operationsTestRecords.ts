import crypto from "node:crypto";
import { and, eq, inArray, sql } from "drizzle-orm";
import { db } from "./db";
import { contactSubmissions as leads, inspectionBookings as bookings,
  operationsDeliveryOutbox as outbox, inspectionPayments as payments,
  bookingAudit as audit, leadStageHistory as history } from "@shared/schema";
import { calculateInspectionPrice } from "@shared/inspectionPricing";
import { bookingCreatedEvent, operationsEndpoint } from "./operationsContract";

const DEVELOPMENT_ENDPOINT = "https://ewyxbbfktyhmmwocvmqs.supabase.co/functions/v1/urbangrid-integration";
export const developmentTestsAvailable = () => process.env.NODE_ENV === "development" &&
  operationsEndpoint(process.env.URBANGRID_OPERATIONS_INTEGRATION_URL) === DEVELOPMENT_ENDPOINT;

export class OperationsTestError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
function requireDevelopment() {
  if (!developmentTestsAvailable()) throw new OperationsTestError(404, "Development tests are unavailable.");
}

// No booking/form/notification/analytics services are invoked. This is an
// explicitly quarantined fixture, committed with its ordinary delivery event.
export async function createOperationsTestRecord() {
  requireDevelopment();
  return db.transaction(async tx => {
    await tx.execute(sql`select pg_advisory_xact_lock(hashtext('urbangrid_development_integration_test'))`);
    const [active] = await tx.select().from(outbox).where(and(
      eq(outbox.environment, "development"), eq(outbox.isIntegrationTest, true),
      inArray(outbox.status, ["pending", "processing", "failed"]),
    )).limit(1).for("update");
    if (active) return { created: false, eventId: active.eventId, bookingId: active.bookingId };
    const uuid = crypto.randomUUID(), submissionKey = `integration-test:${uuid}`;
    const [lead] = await tx.insert(leads).values({
      name: "UrbanGrid INTEGRATION TEST — NOT A CUSTOMER",
      email: `integration-test+${uuid}@example.invalid`, phone: null,
      message: "INTEGRATION TEST — synthetic Development fixture. No customer notifications.",
      leadSource: "integration_test", enquiryType: "integration_test", isRead: true,
      stage: "booked", submissionKey,
    }).returning();
    const price = calculateInspectionPrice("new-build-snagging", 1000);
    const [booking] = await tx.insert(bookings).values({
      leadId: lead.id, submissionKey, bookingReference: `UG-TEST-${uuid}`,
      service: "new-build-snagging", propertyType: "Apartment", areaHundredths: 100000,
      bedrooms: "2", project: "INTEGRATION TEST — DO NOT DISPATCH",
      location: "Synthetic Development test property — not a real address", emirate: "Dubai",
      inspectionDate: new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Dubai" })
        .format(new Date(Date.now() + 7 * 86400000)),
      timeWindow: "09:00–12:00", baseMinor: price.baseMinor, vatMinor: price.vatMinor,
      quoteTotalMinor: price.totalMinor, isIntegrationTest: true,
    }).returning();
    const event = bookingCreatedEvent(booking, lead, "development");
    event.data.booking.recordType = "integration_test";
    await tx.insert(outbox).values({ eventId: event.eventId, bookingId: booking.id,
      environment: "development", payload: event, isIntegrationTest: true });
    return { created: true, eventId: event.eventId, bookingId: booking.id };
  });
}

export async function cleanupOperationsTestRecord(eventId: string) {
  requireDevelopment();
  return db.transaction(async tx => {
    const [event] = await tx.select().from(outbox).where(and(
      eq(outbox.eventId, eventId), eq(outbox.environment, "development"),
      eq(outbox.isIntegrationTest, true),
    )).for("update");
    if (!event) throw new OperationsTestError(409, "Only synthetic Development events can be cleaned up.");
    if (event.status === "processing") throw new OperationsTestError(409, "Wait for the in-flight delivery to finish.");
    const [booking] = await tx.select().from(bookings).where(eq(bookings.id, event.bookingId)).for("update");
    const [lead] = booking ? await tx.select().from(leads).where(eq(leads.id, booking.leadId)).for("update") : [];
    if (!booking?.isIntegrationTest || !booking.submissionKey.startsWith("integration-test:") ||
        !booking.bookingReference.startsWith("UG-TEST-") || lead?.leadSource !== "integration_test" ||
        !lead.email.endsWith("@example.invalid") || lead.submissionKey !== booking.submissionKey ||
        event.payload.data.booking.recordType !== "integration_test") {
      throw new OperationsTestError(409, "Synthetic record safety checks failed.");
    }
    const related = await tx.select({ id: bookings.id }).from(bookings).where(eq(bookings.leadId, lead.id));
    const ledger = await tx.select({ id: payments.id }).from(payments).where(eq(payments.bookingId, booking.id));
    if (related.length !== 1 || ledger.length) throw new OperationsTestError(409, "Linked bookings or payments prevent safe cleanup.");
    await tx.delete(outbox).where(eq(outbox.eventId, eventId));
    await tx.delete(audit).where(eq(audit.bookingId, booking.id));
    await tx.delete(history).where(eq(history.leadId, lead.id));
    await tx.delete(bookings).where(eq(bookings.id, booking.id));
    await tx.delete(leads).where(eq(leads.id, lead.id));
    return { ok: true, eventId, receiverRecordsDeleted: false };
  });
}