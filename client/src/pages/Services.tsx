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
    { key: 'property-snagging', label: 'Property Snagging Services' },
    { key: 'rera-services', label: 'RERA Services' },
    { key: 'technical-inspections', label: 'Other Technical Inspections' }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-zinc-950">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">
            Services
          </p>
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold text-white leading-tight mb-6">
            Our Professional Services
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl">
            Comprehensive property inspection and snagging services across the UAE, ensuring your investment meets the highest standards of quality and compliance.
          </p>
        </div>
      </section>

      {/* Services Sections */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          {/* Section Navigation */}
          <div className="mb-16 border-b border-zinc-100">
            <div className="flex flex-wrap gap-8">
              {sections.map((section) => (
                <button
                  key={section.key}
                  onClick={() => setActiveSection(section.key as keyof typeof serviceCategories)}
                  className={`pb-4 text-[10px] uppercase tracking-[0.18em] font-semibold transition-all relative ${
                    activeSection === section.key
                      ? 'text-zinc-900'
                      : 'text-zinc-400 hover:text-zinc-600'
                  }`}
                >
                  {section.label}
                  {activeSection === section.key && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-green" />
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Active Section Header */}
          <div className="grid lg:grid-cols-2 gap-8 mb-20 items-start">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">
                {serviceCategories[activeSection].title}
              </p>
              <h2 className="text-4xl lg:text-5xl font-bold text-zinc-900 leading-tight">
                Specialized Solutions
              </h2>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed pt-2">
              {serviceCategories[activeSection].subtitle}
            </p>
          </div>

          {/* Services List - Numbered Editorial List */}
          <div className="divide-y divide-zinc-200 border-t border-zinc-200">
            {serviceCategories[activeSection].services.map((service, index) => (
              <div key={service.id} className="group py-12">
                <div className="grid lg:grid-cols-[80px_1fr_1.5fr_auto] gap-8 items-start">
                  <span className="text-[10px] font-bold tracking-[0.25em] text-zinc-300 mt-1">
                    {String(index + 1).padStart(3, '0')}
                  </span>
                  
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900 mb-2">
                      {service.title}
                    </h3>
                    <div className="flex flex-wrap gap-4 mt-4">
                      <div className="flex items-center text-[10px] uppercase tracking-wider text-zinc-400">
                        <i className="fas fa-clock mr-2 text-brand-green/50"></i>
                        {service.duration}
                      </div>
                      <div className="flex items-center text-[10px] uppercase tracking-wider text-zinc-400">
                        <i className="fas fa-tag mr-2 text-brand-green/50"></i>
                        {service.price}
                      </div>
                    </div>
                  </div>

                  <div className="lg:px-8">
                    <p className="text-sm text-zinc-500 leading-relaxed mb-6">
                      {service.description}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                      {service.features.slice(0, 4).map((feature, idx) => (
                        <div key={idx} className="flex items-start text-[10px] text-zinc-400 uppercase tracking-tight">
                          <span className="text-brand-green mr-2">/</span>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row lg:flex-col gap-4">
                    <Link href={`/services/${activeSection}/${service.slug}`}>
                      <a className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-green border-b border-brand-green pb-0.5 hover:gap-3 transition-all whitespace-nowrap">
                        View Details <i className="fas fa-arrow-right text-[8px]"></i>
                      </a>
                    </Link>
                    <Link href="/contact">
                      <a className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400 hover:text-zinc-900 transition-all whitespace-nowrap">
                        Inquiry <i className="fas fa-envelope text-[8px]"></i>
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 lg:py-32 bg-zinc-50">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-16 mb-24">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">
                Our Methodology
              </p>
              <h2 className="text-4xl lg:text-5xl font-bold text-zinc-900 leading-tight">
                A systematic approach to excellence.
              </h2>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed pt-2">
              We follow a rigorous, step-by-step process to ensure that every inspection is conducted with the highest degree of professionalism and technical accuracy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16">
            {[
              { step: "01", title: "Consultation", text: "Initial technical discussion to understand specific property requirements." },
              { step: "02", title: "Inspection", text: "Comprehensive on-site examination using advanced diagnostic tools." },
              { step: "03", title: "Reporting", text: "Generation of detailed evidence-based reports with professional findings." },
              { step: "04", title: "Follow-up", text: "Ongoing technical support and verification of rectification work." }
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <span className="text-5xl font-bold text-zinc-100 absolute -top-8 -left-2 z-0">
                  {item.step}
                </span>
                <div className="relative z-10">
                  <h3 className="text-lg font-bold text-zinc-900 mb-4">{item.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32 bg-brand-green text-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.25em] text-white/60 uppercase mb-4">
                Get Started
              </p>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight text-white">
                Ready to Schedule Your Inspection?
              </h2>
              <p className="text-white/70 text-sm leading-relaxed max-w-md">
                Protect your property investment with professional inspection services from UAE's most trusted technical experts.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 lg:justify-end">
              <Link href="/contact">
                <Button className="bg-white text-brand-green hover:bg-zinc-100 rounded-none h-14 px-10 text-[10px] uppercase tracking-[0.2em] font-bold">
                  Free Consultation
                </Button>
              </Link>
              <a
                href="tel:+971585686852"
                className="inline-flex items-center justify-center border border-white/30 text-white h-14 px-10 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-white hover:text-brand-green transition-all"
              >
                +971 58 568 6852
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}