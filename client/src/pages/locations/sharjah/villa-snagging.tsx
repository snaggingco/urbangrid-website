import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function VillaSnaggingSharjah() {
  const villaAreas = [
    "Al Zahia", "Aljada", "Nasma Residences", "Tilal City",
    "Muwaileh", "Al Khawaneej", "Al Ramtha", "Wasit Suburb",
    "Al Heera", "Al Qasba"
  ];

  const villaServices = [
    {
      title: "Traditional Design Villa Inspection",
      description: "Specialized assessment for heritage-inspired villa designs",
      price: "From AED 1 / Sq.ft",
      features: ["Cultural design compliance", "Traditional material quality", "Heritage architecture standards", "Community harmony assessment"]
    },
    {
      title: "Family-Oriented Villa Snagging",
      description: "Comprehensive inspection focusing on family living requirements",
      price: "From AED 1 / Sq.ft",
      features: ["Family safety features", "Child-friendly design", "Educational facility access", "Community amenities"]
    },
    {
      title: "Value Villa Quality Assessment",
      description: "Cost-effective inspection for affordable villa developments",
      price: "From AED 1 / Sq.ft",
      features: ["Essential quality standards", "Cost-benefit analysis", "Durability assessment", "Maintenance planning"]
    }
  ];

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-brand-black mb-6">
              Villa Snagging Sharjah: Family-Focused Villa Inspection Services
            </h1>
            <p className="text-xl text-text-grey leading-relaxed mb-8">
              Expert villa snagging services across Sharjah's family-oriented communities. From Al Zahia's traditional designs to Aljada's modern villas, we ensure quality standards for family living.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="bg-brand-green text-white hover:bg-opacity-90 px-8 py-3">
                  Get Free Villa Quote
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

      {/* Villa Services */}
      <section className="py-16 lg:py-20 bg-light-grey">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-12 text-center">
            Sharjah Villa Snagging Services
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
            Sharjah Villa Communities We Serve
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
            Professional Villa Snagging in Sharjah
          </h2>
          <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
            Secure your Sharjah villa investment with family-focused inspection services. From AED 1 / Sq.ft.
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