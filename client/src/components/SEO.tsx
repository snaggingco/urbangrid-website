import { useEffect } from 'react';
import { useLocation } from 'wouter';

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
    title: 'UrbanGrid Property Inspection UAE | Snagging & Inspection Services',
    description: 'UAE\'s trusted property inspection company. Professional snagging services across Dubai, Abu Dhabi, Sharjah. RERA certified, same-day reports. Call +971 58 568 6852.',
    keywords: 'UrbanGrid, property inspection UAE, property snagging UAE, snagging services Dubai Abu Dhabi Sharjah, pre-purchase inspection, new build snagging, villa inspection',
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
    description: 'Contact UrbanGrid for expert property snagging services. Call +971 58 568 6852 or email info@urbangrid.ae for professional inspection quotes across UAE.',
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
    // Pages that should never be indexed
    const noindexPaths = ['/login', '/privacy-policy', '/terms-of-service', '/admin'];
    const shouldNoindex = noindex || noindexPaths.some(p => location.startsWith(p));

    const canonical = customCanonical || `https://urbangrid.ae${location}`;

    // Update document title
    document.title = title;

    // Helper function to update or create meta tag
    const updateMetaTag = (name: string, content: string, property?: string) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };
    
    // Helper function to update link tag
    const updateLinkTag = (rel: string, href: string) => {
      let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
      
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', rel);
        document.head.appendChild(link);
      }
      link.setAttribute('href', href);
    };
    
    // Update meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('robots', shouldNoindex ? 'noindex, nofollow' : 'index, follow');
    
    // Update Open Graph tags
    updateMetaTag('og:title', title, 'property');
    updateMetaTag('og:description', description, 'property');
    updateMetaTag('og:url', canonical, 'property');
    updateMetaTag('og:image', ogImage, 'property');
    
    // Update Twitter Card tags
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', ogImage);
    
    // Update canonical URL
    updateLinkTag('canonical', canonical);
    
    // Add Organization schema for homepage
    if (location === '/') {
      const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
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
        "sameAs": [
          "https://urbangrid.ae"
        ],
        "description": "Professional property inspection and snagging services across UAE",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": 200
        }
      };

      const existingOrgSchema = document.querySelector('#organization-schema');
      if (existingOrgSchema) {
        existingOrgSchema.remove();
      }

      const orgScript = document.createElement('script');
      orgScript.id = 'organization-schema';
      orgScript.type = 'application/ld+json';
      orgScript.textContent = JSON.stringify(organizationSchema);
      document.head.appendChild(orgScript);
    }

    // Add comprehensive structured data for service pages
    if (location.includes('/services/')) {
      const serviceCategory = location.includes('property-snagging') ? 'Property Snagging' : 
                             location.includes('rera-services') ? 'RERA Services' : 
                             location.includes('technical-inspections') ? 'Technical Inspections' : 'Property Inspection';
      
      const serviceSchema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": title,
        "description": description,
        "provider": {
          "@type": "LocalBusiness",
          "name": "UrbanGrid Property Snagging Inspection",
          "telephone": "+971585686852",
          "email": "info@urbangrid.ae",
          "url": "https://urbangrid.ae",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "AE",
            "addressRegion": "Dubai"
          },
          "priceRange": "$$",
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": 200
          }
        },
        "areaServed": [
          {
            "@type": "City",
            "name": "Dubai",
            "addressCountry": "AE"
          },
          {
            "@type": "City", 
            "name": "Abu Dhabi",
            "addressCountry": "AE"
          },
          {
            "@type": "City",
            "name": "Sharjah", 
            "addressCountry": "AE"
          }
        ],
        "serviceType": serviceCategory,
        "category": "Property Snagging Inspection Services",
        "url": canonical
      };

      // Add FAQ schema for service pages
      const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": `What is ${serviceCategory}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": description
            }
          },
          {
            "@type": "Question",
            "name": "How long does the snagging inspection take?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Inspection duration varies by service type and property size, typically ranging from 2-8 hours for comprehensive assessments."
            }
          },
          {
            "@type": "Question",
            "name": "Do you provide same-day snagging reports?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, we provide detailed inspection reports on the same day with photographic evidence and professional recommendations."
            }
          }
        ]
      };
      
      // Remove existing schemas
      ['#service-schema', '#faq-schema'].forEach(selector => {
        const existing = document.querySelector(selector);
        if (existing) existing.remove();
      });
      
      // Add service schema
      const serviceScript = document.createElement('script');
      serviceScript.id = 'service-schema';
      serviceScript.type = 'application/ld+json';
      serviceScript.textContent = JSON.stringify(serviceSchema);
      document.head.appendChild(serviceScript);

      // Add FAQ schema
      const faqScript = document.createElement('script');
      faqScript.id = 'faq-schema';
      faqScript.type = 'application/ld+json';
      faqScript.textContent = JSON.stringify(faqSchema);
      document.head.appendChild(faqScript);
    }

  }, [location, customTitle, customDescription, customKeywords, customOgImage, customCanonical, noindex]);
  
  return null; // This component doesn't render anything
}