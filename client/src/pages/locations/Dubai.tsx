import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Dubai() {
  const services = [
    {
      title: "New Build Snagging Dubai",
      description: "Expert snagging services for new developments in Dubai Marina, Downtown Dubai, and Business Bay",
      link: "/services/new-build-snagging",
      areas: ["Dubai Marina", "Downtown Dubai", "Business Bay", "JLT"]
    },
    {
      title: "Property Inspection Dubai",
      description: "Comprehensive property inspections across all Dubai areas including villa and apartment inspections",
      link: "/services/secondary-market",
      areas: ["Dubai Hills", "Arabian Ranches", "Emirates Hills", "Jumeirah"]
    },
    {
      title: "Handover Inspection Dubai",
      description: "Professional handover inspections for Dubai's luxury developments and residential communities",
      link: "/services/dlp-snagging",
      areas: ["Palm Jumeirah", "City Walk", "Bluewaters", "Dubai Creek Harbour"]
    }
  ];

  const areas = [
    "Dubai Marina", "Downtown Dubai", "Business Bay", "JLT", "Dubai Hills", 
    "Arabian Ranches", "Emirates Hills", "Jumeirah", "Palm Jumeirah", "City Walk",
    "Bluewaters", "Dubai Creek Harbour", "DIFC", "Mirdif", "Jumeirah Village Circle",
    "Dubai Investment Park", "Motor City", "Sports City", "Discovery Gardens",
    "International City", "Dubai Silicon Oasis", "Dubailand", "Al Barsha"
  ];

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-brand-black mb-6">
              Property Snagging & Inspection Services in Dubai
            </h1>
            <p className="text-xl text-text-grey leading-relaxed mb-8">
              Dubai's leading snagging company providing expert property inspection services across all emirates. From new build handover inspections to villa snagging, we protect your investment in Dubai's dynamic real estate market.
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
                Call Dubai Office: +971 50 123 4567
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 lg:py-20 bg-light-grey">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-12 text-center">
            Dubai Property Inspection Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="bg-white hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-brand-black mb-4">{service.title}</h3>
                  <p className="text-text-grey mb-4">{service.description}</p>
                  <div className="mb-4">
                    <h4 className="font-medium text-brand-black mb-2">Popular Areas:</h4>
                    <div className="flex flex-wrap gap-2">
                      {service.areas.map((area, i) => (
                        <span key={i} className="bg-brand-green text-white px-2 py-1 rounded text-xs">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Link href={service.link}>
                    <Button variant="outline" className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white w-full">
                      Learn More
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose UrbanGrid Dubai */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-6">
                Why Choose UrbanGrid for Dubai Property Inspections?
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <i className="fas fa-check-circle text-brand-green mr-3 mt-1"></i>
                  <div>
                    <h3 className="font-semibold text-brand-black">Dubai Market Expertise</h3>
                    <p className="text-text-grey">Deep understanding of Dubai's unique construction standards and developer practices across all major communities.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <i className="fas fa-check-circle text-brand-green mr-3 mt-1"></i>
                  <div>
                    <h3 className="font-semibold text-brand-black">RERA Approved Services</h3>
                    <p className="text-text-grey">Fully licensed and approved by Dubai Real Estate Regulatory Agency for professional property inspection services.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <i className="fas fa-check-circle text-brand-green mr-3 mt-1"></i>
                  <div>
                    <h3 className="font-semibold text-brand-black">Same-Day Reports</h3>
                    <p className="text-text-grey">Comprehensive digital reports with photos delivered within 24 hours of inspection completion.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <i className="fas fa-check-circle text-brand-green mr-3 mt-1"></i>
                  <div>
                    <h3 className="font-semibold text-brand-black">Developer Relationships</h3>
                    <p className="text-text-grey">Established partnerships with major Dubai developers including Emaar, DAMAC, and Nakheel for efficient issue resolution.</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Dubai property inspection services" 
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Dubai Areas We Serve */}
      <section className="py-16 lg:py-20 bg-light-grey">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-12 text-center">
            Dubai Areas We Serve
          </h2>
          <p className="text-lg text-text-grey text-center mb-8 max-w-3xl mx-auto">
            Our Dubai snagging experts provide property inspection services across all major communities and developments in Dubai. From luxury villas to high-rise apartments, we ensure comprehensive coverage.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {areas.map((area, index) => (
              <div key={index} className="bg-white p-3 rounded-lg text-center shadow-sm hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-brand-black">{area}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dubai Property Market Insights */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-8 text-center">
              Dubai Property Inspection Guide
            </h2>
            <div className="prose prose-lg max-w-none text-text-grey">
              <h3 className="text-xl font-semibold text-brand-black mb-4">Understanding Dubai's Property Market</h3>
              <p className="mb-6">
                Dubai's real estate market is one of the world's most dynamic, with continuous development and high property turnover. Whether you're purchasing a new build in <strong>Dubai Marina</strong>, a villa in <strong>Arabian Ranches</strong>, or an apartment in <strong>Downtown Dubai</strong>, professional snagging inspection services are essential.
              </p>
              
              <h3 className="text-xl font-semibold text-brand-black mb-4">Common Dubai Property Issues</h3>
              <ul className="list-disc pl-6 mb-6">
                <li><strong>MEP System Defects:</strong> HVAC, plumbing, and electrical issues common in Dubai's climate</li>
                <li><strong>Finishing Quality:</strong> Paint, tiling, and joinery problems in rapid construction schedules</li>
                <li><strong>Waterproofing Issues:</strong> Critical for bathrooms and balconies in Dubai's environment</li>
                <li><strong>Door & Window Sealing:</strong> Essential for energy efficiency and dust protection</li>
              </ul>

              <h3 className="text-xl font-semibold text-brand-black mb-4">Best Time for Property Inspection in Dubai</h3>
              <p className="mb-6">
                The optimal time for property snagging in Dubai is during the <strong>Defect Liability Period (DLP)</strong>, typically 12 months after handover. Our Dubai property inspection experts recommend scheduling inspections during cooler months (October-March) for comprehensive outdoor assessments.
              </p>
            </div>
            
            <div className="text-center mt-8">
              <Link href="/blog">
                <Button variant="outline" className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white">
                  Read More Dubai Property Tips
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* External Resources */}
      <section className="py-16 lg:py-20 bg-light-grey">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-brand-black mb-8 text-center">
            Dubai Property Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold text-brand-black mb-4">Dubai Municipality</h3>
                <p className="text-text-grey mb-4">Official building regulations and permit information for Dubai properties.</p>
                <a 
                  href="https://www.dm.gov.ae" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-brand-green hover:underline"
                >
                  Visit Dubai Municipality
                </a>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold text-brand-black mb-4">Dubai Land Department</h3>
                <p className="text-text-grey mb-4">Property registration and real estate transaction services in Dubai.</p>
                <a 
                  href="https://dubailand.gov.ae" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-brand-green hover:underline"
                >
                  Visit Dubai Land Department
                </a>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold text-brand-black mb-4">RERA Dubai</h3>
                <p className="text-text-grey mb-4">Real Estate Regulatory Agency for property standards and developer regulations.</p>
                <a 
                  href="https://www.rera.ae" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-brand-green hover:underline"
                >
                  Visit RERA Dubai
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-brand-green text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready for Professional Property Inspection in Dubai?
          </h2>
          <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
            Protect your Dubai property investment with expert snagging services. Our Dubai-based team provides comprehensive inspections across all major developments and communities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button className="bg-white text-brand-green hover:bg-gray-100 px-8 py-3">
                Schedule Dubai Inspection
              </Button>
            </Link>
            <a 
              href="https://wa.me/971501234567?text=Hello! I need property inspection services in Dubai."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-transparent border-2 border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-brand-green transition-colors"
            >
              <i className="fab fa-whatsapp mr-2"></i>
              WhatsApp Dubai Team
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}