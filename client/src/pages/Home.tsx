import { useEffect, useState } from "react";
import { Link } from "wouter";
import ConsultationForm from "@/components/ConsultationForm";
import ScrollTriggeredForm from "@/components/ScrollTriggeredForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import internachi1 from "@assets/internachi.webp";
import internachi2 from "@assets/internachi2.webp";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<keyof typeof serviceCategories>('property-snagging');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const serviceCategories = {
    'property-snagging': {
      title: 'Property Snagging',
      subtitle: 'Comprehensive property inspection and snagging services',
      categorySlug: 'property-snagging',
      services: [
        {
          id: 1,
          title: "New Build Handover Snagging",
          description: "Comprehensive inspection before accepting your new property, identifying defects and ensuring everything meets standards.",
          icon: "fas fa-clipboard-list",
          slug: "new-build-snagging"
        },
        {
          id: 2,
          title: "Post Renovation Inspection",
          description: "Quality assessment after renovation or fit-out work, ensuring all work meets specifications and quality standards.",
          icon: "fas fa-hammer",
          slug: "post-renovation-inspection"
        },
        {
          id: 3,
          title: "DLP Snagging",
          description: "Defect Liability Period inspections to identify issues before warranty expires and ensure developer compliance.",
          icon: "fas fa-file-alt",
          slug: "dlp-snagging"
        },
        {
          id: 4,
          title: "Move-in / Move-out Snagging",
          description: "Comprehensive condition reports for rental properties, protecting both tenants and landlords during transitions.",
          icon: "fas fa-key",
          slug: "move-in-move-out"
        },
        {
          id: 5,
          title: "Secondary Market Snagging",
          description: "Pre-purchase inspections for existing properties, helping buyers make informed decisions and negotiate fairly.",
          icon: "fas fa-search",
          slug: "secondary-market"
        },
        {
          id: 6,
          title: "Developer & Contractor Snagging",
          description: "Quality control inspections for developers and contractors, ensuring projects meet industry standards and specifications.",
          icon: "fas fa-users",
          slug: "developer-projects"
        }
      ]
    },
    'rera-services': {
      title: 'RERA Services',
      subtitle: 'Professional regulatory compliance and assessment services',
      categorySlug: 'rera-services',
      services: [
        {
          id: 7,
          title: "Reserve Fund Study / Sinking Fund",
          description: "Comprehensive analysis of building reserve fund requirements and long-term capital expenditure planning for strata properties.",
          icon: "fas fa-calculator",
          slug: "reserve-fund-study"
        },
        {
          id: 8,
          title: "Service Charge Cost Allocation",
          description: "Detailed assessment and allocation of service charges across common property areas ensuring fair distribution and RERA compliance.",
          icon: "fas fa-chart-pie",
          slug: "service-charge-allocation"
        },
        {
          id: 9,
          title: "Reinstatement Cost Assessment",
          description: "Professional valuation of property reinstatement costs for insurance purposes and regulatory compliance requirements.",
          icon: "fas fa-building",
          slug: "reinstatement-cost-assessment"
        },
        {
          id: 10,
          title: "Building Completion Audit",
          description: "Comprehensive audit to verify building completion status against approved plans and regulatory requirements for RERA compliance.",
          icon: "fas fa-clipboard-check",
          slug: "building-completion-audit"
        },
        {
          id: 11,
          title: "Building Condition Survey",
          description: "Detailed condition assessment of building components and systems for regulatory reporting and maintenance planning.",
          icon: "fas fa-search-plus",
          slug: "building-condition-survey"
        }
      ]
    },
    'technical-inspections': {
      title: 'Other Technical Inspections',
      subtitle: 'Specialized technical assessments and surveys',
      categorySlug: 'technical-inspections',
      services: [
        {
          id: 12,
          title: "Technical Due Diligence",
          description: "Comprehensive technical analysis for property acquisition, covering structural, mechanical, and compliance aspects for informed investment decisions.",
          icon: "fas fa-microscope",
          slug: "technical-due-diligence"
        },
        {
          id: 13,
          title: "Dilapidation Survey",
          description: "Pre and post-construction condition assessments of adjacent properties to document potential impact from nearby construction activities.",
          icon: "fas fa-camera",
          slug: "dilapidation-survey"
        },
        {
          id: 14,
          title: "Thermographic Survey",
          description: "Advanced thermal imaging inspections to detect energy losses, moisture intrusion, and electrical issues invisible to conventional inspection methods.",
          icon: "fas fa-thermometer-half",
          slug: "thermographic-survey"
        },
        {
          id: 15,
          title: "Noise Survey",
          description: "Professional acoustic assessments to measure and analyze noise levels for compliance with local regulations and habitability standards.",
          icon: "fas fa-volume-up",
          slug: "noise-survey"
        },
        {
          id: 16,
          title: "Structural Survey",
          description: "Detailed structural engineering assessment examining building integrity, load-bearing elements, and structural compliance with safety standards.",
          icon: "fas fa-hard-hat",
          slug: "structural-survey"
        }
      ]
    }
  };

  const tabs = [
    { key: 'property-snagging', label: 'Property Snagging' },
    { key: 'rera-services', label: 'RERA Services' },
    { key: 'technical-inspections', label: 'Other Technical Inspections' }
  ];

  const currentServices = serviceCategories[activeTab].services;

  const certifications = [
    { name: "RERA Certified", icon: "fas fa-certificate" },
    { name: "ISO 9001", icon: "fas fa-shield-alt" },
    { name: "NACHI Member", icon: "fas fa-award" },
    { name: "Dubai Municipality", icon: "fas fa-building" },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gray-900 mt-8 lg:mt-12">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80')`
          }}
        >
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        
        {/* Hero Content */}
        <div className={`relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 -translate-y-16 sm:-translate-y-8 lg:translate-y-0 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Dubai's #1 Snagging Company & Property Inspection Experts
          </h1>
          <p className="text-xl sm:text-2xl text-gray-200 leading-relaxed">
            Leading snagging company in Dubai, Abu Dhabi & Sharjah. Professional property inspection services protecting your investment across UAE.
          </p>
        </div>
      </section>

      {/* InterNACHI Certification Section */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-brand-black mb-3">
              Certified by InterNACHI
            </h2>
            <p className="text-lg text-text-grey max-w-2xl mx-auto">
              Internationally certified home inspectors committed to professional excellence and industry standards
            </p>
          </div>
          
          <div className="flex justify-center items-center gap-8 lg:gap-12">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img 
                src={internachi1}
                alt="InterNACHI International Association of Certified Home Inspectors Certification" 
                className="h-20 lg:h-24 w-auto object-contain mx-auto"
                loading="lazy"
              />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img 
                src={internachi2}
                alt="InterNACHI Professional Certification Badge" 
                className="h-20 lg:h-24 w-auto object-contain mx-auto"
                loading="lazy"
              />
            </div>
          </div>
          
          <div className="text-center mt-6">
            <p className="text-sm text-text-grey">
              <span className="font-medium text-brand-green">InterNACHI Certified</span> • 
              Professional Standards • Quality Assured
            </p>
          </div>
        </div>
      </section>

      {/* Free Consultation Form */}
      <ConsultationForm />

      {/* Services Teaser Section */}
      <section className="py-16 lg:py-20 bg-light-grey">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-4">
              Our Professional Services
            </h2>
            <p className="text-lg text-text-grey max-w-2xl mx-auto">
              Comprehensive property inspection and snagging services across the UAE, following NFPA, ASHRAE, and ASTM international standards to ensure your investment meets the highest quality benchmarks.
            </p>
          </div>
          
          {/* Service Tabs */}
          <div className="mb-8">
            <div className="flex flex-wrap justify-center gap-2 bg-white rounded-lg p-2 shadow-sm">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as keyof typeof serviceCategories)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    activeTab === tab.key
                      ? 'bg-brand-green text-white'
                      : 'text-text-grey hover:text-brand-green hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Active Tab Description */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold text-brand-black mb-2">
              {serviceCategories[activeTab].title}
            </h3>
            <p className="text-text-grey">
              {serviceCategories[activeTab].subtitle}
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentServices.map((service) => (
              <Card key={service.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-8 text-center">
                  <div className="service-icon">
                    <i className={service.icon}></i>
                  </div>
                  <h3 className="text-xl font-semibold text-brand-black mb-3">{service.title}</h3>
                  <p className="text-text-grey mb-6 leading-relaxed">{service.description}</p>
                  <Link href={`/services/${serviceCategories[activeTab].categorySlug}/${service.slug}`}>
                    <span className="inline-flex items-center text-brand-green font-medium hover:underline transition-colors cursor-pointer">
                      Learn More About {service.title}
                      <i className="fas fa-arrow-right ml-2 text-sm"></i>
                    </span>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Teaser Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-6">
                Why Choose UrbanGrid?
              </h2>
              <p className="text-lg text-text-grey mb-6 leading-relaxed">
                With over a decade of experience in the UAE property market, UrbanGrid is your trusted partner for comprehensive property inspections and snagging services. Our certified team follows international standards including NFPA, ASHRAE, and ASTM guidelines to ensure every detail is meticulously examined.
              </p>
              <p className="text-text-grey mb-8 leading-relaxed">
                We serve clients across Dubai, Abu Dhabi, Sharjah, and the entire UAE, providing peace of mind through thorough, professional inspections that comply with NFPA fire safety codes, ASHRAE HVAC standards, and ASTM material testing protocols.
              </p>
              <Link href="/about">
                <Button className="bg-brand-green text-white hover:bg-opacity-90">
                  Learn More About Us
                  <i className="fas fa-arrow-right ml-2"></i>
                </Button>
              </Link>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=450&q=80" 
                alt="Professional property inspection team" 
                className="rounded-lg shadow-lg w-full"
                loading="lazy"
              />
              
              {/* Stats Overlay */}
              <div className="absolute -bottom-6 -left-6 bg-brand-green text-white p-6 rounded-lg shadow-xl">
                <div className="text-2xl font-bold">40,000+</div>
                <div className="text-sm">Properties Inspected</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges Section */}
      <section className="py-12 bg-light-grey">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-brand-black mb-4">
              Certified & Accredited
            </h2>
            <p className="text-text-grey">Trusted by leading developers, contractors, and homeowners across the UAE</p>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-8">
            {certifications.map((cert) => (
              <div key={cert.name} className="bg-white p-4 rounded-lg shadow-sm opacity-90 hover:opacity-100 transition-opacity">
                <div className="text-brand-green text-center">
                  <i className={`${cert.icon} text-3xl mb-2`}></i>
                  <div className="text-sm font-medium text-gray-800">{cert.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* International Standards Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-4">
              International Standards We Follow
            </h2>
            <p className="text-lg text-text-grey max-w-3xl mx-auto">
              Our property inspections strictly adhere to internationally recognized standards including NFPA, ASHRAE, and ASTM guidelines, ensuring the highest quality assessments for fire safety, HVAC systems, and structural integrity.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* NFPA Standards */}
            <Card className="bg-light-grey rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-fire-extinguisher text-red-600 text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-brand-black mb-4">NFPA Standards</h3>
                <p className="text-text-grey mb-4">
                  Following NFPA 70 (National Electrical Code), NFPA 72 (Fire Alarm Systems), NFPA 101 (Life Safety Code), and NFPA 25 (Fire Protection Systems) for comprehensive fire safety inspections.
                </p>
                <a 
                  href="https://www.nfpa.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-brand-green font-medium hover:underline"
                >
                  Learn More About NFPA →
                </a>
              </CardContent>
            </Card>

            {/* ASHRAE Standards */}
            <Card className="bg-light-grey rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-wind text-blue-600 text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-brand-black mb-4">ASHRAE Standards</h3>
                <p className="text-text-grey mb-4">
                  Implementing ASHRAE Standard 180 for building commissioning and ASHRAE 62.1 for ventilation standards to ensure optimal indoor air quality and HVAC system performance.
                </p>
                <a 
                  href="https://www.ashrae.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-brand-green font-medium hover:underline"
                >
                  Learn More About ASHRAE →
                </a>
              </CardContent>
            </Card>

            {/* ASTM Standards */}
            <Card className="bg-light-grey rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-cogs text-green-600 text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-brand-black mb-4">ASTM Standards</h3>
                <p className="text-text-grey mb-4">
                  Utilizing ASTM E2018 for Property Condition Assessments and ASTM standards for material testing, ensuring structural integrity and building performance evaluations.
                </p>
                <a 
                  href="https://www.astm.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-brand-green font-medium hover:underline"
                >
                  Learn More About ASTM →
                </a>
              </CardContent>
            </Card>
          </div>
          
          {/* Standards FAQ */}
          <div className="mt-12 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-brand-black text-center mb-8">
              Why International Standards Matter in Property Inspection
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-light-grey p-6 rounded-lg">
                <h4 className="font-semibold text-brand-black mb-2">What does NFPA 101 cover in building inspections?</h4>
                <p className="text-text-grey text-sm">
                  NFPA 101 Life Safety Code addresses fire protection requirements, exit routes, emergency lighting, and life safety systems to ensure occupant safety in buildings.
                </p>
              </div>
              <div className="bg-light-grey p-6 rounded-lg">
                <h4 className="font-semibold text-brand-black mb-2">How does ASHRAE Standard 180 impact inspections?</h4>
                <p className="text-text-grey text-sm">
                  ASHRAE 180 provides guidelines for building commissioning processes, ensuring HVAC systems operate efficiently and meet design specifications.
                </p>
              </div>
              <div className="bg-light-grey p-6 rounded-lg">
                <h4 className="font-semibold text-brand-black mb-2">What is ASTM E2018 for Property Assessments?</h4>
                <p className="text-text-grey text-sm">
                  ASTM E2018 standardizes property condition assessments, providing consistent methodology for evaluating building systems and components.
                </p>
              </div>
              <div className="bg-light-grey p-6 rounded-lg">
                <h4 className="font-semibold text-brand-black mb-2">Why follow NFPA 72 for fire alarm systems?</h4>
                <p className="text-text-grey text-sm">
                  NFPA 72 ensures fire detection and alarm systems are properly installed, tested, and maintained according to national safety standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner Section */}
      <section className="py-16 lg:py-20 bg-brand-green text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Protect Your Property Investment?
            </h2>
            <p className="text-xl mb-8 text-green-100">
              Get expert property inspection and snagging services from UAE's most trusted professionals. Contact us today for a free consultation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="tel:+971585686852" 
                className="inline-flex items-center bg-white text-brand-green px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
              >
                <i className="fas fa-phone mr-2"></i>
                Call Now: +971 58 568 6852
              </a>
              
              <a 
                href="https://wa.me/971585686852?text=Hello%20UrbanGrid%2C%20I%27m%20interested%20in%20your%20property%20inspection%20services.%20Please%20provide%20me%20with%20more%20information." 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-transparent border-2 border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-brand-green transition-colors"
              >
                <i className="fab fa-whatsapp mr-2"></i>
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll Triggered Form */}
      <ScrollTriggeredForm />
    </>
  );
}
