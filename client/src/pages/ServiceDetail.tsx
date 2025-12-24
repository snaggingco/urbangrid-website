import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import NotFound from "@/pages/not-found";
import SEO from "@/components/SEO";

interface ServiceData {
  slug: string;
  title: string;
  description: string;
  image: string;
  longDescription: string;
  features: string[];
  process: string[];
  benefits: string[];
  duration: string;
  price: string;
  includes: string[];
}

const servicesData: Record<string, ServiceData> = {
  "new-build-snagging": {
    slug: "new-build-snagging",
    title: "New Build Handover Snagging & Inspection",
    description: "Comprehensive pre-handover inspection of newly constructed properties to identify defects, incomplete work, and quality issues before you take possession.",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600",
    longDescription: "Our new build handover snagging service is designed to protect your investment by conducting a thorough inspection before you accept your new property. Our certified inspectors examine every aspect of your property, from structural elements to finishing details, ensuring that everything meets the required standards and specifications. This critical step can save you thousands of dirhams in future repairs and ensures that any defects are identified and rectified by the developer at no cost to you.",
    features: [
      "Complete structural assessment and stability check",
      "MEP systems inspection (mechanical, electrical, plumbing)",
      "Finishing quality evaluation and compliance verification",
      "Door and window functionality testing",
      "Flooring, tiling, and paintwork inspection",
      "Kitchen and bathroom fittings examination",
      "Balcony and terrace safety assessment",
      "Common area and external facade review"
    ],
    process: [
      "Pre-inspection consultation and scheduling",
      "Comprehensive on-site examination (4-8 hours)",
      "Digital documentation with photos and videos",
      "Detailed snagging report generation",
      "Client presentation and explanation",
      "Follow-up inspection after rectification"
    ],
    benefits: [
      "Protect your investment from hidden defects",
      "Ensure compliance with UAE building standards",
      "Save money on future repairs and maintenance",
      "Professional documentation for warranty claims",
      "Peace of mind before taking possession",
      "Leverage for negotiations with developers"
    ],
    duration: "4-8 hours",
    price: "Minimum AED 700 | From AED 1 / Sq.ft (700+ sq.ft)",
    includes: [
      "Professional inspection team",
      "Digital report with photos",
      "Detailed defect listing",
      "Rectification follow-up",
      "Technical consultation",
      "Warranty documentation support"
    ]
  },
  "post-renovation-inspection": {
    slug: "post-renovation-inspection", 
    title: "Post Renovation / Fit-out Snagging Inspection",
    description: "Quality assessment after renovation or fit-out work to ensure all improvements meet specifications and industry standards.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600",
    longDescription: "After completing renovation or fit-out work, it's essential to verify that all improvements have been executed according to specifications and meet industry standards. Our post-renovation inspection service provides comprehensive quality assessment, ensuring that your investment in property improvements delivers the expected results and complies with all relevant building codes and safety requirements.",
    features: [
      "Renovation work quality assessment",
      "Material compliance verification",
      "Safety standards evaluation",
      "Workmanship quality inspection",
      "Before/after comparison analysis",
      "Warranty and guarantee documentation",
      "Building code compliance check",
      "Final sign-off recommendations"
    ],
    process: [
      "Review of renovation plans and specifications",
      "Comprehensive post-work inspection",
      "Quality assessment and testing",
      "Documentation and photo evidence",
      "Report compilation and review",
      "Client consultation and recommendations"
    ],
    benefits: [
      "Ensure renovation meets specifications",
      "Verify compliance with building codes",
      "Document quality for warranty purposes",
      "Identify issues before final payment",
      "Professional quality assurance",
      "Support for contractor negotiations"
    ],
    duration: "3-6 hours",
    price: "Minimum AED 700 | From AED 1 / Sq.ft (700+ sq.ft)",
    includes: [
      "Comprehensive quality assessment",
      "Detailed inspection report",
      "Photo documentation",
      "Compliance verification",
      "Recommendations report",
      "Follow-up consultation"
    ]
  },
  "dlp-snagging": {
    slug: "dlp-snagging",
    title: "Property Defect Liability Period (DLP) Snagging",
    description: "Strategic inspection during the defect liability period to identify and document all issues before warranty expires.",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600",
    longDescription: "The Defect Liability Period (DLP) is your last opportunity to claim free rectification of defects from your developer or contractor. Our DLP snagging service conducts a strategic and comprehensive inspection to identify all potential issues before your warranty expires, ensuring maximum protection for your investment and securing your rights for free repairs.",
    features: [
      "Pre-warranty expiry comprehensive inspection",
      "Systematic defect identification and cataloging",
      "Developer liaison and communication support",
      "Rectification progress tracking and monitoring",
      "Legal documentation and evidence gathering",
      "Multiple follow-up inspections as needed",
      "Warranty claim submission assistance",
      "Final completion verification"
    ],
    process: [
      "DLP timeline review and planning",
      "Comprehensive property re-inspection",
      "Defect documentation and prioritization",
      "Developer notification and liaison",
      "Rectification monitoring and tracking",
      "Final inspection and sign-off"
    ],
    benefits: [
      "Maximize warranty claim potential",
      "Ensure all defects are addressed",
      "Professional developer liaison",
      "Legal protection and documentation",
      "Cost savings on repairs",
      "Extended property protection"
    ],
    duration: "5-9 hours", 
    price: "Minimum AED 700 | From AED 0.5 / Sq.ft (700+ sq.ft)",
    includes: [
      "Comprehensive re-inspection",
      "Defect tracking system",
      "Developer communication",
      "Legal documentation",
      "Multiple follow-ups",
      "Final verification report"
    ]
  },
  "move-in-move-out": {
    slug: "move-in-move-out",
    title: "Property Move-in / Move-out Snagging",
    description: "Detailed condition reports for rental properties to protect both tenants and landlords during property transitions.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600",
    longDescription: "Our move-in/move-out snagging service provides impartial, detailed condition reports that protect both tenants and landlords during property transitions. These comprehensive assessments document the exact condition of the property, preventing disputes over security deposits and ensuring fair treatment for all parties involved in rental agreements.",
    features: [
      "Comprehensive property condition assessment",
      "Detailed photographic documentation",
      "Damage and wear assessment",
      "Security deposit protection documentation",
      "Legal compliance verification",
      "Tenant/landlord mediation support",
      "Inventory and fixture recording",
      "Maintenance recommendation report"
    ],
    process: [
      "Initial condition assessment",
      "Room-by-room inspection",
      "Photographic documentation",
      "Condition report compilation",
      "Client review and approval",
      "Final report distribution"
    ],
    benefits: [
      "Protect security deposits",
      "Prevent rental disputes",
      "Legal protection for both parties",
      "Fair and impartial assessment",
      "Professional documentation",
      "Mediation support if needed"
    ],
    duration: "2-4 hours",
    price: "Minimum AED 700 | From AED 0.5 / Sq.ft (700+ sq.ft)",
    includes: [
      "Detailed condition report",
      "Comprehensive photo documentation",
      "Damage assessment",
      "Legal compliance check",
      "Report for all parties",
      "Mediation support"
    ]
  },
  "secondary-market": {
    slug: "secondary-market",
    title: "Secondary Market Property Snagging",
    description: "Pre-purchase inspections for existing properties to help buyers make informed decisions and negotiate fair prices.",
    image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600",
    longDescription: "Purchasing a property in the secondary market requires careful evaluation to ensure you're making a sound investment. Our secondary market snagging service provides comprehensive pre-purchase inspections that reveal hidden issues, assess maintenance requirements, and provide valuable insights for price negotiations and future planning.",
    features: [
      "Comprehensive pre-purchase inspection",
      "Market value assessment support",
      "Hidden defect detection and analysis",
      "Maintenance requirement evaluation",
      "Negotiation support and recommendations",
      "Investment protection advisory",
      "Future maintenance cost estimation",
      "Property condition benchmarking"
    ],
    process: [
      "Property history review",
      "Comprehensive inspection",
      "Market analysis and comparison",
      "Risk assessment evaluation",
      "Report preparation and review",
      "Buyer consultation and advice"
    ],
    benefits: [
      "Make informed purchase decisions",
      "Negotiate fair market prices",
      "Identify hidden maintenance costs",
      "Protect your investment",
      "Professional market insights",
      "Avoid costly surprises"
    ],
    duration: "3-5 hours",
    price: "Minimum AED 700 | From AED 1 / Sq.ft (700+ sq.ft)",
    includes: [
      "Pre-purchase inspection",
      "Market assessment report",
      "Hidden defect analysis",
      "Maintenance cost projection",
      "Negotiation recommendations",
      "Investment advisory"
    ]
  },
  "developer-projects": {
    slug: "developer-projects",
    title: "Developer and Contractor Project Snagging",
    description: "Quality control inspections for developers and contractors to ensure projects meet industry standards and client expectations.",
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600",
    longDescription: "For developers and contractors, maintaining quality standards and client satisfaction is paramount to business success. Our project snagging service provides independent quality control inspections that ensure your projects meet industry standards, comply with regulations, and exceed client expectations, protecting your reputation and minimizing future liabilities.",
    features: [
      "Independent quality control auditing",
      "Progress milestone verification",
      "Compliance monitoring and reporting",
      "Industry standards enforcement",
      "Client satisfaction assurance",
      "Reputation protection services",
      "Risk mitigation strategies",
      "Quality improvement recommendations"
    ],
    process: [
      "Project requirement analysis",
      "Milestone-based inspections",
      "Quality control auditing",
      "Compliance verification",
      "Client satisfaction assessment",
      "Final quality certification"
    ],
    benefits: [
      "Ensure project quality standards",
      "Protect business reputation",
      "Minimize future liabilities",
      "Improve client satisfaction",
      "Enhance competitive advantage",
      "Reduce rework and costs"
    ],
    duration: "6-12 hours",
    price: "Custom Quote",
    includes: [
      "Quality control auditing",
      "Compliance verification",
      "Progress reporting",
      "Client satisfaction assessment",
      "Certification documentation",
      "Improvement recommendations"
    ]
  },
  "reserve-fund-study": {
    slug: "reserve-fund-study",
    title: "Reserve Fund Study / Sinking Fund",
    description: "Comprehensive analysis of building reserve fund requirements and long-term capital expenditure planning for strata properties in compliance with RERA regulations.",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600",
    longDescription: "Our Reserve Fund Study service provides comprehensive analysis of building reserve fund requirements and long-term capital expenditure planning for strata properties. This essential service ensures compliance with RERA regulations while providing property owners and management companies with accurate financial projections for future maintenance and replacement costs.",
    features: [
      "Long-term capital planning analysis",
      "RERA compliance assessment and documentation",
      "Financial projection modeling and forecasting",
      "Asset lifecycle analysis and evaluation",
      "Regulatory documentation and reporting",
      "Stakeholder consultation and presentation",
      "Reserve fund requirement calculations",
      "Maintenance scheduling optimization"
    ],
    process: [
      "Property assessment and data collection",
      "Asset condition evaluation and analysis",
      "Financial modeling and projections",
      "RERA compliance verification",
      "Report preparation and documentation",
      "Stakeholder presentation and consultation"
    ],
    benefits: [
      "Ensure RERA regulatory compliance",
      "Accurate long-term financial planning",
      "Protect property investment value",
      "Transparent reserve fund management",
      "Professional financial documentation",
      "Reduced future financial risks"
    ],
    duration: "2-4 weeks",
    price: "Custom Quote",
    includes: [
      "Comprehensive building assessment",
      "Financial projection modeling",
      "RERA compliance documentation",
      "Professional consultation",
      "Detailed analytical report",
      "Ongoing advisory support"
    ]
  },
  "service-charge-allocation": {
    slug: "service-charge-allocation",
    title: "Service Charge Cost Allocation",
    description: "Detailed assessment and allocation of service charges across common property areas ensuring fair distribution and full compliance with RERA guidelines.",
    image: "https://images.unsplash.com/photo-1607863680198-23d4b2565df0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600",
    longDescription: "Our Service Charge Cost Allocation service provides detailed assessment and fair allocation of service charges across common property areas. This service ensures transparent cost distribution and full compliance with RERA guidelines, protecting both property owners and management companies from disputes and regulatory issues.",
    features: [
      "Fair cost distribution analysis and calculation",
      "RERA guideline compliance verification",
      "Common area assessment and evaluation",
      "Usage pattern analysis and documentation",
      "Transparent reporting and documentation",
      "Dispute resolution support and mediation",
      "Cost allocation methodology development",
      "Regulatory compliance monitoring"
    ],
    process: [
      "Property analysis and area measurement",
      "Usage pattern assessment and evaluation",
      "Cost allocation calculation and modeling",
      "RERA compliance verification",
      "Documentation preparation and review",
      "Stakeholder consultation and approval"
    ],
    benefits: [
      "Fair and transparent cost allocation",
      "RERA regulatory compliance assurance",
      "Reduced owner disputes and conflicts",
      "Professional cost documentation",
      "Legal protection and compliance",
      "Improved management transparency"
    ],
    duration: "1-3 weeks",
    price: "Custom Quote",
    includes: [
      "Comprehensive area assessment",
      "Cost allocation calculations",
      "RERA compliance verification",
      "Detailed allocation report",
      "Professional consultation",
      "Dispute resolution support"
    ]
  },
  "reinstatement-cost-assessment": {
    slug: "reinstatement-cost-assessment",
    title: "Reinstatement Cost Assessment",
    description: "Professional valuation of property reinstatement costs for insurance purposes and regulatory compliance requirements under UAE property law.",
    image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600",
    longDescription: "Our Reinstatement Cost Assessment service provides professional valuation of property reinstatement costs for insurance purposes and regulatory compliance. This critical service ensures accurate insurance coverage and compliance with UAE property law requirements, protecting property owners from underinsurance risks.",
    features: [
      "Insurance valuation compliance assessment",
      "Current market cost analysis and evaluation",
      "Regulatory requirement adherence verification",
      "Risk assessment integration and analysis",
      "Professional certification and documentation",
      "Annual review recommendations and updates",
      "Insurance adequacy evaluation",
      "Market trend analysis and reporting"
    ],
    process: [
      "Property inspection and assessment",
      "Market cost analysis and research",
      "Insurance requirement evaluation",
      "Regulatory compliance verification",
      "Valuation calculation and modeling",
      "Professional certification and reporting"
    ],
    benefits: [
      "Accurate insurance coverage protection",
      "Regulatory compliance assurance",
      "Protection from underinsurance risks",
      "Professional valuation certification",
      "Insurance claim support",
      "Risk mitigation and management"
    ],
    duration: "1-2 weeks",
    price: "Custom Quote",
    includes: [
      "Professional property valuation",
      "Market cost analysis",
      "Insurance compliance verification",
      "Certified valuation report",
      "Professional consultation",
      "Annual review recommendations"
    ]
  },
  "building-completion-audit": {
    slug: "building-completion-audit",
    title: "Building Completion Audit",
    description: "Comprehensive audit to verify building completion status against approved plans and regulatory requirements for RERA compliance and handover certification.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600",
    longDescription: "Our Building Completion Audit service provides comprehensive verification of building completion status against approved plans and regulatory requirements. This essential service ensures RERA compliance and proper handover certification, protecting developers and property owners from regulatory issues and compliance failures.",
    features: [
      "Plan compliance verification and assessment",
      "RERA requirement assessment and documentation",
      "Completion status documentation and reporting",
      "Regulatory liaison support and coordination",
      "Handover readiness certification and approval",
      "Non-compliance identification and remediation",
      "Quality control verification",
      "Documentation preparation and management"
    ],
    process: [
      "Plan review and analysis",
      "On-site completion verification",
      "Regulatory compliance assessment",
      "Documentation preparation and review",
      "RERA liaison and coordination",
      "Certification preparation and submission"
    ],
    benefits: [
      "RERA compliance assurance",
      "Proper handover certification",
      "Regulatory protection and compliance",
      "Professional documentation support",
      "Risk mitigation and management",
      "Quality assurance verification"
    ],
    duration: "2-4 weeks",
    price: "Custom Quote",
    includes: [
      "Comprehensive completion audit",
      "Plan compliance verification",
      "RERA documentation support",
      "Regulatory liaison services",
      "Professional certification",
      "Detailed audit report"
    ]
  },
  "building-condition-survey": {
    slug: "building-condition-survey",
    title: "Building Condition Survey",
    description: "Detailed condition assessment of building components and systems for regulatory reporting, maintenance planning, and RERA compliance documentation.",
    image: "https://images.unsplash.com/photo-1523287562758-66c7fc58967f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600",
    longDescription: "Our Building Condition Survey service provides detailed assessment of building components and systems for regulatory reporting, maintenance planning, and RERA compliance documentation. This comprehensive service ensures proper building management and regulatory compliance while supporting long-term maintenance planning.",
    features: [
      "Comprehensive condition analysis and assessment",
      "Regulatory reporting compliance documentation",
      "Maintenance planning integration and support",
      "Asset condition documentation and reporting",
      "Risk identification and assessment",
      "Improvement recommendations and planning",
      "System performance evaluation",
      "Compliance monitoring and reporting"
    ],
    process: [
      "Building inspection and assessment",
      "Component condition evaluation",
      "System performance analysis",
      "Risk assessment and identification",
      "Documentation preparation and review",
      "Recommendations development and presentation"
    ],
    benefits: [
      "Comprehensive building condition knowledge",
      "Effective maintenance planning support",
      "Regulatory compliance assurance",
      "Risk mitigation and management",
      "Professional assessment documentation",
      "Long-term cost optimization"
    ],
    duration: "1-3 weeks",
    price: "Custom Quote",
    includes: [
      "Detailed condition survey",
      "Component analysis report",
      "Maintenance planning support",
      "Risk assessment documentation",
      "Professional recommendations",
      "Regulatory compliance verification"
    ]
  },
  "technical-due-diligence": {
    slug: "technical-due-diligence",
    title: "Technical Due Diligence",
    description: "Comprehensive technical analysis for property acquisition, covering structural, mechanical, and compliance aspects for informed investment decisions in UAE market.",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600",
    longDescription: "Our Technical Due Diligence service provides comprehensive technical analysis for property acquisition, covering all structural, mechanical, and compliance aspects. This critical service enables informed investment decisions in the UAE market by identifying potential risks, compliance issues, and technical challenges before property acquisition.",
    features: [
      "Investment risk assessment and analysis",
      "Technical compliance verification and documentation",
      "Structural integrity analysis and evaluation",
      "Systems performance evaluation and testing",
      "Market value correlation and analysis",
      "Professional recommendations and advisory",
      "Regulatory compliance verification",
      "Future maintenance cost projections"
    ],
    process: [
      "Property documentation review",
      "Comprehensive technical inspection",
      "Compliance verification and assessment",
      "Risk analysis and evaluation",
      "Market analysis and comparison",
      "Report preparation and presentation"
    ],
    benefits: [
      "Informed investment decision making",
      "Risk identification and mitigation",
      "Technical compliance assurance",
      "Professional investment advisory",
      "Market value optimization",
      "Future cost prediction and planning"
    ],
    duration: "2-4 weeks",
    price: "Custom Quote",
    includes: [
      "Comprehensive technical analysis",
      "Risk assessment report",
      "Compliance verification",
      "Investment recommendations",
      "Professional consultation",
      "Detailed due diligence report"
    ]
  },
  "dilapidation-survey": {
    slug: "dilapidation-survey",
    title: "Dilapidation Survey",
    description: "Pre and post-construction condition assessments of adjacent properties to document potential impact from nearby construction activities and protect property interests.",
    image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600",
    longDescription: "Our Dilapidation Survey service provides professional pre and post-construction condition assessments of adjacent properties to document potential impact from nearby construction activities. This essential service protects property interests and provides legal documentation for potential damage claims.",
    features: [
      "Pre-construction condition documentation",
      "Post-construction comparison and analysis",
      "Impact assessment analysis and evaluation",
      "Legal documentation support and preparation",
      "Photographic evidence collection and archiving",
      "Expert witness testimony and support",
      "Damage quantification and assessment",
      "Construction monitoring and reporting"
    ],
    process: [
      "Initial property condition assessment",
      "Detailed documentation and photography",
      "Construction monitoring and observation",
      "Post-construction condition evaluation",
      "Impact analysis and comparison",
      "Legal documentation preparation"
    ],
    benefits: [
      "Legal protection and documentation",
      "Property interest protection",
      "Professional evidence collection",
      "Expert witness support",
      "Damage claim support",
      "Risk mitigation and management"
    ],
    duration: "Ongoing monitoring",
    price: "Custom Quote",
    includes: [
      "Pre-construction assessment",
      "Ongoing construction monitoring",
      "Post-construction evaluation",
      "Legal documentation support",
      "Expert witness services",
      "Comprehensive impact report"
    ]
  },
  "thermographic-survey": {
    slug: "thermographic-survey",
    title: "Thermographic Survey",
    description: "Advanced thermal imaging inspections following ASHRAE standards to detect energy losses, moisture intrusion, and NFPA 70 electrical compliance issues invisible to conventional inspection methods.",
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600",
    longDescription: "Our Thermographic Survey service utilizes advanced thermal imaging technology following ASHRAE Standard 180 guidelines to detect energy losses, moisture intrusion, and NFPA 70 electrical compliance issues that are invisible to conventional inspection methods. This cutting-edge service provides detailed ASTM-compliant analysis of building performance and identifies hidden problems before they become costly repairs.",
    features: [
      "Thermal imaging analysis and evaluation",
      "Energy efficiency assessment and optimization",
      "Moisture detection and analysis",
      "Electrical system evaluation and testing",
      "Building envelope testing and assessment",
      "Performance optimization recommendations",
      "Heat loss identification and quantification",
      "Insulation effectiveness evaluation"
    ],
    process: [
      "Thermal imaging data collection",
      "Image analysis and interpretation",
      "Problem identification and documentation",
      "Performance assessment and evaluation",
      "Recommendations development",
      "Report preparation and presentation"
    ],
    benefits: [
      "Hidden problem identification",
      "Energy efficiency optimization",
      "Preventive maintenance planning",
      "Cost-effective problem solving",
      "Professional thermal analysis",
      "Performance improvement guidance"
    ],
    duration: "1-2 days",
    price: "Custom Quote",
    includes: [
      "Advanced thermal imaging",
      "Comprehensive analysis",
      "Problem identification",
      "Performance recommendations",
      "Detailed thermal report",
      "Professional consultation"
    ]
  },
  "noise-survey": {
    slug: "noise-survey",
    title: "Noise Survey",
    description: "Professional acoustic assessments to measure and analyze noise levels for compliance with local regulations and habitability standards in UAE residential and commercial properties.",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600",
    longDescription: "Our Noise Survey service provides professional acoustic assessments to measure and analyze noise levels for compliance with local regulations and habitability standards. This specialized service ensures properties meet UAE noise regulations and provides documentation for regulatory compliance and dispute resolution.",
    features: [
      "Acoustic level measurement and analysis",
      "Regulatory compliance testing and verification",
      "Environmental impact analysis and assessment",
      "Habitability assessment and evaluation",
      "Mitigation recommendations and planning",
      "Expert reporting and documentation",
      "Noise source identification and analysis",
      "Sound level monitoring and tracking"
    ],
    process: [
      "Site acoustic assessment and measurement",
      "Data collection and analysis",
      "Regulatory compliance verification",
      "Impact assessment and evaluation",
      "Mitigation planning and recommendations",
      "Professional reporting and documentation"
    ],
    benefits: [
      "Regulatory compliance assurance",
      "Habitability verification",
      "Professional acoustic analysis",
      "Noise mitigation guidance",
      "Legal documentation support",
      "Environmental protection compliance"
    ],
    duration: "1-3 days",
    price: "Custom Quote",
    includes: [
      "Professional noise measurement",
      "Regulatory compliance assessment",
      "Acoustic analysis report",
      "Mitigation recommendations",
      "Expert consultation",
      "Compliance documentation"
    ]
  },
  "structural-survey": {
    slug: "structural-survey",
    title: "Structural Survey",
    description: "Detailed structural engineering assessment following ASTM E2018 standards, examining building integrity, load-bearing elements, and structural compliance with NFPA safety codes and UAE building regulations.",
    image: "https://images.unsplash.com/photo-1581094613018-d1db5d0b5b30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600",
    longDescription: "Our Structural Survey service provides detailed structural engineering assessment following ASTM E2018 Property Condition Assessment standards, examining building integrity, load-bearing elements, and structural compliance with NFPA fire safety codes and UAE building regulations. This critical service ensures structural safety and regulatory compliance while identifying potential structural issues and risks.",
    features: [
      "Structural integrity assessment and analysis",
      "Load-bearing analysis and evaluation",
      "Building code compliance verification",
      "Safety standard verification and assessment",
      "Risk identification and evaluation",
      "Remediation planning and recommendations",
      "Structural component evaluation",
      "Foundation assessment and analysis"
    ],
    process: [
      "Structural inspection and assessment",
      "Load analysis and calculation",
      "Compliance verification and evaluation",
      "Risk assessment and identification",
      "Remediation planning and development",
      "Professional reporting and documentation"
    ],
    benefits: [
      "Structural safety assurance",
      "Building code compliance verification",
      "Risk mitigation and management",
      "Professional structural analysis",
      "Safety standard compliance",
      "Investment protection and security"
    ],
    duration: "1-2 weeks",
    price: "Custom Quote",
    includes: [
      "Comprehensive structural assessment",
      "Load-bearing analysis",
      "Compliance verification",
      "Risk assessment report",
      "Remediation recommendations",
      "Professional engineering consultation"
    ]
  }
};

export default function ServiceDetail() {
  const params = useParams();
  const slug = params.slug;
  const category = params.category;
  
  if (!slug || !servicesData[slug]) {
    return <NotFound />;
  }

  const service = servicesData[slug];

  const categoryDisplayNames = {
    'property-snagging': 'Property Snagging',
    'rera-services': 'RERA Services', 
    'technical-inspections': 'Technical Inspections'
  };

  const categoryName = categoryDisplayNames[category as keyof typeof categoryDisplayNames] || 'Services';

  return (
    <>
      <SEO 
        title={`${service.title} UAE - Professional ${categoryName} Services | UrbanGrid`}
        description={`${service.description} Expert ${categoryName.toLowerCase()} services across Dubai, Abu Dhabi, UAE. Professional inspection reports, same-day service, competitive pricing.`}
        keywords={`${service.title.toLowerCase()}, ${categoryName.toLowerCase()} UAE, property inspection Dubai, ${service.slug} Abu Dhabi, professional inspection services`}
      />
      
      <div className="pt-16 lg:pt-20">
      {/* Breadcrumb Navigation */}
      <section className="py-4 bg-light-grey border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex text-sm text-text-grey" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-brand-green transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/services" className="hover:text-brand-green transition-colors">
              Services
            </Link>
            <span className="mx-2">/</span>
            <span className="text-brand-black font-medium">{service.title}</span>
          </nav>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative py-16 lg:py-20 bg-gray-900">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${service.image})` }}
        ></div>
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              {service.title} in Dubai, Abu Dhabi & UAE
            </h1>
            <p className="text-xl leading-relaxed mb-4">
              {service.description}
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-green-200">
              <span className="flex items-center">
                <i className="fas fa-check-circle mr-2"></i>
                Same-Day Reports
              </span>
              <span className="flex items-center">
                <i className="fas fa-check-circle mr-2"></i>
                RERA Certified
              </span>
              <span className="flex items-center">
                <i className="fas fa-check-circle mr-2"></i>
                40,000+ Properties Inspected
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Service Overview */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-brand-black mb-6">
                Service Overview
              </h2>
              <p className="text-text-grey leading-relaxed mb-8">
                {service.longDescription}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-center p-4 bg-light-grey rounded-lg">
                  <i className="fas fa-clock text-brand-green text-2xl mr-4"></i>
                  <div>
                    <div className="font-semibold text-brand-black">Duration</div>
                    <div className="text-text-grey">{service.duration}</div>
                  </div>
                </div>
                
                <div className="flex items-center p-4 bg-light-grey rounded-lg">
                  <i className="fas fa-tag text-brand-green text-2xl mr-4"></i>
                  <div>
                    <div className="font-semibold text-brand-black">Starting Price</div>
                    <div className="text-text-grey">{service.price}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-brand-black mb-4">
                    Get a Free Quote
                  </h3>
                  <p className="text-text-grey mb-6">
                    Contact our experts for a customized quote and consultation.
                  </p>
                  
                  <div className="space-y-4">
                    <Link href="/contact">
                      <Button className="w-full bg-brand-green text-white hover:bg-opacity-90">
                        Request Quote
                      </Button>
                    </Link>
                    
                    <a 
                      href="tel:+971585686852"
                      className="w-full inline-flex items-center justify-center px-4 py-2 border border-brand-green text-brand-green rounded-md hover:bg-brand-green hover:text-white transition-colors"
                    >
                      <i className="fas fa-phone mr-2"></i>
                      Call: +971 58 568 6852
                    </a>
                    
                    <a 
                      href="https://wa.me/971585686852?text=Hello! I'm interested in your property inspection services."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                    >
                      <i className="fab fa-whatsapp mr-2"></i>
                      WhatsApp Us
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 lg:py-20 bg-light-grey">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-brand-black mb-12 text-center">
            Key Features & Services
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {service.features.map((feature, index) => (
              <div key={index} className="flex items-start bg-white p-6 rounded-lg shadow-sm">
                <i className="fas fa-check-circle text-brand-green text-xl mr-4 mt-1"></i>
                <span className="text-text-grey">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-brand-black mb-12 text-center">
            Our Process
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {service.process.map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-brand-green text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                  {index + 1}
                </div>
                <p className="text-text-grey">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 lg:py-20 bg-light-grey">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-brand-black mb-8">
                Why Choose This Service?
              </h2>
              
              <div className="space-y-4">
                {service.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start">
                    <i className="fas fa-star text-brand-green mr-4 mt-1"></i>
                    <span className="text-text-grey">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-brand-black mb-6">
                    What's Included
                  </h3>
                  
                  <div className="space-y-3">
                    {service.includes.map((item, index) => (
                      <div key={index} className="flex items-center">
                        <i className="fas fa-check text-brand-green mr-3"></i>
                        <span className="text-text-grey">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-brand-black mb-12 text-center">
            Related Services You Might Need
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Show 3 related services from the same category or popular services */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <i className="fas fa-clipboard-list text-brand-green text-3xl mb-4"></i>
                <h3 className="text-lg font-semibold mb-3">New Build Snagging</h3>
                <p className="text-text-grey mb-4">Comprehensive pre-handover inspection services</p>
                <Link href="/services/property-snagging/new-build-snagging">
                  <span className="text-brand-green hover:underline cursor-pointer">Learn More →</span>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <i className="fas fa-search text-brand-green text-3xl mb-4"></i>
                <h3 className="text-lg font-semibold mb-3">Pre-Purchase Inspection</h3>
                <p className="text-text-grey mb-4">Investment protection for existing properties</p>
                <Link href="/services/property-snagging/secondary-market">
                  <span className="text-brand-green hover:underline cursor-pointer">Learn More →</span>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <i className="fas fa-file-alt text-brand-green text-3xl mb-4"></i>
                <h3 className="text-lg font-semibold mb-3">DLP Snagging</h3>
                <p className="text-text-grey mb-4">Warranty period defect identification</p>
                <Link href="/services/property-snagging/dlp-snagging">
                  <span className="text-brand-green hover:underline cursor-pointer">Learn More →</span>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section for SEO */}
      <section className="py-16 lg:py-20 bg-light-grey">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-brand-black mb-12 text-center">
            Frequently Asked Questions
          </h2>
          
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-brand-black mb-3">
                How much does {service.title.toLowerCase()} cost in UAE?
              </h3>
              <p className="text-text-grey">
                Our {service.title.toLowerCase()} services start from {service.price}. Final pricing depends on property size, location, and specific requirements. Contact us for a free, no-obligation quote tailored to your needs.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-brand-black mb-3">
                How long does the {service.title.toLowerCase()} process take?
              </h3>
              <p className="text-text-grey">
                Typically takes {service.duration}. We provide same-day reports with detailed findings, photographs, and professional recommendations. Urgent inspections can be arranged within 24 hours.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-brand-black mb-3">
                Do you provide {service.title.toLowerCase()} services across all UAE emirates?
              </h3>
              <p className="text-text-grey">
                Yes, we provide comprehensive {service.title.toLowerCase()} services across Dubai, Abu Dhabi, Sharjah, Ajman, Fujairah, Ras Al Khaimah, and Umm Al Quwain. Our certified team ensures consistent quality standards nationwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-brand-green text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Schedule Your {service.title}?
          </h2>
          <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
            Get expert {service.title.toLowerCase()} services across Dubai, Abu Dhabi, Sharjah and all UAE. Same-day reports, competitive pricing, RERA certified professionals.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button className="bg-white text-brand-green hover:bg-gray-100">
                Get Free Consultation
              </Button>
            </Link>
            <Link href="/services">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-brand-green">
                View All Services
              </Button>
            </Link>
          </div>
          
          {/* Location Coverage */}
          <div className="mt-12 pt-8 border-t border-green-400">
            <h3 className="text-2xl font-bold mb-6 text-center">
              Service Coverage Across UAE
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <i className="fas fa-map-marker-alt mb-2 text-2xl"></i>
                <div className="font-semibold">Dubai</div>
                <div className="text-green-200 text-sm">All Areas</div>
              </div>
              <div>
                <i className="fas fa-map-marker-alt mb-2 text-2xl"></i>
                <div className="font-semibold">Abu Dhabi</div>
                <div className="text-green-200 text-sm">All Areas</div>
              </div>
              <div>
                <i className="fas fa-map-marker-alt mb-2 text-2xl"></i>
                <div className="font-semibold">Sharjah</div>
                <div className="text-green-200 text-sm">All Areas</div>
              </div>
              <div>
                <i className="fas fa-map-marker-alt mb-2 text-2xl"></i>
                <div className="font-semibold">Northern Emirates</div>
                <div className="text-green-200 text-sm">Ajman, RAK, Fujairah</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}
