import fs from "node:fs";
import path from "node:path";
import type { Express } from "express";
import { canonicalOrigin, canonicalUrl, isNonIndexablePath } from "@shared/siteConfig";
import { pageSchemaScript } from "@shared/pageStructuredData";
import { injectFirstPaint, preloadDubaiRoute } from "./firstPaint";

import { ukServices, ukPublicPaths, ukPageSeo } from "@shared/ukSeo";
import { regionalLinkTags } from "@shared/regionalSeo";
export { ukServices, ukPublicPaths };
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
      const { title, description, noindex } = ukPageSeo(page)!;
      try {
        let html = fs.readFileSync(path.resolve(import.meta.dirname, "public", "index.html"), "utf8");
        html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escape(title)}</title>`)
          .replace(/<meta (?:name="(?:description|robots|keywords|twitter:[^"]+)"|property="og:[^"]+")[^>]*>\s*/gi, "")
          .replace(/<link rel="canonical"[^>]*>\s*/gi, "")
          .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/gi, "");
        const canonical = canonicalUrl(page);
        const head = `<meta name="description" content="${escape(description)}">
<meta name="robots" content="${noindex ? "noindex, follow" : "index, follow"}">
<link rel="canonical" href="${canonical}">
<meta property="og:title" content="${escape(title)}">
<meta property="og:description" content="${escape(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="UrbanGrid UK">
${regionalLinkTags(page, "GB")}
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
