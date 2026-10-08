import { sql } from "drizzle-orm";
import { db } from "./db";
import { websiteLeadOutbox } from "@shared/schema";
import { operationsEndpoint, validOperationsKey } from "./operationsContract";

/**
 * Read-only, aggregate diagnostic: never returns a key, customer data or an event.
 * This reports configuration shape, NOT proof that the remote key is accepted.
 */
export async function getNetworkDeliveryHealth() {
  const raw = process.env.URBANGRID_NETWORK_INTEGRATION_URL
    || process.env.URBANGRID_OPERATIONS_INTEGRATION_URL;
  const endpoint = operationsEndpoint(raw);
  const urlIsLive = Boolean(endpoint && new URL(endpoint).hostname === "nzbewemalujbhnjbrpcs.supabase.co");
  const registeredDomain = (process.env.URBANGRID_SITE_DOMAIN || "").trim().toLowerCase();
  const domains = (process.env.REPLIT_DOMAINS || "").toLowerCase()
    .split(",").map(item => item.trim().replace(/^www\./, ""));
  const domainIsBound = Boolean(registeredDomain)
    || domains.includes("urbangrid.ae");
  const countryConfigured = /^[A-Z]{2}$/.test((process.env.URBANGRID_COUNTRY_CODE || "").toUpperCase())
    || domains.includes("urbangrid.ae");
  const hasKey = validOperationsKey(process.env.URBANGRID_NETWORK_INTEGRATION_KEY);
  const rows = await db.select({
    status: websiteLeadOutbox.status,
    count: sql<number>`count(*)::int`,
  }).from(websiteLeadOutbox).groupBy(websiteLeadOutbox.status);
  const counts = Object.fromEntries(
    rows.map(item => [item.status, Number(item.count || 0)])
  );
  return {
    configuration: {
      endpointPresent: Boolean(endpoint),
      liveNetworkTarget: urlIsLive,
      integrationKeyValidFormat: hasKey,
      countryConfigured,
      sourceDomainConfigured: domainIsBound,
      clientCodeConfigured: Boolean(process.env.URBANGRID_NETWORK_CLIENT_CODE || domains.includes("urbangrid.ae")),
    },
    outboundQueue: {
      pending: counts.pending || 0,
      sending: counts.sending || 0,
      failed: counts.failed || 0,
      delivered: counts.delivered || 0,
    },
    deliveryProven: (counts.delivered || 0) > 0,
    note: "A delivered event proves Network acknowledgement. A successful configuration check alone does not prove remote credentials.",
  };
}
