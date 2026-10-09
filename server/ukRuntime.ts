import { countrySecretName, resolveSiteIdentity, websiteDatabaseUrl } from "./network/runtime";

export const UK_SITE_IDENTITY = {
  countryCode: "GB", sourceDomain: "urbangrid.co.uk", clientCode: "urbangrid-uk",
} as const;

/** This adapter cannot mount the UAE app or use its generic database. */
export function ukEnvironment(env: Readonly<Record<string, string | undefined>>): Record<string, string | undefined> {
  return {
    ...env,
    URBANGRID_COUNTRY_CODE: env.URBANGRID_COUNTRY_CODE || "GB",
    URBANGRID_SITE_DOMAIN: env.URBANGRID_SITE_DOMAIN || UK_SITE_IDENTITY.sourceDomain,
    URBANGRID_NETWORK_CLIENT_CODE: env.URBANGRID_NETWORK_CLIENT_CODE || UK_SITE_IDENTITY.clientCode,
  };
}

export function assertUkApplication(env: Readonly<Record<string, string | undefined>>) {
  const identity = resolveSiteIdentity(ukEnvironment(env));
  if (!identity || identity.countryCode !== "GB") {
    throw new Error("This UK-only application requires its registered GB site identity");
  }
}

export function ukDatabaseConfiguration(env: Readonly<Record<string, string | undefined>>) {
  assertUkApplication(env);
  const config = ukEnvironment(env);
  const secretName = countrySecretName("GB", "DATABASE_URL");
  if (!config[secretName]) return { configured: false as const };
  // Invalid or reused database configurations are fatal, never a preview fallback.
  const url = websiteDatabaseUrl(config);
  for (const legacyName of ["DATABASE_URL", "NEON_DATABASE_URL"]) {
    if (!env[legacyName]) continue;
    const target = (value: string) => {
      const parsed = new URL(value);
      return `${parsed.hostname}:${parsed.port || "5432"}${parsed.pathname}`;
    };
    if (target(url) === target(env[legacyName]!)) {
      throw new Error("UK website database must be separate from inherited UAE databases");
    }
  }
  return { configured: true as const, url };
}
