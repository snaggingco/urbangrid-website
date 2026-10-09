import { attributionKeys, type AttributionTouch } from "../leads";

/** Same acquisition touch contract for all sites; host-local storage is owned by each adapter. */
export function campaignTouch(rawUrl: string, referrer: string, capturedAt: string): AttributionTouch {
  const params = new URL(rawUrl).searchParams;
  const touch: AttributionTouch = {
    landingPage: rawUrl.slice(0, 2000), referrer: referrer.slice(0, 2000), capturedAt,
  };
  for (const key of attributionKeys) {
    const value = params.get(key);
    if (value) touch[key] = value.slice(0, 500);
  }
  return touch;
}
