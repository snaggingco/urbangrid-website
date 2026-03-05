import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import SEO from "@/components/SEO";

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
            "Compliance verification"
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
            "Workmanship evaluation"
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
            "Rectification tracking"
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
            "Security deposit protection"
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
            "Maintenance requirement analysis"
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
            "Standards enforcement"
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
            "Asset lifecycle analysis"
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
            "Usage pattern analysis"
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
            "Risk assessment integration"
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
            "Regulatory liaison support"
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
            "Asset condition documentation"
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
            "Systems performance evaluation"
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
            "Legal documentation support"
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
            "Electrical system evaluation"
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
            "Habitability assessment"
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
            "Safety standard verification"
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
    <div className="bg-white">
      <SEO 
        title="Professional Services | UrbanGrid UAE"
        description="Comprehensive property inspection and snagging services across the UAE, ensuring your investment meets the highest standards of quality and compliance."
      />
      
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center pt-20">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=1000&q=80')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/90 via-zinc-950/60 to-transparent" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full">
          <p className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] text-brand-green uppercase mb-6">
            Services
          </p>
          <h1 className="text-6xl sm:text-7xl lg:text-[7rem] xl:text-[8rem] font-bold leading-[0.95] tracking-tight text-white mb-8">
            Professional<br />Services
          </h1>
          <p className="text-base sm:text-lg text-zinc-300 leading-relaxed font-light max-w-2xl">
            Comprehensive property inspection and snagging services across the UAE, ensuring your investment meets the highest standards of quality and compliance.
          </p>
          <div className="mt-12">
            <Link href="/contact">
              <Button className="bg-brand-green hover:bg-brand-green/90 text-white rounded-none h-14 px-10 text-[10px] uppercase tracking-[0.2em] font-bold">
                Free Consultation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Navigation & List */}
      <section className="py-28 lg:py-40 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          {/* Section Navigation */}
          <div className="mb-24 border-b border-zinc-100 overflow-x-auto">
            <div className="flex gap-12 whitespace-nowrap">
              {sections.map((section) => (
                <button
                  key={section.key}
                  onClick={() => setActiveSection(section.key as keyof typeof serviceCategories)}
                  className={`pb-6 text-[10px] uppercase tracking-[0.2em] font-bold transition-all relative ${
                    activeSection === section.key
                      ? 'text-zinc-900'
                      : 'text-zinc-400 hover:text-zinc-600'
                  }`}
                >
                  {section.label}
                  {activeSection === section.key && (
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-brand-green" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Active Section Header */}
          <div className="grid lg:grid-cols-2 gap-12 mb-24">
            <div>
              <p className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] text-brand-green uppercase mb-6">
                {serviceCategories[activeSection].title}
              </p>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-zinc-900 leading-tight">
                Specialized Technical Solutions
              </h2>
            </div>
            <div className="flex items-end">
              <p className="text-lg text-zinc-500 font-light leading-relaxed">
                {serviceCategories[activeSection].subtitle}
              </p>
            </div>
          </div>

          {/* Service List - Dramatic Numbered List */}
          <div className="divide-y divide-zinc-100 border-t border-zinc-100">
            {serviceCategories[activeSection].services.map((service, index) => (
              <div key={service.id} className="group py-16">
                <div className="grid lg:grid-cols-[100px_1fr_1.5fr_auto] gap-12 items-start">
                  <span className="text-6xl font-bold text-zinc-100 leading-none group-hover:text-brand-green/10 transition-colors">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  
                  <div>
                    <h3 className="text-2xl font-bold text-zinc-900 mb-4 group-hover:text-brand-green transition-colors">
                      {service.title}
                    </h3>
                    <div className="flex flex-wrap gap-6 mt-6">
                      <div className="flex items-center text-[10px] uppercase tracking-widest text-zinc-400">
                        <i className="fas fa-clock mr-3 text-brand-green"></i>
                        {service.duration}
                      </div>
                      <div className="flex items-center text-[10px] uppercase tracking-widest text-zinc-400">
                        <i className="fas fa-tag mr-3 text-brand-green"></i>
                        {service.price}
                      </div>
                    </div>
                  </div>

                  <div className="lg:px-12">
                    <p className="text-base text-zinc-500 font-light leading-relaxed mb-8">
                      {service.description}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start text-[10px] text-zinc-400 uppercase tracking-widest">
                          <span className="text-brand-green mr-3">/</span>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex lg:flex-col justify-end gap-6 h-full">
                    <Link href={`/services/${activeSection}/${service.slug}`}>
                      <a className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-green hover:gap-5 transition-all group/link">
                        Details <i className="fas fa-arrow-right text-[8px]"></i>
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cinematic Quote/Callout Block */}
      <section className="relative py-32 lg:py-48 overflow-hidden bg-zinc-950">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=900&q=80" 
            alt="Chapter break" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-950/80 to-zinc-950" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 text-center">
          <p className="text-[10px] font-semibold tracking-[0.3em] text-brand-green uppercase mb-8">
            Expertise
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight max-w-4xl mx-auto italic">
            "Our technical standards aren't just a benchmark—they're our promise of absolute property integrity across the UAE."
          </h2>
          <div className="mt-12 flex justify-center items-center gap-4">
            <div className="h-[1px] w-12 bg-zinc-800" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">UrbanGrid Technical Division</span>
            <div className="h-[1px] w-12 bg-zinc-800" />
          </div>
        </div>
      </section>

      {/* Method Section */}
      <section className="py-28 lg:py-40 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-20 mb-32">
            <div>
              <p className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] text-brand-green uppercase mb-6">
                Methodology
              </p>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-zinc-900 leading-tight">
                A systematic approach to property excellence.
              </h2>
            </div>
            <div className="flex items-end">
              <p className="text-lg text-zinc-500 font-light leading-relaxed">
                We follow a rigorous, step-by-step process to ensure that every inspection is conducted with the highest degree of professionalism and technical accuracy.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-16 gap-y-24">
            {[
              { step: "01", title: "Consultation", text: "Initial technical discussion to understand specific property requirements." },
              { step: "02", title: "Inspection", text: "Comprehensive on-site examination using advanced diagnostic tools." },
              { step: "03", title: "Reporting", text: "Generation of detailed evidence-based reports with professional findings." },
              { step: "04", title: "Follow-up", text: "Ongoing technical support and verification of rectification work." }
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <span className="text-8xl font-bold text-zinc-200/50 absolute -top-12 -left-4 z-0">
                  {item.step}
                </span>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-zinc-900 mb-6">{item.title}</h3>
                  <p className="text-base text-zinc-500 font-light leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 lg:py-40 bg-brand-green text-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.3em] text-white/60 uppercase mb-6">
                Get Started
              </p>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 leading-tight text-white">
                Ready to Schedule Your Inspection?
              </h2>
              <p className="text-white/70 text-lg font-light leading-relaxed max-w-md">
                Protect your property investment with professional inspection services from UAE's most trusted technical experts.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 lg:justify-end">
              <Link href="/contact">
                <Button className="bg-white text-brand-green hover:bg-zinc-100 rounded-none h-16 px-12 text-[10px] uppercase tracking-[0.2em] font-bold">
                  Free Consultation
                </Button>
              </Link>
              <a
                href="tel:+971585686852"
                className="inline-flex items-center justify-center border border-white/30 text-white h-16 px-12 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-white hover:text-brand-green transition-all"
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
