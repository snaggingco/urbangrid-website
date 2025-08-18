import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function UmmAlQuwain() {
  const services = [
    {
      title: "Property Inspection UAQ",
      description: "Expert property inspections for Umm Al Quwain's residential and commercial developments",
      link: "/services/secondary-market",
      areas: ["UAQ City Centre", "Al Salam City", "Al Humaidiya", "Al Rashidiya"]
    },
    {
      title: "Residential Snagging Services",
      description: "Comprehensive snagging services for villas and apartments in UAQ's growing communities",
      link: "/services/new-build-snagging",
      areas: ["Marina District", "Al Dar Complex", "Presidential Villas", "Family Compounds"]
    },
    {
      title: "Commercial Property Inspection",
      description: "Professional inspections for commercial properties and business developments",
      link: "/services/developer-projects",
      areas: ["UAQ Free Trade Zone", "Umm Al Quwain Mall", "Industrial Area", "Business District"]
    }
  ];

  const areas = [
    "UAQ City Centre", "Al Salam City", "Al Humaidiya", "Al Rashidiya", "Marina District",
    "Al Dar Complex", "Presidential Villas", "Family Compounds", "UAQ Free Trade Zone",
    "Umm Al Quwain Mall", "Industrial Area", "Business District", "Al Dour", "Falaj Al Mualla",
    "Old Town UAQ", "UAQ Corniche", "Creek Area", "Residential Complexes"
  ];

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-brand-black mb-6">
              Property Snagging & Inspection Services in Umm Al Quwain
            </h1>
            <p className="text-xl text-text-grey leading-relaxed mb-8">
              Umm Al Quwain's dedicated property inspection company providing comprehensive snagging services across the emirate. From residential compounds to commercial developments, we ensure quality and protection for your UAQ property investment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="bg-brand-green text-white hover:bg-opacity-90 px-8 py-3">
                  Get Free Quote in UAQ
                </Button>
              </Link>
              <a 
                href="tel:+971585686852"
                className="inline-flex items-center bg-transparent border-2 border-brand-green text-brand-green px-8 py-3 rounded-md font-semibold hover:bg-brand-green hover:text-white transition-colors"
              >
                <i className="fas fa-phone mr-2"></i>
                Call UAQ: +971585686852
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 lg:py-20 bg-light-grey">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-12 text-center">
            UAQ Property Inspection Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="bg-white hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-brand-black mb-4">{service.title}</h3>
                  <p className="text-text-grey mb-4">{service.description}</p>
                  <div className="mb-4">
                    <h4 className="font-medium text-brand-black mb-2">Service Areas:</h4>
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

      {/* UAQ Market Focus */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-8">
              Umm Al Quwain Property Market
            </h2>
            <p className="text-lg text-text-grey mb-8">
              Umm Al Quwain offers affordable property investment opportunities with growing infrastructure and strategic development initiatives. Our inspection services ensure quality control in this emerging market.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div className="bg-light-grey p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-brand-black mb-4">
                  <i className="fas fa-chart-line text-brand-green mr-2"></i>
                  Growth Potential
                </h3>
                <ul className="text-text-grey space-y-2">
                  <li>• Affordable entry point for property investment</li>
                  <li>• Growing infrastructure development</li>
                  <li>• Strategic location benefits</li>
                  <li>• Government investment in tourism</li>
                  <li>• Expanding residential communities</li>
                </ul>
              </div>
              
              <div className="bg-light-grey p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-brand-black mb-4">
                  <i className="fas fa-shield-alt text-brand-green mr-2"></i>
                  Quality Assurance
                </h3>
                <ul className="text-text-grey space-y-2">
                  <li>• Professional inspection for new developments</li>
                  <li>• Quality control for budget-friendly properties</li>
                  <li>• Comprehensive snagging services</li>
                  <li>• Expert guidance for first-time buyers</li>
                  <li>• Peace of mind for investment protection</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* UAQ Areas */}
      <section className="py-16 lg:py-20 bg-light-grey">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-12 text-center">
            Umm Al Quwain Areas We Serve
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {areas.map((area, index) => (
              <div key={index} className="bg-white p-3 rounded-lg text-center shadow-sm hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-brand-black">{area}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose UAQ */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-8 text-center">
              Why Invest in Umm Al Quwain?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-brand-green text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-dollar-sign text-2xl"></i>
                </div>
                <h3 className="font-semibold text-brand-black mb-2">Affordable Prices</h3>
                <p className="text-text-grey">Competitive property prices offering excellent value for money and high potential returns.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-brand-green text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-map-marker-alt text-2xl"></i>
                </div>
                <h3 className="font-semibold text-brand-black mb-2">Strategic Location</h3>
                <p className="text-text-grey">Central location providing easy access to all other emirates and major business centers.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-brand-green text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-seedling text-2xl"></i>
                </div>
                <h3 className="font-semibold text-brand-black mb-2">Growing Development</h3>
                <p className="text-text-grey">Emerging market with new residential and commercial projects offering growth opportunities.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-brand-green text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Professional Property Inspection in UAQ
          </h2>
          <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
            Secure your Umm Al Quwain property investment with professional snagging and inspection services. Ensure quality and value in this growing emirate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button className="bg-white text-brand-green hover:bg-gray-100 px-8 py-3">
                Schedule UAQ Inspection
              </Button>
            </Link>
            <a 
              href="https://wa.me/971585686852?text=Hello! I need property inspection services in Umm Al Quwain."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-transparent border-2 border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-brand-green transition-colors"
            >
              <i className="fab fa-whatsapp mr-2"></i>
              WhatsApp UAQ Team
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}