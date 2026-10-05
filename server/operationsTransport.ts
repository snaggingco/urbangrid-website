import type { BookingCreatedOperationsEvent, OperationsReceiverIdentifiers } from "@shared/operationsIntegration";

function safeIdentifier(value: unknown): string | undefined {
  if (typeof value === "number" && Number.isSafeInteger(value) && value > 0) return String(value);
  if (typeof value !== "string") return;
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value) ||
      /^[1-9]\d{0,14}$/.test(value) || /^ug-job-[0-9a-f]{32}$/i.test(value) ||
      /^(ORDER|ORD|JOB|PROJECT|PROJ|PRJ|REPORT|RPT)[_-][A-Z0-9-]{1,24}$/i.test(value)) return value;
}

export function extractReceiverIdentifiers(body: unknown): OperationsReceiverIdentifiers | null {
  const ids: OperationsReceiverIdentifiers = {};
  const visit = (value: unknown, depth: number) => {
    if (!value || typeof value !== "object" || Array.isArray(value) || depth > 3) return;
    const object = value as Record<string, unknown>;
    for (const kind of ["order", "job", "project", "report"] as const) {
      const nested = object[kind];
      const id = safeIdentifier(object[`${kind}Id`] ?? object[`${kind}_id`] ??
        (nested && typeof nested === "object" ? (nested as Record<string, unknown>).id : undefined));
      if (id) ids[`${kind}Id`] = id;
    }
    for (const name of ["data", "result", "identifiers", "mappings", "created"]) visit(object[name], depth + 1);
  };
  visit(body, 0);
  return Object.keys(ids).length ? ids : null;
}

export async function readOperationsResponse(response: Response): Promise<unknown> {
  const reader = response.body?.getReader();
  if (!reader) return null;
  try {
    const chunks: Uint8Array[] = [];
    let bytes = 0;
    for (;;) {
      const part = await reader.read();
      if (part.done) break;
      bytes += part.value.byteLength;
      if (bytes > 65536) return null;
      chunks.push(part.value);
    }
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch { return null; }
  finally { await reader.cancel().catch(() => {}); }
}

// No URLs, response bodies, headers or exception messages are logged/persisted:
// a receiver may echo secrets or customer data in its error response.
export async function sendOperationsEvent(
  endpoint: string, key: string, event: BookingCreatedOperationsEvent,
  transport: typeof fetch = fetch,
): Promise<{ ok: boolean; httpStatus: number | null; errorCode: string | null; receiverIdentifiers?: OperationsReceiverIdentifiers | null; duplicate?: boolean | null }> {
  try {
    const response = await transport(endpoint, {
      method: "POST", redirect: "error", signal: AbortSignal.timeout(10_000),
      headers: { "Content-Type": "application/json",
        "x-urbangrid-key": key, "Idempotency-Key": event.eventId },
      body: JSON.stringify(event),
    });
    const body = response.ok ? await readOperationsResponse(response) : null;
    const ids = extractReceiverIdentifiers(body);
    const duplicate = body && typeof body === "object" && "duplicate" in body &&
      typeof body.duplicate === "boolean" ? body.duplicate : null;
    if (!response.body?.locked) await response.body?.cancel();
    return { ok: response.ok, httpStatus: response.status,
      errorCode: response.ok ? null : `HTTP_${response.status}`,
      ...(response.ok ? { duplicate } : {}),
      ...(ids ? { receiverIdentifiers: ids } : {}) };
  } catch {
    return { ok: false, httpStatus: null, errorCode: "NETWORK_TIMEOUT_OR_REDIRECT" };
  }
}