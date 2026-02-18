import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ConsultationForm from "@/components/ConsultationForm";
import ScrollTriggeredForm from "@/components/ScrollTriggeredForm";
import SEO from "@/components/SEO";
import internachi1 from "@assets/internachi.webp";
import internachi2 from "@assets/internachi2.webp";

export default function Consulting() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const serviceCategories = [
    {
      title: "Property Snagging",
      description: "Comprehensive property inspection and snagging services",
      icon: "fas fa-clipboard-list",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      services: [
        { name: "New Build Handover Snagging", href: "/services/property-snagging/new-build-snagging" },
        { name: "Post Renovation Inspection", href: "/services/property-snagging/post-renovation-inspection" },
        { name: "DLP Snagging", href: "/services/property-snagging/dlp-snagging" },
        { name: "Move-in / Move-out Snagging", href: "/services/property-snagging/move-in-move-out" },
        { name: "Secondary Market Snagging", href: "/services/property-snagging/secondary-market" },
        { name: "Developer & Contractor Snagging", href: "/services/property-snagging/developer-projects" },
      ],
    },
    {
      title: "RERA Services",
      description: "Professional regulatory compliance and assessment services",
      icon: "fas fa-gavel",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      services: [
        { name: "Reserve Fund Study", href: "/services/rera-services/reserve-fund-study" },
        { name: "Service Charge Allocation", href: "/services/rera-services/service-charge-allocation" },
        { name: "Reinstatement Cost Assessment", href: "/services/rera-services/reinstatement-cost-assessment" },
        { name: "Building Completion Audit", href: "/services/rera-services/building-completion-audit" },
        { name: "Building Condition Survey", href: "/services/rera-services/building-condition-survey" },
      ],
    },
    {
      title: "Technical Inspections",
      description: "Specialized technical assessments and surveys",
      icon: "fas fa-microscope",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      services: [
        { name: "Technical Due Diligence", href: "/services/technical-inspections/technical-due-diligence" },
        { name: "Dilapidation Survey", href: "/services/technical-inspections/dilapidation-survey" },
        { name: "Thermographic Survey", href: "/services/technical-inspections/thermographic-survey" },
        { name: "Noise Survey", href: "/services/technical-inspections/noise-survey" },
        { name: "Structural Survey", href: "/services/technical-inspections/structural-survey" },
      ],
    },
  ];

  const locations = [
    { name: "Dubai", href: "/locations/dubai/snagging-company", stats: "15,000+ inspections" },
    { name: "Abu Dhabi", href: "/locations/abu-dhabi/snagging-company", stats: "8,000+ inspections" },
    { name: "Sharjah", href: "/locations/sharjah/snagging-company", stats: "5,000+ inspections" },
  ];

  const certifications = [
    { name: "RERA Certified", icon: "fas fa-certificate" },
    { name: "ISO 9001", icon: "fas fa-shield-alt" },
    { name: "NACHI Member", icon: "fas fa-award" },
    { name: "Dubai Municipality", icon: "fas fa-building" },
  ];

  return (
    <>
      <SEO />
      <section className="relative py-24 lg:py-32 bg-gray-900 mt-8 lg:mt-12">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600&q=80')`,
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/50"></div>

        <div
          className={`relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="max-w-3xl">
            <Link href="/">
              <span className="inline-flex items-center text-gray-300 hover:text-white mb-4 cursor-pointer text-sm">
                <i className="fas fa-arrow-left mr-2"></i>
                UrbanGrid Group
              </span>
            </Link>
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-green-500/20 border border-green-400/40 rounded-full text-green-300 text-sm font-medium">
                Consulting Division
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              UrbanGrid Consulting
            </h1>
            <p className="text-xl text-gray-200 leading-relaxed mb-4">
              Dubai's #1 Snagging Company & Property Inspection Experts. NFPA, ASHRAE & ASTM certified services across the UAE.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed mb-8">
              Leading snagging company in Dubai, Abu Dhabi & Sharjah. Professional property inspection services protecting your investment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="tel:+971585686852">
                <Button size="lg" className="bg-brand-green text-white hover:bg-opacity-90">
                  <i className="fas fa-phone mr-2"></i>
                  Free Consultation
                </Button>
              </a>
              <a
                href="https://wa.me/971585686852?text=Hello%20UrbanGrid%2C%20I%27m%20interested%20in%20your%20property%20inspection%20services.%20Please%20provide%20more%20information."
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-brand-black">
                  <i className="fab fa-whatsapp mr-2"></i>
                  WhatsApp Us
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-brand-black mb-3">Certified by InterNACHI</h2>
            <p className="text-lg text-text-grey max-w-2xl mx-auto">
              Internationally certified home inspectors committed to professional excellence
            </p>
          </div>
          <div className="flex justify-center items-center gap-8 lg:gap-12">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img src={internachi1} alt="InterNACHI Certification" className="h-20 lg:h-24 w-auto object-contain mx-auto" loading="lazy" />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img src={internachi2} alt="InterNACHI Professional Badge" className="h-20 lg:h-24 w-auto object-contain mx-auto" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      <ConsultationForm />

      <section className="py-16 lg:py-24 bg-light-grey">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-4">Our Professional Services</h2>
            <p className="text-lg text-text-grey max-w-3xl mx-auto">
              Comprehensive property inspection and snagging services following NFPA, ASHRAE, and ASTM international standards
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {serviceCategories.map((category) => (
              <Card key={category.title} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-0">
                <CardContent className="p-8">
                  <div className={`${category.iconBg} w-14 h-14 rounded-2xl flex items-center justify-center mb-6`}>
                    <i className={`${category.icon} ${category.iconColor} text-xl`}></i>
                  </div>
                  <h3 className="text-xl font-bold text-brand-black mb-2">{category.title}</h3>
                  <p className="text-text-grey text-sm mb-6">{category.description}</p>

                  <div className="space-y-3">
                    {category.services.map((service) => (
                      <Link key={service.name} href={service.href}>
                        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-light-grey transition-colors cursor-pointer group">
                          <span className="text-sm text-text-grey group-hover:text-brand-green transition-colors">{service.name}</span>
                          <i className="fas fa-chevron-right text-xs text-gray-300 group-hover:text-brand-green transition-colors"></i>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/services">
              <Button className="bg-brand-green text-white hover:bg-opacity-90">
                View All Services
                <i className="fas fa-arrow-right ml-2"></i>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-4">Snagging Services Across UAE</h2>
            <p className="text-lg text-text-grey max-w-3xl mx-auto">
              Professional property snagging and inspection services in Dubai, Abu Dhabi, Sharjah and all Emirates
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {locations.map((loc) => (
              <Card key={loc.name} className="bg-light-grey rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-brand-green">
                <CardContent className="p-8 text-center">
                  <div className="bg-brand-green/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-building text-brand-green text-2xl"></i>
                  </div>
                  <h3 className="text-xl font-bold text-brand-black mb-2">{loc.name}</h3>
                  <p className="text-text-grey text-sm mb-4">{loc.stats}</p>
                  <Link href={loc.href}>
                    <Button className="bg-brand-green text-white hover:bg-opacity-90 w-full">
                      Snagging Company {loc.name}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-text-grey">
              Also serving{" "}
              <Link href="/locations/ajman" className="text-brand-green hover:underline font-medium">Ajman</Link>,{" "}
              <Link href="/locations/ras-al-khaimah" className="text-brand-green hover:underline font-medium">Ras Al Khaimah</Link>,{" "}
              <Link href="/locations/fujairah" className="text-brand-green hover:underline font-medium">Fujairah</Link>, and{" "}
              <Link href="/locations/umm-al-quwain" className="text-brand-green hover:underline font-medium">Umm Al Quwain</Link>
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-light-grey">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-brand-black mb-4">Certified & Accredited</h2>
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

      <section className="py-16 lg:py-20 bg-brand-green text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">Ready to Protect Your Property Investment?</h2>
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

      <ScrollTriggeredForm />
    </>
  );
}
