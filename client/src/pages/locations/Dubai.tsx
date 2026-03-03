
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import SEO from "@/components/SEO";

export default function PropertyInspectionDubai() {
  const inspectionTypes = [
    {
      title: "Pre-Purchase Property Inspection",
      description: "Comprehensive property assessment before buying to protect your investment",
      price: "From AED 1,500",
      duration: "3-5 hours",
      coverage: ["Structural assessment", "MEP systems", "Legal compliance", "Market valuation input"],
      popular: true
    },
    {
      title: "New Build Property Inspection", 
      description: "Pre-handover inspection for newly constructed properties",
      price: "From AED 1,200",
      duration: "4-6 hours", 
      coverage: ["Construction quality", "Developer compliance", "Defect identification", "Handover preparation"]
    },
    {
      title: "Rental Property Inspection",
      description: "Move-in/move-out inspections for rental properties",
      price: "From AED 800",
      duration: "2-3 hours",
      coverage: ["Condition documentation", "Inventory checking", "Damage assessment", "Security deposit protection"]
    },
    {
      title: "Commercial Property Inspection",
      description: "Professional inspection for commercial real estate",
      price: "From AED 2,500", 
      duration: "4-8 hours",
      coverage: ["Code compliance", "Safety systems", "Business suitability", "Investment analysis"]
    }
  ];

  const dubaiAreas = [
    "Downtown Dubai", "Dubai Marina", "Business Bay", "JLT", "DIFC", "Palm Jumeirah",
    "Dubai Hills", "Arabian Ranches", "Emirates Hills", "JBR", "City Walk", "Dubai Creek Harbour"
  ];

  return (
    <>
      <SEO 
        title="Property Inspection Dubai - Professional Property Assessment Services"
        description="Expert property inspection services in Dubai. Pre-purchase inspections, new build assessments, rental property checks. RERA licensed inspectors covering all Dubai areas. Call +971585686852"
        keywords="property inspection dubai, property inspection services dubai, dubai property inspection, property inspector dubai, pre purchase inspection dubai, property assessment dubai"
      />
      
      <div className="pt-16 lg:pt-20">
        {/* Hero Section */}
        <section className="py-16 lg:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl lg:text-5xl font-bold text-brand-black mb-6">
                Professional Property Inspection Services in Dubai
              </h1>
              <p className="text-xl text-text-grey leading-relaxed mb-8">
                UrbanGrid provides comprehensive property inspection services across Dubai. From pre-purchase assessments to new build inspections, protect your investment with our RERA-licensed professional inspectors.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button className="bg-brand-green text-white hover:bg-opacity-90 px-8 py-3">
                    Schedule Property Inspection
                  </Button>
                </Link>
                <a 
                  href="tel:+971585686852"
                  className="inline-flex items-center bg-transparent border-2 border-brand-green text-brand-green px-8 py-3 rounded-md font-semibold hover:bg-brand-green hover:text-white transition-colors"
                >
                  <i className="fas fa-phone mr-2"></i>
                  Call Dubai Property Inspectors
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Inspection Services */}
        <section className="py-16 lg:py-20 bg-light-grey">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-12 text-center">
              Comprehensive Property Inspection Services in Dubai
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {inspectionTypes.map((service, index) => (
                <Card key={index} className={`bg-white hover:shadow-lg transition-all duration-300 ${service.popular ? 'ring-2 ring-brand-green' : ''}`}>
                  <CardContent className="p-6">
                    {service.popular && (
                      <div className="bg-brand-green text-white px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block">
                        Most Popular
                      </div>
                    )}
                    <h3 className="text-xl font-semibold text-brand-black mb-3">{service.title}</h3>
                    <p className="text-text-grey mb-4">{service.description}</p>
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <span className="font-medium">Price:</span> {service.price}
                      </div>
                      <div>
                        <span className="font-medium">Duration:</span> {service.duration}
                      </div>
                    </div>
                    <div className="mb-4">
                      <h4 className="font-medium text-brand-black mb-2">Inspection Coverage:</h4>
                      <ul className="text-sm text-text-grey space-y-1">
                        {service.coverage.map((item, i) => (
                          <li key={i} className="flex items-center">
                            <i className="fas fa-check text-brand-green mr-2"></i>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Link href="/contact">
                      <Button variant="outline" className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white w-full">
                        Book This Inspection
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Coverage Areas */}
        <section className="py-16 lg:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-8">
                Property Inspection Coverage Across Dubai
              </h2>
              <p className="text-lg text-text-grey mb-8">
                Our certified property inspectors serve all major areas in Dubai, providing consistent quality and expertise across the emirate.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                {dubaiAreas.map((area, index) => (
                  <div key={index} className="bg-light-grey p-3 rounded text-center text-sm font-medium">
                    {area}
                  </div>
                ))}
              </div>
              <p className="text-text-grey">
                <strong>24/7 Emergency Inspections Available</strong> - Call us for urgent property inspection needs
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-20 bg-brand-green text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Get Professional Property Inspection in Dubai Today
            </h2>
            <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
              Protect your Dubai property investment with comprehensive inspections from RERA-licensed professionals. Same-day reports guaranteed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="bg-white text-brand-green hover:bg-gray-100 px-8 py-3">
                  Book Property Inspection Now
                </Button>
              </Link>
              <a 
                href="https://wa.me/971585686852?text=Hello! I need professional property inspection services in Dubai."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-transparent border-2 border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-brand-green transition-colors"
              >
                <i className="fab fa-whatsapp mr-2"></i>
                WhatsApp Dubai Inspectors
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
