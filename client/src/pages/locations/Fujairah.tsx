import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Fujairah() {
  const services = [
    {
      title: "Property Inspection Fujairah",
      description: "Expert property inspections for Fujairah's coastal developments and mountain communities",
      link: "/services/secondary-market",
      areas: ["Fujairah Beach", "Al Faseel", "Dibba Al-Fujairah", "Kalba"]
    },
    {
      title: "Coastal Property Snagging",
      description: "Specialized snagging services for beachfront properties and coastal developments",
      link: "/services/new-build-snagging",
      areas: ["Oceanic Hotel Area", "Sandy Beach Resort", "Royal Beach Resort", "Le Meridien"]
    },
    {
      title: "Resort Villa Inspection",
      description: "Comprehensive inspections for resort villas and holiday properties in Fujairah's tourism zones",
      link: "/services/move-in-move-out",
      areas: ["Fujairah Fort Area", "Heritage Village", "Ain Al Madhab", "Bidiyah"]
    }
  ];

  const areas = [
    "Fujairah Beach", "Al Faseel", "Dibba Al-Fujairah", "Kalba", "Oceanic Hotel Area",
    "Sandy Beach Resort", "Royal Beach Resort", "Le Meridien", "Fujairah Fort Area",
    "Heritage Village", "Ain Al Madhab", "Bidiyah", "Khor Fakkan", "Madhab",
    "Qidfa", "Sakamkam", "Tawyeen", "Al Aqah Beach"
  ];

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-brand-black mb-6">
              Property Snagging & Inspection Services in Fujairah
            </h1>
            <p className="text-xl text-text-grey leading-relaxed mb-8">
              Fujairah's trusted property inspection company providing comprehensive snagging services across the emirate's stunning coastline. From beachfront resorts to mountain properties, we ensure your Fujairah investment is thoroughly protected.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="bg-brand-green text-white hover:bg-opacity-90 px-8 py-3">
                  Get Free Quote in Fujairah
                </Button>
              </Link>
              <a 
                href="tel:+971501234567"
                className="inline-flex items-center bg-transparent border-2 border-brand-green text-brand-green px-8 py-3 rounded-md font-semibold hover:bg-brand-green hover:text-white transition-colors"
              >
                <i className="fas fa-phone mr-2"></i>
                Call Fujairah: +971 50 123 4567
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 lg:py-20 bg-light-grey">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-12 text-center">
            Fujairah Property Inspection Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="bg-white hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-brand-black mb-4">{service.title}</h3>
                  <p className="text-text-grey mb-4">{service.description}</p>
                  <div className="mb-4">
                    <h4 className="font-medium text-brand-black mb-2">Key Areas:</h4>
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

      {/* Fujairah Coastal Expertise */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-6">
                Fujairah's Coastal Property Expertise
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <i className="fas fa-anchor text-brand-green mr-3 mt-1"></i>
                  <div>
                    <h3 className="font-semibold text-brand-black">Marine Environment Properties</h3>
                    <p className="text-text-grey">Specialized knowledge of coastal construction challenges including salt corrosion, humidity, and marine-specific building requirements.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <i className="fas fa-hotel text-brand-green mr-3 mt-1"></i>
                  <div>
                    <h3 className="font-semibold text-brand-black">Resort & Hospitality Properties</h3>
                    <p className="text-text-grey">Expert inspections for hotel and resort properties with unique operational and structural requirements.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <i className="fas fa-landmark text-brand-green mr-3 mt-1"></i>
                  <div>
                    <h3 className="font-semibold text-brand-black">Heritage Area Properties</h3>
                    <p className="text-text-grey">Understanding of traditional and heritage area construction with modern building standards integration.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <i className="fas fa-fish text-brand-green mr-3 mt-1"></i>
                  <div>
                    <h3 className="font-semibold text-brand-black">Fishing Community Areas</h3>
                    <p className="text-text-grey">Familiarity with traditional fishing community developments and mixed-use coastal properties.</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Fujairah coastal property inspection services" 
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Fujairah Investment Guide */}
      <section className="py-16 lg:py-20 bg-light-grey">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-8 text-center">
              Fujairah Property Investment Opportunities
            </h2>
            <div className="prose prose-lg max-w-none text-text-grey">
              <p className="mb-6 text-center">
                Fujairah offers unique coastal investment opportunities with its strategic Gulf of Oman location, growing tourism sector, and natural beauty. Professional property inspection ensures your investment is protected in this emerging market.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-brand-black mb-4">Tourism Growth</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Expanding hotel and resort developments</li>
                    <li>Growing cruise ship and maritime tourism</li>
                    <li>Heritage and cultural tourism initiatives</li>
                    <li>Diving and water sports attractions</li>
                  </ul>
                </div>
                
                <div className="bg-white p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-brand-black mb-4">Strategic Location</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Only UAE emirate on Gulf of Oman</li>
                    <li>Major port and logistics hub</li>
                    <li>Growing business and free zone development</li>
                    <li>Mountain and coastal dual landscape</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fujairah Areas */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-12 text-center">
            Fujairah Areas We Serve
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {areas.map((area, index) => (
              <div key={index} className="bg-light-grey p-3 rounded-lg text-center shadow-sm hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-brand-black">{area}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-brand-green text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Professional Property Inspection in Fujairah
          </h2>
          <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
            Protect your Fujairah coastal property investment with expert snagging and inspection services. Our team understands the unique challenges of marine environment construction.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button className="bg-white text-brand-green hover:bg-gray-100 px-8 py-3">
                Schedule Fujairah Inspection
              </Button>
            </Link>
            <a 
              href="https://wa.me/971501234567?text=Hello! I need property inspection services in Fujairah."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-transparent border-2 border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-brand-green transition-colors"
            >
              <i className="fab fa-whatsapp mr-2"></i>
              WhatsApp Fujairah Team
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}