export const seoResources = {
  pricing: {
    path: "/pricing",
    title: "Custom Quotes for Property Inspections",
    seoTitle: "Custom Inspection & Consultancy Quotes | UrbanGrid UK",
    description: "Inspection and building consultancy services in London and nearby areas. Enquire to discuss scope, availability and a custom quote.",
  },
  sampleReport: {
    path: "/sample-report",
    title: "Inspection Report Information",
    seoTitle: "Inspection Report Information | UrbanGrid UK",
    description: "Discuss the report format and deliverables for your property inspection enquiry with UrbanGrid UK.",
  },
} as const;

export const pricingExamples: never[] = [];

export function resourceSchema(resource: (typeof seoResources)[keyof typeof seoResources]) {
  const base = "https://urbangrid.co.uk";
  const canonical = `${base}${resource.path}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": `${canonical}#webpage`, url: canonical, name: resource.title, description: resource.description,
        isPartOf: { "@id": `${base}/#website` } },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${base}/` },
        { "@type": "ListItem", position: 2, name: resource.title, item: canonical },
      ] },
    ],
  };
}
