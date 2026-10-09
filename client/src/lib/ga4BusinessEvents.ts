import { getConsentState } from "./consent";
import { measurementClassification } from "@shared/commercialEvents";
import { measurementAllowed, UAE_MEASUREMENT } from "@shared/network/measurement";

const measurementId = UAE_MEASUREMENT.measurementId!;

declare global {
  interface Window {
    __ugTrackedLeadIds?: Set<number>;
  }
}

export function canMeasureBusinessEvents(): boolean {
  return measurementAllowed(UAE_MEASUREMENT, window.location.hostname, getConsentState().choice);
}

export function sendGa4BusinessEvent(
  event: Record<string, unknown>,
  parameters: Record<string, unknown>,
): void {
  if (!canMeasureBusinessEvents()) return;
  window.dataLayer ||= [];
  // Google's event command also becomes a GTM custom event with this same name.
  // ONE queue entry therefore serves both paths. A separate plain event push
  // would fire the Ads custom-event triggers twice, even with GA4-only send_to.
  // Retain the original top-level custom-event/context fields on the queued
  // entry for existing observers; Google reads the standard argument indexes.
  const queueCommand = function (..._args: unknown[]) {
    window.dataLayer.push(Object.assign(arguments, event));
  };
  const classification = measurementClassification(String(event.event));
  Object.assign(event, classification);
  queueCommand("event", String(event.event), { ...parameters, ...classification, send_to: measurementId });
}