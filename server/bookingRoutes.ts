import type { Express, Request, RequestHandler } from "express";
import crypto from "node:crypto";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { inspectionBookings, inspectionPayments } from "@shared/schema";
import { calendarDate } from "@shared/leads";
import { bookingInputSchema } from "@shared/booking";
import { BookingError, bookingByReference, bookingView, createInspectionBooking, createAdminInspectionBooking, createBookingPayment,
  verifyBookingPayments, recordExternalPayment, manualBookingStatus, bookingAuditHistory,
  bookingAccessToken, accessMatches, sendBookingConfirmation } from "./bookingService";
import { ziina, verifyZiinaSignature, ziinaWebhookIps } from "./ziina";
import { bookingReport } from "./bookingReporting";
import { sendResidentialBookingEmail } from "./email";
import { registerOperationsIntegrationRoutes } from "./operationsIntegration";
import { operationsMachineAuthorized, syntheticBookingContact } from "./operationsMachineAuth";
declare module "express-session" {
  interface SessionData { bookingCsrf?: string; bookingReferences?: string[];
    pendingResidentialLead?: { submissionKey: string; email: string };
    bookingSubmissionAliases?: Record<string, string>;
  }
}
const requests = new Map<string, { count: number; expires: number }>();
const limit: RequestHandler = (req, res, next) => {
  const key = crypto.createHash("sha256").update(req.ip || "unknown").digest("hex");
  const now = Date.now();
  requests.forEach((v, k) => { if (v.expires <= now) requests.delete(k); });
  if (requests.size >= 10000 && !requests.has(key)) return res.status(429).json({ message: "Please try again later" });
  const bucket = requests.get(key) || { count: 0, expires: now + 600000 };
  bucket.count++; requests.set(key, bucket);
  if (bucket.count > 40) return res.status(429).json({ message: "Too many booking/payment requests. Please wait ten minutes." });
  next();
};
function origin(req: Request) {
  const value = req.get("origin");
  if (!value) throw new BookingError("A same-origin browser request is required", 403);
  const parsed = new URL(value);
  if (parsed.host !== req.get("host") || !["https:", ...(process.env.NODE_ENV !== "production" ? ["http:"] : [])].includes(parsed.protocol)) {
    throw new BookingError("Cross-origin request rejected", 403);
  }
  return parsed.origin;
}
const csrf: RequestHandler = (req, res, next) => {
  try {
    origin(req);
    const supplied = req.get("x-csrf-token") || "";
    const expected = req.session.bookingCsrf || "";
    if (!expected || supplied.length !== expected.length ||
      !crypto.timingSafeEqual(Buffer.from(supplied), Buffer.from(expected))) throw new BookingError("Refresh the page before submitting", 403);
    next();
  } catch { res.status(403).json({ message: "Same-origin request and valid CSRF token required" }); }
};
const grant = (req: Request, reference: string) => {
  req.session.bookingReferences = Array.from(new Set([...(req.session.bookingReferences || []), reference])).slice(-20);
};
async function owned(req: Request) {
  const reference = z.string().regex(/^UG-\d{4}-[A-F0-9]{12}$/).parse(req.params.reference);
  if (!req.session.bookingReferences?.includes(reference)) throw new BookingError("Use your private booking link to access this booking", 403);
  return bookingByReference(reference);
}
const actor = (req: Request) => `admin:${String((req.user as any)?.claims?.sub || (req.user as any)?.id || "staff")}`.slice(0, 100);
function failure(res: any, err: unknown) {
  if (err instanceof z.ZodError) return res.status(400).json({ message: "Check the booking fields", errors: err.flatten().fieldErrors });
  if (err instanceof BookingError) return res.status(err.status).json({ message: err.message });
  console.error("[Booking] operation failed:", err instanceof Error ? err.name : "UnknownError");
  return res.status(502).json({ message: "This operation could not be verified. Your booking is saved; please retry or contact UrbanGrid." });
}
export function registerBookingRoutes(app: Express, admin: RequestHandler, options: { notify?: typeof sendResidentialBookingEmail } = {}) {
  registerOperationsIntegrationRoutes(app, admin, csrf);
  app.get("/api/bookings/config", (req, res) => {
    req.session.bookingCsrf ||= crypto.randomBytes(32).toString("hex");
    res.set("Cache-Control", "no-store").json({ csrfToken: req.session.bookingCsrf,
      onlinePaymentEnabled: ziina.enabled(), testMode: ziina.testMode(), webhookEnabled: Boolean(process.env.ZIINA_WEBHOOK_SECRET) });
  });
  app.post("/api/bookings", limit, csrf, async (req, res) => {
    try {
      const input = bookingInputSchema.parse(req.body);
      const synthetic = req.get("x-urbangrid-synthetic-booking") === "1";
      if (synthetic && (!operationsMachineAuthorized(req) || !syntheticBookingContact(input))) {
        res.status(403).json({ message: "Authorized synthetic contact required" }); return;
      }
      const pending = req.session.pendingResidentialLead;
      req.session.bookingSubmissionAliases ||= {};
      const alias = req.session.bookingSubmissionAliases[input.submissionKey];
      if (alias) input.submissionKey = alias;
      else if (pending && pending.email.toLowerCase() === input.email.toLowerCase()) {
        req.session.bookingSubmissionAliases[input.submissionKey] = pending.submissionKey;
        input.submissionKey = pending.submissionKey;
      }
      const result = await createInspectionBooking(input, synthetic ? "integration_smoke" : "customer");
      delete req.session.pendingResidentialLead;
      grant(req, result.booking.bookingReference);
      if (!synthetic) await sendBookingConfirmation(result.booking.id, origin(req), options.notify);
      res.set("Cache-Control", "no-store").status(result.createdLead ? 201 : 200)
        .json({ ...result, booking: await bookingView(result.booking) });
    } catch (err) { failure(res, err); }
  });
  app.get("/api/bookings/:reference", async (req, res) => {
    try { res.set("Cache-Control", "no-store").json({ booking: await bookingView(await owned(req)) }); }
    catch (err) { failure(res, err); }
  });
  app.post("/api/bookings/:reference/pay", limit, csrf, async (req, res) => {
    try {
      const { paymentType } = z.object({ paymentType: z.enum(["full"]) }).strict().parse(req.body);
      res.set("Cache-Control", "no-store").json(await createBookingPayment((await owned(req)).id, paymentType, origin(req)));
    } catch (err) { failure(res, err); }
  });
  app.post("/api/bookings/:reference/verify", limit, csrf, async (req, res) => {
    try {
      z.object({}).strict().parse(req.body);
      res.set("Cache-Control", "no-store").json({ booking: await verifyBookingPayments((await owned(req)).id, origin(req), ziina, options.notify) });
    } catch (err) { failure(res, err); }
  });
  // Capability link terminates in a server redirect BEFORE any HTML, GTM, or
  // third-party script loads. The customer API uses an HttpOnly session cookie.
  app.get("/booking-access/:reference/:token", async (req, res) => {
    res.set("Cache-Control", "no-store").set("Referrer-Policy", "no-referrer").set("X-Robots-Tag", "noindex, nofollow");
    try {
      const booking = await bookingByReference(req.params.reference);
      if (!accessMatches(booking, req.params.token)) throw new BookingError("Invalid private booking link", 403);
      grant(req, booking.bookingReference);
      req.session.save(err => {
        if (err) return res.status(500).send("Could not open booking");
        res.redirect(303, `/book-inspection/return?booking=${encodeURIComponent(booking.bookingReference)}`);
      });
    } catch (err) { failure(res, err); }
  });
  app.get("/api/admin/bookings", admin, async (req, res) => {
    try {
      const filters = z.object({ from: calendarDate.optional(), to: calendarDate.optional(),
        source: z.string().trim().min(1).max(100).optional() })
        .refine(v => !v.from || !v.to || v.from <= v.to).parse(req.query);
      res.set("Cache-Control", "no-store").json(await bookingReport(filters));
    } catch (err) { failure(res, err); }
  });
  app.post("/api/admin/bookings", admin, limit, csrf, async (req, res) => {
    try {
      const result = await createAdminInspectionBooking(req.body, actor(req));
      await sendBookingConfirmation(result.booking.id, origin(req), options.notify);
      res.json({ ...result, booking: await bookingView(result.booking, ziina, true) });
    } catch (err) { failure(res, err); }
  });
  app.get("/api/admin/bookings/:id/audit", admin, async (req, res) => {
    try { res.set("Cache-Control", "no-store").json({ audit: await bookingAuditHistory(z.coerce.number().int().positive().parse(req.params.id)) }); }
    catch (err) { failure(res, err); }
  });
  app.post("/api/admin/bookings/:id/action", admin, csrf, async (req, res) => {
    try {
      const id = z.coerce.number().int().positive().parse(req.params.id);
      const input = z.object({ status: z.enum(["booked", "completed", "lost"]),
        note: z.string().trim().min(3).max(1000).refine(v => !/[<>]/.test(v)) }).strict().parse(req.body);
      await manualBookingStatus(id, input.status, input.note, actor(req));
      res.json({ ok: true });
    } catch (err) { failure(res, err); }
  });
  app.post("/api/admin/bookings/:id/external-payment", admin, csrf, async (req, res) => {
    try { await recordExternalPayment(z.coerce.number().int().positive().parse(req.params.id), req.body, actor(req), origin(req), options.notify); res.json({ ok: true }); }
    catch (err) { failure(res, err); }
  });
  app.post("/api/admin/bookings/:id/access-link", admin, csrf, async (req, res) => {
    try {
      const [booking] = await db.select().from(inspectionBookings).where(eq(inspectionBookings.id, z.coerce.number().int().positive().parse(req.params.id)));
      if (!booking) throw new BookingError("Booking not found", 404);
      res.set("Cache-Control", "no-store").json({ url: `${origin(req)}/booking-access/${booking.bookingReference}/${bookingAccessToken(booking)}` });
    } catch (err) { failure(res, err); }
  });
  app.post("/api/admin/bookings/:id/request-payment", admin, limit, csrf, async (req, res) => {
    try {
      z.object({}).strict().parse(req.body);
      const id = z.coerce.number().int().positive().parse(req.params.id);
      const result = await createBookingPayment(id, "full", origin(req));
      const [booking] = await db.select().from(inspectionBookings).where(eq(inspectionBookings.id, id));
      res.json({ ...result, accessUrl: `${origin(req)}/booking-access/${booking.bookingReference}/${bookingAccessToken(booking)}` });
    } catch (err) { failure(res, err); }
  });
  app.post("/api/ziina/webhook", async (req, res) => {
    const secret = process.env.ZIINA_WEBHOOK_SECRET;
    if (!secret) return res.status(503).json({ message: "Verified Ziina webhook processing is not configured" });
    const raw = (req as Request & { rawBody?: Buffer }).rawBody;
    const ip = (req.ip || "").replace(/^::ffff:/, "");
    if (!raw || !ziinaWebhookIps.includes(ip) || !verifyZiinaSignature(raw, req.get("x-hmac-signature") || "", secret)) {
      return res.status(401).json({ message: "Unverified webhook rejected" });
    }
    try {
      const payload = z.object({ event: z.string(), data: z.object({ id: z.string() }).passthrough() }).parse(req.body);
      if (payload.event !== "payment_intent.status.updated") return res.json({ ignored: true });
      const [payment] = await db.select().from(inspectionPayments).where(eq(inspectionPayments.providerIntentId, payload.data.id));
      if (!payment) return res.status(404).json({ message: "Payment intent not found" });
      // Signed payload is notification only: authoritative GET still required.
      await verifyBookingPayments(payment.bookingId, process.env.BOOKING_PUBLIC_BASE_URL || "https://urbangrid.ae");
      res.json({ received: true });
    } catch (err) { failure(res, err); }
  });
}