import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import SEO from "@/components/SEO";

export default function SnaggingCompanyAbuDhabi() {
  useEffect(() => {
    const localBusinessSchema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": "https://urbangrid.ae/locations/abu-dhabi/snagging-company",
      "name": "UrbanGrid Snagging Company Abu Dhabi",
      "description": "Abu Dhabi's premier snagging company specializing in luxury property inspections on Saadiyat Island, Yas Island, and Al Reem Island.",
      "url": "https://urbangrid.ae/locations/abu-dhabi/snagging-company",
      "telephone": "+971585686852",
      "email": "info@snagging.me",
      "priceRange": "AED 1,500 - AED 4,000",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Abu Dhabi",
        "addressRegion": "Abu Dhabi",
        "addressCountry": "AE"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "24.4539",
        "longitude": "54.3773"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "85",
        "bestRating": "5"
      },
      "areaServed": [
        "Saadiyat Island", "Yas Island", "Al Reem Island", "Al Maryah Island",
        "Al Reef", "Al Ghadeer", "Bloom Gardens", "Corniche Area", "Al Raha Beach"
      ]
    };

    const serviceSchema = {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Property Snagging Services Abu Dhabi",
      "provider": {
        "@type": "LocalBusiness",
        "name": "UrbanGrid Snagging Company Abu Dhabi"
      },
      "serviceType": "Property Snagging",
      "areaServed": {
        "@type": "City",
        "name": "Abu Dhabi",
        "addressCountry": "AE"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Abu Dhabi Snagging Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Luxury Property Snagging Abu Dhabi",
              "description": "Premium snagging for high-end developments on Saadiyat and Yas Island"
            },
            "price": "1500",
            "priceCurrency": "AED"
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Villa Snagging Abu Dhabi",
              "description": "Comprehensive villa inspections in Abu Dhabi's exclusive communities"
            },
            "price": "3000",
            "priceCurrency": "AED"
          }
        ]
      }
    };

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What areas in Abu Dhabi do you cover for snagging?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We cover all Abu Dhabi areas including Saadiyat Island, Yas Island, Al Reem Island, Al Maryah Island, Al Reef, Al Ghadeer, Bloom Gardens, Corniche Area, Al Raha Beach, Masdar City, and Khalifa City."
          }
        },
        {
          "@type": "Question",
          "name": "How much does snagging cost in Abu Dhabi?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Abu Dhabi snagging prices start from AED 1,500 for apartments. Luxury villa snagging on Saadiyat and Yas Island starts from AED 3,000. All prices include comprehensive inspection and detailed digital report."
          }
        },
        {
          "@type": "Question",
          "name": "Do you specialize in luxury property snagging?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, UrbanGrid specializes in luxury property snagging across Abu Dhabi's premium developments including Saadiyat Island cultural district, Yas Island waterfront properties, and Al Reem Island high-rises."
          }
        }
      ]
    };

    const existingSchemas = document.querySelectorAll('[data-abudhabi-snagging-schema]');
    existingSchemas.forEach(el => el.remove());

    [localBusinessSchema, serviceSchema, faqSchema].forEach((schema) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-abudhabi-snagging-schema', 'true');
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    });

    return () => {
      const schemas = document.querySelectorAll('[data-abudhabi-snagging-schema]');
      schemas.forEach(el => el.remove());
    };
  }, []);
  const services = [
    {
      title: "Luxury Property Snagging Abu Dhabi",
      description: "Premium snagging services for high-end developments on Saadiyat and Yas Island",
      link: "/services/property-snagging/new-build-snagging",
      areas: ["Saadiyat Island", "Yas Island", "Al Reem Island", "Al Maryah Island"]
    },
    {
      title: "Villa Snagging Abu Dhabi",
      description: "Comprehensive villa inspections in Abu Dhabi's exclusive communities",
      link: "/locations/abu-dhabi/villa-snagging",
      areas: ["Al Reef", "Al Ghadeer", "Bloom Gardens", "Shams Abu Dhabi"]
    },
    {
      title: "Apartment Snagging Abu Dhabi",
      description: "Expert apartment snagging for luxury residential towers",
      link: "/locations/abu-dhabi/apartment-inspection",
      areas: ["Corniche Area", "Al Raha Beach", "Masdar City", "Khalifa City"]
    }
  ];

  return (
    <>
      <SEO
        title="Snagging Company Abu Dhabi - Professional Property Snagging | UrbanGrid"
        description="Abu Dhabi's premier snagging company offering expert property snagging services. Luxury villa & apartment snagging on Saadiyat Island, Yas Island, Al Reem Island. Call +971585686852"
        keywords="snagging company abu dhabi, property snagging abu dhabi, abu dhabi snagging services, villa snagging abu dhabi, apartment snagging abu dhabi, luxury property snagging"
      />

      <div className="pt-16 lg:pt-20">
        {/* Hero Section */}
        <section className="py-16 lg:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl lg:text-5xl font-bold text-brand-black mb-6">
                Snagging Company Abu Dhabi - #1 Property Snagging Services
              </h1>
              <p className="text-xl text-text-grey leading-relaxed mb-8">
                UrbanGrid is Abu Dhabi's leading snagging company, providing professional property snagging services across all Abu Dhabi developments. As the most trusted snagging company in Abu Dhabi, we specialize in luxury property inspections from Saadiyat Island to Yas Island, Al Reem Island, and beyond. Expert property snagging Abu Dhabi services ensuring your capital investment meets the highest standards.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button className="bg-brand-green text-white hover:bg-opacity-90 px-8 py-3">
                    Get Abu Dhabi Snagging Quote
                  </Button>
                </Link>
                <a
                  href="tel:+971585686852"
                  className="inline-flex items-center bg-transparent border-2 border-brand-green text-brand-green px-8 py-3 rounded-md font-semibold hover:bg-brand-green hover:text-white transition-colors"
                >
                  <i className="fas fa-phone mr-2"></i>
                  Call Abu Dhabi Snagging Experts
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16 lg:py-20 bg-light-grey">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-12 text-center">
              Professional Snagging Services Abu Dhabi
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <Card key={index} className="bg-white hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-brand-black mb-4">{service.title}</h3>
                    <p className="text-text-grey mb-4">{service.description}</p>
                    <div className="mb-4">
                      <h4 className="font-medium text-brand-black mb-2">Key Areas:</h4>
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

        {/* Why Choose Section */}
        <section className="py-16 lg:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-8">
                Why UrbanGrid is Abu Dhabi's #1 Snagging Company
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="text-left">
                  <h3 className="text-xl font-semibold text-brand-black mb-4">Luxury Development Expertise</h3>
                  <p className="text-text-grey leading-relaxed">
                    Specialized knowledge of Abu Dhabi's premium developments including Saadiyat Island's cultural district, Yas Island's entertainment complexes, and Al Reem Island's luxury towers.
                  </p>
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-semibold text-brand-black mb-4">Government Approved</h3>
                  <p className="text-text-grey leading-relaxed">
                    Fully licensed by Abu Dhabi authorities with deep understanding of local building codes, sustainability requirements, and luxury finishing standards.
                  </p>
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-semibold text-brand-black mb-4">Developer Partnerships</h3>
                  <p className="text-text-grey leading-relaxed">
                    Strong relationships with major Abu Dhabi developers including Aldar Properties, Bloom Properties, and Sorouh for efficient issue resolution.
                  </p>
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-semibold text-brand-black mb-4">24-Hour Service</h3>
                  <p className="text-text-grey leading-relaxed">
                    Rapid response times for urgent inspections across Abu Dhabi with same-day comprehensive reports delivered electronically.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-20 bg-brand-green text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Choose Abu Dhabi's Most Trusted Snagging Company
            </h2>
            <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
              Protect your luxury property investment in Abu Dhabi with professional snagging services from the capital's leading inspection company.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="bg-white text-brand-green hover:bg-gray-100 px-8 py-3">
                  Schedule Abu Dhabi Inspection
                </Button>
              </Link>
              <a
                href="https://wa.me/971585686852?text=Hello! I need professional snagging services in Abu Dhabi."
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