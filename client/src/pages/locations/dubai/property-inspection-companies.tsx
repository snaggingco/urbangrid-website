
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import SEO from "@/components/SEO";

export default function PropertyInspectionCompaniesDubai() {
  const companies = [
    {
      name: "UrbanGrid Property Inspection",
      description: "Dubai's #1 property inspection company with 15,000+ properties inspected",
      specialties: ["New Build Snagging", "Villa Inspection", "Apartment Snagging", "Commercial Inspection"],
      rating: "4.9/5",
      experience: "10+ Years",
      coverage: "All Dubai Areas"
    }
  ];

  const whyChoose = [
    {
      title: "Licensed & Certified",
      description: "RERA licensed property inspection company in Dubai",
      icon: "fas fa-certificate"
    },
    {
      title: "Same-Day Reports", 
      description: "Comprehensive inspection reports delivered within 24 hours",
      icon: "fas fa-clock"
    },
    {
      title: "15,000+ Properties",
      description: "Extensive experience across all Dubai developments",
      icon: "fas fa-building"
    },
    {
      title: "Expert Team",
      description: "Certified inspectors with local Dubai market expertise",
      icon: "fas fa-users"
    }
  ];

  return (
    <>
      <SEO 
        title="Property Inspection Companies Dubai - Top Rated Inspection Services"
        description="Find Dubai's best property inspection companies. UrbanGrid leads with 15,000+ inspected properties, RERA certification, and same-day reports across all Dubai areas. Call +971585686852"
        keywords="property inspection companies in dubai, property inspection dubai, dubai property inspection companies, best property inspection company dubai, property inspectors dubai"
      />
      
      <div className="pt-16 lg:pt-20">
        {/* Hero Section */}
        <section className="py-16 lg:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl lg:text-5xl font-bold text-brand-black mb-6">
                Top Property Inspection Companies in Dubai
              </h1>
              <p className="text-xl text-text-grey leading-relaxed mb-8">
                Compare Dubai's leading property inspection companies. UrbanGrid stands out as the #1 choice for comprehensive property inspections across Dubai, with unmatched expertise and client satisfaction.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button className="bg-brand-green text-white hover:bg-opacity-90 px-8 py-3">
                    Get Free Inspection Quote
                  </Button>
                </Link>
                <a 
                  href="tel:+971585686852"
                  className="inline-flex items-center bg-transparent border-2 border-brand-green text-brand-green px-8 py-3 rounded-md font-semibold hover:bg-brand-green hover:text-white transition-colors"
                >
                  <i className="fas fa-phone mr-2"></i>
                  Call Dubai's Best Inspection Company
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Company Comparison */}
        <section className="py-16 lg:py-20 bg-light-grey">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-12 text-center">
              Leading Property Inspection Company in Dubai
            </h2>
            <div className="max-w-4xl mx-auto">
              {companies.map((company, index) => (
                <Card key={index} className="bg-white shadow-lg mb-8">
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-2xl font-bold text-brand-black mb-4">{company.name}</h3>
                        <p className="text-text-grey mb-4">{company.description}</p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Rating:</span> {company.rating}
                          </div>
                          <div>
                            <span className="font-medium">Experience:</span> {company.experience}
                          </div>
                          <div>
                            <span className="font-medium">Coverage:</span> {company.coverage}
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Specialization Areas:</h4>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {company.specialties.map((specialty, i) => (
                            <span key={i} className="bg-brand-green text-white px-3 py-1 rounded text-sm">
                              {specialty}
                            </span>
                          ))}
                        </div>
                        <Link href="/contact">
                          <Button className="bg-brand-green text-white hover:bg-opacity-90 w-full">
                            Choose This Company
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Section */}
        <section className="py-16 lg:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-12 text-center">
              Why UrbanGrid is Dubai's #1 Property Inspection Company
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {whyChoose.map((point, index) => (
                <Card key={index} className="bg-light-grey text-center hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <i className={`${point.icon} text-3xl text-brand-green mb-4`}></i>
                    <h3 className="text-lg font-semibold text-brand-black mb-3">{point.title}</h3>
                    <p className="text-text-grey text-sm">{point.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-20 bg-brand-green text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Work with Dubai's Top Property Inspection Company?
            </h2>
            <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
              Join thousands who trust UrbanGrid for professional property inspections in Dubai. Get your expert assessment today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="bg-white text-brand-green hover:bg-gray-100 px-8 py-3">
                  Get Free Consultation
                </Button>
              </Link>
              <a 
                href="https://wa.me/971585686852?text=Hello! I need property inspection services in Dubai."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-transparent border-2 border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-brand-green transition-colors"
              >
                <i className="fab fa-whatsapp mr-2"></i>
                WhatsApp Dubai's Top Company
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
