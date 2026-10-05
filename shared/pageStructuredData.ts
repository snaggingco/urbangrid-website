import { serviceFAQs, type FAQEntry } from "./faqs";
import { homepageFAQs, dubaiFAQs } from "./publicFAQs";
import { resourceSchema, seoResources } from "./seoResources";
import { assetTaggingSchema } from "./assetTagging";
import { companyRegistration, companyRegistrationIdentifiers } from "./companyRegistration";

const base = "https://urbangrid.ae";
export function breadcrumbData(items: { name: string; item: string }[]) {
  return { "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: items.map((entry, index) => ({ "@type": "ListItem", position: index + 1, ...entry })) };
}
export function faqData(faqs: FAQEntry[]) {
  return { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(faq => ({
    "@type": "Question", name: faq.q, acceptedAnswer: { "@type": "Answer", text: faq.a },
  })) };
}
// Shared by initial server HTML and client navigation; no hidden fallback FAQs.
export function pageStructuredData(path: string, title: string, description: string) {
  if (path === "/pricing") return resourceSchema(seoResources.pricing);
  if (path === "/sample-report") return resourceSchema(seoResources.sampleReport);
  if (path === "/services/asset-tagging-inventory") return assetTaggingSchema();
  const canonical = `${base}${path === "/" ? "/" : path}`;
  const nodes: Record<string, unknown>[] = [];
  if (path === "/") {
    nodes.push(
      { "@type": "Organization", "@id": `${base}/#organization`, name: "UrbanGrid Property Inspection",
        legalName: companyRegistration.companyName, identifier: companyRegistrationIdentifiers(),
        alternateName: "UrbanGrid", url: `${base}/`, logo: `${base}/logo.svg`,
        contactPoint: { "@type": "ContactPoint", telephone: "+971585686852", contactType: "customer service", email: "info@urbangrid.ae" },
        address: { "@type": "PostalAddress", addressCountry: "AE", addressRegion: "Dubai", addressLocality: "Dubai" },
        areaServed: { "@type": "Country", name: "United Arab Emirates" } },
      { "@type": "LocalBusiness", "@id": `${base}/#dubai-office`, name: "UrbanGrid Property Inspection",
        legalName: companyRegistration.companyName, identifier: companyRegistrationIdentifiers(),
        url: `${base}/`, telephone: "+971585686852", email: "info@urbangrid.ae",
        address: { "@type": "PostalAddress", streetAddress: "Office 1205, Business Bay", addressLocality: "Dubai", addressRegion: "Dubai", addressCountry: "AE" },
        priceRange: "$$", openingHours: "Mo-Sa 08:00-18:00" },
      { "@type": "WebSite", "@id": `${base}/#website`, name: "UrbanGrid Property Inspection", url: `${base}/` },
      faqData(homepageFAQs),
    );
  } else {
    if (path === "/about") {
      nodes.push({ "@type": "Organization", "@id": `${base}/#organization`,
        name: "UrbanGrid Property Inspection", legalName: companyRegistration.companyName,
        url: `${base}/`, identifier: companyRegistrationIdentifiers() });
    }
    const items = [{ name: "Home", item: `${base}/` }];
    if (path.startsWith("/services/")) items.push({ name: "Services", item: `${base}/services` });
    items.push({ name: title.replace(/ [-|] UrbanGrid.*$/, ""), item: canonical });
    nodes.push(breadcrumbData(items));
    if (path.startsWith("/services/") || path.startsWith("/locations/")) {
      nodes.push({ "@type": "Service", "@id": `${canonical}#service`, name: title.replace(/ [-|] UrbanGrid.*$/, ""),
        description, url: canonical, serviceType: path.startsWith("/locations/") ? "Property inspection coverage" : title.replace(/ [-|] UrbanGrid.*$/, ""),
        provider: { "@type": "Organization", "@id": `${base}/#organization`, name: "UrbanGrid Property Inspection", url: `${base}/` },
        areaServed: { "@type": "Country", name: "United Arab Emirates" } });
      const faqs = path === "/locations/dubai" ? dubaiFAQs : serviceFAQs[path.split("/").pop() || ""];
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