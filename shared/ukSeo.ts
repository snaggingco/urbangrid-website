export const ukServices = [
  ["property-snagging/new-build-snagging", "New-build Snagging"],
  ["property-snagging/post-renovation-inspection", "Post-renovation Inspection"],
  ["property-snagging/dlp-snagging", "Defects Liability Inspection"],
  ["property-snagging/move-in-move-out", "Move-in / Move-out Inspection"],
  ["property-snagging/secondary-market", "Resale Property Inspection"],
  ["property-snagging/developer-projects", "Developer & Contractor Projects"],
  ["rera-services/reserve-fund-study", "Reserve Fund Study"],
  ["rera-services/service-charge-allocation", "Service Charge Allocation"],
  ["rera-services/reinstatement-cost-assessment", "Reinstatement Cost Assessment"],
  ["rera-services/building-completion-audit", "Building Completion Audit"],
  ["rera-services/building-condition-survey", "Building Condition Survey"],
  ["technical-inspections/technical-due-diligence", "Technical Due Diligence"],
  ["technical-inspections/dilapidation-survey", "Dilapidation Survey"],
  ["technical-inspections/thermographic-survey", "Thermographic Survey"],
  ["technical-inspections/noise-survey", "Noise Survey"],
  ["technical-inspections/structural-survey", "Structural Survey"],
  ["asset-tagging-inventory", "Asset Tagging & Inventory"],
] as const;

export const coreTitles: Record<string, string> = {
  "/": "Property Snagging & Inspection in London",
  "/about": "About UrbanGrid UK",
  "/services": "Property Inspection & Building Consultancy Services",
  "/pricing": "Inspection Enquiries & Custom Quotes",
  "/contact": "Contact UrbanGrid UK",
  "/blog": "Property Inspection Insights",
  "/privacy-policy": "Privacy Policy",
  "/terms-of-service": "Terms of Service",
  "/locations/london": "Property Inspections in London & Nearby Areas",
};
export const ukPublicPaths = [
  ...Object.keys(coreTitles), ...ukServices.map(([slug]) => `/services/${slug}`),
];

const serviceDescriptions: Record<string, string> = {
  "new-build-snagging": "New-build snagging inspections in London. Document accessible finishes, fittings and visible defects before handover. Request a property-specific quote.",
  "post-renovation-inspection": "Post-renovation and fit-out inspections in London. Review visible workmanship, finishes and accessible fittings before contractor handover.",
  "dlp-snagging": "Warranty and defects liability inspections in London. Record observable defects for follow-up within the period stated in your property contract.",
  "move-in-move-out": "Move-in and move-out condition inspections in London. Photographic records of accessible rooms, fittings and visible damage for tenancy handover.",
  "secondary-market": "Pre-purchase property inspections in London. Review accessible condition, maintenance concerns and areas needing further investigation before resale purchase.",
  "developer-projects": "Multi-unit property inspections for London developers and contractors. Agree unit coverage, common areas and consistent handover reporting.",
  "reserve-fund-study": "Reserve fund studies in London. Plan future building asset expenditure using condition, remaining-life and replacement-cost assumptions.",
  "service-charge-allocation": "Service charge apportionment in London. Review cost pools, benefiting areas and project data to document a transparent allocation methodology.",
  "reinstatement-cost-assessment": "Reinstatement cost assessments in London. Estimate building rebuilding costs for insurance purposes with the scope and assumptions stated.",
  "building-completion-audit": "Building completion audits in London. Review accessible completed works and available documents against an agreed handover brief.",
  "building-condition-survey": "Building condition surveys in London. Record fabric and accessible services, maintenance priorities and further-investigation recommendations.",
  "technical-due-diligence": "Technical due diligence in London. Review building condition, available technical records and information gaps before property acquisition.",
  "dilapidation-survey": "Dilapidation and condition-record surveys in London. Document visible property conditions for an agreed works or contractual handover scope.",
  "thermographic-survey": "Thermographic surveys in London. Review accessible areas with thermal imaging under suitable conditions and document follow-up recommendations.",
  "noise-survey": "Noise surveys in London. Agree acoustic measurement locations, operating conditions and assessment criteria for your property.",
  "structural-survey": "Visual structural surveys in London. Record accessible cracks and signs of movement; specialist testing and calculations require a separate scope.",
  "asset-tagging-inventory": "Asset tagging and building inventories in London. Create a location-referenced register for maintenance and replacement planning.",
};
const coreDescriptions: Record<string, string> = {
  "/": "Property snagging, residential inspections and building consultancy in London and nearby areas. Request a custom quote from UrbanGrid UK.",
  "/about": "Learn how UrbanGrid UK coordinates property inspections and building consultancy in London, with scope, provider and reporting agreed before work.",
  "/services": "Explore London property snagging, condition surveys, technical inspections and building consultancy. Scope and pricing are agreed for your property.",
  "/pricing": "Request a property-specific inspection quote in GBP for London and nearby areas. Standard residential payment is after inspection and before report release.",
  "/contact": "Contact UrbanGrid UK on +44 7436 597890 or send your London property details to discuss inspection scope, availability and a custom quote.",
  "/locations/london": "Property inspections in London and nearby areas. Share your postcode, property type and inspection stage to confirm coverage and request a quote.",
  "/blog": "Property inspection resources from UrbanGrid UK. Approved UK guidance will be published here when available.",
  "/privacy-policy": "How UrbanGrid UK handles property enquiry details and privacy preferences.",
  "/terms-of-service": "Read the scope, limitations and agreed commercial terms for UrbanGrid UK inspection enquiries.",
};
export function ukPageSeo(path: string) {
  const service = ukServices.find(([slug]) => path === `/services/${slug}`);
  const name = coreTitles[path] || service?.[1];
  if (!name) return null;
  return { title: `${name}${service ? " in London" : ""} | UrbanGrid UK`,
    description: coreDescriptions[path] || serviceDescriptions[service![0].split("/").pop()!],
    keywords: "property inspection London, building consultancy London",
    noindex: ["/blog", "/privacy-policy", "/terms-of-service"].includes(path) };
}
