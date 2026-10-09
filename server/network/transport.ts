import { leadAcknowledged } from "@shared/network/outbox";

/** Injectable transport for isolated tests. Never logs keys, payloads or remote errors. */
export async function sendLeadEvent(
  envelope: unknown, eventId: string,
  runtime: { endpoint: string; key: string; clientCode: string },
  request: typeof fetch = fetch,
): Promise<{ ok: boolean; reason: string }> {
  try {
    const response = await request(runtime.endpoint, {
      method: "POST", redirect: "error", signal: AbortSignal.timeout(10_000),
      headers: { "content-type": "application/json", "x-urbangrid-key": runtime.key,
        "x-urbangrid-client": runtime.clientCode, "Idempotency-Key": eventId },
      body: JSON.stringify(envelope),
    });
    const result = await response.json().catch(() => null);
    const ok = leadAcknowledged(response.ok, result);
    return { ok, reason: ok ? "" : "HTTP_" + response.status };
  } catch { return { ok: false, reason: "network_failed" }; }
}
