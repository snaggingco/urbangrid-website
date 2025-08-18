import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Sharjah() {
  const services = [
    {
      title: "Property Snagging Sharjah",
      description: "Expert snagging services for Sharjah's residential developments and villa communities",
      link: "/services/new-build-snagging",
      areas: ["Al Zahia", "Aljada", "Sharjah Waterfront", "Tilal City"]
    },
    {
      title: "Building Inspection Sharjah",
      description: "Comprehensive building inspections for apartments, villas, and commercial properties",
      link: "/services/secondary-market",
      areas: ["Al Majaz", "Al Qasimia", "Al Taawun", "Al Nahda Sharjah"]
    },
    {
      title: "Villa Inspection Sharjah",
      description: "Specialized villa inspections in Sharjah's premium residential communities",
      link: "/services/move-in-move-out",
      areas: ["Sharjah Golf & Shooting Club", "Mirdif Hills", "Al Warqa", "University City"]
    }
  ];

  const areas = [
    "Al Zahia", "Aljada", "Sharjah Waterfront", "Tilal City", "Al Majaz", "Al Qasimia",
    "Al Taawun", "Al Nahda Sharjah", "Sharjah Golf & Shooting Club", "Mirdif Hills",
    "Al Warqa", "University City", "Al Buhaira", "Al Khan", "Al Qulayaah", "Muwaileh",
    "Al Ramtha", "Al Fisht", "Kalba", "Khorfakkan", "Dibba Al-Hisn"
  ];

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-brand-black mb-6">
              Property Snagging & Inspection Services in Sharjah
            </h1>
            <p className="text-xl text-text-grey leading-relaxed mb-8">
              Sharjah's trusted property inspection company providing comprehensive snagging services across the emirate. From cultural district properties to beachfront developments, we ensure your Sharjah investment is thoroughly protected.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="bg-brand-green text-white hover:bg-opacity-90 px-8 py-3">
                  Get Free Quote in Sharjah
                </Button>
              </Link>
              <a 
                href="tel:+971585686852"
                className="inline-flex items-center bg-transparent border-2 border-brand-green text-brand-green px-8 py-3 rounded-md font-semibold hover:bg-brand-green hover:text-white transition-colors"
              >
                <i className="fas fa-phone mr-2"></i>
                Call Sharjah: +971585686852
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 lg:py-20 bg-light-grey">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-12 text-center">
            Sharjah Property Inspection Services
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

      {/* Why Choose UrbanGrid Sharjah */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-6">
                Sharjah Property Market Expertise
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <i className="fas fa-university text-brand-green mr-3 mt-1"></i>
                  <div>
                    <h3 className="font-semibold text-brand-black">Cultural Heritage Properties</h3>
                    <p className="text-text-grey">Specialized knowledge of heritage and traditional architecture preservation requirements in Sharjah's cultural districts.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <i className="fas fa-water text-brand-green mr-3 mt-1"></i>
                  <div>
                    <h3 className="font-semibold text-brand-black">Coastal Development Expertise</h3>
                    <p className="text-text-grey">Experience with beachfront properties in Khorfakkan and Kalba, understanding coastal construction challenges.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <i className="fas fa-graduation-cap text-brand-green mr-3 mt-1"></i>
                  <div>
                    <h3 className="font-semibold text-brand-black">Educational District Properties</h3>
                    <p className="text-text-grey">Familiar with University City and educational zone developments with unique construction standards.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <i className="fas fa-home text-brand-green mr-3 mt-1"></i>
                  <div>
                    <h3 className="font-semibold text-brand-black">Family-Focused Communities</h3>
                    <p className="text-text-grey">Understanding of family-oriented developments like Al Zahia and Aljada with community-centered design.</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Sharjah property inspection services" 
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sharjah Areas */}
      <section className="py-16 lg:py-20 bg-light-grey">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-12 text-center">
            Sharjah Areas We Serve
          </h2>
          <p className="text-lg text-text-grey text-center mb-8 max-w-3xl mx-auto">
            From the cultural heart of Sharjah to the coastal cities of Khorfakkan and Kalba, our property inspection services cover all areas of the emirate, ensuring comprehensive property protection.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {areas.map((area, index) => (
              <div key={index} className="bg-white p-3 rounded-lg text-center shadow-sm hover:shadow-md transition-shadow">
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
            Professional Property Inspection in Sharjah
          </h2>
          <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
            Protect your Sharjah property investment with comprehensive snagging and inspection services tailored to the emirate's unique architectural and cultural requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button className="bg-white text-brand-green hover:bg-gray-100 px-8 py-3">
                Schedule Sharjah Inspection
              </Button>
            </Link>
            <a 
              href="https://wa.me/971585686852?text=Hello! I need property inspection services in Sharjah."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-transparent border-2 border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-brand-green transition-colors"
            >
              <i className="fab fa-whatsapp mr-2"></i>
              WhatsApp Sharjah Team
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}