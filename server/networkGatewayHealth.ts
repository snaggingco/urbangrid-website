import { sql } from "drizzle-orm";
import { db } from "./db";
import { websiteLeadOutbox } from "@shared/schema";
import { integrationEndpoint, validIntegrationKey } from "./network/recipient";
import { resolveSiteIdentity, countrySecretName, networkRuntime, LIVE_NETWORK_HOST } from "./network/runtime";
import type { CountryCode } from "@shared/network/country";

/**
 * Read-only, aggregate diagnostic: never returns a key, customer data or an event.
 * This reports configuration shape, NOT proof that the remote key is accepted.
 */
export async function getNetworkDeliveryHealth() {
  const raw = process.env.URBANGRID_NETWORK_INTEGRATION_URL
    || process.env.URBANGRID_OPERATIONS_INTEGRATION_URL;
  const endpoint = integrationEndpoint(raw);
  const urlIsLive = Boolean(endpoint && new URL(endpoint).hostname === LIVE_NETWORK_HOST);
  const identity = resolveSiteIdentity(process.env);
  const hasKey = identity ? validIntegrationKey(process.env[countrySecretName(identity.countryCode as CountryCode, "NETWORK_INTEGRATION_KEY")]) : false;
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
      countryConfigured: Boolean(identity),
      sourceDomainConfigured: Boolean(identity),
      clientCodeConfigured: Boolean(identity),
      deliveryConfigured: Boolean(networkRuntime(process.env)),
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
