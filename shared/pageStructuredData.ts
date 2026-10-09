import { serviceFAQs, type FAQEntry } from "./faqs";
import { homepageFAQs } from "./publicFAQs";
import { resourceSchema, seoResources } from "./seoResources";
import { assetTaggingSchema } from "./assetTagging";

const base = "https://urbangrid.co.uk";
const address = {
  "@type": "PostalAddress",
  streetAddress: "28 Manchester Street",
  addressLocality: "London",
  postalCode: "W1U 7LE",
  addressCountry: "GB",
};

export function breadcrumbData(items: { name: string; item: string }[]) {
  return { "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: items.map((entry, index) => ({ "@type": "ListItem", position: index + 1, ...entry })) };
}

export function faqData(faqs: FAQEntry[]) {
  return { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(faq => ({
    "@type": "Question", name: faq.q, acceptedAnswer: { "@type": "Answer", text: faq.a },
  })) };
}

export function pageStructuredData(path: string, title: string, description: string) {
  if (path === "/pricing") return resourceSchema(seoResources.pricing);
  if (path === "/sample-report") return resourceSchema(seoResources.sampleReport);
  if (path === "/services/asset-tagging-inventory") return assetTaggingSchema();
  const canonical = `${base}${path === "/" ? "/" : path}`;
  const nodes: Record<string, unknown>[] = [];
  if (path === "/") {
    nodes.push(
      { "@type": "Organization", "@id": `${base}/#organization`, name: "UrbanGrid UK",
        alternateName: "UrbanGrid", url: `${base}/`, logo: `${base}/logo.svg`,
        telephone: "+447436597890", address, areaServed: { "@type": "AdministrativeArea", name: "London and nearby areas" } },
      { "@type": "LocalBusiness", "@id": `${base}/#london-office`, name: "UrbanGrid UK",
        url: `${base}/`, telephone: "+447436597890", address,
        areaServed: { "@type": "AdministrativeArea", name: "London and nearby areas" } },
      { "@type": "WebSite", "@id": `${base}/#website`, name: "UrbanGrid UK", url: `${base}/` },
      faqData(homepageFAQs),
    );
  } else {
    if (path === "/about") {
      nodes.push({ "@type": "Organization", "@id": `${base}/#organization`, name: "UrbanGrid UK", url: `${base}/` });
    }
    const items = [{ name: "Home", item: `${base}/` }];
    if (path.startsWith("/services/")) items.push({ name: "Services", item: `${base}/services` });
    items.push({ name: title.replace(/ [-|] UrbanGrid.*$/, ""), item: canonical });
    nodes.push(breadcrumbData(items));
    if (path.startsWith("/services/") || path === "/locations/london") {
      nodes.push({ "@type": "Service", "@id": `${canonical}#service`, name: title.replace(/ [-|] UrbanGrid.*$/, ""),
        description, url: canonical, serviceType: path === "/locations/london" ? "Property inspection coverage" : title.replace(/ [-|] UrbanGrid.*$/, ""),
        provider: { "@type": "Organization", "@id": `${base}/#organization`, name: "UrbanGrid UK", url: `${base}/` },
        areaServed: { "@type": "AdministrativeArea", name: "London and nearby areas" } });
      const faqs = path === "/locations/london" ? homepageFAQs : serviceFAQs[path.split("/").pop() || ""];
      if (faqs?.length) nodes.push(faqData(faqs));
    } else {
      nodes.push({ "@type": "WebPage", url: canonical, name: title, description,
        ...(path === "/about" ? { about: { "@id": `${base}/#organization` } } : {}) });
    }
  }
  return { "@context": "https://schema.org", "@graph": nodes };
}

export function pageSchemaScript(path: string, title: string, description: string) {
  return `<script type="application/ld+json">${JSON.stringify(pageStructuredData(path, title, description)).replace(/</g, "\\u003c")}</script>`;
}
