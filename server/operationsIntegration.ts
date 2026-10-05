import crypto from "node:crypto";
import type { Express, RequestHandler } from "express";
import { z } from "zod";
import { and, count, desc, eq, gt, lte, or, sql } from "drizzle-orm";
import { db } from "./db";
import { operationsDeliveryOutbox as outbox, inspectionBookings as bookings, operationsIntegrationChecks } from "@shared/schema";
import type { BookingCreatedOperationsEvent } from "@shared/operationsIntegration";
import { operationsEndpoint, operationsEnvironment, validOperationsKey as validKey } from "./operationsContract";
import { sendOperationsEvent } from "./operationsTransport";
import { registerLifecycleRoutes, runReconciliationCycle, statusEndpoint } from "./operationsLifecycle";
import { registerOperationsProductionRoutes } from "./operationsProductionRoutes";
import { operationsLifecycle as lifecycle } from "@shared/schema";
import { cleanupOperationsTestRecord, createOperationsTestRecord, developmentTestsAvailable, OperationsTestError } from "./operationsTestRecords";

const POLL_MS = 20_000;
const LEASE_MS = 60_000;
let workerRunning = false;
let lastWorkerTickAt: string | null = null;

function deliveryConfig() {
  const endpoint = operationsEndpoint(process.env.URBANGRID_OPERATIONS_INTEGRATION_URL);
  const key = process.env.URBANGRID_NETWORK_INTEGRATION_KEY;
  return endpoint && key && validKey(key) ? { endpoint, key } : null;
}

export async function enqueueOperationsEvent(
  event: BookingCreatedOperationsEvent,
  executor: Pick<typeof db, "insert"> = db,
) {
  await executor.insert(outbox).values({
    eventId: event.eventId, bookingId: event.data.booking.id,
    environment: event.environment, payload: event,
    isIntegrationTest: event.data.booking.recordType === "integration_test",
  }).onConflictDoNothing({ target: outbox.eventId });
}

async function claimDelivery() {
  const now = new Date();
  return db.transaction(async tx => {
    const [row] = await tx.select().from(outbox).where(and(
      eq(outbox.environment, operationsEnvironment()), lte(outbox.nextAttemptAt, now),
      or(eq(outbox.status, "pending"), eq(outbox.status, "failed"),
        and(eq(outbox.status, "processing"), lte(outbox.leaseExpiresAt, now))),
    )).orderBy(outbox.nextAttemptAt, outbox.eventId).limit(1).for("update", { skipLocked: true });
    if (!row) return null;
    const [claimed] = await tx.update(outbox).set({
      status: "processing", attempts: row.attempts + 1,
      leaseToken: crypto.randomUUID(), leaseExpiresAt: new Date(now.getTime() + LEASE_MS),
      lastAttemptAt: now, lastHttpStatus: null, lastErrorCode: null, updatedAt: now,
    }).where(eq(outbox.eventId, row.eventId)).returning();
    return claimed;
  });
}

export function operationsRetryDelay(attempts: number) {
  // Retain failures indefinitely; retry with capped exponential backoff/jitter.
  return Math.min(3_600_000, 30_000 * 2 ** Math.min(Math.max(attempts - 1, 0), 7)) +
    crypto.randomInt(0, 5_001);
}

export async function runOperationsDeliveryCycle(options: {
  config?: { endpoint: string; key: string };
  send?: typeof sendOperationsEvent;
  batchSize?: number;
} = {}) {
  const config = options.config ?? deliveryConfig();
  if (!config) return; // Persisted queue remains pending until securely configured.
  for (let n = 0; n < (options.batchSize ?? 10); n++) {
    const row = await claimDelivery();
    if (!row) break;
    const result = await (options.send ?? sendOperationsEvent)(config.endpoint, config.key, row.payload);
    const now = new Date();
    await db.transaction(async tx => {
      // Same booking-first lock order as lifecycle callbacks. A stale lease
      // cannot write booking identifiers after another worker takes ownership.
      await tx.select({ id: bookings.id }).from(bookings).where(eq(bookings.id, row.bookingId)).for("update");
      const [acknowledged] = await tx.update(outbox).set({
      status: result.ok ? "delivered" : "failed", deliveredAt: result.ok ? now : null,
      lastHttpStatus: result.httpStatus, lastErrorCode: result.errorCode,
      // Never erase mappings if an acknowledgment has no IDs. A callback may
      // have committed mappings while this HTTP request was in flight.
      ...(result.ok && result.receiverIdentifiers ? { receiverIdentifiers:
        sql`(${JSON.stringify(result.receiverIdentifiers)}::jsonb || coalesce(${outbox.receiverIdentifiers}, '{}'::jsonb))` } : {}),
      ...(!result.ok ? { lastFailureAt: now, lastFailureCode: result.errorCode,
        lastFailureHttpStatus: result.httpStatus } : {}),
      nextAttemptAt: result.ok ? now : new Date(now.getTime() + operationsRetryDelay(row.attempts)),
      leaseToken: null, leaseExpiresAt: null, updatedAt: now,
      }).where(and(eq(outbox.eventId, row.eventId), eq(outbox.leaseToken, row.leaseToken!))).returning();
      if (acknowledged && result.ok) {
        await tx.update(bookings).set({
          strataIdentifiers: sql`(${JSON.stringify(acknowledged.receiverIdentifiers || {})}::jsonb || coalesce(${bookings.strataIdentifiers}, '{}'::jsonb))`,
          strataLastSyncAt: now,
        }).where(eq(bookings.id, row.bookingId));
      }
    });
  }
}

export function startOperationsDeliveryWorker() {
  if (workerRunning) return;
  workerRunning = true;
  let busy = false;
  const tick = async () => {
    if (busy) return;
    busy = true;
    try {
      await runOperationsDeliveryCycle();
      lastWorkerTickAt = new Date().toISOString();
    } catch {
      // Never log thrown messages, response content, payloads or secrets.
      console.warn("[Operations] delivery cycle deferred; committed events retained.");
    } finally { busy = false; }
  };
  const timer = setInterval(() => void tick(), POLL_MS);
  timer.unref();
  void tick();
  // Independent loop: a slow status receiver cannot stall booking delivery.
  let reconciling = false;
  const reconcileTick = async () => {
    if (reconciling) return;
    reconciling = true;
    try { await runReconciliationCycle(); }
    catch { console.warn("[Operations] reconciliation deferred; lifecycle retained."); }
    finally { reconciling = false; }
  };
  const reconcileTimer = setInterval(() => void reconcileTick(), 60_000);
  reconcileTimer.unref();
  void reconcileTick();
}

export async function operationsIntegrationHealth() {
  const key = process.env.URBANGRID_NETWORK_INTEGRATION_KEY;
  const endpoint = operationsEndpoint(process.env.URBANGRID_OPERATIONS_INTEGRATION_URL);
  const rows = await db.select({ status: outbox.status, total: count() }).from(outbox)
    .where(eq(outbox.environment, operationsEnvironment())).groupBy(outbox.status);
  const totals = Object.fromEntries(rows.map(row => [row.status, row.total]));
  const [verified] = operationsEnvironment() === "development"
    ? await db.select().from(operationsIntegrationChecks).where(eq(operationsIntegrationChecks.environment, "development")) : [];
  const [reconciliationFailures] = await db.select({ total: count() }).from(outbox)
    .where(and(eq(outbox.environment, operationsEnvironment()), sql`${outbox.reconcileErrorCode} is not null`));
  const [last] = await db.select({
    eventId: outbox.eventId, status: outbox.status, attempts: outbox.attempts,
    lastAttemptAt: outbox.lastAttemptAt, httpStatus: outbox.lastHttpStatus,
    errorCode: outbox.lastErrorCode, nextAttemptAt: outbox.nextAttemptAt,
    deliveredAt: outbox.deliveredAt,
    lastFailureAt: outbox.lastFailureAt, lastFailureCode: outbox.lastFailureCode,
    lastFailureHttpStatus: outbox.lastFailureHttpStatus,
    isIntegrationTest: outbox.isIntegrationTest, receiverIdentifiers: outbox.receiverIdentifiers,
  }).from(outbox).where(and(eq(outbox.environment, operationsEnvironment()), gt(outbox.attempts, 0)))
    .orderBy(desc(outbox.lastAttemptAt), desc(outbox.eventId)).limit(1);
  return {
    integration: "strata-surveyor", schemaVersion: 1, environment: operationsEnvironment(),
    configured: Boolean(deliveryConfig()), endpoint,
    statusReconciliationConfigured: Boolean(statusEndpoint() && validKey(key)),
    developmentVerification: verified ? { checkedAt: verified.checkedAt.toISOString(),
      healthy: Boolean(deliveryConfig() && statusEndpoint() === verified.evidence.statusEndpoint &&
        endpoint === verified.evidence.creationEndpoint && key &&
        crypto.createHash("sha256").update(key).digest("hex") === verified.evidence.keyFingerprint &&
        verified.evidence.duplicateConfirmed && !(totals.failed ?? 0) && !reconciliationFailures.total) } : null,
    configurationIssue: !endpoint ? "ENDPOINT_MISSING_OR_INVALID" : !key ? "INTEGRATION_KEY_MISSING" :
      !validKey(key) ? "INTEGRATION_KEY_INVALID" : null,
    keyConfigured: Boolean(key), keyFingerprint: key ? crypto.createHash("sha256").update(key).digest("hex") : null,
    counts: { pending: (totals.pending ?? 0) + (totals.processing ?? 0),
      failed: totals.failed ?? 0, delivered: totals.delivered ?? 0,
      processing: totals.processing ?? 0, awaitingEnqueue: 0 },
    lastDelivery: last ?? null, workerRunning, lastWorkerTickAt,
    retryPolicy: "Failed deliveries retry automatically with backoff; events are never discarded.",
    developmentTestsAvailable: developmentTestsAvailable(),
    events: await db.select({
      eventId: outbox.eventId, bookingId: outbox.bookingId,
      bookingReference: sql<string>`${outbox.payload}->'data'->'booking'->>'bookingReference'`,
      status: outbox.status, attempts: outbox.attempts, lastAttemptAt: outbox.lastAttemptAt,
      httpStatus: outbox.lastHttpStatus, errorCode: outbox.lastErrorCode, nextAttemptAt: outbox.nextAttemptAt,
      deliveredAt: outbox.deliveredAt, createdAt: outbox.createdAt,
      lastFailureAt: outbox.lastFailureAt, lastFailureCode: outbox.lastFailureCode,
      lastFailureHttpStatus: outbox.lastFailureHttpStatus,
      isIntegrationTest: outbox.isIntegrationTest, receiverIdentifiers: outbox.receiverIdentifiers,
      lifecycleStatus: lifecycle.status, lastReconcileAt: outbox.lastReconcileAt,
      lastSyncAt: bookings.strataLastSyncAt,
      reconcileErrorCode: outbox.reconcileErrorCode,
    }).from(outbox).leftJoin(lifecycle, eq(lifecycle.bookingId, outbox.bookingId))
      .leftJoin(bookings, eq(bookings.id, outbox.bookingId))
      .where(eq(outbox.environment, operationsEnvironment()))
      .orderBy(desc(outbox.createdAt), desc(outbox.eventId)).limit(100),
  };
}

export async function retryFailedOperationsEvent(eventId: string) {
  const [row] = await db.update(outbox).set({
    status: "pending", nextAttemptAt: new Date(), updatedAt: new Date(),
    leaseToken: null, leaseExpiresAt: null,
  }).where(and(eq(outbox.eventId, eventId), eq(outbox.environment, operationsEnvironment()),
    eq(outbox.status, "failed"))).returning({ eventId: outbox.eventId });
  return row;
}

export function registerOperationsIntegrationRoutes(app: Express, admin: RequestHandler, csrf: RequestHandler) {
  registerOperationsProductionRoutes(app, {
    deliver: () => runOperationsDeliveryCycle({ batchSize: 3 }),
    reconcile: () => runReconciliationCycle(3),
  });
  registerLifecycleRoutes(app, admin, csrf);
  const testFailure = (res: import("express").Response, error: unknown) => {
    if (error instanceof z.ZodError) return res.status(400).json({ message: "Invalid test request." });
    if (error instanceof OperationsTestError) return res.status(error.status).json({ message: error.message });
    return res.status(503).json({ message: "Development test action could not be completed." });
  };
  const developmentOnly: RequestHandler = (_req, res, next) =>
    developmentTestsAvailable() ? next() : res.status(404).json({ message: "Development tests are unavailable." });
  app.post("/api/admin/integrations/operations/test", admin, developmentOnly, csrf, async (req, res) => {
    res.set("Cache-Control", "no-store");
    try {
      z.object({}).strict().parse(req.body);
      if (!deliveryConfig()) return res.status(409).json({ message: "Configure the integration before sending a Development test." });
      res.status(202).json(await createOperationsTestRecord());
    } catch (error) { testFailure(res, error); }
  });
  app.post("/api/admin/integrations/operations/events/:eventId/cleanup", admin, developmentOnly, csrf, async (req, res) => {
    res.set("Cache-Control", "no-store");
    try {
      z.object({ confirm: z.literal(true) }).strict().parse(req.body);
      const id = z.string().max(160).regex(/^urbangrid\.development\.booking\.created\.v1\.\d+$/).parse(req.params.eventId);
      res.json(await cleanupOperationsTestRecord(id));
    } catch (error) { testFailure(res, error); }
  });
  app.get("/api/admin/integrations/operations/status", admin, async (_req, res) => {
    res.set("Cache-Control", "no-store");
    try { res.json(await operationsIntegrationHealth()); }
    catch { res.status(503).json({ message: "Operations integration status temporarily unavailable" }); }
  });
  app.post("/api/admin/integrations/operations/events/:eventId/retry", admin, csrf, async (req, res) => {
    res.set("Cache-Control", "no-store");
    try {
      const id = z.string().max(160).regex(/^urbangrid\.(development|production)\.booking\.created\.v1\.\d+$/).parse(req.params.eventId);
      z.object({}).strict().parse(req.body);
      const row = await retryFailedOperationsEvent(id);
      if (!row) return res.status(409).json({ message: "Only failed events in this environment can be retried." });
      res.json({ ok: true, eventId: row.eventId });
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ message: "Invalid retry request." });
      res.status(503).json({ message: "Could not schedule integration retry." });
    }
  });
}