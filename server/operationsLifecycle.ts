import crypto from "node:crypto";
import { and, eq, isNull, lte, ne, or, sql } from "drizzle-orm";
import type { Express, RequestHandler } from "express";
import { db } from "./db";
import { inspectionBookings as bookings, operationsDeliveryOutbox as outbox,
  operationsLifecycle as lifecycle, operationsLifecycleEvents as receipts, bookingAudit } from "@shared/schema";
import { lifecycleSchema, lifecycleRank, normalizeLifecycleStatus, type LifecycleSnapshot } from "@shared/operationsLifecycle";
import { operationsEndpoint, operationsEnvironment, validOperationsKey } from "./operationsContract";
import { extractReceiverIdentifiers, readOperationsResponse } from "./operationsTransport";
import { normalizeStatusResponse } from "./operationsStatusContract";

export class LifecycleError extends Error {
  constructor(public code: string, public status = 409) { super(code); }
}

export function statusEndpoint() {
  return operationsEndpoint(process.env.URBANGRID_OPERATIONS_STATUS_URL);
}

export async function applyLifecycleSnapshot(raw: unknown) {
  const event = lifecycleSchema.parse(raw);
  if (event.environment !== operationsEnvironment()) throw new LifecycleError("ENVIRONMENT_MISMATCH", 400);
  if (new Date(event.occurredAt).getTime() > Date.now() + 300_000) throw new LifecycleError("FUTURE_EVENT", 400);
  const identifiers = extractReceiverIdentifiers({ identifiers: event.identifiers });
  if (event.identifiers && Object.keys(event.identifiers).length !== Object.keys(identifiers || {}).length) {
    throw new LifecycleError("INVALID_IDENTIFIERS", 400);
  }
  return db.transaction(async tx => {
    const [booking] = await tx.select().from(bookings).where(eq(bookings.id, event.bookingId)).for("update");
    if (!booking || booking.bookingReference !== event.bookingReference) throw new LifecycleError("BOOKING_IDENTITY_MISMATCH", 404);
    const [delivery] = await tx.select().from(outbox).where(and(eq(outbox.bookingId, booking.id),
      eq(outbox.environment, event.environment)));
    if (!delivery) throw new LifecycleError("BOOKING_NOT_INTEGRATED", 404);
    if (event.bookingReference.startsWith("UG-TEST-") &&
        (event.environment !== "development" || !booking.isIntegrationTest || !delivery.isIntegrationTest ||
         delivery.payload.data.booking.recordType !== "integration_test")) {
      throw new LifecycleError("TEST_IDENTITY_MISMATCH", 400);
    }
    const [previous] = await tx.select().from(lifecycle).where(eq(lifecycle.bookingId, booking.id));
    const payloadHash = crypto.createHash("sha256").update(JSON.stringify(event)).digest("hex");
    const [receipt] = await tx.insert(receipts).values({ eventId: event.eventId, bookingId: booking.id, payloadHash })
      .onConflictDoNothing().returning();
    if (!receipt) {
      const [old] = await tx.select().from(receipts).where(eq(receipts.eventId, event.eventId));
      if (old?.bookingId !== booking.id || old.payloadHash !== payloadHash) throw new LifecycleError("EVENT_ID_CONFLICT");
      return { applied: false, reason: "duplicate" };
    }
    if (previous && (event.version < previous.version ||
        (event.version === previous.version && event.eventId === previous.eventId && event.status === previous.status))) {
      return { applied: false, reason: "duplicate_or_stale" };
    }
    if (previous && (event.version === previous.version || lifecycleRank(event.status) < lifecycleRank(previous.status))) {
      throw new LifecycleError("STATUS_REVISION_CONFLICT");
    }
    const mapped = { ...(delivery.receiverIdentifiers || {}), ...(booking.strataIdentifiers || {}), ...(previous?.receiverIdentifiers || {}) };
    for (const [kind, id] of Object.entries(identifiers || {})) {
      const old = mapped[kind as keyof typeof mapped];
      if (old && old !== id) throw new LifecycleError("STRATA_MAPPING_CONFLICT");
    }
    Object.assign(mapped, identifiers);
    const value = { bookingId: booking.id, environment: event.environment, status: normalizeLifecycleStatus(event.status),
      version: event.version, eventId: event.eventId, occurredAt: new Date(event.occurredAt),
      receiverIdentifiers: mapped, updatedAt: new Date() };
    await tx.insert(lifecycle).values(value).onConflictDoUpdate({ target: lifecycle.bookingId, set: value });
    await tx.update(outbox).set({ receiverIdentifiers: mapped }).where(eq(outbox.eventId, delivery.eventId));
    await tx.update(bookings).set({ strataIdentifiers: mapped, strataLastSyncAt: new Date() })
      .where(eq(bookings.id, booking.id));
    // Operations completion can unlock the EXISTING payment gate. It never
    // records money, changes quote/lead stage or publishes/releases a report.
    if (lifecycleRank(event.status) >= lifecycleRank("inspection_completed") &&
        !booking.inspectionCompletedAt && !["lost", "canceled", "cancelled"].includes(booking.status)) {
      await tx.update(bookings).set({ inspectionCompletedAt: new Date(event.occurredAt), updatedAt: new Date() })
        .where(eq(bookings.id, booking.id));
    }
    await tx.insert(bookingAudit).values({ bookingId: booking.id, action: "strata_lifecycle_reconciled",
      actor: "strata-surveyor", details: { eventId: event.eventId, status: event.status, version: event.version } });
    return { applied: true, status: event.status };
  });
}

export async function fetchLifecycleSnapshot(
  endpoint: string, key: string,
  identity: { bookingId: number; bookingReference: string; eventId: string },
  transport: typeof fetch = fetch,
): Promise<LifecycleSnapshot> {
  const url = new URL(endpoint);
  for (const [name, value] of Object.entries({ ...identity, country: "AE",
    source: "urbangrid", environment: operationsEnvironment() })) url.searchParams.set(name, String(value));
  const response = await transport(url.toString(), { method: "GET", redirect: "error",
    signal: AbortSignal.timeout(10_000), headers: { Accept: "application/json", "x-urbangrid-key": key } });
  if (!response.ok) { await response.body?.cancel(); throw new LifecycleError(`HTTP_${response.status}`, 502); }
   const snapshot = normalizeStatusResponse(await readOperationsResponse(response), identity, operationsEnvironment());
  if (snapshot.bookingId !== identity.bookingId || snapshot.bookingReference !== identity.bookingReference ||
      snapshot.environment !== operationsEnvironment()) throw new LifecycleError("RECEIVER_IDENTITY_MISMATCH", 502);
  return snapshot;
}

export async function reconcileBooking(bookingId: number, transport: typeof fetch = fetch) {
  const endpoint = statusEndpoint();
  const key = process.env.URBANGRID_NETWORK_INTEGRATION_KEY;
  if (!endpoint || !validOperationsKey(key)) throw new LifecycleError("STATUS_ENDPOINT_NOT_CONFIGURED", 503);
  const [row] = await db.select().from(outbox).where(and(eq(outbox.bookingId, bookingId),
    eq(outbox.environment, operationsEnvironment()), eq(outbox.status, "delivered")));
  if (!row) throw new LifecycleError("BOOKING_NOT_DELIVERED", 409);
  const identity = { bookingId, bookingReference: row.payload.data.booking.bookingReference, eventId: row.eventId };
  try {
    const result = await applyLifecycleSnapshot(await fetchLifecycleSnapshot(endpoint, key, identity, transport));
    await db.transaction(async tx => {
      await tx.select({ id: bookings.id }).from(bookings).where(eq(bookings.id, bookingId)).for("update");
      await tx.update(bookings).set({ strataLastSyncAt: new Date() }).where(eq(bookings.id, bookingId));
      await tx.update(outbox).set({ lastReconcileAt: new Date(), reconcileErrorCode: null })
        .where(eq(outbox.eventId, row.eventId));
    });
    return result;
  } catch (error) {
    await db.update(outbox).set({ lastReconcileAt: new Date(),
      reconcileErrorCode: error instanceof LifecycleError ? error.code : "STATUS_UNAVAILABLE_OR_INVALID" })
      .where(eq(outbox.eventId, row.eventId));
    throw error;
  }
}

export async function runReconciliationCycle(batchSize = 10) {
  if (!statusEndpoint() || !validOperationsKey(process.env.URBANGRID_NETWORK_INTEGRATION_KEY)) return;
  for (let n = 0; n < batchSize; n++) {
    const row = await db.transaction(async tx => {
      const now = new Date();
      const [candidate] = await tx.select({ eventId: outbox.eventId, bookingId: outbox.bookingId })
        .from(outbox).leftJoin(lifecycle, eq(lifecycle.bookingId, outbox.bookingId))
        .where(and(eq(outbox.environment, operationsEnvironment()), eq(outbox.status, "delivered"),
          eq(outbox.isIntegrationTest, false), lte(outbox.nextReconcileAt, now),
          or(isNull(outbox.leaseExpiresAt), lte(outbox.leaseExpiresAt, now)),
          or(isNull(lifecycle.status), ne(lifecycle.status, "report_released"))))
        .orderBy(outbox.nextReconcileAt).limit(1).for("update", { of: outbox, skipLocked: true });
      if (!candidate) return null;
      const token = crypto.randomUUID();
      await tx.update(outbox).set({ leaseToken: token, leaseExpiresAt: new Date(now.getTime() + 60_000),
        nextReconcileAt: new Date(now.getTime() + 60_000) }).where(eq(outbox.eventId, candidate.eventId));
      return { ...candidate, token };
    });
    if (!row) break;
    let errorCode: string | null = null;
    try { await reconcileBooking(row.bookingId); }
    catch (error) { errorCode = error instanceof LifecycleError ? error.code : "STATUS_UNAVAILABLE_OR_INVALID"; }
    await db.update(outbox).set({ leaseToken: null, leaseExpiresAt: null, lastReconcileAt: new Date(),
      reconcileErrorCode: errorCode, nextReconcileAt: new Date(Date.now() + (errorCode ? 300_000 : 60_000)) })
      .where(and(eq(outbox.eventId, row.eventId), eq(outbox.leaseToken, row.token)));
  }
}

export function registerLifecycleRoutes(app: Express, admin: RequestHandler, csrf: RequestHandler) {
  const failure = (res: import("express").Response, error: unknown) =>
    res.status(error instanceof LifecycleError ? error.status : 400)
      .json({ message: error instanceof LifecycleError ? error.code : "INVALID_LIFECYCLE_UPDATE" });
  app.post("/api/admin/integrations/operations/reconcile/:bookingId", admin, csrf, async (req, res) => {
    res.set("Cache-Control", "no-store");
    try {
      const id = Number(req.params.bookingId);
      if (!Number.isSafeInteger(id) || id < 1) throw new LifecycleError("INVALID_BOOKING_ID", 400);
      res.json(await reconcileBooking(id));
    } catch (error) { failure(res, error); }
  });
  app.post("/api/integrations/strata/lifecycle", async (req, res) => {
    res.set("Cache-Control", "no-store");
    const key = process.env.URBANGRID_NETWORK_INTEGRATION_KEY || "";
    const supplied = req.get("x-urbangrid-key") || "";
    if (!validOperationsKey(key) || supplied.length !== key.length || !/^[\x21-\x7e]+$/.test(supplied) ||
        !crypto.timingSafeEqual(Buffer.from(key), Buffer.from(supplied))) {
      return res.status(401).json({ message: "UNAUTHORIZED" });
    }
    try { res.json(await applyLifecycleSnapshot(req.body)); }
    catch (error) { failure(res, error); }
  });
}