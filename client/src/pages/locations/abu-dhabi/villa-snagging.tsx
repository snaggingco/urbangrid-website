import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function VillaSnaggingAbuDhabi() {
  const villaAreas = [
    "Al Reef", "Khalifa City", "Mohammed Bin Zayed City", "Saadiyat Beach Villas",
    "Yas Acres", "Al Raha Gardens", "Bloom Gardens", "West Yas",
    "Al Shamkha", "Shakhbout City"
  ];

  const villaServices = [
    {
      title: "Compound Villa Inspection",
      description: "Comprehensive inspection for Abu Dhabi's gated villa communities",
      price: "Starting from AED 2,000",
      features: ["Full villa assessment", "Community facility access", "Compound infrastructure", "Maintenance standards"]
    },
    {
      title: "Standalone Villa Snagging",
      description: "Detailed inspection for independent villa properties",
      price: "Starting from AED 2,200",
      features: ["Complete property evaluation", "Boundary and gates", "Private utilities", "Landscaping assessment"]
    },
    {
      title: "Beach Villa Premium Service",
      description: "Specialized inspection for Saadiyat and coastal villa properties",
      price: "Starting from AED 2,500",
      features: ["Marine environment protection", "Beach access verification", "Premium finish standards", "Resort amenity integration"]
    }
  ];

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-brand-black mb-6">
              Villa Snagging Abu Dhabi: Capital City Villa Inspection Services
            </h1>
            <p className="text-xl text-text-grey leading-relaxed mb-8">
              Expert villa snagging services across Abu Dhabi's premium communities. From Al Reef compounds to Saadiyat Beach villas, we ensure your capital city investment meets the highest standards.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="bg-brand-green text-white hover:bg-opacity-90 px-8 py-3">
                  Get Free Villa Quote
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

      {/* Villa Services */}
      <section className="py-16 lg:py-20 bg-light-grey">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-12 text-center">
            Abu Dhabi Villa Snagging Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {villaServices.map((service, index) => (
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

      {/* Villa Areas */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-12 text-center">
            Abu Dhabi Villa Communities We Serve
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {villaAreas.map((area, index) => (
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
            Professional Villa Snagging in Abu Dhabi
          </h2>
          <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
            Secure your Abu Dhabi villa investment with expert snagging services. Starting from AED 2,000.
          </p>
          <Link href="/contact">
            <Button className="bg-white text-brand-green hover:bg-gray-100 px-8 py-3">
              Book Villa Inspection
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}