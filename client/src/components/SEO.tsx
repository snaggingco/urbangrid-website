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
// 2. AGGREGATE RATING — MANUAL UPDATE REQUIRED
//    The ratingValue and reviewCount below are maintained manually. Update
//    these values whenever your real review data changes significantly.
//    If they diverge from your Google Business Profile, Google may ignore
//    or penalize the schema.
// 3. FAQ SCHEMA
//    Each service page has customized FAQPage JSON-LD. Update the
//    serviceFAQData map below when services or common questions change.
// ─────────────────────────────────────────────────────────────────────────────

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
  noindex?: boolean;
}

// Central source of truth for aggregate rating — update manually when real data changes.
const AGGREGATE_RATING = {
  ratingValue: '4.9',
  reviewCount: 200,
  // UPDATE INSTRUCTION: Change these values to match your actual Google Reviews / Trustpilot data.
  // Last updated: 2025-05-15. Next review: quarterly or after 20+ new reviews.
};

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

// ── PER-SERVICE FAQ DATA (customized for each service page) ─────────────────
// Each entry must contain 3 Question/Answer pairs specific to that service.
// This replaces the old generic FAQ schema that repeated the same 3 questions
// across all 16 service pages.
// ─────────────────────────────────────────────────────────────────────────────

interface FAQEntry {
  q: string;
  a: string;
}

const serviceFAQData: Record<string, FAQEntry[]> = {
  // ── Property Snagging ──
  '/services/property-snagging/new-build-snagging': [
    { q: 'What is new build handover snagging?', a: 'New build snagging is a detailed inspection of your property before you accept the keys from the developer. We identify defects in finishes, MEP systems, and safety items so the developer fixes them under warranty before you move in.' },
    { q: 'When should I book a snagging inspection?', a: 'Book the inspection before your handover walkthrough. This gives you an independent defect list to present to the developer, rather than relying on their own quality control team.' },
    { q: 'What defects are most common in new builds in the UAE?', a: 'The most frequent findings are hollow tiles, uneven paint, AC balancing issues, plumbing leaks, window seal failures, and incomplete fire safety installations. Our engineers document every item with photographs.' }
  ],
  '/services/property-snagging/post-renovation-inspection': [
    { q: 'What is a post-renovation inspection?', a: 'A post-renovation inspection verifies that fit-out or renovation work has been completed to specification and quality standards before you make the final payment to your contractor.' },
    { q: 'Why should I inspect after renovation work?', a: 'Contractors often rush the final phase, leaving incomplete work, substandard finishes, or unsafe electrical modifications. An independent inspection protects your investment and provides documented evidence for rectification claims.' },
    { q: 'What do you check after a renovation or fit-out?', a: 'We verify finishing quality, MEP modifications, structural changes, compliance with approved plans, and safety system integrity. Every item is photographed and referenced against your contractor\'s specification.' }
  ],
  '/services/property-snagging/dlp-snagging': [
    { q: 'What is the Defects Liability Period (DLP)?', a: 'The DLP is a one-year warranty period from handover during which the developer is legally obligated to repair defects at no cost to you. In the UAE, this is enforced under Federal Law and RERA regulations.' },
    { q: 'When should I book a DLP snagging inspection?', a: 'Book in months 10\u201311 of your DLP. This gives you time to formally log all defects with the developer before the warranty expires. Once the DLP ends, uncorrected defects become your financial responsibility.' },
    { q: 'What happens if defects are found after my DLP expires?', a: 'After DLP expiry, the developer is no longer legally required to fix defects for free. Our pre-expiry inspection maximizes your warranty claims and ensures nothing is missed before your rights lapse.' }
  ],
  '/services/property-snagging/move-in-move-out': [
    { q: 'What is a move-in/move-out inspection?', a: 'It is an independent condition assessment of a rental property documenting its state before you move in and after you move out. This creates a clear, photographic record that protects both tenant and landlord.' },
    { q: 'Who needs a rental property condition report?', a: 'Both tenants and landlords benefit. Tenants use it to protect their security deposit. Landlords use it to justify deductions for damage caused during the tenancy and to maintain property value.' },
    { q: 'Can the inspection report protect my security deposit?', a: 'Yes. A professional condition report with dated photographs provides objective evidence if there is a dispute over deposit deductions. Without it, disagreements often become costly and time-consuming.' }
  ],
  '/services/property-snagging/secondary-market': [
    { q: 'What is a secondary market property inspection?', a: 'A secondary market inspection is a comprehensive assessment of an existing (resale) property before you complete the purchase. It identifies hidden defects that the seller may not have disclosed.' },
    { q: 'Should I inspect before buying a resale property in the UAE?', a: 'Absolutely. Resale properties may have concealed water damage, structural cracks, electrical faults, or unapproved modifications. An inspection gives you a clear picture of the true condition before you commit.' },
    { q: 'Can your report help me negotiate the purchase price?', a: 'Yes. Our reports include estimated rectification costs for every defect documented. Buyers regularly use this evidence to negotiate price reductions or request repairs before completion.' }
  ],
  '/services/property-snagging/developer-projects': [
    { q: 'What is developer and contractor snagging?', a: 'It is an independent quality control inspection conducted before handover to your clients. We identify defects in finishes, MEP, and safety systems so you can correct them before they damage your reputation.' },
    { q: 'Why do developers need independent inspection?', a: 'Internal quality teams have commercial pressure to meet deadlines. An independent inspector works solely for you and reports every defect objectively, protecting your brand and reducing post-handover complaints.' },
    { q: 'What standards do you check against?', a: 'We inspect against UAE Civil Defence requirements, DEWA/ADDC electrical standards, NFPA fire safety codes, ASHRAE HVAC standards, and your project specification documents.' }
  ],

  // ── RERA Services ──
  '/services/rera-services/reserve-fund-study': [
    { q: 'What is a reserve fund study?', a: 'A reserve fund study (also called a sinking fund analysis) is a long-term financial projection that calculates how much money a strata building needs to maintain and replace major building components over time.' },
    { q: 'Is a reserve fund study required by RERA?', a: 'Yes. RERA mandates reserve fund studies for strata properties in Dubai. The study must be conducted by a qualified professional and updated periodically to ensure the building remains financially viable.' },
    { q: 'How often should a reserve fund study be conducted?', a: 'RERA typically requires an update every 3\u20135 years, or whenever there is a significant change in the building\'s condition or planned capital expenditure. We provide studies that meet RERA\'s exact documentation requirements.' }
  ],
  '/services/rera-services/service-charge-allocation': [
    { q: 'What is service charge allocation?', a: 'Service charge allocation is the process of distributing common area maintenance costs (cleaning, security, utilities, landscaping) fairly across all unit owners in a strata building according to RERA guidelines.' },
    { q: 'How are service charges calculated in the UAE?', a: 'RERA specifies that service charges must be allocated based on unit share (often tied to square footage) and common area usage. We assess the building, verify the calculation method, and ensure full regulatory compliance.' },
    { q: 'Can your report resolve service charge disputes?', a: 'Yes. Our independent allocation report provides transparent, RERA-compliant cost distribution backed by documented methodology. This evidence is regularly used to resolve disputes between owners\' associations and individual unit owners.' }
  ],
  '/services/rera-services/reinstatement-cost-assessment': [
    { q: 'What is a reinstatement cost assessment?', a: 'It is a professional valuation of the cost to rebuild or reinstate a property to its original condition in the event of total loss. This figure is used by insurers to set adequate coverage limits.' },
    { q: 'Why do I need a reinstatement cost assessment for insurance?', a: 'If your insured value is too low, you will be underinsured in a claim and the insurer will apply average clause deductions. If it is too high, you are paying unnecessary premiums. Our assessment gets the figure exactly right.' },
    { q: 'How is the reinstatement value calculated?', a: 'We assess built-up area, construction type, finishes quality, MEP systems, and current construction costs per square metre in the UAE. The assessment is documented to RERA and insurance industry standards.' }
  ],
  '/services/rera-services/building-completion-audit': [
    { q: 'What is a building completion audit?', a: 'A building completion audit is a comprehensive verification that a constructed building matches the approved plans, regulatory requirements, and developer\'s specifications before handover and title registration.' },
    { q: 'Is a completion audit mandatory for handover in the UAE?', a: 'RERA requires developers to complete specific handover procedures and documentation before transferring title. Our audit verifies that all regulatory checkpoints have been met, protecting buyers from accepting non-compliant properties.' },
    { q: 'What does the audit verify?', a: 'We check plan compliance, MEP system commissioning, fire safety installations, structural integrity, finishing quality, common area completion, and all regulatory certificates required for the occupation permit.' }
  ],
  '/services/rera-services/building-condition-survey': [
    { q: 'What is a building condition survey?', a: 'A building condition survey is a detailed assessment of a property\'s physical state, covering structural elements, MEP systems, finishes, and common areas. It is used for maintenance planning and regulatory reporting.' },
    { q: 'How often should a condition survey be conducted?', a: 'For commercial and strata properties, RERA recommends periodic condition surveys as part of ongoing building management. We recommend every 3\u20135 years, or before major maintenance decisions or property transactions.' },
    { q: 'What systems do you assess in a condition survey?', a: 'We examine structural elements, roofing and waterproofing, electrical and plumbing systems, HVAC, lifts, fire safety, external cladding, and common areas. Every finding is rated by urgency and estimated rectification cost.' }
  ],

  // ── Technical Inspections ──
  '/services/technical-inspections/technical-due-diligence': [
    { q: 'What is technical due diligence?', a: 'Technical due diligence is a comprehensive engineering assessment of a property before acquisition. It covers structural integrity, MEP systems, compliance status, and hidden risks that could affect investment value.' },
    { q: 'When should I commission technical due diligence?', a: 'Before any significant property acquisition \u2014 whether off-plan, resale, or commercial. The report gives investors, lenders, and fund managers the engineering confidence to proceed or renegotiate.' },
    { q: 'What risks does technical due diligence identify?', a: 'We identify structural defects, MEP deficiencies, compliance gaps, environmental risks, maintenance backlogs, and unapproved modifications. Every risk is quantified with estimated remediation costs.' }
  ],
  '/services/technical-inspections/dilapidation-survey': [
    { q: 'What is a dilapidation survey?', a: 'A dilapidation survey documents the condition of a property before and after nearby construction work. It creates a legal record that protects adjacent property owners from liability for pre-existing damage.' },
    { q: 'When is a dilapidation survey required in the UAE?', a: 'Developers and contractors are increasingly required by municipalities and insurers to conduct pre-construction dilapidation surveys of adjacent properties. We provide reports accepted by Dubai Municipality and major insurers.' },
    { q: 'Does a dilapidation survey provide legal protection?', a: 'Yes. The report establishes a baseline condition with dated photographs and detailed descriptions. If post-construction damage occurs, this evidence determines whether the contractor is liable.' }
  ],
  '/services/technical-inspections/thermographic-survey': [
    { q: 'What is a thermographic survey?', a: 'A thermographic survey uses infrared thermal imaging cameras to detect temperature variations across a building\'s surfaces. These variations reveal hidden defects invisible to the naked eye.' },
    { q: 'What can thermal imaging detect in a property?', a: 'Thermal imaging identifies energy losses, moisture intrusion behind walls, electrical hotspots, underfloor heating faults, insulation gaps, and water leak paths. It is particularly effective for detecting hidden water damage.' },
    { q: 'Is a thermographic survey non-invasive?', a: 'Yes. Thermal imaging is completely non-contact and non-destructive. We scan walls, ceilings, floors, and MEP systems without drilling, cutting, or dismantling any building element.' }
  ],
  '/services/technical-inspections/noise-survey': [
    { q: 'What is a noise survey?', a: 'A noise survey is a professional acoustic assessment that measures and analyses sound levels within and around a property to ensure compliance with UAE environmental and habitability regulations.' },
    { q: 'What are the UAE noise level limits for residential properties?', a: 'UAE municipalities enforce specific decibel limits for daytime and nighttime noise. Our surveys measure against these thresholds and identify sources of non-compliance, whether from neighbouring construction, traffic, or building services.' },
    { q: 'How long does acoustic testing take?', a: 'A typical residential noise survey takes 2\u20134 hours, depending on property size and the number of measurement points required. We use calibrated Class 1 sound level meters for legally defensible results.' }
  ],
  '/services/technical-inspections/structural-survey': [
    { q: 'What is a structural survey?', a: 'A structural survey is a detailed engineering assessment of a building\'s load-bearing elements, foundations, walls, and structural frame. It identifies defects that could compromise safety or require costly remediation.' },
    { q: 'When is a structural survey necessary?', a: 'Before purchasing older properties, after seismic events, when cracks appear, before major alterations, or when a mortgage lender requires structural certification. It is essential for properties over 10 years old.' },
    { q: 'What structural elements do you examine?', a: 'We assess foundations, load-bearing walls, columns, beams, slabs, roof structures, balconies, and staircases. Our engineers look for cracks, settlement, corrosion, overloading signs, and code non-compliance.' }
  ]
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
          "telephone": "+971567427634",
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
          "ratingValue": AGGREGATE_RATING.ratingValue,
          "reviewCount": AGGREGATE_RATING.reviewCount
        }
      };

      const existingOrgSchema = document.querySelector('#organization-schema');
      if (existingOrgSchema) existingOrgSchema.remove();

      const orgScript = document.createElement('script');
      orgScript.id = 'organization-schema';
      orgScript.type = 'application/ld+json';
      orgScript.textContent = JSON.stringify(organizationSchema);
      document.head.appendChild(orgScript);
    }

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
          "telephone": "+971567427634",
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
            "ratingValue": AGGREGATE_RATING.ratingValue,
            "reviewCount": AGGREGATE_RATING.reviewCount
          }
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

      // Use per-service FAQ data instead of generic questions
      const faqs = serviceFAQData[location] || [
        {
          q: `What is ${serviceCategory}?`,
          a: description
        },
        {
          q: 'How long does the inspection take?',
          a: 'Inspection duration varies by service type and property size, typically ranging from 2-8 hours for comprehensive assessments.'
        },
        {
          q: 'Do you provide same-day reports?',
          a: 'Yes, we provide detailed inspection reports on the same day with photographic evidence and professional recommendations.'
        }
      ];

      const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map((faq) => ({
          "@type": "Question",
          "name": faq.q,
          "acceptedAnswer": { "@type": "Answer", "text": faq.a }
        }))
      };

      ['#service-schema', '#faq-schema'].forEach(selector => {
        const existing = document.querySelector(selector);
        if (existing) existing.remove();
      });

      const serviceScript = document.createElement('script');
      serviceScript.id = 'service-schema';
      serviceScript.type = 'application/ld+json';
      serviceScript.textContent = JSON.stringify(serviceSchema);
      document.head.appendChild(serviceScript);

      const faqScript = document.createElement('script');
      faqScript.id = 'faq-schema';
      faqScript.type = 'application/ld+json';
      faqScript.textContent = JSON.stringify(faqSchema);
      document.head.appendChild(faqScript);
    }

  }, [location, customTitle, customDescription, customKeywords, customOgImage, customCanonical, noindex]);

  return null;
}
