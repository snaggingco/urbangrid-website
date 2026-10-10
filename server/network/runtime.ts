import { COUNTRY_PROFILES, isCountryCode, type CountryCode, type SiteIdentity } from "@shared/network/country";
import { integrationEndpoint, validIntegrationKey } from "./recipient";

type Environment = Readonly<Record<string, string | undefined>>;
export const LIVE_NETWORK_HOST = "nzbewemalujbhnjbrpcs.supabase.co";
export const DEVELOPMENT_NETWORK_HOST = "ewyxbbfktyhmmwocvmqs.supabase.co";

/** Legacy UAE inference is limited to the actual platform-bound UAE domain. */
export function resolveSiteIdentity(env: Environment): SiteIdentity | null {
  const domains = (env.REPLIT_DOMAINS || "").toLowerCase().split(",")
    .map(host => host.trim().replace(/^www\./, ""));
  const code = (env.URBANGRID_COUNTRY_CODE || (domains.includes("urbangrid.ae") ? "AE" : "")).toUpperCase();
  if (!isCountryCode(code)) return null;
  const profile = COUNTRY_PROFILES[code];
  const domain = (env.URBANGRID_SITE_DOMAIN || (code === "AE" && domains.includes("urbangrid.ae") ? "urbangrid.ae" : ""))
    .toLowerCase().replace(/^www\./, "");
  const client = env.URBANGRID_NETWORK_CLIENT_CODE || (code === "AE" ? profile.clientCode : "");
  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(domain) || client !== profile.clientCode ||
      (profile.domain && domain !== profile.domain) ||
      Object.values(COUNTRY_PROFILES).some(p => p.countryCode !== code && p.domain === domain) ||
      (code !== "AE" && domains.includes("urbangrid.ae"))) return null;
  return { countryCode: code, sourceDomain: domain, clientCode: client };
}

export function countrySecretName(country: CountryCode, kind: "DATABASE_URL" | "NETWORK_INTEGRATION_KEY") {
  return country === "AE" ? (kind === "DATABASE_URL" ? "DATABASE_URL" : "URBANGRID_NETWORK_INTEGRATION_KEY")
    : `URBANGRID_${country}_${kind}`;
}

/** Explicit opt-in to this Replit project's provisioned database, never a copied external URL. */
export function usesManagedWebsiteDatabase(env: Environment, country: CountryCode): boolean {
  if (country === "AE" || env.URBANGRID_DATABASE_PROVIDER !== "replit-managed") return false;
  const editorBound = Boolean(env.REPL_ID) && env.REPL_ID === env.URBANGRID_MANAGED_DATABASE_REPL_ID;
  // REPL_ID is not guaranteed in published apps. Use the platform-assigned
  // production hostname as the deployment binding, not an editor-only variable.
  const boundDomain = env.URBANGRID_MANAGED_DATABASE_SITE_DOMAIN;
  const domains = (env.REPLIT_DOMAINS || "").toLowerCase().split(",").map(host => host.trim());
  const deploymentBound = env.NODE_ENV === "production" && Boolean(boundDomain) &&
    (domains.includes(boundDomain!) || domains.includes(env.URBANGRID_SITE_DOMAIN || ""));
  return editorBound || deploymentBound;
}

/** Never let a copied Saudi/UK app fall back to the UAE's generic database. */
export function websiteDatabaseUrl(env: Environment): string {
  const identity = resolveSiteIdentity(env);
  // Preserve the UAE development harness, not an unregistered production clone.
  const country = (env.URBANGRID_COUNTRY_CODE || identity?.countryCode ||
    (env.NODE_ENV === "development" ? "AE" : "")).toUpperCase();
  if (!isCountryCode(country)) throw new Error("Unregistered website country");
  if ((country !== "AE" || env.NODE_ENV !== "development") && !identity) throw new Error("Country site registration is incomplete");
  const scopedUrl = env[countrySecretName(country, "DATABASE_URL")];
  const managed = !scopedUrl && usesManagedWebsiteDatabase(env, country);
  const url = scopedUrl || (managed ? env.DATABASE_URL : undefined);
  if (!url) throw new Error("Country-specific website database is missing");
  if (country !== "AE" && !managed && env.DATABASE_URL) {
    const target = (value: string) => {
      try { const parsed = new URL(value); return parsed.hostname + ":" + (parsed.port || "5432") + parsed.pathname; }
      catch { throw new Error("Country website database configuration is invalid"); }
    };
    if (target(url) === target(env.DATABASE_URL)) throw new Error("Country website database must be isolated");
  }
  return url;
}

/** This entry point still owns UAE-specific pages, staff mail, bookings and payment integrations. */
export function assertUaeApplication(env: Environment) {
  if (env.URBANGRID_COUNTRY_CODE && env.URBANGRID_COUNTRY_CODE.toUpperCase() !== "AE") {
    throw new Error("Use a country-owned application adapter; the UAE application cannot host another market");
  }
}

/** No values returned by this helper should be exposed through diagnostics. */
export function networkRuntime(env: Environment) {
  const identity = resolveSiteIdentity(env);
  if (!identity) return null;
  const key = env[countrySecretName(identity.countryCode as CountryCode, "NETWORK_INTEGRATION_KEY")];
  if (!validIntegrationKey(key)) return null;
  if (identity.countryCode !== "AE" && key === env.URBANGRID_NETWORK_INTEGRATION_KEY) return null;
  if (identity.countryCode !== "AE") {
    try { websiteDatabaseUrl(env); } catch { return null; }
  }
  const endpoint = integrationEndpoint(env.URBANGRID_NETWORK_INTEGRATION_URL || env.URBANGRID_OPERATIONS_INTEGRATION_URL);
  if (!endpoint || new URL(endpoint).pathname !== "/functions/v1/urbangrid-integration") return null;
  const host = new URL(endpoint).hostname;
  if (env.NODE_ENV === "production" ? host !== LIVE_NETWORK_HOST : host !== DEVELOPMENT_NETWORK_HOST) return null;
  return { ...identity, endpoint, key };
}

