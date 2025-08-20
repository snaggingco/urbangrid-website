
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import SEO from "@/components/SEO";

export default function PropertyInspectionCompaniesAbuDhabi() {
  return (
    <>
      <SEO 
        title="Property Inspection Companies Abu Dhabi - Top Rated Inspection Services"
        description="Find Abu Dhabi's best property inspection companies. UrbanGrid leads with luxury property expertise, RERA certification, and premium inspection services across all Abu Dhabi developments. Call +971585686852"
        keywords="property inspection companies abu dhabi, property inspection abu dhabi, abu dhabi property inspection companies, best property inspection company abu dhabi, property inspectors abu dhabi"
      />
      
      <div className="pt-16 lg:pt-20">
        {/* Hero Section */}
        <section className="py-16 lg:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl lg:text-5xl font-bold text-brand-black mb-6">
                Leading Property Inspection Companies in Abu Dhabi
              </h1>
              <p className="text-xl text-text-grey leading-relaxed mb-8">
                Discover Abu Dhabi's premier property inspection companies. UrbanGrid stands as the capital's #1 choice for luxury property inspections across Saadiyat Island, Yas Island, and Al Reem Island developments.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button className="bg-brand-green text-white hover:bg-opacity-90 px-8 py-3">
                    Get Premium Inspection Quote
                  </Button>
                </Link>
                <a 
                  href="tel:+971585686852"
                  className="inline-flex items-center bg-transparent border-2 border-brand-green text-brand-green px-8 py-3 rounded-md font-semibold hover:bg-brand-green hover:text-white transition-colors"
                >
                  <i className="fas fa-phone mr-2"></i>
                  Call Abu Dhabi's Best Company
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Rest of component similar to Dubai version but Abu Dhabi focused */}
        <section className="py-16 lg:py-20 bg-brand-green text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Choose Abu Dhabi's Most Trusted Property Inspection Company
            </h2>
            <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
              Trust UrbanGrid for premium property inspection services across Abu Dhabi's luxury developments and cultural districts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="bg-white text-brand-green hover:bg-gray-100 px-8 py-3">
                  Schedule Inspection
                </Button>
              </Link>
              <a 
                href="https://wa.me/971585686852?text=Hello! I need property inspection services in Abu Dhabi."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-transparent border-2 border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-brand-green transition-colors"
              >
                <i className="fab fa-whatsapp mr-2"></i>
                WhatsApp Abu Dhabi Team
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
