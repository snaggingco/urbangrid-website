import assert from "node:assert/strict";
import { normalizeStatusResponse } from "../server/operationsStatusContract";
import { extractReceiverIdentifiers } from "../server/operationsTransport";

const identity = { bookingId: 123, bookingReference: "UG-2026-000000000123", eventId: "fixture.123" };
const orderId = "11111111-1111-1111-1111-111111111111";
const jobId = "22222222-2222-2222-2222-222222222222";
const projectId = "ug-job-22222222222222222222222222222222";
const response = {
  bookingId: "123", lifecycleStatus: "scheduled",
  mappings: { orderId, jobId, projectId, reportId: null },
  order: { id: orderId, source_booking_id: "123", updated_at: "2026-10-04T12:00:00.123456+00:00",
    payment_status: "paid", total_minor: 100000 },
  job: { id: jobId, project_id: projectId, updated_at: "2026-10-04T12:00:00.123457+00:00" },
  report: null, assignment: null, synchronizedAt: "2026-10-04T12:01:00Z",
};
const parsed = normalizeStatusResponse(response, identity, "development");
assert.equal(parsed.status, "scheduled");
assert.deepEqual(parsed.identifiers, { orderId, jobId, projectId });
assert.equal(parsed.version, 1791115200123457);
assert.equal("payment_status" in parsed, false);
assert.deepEqual(normalizeStatusResponse({ ...response, synchronizedAt: "2026-10-04T12:03:00Z" },
  identity, "development"), parsed);
const changed = normalizeStatusResponse({ ...response, lifecycleStatus: "inspection_started",
  job: { ...response.job, updated_at: "2026-10-04T12:00:00.123458+00:00" } }, identity, "development");
assert(changed.version > parsed.version);
assert.notEqual(changed.eventId, parsed.eventId);
assert.equal(normalizeStatusResponse({ ...response, lifecycleStatus: "report_published" }, identity, "development").status, "qa_approved");
assert.throws(() => normalizeStatusResponse({ ...response, bookingId: "124" }, identity, "development"));
assert.throws(() => normalizeStatusResponse({ ...response, job: { ...response.job, project_id: "other" } }, identity, "development"));
assert.throws(() => normalizeStatusResponse({ ...response, mappings: { ...response.mappings, projectId: "arbitrary reflected credential" } }, identity, "development"));
assert.deepEqual(extractReceiverIdentifiers(response), { orderId, jobId, projectId });
assert.equal(extractReceiverIdentifiers({ projectId: "ug-job-invalid", arbitrarySecret: "discard" }), null);
console.log("PASS actual Strata status contract: identity/mappings, null report, stable polling, microsecond ordering, publication normalization, payment isolation and identifier allowlist.");