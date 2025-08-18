import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function NewBuildSnaggingSharjah() {
  const focusAreas = [
    "Al Majaz Waterfront", "Muwaileh", "Al Khan", "University City",
    "Tilal City", "Al Zahia", "Aljada", "Nasma Residences",
    "Al Suyoh", "Kalba"
  ];

  const services = [
    {
      title: "Cultural Emirate New Build Snagging",
      description: "Comprehensive inspection respecting Sharjah's cultural heritage standards",
      price: "From AED 1 / Sq.ft",
      features: ["Cultural compliance check", "Heritage-inspired designs", "Traditional material assessment", "Community integration"]
    },
    {
      title: "Affordable Housing Quality Control",
      description: "Value-focused inspection for Sharjah's budget-friendly developments",
      price: "From AED 1 / Sq.ft",
      features: ["Cost-effective quality standards", "Essential defect identification", "Value engineering assessment", "Long-term durability focus"]
    },
    {
      title: "University District Student Housing",
      description: "Specialized inspection for student accommodation and university area properties",
      price: "From AED 1 / Sq.ft",
      features: ["Student housing standards", "Shared facility assessment", "Educational zone compliance", "Safety and security focus"]
    }
  ];

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-brand-black mb-6">
              New Build Snagging Sharjah: Cultural Emirate Quality Inspection
            </h1>
            <p className="text-xl text-text-grey leading-relaxed mb-8">
              Professional new build snagging services across Sharjah's diverse developments. From Al Majaz Waterfront to University City, we ensure quality standards while respecting cultural heritage.
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
                Call Sharjah: +971 58 568 6852
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 lg:py-20 bg-light-grey">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-12 text-center">
            Sharjah New Build Snagging Services
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
            Sharjah Areas We Serve
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
            Quality New Build Snagging in Sharjah
          </h2>
          <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
            Protect your Sharjah investment with cultural emirate's trusted snagging experts. From AED 1 / Sq.ft.
          </p>
          <Link href="/contact">
            <Button className="bg-white text-brand-green hover:bg-gray-100 px-8 py-3">
              Book Sharjah Inspection
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}