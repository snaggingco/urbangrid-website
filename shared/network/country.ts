/** Public market metadata only. No credentials, database URLs or shared SEO routes. */
export const NETWORK_LOGIN_URL = "https://app.stratasurveyor.com/" as const;
export type CountryCode = "AE" | "SA" | "GB";
export interface SiteIdentity { countryCode: string; sourceDomain: string; clientCode: string }
export type ServiceCategory = "residential" | "consultancy" | "technical";
export interface CountryProfile {
  countryCode: CountryCode;
  currency: "AED" | "SAR" | "GBP";
  locale: string;
  locales: readonly string[];
  timezone: string;
  siteId: string;
  domain: string | null;
  clientCode: string;
  cta: { phones: readonly string[]; whatsapp: string | null };
  services: readonly ServiceCategory[];
  compliance: { privacyRegime: string; localReviewRequired: boolean; consent: "explicit-opt-in" };
  contentOwnership: "country-site";
}

export const COUNTRY_PROFILES: Readonly<Record<CountryCode, CountryProfile>> = {
  AE: {
    countryCode: "AE", currency: "AED", locale: "en-AE", locales: ["en-AE", "ar-AE"],
    timezone: "Asia/Dubai", siteId: "urbangrid-ae", domain: "urbangrid.ae", clientCode: "urbangrid-website",
    cta: { phones: ["971585686852", "971567427634"], whatsapp: "971567427634" },
    services: ["residential", "consultancy", "technical"],
    compliance: { privacyRegime: "UAE PDPL", localReviewRequired: true, consent: "explicit-opt-in" },
    contentOwnership: "country-site",
  },
  SA: {
    countryCode: "SA", currency: "SAR", locale: "en-SA", locales: ["en-SA", "ar-SA"],
    timezone: "Asia/Riyadh", siteId: "urbangrid-sa", domain: null, clientCode: "urbangrid-sa",
    cta: { phones: [], whatsapp: null }, services: [],
    compliance: { privacyRegime: "Saudi PDPL", localReviewRequired: true, consent: "explicit-opt-in" },
    contentOwnership: "country-site",
  },
  GB: {
    countryCode: "GB", currency: "GBP", locale: "en-GB", locales: ["en-GB"],
    timezone: "Europe/London", siteId: "urbangrid-gb", domain: "urbangrid.co.uk", clientCode: "urbangrid-uk",
    cta: { phones: ["447436597890"], whatsapp: null },
    services: ["residential", "consultancy", "technical"],
    compliance: { privacyRegime: "UK GDPR and PECR", localReviewRequired: true, consent: "explicit-opt-in" },
    contentOwnership: "country-site",
  },
};

export function isCountryCode(value: string): value is CountryCode {
  return Object.prototype.hasOwnProperty.call(COUNTRY_PROFILES, value);
}
export function countryProfile(code: string): CountryProfile {
  if (!isCountryCode(code)) throw new Error("Unregistered website country");
  return COUNTRY_PROFILES[code];
}

export interface CountrySiteAdapter {
  country: CountryCode;
  domain: string;
  cta: CountryProfile["cta"];
  services: readonly ServiceCategory[];
  privacyReviewed: boolean;
}

/** A sibling site must provide its own approved contacts, service scope and legal review. */
export function adoptCountrySite(adapter: CountrySiteAdapter): CountryProfile {
  const profile = countryProfile(adapter.country);
  const domain = adapter.domain.trim().toLowerCase();
  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(domain) ||
      (profile.domain && domain !== profile.domain) ||
      Object.values(COUNTRY_PROFILES).some(p => p.countryCode !== adapter.country && p.domain === domain)) {
    throw new Error("Country site domain mismatch");
  }
  if (!adapter.privacyReviewed || adapter.cta.phones.length === 0 ||
      !adapter.cta.phones.every(phone => /^[1-9]\d{6,14}$/.test(phone)) ||
      (adapter.cta.whatsapp !== null && !/^[1-9]\d{6,14}$/.test(adapter.cta.whatsapp)) ||
      adapter.services.length === 0 ||
      !adapter.services.every(service => ["residential", "consultancy", "technical"].includes(service))) {
    throw new Error("Country site adoption is incomplete");
  }
  return { ...profile, domain, cta: { ...adapter.cta, phones: [...adapter.cta.phones] },
    services: [...adapter.services], compliance: { ...profile.compliance, localReviewRequired: false } };
}
