import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function PropertySnaggingDubai() {
  const serviceTypes = [
    {
      title: "New Build Property Snagging",
      description: "Pre-handover inspections for new developments",
      price: "Starting from AED 1,500",
      features: ["Pre-handover inspection", "Defect identification", "Quality assessment", "Developer liaison", "Comprehensive report"]
    },
    {
      title: "Apartment Snagging Services",
      description: "Specialized apartment snagging in Dubai",
      price: "Starting from AED 1,200",
      features: ["Studio to 3BR coverage", "MEP systems check", "Finish quality review", "Same-day reporting", "Dubai-specific expertise"]
    },
    {
      title: "Villa Property Snagging",
      description: "Complete villa snagging and inspection",
      price: "Starting from AED 2,500",
      features: ["Full structural survey", "Exterior inspection", "Pool & landscape check", "Premium villa coverage", "Detailed documentation"]
    }
  ];

  const dubaiAreas = [
    "Downtown Dubai", "Dubai Marina", "Business Bay", "Jumeirah Lake Towers",
    "Dubai Creek Harbour", "Dubai Hills Estate", "Mohammed Bin Rashid City",
    "Jumeirah Village Circle", "Dubai South", "Dubailand", "Palm Jumeirah",
    "Jumeirah Beach Residence", "DIFC", "Dubai Investment Park", "Motor City"
  ];

  const developers = [
    { name: "Emaar Properties", focus: "Downtown, Dubai Creek, Dubai Hills" },
    { name: "DAMAC Properties", focus: "Business Bay, Marina, DAMAC Hills" },
    { name: "Nakheel", focus: "Palm Jumeirah, JVC, The Gardens" },
    { name: "Dubai Properties", focus: "JBR, Business Bay, Dubailand" },
    { name: "Meraas Holdings", focus: "Bluewaters, La Mer, City Walk" }
  ];

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero Section - Targeting "property snagging dubai" (3,272 impressions) */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-brand-black mb-6">
              Property Snagging Dubai: Professional Snagging Services & Inspection
            </h1>
            <p className="text-xl text-text-grey leading-relaxed mb-8">
              Dubai's leading property snagging company offering comprehensive snagging services across all Emirates. Professional property snagging in Dubai with expert inspection reports and developer liaison.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="bg-brand-green text-white hover:bg-opacity-90 px-8 py-3">
                  Get Free Snagging Quote
                </Button>
              </Link>
              <a 
                href="tel:+971585686852"
                className="inline-flex items-center bg-transparent border-2 border-brand-green text-brand-green px-8 py-3 rounded-md font-semibold hover:bg-brand-green hover:text-white transition-colors"
              >
                <i className="fas fa-phone mr-2"></i>
                Call Dubai: +971 58 568 6852
              </a>
              <a 
                href="https://wa.me/971585686852?text=Hello! I need property snagging services in Dubai."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-green-500 text-white px-8 py-3 rounded-md font-semibold hover:bg-green-600 transition-colors"
              >
                <i className="fab fa-whatsapp mr-2"></i>
                WhatsApp Snagging Expert
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* What is Property Snagging */}
      <section className="py-16 lg:py-20 bg-light-grey">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-brand-black mb-4">
                What is Property Snagging in Dubai?
              </h2>
              <p className="text-lg text-text-grey">
                Property snagging is the professional inspection process that identifies defects and quality issues in new properties before handover.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-brand-black mb-4">Dubai Property Snagging Process</h3>
                <ul className="space-y-3 text-text-grey">
                  <li className="flex items-start">
                    <i className="fas fa-check-circle text-brand-green mr-3 mt-1"></i>
                    <span><strong>Pre-handover inspection:</strong> Comprehensive property assessment 7-14 days before handover</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check-circle text-brand-green mr-3 mt-1"></i>
                    <span><strong>Defect identification:</strong> Professional documentation of all property defects and issues</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check-circle text-brand-green mr-3 mt-1"></i>
                    <span><strong>Quality assessment:</strong> Evaluation of finishes, fittings, and overall workmanship</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check-circle text-brand-green mr-3 mt-1"></i>
                    <span><strong>Developer liaison:</strong> Professional communication with developers for defect rectification</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-brand-black mb-4">Why Property Snagging Matters</h3>
                <ul className="space-y-3 text-text-grey">
                  <li className="flex items-start">
                    <i className="fas fa-shield-alt text-brand-green mr-3 mt-1"></i>
                    <span><strong>Investment protection:</strong> Ensure your Dubai property meets quality standards</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-shield-alt text-brand-green mr-3 mt-1"></i>
                    <span><strong>Cost savings:</strong> Identify issues before they become expensive problems</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-shield-alt text-brand-green mr-3 mt-1"></i>
                    <span><strong>Professional expertise:</strong> Benefit from specialized Dubai market knowledge</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-shield-alt text-brand-green mr-3 mt-1"></i>
                    <span><strong>Peace of mind:</strong> Move into your property with confidence</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Property Snagging Services */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-black mb-4">
              Dubai Property Snagging Services
            </h2>
            <p className="text-lg text-text-grey max-w-2xl mx-auto">
              Comprehensive property snagging services in Dubai covering apartments, villas, and commercial properties across all major developments.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {serviceTypes.map((service, index) => (
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

      {/* Dubai Coverage Areas */}
      <section className="py-16 lg:py-20 bg-light-grey">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-black mb-4">
              Property Snagging Coverage Across Dubai
            </h2>
            <p className="text-lg text-text-grey max-w-2xl mx-auto">
              Professional property snagging services available in all major Dubai communities and developments.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
            {dubaiAreas.map((area, index) => (
              <div key={index} className="bg-white p-4 rounded-lg text-center shadow-sm">
                <h3 className="font-semibold text-brand-black text-sm">{area}</h3>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <h3 className="text-xl font-semibold text-brand-black mb-6">Major Developer Coverage</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {developers.map((developer, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-brand-black mb-2">{developer.name}</h4>
                  <p className="text-text-grey text-sm">{developer.focus}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Property Snagging Process */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-black mb-4">
              Our Dubai Property Snagging Process
            </h2>
            <p className="text-lg text-text-grey max-w-2xl mx-auto">
              Systematic property snagging approach ensuring comprehensive coverage of all property aspects.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-brand-green text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-calendar-alt text-2xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-brand-black mb-2">1. Booking & Scheduling</h3>
              <p className="text-text-grey text-sm">Schedule your Dubai property snagging inspection 7-14 days before handover</p>
            </div>
            
            <div className="text-center">
              <div className="bg-brand-green text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-search text-2xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-brand-black mb-2">2. Comprehensive Inspection</h3>
              <p className="text-text-grey text-sm">Detailed property snagging covering structure, MEP systems, and finishes</p>
            </div>
            
            <div className="text-center">
              <div className="bg-brand-green text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-file-alt text-2xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-brand-black mb-2">3. Detailed Reporting</h3>
              <p className="text-text-grey text-sm">Professional snagging report with photos, descriptions, and recommendations</p>
            </div>
            
            <div className="text-center">
              <div className="bg-brand-green text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-handshake text-2xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-brand-black mb-2">4. Developer Liaison</h3>
              <p className="text-text-grey text-sm">Professional communication with developers for defect rectification</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose UrbanGrid */}
      <section className="py-16 lg:py-20 bg-light-grey">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-brand-black mb-4">
                Why Choose UrbanGrid for Property Snagging Dubai
              </h2>
              <p className="text-lg text-text-grey">
                Dubai's most trusted property snagging company with extensive local expertise and proven track record.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start">
                <div className="bg-brand-green text-white p-3 rounded-full mr-4 flex-shrink-0">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-brand-black mb-2">Dubai Market Specialists</h3>
                  <p className="text-text-grey">Deep knowledge of Dubai property market, developments, and common snagging issues across all communities.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-brand-green text-white p-3 rounded-full mr-4 flex-shrink-0">
                  <i className="fas fa-award"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-brand-black mb-2">Professional Certified Team</h3>
                  <p className="text-text-grey">Certified property snagging experts with years of Dubai property inspection experience.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-brand-green text-white p-3 rounded-full mr-4 flex-shrink-0">
                  <i className="fas fa-clock"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-brand-black mb-2">Same-Day Reporting</h3>
                  <p className="text-text-grey">Receive comprehensive property snagging reports within hours, not days, for immediate action.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-brand-green text-white p-3 rounded-full mr-4 flex-shrink-0">
                  <i className="fas fa-tools"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-brand-black mb-2">Advanced Equipment</h3>
                  <p className="text-text-grey">State-of-the-art inspection tools and technology for accurate property snagging assessments.</p>
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
            Ready for Professional Property Snagging in Dubai?
          </h2>
          <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
            Protect your Dubai property investment with expert snagging services. Book your comprehensive property inspection today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:+971585686852"
              className="inline-flex items-center bg-white text-brand-green px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
            >
              <i className="fas fa-phone mr-2"></i>
              Call Dubai: +971 58 568 6852
            </a>
            
            <a 
              href="https://wa.me/971585686852?text=Hello%20UrbanGrid%2C%20I%20need%20property%20snagging%20services%20in%20Dubai.%20Please%20provide%20pricing%20and%20availability."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-transparent border-2 border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-brand-green transition-colors"
            >
              <i className="fab fa-whatsapp mr-2"></i>
              Get Snagging Quote
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}