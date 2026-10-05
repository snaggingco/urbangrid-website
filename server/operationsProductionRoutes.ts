import type { Express } from "express";
import { and, eq } from "drizzle-orm";
import { db } from "./db";
import { inspectionBookings as bookings, operationsDeliveryOutbox as outbox,
  operationsLifecycle as lifecycle } from "@shared/schema";
import { operationsEndpoint } from "./operationsContract";
import { requireOperationsMachine } from "./operationsMachineAuth";
import { reconcileBooking, statusEndpoint } from "./operationsLifecycle";
import { sendOperationsEvent } from "./operationsTransport";

// A bounded external tick can wake Autoscale; a timer in the web process cannot.
export function registerOperationsProductionRoutes(app: Express, cycles: {
  deliver: () => Promise<unknown>; reconcile: () => Promise<unknown>;
}) {
  app.post("/api/integrations/operations/tick", requireOperationsMachine, async (_req, res) => {
    if (!operationsEndpoint(process.env.URBANGRID_OPERATIONS_INTEGRATION_URL) || !statusEndpoint()) {
      res.status(503).json({ errorCode: "PRODUCTION_ENDPOINTS_MISSING" }); return;
    }
    try {
      await cycles.deliver();
      await cycles.reconcile();
      res.json({ completed: true, environment: "production" });
    } catch {
      res.status(503).json({ errorCode: "WORKER_CYCLE_DEFERRED" });
    }
  });

  // Only quarantined fixtures can be replayed/reconciled by the smoke runner.
  // Ordinary bookings cannot enter this path, and no notification/payment service
  // is imported or called.
  app.post("/api/integrations/operations/smoke/:bookingId", requireOperationsMachine, async (req, res) => {
    const id = Number(req.params.bookingId);
    if (!Number.isSafeInteger(id) || id <= 0 ||
        !["replay", "reconcile"].includes(req.body?.action)) {
      res.status(400).json({ errorCode: "INVALID_SMOKE_REQUEST" }); return;
    }
    try {
      const [row] = await db.select({ booking: bookings, delivery: outbox })
        .from(bookings).innerJoin(outbox, eq(outbox.bookingId, bookings.id))
        .where(and(eq(bookings.id, id), eq(bookings.isIntegrationTest, true),
          eq(outbox.isIntegrationTest, true), eq(outbox.environment, "production")));
      if (!row || !row.booking.isIntegrationTest || !row.delivery.isIntegrationTest ||
          row.delivery.payload.data.booking.recordType !== "integration_test" ||
          row.delivery.status !== "delivered") {
        res.status(409).json({ errorCode: "DELIVERED_SYNTHETIC_BOOKING_REQUIRED" }); return;
      }
      if (req.body.action === "reconcile") {
        const result = await reconcileBooking(id);
        const [updated] = await db.select().from(bookings).where(eq(bookings.id, id));
        const [state] = await db.select({ status: lifecycle.status }).from(lifecycle)
          .where(eq(lifecycle.bookingId, id));
        res.json({ ...result, status: state?.status ?? ("status" in result ? result.status : null),
          identifiers: updated.strataIdentifiers }); return;
      }
      const endpoint = operationsEndpoint(process.env.URBANGRID_OPERATIONS_INTEGRATION_URL);
      if (!endpoint) {
        res.status(503).json({ errorCode: "PRODUCTION_ENDPOINTS_MISSING" }); return;
      }
      const result = await sendOperationsEvent(endpoint,
        process.env.URBANGRID_NETWORK_INTEGRATION_KEY!, row.delivery.payload);
      res.status(result.ok ? 200 : 502).json({
        httpStatus: result.httpStatus, accepted: result.ok,
        initialDeliveryHttpStatus: row.delivery.lastHttpStatus,
        duplicate: result.duplicate ?? null,
        identifiers: result.receiverIdentifiers ?? null,
        persistedIdentifiers: row.booking.strataIdentifiers,
      });
    } catch {
      res.status(502).json({ errorCode: "SMOKE_RECEIVER_UNAVAILABLE" });
    }
  });
}
