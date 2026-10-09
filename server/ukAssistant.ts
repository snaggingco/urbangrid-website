export function ukAssistantReply(message: string) {
  if (/price|cost|quote|vat|£|aed|pay|book|deposit/i.test(message)) {
    return "All UrbanGrid UK services are offered by enquiry and custom quote. Scope, pricing, applicable tax and payment terms are confirmed by the team; online booking and payment are not available. Request a quote below or call +44 7436 597890. [SHOW_CUSTOM_QUOTE_LINK]";
  }
  if (/rera|rics|certif|accredit|regulat|licen|qualif|approv/i.test(message)) {
    return "UK professional accreditations or regulatory approvals have not been verified for this site. We do not describe UAE registration as UK approval. Please ask the team to confirm the qualifications and agreed scope needed for your project. [SHOW_CUSTOM_QUOTE_LINK]";
  }
  if (/contact|phone|address|where|location|dubai|uae|london|cover|email|whatsapp/i.test(message)) {
    return "UrbanGrid UK serves London and nearby areas. Our listed office is 28 Manchester Street, London W1U 7LE, United Kingdom. Call +44 7436 597890 or use the enquiry form. Please confirm availability for your property with the team. [SHOW_CUSTOM_QUOTE_LINK]";
  }
  if (/report|sample|repair|guarantee|refund|legal/i.test(message)) {
    return "Inspection and reporting scope is agreed through a custom quote. No approved UK sample report, repair guarantee or standard payment/refund terms have been verified for this launch. The team can explain the deliverables for your project. [SHOW_CUSTOM_QUOTE_LINK]";
  }
  return "Welcome to UrbanGrid UK. We offer property snagging, new-build and resale inspections, post-renovation and defects-liability checks, move-in/move-out inspections, building consultancy, reserve fund studies, service-charge allocation, reinstatement assessments, completion audits, condition surveys, asset inventory, and technical, structural, dilapidation, thermal and noise surveys. Tell the team your service, property location and requirements for a custom quote. [SHOW_CUSTOM_QUOTE_LINK]";
}
