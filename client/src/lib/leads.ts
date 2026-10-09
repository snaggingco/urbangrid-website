import { apiRequest } from "./queryClient";
import { getAttribution } from "./attribution";
import { trackLeadSubmission } from "./analytics";

const requestKeys = new Map<string, string>();

// Reuse an idempotency key for a retry of the same payload, including after a reload.
// Only the SHA-256 digest and random key are stored, never the visitor's form details.
export async function submitLead(endpoint: string, data: Record<string, unknown>): Promise<{ leadId: number }> {
  const bytes = new TextEncoder().encode(endpoint + JSON.stringify(data));
  const digest = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", bytes)))
    .map((n) => n.toString(16).padStart(2, "0")).join("");
  const storageKey = `ug_lead_request_${digest}`;
  let submissionKey = requestKeys.get(digest);
  try { submissionKey ||= sessionStorage.getItem(storageKey) || undefined; } catch {}
  submissionKey ||= crypto.randomUUID();
  requestKeys.set(digest, submissionKey);
  try { sessionStorage.setItem(storageKey, submissionKey); } catch {}
  const attribution = getAttribution();
  const response = await apiRequest("POST", endpoint, {
    ...data, attribution, submissionKey,
  });
  const result = await response.json();
  if (!Number.isInteger(result.leadId) || result.leadId < 1) {
    throw new Error("The server did not confirm a saved lead.");
  }
  trackLeadSubmission(result.leadId, String(data.leadSource || endpoint), attribution);
  return { leadId: result.leadId };
}