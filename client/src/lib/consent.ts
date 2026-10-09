import { OPEN_CONSENT_EVENT, type ConsentChoice, type ConsentState } from "@shared/network/privacy";
export { CONSENT_CHANGED_EVENT, OPEN_CONSENT_EVENT, type ConsentChoice, type ConsentState } from "@shared/network/privacy";

declare global {
  interface Window {
    urbanGridConsent?: {
      getState(): ConsentState;
      setChoice(choice: ConsentChoice): ConsentState;
    };
  }
}

// The early HTML script owns all Google consent commands. React only reads
// that controller and requests explicit choices; it never initializes tags.
export function getConsentState(): ConsentState {
  return window.urbanGridConsent?.getState() ?? { choice: null, persisted: false };
}

export function setConsentChoice(choice: ConsentChoice): ConsentState {
  if (!window.urbanGridConsent) throw new Error("Privacy preferences are unavailable. Please reload and try again.");
  return window.urbanGridConsent.setChoice(choice);
}

export function openConsentPreferences() {
  window.dispatchEvent(new CustomEvent(OPEN_CONSENT_EVENT));
}