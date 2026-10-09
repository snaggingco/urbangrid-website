export const assetTaggingService = {
  path: "/services/asset-tagging-inventory",
  title: "Asset Tagging & Inventory",
  seoTitle: "Asset Tagging & Inventory | UrbanGrid UK",
  description:
    "Building asset tagging and inventory in London and nearby areas. Create an asset register to support building management, maintenance and lifecycle planning.",
};

export function assetTaggingSchema() {
  const canonical = `https://urbangrid.co.uk${assetTaggingService.path}`;
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
          "@id": "https://urbangrid.co.uk/#organization",
          name: "UrbanGrid UK",
          url: "https://urbangrid.co.uk",
        },
        areaServed: { "@type": "AdministrativeArea", name: "London and nearby areas" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://urbangrid.co.uk/" },
          { "@type": "ListItem", position: 2, name: "Services", item: "https://urbangrid.co.uk/services" },
          { "@type": "ListItem", position: 3, name: assetTaggingService.title, item: canonical },
        ],
      },
    ],
  };
}