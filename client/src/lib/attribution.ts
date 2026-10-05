import { attributionKeys, attributionSchema, type LeadAttribution, type AttributionTouch } from "@shared/leads";

const STORAGE_KEY = "ug_lead_attribution_v1";
let current: LeadAttribution | undefined;
let lastCapturedUrl = "";

function restore(): LeadAttribution | undefined {
  try {
    const parsed = attributionSchema.safeParse(JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"));
    return parsed.success ? parsed.data : undefined;
  } catch {
    return undefined;
  }
}

// A new visit starts a touch; campaign parameters during SPA navigation also update it.
// Ordinary internal navigation never replaces the original campaign with "direct".
export function captureAttribution(initialVisit = false): LeadAttribution {
  current ||= restore();
  const url = window.location.href;
  const params = new URLSearchParams(window.location.search);
  const tagged = attributionKeys.some((key) => Boolean(params.get(key)));
  if (!current || ((initialVisit || tagged) && url !== lastCapturedUrl)) {
    const touch: AttributionTouch = {
      landingPage: url.slice(0, 2000),
      referrer: document.referrer.slice(0, 2000),
      capturedAt: new Date().toISOString(),
    };
    for (const key of attributionKeys) {
      const value = params.get(key);
      if (value) touch[key] = value.slice(0, 500);
    }
    current = { firstTouch: current?.firstTouch || touch, lastTouch: touch };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(current)); } catch { /* Memory still works when storage is unavailable. */ }
  }
  lastCapturedUrl = url;
  return current!;
}

export function getAttribution(): LeadAttribution {
  return captureAttribution();
}