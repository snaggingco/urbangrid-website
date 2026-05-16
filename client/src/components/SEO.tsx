import { useEffect } from 'react';
import { useLocation } from 'wouter';

// ─────────────────────────────────────────────────────────────────────────────
// SEO COMPONENT — IMPORTANT NOTES FOR MAINTAINERS
// ─────────────────────────────────────────────────────────────────────────────
// 1. CLIENT-SIDE RENDERING (CSR) LIMITATION
//    Meta tags are injected via useEffect after React hydrates. Googlebot
//    executes JavaScript, but social crawlers (Facebook, LinkedIn, X,
//    WhatsApp) and some search engines do NOT. If shared links show the
//    generic fallback title/description, you need a pre-rendering solution.
//    Recommended: Rendertron, Prerender.io, or extend the existing Express
//    SSR pattern in server/routes.ts (already used for /blog/:slug).
// 2. SCHEMA MARKUP
//    All JSON-LD schema (Organization, LocalBusiness, Service, FAQPage) is now
//    injected server-side via server/schema.ts into the SSR HTML. Googlebot
//    sees it in the initial HTML without requiring JavaScript execution.
// ─────────────────────────────────────────────────────────────────────────────

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
  noindex?: boolean;
}

// SEO data for each route
const routeSEOData: Record<string, Omit<SEOProps, 'canonical'>> = {
  '/': {
    title: 'Property Snagging UAE | UrbanGrid Inspection | Same-Day Reports',
    description: 'UAE\'s trusted property inspection company. Professional snagging services across Dubai, Abu Dhabi, Sharjah. RERA certified, same-day reports. Call +971 567427634.',
    ogImage: 'https://urbangrid.ae/og-image.jpg'
  },
  '/about': {
    title: 'About UrbanGrid - UAE\'s Leading Property Inspection Company',
    description: 'Learn about UrbanGrid\'s professional property inspection team. Trusted snagging experts serving Dubai, Abu Dhabi, and Sharjah with comprehensive inspection services.',
    keywords: 'about urbangrid, property inspection company UAE, professional snagging team Dubai, property experts',
    ogImage: 'https://urbangrid.ae/og-image.jpg'
  },
  '/services': {
    title: 'Property Inspection Services UAE - Snagging & Assessment | UrbanGrid',
    description: 'Professional property inspection services: new build snagging, pre-purchase inspections, villa assessments, apartment snagging across UAE. Same-day reports available.',
    keywords: 'property inspection services UAE, snagging services Dubai, pre-purchase inspection, villa snagging, apartment inspection',
    ogImage: 'https://urbangrid.ae/og-image.jpg'
  },
  '/contact': {
    title: 'Contact UrbanGrid Property Inspection - Dubai Abu Dhabi UAE',
    description: 'Contact UrbanGrid for expert property snagging services. Call +971 567427634 or email info@urbangrid.ae for professional inspection quotes across UAE.',
    keywords: 'contact property inspection UAE, snagging company Dubai, property inspection quote, urbangrid contact',
    ogImage: 'https://urbangrid.ae/og-image.jpg'
  },
  '/blog': {
    title: 'Property Inspection Blog - Expert Tips & Insights | UrbanGrid',
    description: 'Expert property inspection tips, UAE property market insights, and professional snagging advice from UrbanGrid\'s experienced team.',
    keywords: 'property inspection blog UAE, snagging tips Dubai, property market insights, inspection advice',
    ogImage: 'https://urbangrid.ae/og-image.jpg'
  },

  // Property Snagging Services
  '/services/property-snagging/new-build-snagging': {
    title: 'New Build Handover Snagging Dubai Abu Dhabi UAE - Professional Inspection',
    description: 'Expert new build snagging services across UAE. Pre-handover inspections identifying defects before you accept your property. Professional reports, developer liaison, warranty protection.',
    keywords: 'new build snagging UAE, handover inspection Dubai, new property snagging Abu Dhabi, pre-handover inspection, property defects UAE, new build inspection'
  },
  '/services/property-snagging/post-renovation-inspection': {
    title: 'Post Renovation Inspection UAE - Quality Assessment After Fit-out Work',
    description: 'Professional post-renovation inspection services ensuring fit-out work meets specifications. Quality control, compliance verification, warranty documentation across Dubai, Abu Dhabi, UAE.',
    keywords: 'post renovation inspection UAE, fit-out inspection Dubai, renovation quality control, post construction inspection Abu Dhabi, fit-out snagging'
  },
  '/services/property-snagging/dlp-snagging': {
    title: 'DLP Snagging UAE - Defect Liability Period Inspection Before Warranty Expires',
    description: 'Strategic DLP snagging services maximizing warranty claims before expiry. Expert defect identification, developer liaison, free rectification claims across UAE.',
    keywords: 'DLP snagging UAE, defect liability period inspection, warranty snagging Dubai, property warranty claims, DLP inspection Abu Dhabi'
  },
  '/services/property-snagging/move-in-move-out': {
    title: 'Move-in Move-out Inspection UAE - Rental Property Condition Reports',
    description: 'Professional move-in/move-out inspections protecting tenants and landlords. Detailed condition reports, security deposit protection, rental property assessments UAE.',
    keywords: 'move in move out inspection UAE, rental property inspection Dubai, tenant move out inspection, landlord protection UAE, security deposit inspection'
  },
  '/services/property-snagging/secondary-market': {
    title: 'Secondary Market Property Inspection UAE - Pre-Purchase Assessment',
    description: 'Expert pre-purchase inspections for existing properties. Investment protection, hidden defect detection, negotiation support, market analysis across Dubai, Abu Dhabi, UAE.',
    keywords: 'secondary market inspection UAE, pre-purchase inspection Dubai, existing property inspection, investment property assessment, property buying inspection'
  },
  '/services/property-snagging/developer-projects': {
    title: 'Developer Contractor Snagging UAE - Quality Control Project Inspection',
    description: 'Independent quality control inspections for developers and contractors. Project compliance, industry standards verification, client satisfaction assurance across UAE.',
    keywords: 'developer snagging UAE, contractor quality control, project inspection Dubai, construction quality assurance, developer quality control UAE'
  },

  // RERA Services
  '/services/rera-services/reserve-fund-study': {
    title: 'Reserve Fund Study UAE - RERA Compliant Sinking Fund Analysis',
    description: 'Professional reserve fund studies ensuring RERA compliance. Long-term capital planning, financial projections, strata property management across Dubai, Abu Dhabi, UAE.',
    keywords: 'reserve fund study UAE, sinking fund analysis Dubai, RERA compliance UAE, strata management, capital expenditure planning Abu Dhabi'
  },
  '/services/rera-services/service-charge-allocation': {
    title: 'Service Charge Allocation UAE - RERA Compliant Cost Distribution',
    description: 'Expert service charge allocation ensuring fair distribution and RERA compliance. Common area assessment, transparent cost allocation, dispute resolution support UAE.',
    keywords: 'service charge allocation UAE, RERA service charges Dubai, common area costs, strata fees allocation, property management UAE'
  },
  '/services/rera-services/reinstatement-cost-assessment': {
    title: 'Reinstatement Cost Assessment UAE - Insurance Valuation RERA Compliant',
    description: 'Professional reinstatement cost valuations for insurance and RERA compliance. Accurate property valuation, insurance adequacy, regulatory compliance across UAE.',
    keywords: 'reinstatement cost UAE, insurance valuation Dubai, property valuation UAE, RERA valuation, insurance assessment Abu Dhabi'
  },
  '/services/rera-services/building-completion-audit': {
    title: 'Building Completion Audit UAE - RERA Compliance Verification',
    description: 'Comprehensive building completion audits verifying RERA compliance. Plan compliance verification, handover certification, regulatory liaison across Dubai, Abu Dhabi.',
    keywords: 'building completion audit UAE, RERA compliance audit, construction completion Dubai, handover certification UAE, regulatory compliance'
  },
  '/services/rera-services/building-condition-survey': {
    title: 'Building Condition Survey UAE - RERA Compliant Property Assessment',
    description: 'Detailed building condition surveys for RERA compliance and maintenance planning. Asset condition assessment, regulatory reporting, risk identification across UAE.',
    keywords: 'building condition survey UAE, property condition assessment Dubai, RERA building survey, maintenance planning UAE, asset condition Abu Dhabi'
  },

  // Technical Inspections
  '/services/technical-inspections/technical-due-diligence': {
    title: 'Technical Due Diligence UAE - Property Investment Risk Assessment',
    description: 'Comprehensive technical due diligence for property acquisitions. Investment risk assessment, structural analysis, compliance verification across Dubai, Abu Dhabi, UAE.',
    keywords: 'technical due diligence UAE, property investment assessment Dubai, acquisition inspection, investment risk analysis UAE, property due diligence'
  },
  '/services/technical-inspections/dilapidation-survey': {
    title: 'Dilapidation Survey UAE - Construction Impact Assessment',
    description: 'Professional dilapidation surveys documenting property condition before/after construction. Legal protection, damage documentation, expert witness services UAE.',
    keywords: 'dilapidation survey UAE, construction impact assessment Dubai, property damage survey, legal documentation UAE, expert witness inspection'
  },
  '/services/technical-inspections/thermographic-survey': {
    title: 'Thermographic Survey UAE - Thermal Imaging Property Inspection',
    description: 'Advanced thermographic surveys detecting energy losses and hidden defects. Thermal imaging inspection, moisture detection, electrical issues across Dubai, Abu Dhabi.',
    keywords: 'thermographic survey UAE, thermal imaging inspection Dubai, energy audit UAE, moisture detection Abu Dhabi, thermal property inspection'
  },
  '/services/technical-inspections/noise-survey': {
    title: 'Noise Survey UAE - Acoustic Assessment Regulatory Compliance',
    description: 'Professional noise surveys ensuring regulatory compliance. Acoustic assessments, noise level measurement, habitability standards verification across UAE.',
    keywords: 'noise survey UAE, acoustic assessment Dubai, noise level testing, sound measurement UAE, acoustic compliance Abu Dhabi'
  },
  '/services/technical-inspections/structural-survey': {
    title: 'Structural Survey UAE - Building Integrity Safety Assessment',
    description: 'Expert structural surveys examining building integrity and safety. Load-bearing analysis, building code compliance, structural engineering assessment across UAE.',
    keywords: 'structural survey UAE, building integrity assessment Dubai, structural inspection, load bearing analysis UAE, structural safety Abu Dhabi'
  },

  // Location pages
  '/locations/dubai': {
    title: 'Snagging Company Dubai | Property Inspection Services | UrbanGrid',
    description: 'Dubai\'s trusted property snagging company. Independent inspection for Emaar, Damac, Sobha, Nakheel handovers across Downtown Dubai, Marina, Palm Jumeirah, JVC & all areas. Reports in 24 hours.',
    keywords: 'snagging company dubai, property inspection dubai, property snagging dubai, snagging dubai, home inspection dubai, new build snagging dubai, apartment snagging dubai, villa inspection dubai'
  },
  '/locations/abu-dhabi': {
    title: 'Snagging Company Abu Dhabi | Property Inspection | UrbanGrid',
    description: 'Abu Dhabi\'s trusted property snagging company. Independent inspection across Yas Island, Al Reem, Saadiyat, Al Raha and all communities. Aldar, Imkan & all developers. Reports in 24 hours.',
    keywords: 'snagging company abu dhabi, property inspection abu dhabi, property snagging abu dhabi, snagging abu dhabi, home inspection abu dhabi, villa inspection abu dhabi'
  },
  '/locations/sharjah': {
    title: 'Snagging Company Sharjah | Property Inspection Services | UrbanGrid',
    description: 'Sharjah\'s trusted property snagging company. Independent inspection across Aljada, Hayyan, Maryam Island, Al Zahia and all Sharjah communities. Reports in 24 hours.',
    keywords: 'snagging company sharjah, property inspection sharjah, property snagging sharjah, snagging sharjah, home inspection sharjah, Aljada snagging, Arada inspection'
  },
  '/locations/ajman': {
    title: 'Snagging Company Ajman | Property Inspection Services | UrbanGrid',
    description: 'Professional property snagging and inspection in Ajman. ARRA-compliant process across Emirates City, Al Rashidiya, Al Nuaimia and all Ajman communities. Reports in 24 hours.',
    keywords: 'snagging company ajman, property inspection ajman, property snagging ajman, snagging ajman, home inspection ajman'
  },
  '/locations/ras-al-khaimah': {
    title: 'Snagging Company Ras Al Khaimah | Property Inspection | UrbanGrid',
    description: 'Professional property snagging and inspection in Ras Al Khaimah. Al Hamra Village, Mina Al Arab, Al Marjan Island and all RAK communities. Engineer-led, reports in 24 hours.',
    keywords: 'snagging company ras al khaimah, property inspection ras al khaimah, property snagging RAK, snagging ras al khaimah, Al Hamra snagging'
  },
  '/locations/fujairah': {
    title: 'Snagging Company Fujairah | Property Inspection Services | UrbanGrid',
    description: 'Professional property snagging and inspection in Fujairah. Engineer-led inspections across Fujairah City, Dibba, Al Aqah and all communities. Reports in 24 hours.',
    keywords: 'snagging company fujairah, property inspection fujairah, property snagging fujairah, snagging fujairah, home inspection fujairah'
  },
  '/locations/umm-al-quwain': {
    title: 'Snagging Company Umm Al Quwain | Property Inspection | UrbanGrid',
    description: 'Professional property snagging and inspection in Umm Al Quwain. Engineer-led inspections across UAQ City, Al Salam City, UAQ Marina and all communities. Reports in 24 hours.',
    keywords: 'snagging company umm al quwain, property inspection umm al quwain, property snagging UAQ, snagging umm al quwain, home inspection UAQ'
  }
};


export default function SEO({
  title: customTitle,
  description: customDescription,
  keywords: customKeywords,
  ogImage: customOgImage,
  canonical: customCanonical,
  noindex = false
}: SEOProps) {
  const [location] = useLocation();

  useEffect(() => {
    // Get SEO data for current route or use custom props
    const routeData = routeSEOData[location] || {};
    const title = customTitle || routeData.title || 'UrbanGrid Property Inspection - Professional Snagging Services in UAE';
    const description = customDescription || routeData.description || 'Professional property inspection and snagging services across Dubai, Abu Dhabi, and UAE.';
    const keywords = customKeywords || routeData.keywords || 'property snagging UAE, property inspection Dubai, snagging services';
    const ogImage = customOgImage || routeData.ogImage || 'https://urbangrid.ae/og-image.jpg';
    const shouldNoindex = noindex;

    const canonical = customCanonical || `https://urbangrid.ae${location}`;

    document.title = title;

    const updateMetaTag = (name: string, content: string, property?: string) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        if (property) meta.setAttribute('property', name);
        else meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    const updateLinkTag = (rel: string, href: string) => {
      let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', rel);
        document.head.appendChild(link);
      }
      link.setAttribute('href', href);
    };

    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('robots', shouldNoindex ? 'noindex, nofollow' : 'index, follow');
    updateMetaTag('og:title', title, 'property');
    updateMetaTag('og:description', description, 'property');
    updateMetaTag('og:url', canonical, 'property');
    updateMetaTag('og:image', ogImage, 'property');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', ogImage);
    updateLinkTag('canonical', canonical);


  }, [location, customTitle, customDescription, customKeywords, customOgImage, customCanonical, noindex]);

  return null;
}
