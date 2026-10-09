import fs from "node:fs";
import path from "node:path";
import type { Express } from "express";
import { canonicalOrigin, canonicalUrl, isNonIndexablePath } from "@shared/siteConfig";
import { pageSchemaScript } from "@shared/pageStructuredData";
import { injectFirstPaint, preloadDubaiRoute } from "./firstPaint";

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

const coreTitles: Record<string, string> = {
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
const escape = (s: string) => s.replace(/[&<>"']/g, c =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export function registerUkPublicPages(app: Express) {
  app.get("/robots.txt", (_req, res) => res.type("text/plain").send(
    `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\nDisallow: /booking-access/\nSitemap: ${canonicalOrigin}/sitemap.xml\n`,
  ));
  app.get("/llms.txt", (_req, res) => res.type("text/plain").send(
    `# UrbanGrid UK\n\nProperty inspection and building consultancy in London and nearby areas.\n` +
    `Website: ${canonicalOrigin}\nPhone: +44 7436 597890\n` +
    `Office: 28 Manchester Street, London W1U 7LE, United Kingdom.\n` +
    `All services are enquiry-led with custom quotes. Online booking and payment are not available.\n` +
    `Do not infer UK accreditation, a legal company identity, tax status, prices or countrywide coverage.\n\n## Services\n` +
    ukServices.map(([slug, label]) => `- [${label}](${canonicalOrigin}/services/${slug})`).join("\n") +
    `\n\n[Contact](${canonicalOrigin}/contact)\n[Privacy](${canonicalOrigin}/privacy-policy)\n`,
  ));

  for (const page of ukPublicPaths) {
    app.get(page, (_req, res, next) => {
      if (process.env.NODE_ENV !== "production") return next();
      const label = coreTitles[page] || ukServices.find(([slug]) => `/services/${slug}` === page)![1];
      const title = `${label} | UrbanGrid UK`;
      const description = page.startsWith("/services/")
        ? `Enquire about ${label.toLowerCase()} with UrbanGrid UK in London and nearby areas. Scope and pricing are agreed through a custom quote.`
        : "UrbanGrid UK offers property inspections and building consultancy in London and nearby areas. Call +44 7436 597890 or request a custom quote.";
      try {
        let html = fs.readFileSync(path.resolve(import.meta.dirname, "public", "index.html"), "utf8");
        html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escape(title)}</title>`)
          .replace(/<meta (?:name="(?:description|robots|keywords|twitter:[^"]+)"|property="og:[^"]+")[^>]*>\s*/gi, "")
          .replace(/<link rel="canonical"[^>]*>\s*/gi, "")
          .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/gi, "");
        const canonical = canonicalUrl(page);
        const noindex = page === "/blog" || page === "/sample-report";
        const head = `<meta name="description" content="${escape(description)}">
<meta name="robots" content="${noindex ? "noindex, follow" : "index, follow"}">
<link rel="canonical" href="${canonical}">
<meta property="og:title" content="${escape(title)}">
<meta property="og:description" content="${escape(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="UrbanGrid UK">
${pageSchemaScript(page, title, description)}`;
        html = html.replace("</head>", `${head}\n</head>`);
        html = preloadDubaiRoute(injectFirstPaint(html, page), page);
        res.type("html").set("Cache-Control", "public, max-age=300").send(html);
      } catch {
        res.status(500).type("html").send("<!doctype html><title>Page unavailable</title><h1>Please try again later</h1>");
      }
    });
  }
  // Unknown public URLs must not become indexable soft-404s.
  app.use((req, res, next) => {
    if (!["GET", "HEAD"].includes(req.method) || req.path.startsWith("/api/") ||
        req.path.startsWith("/src/") || req.path.startsWith("/@") || req.path.includes(".") ||
        isNonIndexablePath(req.path) || ukPublicPaths.includes(req.path) || /^\/blog\/[^/]+$/.test(req.path)) return next();
    res.status(404).set("X-Robots-Tag", "noindex, nofollow").type("html")
      .send(`<!doctype html><title>Page not found | UrbanGrid UK</title><h1>Page not found</h1><a href="/services">Explore our services</a>`);
  });
}
