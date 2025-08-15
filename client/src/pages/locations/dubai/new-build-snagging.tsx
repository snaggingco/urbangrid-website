import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function NewBuildSnaggingDubai() {
  const focusAreas = [
    "Dubai Marina", "Downtown Dubai", "Business Bay", "Jumeirah Lake Towers",
    "Dubai Creek Harbour", "Dubai Hills Estate", "Mohammed Bin Rashid City",
    "Dubai South", "Dubailand", "Jumeirah Village Circle"
  ];

  const majorDevelopers = [
    { name: "Emaar Properties", projects: "Downtown Dubai, Dubai Creek Harbour, Dubai Hills" },
    { name: "DAMAC Properties", projects: "Business Bay, Dubai Marina, DAMAC Hills" },
    { name: "Nakheel", projects: "Palm Jumeirah, Jumeirah Village, The Gardens" },
    { name: "Dubai Properties", projects: "Jumeirah Beach Residence, Business Bay" },
    { name: "Meraas", projects: "Bluewaters, La Mer, City Walk" }
  ];

  const services = [
    {
      title: "Pre-Handover Snagging",
      description: "Comprehensive inspection 7-14 days before handover",
      price: "Starting from AED 1,500",
      features: ["Full structural assessment", "MEP systems testing", "Finish quality check", "Defect documentation"]
    },
    {
      title: "Handover Day Inspection",
      description: "Final walkthrough and quality verification on handover day",
      price: "Starting from AED 1,200",
      features: ["Final quality check", "Immediate defect identification", "Developer liaison", "Handover documentation"]
    },
    {
      title: "Post-Handover Review",
      description: "Follow-up inspection to ensure defect rectification",
      price: "Starting from AED 800",
      features: ["Defect rectification check", "Quality compliance", "Final sign-off", "Warranty activation"]
    }
  ];

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-brand-black mb-6">
              New Build Snagging Dubai: Expert Handover Inspection Services
            </h1>
            <p className="text-xl text-text-grey leading-relaxed mb-8">
              Professional new build snagging services across Dubai's premier developments. Protect your investment with comprehensive handover inspections from Dubai Marina to Downtown Dubai and beyond.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="bg-brand-green text-white hover:bg-opacity-90 px-8 py-3">
                  Get Free Quote in Dubai
                </Button>
              </Link>
              <a 
                href="tel:+971501234567"
                className="inline-flex items-center bg-transparent border-2 border-brand-green text-brand-green px-8 py-3 rounded-md font-semibold hover:bg-brand-green hover:text-white transition-colors"
              >
                <i className="fas fa-phone mr-2"></i>
                Call Dubai: +971 50 123 4567
              </a>
              <a 
                href="https://wa.me/971501234567?text=Hello! I need new build snagging services in Dubai."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-green-500 text-white px-8 py-3 rounded-md font-semibold hover:bg-green-600 transition-colors"
              >
                <i className="fab fa-whatsapp mr-2"></i>
                WhatsApp Dubai Team
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Service Details */}
      <section className="py-16 lg:py-20 bg-light-grey">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-12 text-center">
            Dubai New Build Snagging Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {services.map((service, index) => (
              <Card key={index} className="bg-white hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-brand-black mb-4">{service.title}</h3>
                  <p className="text-text-grey mb-4">{service.description}</p>
                  <div className="text-2xl font-bold text-brand-green mb-4">{service.price}</div>
                  <ul className="space-y-2">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-text-grey">
                        <i className="fas fa-check text-brand-green mr-2"></i>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us in Dubai */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-8 text-center">
              Why Choose UrbanGrid for New Build Snagging in Dubai?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start">
                  <i className="fas fa-map-marker-alt text-brand-green mr-3 mt-1"></i>
                  <div>
                    <h3 className="font-semibold text-brand-black mb-2">Local Dubai Market Expertise</h3>
                    <p className="text-text-grey">Deep knowledge of Dubai's construction standards, developer practices, and common issues across all major developments.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <i className="fas fa-handshake text-brand-green mr-3 mt-1"></i>
                  <div>
                    <h3 className="font-semibold text-brand-black mb-2">Developer Relationships</h3>
                    <p className="text-text-grey">Established relationships with major Dubai developers including Emaar, DAMAC, and Nakheel for efficient defect resolution.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <i className="fas fa-certificate text-brand-green mr-3 mt-1"></i>
                  <div>
                    <h3 className="font-semibold text-brand-black mb-2">RERA Compliance</h3>
                    <p className="text-text-grey">Full compliance with Dubai's Real Estate Regulatory Agency standards and documentation requirements.</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <i className="fas fa-clock text-brand-green mr-3 mt-1"></i>
                  <div>
                    <h3 className="font-semibold text-brand-black mb-2">Same-Day Reporting</h3>
                    <p className="text-text-grey">Comprehensive snagging reports delivered within 24 hours of inspection with high-resolution photos and detailed defect lists.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <i className="fas fa-users text-brand-green mr-3 mt-1"></i>
                  <div>
                    <h3 className="font-semibold text-brand-black mb-2">Dubai-Based Team</h3>
                    <p className="text-text-grey">Local Dubai team with immediate availability for urgent inspections and developer meetings.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <i className="fas fa-trophy text-brand-green mr-3 mt-1"></i>
                  <div>
                    <h3 className="font-semibold text-brand-black mb-2">Proven Success Record</h3>
                    <p className="text-text-grey">Over 5,000 successful new build inspections across Dubai with 98% client satisfaction rate.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Major Developers */}
      <section className="py-16 lg:py-20 bg-light-grey">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-12 text-center">
            Major Dubai Developers We Work With
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {majorDevelopers.map((developer, index) => (
              <Card key={index} className="bg-white">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-brand-black mb-2">{developer.name}</h3>
                  <p className="text-text-grey text-sm">Key Projects: {developer.projects}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Areas We Serve */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-12 text-center">
            Dubai Areas We Serve for New Build Snagging
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {focusAreas.map((area, index) => (
              <div key={index} className="bg-light-grey p-3 rounded-lg text-center shadow-sm hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-brand-black">{area}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Local Resources */}
      <section className="py-16 lg:py-20 bg-light-grey">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-8 text-center">
              Dubai Property Resources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-brand-black mb-4">Regulatory Bodies</h3>
                <ul className="space-y-2 text-text-grey">
                  <li>• Dubai Municipality - Building Standards</li>
                  <li>• RERA - Real Estate Regulatory Agency</li>
                  <li>• Dubai Land Department - Property Registration</li>
                  <li>• DEWA - Utilities and Services</li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-brand-black mb-4">Building Codes</h3>
                <ul className="space-y-2 text-text-grey">
                  <li>• Dubai Building Code 2017</li>
                  <li>• Fire and Life Safety Code</li>
                  <li>• Green Building Regulations</li>
                  <li>• Dubai Quality Standards</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-brand-green text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Book Your Dubai New Build Snagging Inspection Today
          </h2>
          <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
            Protect your Dubai property investment with professional new build snagging services. Expert inspection from AED 1,500 with same-day reporting.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button className="bg-white text-brand-green hover:bg-gray-100 px-8 py-3">
                Book Dubai Inspection
              </Button>
            </Link>
            <a 
              href="https://wa.me/971501234567?text=Hello! I need new build snagging in Dubai. Please send me a quote."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-transparent border-2 border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-brand-green transition-colors"
            >
              <i className="fab fa-whatsapp mr-2"></i>
              Get Instant Quote
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}