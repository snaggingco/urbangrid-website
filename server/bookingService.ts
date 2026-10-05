import crypto from "node:crypto";
import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { db } from "./db";
import { inspectionBookings as bookings, inspectionPayments as payments, bookingAudit as audit, contactSubmissions as leads } from "@shared/schema";
import { adminBookingInputSchema, bookingInputSchema, externalPaymentSchema, type AdminBookingInput, type BookingInput, type BookingView } from "@shared/booking";
import { nonSalesSources } from "@shared/leads";
import { calculateInspectionPrice } from "@shared/inspectionPricing";
import { updateLeadInTransaction, type LeadTransaction } from "./leadPipeline";
import { ziina, type PaymentProvider, type ZiinaIntent } from "./ziina";
import { sendResidentialBookingEmail } from "./email";
import { syntheticBookingContact } from "./operationsMachineAuth";
import { bookingCreatedEvent } from "./operationsContract";
import { enqueueOperationsEvent } from "./operationsIntegration";
import { operationsLifecycle, operationsDeliveryOutbox } from "@shared/schema";

export class BookingError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}
export type BookingRow = typeof bookings.$inferSelect;
type PaymentRow = typeof payments.$inferSelect;
const cash = (rows: PaymentRow[]) => rows.reduce((sum, p) => sum + (p.metadata?.testMode ? 0 :
  p.status === "completed" ? p.amountMinor : p.status === "refunded" ? -p.amountMinor : 0), 0);
export function bookingAccessToken(booking: BookingRow) {
  if (!process.env.SESSION_SECRET) throw new Error("Session signing is not configured");
  return crypto.createHmac("sha256", process.env.SESSION_SECRET).update(`booking-access:${booking.id}:${booking.bookingReference}`).digest("hex");
}
export function accessMatches(booking: BookingRow, token: string) {
  if (!/^[a-f0-9]{64}$/.test(token)) return false;
  return crypto.timingSafeEqual(Buffer.from(token, "hex"), Buffer.from(bookingAccessToken(booking), "hex"));
}
export async function bookingByReference(reference: string) {
  const [row] = await db.select().from(bookings).where(eq(bookings.bookingReference, reference));
  if (!row) throw new BookingError("Booking not found", 404);
  return row;
}
async function lockedBooking(tx: LeadTransaction, id: number) {
  const [row] = await tx.select().from(bookings).where(eq(bookings.id, id)).for("update");
  if (!row) throw new BookingError("Booking not found", 404);
  return row;
}
async function auditEntry(tx: LeadTransaction, id: number, action: string, actor: string, details: Record<string, unknown>) {
  await tx.insert(audit).values({ bookingId: id, action, actor, details });
}
export async function createAdminInspectionBooking(raw: AdminBookingInput, actor: string) {
  const { existingLeadId, ...input } = adminBookingInputSchema.parse(raw);
  return createInspectionBooking(input, actor, existingLeadId);
}
export async function createInspectionBooking(raw: BookingInput, actor = "customer", existingLeadId?: number) {
  const synthetic = actor === "integration_smoke";
  if (existingLeadId && actor === "customer") throw new BookingError("Existing lead linking is staff-only", 403);
  const input = existingLeadId
    ? adminBookingInputSchema.parse({ ...raw, existingLeadId })
    : bookingInputSchema.parse(raw);
  if (synthetic && (process.env.NODE_ENV !== "production" || existingLeadId || !syntheticBookingContact(input))) {
    throw new BookingError("Authorized synthetic contact required", 403);
  }
  if (input.inspectionDate < new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Dubai" }).format(new Date())) {
    throw new BookingError("Preferred inspection date cannot be in the past");
  }
  const price = calculateInspectionPrice(input.service, input.areaSqft);
  const result = await db.transaction(async tx => {
    let inserted: typeof leads.$inferSelect | undefined;
    let lead: typeof leads.$inferSelect | undefined;
    if (existingLeadId) {
      [lead] = await tx.select().from(leads).where(eq(leads.id, existingLeadId)).for("update");
      if (!lead) throw new BookingError("Selected enquiry was not found", 404);
      if (nonSalesSources.some(source => source === lead!.leadSource) ||
          /^(Career application for |Broker Referral Application|Sample report download request)/i.test(lead.message)) {
        throw new BookingError("Select a sales enquiry, not a non-sales submission", 409);
      }
    } else {
      [inserted] = await tx.insert(leads).values({
        name: input.name, email: input.email, phone: input.phone, submissionKey: input.submissionKey,
        leadSource: synthetic ? "integration_test" : actor === "customer" ? "residential_booking" : "offline_booking",
        enquiryType: synthetic ? "integration_test" : input.service,
        attribution: input.attribution, message: `Residential inspection booking enquiry — ${input.project}`,
      }).onConflictDoNothing({ target: leads.submissionKey }).returning();
      [lead] = inserted ? [inserted] : await tx.select().from(leads).where(eq(leads.submissionKey, input.submissionKey)).for("update");
    }
    if (!lead || lead.email.toLowerCase() !== input.email.toLowerCase() || lead.name !== input.name) {
      throw new BookingError(existingLeadId
        ? "Booking contact must match the selected enquiry. Refresh its details before retrying."
        : "Submission key belongs to a different enquiry", 409);
    }
    const [existing] = await tx.select().from(bookings).where(eq(bookings.submissionKey, input.submissionKey));
    if (existing) {
      if (synthetic && !existing.isIntegrationTest) {
        throw new BookingError("Synthetic replay cannot use an ordinary booking", 409);
      }
      if (existing.leadId !== lead.id || existing.service !== input.service || existing.areaHundredths !== Math.round(input.areaSqft * 100) ||
          existing.project !== input.project || existing.inspectionDate !== input.inspectionDate ||
          existing.propertyType !== input.propertyType || existing.location !== input.location ||
          existing.emirate !== input.emirate || (existing.timeWindow || "") !== (input.timeWindow || "") ||
          (existing.bedrooms || "") !== (input.bedrooms || "")) {
        throw new BookingError("This booking was already saved. Start a new booking to change its details.", 409);
      }
      return { booking: existing, createdLead: false, createdBooking: false, leadId: lead.id };
    }
    const reference = `UG-${new Date().getUTCFullYear()}-${crypto.randomBytes(6).toString("hex").toUpperCase()}`;
    const [booking] = await tx.insert(bookings).values({
      leadId: lead.id, submissionKey: input.submissionKey, bookingReference: reference,
      service: input.service, propertyType: input.propertyType, areaHundredths: Math.round(input.areaSqft * 100),
      bedrooms: input.bedrooms, project: input.project, location: input.location, emirate: input.emirate,
      inspectionDate: input.inspectionDate, timeWindow: input.timeWindow,
      baseMinor: price.baseMinor, vatMinor: price.vatMinor, quoteTotalMinor: price.totalMinor,
      isIntegrationTest: synthetic,
      attribution: existingLeadId ? lead.attribution : input.attribution || lead.attribution,
    }).returning();
    if (!existingLeadId && ["new", "qualified"].includes(lead.stage)) await updateLeadInTransaction(tx, lead.id, {
      stage: "quoted", quoteValueMinor: price.totalMinor, note: `Calculated quote ${reference}` });
    await updateLeadInTransaction(tx, lead.id, { stage: !existingLeadId && lead.stage === "completed" ? "completed" : "booked",
      quoteValueMinor: price.totalMinor, quoteCurrency: "AED", bookingReference: reference,
      inspectionDate: input.inspectionDate, note: `Structured booking quote ${reference}` });
    await auditEntry(tx, booking.id, "booking_confirmed_without_payment", actor, {
      quoteTotalMinor: price.totalMinor, paymentTerms: "100% after inspection and before report release",
      ...(synthetic ? { isIntegrationTest: true } : {}) });
    if (existingLeadId) await auditEntry(tx, booking.id, "existing_enquiry_linked", actor, { leadId: lead.id });
    // Transactional outbox: neither booking nor event is visible to a delivery
    // worker until commit. No operations HTTP call runs in this transaction.
    const event = bookingCreatedEvent(booking, lead);
    if (synthetic) {
      event.data.booking.recordType = "integration_test";
      event.data.booking.sendEmail = false;
      event.data.booking.sendSms = false;
      event.data.booking.sendNotifications = false;
      event.data.booking.customer.phone = null;
    }
    await enqueueOperationsEvent(event, tx);
    return { booking, createdLead: Boolean(inserted), createdBooking: true, leadId: lead.id };
  });
  return result;
}

export async function bookingView(booking: BookingRow, provider: PaymentProvider = ziina, admin = false): Promise<BookingView> {
  const rows = await db.select().from(payments).where(eq(payments.bookingId, booking.id)).orderBy(desc(payments.id));
  const [lead] = await db.select().from(leads).where(eq(leads.id, booking.leadId));
  const collected = cash(rows);
  const [operation] = await db.select().from(operationsLifecycle).where(eq(operationsLifecycle.bookingId, booking.id));
  const [delivery] = await db.select().from(operationsDeliveryOutbox).where(eq(operationsDeliveryOutbox.bookingId, booking.id));
  return {
    id: booking.id, leadId: booking.leadId, bookingReference: booking.bookingReference,
    service: booking.service, propertyType: booking.propertyType, areaSqft: booking.areaHundredths / 100,
    bedrooms: booking.bedrooms, project: booking.project, location: booking.location, emirate: booking.emirate,
    inspectionDate: booking.inspectionDate, timeWindow: booking.timeWindow, status: booking.status, leadStage: lead.stage,
    baseMinor: booking.baseMinor, vatMinor: booking.vatMinor, quoteTotalMinor: booking.quoteTotalMinor,
    currency: booking.currency, cashCollectedMinor: collected,
    amountOutstandingMinor: Math.max(booking.quoteTotalMinor - collected, 0),
    paymentStatus: collected >= booking.quoteTotalMinor ? "paid" : rows[0]?.metadata?.testMode && rows[0]?.status === "completed" ? "test_completed" :
      rows[0]?.status === "completed" ? "part_paid" : rows[0]?.status || "unpaid",
    reportStatus: booking.inspectionCompletedAt && !["lost", "canceled"].includes(booking.status)
      ? collected >= booking.quoteTotalMinor ? "Ready for Release — payment cleared" : "Awaiting payment"
      : "Awaiting physical inspection",
    inspectionCompletedAt: booking.inspectionCompletedAt?.toISOString() || null,
    operations: { status: operation?.status || (delivery?.status === "delivered" ? "booked" : null), version: operation?.version || null,
      lastReconciledAt: booking.strataLastSyncAt?.toISOString() || null,
      ...(admin ? { identifiers: booking.strataIdentifiers || operation?.receiverIdentifiers || delivery?.receiverIdentifiers || null,
        errorCode: delivery?.reconcileErrorCode || null } : {}) },
    paymentSetup: !provider.enabled() ? "online payment setup pending" : provider.testMode() ? "test mode — no real money collected" : "active",
    payments: rows.map(p => ({ id: p.id, paymentType: p.paymentType, amountMinor: p.amountMinor,
      status: p.status, provider: p.provider, completedAt: p.completedAt?.toISOString() || null,
      verifiedOnline: p.provider === "ziina" && !p.metadata?.testMode && p.status === "completed" && Boolean(p.completedAt) })),
    ...(admin ? { leadSource: lead.leadSource, campaign: booking.attribution?.lastTouch.utm_campaign || booking.attribution?.firstTouch.utm_campaign,
      gclid: booking.attribution?.lastTouch.gclid || booking.attribution?.firstTouch.gclid } : {}),
  };
}

// Local reservation is committed BEFORE contacting Ziina. Retrying an ambiguous
// network failure reuses its operation UUID rather than creating another charge.
export async function createBookingPayment(id: number, type: "full", origin: string, provider: PaymentProvider = ziina) {
  if (!provider.enabled()) throw new BookingError("Online payment setup pending — your quote is saved", 503);
  const reservation = await db.transaction(async tx => {
    const booking = await lockedBooking(tx, id);
    if (booking.isIntegrationTest) throw new BookingError("Synthetic bookings cannot take payments", 409);
    if (["lost", "canceled"].includes(booking.status)) throw new BookingError("This booking is not accepting payments", 409);
    if (!booking.inspectionCompletedAt) throw new BookingError("Payment is due only after the physical inspection is completed", 409);
    const rows = await tx.select().from(payments).where(eq(payments.bookingId, id));
    const collected = cash(rows);
    const due = booking.quoteTotalMinor - collected;
    if (due <= 0) throw new BookingError("This payment is already covered", 409);
    const active = rows.find(p => p.provider === "ziina" && ["created", "pending"].includes(p.status));
    if (active) {
      if (active.paymentType !== type || active.amountMinor !== due) throw new BookingError("Verify the existing payment before creating another", 409);
      return { payment: active, booking };
    }
    const [payment] = await tx.insert(payments).values({ bookingId: id, leadId: booking.leadId,
      paymentType: type, amountMinor: due, operationId: crypto.randomUUID(), metadata: { testMode: provider.testMode() } }).returning();
    await auditEntry(tx, id, "payment_intent_reserved", "customer", { paymentId: payment.id, paymentType: type, amountMinor: due, testMode: provider.testMode() });
    return { payment, booking };
  });
  if (reservation.payment.providerIntentId && reservation.payment.redirectUrl) {
    return { redirectUrl: reservation.payment.redirectUrl, paymentId: reservation.payment.id };
  }
  const intent = await provider.create(reservation.payment.amountMinor, reservation.booking.bookingReference, reservation.payment.operationId, origin);
  validateIntent(intent, reservation.payment);
  if (!intent.redirect_url || !isZiinaCheckoutUrl(intent.redirect_url)) throw new BookingError("Ziina did not return a valid hosted checkout URL", 502);
  await db.transaction(async tx => {
    await lockedBooking(tx, id);
    const [current] = await tx.select().from(payments).where(eq(payments.id, reservation.payment.id)).for("update");
    if (current.providerIntentId && current.providerIntentId !== intent.id) throw new BookingError("Provider idempotency mismatch", 502);
    await tx.update(payments).set({ providerIntentId: intent.id, redirectUrl: intent.redirect_url,
      status: current.status === "completed" ? "completed" : "pending", updatedAt: new Date(),
      metadata: { ...current.metadata, providerStatus: intent.status, providerAccountId: intent.account_id || null } }).where(eq(payments.id, current.id));
    await auditEntry(tx, id, "payment_intent_created", "ziina", { paymentId: current.id, providerIntentId: intent.id });
  });
  return { redirectUrl: intent.redirect_url, paymentId: reservation.payment.id };
}
export function isZiinaCheckoutUrl(url: string) {
  const parsed = new URL(url);
  return parsed.protocol === "https:" && (parsed.hostname === "ziina.com" || parsed.hostname.endsWith(".ziina.com"));
}
function validateIntent(intent: ZiinaIntent, payment: PaymentRow) {
  if ((payment.providerIntentId && payment.providerIntentId !== intent.id) || intent.amount !== payment.amountMinor ||
      intent.currency_code !== payment.currency || (intent.operation_id && intent.operation_id !== payment.operationId) ||
      (payment.metadata?.providerAccountId && intent.account_id && payment.metadata.providerAccountId !== intent.account_id)) {
    throw new BookingError("Payment verification mismatch — no booking was confirmed", 502);
  }
}

export async function verifyBookingPayments(id: number, origin: string, provider: PaymentProvider = ziina,
  notify = sendResidentialBookingEmail) {
  const [currentBooking] = await db.select().from(bookings).where(eq(bookings.id, id));
  if (!currentBooking) throw new BookingError("Booking not found", 404);
  if (!currentBooking.inspectionCompletedAt) return bookingView(currentBooking, provider);
  const pending = await db.select().from(payments).where(and(eq(payments.bookingId, id), eq(payments.provider, "ziina"),
    inArray(payments.status, ["created", "pending"])));
  for (const payment of pending) {
    if (!payment.providerIntentId) continue;
    const intent = await provider.retrieve(payment.providerIntentId);
    validateIntent(intent, payment);
    await db.transaction(async tx => {
      const booking = await lockedBooking(tx, id);
      const [current] = await tx.select().from(payments).where(eq(payments.id, payment.id)).for("update");
      if (current.status === "completed") return;
      const status = intent.status === "completed" ? "completed" : intent.status === "failed" ? "failed" :
        intent.status === "canceled" ? "canceled" : "pending";
      const now = new Date();
      await tx.update(payments).set({ status, updatedAt: now, completedAt: status === "completed" ? now : null,
        metadata: { ...current.metadata, providerStatus: intent.status } }).where(eq(payments.id, current.id));
      await auditEntry(tx, id, "provider_payment_verified", "ziina", { paymentId: current.id, status, testMode: Boolean(current.metadata?.testMode) });
      await auditEntry(tx, id, "payment_clearance_updated", "ziina", { paymentId: current.id, status });
    });
  }
  await sendConfirmationOnce(id, origin, notify);
  const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
  return bookingView(booking, provider);
}
async function sendConfirmationOnce(id: number, origin: string, notify: typeof sendResidentialBookingEmail) {
  const payload = await db.transaction(async tx => {
    const booking = await lockedBooking(tx, id);
    if (booking.isIntegrationTest) return null;
    const rows = await tx.select().from(payments).where(eq(payments.bookingId, id));
    const paid = cash(rows);
    if (["lost", "canceled"].includes(booking.status) || booking.confirmationSentAt ||
        (booking.confirmationClaimedAt && Date.now() - booking.confirmationClaimedAt.getTime() < 300000)) return null;
    await tx.update(bookings).set({ confirmationClaimedAt: new Date() }).where(eq(bookings.id, id));
    const [lead] = await tx.select().from(leads).where(eq(leads.id, booking.leadId));
    return { booking, email: lead.email, paid, balanceUrl: `${origin}/booking-access/${booking.bookingReference}/${bookingAccessToken(booking)}` };
  });
  if (!payload) return;
  let sent = false;
  try { sent = await notify(payload); } catch { /* Explicit audit and retry below. */ }
  await db.transaction(async tx => {
    await lockedBooking(tx, id);
    await tx.update(bookings).set({ confirmationSentAt: sent ? new Date() : null, confirmationClaimedAt: null }).where(eq(bookings.id, id));
    await auditEntry(tx, id, sent ? "confirmation_email_sent" : "confirmation_email_failed", "notification", { retryable: !sent });
  });
}

export async function recordExternalPayment(id: number, raw: unknown, actor: string, origin: string, notify = sendResidentialBookingEmail) {
  const input = externalPaymentSchema.parse(raw);
  if (new Date(input.paidAt).getTime() > Date.now() + 300000) throw new BookingError("Payment date cannot be in the future");
  const operationId = crypto.createHash("sha256").update(`${input.provider}:${input.reference}`).digest("hex");
  await db.transaction(async tx => {
    const booking = await lockedBooking(tx, id);
    if (booking.isIntegrationTest) throw new BookingError("Synthetic bookings cannot take payments", 409);
    if (!booking.inspectionCompletedAt) throw new BookingError("Record payment only after the physical inspection is completed", 409);
    const [existing] = await tx.select().from(payments).where(eq(payments.operationId, operationId));
    if (existing) {
      if (existing.bookingId !== id || existing.amountMinor !== input.amountMinor || existing.paymentType !== input.paymentType ||
          existing.completedAt?.toISOString() !== new Date(input.paidAt).toISOString()) throw new BookingError("Payment reference was already recorded with different details", 409);
      return;
    }
    const rows = await tx.select().from(payments).where(eq(payments.bookingId, id));
    const collected = cash(rows);
    if (rows.some(p => p.provider === "ziina" && ["created", "pending"].includes(p.status))) throw new BookingError("Verify or cancel the active Ziina intent before recording an external payment", 409);
    if (input.paymentType === "refund") {
      if (input.amountMinor > collected) throw new BookingError("Refund exceeds recorded cash collected");
    } else {
      if (input.amountMinor > booking.quoteTotalMinor - collected) throw new BookingError("Payment exceeds outstanding quote total");
    }
    const [payment] = await tx.insert(payments).values({ bookingId: id, leadId: booking.leadId, provider: input.provider,
      operationId, paymentType: input.paymentType, amountMinor: input.amountMinor,
      status: input.paymentType === "refund" ? "refunded" : "completed",
      providerReference: input.reference, completedAt: new Date(input.paidAt),
      metadata: { providerNote: input.providerNote, recordedBy: actor } }).returning();
    await auditEntry(tx, id, "external_payment_recorded", actor, { paymentId: payment.id, ...input });
    await auditEntry(tx, id, "payment_clearance_updated", actor, { cashCollectedMinor: input.paymentType === "refund" ? collected - input.amountMinor : collected + input.amountMinor });
  });
  await sendConfirmationOnce(id, origin, notify);
}
export async function manualBookingStatus(id: number, status: "booked" | "completed" | "lost", note: string, actor: string) {
  await db.transaction(async tx => {
    const booking = await lockedBooking(tx, id);
    await updateLeadInTransaction(tx, booking.leadId, { stage: status, note,
      ...(status === "lost" ? { lostReason: note } : {}),
      quoteValueMinor: booking.quoteTotalMinor, bookingReference: booking.bookingReference, inspectionDate: booking.inspectionDate });
    await tx.update(bookings).set({ status, updatedAt: new Date(),
      ...(status === "completed" && !booking.inspectionCompletedAt ? { inspectionCompletedAt: new Date() } : {}) }).where(eq(bookings.id, id));
    await auditEntry(tx, id, "manual_status_changed", actor, { previous: booking.status, status, note, doesNotRecordCash: true });
  });
}
export async function sendBookingConfirmation(id: number, origin: string, notify = sendResidentialBookingEmail) {
  return sendConfirmationOnce(id, origin, notify);
}
export async function bookingAuditHistory(id: number) {
  return db.select().from(audit).where(eq(audit.bookingId, id)).orderBy(desc(audit.id));
}