import { calculateInspectionPrice, serviceFromLabel, formatAed } from "@shared/inspectionPricing";
export const residentialTerms = "100% payment after inspection and before release of the final report.";
export function residentialChatReply(content: string): string | undefined {
  if (/whole.?building|common.?area|reserve fund|\bRFS\b|\bBCS\b|\bBCA\b|\bRCA\b|commercial|consultancy|multi.?unit|multiple (?:units|properties)|(?:[2-9]|[1-9]\d+)\s*(?:units|properties|apartments)|technical (?:survey|inspection)|fit.?out|reinstatement|building condition|structural survey|office|warehouse|retail|service charge|dilapidation|due diligence|thermographic|acoustic|noise survey|building completion|fire safety/i.test(content)) {
    return "This service requires a Custom Quote. Share your project details and UrbanGrid will contact you with a tailored proposal. [SHOW_CUSTOM_QUOTE_LINK]";
  }
  if (!/book|price|pricing|cost|quote|how much|fee|pay|deposit|sq\.?ft|sq\.?\s*ft|square feet/i.test(content)) return;
  const service = serviceFromLabel(content);
  const area = content.match(/([\d]+(?:\.\d{1,2})?)\s*(?:sq\.?\s*ft|sqft|square feet)/i);
  if (service && area && /Booking details:/i.test(content)) {
    const p = calculateInspectionPrice(service, Number(area[1]));
    return `Your calculated residential quote:\nBase: ${formatAed(p.baseMinor)}\nVAT 5%: ${formatAed(p.vatMinor)}\nTotal including VAT: ${formatAed(p.totalMinor)}\n\nNo upfront payment is required. ${residentialTerms} Complete your residential booking below. [SHOW_BOOKING_LINK]`;
  }
  return `Book your single-property residential inspection and see the exact area-based total including VAT. Large villas are eligible. No upfront payment is required. ${residentialTerms} All other assignments require a Custom Quote. [SHOW_BOOKING_LINK]`;
}