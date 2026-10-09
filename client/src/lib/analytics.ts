import { getAttribution } from "./attribution";
import { canMeasureBusinessEvents, sendGa4BusinessEvent } from "./ga4BusinessEvents";
import { attributionKeys, type AttributionTouch, type LeadAttribution } from "@shared/leads";
import type { BookingView } from "@shared/booking";
import { COUNTRY_PROFILES } from "@shared/network/country";
import { safeCampaignValue, safePageUrl, contactClick } from "@shared/network/measurement";

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    __ugContactClickTrackingCleanup?: () => void;
  }
}

// No form values, arbitrary query parameters, WhatsApp message text, or fragments
// enter the measurement payload. Marketing identifiers are attribution, not revenue.

function measurementTouch(touch: AttributionTouch) {
  return {
    // Explicit nulls clear absent identifiers in GTM's merged data-layer model.
    ...Object.fromEntries(attributionKeys.map((key) => [key, safeCampaignValue(key, touch[key])])),
    landing_page: safePageUrl(touch.landingPage),
    captured_at: touch.capturedAt,
  };
}

function safeSource(value: string): string {
  return /^[a-z0-9_/-]{1,100}$/i.test(value) ? value : "website";
}

function eventContext(attribution: LeadAttribution, source: string) {
  return {
    page_url: safePageUrl(window.location.href),
    page_path: window.location.pathname,
    cta_source: safeSource(source),
    first_touch: measurementTouch(attribution.firstTouch),
    last_touch: measurementTouch(attribution.lastTouch),
    lead_id: null,
    form_source: null,
    contact_channel: null,
  };
}

// A single Google event command also produces the existing GTM custom event.
// Never add a second push for the same action: GTM remains the sole Ads owner.
function pushEvent(event: Record<string, unknown>) {
  if (!canMeasureBusinessEvents()) return;
  const { first_touch, last_touch } = event;
  const parameters: Record<string, unknown> = {
    page_location: event.page_url,
    page_referrer: safePageUrl(document.referrer) || "",
    cta_source: event.cta_source,
  };
  for (const key of ["lead_id", "form_source", "contact_channel", "booking_id", "transaction_id", "value", "currency"]) {
    if (event[key] !== null && event[key] !== undefined) parameters[key] = event[key];
  }
  // GA4 event parameters are scalar; keep GTM's original nested touch payload
  // unchanged, and project the same sanitized attribution into flat parameters.
  const touches = { first_touch, last_touch };
  for (const [prefix, touch] of Object.entries(touches)) {
    if (touch && typeof touch === "object") {
      for (const [key, value] of Object.entries(touch)) {
        // Preserve timestamps in GTM/storage, not as redundant GA4 parameters.
        // Omit nulls and keep this projection within GA4's 25-parameter limit.
        if (key !== "captured_at" && value !== null && Object.keys(parameters).length < 21) parameters[`${prefix}_${key}`] = value;
      }
    }
  }
  sendGa4BusinessEvent(event, parameters);
}

function onceCommercial(key: string, event: Record<string, unknown>) {
  // No replay after consent: a denied action stays unmeasured.
  if (!canMeasureBusinessEvents()) return;
  const seen = window.__ugCommercialEvents ||= new Set<string>();
  if (seen.has(key)) return;
  try { if (sessionStorage.getItem(key)) return; } catch {}
  seen.add(key);
  try { sessionStorage.setItem(key, "1"); } catch {}
  pushEvent(event);
}

declare global {
  interface Window { __ugCommercialEvents?: Set<string>; }
}

export function trackConfirmedBooking(booking: BookingView) {
  if (!Number.isInteger(booking.id) || booking.id < 1) return;
  onceCommercial(`ug_booking_${booking.id}`, {
    ...eventContext(getAttribution(), "residential_booking"),
    event: "booking_confirmed", booking_id: booking.id, lead_id: booking.leadId,
    // A booking quote is not collected revenue.
  });
}

export function trackVerifiedPayments(booking: BookingView) {
  for (const payment of booking.payments) {
    if (payment.paymentType !== "full" || payment.status !== "completed" ||
        !payment.completedAt || (payment.provider === "ziina" && !payment.verifiedOnline)) continue;
    onceCommercial(`ug_payment_${payment.id}`, {
      ...eventContext(getAttribution(), "booking_payment"),
      event: "purchase", booking_id: booking.id,
      transaction_id: `ug-ae-payment-${payment.id}`, currency: booking.currency,
      value: payment.amountMinor / 100,
    });
  }
}

export function trackEngagement(name: "form_start" | "click", source: string) {
  pushEvent({ ...eventContext(getAttribution(), source), event: name });
}

export function trackLeadSubmission(leadId: number, formSource: string, attribution: LeadAttribution) {
  if (!Number.isInteger(leadId) || leadId < 1) return;
  const trackedLeads = window.__ugTrackedLeadIds ||= new Set<number>();
  const key = `ug_lead_tracked_${leadId}`;
  if (trackedLeads.has(leadId)) return;
  try { if (sessionStorage.getItem(key)) return; } catch {}
  trackedLeads.add(leadId);
  try { sessionStorage.setItem(key, "1"); } catch {}
  pushEvent({
    ...eventContext(attribution, formSource),
    event: "generate_lead",
    lead_id: leadId,
    form_source: safeSource(formSource),
  });
}

export function installContactClickTracking() {
  // Shared across module instances (including dev-server URL/query aliases).
  if (window.__ugContactClickTrackingCleanup) return window.__ugContactClickTrackingCleanup;
  const listener = (event: MouseEvent) => {
    const target = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
    if (!target) return;
    const href = (target.getAttribute("href") || "").trim();
    const type = contactClick(href, window.location.href, COUNTRY_PROFILES.AE.cta);
    if (!type) return;
    const region = target.closest<HTMLElement>("[data-analytics-region]")?.dataset.analyticsRegion;
    const source = target.dataset.analyticsSource || region ||
      (target.closest("footer") ? "footer" : target.closest("header") ? "header" : "page_content");
    pushEvent({
      ...eventContext(getAttribution(), source),
      event: type,
      contact_channel: type === "call_click" ? "phone" : "whatsapp",
    });
    void fetch("/api/track-conversion", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversionType: type, path: (window.location.pathname + window.location.search).slice(0, 500) }),
      keepalive: true,
    }).then((response) => { if (!response.ok) throw new Error("Contact click was not logged"); })
      .catch((error) => console.error("Contact click logging failed:", error));
  };
  document.addEventListener("click", listener, true);
  const cleanup = () => {
    document.removeEventListener("click", listener, true);
    if (window.__ugContactClickTrackingCleanup === cleanup) delete window.__ugContactClickTrackingCleanup;
  };
  window.__ugContactClickTrackingCleanup = cleanup;
  return cleanup;
}
