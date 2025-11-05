
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import SEO from "@/components/SEO";

export default function SnaggingCostAbuDhabi() {
  const pricingTiers = [
    {
      type: "Studio/1BR Apartment",
      size: "Up to 800 sq ft",
      price: "From AED 1,200",
      duration: "2-3 hours",
      features: ["Complete snagging inspection", "MEP systems check", "Interior finishes review", "Same-day report", "Developer liaison"]
    },
    {
      type: "2-3BR Apartment",
      size: "800-1,500 sq ft", 
      price: "From AED 1,800",
      duration: "3-4 hours",
      features: ["Comprehensive snagging", "Structural assessment", "All systems testing", "Quality benchmarking", "Premium reporting"],
      popular: true
    },
    {
      type: "Villa/Townhouse",
      size: "1,500+ sq ft",
      price: "From AED 3,500",
      duration: "4-6 hours", 
      features: ["Full villa snagging", "Exterior inspection", "Pool assessment", "Smart systems check", "Luxury reporting"]
    }
  ];

  return (
    <>
      <SEO 
        title="Snagging Cost Abu Dhabi - Transparent Property Snagging Prices"
        description="Clear snagging cost Abu Dhabi pricing. Professional property snagging services from AED 1,200. Transparent Abu Dhabi snagging company rates. Same-day reports. Call +971585686852"
        keywords="snagging cost abu dhabi, snagging abu dhabi cost, property snagging prices abu dhabi, abu dhabi snagging rates, snagging company abu dhabi prices"
      />
      
      <div className="pt-16 lg:pt-20">
        <section className="py-16 lg:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl lg:text-5xl font-bold text-brand-black mb-6">
                Snagging Cost Abu Dhabi: Transparent Property Snagging Pricing
              </h1>
              <p className="text-xl text-text-grey leading-relaxed mb-8">
                Get clear, upfront snagging cost in Abu Dhabi. Professional property snagging services across Saadiyat Island, Yas Island, Al Reem Island with transparent pricing and no hidden fees.
              </p>
              <div className="bg-brand-green text-white p-4 rounded-lg inline-block mb-8">
                <p className="text-lg font-semibold">From AED 1,200 | Transparent Pricing | Same-Day Reports</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button className="bg-brand-green text-white hover:bg-opacity-90 px-8 py-3">
                    Get Abu Dhabi Price Quote
                  </Button>
                </Link>
                <a 
                  href="tel:+971585686852"
                  className="inline-flex items-center bg-transparent border-2 border-brand-green text-brand-green px-8 py-3 rounded-md font-semibold hover:bg-brand-green hover:text-white transition-colors"
                >
                  <i className="fas fa-phone mr-2"></i>
                  Call for Abu Dhabi Pricing
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-20 bg-light-grey">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-12 text-center">
              Abu Dhabi Property Snagging Cost
            </h2>
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
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-20 bg-brand-green text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Get Your Abu Dhabi Snagging Cost Quote Today
            </h2>
            <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
              Transparent snagging cost Abu Dhabi with professional service and exceptional value. Contact us for personalized pricing.
            </p>
            <Link href="/contact">
              <Button className="bg-white text-brand-green hover:bg-gray-100 px-8 py-3">
                Request Abu Dhabi Quote
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
