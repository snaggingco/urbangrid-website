import { useEffect } from "react";
import { useLocation } from "wouter";
import { pageStructuredData } from "@shared/pageStructuredData";
import { canonicalUrl, isNonIndexablePath } from "@shared/siteConfig";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
  noindex?: boolean;
}

const ogImage = "https://urbangrid.co.uk/london-property-editorial.jpg";
const serviceNames: Record<string, string> = {
  "new-build-snagging": "New Build / Pre-Handover Inspection",
  "post-renovation-inspection": "Post-Renovation Inspection",
  "dlp-snagging": "Warranty Period Inspection",
  "move-in-move-out": "Move-In / Move-Out Inspection",
  "secondary-market": "Resale Property Inspection",
  "developer-projects": "Developer & Contractor Projects",
  "reserve-fund-study": "Reserve Fund Study",
  "service-charge-allocation": "Service Charge Allocation",
  "reinstatement-cost-assessment": "Reinstatement Cost Assessment",
  "building-completion-audit": "Building Completion Audit",
  "building-condition-survey": "Building Condition Survey",
  "technical-due-diligence": "Technical Due Diligence",
  "dilapidation-survey": "Dilapidation Survey",
  "thermographic-survey": "Thermographic Survey",
  "noise-survey": "Noise Survey",
  "structural-survey": "Structural Survey",
};
const routeSEOData: Record<string, Pick<SEOProps, "title" | "description" | "keywords">> = {
  "/": { title: "Property Inspections & Building Consultancy in London | UrbanGrid UK", description: "Residential property inspections and building consultancy for London property owners. Enquiries welcome for London and nearby areas; custom quotes available.", keywords: "property inspection London, building consultancy London, property survey, snagging inspection, custom quote" },
  "/about": { title: "About UrbanGrid UK | Property Inspection & Consultancy", description: "Learn about UrbanGrid UK's inspection and building consultancy services for property owners in London and nearby areas." },
  "/services": { title: "Property Inspection & Building Consultancy Services | UrbanGrid UK", description: "Explore UrbanGrid UK's residential inspections, technical surveys and building consultancy services in London and nearby areas." },
  "/pricing": { title: "Custom Inspection & Consultancy Quotes | UrbanGrid UK", description: "Enquire about a custom quote for property inspection or building consultancy in London and nearby areas." },
  "/contact": { title: "Contact UrbanGrid UK | London Property Enquiries", description: "Send an enquiry to UrbanGrid UK about property inspections or building consultancy in London and nearby areas. Call +44 7436 597890." },
  "/blog": { title: "Property Inspection Insights | UrbanGrid UK", description: "Guidance and information about property inspections and building consultancy from UrbanGrid UK." },
  "/locations/london": { title: "London Property Inspection Coverage | UrbanGrid UK", description: "UrbanGrid UK serves London and nearby areas. Enquire with your property location to confirm availability and request a custom quote." },
  "/services/asset-tagging-inventory": { title: "Asset Tagging & Inventory | UrbanGrid UK", description: "Building asset tagging and inventory in London and nearby areas, supporting property management, maintenance and lifecycle planning." },
};
for (const [slug, name] of Object.entries(serviceNames)) {
  routeSEOData[`/services/${slug === "asset-tagging-inventory" ? "" : slug}`] ||= { title: `${name} | UrbanGrid UK`, description: `${name} for property owners in London and nearby areas. Enquire to discuss scope, availability and a custom quote.` };
}
for (const [slug, name] of Object.entries(serviceNames)) {
  const category = slug.startsWith("reserve-") || slug.startsWith("service-charge") || slug.startsWith("reinstatement") || slug.startsWith("building-") ? "rera-services" :
    ["technical-due-diligence", "dilapidation-survey", "thermographic-survey", "noise-survey", "structural-survey"].includes(slug) ? "technical-inspections" : "property-snagging";
  routeSEOData[`/services/${category}/${slug}`] = { title: `${name} in London | UrbanGrid UK`, description: `${name} for property owners in London and nearby areas. Scope and deliverables are agreed individually; request a custom quote.` };
}

export default function SEO({
  title: customTitle, description: customDescription, keywords: customKeywords,
  ogImage: customOgImage, canonical: customCanonical, noindex = false,
}: SEOProps) {
  const [location] = useLocation();

  useEffect(() => {
    const routeData = routeSEOData[location] || {};
    const title = customTitle || routeData.title || "UrbanGrid UK | Property Inspections & Building Consultancy";
    const description = customDescription || routeData.description || "Property inspection and building consultancy enquiries in London and nearby areas.";
    const keywords = customKeywords || routeData.keywords || "property inspection London, building consultancy London, custom quote";
    const image = customOgImage || ogImage;
    const shouldNoindex = noindex || isNonIndexablePath(location);
    const canonical = canonicalUrl(customCanonical || location);
    document.title = title;

    const updateMetaTag = (name: string, content: string, property?: string) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement("meta");
        if (property) meta.setAttribute("property", name);
        else meta.setAttribute("name", name);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };
    const updateLinkTag = (rel: string, href: string) => {
      let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", rel);
        document.head.appendChild(link);
      }
      link.setAttribute("href", href);
    };
    updateMetaTag("description", description);
    updateMetaTag("keywords", keywords);
    updateMetaTag("robots", shouldNoindex ? "noindex, nofollow" : "index, follow");
    updateMetaTag("og:title", title, "property");
    updateMetaTag("og:description", description, "property");
    updateMetaTag("og:url", canonical, "property");
    updateMetaTag("og:image", image, "property");
    updateMetaTag("og:site_name", "UrbanGrid UK", "property");
    updateMetaTag("twitter:title", title);
    updateMetaTag("twitter:description", description);
    updateMetaTag("twitter:image", image);
    updateLinkTag("canonical", canonical);
    const scripts = Array.from(document.querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"]'));
    const retainedArticle = scripts.find(script => {
      try {
        const data = JSON.parse(script.textContent || "{}");
        return data["@type"] === "BlogPosting" && data.url === canonical;
      } catch { return false; }
    });
    scripts.forEach(script => {
      if (script !== retainedArticle && !(location === "/services/asset-tagging-inventory" && script.id === "asset-tagging-schema")) script.remove();
    });
    if (!shouldNoindex && location !== "/services/asset-tagging-inventory") {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = "public-page-schema";
      script.textContent = JSON.stringify(pageStructuredData(location, title, description));
      document.head.appendChild(script);
    }
  }, [location, customTitle, customDescription, customKeywords, customOgImage, customCanonical, noindex]);

  return null;
}
