import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Ajman() {
  const services = [
    {
      title: "Property Inspection Ajman",
      description: "Expert property inspections for Ajman's growing residential and commercial developments",
      link: "/services/secondary-market",
      areas: ["Ajman Downtown", "Al Nuaimiya", "Al Rashidiya", "Ajman Marina"]
    },
    {
      title: "Snagging Services Ajman",
      description: "Professional snagging services for new developments across Ajman's expanding neighborhoods",
      link: "/services/new-build-snagging",
      areas: ["City Centre Ajman", "Ajman Corniche", "Al Jurf", "Masfout"]
    },
    {
      title: "Villa Snagging Ajman",
      description: "Specialized villa and apartment inspections in Ajman's residential communities",
      link: "/services/move-in-move-out",
      areas: ["Al Humaidiya", "Al Manama", "Al Tallah", "Al Zahir"]
    }
  ];

  const areas = [
    "Ajman Downtown", "Al Nuaimiya", "Al Rashidiya", "Ajman Marina", "City Centre Ajman",
    "Ajman Corniche", "Al Jurf", "Masfout", "Al Humaidiya", "Al Manama", "Al Tallah",
    "Al Zahir", "Al Helio", "Al Ittihad", "Al Jarf Industrial", "Al Rawda", "Gulf Pearl"
  ];

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-brand-black mb-6">
              Property Snagging & Inspection Services in Ajman
            </h1>
            <p className="text-xl text-text-grey leading-relaxed mb-8">
              Ajman's reliable property inspection company offering comprehensive snagging services across the emirate. From downtown developments to coastal properties, we ensure thorough protection for your Ajman real estate investment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="bg-brand-green text-white hover:bg-opacity-90 px-8 py-3">
                  Get Free Quote in Ajman
                </Button>
              </Link>
              <a 
                href="tel:+971585686852"
                className="inline-flex items-center bg-transparent border-2 border-brand-green text-brand-green px-8 py-3 rounded-md font-semibold hover:bg-brand-green hover:text-white transition-colors"
              >
                <i className="fas fa-phone mr-2"></i>
                Call Ajman: +971585686852
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 lg:py-20 bg-light-grey">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-12 text-center">
            Ajman Property Inspection Services
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

      {/* Ajman Market Focus */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-8">
              Ajman Property Market Insights
            </h2>
            <p className="text-lg text-text-grey mb-8">
              Ajman offers excellent value for property investors with growing infrastructure and strategic location. Our inspection services ensure you make informed decisions in this emerging market.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-brand-black">Growth Opportunities</h3>
                <ul className="list-disc pl-6 text-text-grey space-y-2">
                  <li>Strategic location between Dubai and Sharjah</li>
                  <li>Affordable property prices with high rental yields</li>
                  <li>Growing infrastructure and transportation links</li>
                  <li>Expanding commercial and retail developments</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-brand-black">Investment Considerations</h3>
                <ul className="list-disc pl-6 text-text-grey space-y-2">
                  <li>Rapid development requiring quality control</li>
                  <li>Emerging areas with varying construction standards</li>
                  <li>Important due diligence for new developments</li>
                  <li>Professional inspection for peace of mind</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ajman Areas */}
      <section className="py-16 lg:py-20 bg-light-grey">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-12 text-center">
            Ajman Communities We Serve
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

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-brand-green text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Professional Property Inspection in Ajman
          </h2>
          <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
            Secure your Ajman property investment with professional snagging and inspection services. Our team ensures comprehensive quality control for your peace of mind.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button className="bg-white text-brand-green hover:bg-gray-100 px-8 py-3">
                Schedule Ajman Inspection
              </Button>
            </Link>
            <a 
              href="https://wa.me/971585686852?text=Hello! I need property inspection services in Ajman."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-transparent border-2 border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-brand-green transition-colors"
            >
              <i className="fab fa-whatsapp mr-2"></i>
              WhatsApp Ajman Team
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}