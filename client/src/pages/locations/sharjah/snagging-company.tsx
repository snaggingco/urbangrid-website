
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";  
import { Link } from "wouter";
import SEO from "@/components/SEO";

export default function SnaggingCompanySharjah() {
  const services = [
    {
      title: "Family Community Snagging",
      description: "Specialized snagging for Sharjah's family-oriented developments",
      link: "/services/property-snagging/new-build-snagging",
      areas: ["Al Zahia", "Aljada", "Tilal City", "Sharjah Waterfront"]
    },
    {
      title: "Cultural District Properties",
      description: "Heritage and modern property snagging in cultural areas",
      link: "/locations/sharjah/villa-snagging", 
      areas: ["Al Majaz", "Al Qasimia", "University City", "Al Khan"]
    },
    {
      title: "Coastal Property Snagging",
      description: "Expert snagging for beachfront developments",
      link: "/locations/sharjah/apartment-inspection",
      areas: ["Khorfakkan", "Kalba", "Al Hamriyah", "Dibba Al-Hisn"]
    }
  ];

  return (
    <>
      <SEO 
        title="Snagging Company Sharjah - Expert Property Snagging Services | UrbanGrid"
        description="Sharjah's trusted snagging company providing comprehensive property snagging services. Family community & cultural district snagging in Al Zahia, Aljada, Kalba. Call +971585686852"
        keywords="snagging company sharjah, property snagging sharjah, sharjah snagging services, villa snagging sharjah, apartment snagging sharjah, family community snagging"
      />
      
      <div className="pt-16 lg:pt-20">
        {/* Hero Section */}
        <section className="py-16 lg:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl lg:text-5xl font-bold text-brand-black mb-6">
                Sharjah's Trusted Snagging Company
              </h1>
              <p className="text-xl text-text-grey leading-relaxed mb-8">
                UrbanGrid is Sharjah's leading snagging company, providing expert property inspection services across the emirate. From family communities like Al Zahia to coastal developments in Kalba, we ensure your Sharjah property investment is thoroughly protected.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button className="bg-brand-green text-white hover:bg-opacity-90 px-8 py-3">
                    Get Sharjah Snagging Quote
                  </Button>
                </Link>
                <a 
                  href="tel:+971585686852"
                  className="inline-flex items-center bg-transparent border-2 border-brand-green text-brand-green px-8 py-3 rounded-md font-semibold hover:bg-brand-green hover:text-white transition-colors"
                >
                  <i className="fas fa-phone mr-2"></i>
                  Call Sharjah Snagging Experts
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16 lg:py-20 bg-light-grey">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-12 text-center">
              Comprehensive Snagging Services in Sharjah
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

        {/* Sharjah Expertise */}
        <section className="py-16 lg:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-8">
                Why Choose Our Snagging Company for Sharjah Properties?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="text-left">
                  <h3 className="text-xl font-semibold text-brand-black mb-4">Cultural Heritage Expertise</h3>
                  <p className="text-text-grey leading-relaxed">
                    Deep understanding of Sharjah's unique architectural requirements, from heritage preservation areas to modern family communities like Al Zahia and Aljada.
                  </p>
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-semibold text-brand-black mb-4">Coastal Development Knowledge</h3>
                  <p className="text-text-grey leading-relaxed">
                    Specialized experience with beachfront properties in Khorfakkan, Kalba, and coastal developments, understanding unique environmental challenges.
                  </p>
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-semibold text-brand-black mb-4">Family-Focused Communities</h3>
                  <p className="text-text-grey leading-relaxed">
                    Expert knowledge of family-oriented developments with community facilities, schools, and recreational amenities requiring specialized inspection approaches.
                  </p>
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-semibold text-brand-black mb-4">Educational District Properties</h3>
                  <p className="text-text-grey leading-relaxed">
                    Familiar with University City and educational zone developments, understanding unique construction standards and community requirements.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-20 bg-brand-green text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Sharjah's Most Reliable Snagging Company
            </h2>
            <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
              Trust UrbanGrid for professional property snagging services across Sharjah's diverse communities, from cultural districts to coastal developments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="bg-white text-brand-green hover:bg-gray-100 px-8 py-3">
                  Schedule Sharjah Inspection
                </Button>
              </Link>
              <a 
                href="https://wa.me/971585686852?text=Hello! I need professional snagging services in Sharjah."
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
    </>
  );
}
