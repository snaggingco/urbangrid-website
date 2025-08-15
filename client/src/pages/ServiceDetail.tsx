import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import NotFound from "@/pages/not-found";

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
    price: "From AED 1,500",
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
    price: "From AED 1,200",
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
    price: "From AED 1,800",
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
    price: "From AED 800",
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
    price: "From AED 1,000",
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
  }
};

export default function ServiceDetail() {
  const params = useParams();
  const slug = params.slug;
  
  if (!slug || !servicesData[slug]) {
    return <NotFound />;
  }

  const service = servicesData[slug];

  return (
    <div className="pt-16 lg:pt-20">
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
              {service.title}
            </h1>
            <p className="text-xl leading-relaxed">
              {service.description}
            </p>
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
                      href="tel:+971501234567"
                      className="w-full inline-flex items-center justify-center px-4 py-2 border border-brand-green text-brand-green rounded-md hover:bg-brand-green hover:text-white transition-colors"
                    >
                      <i className="fas fa-phone mr-2"></i>
                      Call: +971 50 123 4567
                    </a>
                    
                    <a 
                      href="https://wa.me/971501234567?text=Hello! I'm interested in your property inspection services."
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

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-brand-green text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Schedule Your Inspection?
          </h2>
          <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
            Get professional property inspection services from UAE's most trusted experts. Contact us today for a free consultation.
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
        </div>
      </section>
    </div>
  );
}
