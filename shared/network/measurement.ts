import { attributionKeys } from "../leads";
import type { CountryProfile } from "./country";

export function safeCampaignValue(key: string, value?: string): string | null {
  if (!value || /@|%40/i.test(value)) return null;
  if (["gclid", "gbraid", "wbraid", "utm_id"].includes(key)) {
    return /^[a-z0-9._~-]+$/i.test(value) ? value.slice(0, 500) : null;
  }
  if (/^\+?\d[\d\s().-]{6,}$/.test(value)) return null;
  return value.slice(0, 500);
}
export function safePageUrl(raw: string): string | null {
  try {
    const url = new URL(raw);
    if (!["http:", "https:"].includes(url.protocol)) return null;
    const clean = new URL(url.origin + url.pathname);
    for (const key of attributionKeys) {
      const value = safeCampaignValue(key, url.searchParams.get(key) || undefined);
      if (value) clean.searchParams.set(key, value);
    }
    return clean.href.slice(0, 2000);
  } catch { return null; }
}

export interface MeasurementPolicy {
  hosts: readonly string[];
  measurementId: string | null;
  consentRequired: true;
  owner: "gtm";
}
/** No country inherits UAE tag IDs. Consent and the site's existing GTM bridge remain the owners. */
export function measurementAllowed(policy: MeasurementPolicy, host: string, consent: string | null) {
  return policy.owner === "gtm" && Boolean(policy.measurementId) && policy.hosts.includes(host) && consent === "accepted";
}
export const UAE_MEASUREMENT: MeasurementPolicy = {
  hosts: ["urbangrid.ae", "www.urbangrid.ae"], measurementId: "G-ZX4B5QJGB4", consentRequired: true, owner: "gtm",
};

export function contactClick(href: string, base: string, cta: CountryProfile["cta"]): "call_click" | "whatsapp_click" | undefined {
  let type: "call_click" | "whatsapp_click" | undefined;
  if (/^tel:/i.test(href) && cta.phones.includes(href.slice(4).replace(/\D/g, ""))) type = "call_click";
  try {
    const url = new URL(href, base);
    const phone = (url.searchParams.get("phone") || "").replace(/\D/g, "");
    if (cta.whatsapp && ((url.hostname === "wa.me" && url.pathname.replace(/^\/|\/$/g, "") === cta.whatsapp) ||
        ((["api.whatsapp.com", "www.whatsapp.com", "whatsapp.com"].includes(url.hostname) || url.protocol === "whatsapp:") &&
          phone === cta.whatsapp))) type = "whatsapp_click";
  } catch {}
  return type;
}
