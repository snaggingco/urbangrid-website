import { calculateInspectionPrice, formatAed } from "./inspectionPricing";

export const seoResources = {
  pricing: {
    path: "/pricing",
    title: "Property Inspection & Snagging Cost in Dubai",
    seoTitle: "Snagging Cost Dubai | Inspection Pricing & VAT | UrbanGrid",
    description: "Understand property inspection costs in Dubai: area-based rates, minimum fees, DLP pricing, 5% VAT and worked examples. Pay after inspection, before report release.",
  },
  sampleReport: {
    path: "/sample-report",
    title: "Sample Property Inspection Report",
    seoTitle: "Sample Property Inspection Report | UrbanGrid UAE",
    description: "View an anonymized UrbanGrid inspection report. See photographic findings, defect locations and report limitations before booking a property inspection.",
  },
} as const;

export const pricingExamples = [
  { label: "Stage 1 / new-build, 650 sq ft", service: "new-build-snagging", area: 650, calculation: "650 × AED 1.00 = AED 650; AED 800 minimum applies" },
  { label: "Resale inspection, 1,500 sq ft", service: "secondary-market-inspection", area: 1500, calculation: "1,500 × AED 0.90 = AED 1,350; the rate applies to the whole area" },
  { label: "Post-renovation, 3,500 sq ft", service: "post-renovation-inspection", area: 3500, calculation: "3,500 × AED 0.75 = AED 2,625" },
  { label: "DLP inspection, 650 sq ft", service: "dlp-inspection", area: 650, calculation: "Stage 1 base is AED 800 after the minimum; 50% = AED 400" },
  { label: "Move-in / move-out, 1,200 sq ft", service: "move-in-move-out", area: 1200, calculation: "1,200 × AED 0.50 = AED 600; AED 800 minimum applies" },
].map(example => {
  const price = calculateInspectionPrice(example.service, example.area);
  return { ...example, base: formatAed(price.baseMinor), vat: formatAed(price.vatMinor), total: formatAed(price.totalMinor) };
});

export function resourceSchema(resource: (typeof seoResources)[keyof typeof seoResources]) {
  const canonical = `https://urbangrid.ae${resource.path}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": `${canonical}#webpage`, url: canonical, name: resource.title, description: resource.description,
        isPartOf: { "@id": "https://urbangrid.ae/#website" } },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://urbangrid.ae/" },
        { "@type": "ListItem", position: 2, name: resource.title, item: canonical },
      ] },
      ...(resource.path === "/pricing" ? [{
        "@type": "Service", "@id": `${canonical}#residential-pricing`, name: "Residential property inspection pricing",
        serviceType: "Residential property inspection", url: canonical, areaServed: { "@type": "Country", name: "United Arab Emirates" },
        provider: { "@id": "https://urbangrid.ae/#organization" },
        description: "Area-based residential inspection pricing with 5% VAT. Full payment after physical inspection and before final report release.",
      }] : []),
    ],
  };
}