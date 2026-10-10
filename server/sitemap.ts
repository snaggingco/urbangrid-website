import { ukPageSeo } from "@shared/ukSeo";
import { canonicalOrigin, canonicalUrl, isNonIndexablePath } from "@shared/siteConfig";

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export function generateSitemap(urls: SitemapUrl[]): string {
  const urlElements = urls.map(url => {
    const escapedLoc = url.loc.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    let urlXml = `  <url>\n    <loc>${escapedLoc}</loc>\n`;

    if (url.lastmod) {
      urlXml += `    <lastmod>${url.lastmod}</lastmod>\n`;
    }

    if (url.changefreq) {
      urlXml += `    <changefreq>${url.changefreq}</changefreq>\n`;
    }

    if (url.priority !== undefined) {
      urlXml += `    <priority>${url.priority}</priority>\n`;
    }

    urlXml += `  </url>`;
    return urlXml;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
}

export function getSitemapUrls(baseUrl: string, blogPosts: Array<{slug: string, updatedAt: Date}>): SitemapUrl[] {
  baseUrl = canonicalOrigin;
  const urls: SitemapUrl[] = [
    // Core pages
    { loc: `${baseUrl}/`, priority: 1.0, changefreq: 'weekly' },
    { loc: `${baseUrl}/about`, priority: 0.9, changefreq: 'monthly' },
    { loc: `${baseUrl}/services`, priority: 0.9, changefreq: 'weekly' },
    { loc: `${baseUrl}/pricing`, priority: 0.8, changefreq: 'monthly' },
    { loc: `${baseUrl}/contact`, priority: 0.8, changefreq: 'monthly' },
    { loc: `${baseUrl}/privacy-policy`, priority: 0.3, changefreq: 'yearly' },
    { loc: `${baseUrl}/terms-of-service`, priority: 0.3, changefreq: 'yearly' },

    // Property Snagging Services
    { loc: `${baseUrl}/services/property-snagging/new-build-snagging`, priority: 0.9, changefreq: 'monthly' },
    { loc: `${baseUrl}/services/property-snagging/post-renovation-inspection`, priority: 0.8, changefreq: 'monthly' },
    { loc: `${baseUrl}/services/property-snagging/dlp-snagging`, priority: 0.8, changefreq: 'monthly' },
    { loc: `${baseUrl}/services/property-snagging/move-in-move-out`, priority: 0.8, changefreq: 'monthly' },
    { loc: `${baseUrl}/services/property-snagging/secondary-market`, priority: 0.8, changefreq: 'monthly' },
    { loc: `${baseUrl}/services/property-snagging/developer-projects`, priority: 0.8, changefreq: 'monthly' },

    // RERA Services
    { loc: `${baseUrl}/services/rera-services/reserve-fund-study`, priority: 0.8, changefreq: 'monthly' },
    { loc: `${baseUrl}/services/rera-services/service-charge-allocation`, priority: 0.8, changefreq: 'monthly' },
    { loc: `${baseUrl}/services/rera-services/reinstatement-cost-assessment`, priority: 0.8, changefreq: 'monthly' },
    { loc: `${baseUrl}/services/rera-services/building-completion-audit`, priority: 0.8, changefreq: 'monthly' },
    { loc: `${baseUrl}/services/rera-services/building-condition-survey`, priority: 0.8, changefreq: 'monthly' },

    // Technical Inspection Services
    { loc: `${baseUrl}/services/technical-inspections/technical-due-diligence`, priority: 0.8, changefreq: 'monthly' },
    { loc: `${baseUrl}/services/technical-inspections/dilapidation-survey`, priority: 0.8, changefreq: 'monthly' },
    { loc: `${baseUrl}/services/technical-inspections/thermographic-survey`, priority: 0.8, changefreq: 'monthly' },
    { loc: `${baseUrl}/services/technical-inspections/noise-survey`, priority: 0.8, changefreq: 'monthly' },
    { loc: `${baseUrl}/services/technical-inspections/structural-survey`, priority: 0.8, changefreq: 'monthly' },
    { loc: `${baseUrl}/services/asset-tagging-inventory`, priority: 0.8, changefreq: 'monthly' },

    // Only verified UK coverage belongs in the UK sitemap.
    { loc: `${baseUrl}/locations/london`, priority: 0.8, changefreq: 'monthly' },

    // Note: blog posts below are added dynamically from the DB (status='published' only)
  ];

  // Add published blog posts (deduped, archived posts are filtered at the DB layer)
  const seen = new Set(urls.map(u => u.loc));
  blogPosts.forEach(post => {
    const loc = `${baseUrl}/blog/${post.slug}`;
    if (seen.has(loc)) return;
    seen.add(loc);
    urls.push({
      loc,
      priority: 0.6,
      changefreq: 'weekly',
      lastmod: post.updatedAt.toISOString().split('T')[0]
    });
  });

  return urls.filter(url => !isNonIndexablePath(new URL(url.loc).pathname) && !ukPageSeo(new URL(url.loc).pathname)?.noindex)
    .map(url => ({ ...url, loc: canonicalUrl(url.loc) }));
}