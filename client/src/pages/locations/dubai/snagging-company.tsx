
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import SEO from "@/components/SEO";

export default function SnaggingCompanyDubai() {
  const services = [
    {
      title: "New Build Snagging Dubai",
      description: "Professional new build snagging services across Dubai's major developments",
      link: "/services/property-snagging/new-build-snagging",
      areas: ["Dubai Marina", "Downtown Dubai", "Business Bay", "JLT"]
    },
    {
      title: "Villa Snagging Dubai", 
      description: "Comprehensive villa snagging inspections in Dubai's premium communities",
      link: "/locations/dubai/villa-snagging",
      areas: ["Emirates Hills", "Arabian Ranches", "Dubai Hills", "Palm Jumeirah"]
    },
    {
      title: "Apartment Snagging Dubai",
      description: "Expert apartment snagging services for high-rise developments",
      link: "/locations/dubai/apartment-inspection", 
      areas: ["DIFC", "Dubai Creek Harbour", "City Walk", "Bluewaters"]
    }
  ];

  const whyChoosePoints = [
    {
      icon: "fas fa-award",
      title: "Dubai's #1 Snagging Company",
      description: "Over 15,000 properties inspected in Dubai with 98% client satisfaction rate"
    },
    {
      icon: "fas fa-clock",
      title: "Same-Day Reports",
      description: "Complete snagging reports delivered within 24 hours of inspection"
    },
    {
      icon: "fas fa-shield-alt", 
      title: "RERA Licensed & Insured",
      description: "Fully licensed by Dubai authorities with comprehensive insurance coverage"
    },
    {
      icon: "fas fa-handshake",
      title: "Developer Relationships",
      description: "Established partnerships with Emaar, DAMAC, Nakheel for efficient resolution"
    }
  ];

  return (
    <>
      <SEO 
        title="Snagging Company Dubai - #1 Property Snagging Services | UrbanGrid"
        description="Dubai's leading snagging company providing professional property snagging services. Expert villa & apartment snagging across Dubai Marina, Downtown, Business Bay. Call +971585686852"
        keywords="snagging company dubai, property snagging dubai, snagging services dubai, dubai snagging company, villa snagging dubai, apartment snagging dubai"
      />
      
      <div className="pt-16 lg:pt-20">
        {/* Hero Section */}
        <section className="py-16 lg:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl lg:text-5xl font-bold text-brand-black mb-6">
                Dubai's Leading Snagging Company
              </h1>
              <p className="text-xl text-text-grey leading-relaxed mb-8">
                UrbanGrid is Dubai's most trusted snagging company, providing comprehensive property snagging services across all major developments. From luxury villas to high-rise apartments, we protect your investment with professional snagging inspections.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button className="bg-brand-green text-white hover:bg-opacity-90 px-8 py-3">
                    Get Free Snagging Quote
                  </Button>
                </Link>
                <a 
                  href="tel:+971585686852"
                  className="inline-flex items-center bg-transparent border-2 border-brand-green text-brand-green px-8 py-3 rounded-md font-semibold hover:bg-brand-green hover:text-white transition-colors"
                >
                  <i className="fas fa-phone mr-2"></i>
                  Call Dubai's Best Snagging Company
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Our Snagging Company */}
        <section className="py-16 lg:py-20 bg-light-grey">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-12 text-center">
              Why Choose UrbanGrid Snagging Company Dubai?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {whyChoosePoints.map((point, index) => (
                <Card key={index} className="bg-white text-center hover:shadow-lg transition-all duration-300">
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

        {/* Snagging Services */}
        <section className="py-16 lg:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-12 text-center">
              Professional Snagging Services in Dubai
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <Card key={index} className="bg-white hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-brand-black mb-4">{service.title}</h3>
                    <p className="text-text-grey mb-4">{service.description}</p>
                    <div className="mb-4">
                      <h4 className="font-medium text-brand-black mb-2">Popular Areas:</h4>
                      <div className="flex flex-wrap gap-2">
                        {service.areas.map((area, i) => (
                          <span key={i} className="bg-brand-green text-white px-2 py-1 rounded text-xs">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Link href={service.link}>
                      <Button variant="outline" className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white w-full">
                        Learn More
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Company Credentials */}
        <section className="py-16 lg:py-20 bg-light-grey">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-8">
                Dubai's Most Trusted Snagging Company
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="text-3xl font-bold text-brand-green mb-2">15,000+</div>
                  <div className="text-text-grey">Properties Snagged in Dubai</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="text-3xl font-bold text-brand-green mb-2">98%</div>
                  <div className="text-text-grey">Client Satisfaction Rate</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="text-3xl font-bold text-brand-green mb-2">24hr</div>
                  <div className="text-text-grey">Report Delivery Time</div>
                </div>
              </div>
              <p className="text-lg text-text-grey leading-relaxed">
                As Dubai's premier snagging company, UrbanGrid has established itself as the industry leader through consistent quality, professionalism, and results. Our team of certified inspectors understands Dubai's unique construction challenges and developer standards.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 lg:py-20 bg-light-grey">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-12 text-center">
              Frequently Asked Questions - Snagging Company Dubai
            </h2>
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-brand-black mb-3">What makes UrbanGrid the best snagging company in Dubai?</h3>
                <p className="text-text-grey">UrbanGrid is Dubai's leading snagging company with 15,000+ properties inspected, RERA certification, same-day reports, and established relationships with major developers like Emaar, DAMAC, and Nakheel for efficient issue resolution.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-brand-black mb-3">How much does snagging cost in Dubai?</h3>
                <p className="text-text-grey">Dubai snagging costs vary by property type: apartments from AED 1,200, villas from AED 2,800, and commercial properties from AED 3,500. All inspections include comprehensive reports and developer communication.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-brand-black mb-3">Which Dubai areas do you cover for snagging services?</h3>
                <p className="text-text-grey">We provide snagging services across all Dubai areas including Dubai Marina, Downtown Dubai, Business Bay, JLT, Palm Jumeirah, Emirates Hills, Arabian Ranches, Dubai Hills, and all other major developments.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-brand-black mb-3">How long does the snagging process take in Dubai?</h3>
                <p className="text-text-grey">Dubai snagging inspections typically take 3-6 hours depending on property size. We deliver comprehensive reports within 24 hours and coordinate with developers for defect rectification.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Dubai Areas Coverage */}
        <section className="py-16 lg:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-12 text-center">
              Dubai Snagging Company Coverage Areas
            </h2>
            <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                "Dubai Marina", "Downtown Dubai", "Business Bay", "JLT", "DIFC", "Palm Jumeirah",
                "Emirates Hills", "Arabian Ranches", "Dubai Hills", "JBR", "City Walk", "Dubai Creek Harbour",
                "Dubai South", "Al Furjan", "Motor City", "Sports City", "Studio City", "Media City",
                "Internet City", "Knowledge Village", "Academic City", "International City", "Dragon City", "Silicon Oasis"
              ].map((area, index) => (
                <div key={index} className="bg-light-grey p-3 rounded text-center text-sm font-medium hover:bg-brand-green hover:text-white transition-colors">
                  {area}
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <p className="text-text-grey">
                <strong>24/7 Emergency Snagging Services Available</strong> - Covering all Dubai communities and developments
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-20 bg-brand-green text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Work with Dubai's Best Snagging Company?
            </h2>
            <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
              Join thousands of satisfied clients who trust UrbanGrid for professional property snagging in Dubai. Get your free consultation today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="bg-white text-brand-green hover:bg-gray-100 px-8 py-3">
                  Get Free Consultation
                </Button>
              </Link>
              <a 
                href="https://wa.me/971585686852?text=Hello! I need professional snagging services in Dubai."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-transparent border-2 border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-brand-green transition-colors"
              >
                <i className="fab fa-whatsapp mr-2"></i>
                WhatsApp Dubai's #1 Snagging Company
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
