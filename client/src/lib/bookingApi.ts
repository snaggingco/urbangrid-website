import type { BookingInput, BookingView } from "@shared/booking";
import { getAttribution } from "./attribution";
import { trackLeadSubmission, trackConfirmedBooking, trackVerifiedPayments } from "./analytics";
export { trackVerifiedPayments } from "./analytics";
export async function bookingConfig() {
  return request<{ csrfToken: string; onlinePaymentEnabled: boolean; testMode: boolean; webhookEnabled: boolean }>("/api/bookings/config");
}
export async function request<T>(url: string, data?: unknown, method = "POST"): Promise<T> {
  const headers: Record<string, string> = {};
  if (data !== undefined) {
    const config = await bookingConfig();
    headers["Content-Type"] = "application/json";
    headers["X-CSRF-Token"] = config.csrfToken;
  }
  const res = await fetch(url, { method: data === undefined ? "GET" : method, credentials: "include",
    headers, ...(data !== undefined ? { body: JSON.stringify(data) } : {}) });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Unable to complete this request.");
  return result as T;
}
export async function createBooking(input: Omit<BookingInput, "attribution">) {
  const attribution = getAttribution();
  const result = await request<{ booking: BookingView; createdLead: boolean; createdBooking: boolean; leadId: number }>("/api/bookings", { ...input, attribution });
  if (result.createdLead) trackLeadSubmission(result.leadId, "residential_booking", attribution);
  if (result.createdBooking) trackConfirmedBooking(result.booking);
  return result;
}
export const getBooking = (reference: string) => request<{ booking: BookingView }>(`/api/bookings/${encodeURIComponent(reference)}`);
export const payBooking = (reference: string, paymentType: "full") =>
  request<{ redirectUrl: string; paymentId: number }>(`/api/bookings/${encodeURIComponent(reference)}/pay`, { paymentType });
export async function verifyBooking(reference: string) {
  const result = await request<{ booking: BookingView }>(`/api/bookings/${encodeURIComponent(reference)}/verify`, {});
  trackVerifiedPayments(result.booking);
  return result;
}