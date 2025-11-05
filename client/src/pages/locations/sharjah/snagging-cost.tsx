
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import SEO from "@/components/SEO";

export default function SnaggingCostSharjah() {
  return (
    <>
      <SEO 
        title="Snagging Cost Sharjah - Affordable Property Snagging Prices"
        description="Competitive snagging cost Sharjah pricing. Professional property snagging services from AED 1,000. Transparent Sharjah snagging company rates. Family-friendly pricing. Call +971585686852"
        keywords="snagging cost sharjah, snagging sharjah cost, property snagging prices sharjah, sharjah snagging rates, snagging company sharjah prices"
      />
      
      <div className="pt-16 lg:pt-20">
        <section className="py-16 lg:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl lg:text-5xl font-bold text-brand-black mb-6">
                Snagging Cost Sharjah: Affordable Property Snagging Pricing
              </h1>
              <p className="text-xl text-text-grey leading-relaxed mb-8">
                Get competitive snagging cost in Sharjah. Professional property snagging services across Al Zahia, Aljada, University City with family-friendly pricing and transparent rates.
              </p>
              <div className="bg-brand-green text-white p-4 rounded-lg inline-block mb-8">
                <p className="text-lg font-semibold">From AED 1,000 | Family-Friendly Pricing | Same-Day Reports</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button className="bg-brand-green text-white hover:bg-opacity-90 px-8 py-3">
                    Get Sharjah Price Quote
                  </Button>
                </Link>
                <a 
                  href="tel:+971585686852"
                  className="inline-flex items-center bg-transparent border-2 border-brand-green text-brand-green px-8 py-3 rounded-md font-semibold hover:bg-brand-green hover:text-white transition-colors"
                >
                  <i className="fas fa-phone mr-2"></i>
                  Call for Sharjah Pricing
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-20 bg-brand-green text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Get Your Sharjah Snagging Cost Quote Today
            </h2>
            <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
              Affordable snagging cost Sharjah with professional quality. Contact us for family-friendly pricing.
            </p>
            <Link href="/contact">
              <Button className="bg-white text-brand-green hover:bg-gray-100 px-8 py-3">
                Request Sharjah Quote
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
