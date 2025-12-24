import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function SnaggingCostDubai() {
  const pricingTiers = [
    {
      type: "Studio/1BR Apartment",
      size: "Up to 700 sq ft",
      price: "Minimum AED 700",
      duration: "2-3 hours",
      features: ["Basic snagging inspection", "MEP systems check", "Interior finishes review", "Same-day report", "Developer communication"]
    },
    {
      type: "2-3BR Apartment",
      size: "700-1,500 sq ft", 
      price: "From AED 1 / Sq.ft",
      duration: "3-4 hours",
      features: ["Comprehensive snagging", "Structural assessment", "All systems testing", "Quality benchmarking", "Detailed photography"],
      popular: true
    },
    {
      type: "Villa/Townhouse",
      size: "1,500+ sq ft",
      price: "From AED 1.5 / Sq.ft",
      duration: "4-6 hours", 
      features: ["Full villa snagging", "Exterior inspection", "Garden/pool assessment", "Smart home systems", "Premium reporting"]
    }
  ];

  const additionalServices = [
    { service: "Express Same-Day Report", cost: "Included", note: "Standard with all packages" },
    { service: "Follow-up Inspection", cost: "AED 500", note: "After developer fixes" },
    { service: "Weekend/Holiday Service", cost: "+20%", note: "Premium scheduling" },
    { service: "Emergency Rush Service", cost: "+50%", note: "Within 24 hours" },
    { service: "Additional Property Units", cost: "-30%", note: "Bulk discount applies" }
  ];

  const costFactors = [
    {
      factor: "Property Size",
      impact: "Primary cost driver",
      details: "Larger properties require more inspection time and detailed coverage"
    },
    {
      factor: "Property Type",
      impact: "Complexity factor",
      details: "Villas cost more than apartments due to additional systems and areas"
    },
    {
      factor: "Location Access",
      impact: "Minimal impact",
      details: "All Dubai areas covered at standard rates"
    },
    {
      factor: "Timeline Requirements",
      impact: "Premium for urgency",
      details: "Rush services available with premium pricing"
    }
  ];

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero Section - Targeting "snagging dubai cost" */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-brand-black mb-6">
              Snagging Dubai Cost: Transparent Pricing for Property Snagging Services
            </h1>
            <p className="text-xl text-text-grey leading-relaxed mb-8">
              Get clear, upfront pricing for professional snagging services in Dubai. No hidden fees, competitive rates, and exceptional value for comprehensive property inspections across all Dubai communities.
            </p>
            <div className="bg-brand-green text-white p-4 rounded-lg inline-block mb-8">
              <p className="text-lg font-semibold">Minimum AED 700 | From AED 1 / Sq.ft | Free Quotes</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="bg-brand-green text-white hover:bg-opacity-90 px-8 py-3">
                  Get Instant Price Quote
                </Button>
              </Link>
              <a 
                href="tel:+971585686852"
                className="inline-flex items-center bg-transparent border-2 border-brand-green text-brand-green px-8 py-3 rounded-md font-semibold hover:bg-brand-green hover:text-white transition-colors"
              >
                <i className="fas fa-phone mr-2"></i>
                Call for Pricing: +971 58 568 6852
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Table */}
      <section className="py-16 lg:py-20 bg-light-grey">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-black mb-4">
              Dubai Snagging Service Pricing
            </h2>
            <p className="text-lg text-text-grey max-w-2xl mx-auto">
              Transparent, competitive pricing for all property types in Dubai. No hidden costs, all-inclusive service packages.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <Card key={index} className={`h-full ${tier.popular ? 'border-2 border-brand-green relative' : ''}`}>
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-brand-green text-white px-4 py-1 rounded-full text-sm font-semibold">Most Popular</span>
                  </div>
                )}
                <CardContent className="p-8 text-center h-full flex flex-col">
                  <h3 className="text-xl font-bold text-brand-black mb-2">{tier.type}</h3>
                  <p className="text-text-grey mb-4">{tier.size}</p>
                  <div className="text-4xl font-bold text-brand-green mb-2">{tier.price}</div>
                  <p className="text-text-grey mb-6">{tier.duration}</p>
                  <ul className="text-left space-y-3 flex-grow">
                    {tier.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start">
                        <i className="fas fa-check text-brand-green mr-2 mt-1"></i>
                        <span className="text-text-grey">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <Button className="w-full bg-brand-green text-white hover:bg-opacity-90">
                      Book This Package
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Cost Factors */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-black mb-4">
              What Affects Snagging Costs in Dubai?
            </h2>
            <p className="text-lg text-text-grey max-w-2xl mx-auto">
              Understanding the factors that influence snagging service pricing helps you make informed decisions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {costFactors.map((factor, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-brand-black mb-2">{factor.factor}</h3>
                  <p className="text-brand-green font-medium mb-2">{factor.impact}</p>
                  <p className="text-text-grey">{factor.details}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-16 lg:py-20 bg-light-grey">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-black mb-4">
              Additional Services & Add-ons
            </h2>
            <p className="text-lg text-text-grey max-w-2xl mx-auto">
              Enhance your snagging service with additional options tailored to your specific needs.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-brand-black">Service</th>
                        <th className="text-left py-3 px-4 font-semibold text-brand-black">Cost</th>
                        <th className="text-left py-3 px-4 font-semibold text-brand-black">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {additionalServices.map((service, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-3 px-4 text-text-grey">{service.service}</td>
                          <td className="py-3 px-4 font-semibold text-brand-green">{service.cost}</td>
                          <td className="py-3 px-4 text-text-grey">{service.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-brand-black mb-4">
                Why Our Dubai Snagging Costs Offer Exceptional Value
              </h2>
              <p className="text-lg text-text-grey">
                Compare our competitive pricing with the comprehensive service quality you receive.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start">
                <div className="bg-brand-green text-white p-3 rounded-full mr-4 flex-shrink-0">
                  <i className="fas fa-dollar-sign"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-brand-black mb-2">Transparent Pricing</h3>
                  <p className="text-text-grey">All costs clearly stated upfront with no hidden fees or surprise charges. What you see is what you pay.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-brand-green text-white p-3 rounded-full mr-4 flex-shrink-0">
                  <i className="fas fa-clock"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-brand-black mb-2">Same-Day Reports Included</h3>
                  <p className="text-text-grey">Professional, detailed reports delivered within hours - no additional cost for fast turnaround.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-brand-green text-white p-3 rounded-full mr-4 flex-shrink-0">
                  <i className="fas fa-tools"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-brand-black mb-2">Advanced Equipment</h3>
                  <p className="text-text-grey">State-of-the-art inspection tools and technology included in standard pricing for accurate assessments.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-brand-green text-white p-3 rounded-full mr-4 flex-shrink-0">
                  <i className="fas fa-handshake"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-brand-black mb-2">Developer Liaison Included</h3>
                  <p className="text-text-grey">Professional communication with developers for defect resolution - no extra charges for follow-up.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cost Comparison */}
      <section className="py-16 lg:py-20 bg-light-grey">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-black mb-4">
              Dubai Market Pricing Comparison
            </h2>
            <p className="text-lg text-text-grey max-w-2xl mx-auto">
              See how our snagging costs compare to potential savings and other market options.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-red-500 mb-2">AED 15,000+</div>
                  <h3 className="font-semibold text-brand-black mb-2">Cost of Missed Defects</h3>
                  <p className="text-text-grey text-sm">Average cost of major defects discovered after handover</p>
                </CardContent>
              </Card>
              
              <Card className="text-center border-2 border-brand-green">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-brand-green mb-2">AED 1,200-2,500</div>
                  <h3 className="font-semibold text-brand-black mb-2">UrbanGrid Snagging</h3>
                  <p className="text-text-grey text-sm">Comprehensive professional snagging service</p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-blue-500 mb-2">Peace of Mind</div>
                  <h3 className="font-semibold text-brand-black mb-2">Investment Protection</h3>
                  <p className="text-text-grey text-sm">Invaluable confidence in your property purchase</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-brand-green text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Get Your Dubai Snagging Quote Today
          </h2>
          <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
            Transparent pricing, professional service, exceptional value. Contact us for your personalized snagging cost estimate.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:+971585686852"
              className="inline-flex items-center bg-white text-brand-green px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
            >
              <i className="fas fa-phone mr-2"></i>
              Call for Quote: +971 58 568 6852
            </a>
            
            <a 
              href="https://wa.me/971585686852?text=Hello%20UrbanGrid%2C%20I%20need%20a%20quote%20for%20snagging%20services%20in%20Dubai.%20Please%20provide%20pricing%20details."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-transparent border-2 border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-brand-green transition-colors"
            >
              <i className="fab fa-whatsapp mr-2"></i>
              WhatsApp for Pricing
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}