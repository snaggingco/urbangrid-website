import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function VillaSnaggingDubai() {
  const luxuryAreas = [
    "Arabian Ranches", "Emirates Hills", "Dubai Hills Estate", "Jumeirah",
    "Jumeirah Golf Estates", "Jumeirah Islands", "Meadows", "Springs",
    "Motor City", "Mudon", "Serena", "Villanova"
  ];

  const villaServices = [
    {
      title: "Luxury Villa Comprehensive Snagging",
      description: "Complete inspection for high-end villas with extensive grounds",
      price: "From AED 1 / Sq.ft",
      features: ["Full villa structure", "Landscaping assessment", "Pool & water features", "Smart home systems", "Security systems"]
    },
    {
      title: "Gated Community Villa Inspection",
      description: "Specialized inspection for community villas with shared amenities",
      price: "From AED 1 / Sq.ft",
      features: ["Villa interior & exterior", "Community amenity access", "Parking & storage", "Utility connections"]
    },
    {
      title: "Townhouse Snagging Service",
      description: "Focused inspection for Dubai's premium townhouse developments",
      price: "From AED 1 / Sq.ft",
      features: ["Multi-level assessment", "Shared wall inspection", "Garden & terrace", "Built-in storage"]
    }
  ];

  const villaFeatures = [
    {
      icon: "fas fa-home",
      title: "Complete Villa Assessment",
      description: "Every room, level, and outdoor space thoroughly inspected"
    },
    {
      icon: "fas fa-swimming-pool",
      title: "Pool & Water Features",
      description: "Pool equipment, filtration, safety features, and water quality"
    },
    {
      icon: "fas fa-leaf",
      title: "Landscaping & Irrigation",
      description: "Garden areas, irrigation systems, and outdoor lighting"
    },
    {
      icon: "fas fa-shield-alt",
      title: "Security & Smart Systems",
      description: "CCTV, alarms, smart home integration, and access controls"
    }
  ];

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-brand-black mb-6">
              Villa Snagging Dubai: Luxury Villa Inspection Services
            </h1>
            <p className="text-xl text-text-grey leading-relaxed mb-8">
              Expert villa snagging services across Dubai's premium gated communities. From Arabian Ranches to Emirates Hills, we ensure your luxury villa meets the highest standards.
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
                Call Dubai: +971585686852
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Villa Services */}
      <section className="py-16 lg:py-20 bg-light-grey">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-12 text-center">
            Dubai Villa Snagging Services
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

      {/* Villa Features */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-12 text-center">
            Comprehensive Villa Inspection Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {villaFeatures.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-brand-green text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className={`${feature.icon} text-2xl`}></i>
                </div>
                <h3 className="font-semibold text-brand-black mb-2">{feature.title}</h3>
                <p className="text-text-grey text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Luxury Areas */}
      <section className="py-16 lg:py-20 bg-light-grey">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-12 text-center">
            Dubai Luxury Villa Communities We Serve
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {luxuryAreas.map((area, index) => (
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
            Expert Villa Snagging in Dubai
          </h2>
          <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
            Protect your luxury villa investment with Dubai's most experienced villa snagging team. From AED 1 / Sq.ft.
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