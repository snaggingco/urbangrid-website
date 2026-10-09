// Engagement is never silently promoted into a commercial conversion.
export const commercialStages = {
  generate_lead: "lead_submitted",
  whatsapp_click: "whatsapp_intent",
  call_click: "call_intent",
  booking_confirmed: "booking_confirmed",
  purchase: "payment_received",
} as const;

export function measurementClassification(name: string) {
  const stage = commercialStages[name as keyof typeof commercialStages];
  return {
    event_category: stage ? "commercial" : "engagement",
    commercial_stage: stage || "none",
    is_primary_business_conversion: Boolean(stage),
  };
}