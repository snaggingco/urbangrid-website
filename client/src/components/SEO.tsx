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
    title: 'Property Snagging Dubai & UAE | From AED 800 | UrbanGrid',
    description: 'Independent property snagging across Dubai, Abu Dhabi and the UAE. Engineer-led inspections reference relevant RERA, NFPA and ASHRAE requirements. Reports in 24 hours.',
    ogImage: 'https://urbangrid.ae/og-image.png'
  },
  '/about': {
    title: 'About UrbanGrid - UAE\'s Leading Property Inspection Company',
    description: 'Learn about UrbanGrid\'s professional property inspection team. Trusted snagging experts serving Dubai, Abu Dhabi, and Sharjah with comprehensive inspection services.',
    keywords: 'about urbangrid, property inspection company UAE, professional snagging team Dubai, property experts',
    ogImage: 'https://urbangrid.ae/og-image.png'
  },
  '/services': {
    title: 'Snagging & Inspection Services UAE | From AED 800 | UrbanGrid',
    description: 'Property snagging, RERA reports & technical inspections across Dubai, Abu Dhabi & UAE. Engineer-led, photo reports in 24 hours. From AED 800.',
    keywords: 'property inspection services UAE, snagging services Dubai, pre-purchase inspection, villa snagging, apartment inspection, building inspection companies near me',
    ogImage: 'https://urbangrid.ae/og-image.png'
  },
  '/contact': {
    title: 'Contact UrbanGrid Property Inspection - Dubai Abu Dhabi UAE',
    description: 'Contact UrbanGrid for expert property snagging services. Call +971 58 568 6852 or email info@urbangrid.ae for professional inspection quotes across UAE.',
    keywords: 'contact property inspection UAE, snagging company Dubai, property inspection quote, urbangrid contact',
    ogImage: 'https://urbangrid.ae/og-image.png'
  },
  '/blog': {
    title: 'Property Inspection Blog - Expert Tips & Insights | UrbanGrid',
    description: 'Expert property inspection tips, UAE property market insights, and professional snagging advice from UrbanGrid\'s experienced team.',
    keywords: 'property inspection blog UAE, snagging tips Dubai, property market insights, inspection advice',
    ogImage: 'https://urbangrid.ae/og-image.png'
  },

  // Property Snagging Services
  '/services/property-snagging/new-build-snagging': {
    title: 'New Build Snagging Dubai & UAE | From AED 800 | UrbanGrid',
    description: 'Independent new build handover snagging across Dubai, Abu Dhabi & UAE. Catch developer defects before you sign. Engineer-led report in 24h. From AED 800.',
    keywords: 'new build snagging UAE, handover inspection Dubai, new property snagging Abu Dhabi, pre-handover inspection, property defects UAE, new build inspection'
  },
  '/services/property-snagging/post-renovation-inspection': {
    title: 'Post-Renovation Snagging Dubai & UAE | From AED 800 | UrbanGrid',
    description: 'Independent post-renovation & fit-out inspection across Dubai, Abu Dhabi & UAE. Verify contractor work before final payment. Report in 24h. From AED 800.',
    keywords: 'post renovation inspection UAE, fit-out inspection Dubai, renovation quality control, post construction inspection Abu Dhabi, fit-out snagging'
  },
  '/services/property-snagging/dlp-snagging': {
    title: 'DLP Snagging Dubai & UAE | Defect Liability | From AED 800',
    description: 'Independent DLP inspection across Dubai, Abu Dhabi & UAE. Maximise free developer rectification before your 1-year warranty ends. Report in 24h. From AED 800.',
    keywords: 'DLP snagging UAE, defect liability period inspection, warranty snagging Dubai, property warranty claims, DLP inspection Abu Dhabi'
  },
  '/services/property-snagging/move-in-move-out': {
    title: 'Move-In / Move-Out Inspection Dubai & UAE | From AED 800',
    description: 'Independent tenant & landlord condition reports across Dubai, Abu Dhabi & UAE. Protect your security deposit with a photo report in 24h. From AED 800.',
    keywords: 'move in move out inspection UAE, rental property inspection Dubai, tenant move out inspection, landlord protection UAE, security deposit inspection'
  },
  '/services/property-snagging/secondary-market': {
    title: 'Pre-Purchase Inspection Dubai & UAE | From AED 800 | UrbanGrid',
    description: 'Independent secondary-market property inspection across Dubai, Abu Dhabi & UAE. Find hidden defects before you buy. Engineer-led report in 24h. From AED 800.',
    keywords: 'secondary market inspection UAE, pre-purchase inspection Dubai, existing property inspection, investment property assessment, property buying inspection'
  },
  '/services/property-snagging/developer-projects': {
    title: 'Developer & Contractor Snagging UAE | From AED 800 | UrbanGrid',
    description: 'Independent third-party QA snagging for developers & contractors across Dubai, Abu Dhabi & UAE. NFPA & ASHRAE benchmarked. Handover-ready reports.',
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
    title: 'Structural Survey Dubai & UAE | Certified Engineers | UrbanGrid',
    description: 'Independent structural surveys across Dubai, Abu Dhabi & UAE. Load-bearing analysis, foundation & settlement assessment by certified engineers. From AED 800.',
    keywords: 'structural survey UAE, building integrity assessment Dubai, structural inspection, load bearing analysis UAE, structural safety Abu Dhabi, certified structural assessment UAE'
  },

  // Location pages
  '/locations/dubai': {
    title: 'Snagging Company Dubai | Property Inspection Services | UrbanGrid',
    description: 'Dubai\'s trusted property snagging company. Independent inspection for Emaar, Damac, Sobha, Nakheel handovers across Downtown Dubai, Marina, Palm Jumeirah, JVC & all areas. Reports in 24 hours.',
    keywords: 'snagging company dubai, property inspection dubai, property snagging dubai, snagging dubai, home inspection dubai, new build snagging dubai, apartment snagging dubai, villa inspection dubai, building inspection companies near me'
  },
  '/locations/abu-dhabi': {
    title: 'Snagging Company Abu Dhabi | Property Inspection | UrbanGrid',
    description: 'Abu Dhabi\'s trusted property snagging company. Independent inspection across Yas Island, Al Reem, Saadiyat, Al Raha and all communities. Aldar, Imkan & all developers. Reports in 24 hours.',
    keywords: 'snagging company abu dhabi, property inspection abu dhabi, property snagging abu dhabi, snagging abu dhabi, home inspection abu dhabi, villa inspection abu dhabi, building inspection companies near me'
  },
  '/locations/sharjah': {
    title: 'Snagging Company Sharjah | Property Inspection Services | UrbanGrid',
    description: 'Sharjah\'s trusted property snagging company. Independent inspection across Aljada, Hayyan, Maryam Island, Al Zahia and all Sharjah communities. Reports in 24 hours.',
    keywords: 'snagging company sharjah, property inspection sharjah, property snagging sharjah, snagging sharjah, home inspection sharjah, Aljada snagging, Arada inspection, building inspection companies near me'
  },
  '/locations/ajman': {
    title: 'Snagging Company Ajman | Property Inspection Services | UrbanGrid',
    description: 'Professional property snagging and inspection in Ajman. ARRA-compliant process across Emirates City, Al Rashidiya, Al Nuaimia and all Ajman communities. Reports in 24 hours.',
    keywords: 'snagging company ajman, property inspection ajman, property snagging ajman, snagging ajman, home inspection ajman, building inspection companies near me'
  },
  '/locations/ras-al-khaimah': {
    title: 'Snagging Company Ras Al Khaimah | Property Inspection | UrbanGrid',
    description: 'Professional property snagging and inspection in Ras Al Khaimah. Al Hamra Village, Mina Al Arab, Al Marjan Island and all RAK communities. Engineer-led, reports in 24 hours.',
    keywords: 'snagging company ras al khaimah, property inspection ras al khaimah, property snagging RAK, snagging ras al khaimah, Al Hamra snagging, building inspection companies near me'
  },
  '/locations/fujairah': {
    title: 'Snagging Company Fujairah | Property Inspection Services | UrbanGrid',
    description: 'Professional property snagging and inspection in Fujairah. Engineer-led inspections across Fujairah City, Dibba, Al Aqah and all communities. Reports in 24 hours.',
    keywords: 'snagging company fujairah, property inspection fujairah, property snagging fujairah, snagging fujairah, home inspection fujairah, building inspection companies near me'
  },
  '/locations/umm-al-quwain': {
    title: 'Snagging Company Umm Al Quwain | Property Inspection | UrbanGrid',
    description: 'Professional property snagging and inspection in Umm Al Quwain. Engineer-led inspections across UAQ City, Al Salam City, UAQ Marina and all communities. Reports in 24 hours.',
    keywords: 'snagging company umm al quwain, property inspection umm al quwain, property snagging UAQ, snagging umm al quwain, home inspection UAQ, building inspection companies near me'
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
    const keywords = customKeywords || routeData.keywords || 'property snagging UAE, property inspection Dubai, Snagging Company Dubai, building inspection companies near me';
    const ogImage = customOgImage || routeData.ogImage || 'https://urbangrid.ae/og-image.png';
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
