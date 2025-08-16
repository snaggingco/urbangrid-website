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
    title: 'UrbanGrid Property Inspection - Professional Snagging Services in UAE',
    description: 'Professional property inspection and snagging services across Dubai, Abu Dhabi, and UAE. Expert property snagging, pre-purchase inspections, and new build assessments. Contact +971 58 568 6852.',
    keywords: 'property snagging UAE, property inspection Dubai, snagging services Abu Dhabi, pre-purchase inspection, new build snagging, villa inspection'
  },
  '/about': {
    title: 'About UrbanGrid - UAE\'s Leading Property Inspection Company',
    description: 'Learn about UrbanGrid\'s professional property inspection team. Trusted property snagging experts serving Dubai, Abu Dhabi, and Sharjah with comprehensive inspection services.',
    keywords: 'about urbangrid, property inspection company UAE, professional snagging team Dubai, property experts'
  },
  '/services': {
    title: 'Property Inspection Services UAE - Snagging & Assessment | UrbanGrid',
    description: 'Comprehensive property inspection services including new build snagging, pre-purchase inspections, villa assessments, and apartment snagging across UAE. Professional reports same day.',
    keywords: 'property inspection services UAE, snagging services Dubai, pre-purchase inspection, villa snagging, apartment inspection'
  },
  '/contact': {
    title: 'Contact UrbanGrid Property Inspection - Dubai Abu Dhabi UAE',
    description: 'Contact UrbanGrid for professional property inspection services in UAE. Call +971 58 568 6852 or email info@urbangrid.ae for expert property snagging and inspection quotes.',
    keywords: 'contact property inspection UAE, snagging company Dubai, property inspection quote, urbangrid contact'
  },
  '/blog': {
    title: 'Property Inspection Blog - Expert Tips & Insights | UrbanGrid',
    description: 'Expert property inspection tips, UAE property market insights, and professional snagging advice from UrbanGrid\'s experienced inspection team.',
    keywords: 'property inspection blog UAE, snagging tips Dubai, property market insights, inspection advice'
  },
  
  // Location Pages
  '/locations/dubai': {
    title: 'Dubai Property Inspection Services - Professional Snagging | UrbanGrid',
    description: 'Professional property inspection and snagging services in Dubai. Covering all Dubai communities with expert pre-purchase inspections, new build snagging, and villa assessments.',
    keywords: 'Dubai property inspection, property snagging Dubai, Dubai snagging services, Dubai property assessment'
  },
  '/locations/abu-dhabi': {
    title: 'Abu Dhabi Property Inspection Services - Expert Snagging | UrbanGrid',
    description: 'Professional property inspection services in Abu Dhabi. Expert snagging for Al Reem Island, Saadiyat Island, Yas Island, and all Abu Dhabi developments.',
    keywords: 'Abu Dhabi property inspection, property snagging Abu Dhabi, Abu Dhabi snagging services'
  },
  '/locations/sharjah': {
    title: 'Sharjah Property Inspection Services - Professional Snagging | UrbanGrid',
    description: 'Expert property inspection and snagging services in Sharjah. Comprehensive property assessments for residential and commercial properties across Sharjah.',
    keywords: 'Sharjah property inspection, property snagging Sharjah, Sharjah snagging services'
  },
  
  // High-Priority SEO Pages - Dubai
  '/locations/dubai/property-snagging': {
    title: 'Property Snagging Dubai - Professional Snagging Services & Inspection',
    description: 'Dubai\'s leading property snagging company offering comprehensive snagging services across all Emirates. Professional property snagging in Dubai with expert inspection reports and developer liaison.',
    keywords: 'property snagging dubai, dubai snagging services, property inspection dubai, snagging company dubai, new build snagging dubai'
  },
  '/locations/dubai/snagging-cost': {
    title: 'Snagging Dubai Cost - Transparent Pricing for Property Snagging Services',
    description: 'Get clear, upfront pricing for professional snagging services in Dubai. No hidden fees, competitive rates starting from AED 1,200. Same-day reports and expert property inspection.',
    keywords: 'snagging dubai cost, property snagging prices dubai, snagging service cost, dubai property inspection pricing'
  },
  '/locations/dubai/property-snagging-services': {
    title: 'Property Snagging Services Dubai - Comprehensive Snagging Solutions',
    description: 'Professional property snagging services in Dubai offering complete inspection solutions for all property types. From pre-handover snagging to commercial inspections.',
    keywords: 'property snagging services dubai, dubai snagging solutions, comprehensive property inspection dubai, professional snagging dubai'
  },
  '/locations/dubai/pre-purchase-inspection': {
    title: 'Pre-Purchase Property Inspection Dubai - Expert Assessment Services',
    description: 'Professional pre-purchase property inspection services in Dubai. Expert property assessment before buying to protect your investment with comprehensive inspection reports.',
    keywords: 'pre-purchase inspection dubai, property inspection before buying dubai, dubai property assessment, investment protection dubai'
  },
  
  // Abu Dhabi High-Priority SEO Pages
  '/locations/abu-dhabi/property-inspection': {
    title: 'Property Inspection Abu Dhabi - Expert Property Assessment Services',
    description: 'Professional property inspection services across Abu Dhabi\'s premium developments. From Al Reem Island to Saadiyat Island, ensure your property investment meets the highest standards.',
    keywords: 'property inspection abu dhabi, abu dhabi property assessment, property snagging abu dhabi, abu dhabi inspection services'
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
    updateMetaTag('robots', noindex ? 'noindex, nofollow' : 'index, follow');
    
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
    
    // Add page-specific Schema.org structured data for service pages
    if (location.includes('/locations/') && location.includes('snagging')) {
      const serviceSchema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": title,
        "description": description,
        "provider": {
          "@type": "LocalBusiness",
          "name": "UrbanGrid Property Inspection",
          "telephone": "+971585686852",
          "url": "https://urbangrid.ae"
        },
        "areaServed": {
          "@type": "City",
          "name": location.includes('dubai') ? "Dubai" : location.includes('abu-dhabi') ? "Abu Dhabi" : "UAE",
          "addressCountry": "AE"
        },
        "serviceType": "Property Inspection",
        "url": canonical
      };
      
      // Remove existing service schema if any
      const existingServiceSchema = document.querySelector('#service-schema');
      if (existingServiceSchema) {
        existingServiceSchema.remove();
      }
      
      // Add new service schema
      const script = document.createElement('script');
      script.id = 'service-schema';
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(serviceSchema);
      document.head.appendChild(script);
    }
    
  }, [location, customTitle, customDescription, customKeywords, customOgImage, customCanonical, noindex]);
  
  return null; // This component doesn't render anything
}