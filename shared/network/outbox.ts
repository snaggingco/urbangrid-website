export const LEAD_POLL_MS = 30_000;
export const LEAD_LEASE_MS = 120_000;
export const LEAD_BATCH_SIZE = 15;
export function leadRetryDelay(attempts: number) {
  return Math.min(3_600_000, 30_000 * 2 ** Math.min(attempts, 7));
}
export function leadAcknowledged(httpOk: boolean, result: unknown): boolean {
  return httpOk && Boolean(result && typeof result === "object" && "accepted" in result && result.accepted === true);
}
export function leadEventMatchesSite(event: unknown, site: { clientCode: string; countryCode: string; sourceDomain: string }): boolean {
  if (!event || typeof event !== "object" || !("payload" in event) || !("eventId" in event)) return false;
  const payload = event.payload;
  return typeof event.eventId === "string" && event.eventId.startsWith(site.clientCode + ".lead.created.") &&
    Boolean(payload && typeof payload === "object" && "countryCode" in payload && "sourceDomain" in payload &&
      payload.countryCode === site.countryCode && payload.sourceDomain === site.sourceDomain);
}
