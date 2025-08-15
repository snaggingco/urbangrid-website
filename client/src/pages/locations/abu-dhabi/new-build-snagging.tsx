import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function NewBuildSnaggingAbuDhabi() {
  const focusAreas = [
    "Saadiyat Island", "Al Reem Island", "Yas Island", "Corniche Area",
    "Al Reef", "Khalifa City", "Mohammed Bin Zayed City", "Masdar City",
    "Capital Gate", "Al Raha Beach"
  ];

  const services = [
    {
      title: "Capital District New Build Snagging",
      description: "Premium inspection for Abu Dhabi's prestigious developments",
      price: "Starting from AED 1,500",
      features: ["Government district standards", "Premium finish inspection", "Advanced MEP systems", "Cultural compliance check"]
    },
    {
      title: "Island Development Inspection",
      description: "Specialized service for Saadiyat and Al Reem Island properties",
      price: "Starting from AED 1,600",
      features: ["Island-specific standards", "Marine environment assessment", "Infrastructure integration", "Tourism zone compliance"]
    },
    {
      title: "Sustainable Building Assessment",
      description: "Expert evaluation for Masdar City and green developments",
      price: "Starting from AED 1,700",
      features: ["Sustainability features", "Energy efficiency systems", "Green building standards", "LEED compliance"]
    }
  ];

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-brand-black mb-6">
              New Build Snagging Abu Dhabi: Capital City Handover Inspection
            </h1>
            <p className="text-xl text-text-grey leading-relaxed mb-8">
              Professional new build snagging services across Abu Dhabi's premier developments. From Saadiyat Island cultural district to Al Reem Island towers, we ensure capital city quality standards.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="bg-brand-green text-white hover:bg-opacity-90 px-8 py-3">
                  Get Free Quote in Abu Dhabi
                </Button>
              </Link>
              <a 
                href="tel:+971501234567"
                className="inline-flex items-center bg-transparent border-2 border-brand-green text-brand-green px-8 py-3 rounded-md font-semibold hover:bg-brand-green hover:text-white transition-colors"
              >
                <i className="fas fa-phone mr-2"></i>
                Call Abu Dhabi: +971 50 123 4567
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 lg:py-20 bg-light-grey">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-12 text-center">
            Abu Dhabi New Build Snagging Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

      {/* Areas Served */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-12 text-center">
            Abu Dhabi Areas We Serve
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

      {/* CTA */}
      <section className="py-16 lg:py-20 bg-brand-green text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Expert New Build Snagging in Abu Dhabi
          </h2>
          <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
            Protect your Abu Dhabi investment with capital city's leading snagging experts. Starting from AED 1,500.
          </p>
          <Link href="/contact">
            <Button className="bg-white text-brand-green hover:bg-gray-100 px-8 py-3">
              Book Abu Dhabi Inspection
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}