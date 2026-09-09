// Server-side schema markup generators for SSR HTML injection.
// All JSON-LD is returned as raw HTML <script> tags for serveSPAWithMeta extraHeadTags.
// This ensures Googlebot sees schema in the initial HTML without requiring JavaScript.

import { serviceFAQs } from "../shared/faqs";

// ── Homepage: Organization + LocalBusiness + WebSite ──────────────────────────────────
export function homepageSchema(): string {
  const org = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://urbangrid.ae/#organization",
        "name": "UrbanGrid Property Inspection",
        "alternateName": "UrbanGrid",
        "url": "https://urbangrid.ae",
        "logo": "https://urbangrid.ae/logo.svg",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+971585686852",
          "contactType": "customer service",
          "email": "info@urbangrid.ae"
        },
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "AE",
          "addressRegion": "Dubai",
          "addressLocality": "Dubai"
        },
        "areaServed": { "@type": "Country", "name": "United Arab Emirates" }
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://urbangrid.ae/#dubai-office",
        "name": "UrbanGrid Property Snagging Inspection",
        "description": "Professional property inspection and snagging services across UAE",
        "url": "https://urbangrid.ae",
        "telephone": "+971585686852",
        "email": "info@urbangrid.ae",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Office 1205, Business Bay",
          "addressLocality": "Dubai",
          "addressRegion": "Dubai",
          "addressCountry": "AE"
        },
        "priceRange": "$$",
        "openingHours": "Mo-Sa 08:00-18:00"
      },
      {
        "@type": "WebSite",
        "name": "UrbanGrid Property Inspection",
        "url": "https://urbangrid.ae",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://urbangrid.ae/blog?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
    ]
  };
  return `<script type="application/ld+json">${JSON.stringify(org)}</script>`;
}

// ── Location pages: LocalBusiness per emirate ───────────────────────────────
export function locationSchema(emirate: string, emirateTitle: string, description: string): string {
  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `https://urbangrid.ae/locations/${emirate}#service`,
    "name": `UrbanGrid Property Inspection ${emirateTitle}`,
    "description": description,
    "url": `https://urbangrid.ae/locations/${emirate}`,
    "telephone": "+971585686852",
    "email": "info@urbangrid.ae",
    "areaServed": { "@type": "City", "name": emirateTitle, "addressCountry": "AE" },
    "provider": {
      "@type": "Organization",
      "@id": "https://urbangrid.ae/#organization",
      "name": "UrbanGrid Property Inspection",
      "url": "https://urbangrid.ae"
    },
    "serviceType": "Property inspection and snagging"
  };
  return `<script type="application/ld+json">${JSON.stringify(localBusiness)}</script>`;
}

// ── Service pages: Service + FAQPage ─────────────────────────────────────────
export function serviceSchema(servicePath: string, serviceTitle: string, serviceDesc: string, serviceCategory: string, canonical: string): string {
  const serviceJson = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": serviceTitle,
    "description": serviceDesc,
    "provider": {
      "@type": "Organization",
      "@id": "https://urbangrid.ae/#organization",
      "name": "UrbanGrid Property Snagging Inspection",
      "telephone": "+971585686852",
      "email": "info@urbangrid.ae",
      "url": "https://urbangrid.ae",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "AE",
        "addressRegion": "Dubai"
      },
      "priceRange": "$$"
    },
    "areaServed": [
      { "@type": "City", "name": "Dubai", "addressCountry": "AE" },
      { "@type": "City", "name": "Abu Dhabi", "addressCountry": "AE" },
      { "@type": "City", "name": "Sharjah", "addressCountry": "AE" }
    ],
    "serviceType": serviceCategory,
    "category": "Property Snagging Inspection Services",
    "url": canonical
  };

  const slug = servicePath.split('/').pop() || '';
  const faqs = serviceFAQs[slug] || [
    { q: `What is ${serviceCategory}?`, a: serviceDesc },
    { q: 'How long does the inspection take?', a: 'Inspection duration varies by service type and property size, typically ranging from 2-8 hours for comprehensive assessments.' },
    { q: 'How quickly do you deliver inspection reports?', a: 'We deliver detailed inspection reports within 24 hours, complete with photographic evidence and professional recommendations.' }
  ];

  const faqJson = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": { "@type": "Answer", "text": faq.a }
    }))
  };

  return `<script type="application/ld+json">${JSON.stringify(serviceJson)}</script>` +
         `<script type="application/ld+json">${JSON.stringify(faqJson)}</script>`;
}
