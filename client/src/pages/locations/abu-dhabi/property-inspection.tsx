import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function PropertyInspectionAbuDhabi() {
  const abuDhabiAreas = [
    "Corniche Area", "Al Reem Island", "Saadiyat Island", "Yas Island",
    "Al Raha Beach", "Masdar City", "Al Reef", "Khalifa City",
    "Mohammed Bin Zayed City", "Al Shamkha", "Al Ghadeer", "Shams Abu Dhabi"
  ];

  const inspectionTypes = [
    {
      title: "New Build Property Inspection",
      description: "Pre-handover inspections for new developments in Abu Dhabi",
      price: "Starting from AED 1,500",
      features: ["Pre-handover assessment", "Structural integrity check", "MEP systems testing", "Quality compliance review", "Developer coordination"]
    },
    {
      title: "Pre-Purchase Property Inspection",
      description: "Comprehensive inspection before buying property in Abu Dhabi",
      price: "Starting from AED 1,200",
      features: ["Investment protection", "Market value assessment", "Condition evaluation", "Risk identification", "Purchase recommendation"]
    },
    {
      title: "Villa Property Inspection",
      description: "Specialized villa inspection services across Abu Dhabi",
      price: "Starting from AED 2,800",
      features: ["Complete villa assessment", "Exterior & landscape", "Pool & amenities", "Smart home systems", "Premium reporting"]
    }
  ];

  const majorDevelopers = [
    { name: "Aldar Properties", projects: "Al Reem Island, Yas Island, Saadiyat" },
    { name: "Abu Dhabi Investment Council", projects: "Corniche, Central District" },
    { name: "Sorouh Real Estate", projects: "Al Reef, Shams Abu Dhabi" },
    { name: "Eagle Hills", projects: "Al Maryah Island developments" },
    { name: "Mubadala", projects: "Masdar City, Saadiyat Island" }
  ];

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero Section - Targeting "property inspection abu dhabi" */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-brand-black mb-6">
              Property Inspection Abu Dhabi: Expert Property Assessment Services
            </h1>
            <p className="text-xl text-text-grey leading-relaxed mb-8">
              Professional property inspection services across Abu Dhabi's premium developments. From Al Reem Island to Saadiyat Island, ensure your property investment meets the highest standards with comprehensive inspection reports.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="bg-brand-green text-white hover:bg-opacity-90 px-8 py-3">
                  Get Abu Dhabi Inspection Quote
                </Button>
              </Link>
              <a 
                href="tel:+971585686852"
                className="inline-flex items-center bg-transparent border-2 border-brand-green text-brand-green px-8 py-3 rounded-md font-semibold hover:bg-brand-green hover:text-white transition-colors"
              >
                <i className="fas fa-phone mr-2"></i>
                Call Abu Dhabi: +971 58 568 6852
              </a>
              <a 
                href="https://wa.me/971585686852?text=Hello! I need property inspection services in Abu Dhabi."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-green-500 text-white px-8 py-3 rounded-md font-semibold hover:bg-green-600 transition-colors"
              >
                <i className="fab fa-whatsapp mr-2"></i>
                WhatsApp Abu Dhabi Team
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Inspection Services */}
      <section className="py-16 lg:py-20 bg-light-grey">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-black mb-4">
              Abu Dhabi Property Inspection Services
            </h2>
            <p className="text-lg text-text-grey max-w-2xl mx-auto">
              Comprehensive property inspection services tailored for Abu Dhabi's unique property market and development standards.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {inspectionTypes.map((service, index) => (
              <Card key={index} className="h-full">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-brand-black mb-3">{service.title}</h3>
                  <p className="text-text-grey mb-4">{service.description}</p>
                  <div className="text-2xl font-bold text-brand-green mb-4">{service.price}</div>
                  <ul className="space-y-2">
                    {service.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center text-sm text-text-grey">
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

      {/* Abu Dhabi Coverage Areas */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-black mb-4">
              Property Inspection Coverage Across Abu Dhabi
            </h2>
            <p className="text-lg text-text-grey max-w-2xl mx-auto">
              Professional property inspection services available in all major Abu Dhabi districts and developments.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
            {abuDhabiAreas.map((area, index) => (
              <div key={index} className="bg-light-grey p-4 rounded-lg text-center">
                <h3 className="font-semibold text-brand-black text-sm">{area}</h3>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <h3 className="text-xl font-semibold text-brand-black mb-6">Major Developer Coverage</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {majorDevelopers.map((developer, index) => (
                <div key={index} className="bg-light-grey p-6 rounded-lg">
                  <h4 className="font-semibold text-brand-black mb-2">{developer.name}</h4>
                  <p className="text-text-grey text-sm">{developer.projects}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Abu Dhabi Property Market Expertise */}
      <section className="py-16 lg:py-20 bg-light-grey">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-brand-black mb-4">
                Abu Dhabi Property Market Expertise
              </h2>
              <p className="text-lg text-text-grey">
                Deep understanding of Abu Dhabi's property landscape, regulations, and development standards.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start">
                <div className="bg-brand-green text-white p-3 rounded-full mr-4 flex-shrink-0">
                  <i className="fas fa-building"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-brand-black mb-2">Development Knowledge</h3>
                  <p className="text-text-grey">Extensive experience with Abu Dhabi's major developments from luxury islands to city center properties.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-brand-green text-white p-3 rounded-full mr-4 flex-shrink-0">
                  <i className="fas fa-gavel"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-brand-black mb-2">Regulatory Compliance</h3>
                  <p className="text-text-grey">Up-to-date knowledge of Abu Dhabi Municipality regulations and ADDC standards for properties.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-brand-green text-white p-3 rounded-full mr-4 flex-shrink-0">
                  <i className="fas fa-thermometer-half"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-brand-black mb-2">Climate Considerations</h3>
                  <p className="text-text-grey">Specialized knowledge of how Abu Dhabi's climate affects property systems and materials.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-brand-green text-white p-3 rounded-full mr-4 flex-shrink-0">
                  <i className="fas fa-chart-line"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-brand-black mb-2">Market Trends</h3>
                  <p className="text-text-grey">Current insights into Abu Dhabi property market values, investment opportunities, and quality standards.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inspection Process */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-black mb-4">
              Our Abu Dhabi Property Inspection Process
            </h2>
            <p className="text-lg text-text-grey max-w-2xl mx-auto">
              Systematic inspection approach ensuring comprehensive coverage of all property aspects specific to Abu Dhabi standards.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-brand-green text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-calendar-check text-2xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-brand-black mb-2">1. Scheduling</h3>
              <p className="text-text-grey text-sm">Book your Abu Dhabi property inspection at your convenience with flexible timing</p>
            </div>
            
            <div className="text-center">
              <div className="bg-brand-green text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-search-plus text-2xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-brand-black mb-2">2. Comprehensive Inspection</h3>
              <p className="text-text-grey text-sm">Thorough property assessment covering structure, systems, finishes, and compliance</p>
            </div>
            
            <div className="text-center">
              <div className="bg-brand-green text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-clipboard-list text-2xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-brand-black mb-2">3. Detailed Reporting</h3>
              <p className="text-text-grey text-sm">Professional inspection report with photos, recommendations, and priority actions</p>
            </div>
            
            <div className="text-center">
              <div className="bg-brand-green text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-users text-2xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-brand-black mb-2">4. Follow-up Support</h3>
              <p className="text-text-grey text-sm">Ongoing support for defect resolution and developer communication</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose UrbanGrid Abu Dhabi */}
      <section className="py-16 lg:py-20 bg-light-grey">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-brand-black mb-4">
                Why Choose UrbanGrid for Abu Dhabi Property Inspections
              </h2>
              <p className="text-lg text-text-grey">
                Abu Dhabi's trusted property inspection specialists with local expertise and proven results.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start">
                <div className="bg-brand-green text-white p-3 rounded-full mr-4 flex-shrink-0">
                  <i className="fas fa-map-marked-alt"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-brand-black mb-2">Local Abu Dhabi Expertise</h3>
                  <p className="text-text-grey">Deep knowledge of Abu Dhabi property market, developers, and common issues across different areas.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-brand-green text-white p-3 rounded-full mr-4 flex-shrink-0">
                  <i className="fas fa-certificate"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-brand-black mb-2">Certified Professionals</h3>
                  <p className="text-text-grey">Licensed and certified inspection experts with extensive Abu Dhabi property experience.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-brand-green text-white p-3 rounded-full mr-4 flex-shrink-0">
                  <i className="fas fa-bolt"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-brand-black mb-2">Rapid Response</h3>
                  <p className="text-text-grey">Same-day inspections available with reports delivered within hours for urgent decisions.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-brand-green text-white p-3 rounded-full mr-4 flex-shrink-0">
                  <i className="fas fa-tools"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-brand-black mb-2">Advanced Technology</h3>
                  <p className="text-text-grey">State-of-the-art inspection equipment for accurate assessments and detailed documentation.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-brand-green text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready for Your Abu Dhabi Property Inspection?
          </h2>
          <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
            Protect your Abu Dhabi property investment with professional inspection services. Contact us today for expert assessment.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:+971585686852"
              className="inline-flex items-center bg-white text-brand-green px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
            >
              <i className="fas fa-phone mr-2"></i>
              Call Abu Dhabi: +971 58 568 6852
            </a>
            
            <a 
              href="https://wa.me/971585686852?text=Hello%20UrbanGrid%2C%20I%20need%20property%20inspection%20services%20in%20Abu%20Dhabi.%20Please%20provide%20more%20information."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-transparent border-2 border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-brand-green transition-colors"
            >
              <i className="fab fa-whatsapp mr-2"></i>
              WhatsApp Abu Dhabi Team
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}