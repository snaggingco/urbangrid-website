export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export function generateSitemap(urls: SitemapUrl[]): string {
  const urlElements = urls.map(url => {
    let urlXml = `  <url>\n    <loc>${url.loc}</loc>\n`;

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
  const urls: SitemapUrl[] = [
    // Core pages
    { loc: `${baseUrl}/`, priority: 1.0, changefreq: 'weekly' },
    { loc: `${baseUrl}/about`, priority: 0.9, changefreq: 'monthly' },
    { loc: `${baseUrl}/services`, priority: 0.9, changefreq: 'weekly' },
    { loc: `${baseUrl}/contact`, priority: 0.8, changefreq: 'monthly' },
    { loc: `${baseUrl}/blog`, priority: 0.7, changefreq: 'weekly' },

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

    // Location pages
    { loc: `${baseUrl}/locations/dubai`, priority: 0.7, changefreq: 'monthly' },
    { loc: `${baseUrl}/locations/abu-dhabi`, priority: 0.7, changefreq: 'monthly' },
    { loc: `${baseUrl}/locations/sharjah`, priority: 0.7, changefreq: 'monthly' },
    { loc: `${baseUrl}/locations/ajman`, priority: 0.6, changefreq: 'monthly' },
    { loc: `${baseUrl}/locations/ras-al-khaimah`, priority: 0.6, changefreq: 'monthly' },
    { loc: `${baseUrl}/locations/fujairah`, priority: 0.6, changefreq: 'monthly' },
    { loc: `${baseUrl}/locations/umm-al-quwain`, priority: 0.6, changefreq: 'monthly' },

    // Location-specific service pages - Dubai
    { loc: `${baseUrl}/locations/dubai/new-build-snagging`, priority: 0.6, changefreq: 'monthly' },
    { loc: `${baseUrl}/locations/dubai/villa-snagging`, priority: 0.6, changefreq: 'monthly' },
    { loc: `${baseUrl}/locations/dubai/apartment-inspection`, priority: 0.6, changefreq: 'monthly' },
    { loc: `${baseUrl}/locations/dubai/dlp-snagging`, priority: 0.6, changefreq: 'monthly' },

    // Abu Dhabi High-Priority SEO Pages
    { loc: `${baseUrl}/locations/abu-dhabi/property-inspection`, priority: 0.8, changefreq: 'monthly' },
    { loc: `${baseUrl}/locations/abu-dhabi/property-inspection-companies`, priority: 0.8, changefreq: 'monthly' },

    // Dubai Enhanced SEO Pages
    { loc: `${baseUrl}/locations/dubai/property-inspection`, priority: 0.8, changefreq: 'monthly' },
    { loc: `${baseUrl}/locations/dubai/property-inspection-companies`, priority: 0.8, changefreq: 'monthly' },

    // Location-specific service pages - Sharjah
    { loc: `${baseUrl}/locations/sharjah/new-build-snagging`, priority: 0.6, changefreq: 'monthly' },
    { loc: `${baseUrl}/locations/sharjah/villa-snagging`, priority: 0.6, changefreq: 'monthly' },
    { loc: `${baseUrl}/locations/sharjah/apartment-inspection`, priority: 0.6, changefreq: 'monthly' },

    // Snagging Company Pages - High Priority
    { loc: `${baseUrl}/locations/dubai/snagging-company`, priority: 0.9, changefreq: 'monthly' },
    { loc: `${baseUrl}/locations/abu-dhabi/snagging-company`, priority: 0.9, changefreq: 'monthly' },
    { loc: `${baseUrl}/locations/sharjah/snagging-company`, priority: 0.9, changefreq: 'monthly' },
  ];

  // Add blog posts
  blogPosts.forEach(post => {
    urls.push({
      loc: `${baseUrl}/blog/${post.slug}`,
      priority: 0.5,
      changefreq: 'weekly',
      lastmod: post.updatedAt.toISOString().split('T')[0]
    });
  });

  return urls;
}