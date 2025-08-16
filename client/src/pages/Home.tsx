import { useEffect, useState } from "react";
import { Link } from "wouter";
import ConsultationForm from "@/components/ConsultationForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const services = [
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
  ];

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
          <img 
            src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80"
            alt="Professional property inspection in modern building"
            className="absolute inset-0 w-full h-full object-cover"
            fetchpriority="high"
            loading="eager"
            style={{ display: 'none' }}
          />
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        
        {/* Hero Content */}
        <div className={`relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-15'}`}>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Your Trusted Property Inspection & Snagging Experts
          </h1>
          <p className="text-xl sm:text-2xl text-gray-200 leading-relaxed">
            Protecting quality, value, and your peace of mind in Dubai, Abu Dhabi, Sharjah and across UAE.
          </p>
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
              Comprehensive property inspection and snagging services across the UAE, ensuring your investment meets the highest standards.
            </p>
          </div>
          
          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card key={service.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-8 text-center">
                  <div className="service-icon">
                    <i className={service.icon}></i>
                  </div>
                  <h3 className="text-xl font-semibold text-brand-black mb-3">{service.title}</h3>
                  <p className="text-text-grey mb-6 leading-relaxed">{service.description}</p>
                  <Link href={`/services/${service.slug}`}>
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
                With over a decade of experience in the UAE property market, UrbanGrid is your trusted partner for comprehensive property inspections and snagging services. Our certified team of experts ensures that every detail is meticulously examined.
              </p>
              <p className="text-text-grey mb-8 leading-relaxed">
                We serve clients across Dubai, Abu Dhabi, Sharjah, and the entire UAE, providing peace of mind through thorough, professional inspections that protect your investment and ensure quality standards are met.
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
    </>
  );
}
