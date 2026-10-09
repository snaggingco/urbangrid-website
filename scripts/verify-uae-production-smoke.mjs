// Explicit manual release check. No browser/analytics scripts or payment APIs.
// Refuses to create a booking until the authenticated new release tick works.
import assert from "node:assert/strict";
if (process.argv[2] !== "--production") throw new Error("Explicit --production required");
const key = process.env.URBANGRID_NETWORK_INTEGRATION_KEY;
if (!key || key.length < 48) throw new Error("Private integration credential unavailable");
const origin = "https://urbangrid.ae";
let cookies = new Map(), csrf;
async function request(path, body, synthetic = false) {
  const response = await fetch(origin + path, {
    method: body ? "POST" : "GET", redirect: "error", signal: AbortSignal.timeout(90000),
    headers: { Accept: "application/json", Origin: origin,
      Cookie: [...cookies].map(([name, value]) => `${name}=${value}`).join("; "),
      "x-urbangrid-key": key,
      ...(body ? { "Content-Type": "application/json", ...(csrf ? { "x-csrf-token": csrf } : {}) } : {}),
      ...(synthetic ? { "x-urbangrid-synthetic-booking": "1" } : {}),
    }, ...(body ? { body: JSON.stringify(body) } : {}),
  });
  for (const value of response.headers.getSetCookie()) {
    const pair = value.split(";")[0], at = pair.indexOf("=");
    cookies.set(pair.slice(0, at), pair.slice(at + 1));
  }
  return { status: response.status, body: await response.json().catch(() => null) };
}
const safeId = value => typeof value === "string" && !value.includes(key) &&
  /^[A-Za-z0-9_.:-]{1,160}$/.test(value) ? value : null;
function mappings(value) {
  return Object.fromEntries(["orderId", "jobId", "projectId"].map(name => [name, safeId(value?.[name])]));
}
try {
  const preflight = await request("/api/integrations/operations/tick", {});
  if (preflight.status !== 200 || preflight.body?.completed !== true) {
    console.log(JSON.stringify({ gate: "NEW_RELEASE_NOT_ACTIVE", httpStatus: preflight.status, bookingCreated: false }));
    process.exitCode = 1;
  } else {
    const config = await request("/api/bookings/config");
    csrf = config.body?.csrfToken;
    assert.equal(config.status, 200); assert.equal(typeof csrf, "string");
    // Stable UUID ensures rerunning this release verification cannot create a
    // second fixture. Never delete existing records or send a balance/payment call.
    const submissionKey = "8068b226-df62-4b50-a303-7847e9b5d1ca";
    const created = await request("/api/bookings", {
      submissionKey, name: "UrbanGrid PRODUCTION INTEGRATION TEST — NO DISPATCH",
      email: "uae-dos-v1-release@example.invalid", phone: "+971000000000",
      service: "new-build-snagging", propertyType: "Apartment", areaSqft: 1000,
      project: "INTEGRATION TEST — NO DISPATCH", location: "SYNTHETIC — NO PHYSICAL INSPECTION",
      emirate: "Dubai", inspectionDate: "2099-01-03", timeWindow: "Synthetic only",
    }, true);
    assert([200, 201].includes(created.status));
    const id = created.body?.booking?.id;
    assert(Number.isSafeInteger(id) && id > 0);
    let replay;
    for (let n = 0; n < 4; n++) {
      await request("/api/integrations/operations/tick", {});
      replay = await request(`/api/integrations/operations/smoke/${id}`, { action: "replay" });
      if (replay.status !== 409) break;
      await new Promise(resolve => setTimeout(resolve, 15000));
    }
    assert.equal(replay.status, 200); assert.equal(replay.body?.accepted, true);
    assert.equal(replay.body?.duplicate, true);
    assert(replay.body?.initialDeliveryHttpStatus >= 200 && replay.body?.initialDeliveryHttpStatus < 300);
    const ids = mappings(replay.body?.persistedIdentifiers);
    assert(Object.values(ids).every(Boolean));
    const reconciliation = await request(`/api/integrations/operations/smoke/${id}`, { action: "reconcile" });
    assert.equal(reconciliation.status, 200);
    assert.deepEqual(mappings(reconciliation.body?.identifiers), ids);
    const status = reconciliation.body?.status;
    assert(typeof status === "string" && /^[a-z_]{1,40}$/.test(status));
    const duplicateWebsiteBooking = await request("/api/bookings", {
      submissionKey, name: "UrbanGrid PRODUCTION INTEGRATION TEST — NO DISPATCH",
      email: "uae-dos-v1-release@example.invalid", phone: "+971000000000",
      service: "new-build-snagging", propertyType: "Apartment", areaSqft: 1000,
      project: "INTEGRATION TEST — NO DISPATCH", location: "SYNTHETIC — NO PHYSICAL INSPECTION",
      emirate: "Dubai", inspectionDate: "2099-01-03", timeWindow: "Synthetic only",
    }, true);
    assert.equal(duplicateWebsiteBooking.status, 200);
    assert.equal(duplicateWebsiteBooking.body?.booking?.id, id);
    console.log(JSON.stringify({ websiteBookingHttp: created.status, bookingId: id,
      eventId: `urbangrid.production.booking.created.v1.${id}`, identifiers: ids,
      initialReceiverHttp: replay.body?.initialDeliveryHttpStatus,
      receiverReplayHttp: replay.body?.httpStatus, duplicate: true,
      websiteReconcileHttp: reconciliation.status, lifecycleStatus: status,
      websiteDuplicateHttp: duplicateWebsiteBooking.status, sameBooking: true }));
  }
} catch {
  console.log(JSON.stringify({ gate: "PRODUCTION_SMOKE_NOT_VERIFIED" }));
  process.exitCode = 1;
}
