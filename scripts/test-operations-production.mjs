// Real route/auth source, isolated server, fake database and outbound transport.
// No real keys, customers, notifications, payments or external HTTP requests.
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import crypto from "node:crypto";
import express from "express";
import ts from "typescript";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const key = crypto.randomBytes(48).toString("hex");
const env = {
  NODE_ENV: "production", URBANGRID_NETWORK_INTEGRATION_KEY: key,
  URBANGRID_OPERATIONS_INTEGRATION_URL: "https://receiver.example.invalid/event",
  URBANGRID_OPERATIONS_STATUS_URL: "https://receiver.example.invalid/status",
};
function load(path, replacements = {}) {
  const context = vm.createContext({ exports: {}, console, Buffer, URL,
    process: { env }, require: name => replacements[name] ?? require(name) });
  vm.runInContext(ts.transpileModule(fs.readFileSync(path, "utf8"), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  }).outputText, context);
  return context.exports;
}
const contract = load("server/operationsContract.ts");
const auth = load("server/operationsMachineAuth.ts", { "./operationsContract": contract });
const validContact = { name: "UrbanGrid PRODUCTION INTEGRATION TEST — NO DISPATCH",
  email: "synthetic@example.invalid", phone: "+971000000000", project: "INTEGRATION TEST ONLY" };
assert(auth.syntheticBookingContact(validContact));
assert(!auth.syntheticBookingContact({ ...validContact, email: "real@example.com" }));
assert(!auth.syntheticBookingContact({ ...validContact, phone: "+971501234567" }));
let ticks = 0, reconciliations = 0, queries = 0, sends = 0, fail = false;
let fixture = {
  booking: { isIntegrationTest: true, strataIdentifiers: { orderId: "ORDER-TEST", jobId: "JOB-TEST", projectId: "PROJECT-TEST" } },
  delivery: { isIntegrationTest: true, status: "delivered", payload: { data: { booking: { recordType: "integration_test" } } } },
};
const db = { select: fields => {
  const builder = { from: () => builder, innerJoin: () => builder,
    where: async () => { queries++; return fixture ? [fields ? fixture : fixture.booking] : []; } };
  return builder;
} };
const routes = load("server/operationsProductionRoutes.ts", {
  "./db": { db }, "@shared/schema": { inspectionBookings: {}, operationsDeliveryOutbox: {}, operationsLifecycle: {} },
  "./operationsContract": contract, "./operationsMachineAuth": auth,
  "./operationsLifecycle": { statusEndpoint: () => env.URBANGRID_OPERATIONS_STATUS_URL,
    reconcileBooking: async () => { reconciliations++; return { applied: true, status: "scheduled" }; } },
  "./operationsTransport": { sendOperationsEvent: async () => {
    sends++; return { ok: true, httpStatus: 200, duplicate: true };
  } },
});
const app = express(); app.use(express.json());
routes.registerOperationsProductionRoutes(app, {
  deliver: async () => { ticks++; if (fail) throw new Error(key); },
  reconcile: async () => { reconciliations++; },
});
const server = app.listen(0, "127.0.0.1");
await new Promise(resolve => server.once("listening", resolve));
const base = `http://127.0.0.1:${server.address().port}`;
async function post(path, supplied = key, body = {}) {
  const response = await fetch(base + path, { method: "POST",
    headers: { "Content-Type": "application/json", "x-urbangrid-key": supplied },
    body: JSON.stringify(body) });
  const text = await response.text();
  assert(!text.includes(key), "Never echo the credential or thrown errors");
  return { status: response.status, body: JSON.parse(text) };
}
try {
  assert.equal((await post("/api/integrations/operations/tick", "wrong")).status, 401);
  assert.equal(ticks, 0);
  assert.equal((await post("/api/integrations/operations/tick")).status, 200);
  assert.equal(ticks, 1); assert.equal(reconciliations, 1);
  env.NODE_ENV = "development";
  assert.equal((await post("/api/integrations/operations/tick")).status, 401);
  env.NODE_ENV = "production";
  const saved = env.URBANGRID_OPERATIONS_STATUS_URL;
  delete env.URBANGRID_OPERATIONS_STATUS_URL;
  assert.equal((await post("/api/integrations/operations/tick")).status, 503);
  env.URBANGRID_OPERATIONS_STATUS_URL = saved;
  fail = true;
  assert.equal((await post("/api/integrations/operations/tick")).body.errorCode, "WORKER_CYCLE_DEFERRED");
  fail = false;
  assert.equal((await post("/api/integrations/operations/smoke/42", "wrong", { action: "replay" })).status, 401);
  assert.equal(queries, 0);
  assert.equal((await post("/api/integrations/operations/smoke/NaN", key, { action: "replay" })).status, 400);
  assert.equal((await post("/api/integrations/operations/smoke/42", key, { action: "replay" })).body.duplicate, true);
  assert.equal(sends, 1);
  assert.equal((await post("/api/integrations/operations/smoke/42", key, { action: "reconcile" })).body.status, "scheduled");
  fixture.booking.isIntegrationTest = false;
  assert.equal((await post("/api/integrations/operations/smoke/42", key, { action: "replay" })).status, 409);
  assert.equal(sends, 1);
  fixture = null;
  assert.equal((await post("/api/integrations/operations/smoke/42", key, { action: "replay" })).status, 409);
  assert.equal(sends, 1);
  const bookingRoute = fs.readFileSync("server/bookingRoutes.ts", "utf8");
  assert(bookingRoute.includes('operationsMachineAuthorized(req) || !syntheticBookingContact(input)'));
  assert(bookingRoute.includes('if (!synthetic) await sendBookingConfirmation'));
  const service = fs.readFileSync("server/bookingService.ts", "utf8");
  assert(service.includes('if (booking.isIntegrationTest) return null'));
  assert.equal(service.split('Synthetic bookings cannot take payments').length - 1, 2);
  console.log("PASS Production machine auth, Development isolation, bounded tick success/config/failure, secret-safe errors, synthetic-only replay/reconcile and notification/payment safeguards; isolated fixtures only.");
} finally { await new Promise(resolve => server.close(resolve)); }
