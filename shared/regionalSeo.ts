// Only equivalent, public pages on these two deployments are linked. UAE and
// India are deliberately excluded until reciprocal annotations are authorised.
const serviceSlugs = ["new-build-snagging", "post-renovation-inspection", "dlp-snagging", "move-in-move-out", "secondary-market", "developer-projects", "reserve-fund-study", "service-charge-allocation", "reinstatement-cost-assessment", "building-completion-audit", "building-condition-survey", "technical-due-diligence", "dilapidation-survey", "thermographic-survey", "noise-survey", "structural-survey", "asset-tagging-inventory"];
const consultancy = new Set(serviceSlugs.slice(6, 11));
const technical = new Set(serviceSlugs.slice(11));
export function regionalAlternates(path: string, country: "GB" | "SA") {
  path = path.replace(/^\/ar(?=\/|$)/, "") || "/";
  let ukPath = path, saPath = path;
  if (!["/", "/about", "/services", "/pricing", "/contact"].includes(path)) {
    const slug = path.split("/").pop()!;
    if (!serviceSlugs.includes(slug)) return [];
    ukPath = slug === "asset-tagging-inventory" ? `/services/${slug}` : `/services/${consultancy.has(slug) ? "rera-services" : technical.has(slug) ? "technical-inspections" : "property-snagging"}/${slug}`;
    saPath = ukPath.replace("/rera-services/", "/building-consultancy/");
    if (path !== (country === "GB" ? ukPath : saPath)) return [];
  }
  return [
    { language: "en-GB", href: `https://urbangrid.co.uk${ukPath}` },
    { language: "en-SA", href: `https://stratasurveyor.com${saPath}` },
    { language: "ar-SA", href: `https://stratasurveyor.com/ar${saPath === "/" ? "" : saPath}` },
  ];
}
export function regionalLinkTags(path: string, country: "GB" | "SA") {
  return regionalAlternates(path, country).map(({language, href}) => `<link rel="alternate" hreflang="${language}" href="${href}">`).join("\n");
}
