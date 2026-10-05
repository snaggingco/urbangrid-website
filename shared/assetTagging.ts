export const assetTaggingService = {
  path: "/services/asset-tagging-inventory",
  title: "Asset Tagging & Inventory",
  seoTitle: "Asset Tagging & Inventory Dubai & UAE | UrbanGrid",
  description:
    "Building asset tagging and inventory services in Dubai and the UAE. Create an asset register to support building management, maintenance and lifecycle planning.",
};

export function assetTaggingSchema() {
  const canonical = `https://urbangrid.ae${assetTaggingService.path}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${canonical}#service`,
        name: assetTaggingService.title,
        description: assetTaggingService.description,
        url: canonical,
        serviceType: "Building asset tagging and inventory",
        category: "Building Consultancy",
        provider: {
          "@type": "Organization",
          "@id": "https://urbangrid.ae/#organization",
          name: "UrbanGrid",
          url: "https://urbangrid.ae",
        },
        areaServed: { "@type": "Country", name: "United Arab Emirates" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://urbangrid.ae/" },
          { "@type": "ListItem", position: 2, name: "Services", item: "https://urbangrid.ae/services" },
          { "@type": "ListItem", position: 3, name: assetTaggingService.title, item: canonical },
        ],
      },
    ],
  };
}