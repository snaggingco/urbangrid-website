import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Services() {
  const [activeSection, setActiveSection] = useState<keyof typeof serviceCategories>('property-snagging');

  const serviceCategories = {
    'property-snagging': {
      title: 'Property Snagging Services',
      subtitle: 'Comprehensive property inspection and snagging services across the UAE',
      services: [
        {
          id: 1,
          title: "New Build Handover Snagging & Inspection",
          slug: "new-build-snagging",
          description: "Comprehensive pre-handover inspection of newly constructed properties to identify defects, incomplete work, and quality issues before you take possession.",
          icon: "fas fa-clipboard-list",
          features: [
            "Complete structural assessment",
            "MEP systems inspection",
            "Finishing quality evaluation",
            "Compliance verification",
            "Detailed defect report",
            "Follow-up inspections"
          ],
          duration: "3-6 hours",
          price: "From AED 1 / Sq.ft"
        },
        {
          id: 2,
          title: "Post Renovation / Fit-out Snagging Inspection",
          slug: "post-renovation-inspection",
          description: "Quality assessment after renovation or fit-out work to ensure all improvements meet specifications and industry standards.",
          icon: "fas fa-hammer",
          features: [
            "Renovation work quality check",
            "Material compliance verification",
            "Safety standards assessment",
            "Workmanship evaluation",
            "Before/after comparison",
            "Warranty documentation"
          ],
          duration: "3-6 hours",
          price: "From AED 1 / Sq.ft"
        },
        {
          id: 3,
          title: "Property Defect Liability Period (DLP) Snagging",
          slug: "dlp-snagging",
          description: "Strategic inspection during the defect liability period to identify and document all issues before warranty expires.",
          icon: "fas fa-file-alt",
          features: [
            "Pre-warranty expiry inspection",
            "Comprehensive defect catalog",
            "Developer liaison support",
            "Rectification tracking",
            "Legal documentation",
            "Multiple follow-ups"
          ],
          duration: "1-2 hours",
          price: "From AED 0.5 / Sq.ft"
        },
        {
          id: 4,
          title: "Property Move-in / Move-out Snagging",
          slug: "move-in-move-out",
          description: "Detailed condition reports for rental properties to protect both tenants and landlords during property transitions.",
          icon: "fas fa-key",
          features: [
            "Comprehensive condition report",
            "Photo documentation",
            "Damage assessment",
            "Security deposit protection",
            "Legal compliance",
            "Tenant/landlord mediation"
          ],
          duration: "1-2 hours",
          price: "From AED 500"
        },
        {
          id: 5,
          title: "Secondary Market Property Snagging",
          slug: "secondary-market",
          description: "Pre-purchase inspections for existing properties to help buyers make informed decisions and negotiate fair prices.",
          icon: "fas fa-search",
          features: [
            "Pre-purchase inspection",
            "Market value assessment",
            "Hidden defect detection",
            "Maintenance requirement analysis",
            "Negotiation support",
            "Investment protection"
          ],
          duration: "3-5 hours",
          price: "From AED 1 / Sq.ft"
        },
        {
          id: 6,
          title: "Developer and Contractor Project Snagging",
          slug: "developer-projects",
          description: "Quality control inspections for developers and contractors to ensure projects meet industry standards and client expectations.",
          icon: "fas fa-users",
          features: [
            "Quality control auditing",
            "Progress milestone verification",
            "Compliance monitoring",
            "Standards enforcement",
            "Client satisfaction assurance",
            "Reputation protection"
          ],
          duration: "Depending on project",
          price: "Custom Quote"
        }
      ]
    },
    'rera-services': {
      title: 'RERA Services',
      subtitle: 'Professional regulatory compliance and assessment services for UAE property market',
      services: [
        {
          id: 7,
          title: "Reserve Fund Study / Sinking Fund",
          slug: "reserve-fund-study",
          description: "Comprehensive analysis of building reserve fund requirements and long-term capital expenditure planning for strata properties in compliance with RERA regulations.",
          icon: "fas fa-calculator",
          features: [
            "Long-term capital planning",
            "RERA compliance assessment",
            "Financial projection modeling",
            "Asset lifecycle analysis",
            "Regulatory documentation",
            "Stakeholder consultation"
          ],
          duration: "Custom",
          price: "Custom Quote"
        },
        {
          id: 8,
          title: "Service Charge Cost Allocation",
          slug: "service-charge-allocation",
          description: "Detailed assessment and allocation of service charges across common property areas ensuring fair distribution and full compliance with RERA guidelines.",
          icon: "fas fa-chart-pie",
          features: [
            "Fair cost distribution analysis",
            "RERA guideline compliance",
            "Common area assessment",
            "Usage pattern analysis",
            "Transparent reporting",
            "Dispute resolution support"
          ],
          duration: "Custom",
          price: "Custom Quote"
        },
        {
          id: 9,
          title: "Reinstatement Cost Assessment",
          slug: "reinstatement-cost-assessment",
          description: "Professional valuation of property reinstatement costs for insurance purposes and regulatory compliance requirements under UAE property law.",
          icon: "fas fa-building",
          features: [
            "Insurance valuation compliance",
            "Current market cost analysis",
            "Regulatory requirement adherence",
            "Risk assessment integration",
            "Professional certification",
            "Annual review recommendations"
          ],
          duration: "Custom",
          price: "Custom Quote"
        },
        {
          id: 10,
          title: "Building Completion Audit",
          slug: "building-completion-audit",
          description: "Comprehensive audit to verify building completion status against approved plans and regulatory requirements for RERA compliance and handover certification.",
          icon: "fas fa-clipboard-check",
          features: [
            "Plan compliance verification",
            "RERA requirement assessment",
            "Completion status documentation",
            "Regulatory liaison support",
            "Handover readiness certification",
            "Non-compliance identification"
          ],
          duration: "Custom",
          price: "Custom Quote"
        },
        {
          id: 11,
          title: "Building Condition Survey",
          slug: "building-condition-survey",
          description: "Detailed condition assessment of building components and systems for regulatory reporting, maintenance planning, and RERA compliance documentation.",
          icon: "fas fa-search-plus",
          features: [
            "Comprehensive condition analysis",
            "Regulatory reporting compliance",
            "Maintenance planning integration",
            "Asset condition documentation",
            "Risk identification",
            "Improvement recommendations"
          ],
          duration: "Custom",
          price: "Custom Quote"
        }
      ]
    },
    'technical-inspections': {
      title: 'Other Technical Inspections',
      subtitle: 'Specialized technical assessments and surveys for comprehensive property analysis',
      services: [
        {
          id: 12,
          title: "Technical Due Diligence",
          slug: "technical-due-diligence",
          description: "Comprehensive technical analysis for property acquisition, covering structural, mechanical, and compliance aspects for informed investment decisions in UAE market.",
          icon: "fas fa-microscope",
          features: [
            "Investment risk assessment",
            "Technical compliance verification",
            "Structural integrity analysis",
            "Systems performance evaluation",
            "Market value correlation",
            "Professional recommendations"
          ],
          duration: "Custom",
          price: "Custom Quote"
        },
        {
          id: 13,
          title: "Dilapidation Survey",
          slug: "dilapidation-survey",
          description: "Pre and post-construction condition assessments of adjacent properties to document potential impact from nearby construction activities and protect property interests.",
          icon: "fas fa-camera",
          features: [
            "Pre-construction documentation",
            "Post-construction comparison",
            "Impact assessment analysis",
            "Legal documentation support",
            "Photographic evidence",
            "Expert witness testimony"
          ],
          duration: "Custom",
          price: "Custom Quote"
        },
        {
          id: 14,
          title: "Thermographic Survey",
          slug: "thermographic-survey",
          description: "Advanced thermal imaging inspections to detect energy losses, moisture intrusion, and electrical issues invisible to conventional inspection methods.",
          icon: "fas fa-thermometer-half",
          features: [
            "Thermal imaging analysis",
            "Energy efficiency assessment",
            "Moisture detection",
            "Electrical system evaluation",
            "Building envelope testing",
            "Performance optimization"
          ],
          duration: "Custom",
          price: "Custom Quote"
        },
        {
          id: 15,
          title: "Noise Survey",
          slug: "noise-survey",
          description: "Professional acoustic assessments to measure and analyze noise levels for compliance with local regulations and habitability standards in UAE residential and commercial properties.",
          icon: "fas fa-volume-up",
          features: [
            "Acoustic level measurement",
            "Regulatory compliance testing",
            "Environmental impact analysis",
            "Habitability assessment",
            "Mitigation recommendations",
            "Expert reporting"
          ],
          duration: "Custom",
          price: "Custom Quote"
        },
        {
          id: 16,
          title: "Structural Survey",
          slug: "structural-survey",
          description: "Detailed structural engineering assessment examining building integrity, load-bearing elements, and structural compliance with UAE safety standards and building codes.",
          icon: "fas fa-hard-hat",
          features: [
            "Structural integrity assessment",
            "Load-bearing analysis",
            "Building code compliance",
            "Safety standard verification",
            "Risk identification",
            "Remediation planning"
          ],
          duration: "Custom",
          price: "Custom Quote"
        }
      ]
    }
  };

  const sections = [
    { key: 'property-snagging', label: 'Section 1: Property Snagging Services' },
    { key: 'rera-services', label: 'Section 2: RERA Services' },
    { key: 'technical-inspections', label: 'Section 3: Other Technical Inspections' }
  ];

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-brand-black mb-6">
              Our Professional Services
            </h1>
            <p className="text-xl text-text-grey leading-relaxed">
              Comprehensive property inspection and snagging services across the UAE, ensuring your investment meets the highest standards of quality and compliance.
            </p>
          </div>
        </div>
      </section>

      {/* Services Sections */}
      <section className="py-16 lg:py-20 bg-light-grey">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Navigation */}
          <div className="mb-12">
            <div className="flex flex-wrap justify-center gap-4 bg-white rounded-lg p-4 shadow-sm">
              {sections.map((section) => (
                <button
                  key={section.key}
                  onClick={() => setActiveSection(section.key as keyof typeof serviceCategories)}
                  className={`px-6 py-3 rounded-md font-medium transition-colors duration-200 ${
                    activeSection === section.key
                      ? 'bg-brand-green text-white'
                      : 'text-text-grey hover:text-brand-green hover:bg-gray-50'
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Active Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-4">
              {serviceCategories[activeSection].title}
            </h2>
            <p className="text-lg text-text-grey max-w-3xl mx-auto">
              {serviceCategories[activeSection].subtitle}
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {serviceCategories[activeSection].services.map((service) => (
              <Card key={service.id} className="bg-white overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className="service-icon mb-6">
                    <i className={service.icon}></i>
                  </div>
                  <h3 className="text-2xl font-semibold text-brand-black mb-4">
                    {service.title}
                  </h3>
                  <p className="text-text-grey mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  <div className="space-y-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-semibold text-brand-green mb-2">Key Features:</div>
                        <ul className="text-sm text-text-grey space-y-1">
                          {service.features.slice(0, 3).map((feature, index) => (
                            <li key={index} className="flex items-center">
                              <i className="fas fa-check text-brand-green mr-2"></i>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <i className="fas fa-clock text-brand-green mr-2"></i>
                          <span className="text-text-grey">Duration: {service.duration}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <i className="fas fa-tag text-brand-green mr-2"></i>
                          <span className="text-text-grey">{service.price}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href={`/services/${activeSection}/${service.slug}`}>
                      <Button className="bg-brand-green text-white hover:bg-opacity-90 w-full">
                        Learn More
                      </Button>
                    </Link>
                    <Link href="/contact">
                      <Button variant="outline" className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white flex-1">
                        Get Quote
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-4">
              Our Inspection Process
            </h2>
            <p className="text-lg text-text-grey max-w-2xl mx-auto">
              A systematic approach ensuring thorough, professional, and reliable property inspections every time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-brand-green text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-brand-black mb-2">Consultation</h3>
              <p className="text-text-grey">
                Initial discussion to understand your requirements and schedule the inspection.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-brand-green text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-brand-black mb-2">Inspection</h3>
              <p className="text-text-grey">
                Comprehensive on-site examination using professional tools and expertise.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-brand-green text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-brand-black mb-2">Reporting</h3>
              <p className="text-text-grey">
                Detailed report with photos, findings, and professional recommendations.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-brand-green text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="text-xl font-semibold text-brand-black mb-2">Follow-up</h3>
              <p className="text-text-grey">
                Ongoing support and follow-up inspections as needed for your peace of mind.
              </p>
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
            Protect your property investment with professional inspection services from UAE's most trusted experts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button className="bg-white text-brand-green hover:bg-gray-100">
                Get Free Consultation
              </Button>
            </Link>
            <a
              href="tel:+971501234567"
              className="inline-flex items-center bg-transparent border-2 border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-brand-green transition-colors"
            >
              <i className="fas fa-phone mr-2"></i>
              Call Now: +971 58 568 6852
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}