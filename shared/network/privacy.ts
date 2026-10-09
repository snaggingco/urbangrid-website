export type ConsentChoice = "accepted" | "rejected";
export type ConsentState = { choice: ConsentChoice | null; persisted: boolean };
export const CONSENT_CHANGED_EVENT = "ug:consent-change";
export const OPEN_CONSENT_EVENT = "ug:consent-open";

/** Shared semantics, not legal approval. Country adapters retain their own policy text and controller. */
export const PRIVACY_CONTRACT = {
  initialConsent: "denied", optionalMeasurement: "explicit-opt-in",
  contactClickIsLead: false, enquiryIsPayment: false,
  secretsInBrowser: false, customerDetailsInAnalytics: false,
} as const;
