
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import SEO from "@/components/SEO";

export default function SnaggingCompanyDubai() {
  useEffect(() => {
    const localBusinessSchema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": "https://urbangrid.ae/locations/dubai/snagging-company",
      "name": "UrbanGrid Snagging Company Dubai",
      "description": "Dubai's #1 rated snagging company with 15,000+ properties inspected. RERA certified, same-day reports, 98% satisfaction rate.",
      "url": "https://urbangrid.ae/locations/dubai/snagging-company",
      "telephone": "+971585686852",
      "email": "info@snagging.me",
      "priceRange": "AED 1,200 - AED 3,500",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Dubai",
        "addressRegion": "Dubai",
        "addressCountry": "AE"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "25.2048",
        "longitude": "55.2708"
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "08:00",
        "closes": "20:00"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "200",
        "bestRating": "5"
      },
      "areaServed": [
        "Dubai Marina", "Downtown Dubai", "Business Bay", "JLT", "DIFC", "Palm Jumeirah",
        "Emirates Hills", "Arabian Ranches", "Dubai Hills", "JBR", "City Walk", "Dubai Creek Harbour"
      ]
    };

    const serviceSchema = {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Property Snagging Services Dubai",
      "provider": {
        "@type": "LocalBusiness",
        "name": "UrbanGrid Snagging Company Dubai"
      },
      "serviceType": "Property Snagging",
      "areaServed": {
        "@type": "City",
        "name": "Dubai",
        "addressCountry": "AE"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Dubai Snagging Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Apartment Snagging Dubai",
              "description": "Professional apartment snagging for high-rise developments"
            },
            "price": "1200",
            "priceCurrency": "AED"
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Villa Snagging Dubai",
              "description": "Comprehensive villa snagging for premium communities"
            },
            "price": "2800",
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
          "name": "What makes UrbanGrid the best snagging company in Dubai?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "UrbanGrid is Dubai's most experienced snagging company with 15,000+ properties inspected. We are RERA licensed and InterNachi certified, with established relationships with major developers including Emaar, DAMAC, Nakheel, Meraas, and Sobha."
          }
        },
        {
          "@type": "Question",
          "name": "How much does property snagging cost in Dubai?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Dubai snagging prices start from AED 1,200 for apartments under 1,000 sqft. Larger apartments range from AED 1,500-2,500, while villa snagging starts from AED 2,800. All prices include comprehensive inspection, digital report, and developer defect letter."
          }
        },
        {
          "@type": "Question",
          "name": "Which Dubai areas do you cover for snagging services?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We provide snagging services across all Dubai areas including Dubai Marina, Downtown Dubai, Business Bay, JLT, DIFC, Palm Jumeirah, Emirates Hills, Arabian Ranches, Dubai Hills Estate, JBR, City Walk, Dubai Creek Harbour, and all other developments."
          }
        },
        {
          "@type": "Question",
          "name": "How long does a snagging inspection take?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A typical Dubai apartment snagging inspection takes 2-4 hours depending on size. Villa snagging takes 4-8 hours for comprehensive assessment. Reports are delivered within 24 hours."
          }
        },
        {
          "@type": "Question",
          "name": "When should I book snagging for my Dubai property?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Book snagging as soon as you receive your handover notification from the developer. Ideally, inspection should happen before you sign the handover completion certificate."
          }
        },
        {
          "@type": "Question",
          "name": "Is snagging mandatory in Dubai?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "While not legally mandatory, snagging is highly recommended before accepting any new property in Dubai. It protects your investment and gives you documented evidence for warranty claims during the Defect Liability Period."
          }
        }
      ]
    };

    const existingSchemas = document.querySelectorAll('[data-dubai-snagging-schema]');
    existingSchemas.forEach(el => el.remove());

    [localBusinessSchema, serviceSchema, faqSchema].forEach((schema, index) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-dubai-snagging-schema', 'true');
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    });

    return () => {
      const schemas = document.querySelectorAll('[data-dubai-snagging-schema]');
      schemas.forEach(el => el.remove());
    };
  }, []);
  const services = [
    {
      title: "New Build Snagging Dubai",
      description: "Professional new build snagging services across Dubai's major developments. We inspect properties before handover to identify defects and ensure developer compliance.",
      link: "/services/property-snagging/new-build-snagging",
      areas: ["Dubai Marina", "Downtown Dubai", "Business Bay", "JLT"],
      price: "From AED 1,200"
    },
    {
      title: "Villa Snagging Dubai", 
      description: "Comprehensive villa snagging inspections in Dubai's premium communities. Our certified inspectors examine every aspect of your luxury property.",
      link: "/locations/dubai/villa-snagging",
      areas: ["Emirates Hills", "Arabian Ranches", "Dubai Hills", "Palm Jumeirah"],
      price: "From AED 2,800"
    },
    {
      title: "Apartment Snagging Dubai",
      description: "Expert apartment snagging services for high-rise developments. We protect your investment with detailed inspection reports.",
      link: "/locations/dubai/apartment-inspection", 
      areas: ["DIFC", "Dubai Creek Harbour", "City Walk", "Bluewaters"],
      price: "From AED 1,200"
    },
    {
      title: "DLP Snagging Dubai",
      description: "Defect Liability Period inspections before your warranty expires. Maximize your claim potential with our expert assessment.",
      link: "/locations/dubai/dlp-snagging", 
      areas: ["All Dubai Areas"],
      price: "From AED 1,500"
    }
  ];

  const whyChoosePoints = [
    {
      icon: "fas fa-award",
      title: "Dubai's Most Experienced Team",
      description: "15,000+ properties inspected with an average of 85 defects identified per property. Our experience means nothing is missed."
    },
    {
      icon: "fas fa-clock",
      title: "Same-Day Reports Guaranteed",
      description: "Comprehensive digital reports with photos delivered within 24 hours. Emergency same-day service available."
    },
    {
      icon: "fas fa-shield-alt", 
      title: "RERA Licensed & InterNachi Certified",
      description: "Fully licensed by Dubai authorities and internationally certified. Your inspection is legally recognized."
    },
    {
      icon: "fas fa-handshake",
      title: "Direct Developer Relationships",
      description: "Established partnerships with Emaar, DAMAC, Nakheel, Meraas, and Sobha for fast defect resolution."
    }
  ];

  const testimonials = [
    {
      name: "Ahmed K.",
      location: "Dubai Marina",
      property: "3BR Apartment",
      text: "UrbanGrid found 127 defects in my new apartment that I would have never noticed. The developer fixed everything before handover. Worth every dirham!",
      rating: 5
    },
    {
      name: "Sarah M.",
      location: "Arabian Ranches 3",
      property: "Villa",
      text: "As an overseas investor, I couldn't be there for handover. UrbanGrid represented my interests perfectly and saved me from accepting a property with major issues.",
      rating: 5
    },
    {
      name: "James R.",
      location: "Downtown Dubai",
      property: "2BR Apartment",
      text: "The report was incredibly detailed with photos of every defect. The developer couldn't argue with the evidence. Highly recommend this snagging company.",
      rating: 5
    }
  ];

  const pricingTiers = [
    {
      type: "Apartment (Under 1,000 sqft)",
      price: "AED 1,200",
      includes: ["Full property inspection", "Digital report with photos", "Developer defect letter", "WhatsApp support"]
    },
    {
      type: "Apartment (1,000-2,000 sqft)",
      price: "AED 1,800",
      includes: ["Full property inspection", "Digital report with photos", "Developer defect letter", "Re-inspection coordination"]
    },
    {
      type: "Villa (Up to 4,000 sqft)",
      price: "AED 2,800",
      includes: ["Comprehensive villa inspection", "MEP systems check", "Pool & landscaping review", "Developer liaison"]
    },
    {
      type: "Villa (4,000+ sqft)",
      price: "AED 3,500+",
      includes: ["Full villa & external areas", "Smart home systems check", "Priority re-inspection", "Direct developer meetings"]
    }
  ];

  const faqItems = [
    {
      question: "What makes UrbanGrid the best snagging company in Dubai?",
      answer: "UrbanGrid is Dubai's most experienced snagging company with 15,000+ properties inspected. We are RERA licensed and InterNachi certified, with established relationships with major developers including Emaar, DAMAC, Nakheel, Meraas, and Sobha. Our inspectors identify an average of 85 defects per property, and we provide same-day digital reports with photographic evidence."
    },
    {
      question: "How much does property snagging cost in Dubai?",
      answer: "Dubai snagging prices start from AED 1,200 for apartments under 1,000 sqft. Larger apartments range from AED 1,500-2,500, while villa snagging starts from AED 2,800. Prices include comprehensive inspection, digital report with photos, defect letter to developer, and WhatsApp support. We offer competitive rates compared to other snagging companies in Dubai."
    },
    {
      question: "Which Dubai areas do you cover for snagging services?",
      answer: "We provide snagging services across all Dubai areas including Dubai Marina, Downtown Dubai, Business Bay, JLT, DIFC, Palm Jumeirah, Emirates Hills, Arabian Ranches 1-3, Dubai Hills Estate, JBR, City Walk, Dubai Creek Harbour, Dubai South, Al Furjan, Motor City, Sports City, Studio City, Meydan, MBR City, and all other developments."
    },
    {
      question: "How long does a snagging inspection take?",
      answer: "A typical Dubai apartment snagging inspection takes 2-4 hours depending on size. Villa snagging takes 4-8 hours for comprehensive assessment. We inspect every aspect including walls, flooring, fixtures, MEP systems, windows, doors, balconies, and external areas. Reports are delivered within 24 hours."
    },
    {
      question: "When should I book snagging for my Dubai property?",
      answer: "Book snagging as soon as you receive your handover notification from the developer. Ideally, inspection should happen before you sign the handover completion certificate. We can often accommodate same-day or next-day bookings for urgent requirements."
    },
    {
      question: "What happens after the snagging inspection?",
      answer: "After inspection, you receive a detailed digital report with photos of all defects. We prepare a formal defect letter for the developer and can attend the developer meeting with you if needed. We also offer re-inspection services to verify all defects have been properly rectified."
    },
    {
      question: "Do you inspect properties from all Dubai developers?",
      answer: "Yes, we inspect properties from all Dubai developers including Emaar, DAMAC, Nakheel, Meraas, Sobha, Dubai Properties, Azizi, Danube, MAG, Ellington, and all other developers. Our inspectors are familiar with each developer's construction standards and common issues."
    },
    {
      question: "Is snagging mandatory in Dubai?",
      answer: "While not legally mandatory, snagging is highly recommended before accepting any new property in Dubai. It protects your investment, ensures the developer delivers what was promised, and gives you documented evidence for warranty claims during the Defect Liability Period (DLP)."
    }
  ];

  return (
    <>
      <SEO 
        title="Best Snagging Company Dubai | 15,000+ Properties Inspected | UrbanGrid"
        description="Dubai's #1 rated snagging company with 15,000+ properties inspected. RERA certified, same-day reports, 98% satisfaction. Villa & apartment snagging from AED 1,200. Call +971585686852"
        keywords="snagging company dubai, best snagging company dubai, property snagging dubai, snagging services dubai, villa snagging dubai, apartment snagging dubai, RERA certified snagging"
      />
      
      <div className="pt-16 lg:pt-20">
        {/* Hero Section */}
        <section className="py-16 lg:py-24 bg-gradient-to-br from-brand-green to-emerald-800 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center bg-white/20 rounded-full px-4 py-2 mb-6">
                <i className="fas fa-star text-yellow-400 mr-2"></i>
                <span className="text-sm font-medium">Rated 4.9/5 from 200+ Google Reviews</span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Dubai's #1 Snagging Company
              </h1>
              <p className="text-xl lg:text-2xl leading-relaxed mb-8 text-green-100">
                15,000+ properties inspected. RERA licensed. Same-day reports. 
                Trusted by Dubai's smartest property buyers since 2015.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link href="/contact">
                  <Button className="bg-white text-brand-green hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                    Get Free Quote
                  </Button>
                </Link>
                <a 
                  href="tel:+971585686852"
                  className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white px-8 py-4 rounded-md font-semibold hover:bg-white hover:text-brand-green transition-colors text-lg"
                >
                  <i className="fas fa-phone mr-2"></i>
                  +971 58 568 6852
                </a>
              </div>
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                <div className="flex items-center">
                  <i className="fas fa-check-circle mr-2 text-green-300"></i>
                  <span>RERA Licensed</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-check-circle mr-2 text-green-300"></i>
                  <span>InterNachi Certified</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-check-circle mr-2 text-green-300"></i>
                  <span>Same-Day Reports</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-white border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-brand-green mb-2">15,000+</div>
                <div className="text-text-grey">Properties Inspected</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-brand-green mb-2">98%</div>
                <div className="text-text-grey">Client Satisfaction</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-brand-green mb-2">85</div>
                <div className="text-text-grey">Avg Defects Found</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-brand-green mb-2">24hr</div>
                <div className="text-text-grey">Report Delivery</div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Section */}
        <section className="py-16 lg:py-20 bg-light-grey">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-4">
                Why Choose UrbanGrid as Your Snagging Company in Dubai?
              </h2>
              <p className="text-lg text-text-grey max-w-3xl mx-auto">
                When it comes to protecting your property investment in Dubai, experience matters. 
                Here's why thousands of property buyers trust UrbanGrid.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {whyChoosePoints.map((point, index) => (
                <Card key={index} className="bg-white text-center hover:shadow-lg transition-all duration-300 border-0">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className={`${point.icon} text-2xl text-brand-green`}></i>
                    </div>
                    <h3 className="text-lg font-semibold text-brand-black mb-3">{point.title}</h3>
                    <p className="text-text-grey text-sm">{point.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Snagging Services & Pricing */}
        <section className="py-16 lg:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-4">
                Dubai Snagging Services & Pricing
              </h2>
              <p className="text-lg text-text-grey max-w-3xl mx-auto">
                Transparent pricing with no hidden fees. All inspections include comprehensive digital reports, 
                photo documentation, and developer defect letters.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {pricingTiers.map((tier, index) => (
                <Card key={index} className="bg-white hover:shadow-xl transition-all duration-300 border-2 hover:border-brand-green">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-brand-black mb-2">{tier.type}</h3>
                    <div className="text-3xl font-bold text-brand-green mb-4">{tier.price}</div>
                    <ul className="space-y-2 mb-6">
                      {tier.includes.map((item, i) => (
                        <li key={i} className="flex items-start text-sm text-text-grey">
                          <i className="fas fa-check text-brand-green mr-2 mt-1 text-xs"></i>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Link href="/contact">
                      <Button variant="outline" className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white w-full">
                        Book Now
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Service Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, index) => (
                <Card key={index} className="bg-light-grey hover:shadow-lg transition-all duration-300 border-0">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-brand-black mb-3">{service.title}</h3>
                    <p className="text-text-grey text-sm mb-4">{service.description}</p>
                    <div className="mb-4">
                      <div className="text-brand-green font-semibold mb-2">{service.price}</div>
                      <div className="flex flex-wrap gap-1">
                        {service.areas.map((area, i) => (
                          <span key={i} className="bg-white text-text-grey px-2 py-1 rounded text-xs border">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Link href={service.link}>
                      <Button variant="link" className="text-brand-green p-0 h-auto font-semibold">
                        Learn More <i className="fas fa-arrow-right ml-2"></i>
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 lg:py-20 bg-brand-green text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                What Dubai Property Buyers Say About Us
              </h2>
              <p className="text-lg text-green-100 max-w-3xl mx-auto">
                Don't just take our word for it. Here's what our clients have to say about their snagging experience.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-white/10 backdrop-blur border-0">
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <i key={i} className="fas fa-star text-yellow-400 mr-1"></i>
                      ))}
                    </div>
                    <p className="text-green-50 mb-4 italic">"{testimonial.text}"</p>
                    <div className="border-t border-white/20 pt-4">
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-green-200 text-sm">{testimonial.property} - {testimonial.location}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Dubai Areas Coverage */}
        <section className="py-16 lg:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-4">
                Snagging Services Across All Dubai Communities
              </h2>
              <p className="text-lg text-text-grey max-w-3xl mx-auto">
                From luxury waterfront developments to family-friendly communities, we provide professional 
                snagging services throughout Dubai.
              </p>
            </div>
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {[
                  "Dubai Marina", "Downtown Dubai", "Business Bay", "JLT", "DIFC", "Palm Jumeirah",
                  "Emirates Hills", "Arabian Ranches", "Dubai Hills", "JBR", "City Walk", "Creek Harbour",
                  "Dubai South", "Al Furjan", "Motor City", "Sports City", "Studio City", "MBR City",
                  "Meydan", "Al Barsha", "Jumeirah", "Umm Suqeim", "Silicon Oasis", "International City"
                ].map((area, index) => (
                  <div key={index} className="bg-light-grey p-3 rounded text-center text-sm font-medium hover:bg-brand-green hover:text-white transition-colors cursor-pointer">
                    {area}
                  </div>
                ))}
              </div>
              <div className="text-center mt-8">
                <p className="text-text-grey mb-4">
                  <i className="fas fa-map-marker-alt text-brand-green mr-2"></i>
                  <strong>All Dubai areas covered</strong> - including new developments and off-plan projects
                </p>
                <Link href="/contact">
                  <Button className="bg-brand-green text-white hover:bg-opacity-90">
                    Check Your Area Availability
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Developer Partnerships */}
        <section className="py-16 lg:py-20 bg-light-grey">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-4">
                Experienced with All Major Dubai Developers
              </h2>
              <p className="text-lg text-text-grey max-w-3xl mx-auto">
                We have inspected thousands of properties from Dubai's leading developers 
                and understand their construction standards and common issues.
              </p>
            </div>
            <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
              {["Emaar", "DAMAC", "Nakheel", "Meraas", "Sobha", "Dubai Properties", "Azizi", "Danube"].map((developer, index) => (
                <div key={index} className="bg-white p-6 rounded-lg text-center shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-lg font-semibold text-brand-black">{developer}</div>
                  <div className="text-sm text-text-grey mt-1">Properties Inspected</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section with Schema */}
        <section className="py-16 lg:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-4">
                Frequently Asked Questions - Snagging Company Dubai
              </h2>
              <p className="text-lg text-text-grey max-w-3xl mx-auto">
                Everything you need to know about property snagging in Dubai
              </p>
            </div>
            <div className="max-w-4xl mx-auto space-y-4">
              {faqItems.map((item, index) => (
                <details key={index} className="bg-light-grey rounded-lg group">
                  <summary className="p-6 cursor-pointer font-semibold text-brand-black flex justify-between items-center hover:bg-gray-100 rounded-lg transition-colors">
                    <span>{item.question}</span>
                    <i className="fas fa-chevron-down text-brand-green group-open:rotate-180 transition-transform"></i>
                  </summary>
                  <div className="px-6 pb-6 text-text-grey">
                    {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Related Services */}
        <section className="py-16 lg:py-20 bg-light-grey">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-4">
                Related Property Inspection Services
              </h2>
            </div>
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/locations/dubai/property-inspection">
                <Card className="bg-white hover:shadow-lg transition-all cursor-pointer h-full">
                  <CardContent className="p-6 text-center">
                    <i className="fas fa-search text-3xl text-brand-green mb-4"></i>
                    <h3 className="font-semibold text-brand-black mb-2">Property Inspection Dubai</h3>
                    <p className="text-sm text-text-grey">Comprehensive property assessments</p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/locations/dubai/snagging-cost">
                <Card className="bg-white hover:shadow-lg transition-all cursor-pointer h-full">
                  <CardContent className="p-6 text-center">
                    <i className="fas fa-calculator text-3xl text-brand-green mb-4"></i>
                    <h3 className="font-semibold text-brand-black mb-2">Snagging Cost Dubai</h3>
                    <p className="text-sm text-text-grey">Detailed pricing information</p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/locations/abu-dhabi/snagging-company">
                <Card className="bg-white hover:shadow-lg transition-all cursor-pointer h-full">
                  <CardContent className="p-6 text-center">
                    <i className="fas fa-building text-3xl text-brand-green mb-4"></i>
                    <h3 className="font-semibold text-brand-black mb-2">Snagging Company Abu Dhabi</h3>
                    <p className="text-sm text-text-grey">Services in the capital</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-24 bg-brand-black text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">
              Ready to Protect Your Dubai Property Investment?
            </h2>
            <p className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
              Join 15,000+ satisfied clients who trusted UrbanGrid with their property snagging. 
              Book your inspection today and ensure your property is perfect.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="bg-brand-green text-white hover:bg-opacity-90 px-10 py-4 text-lg">
                  Get Your Free Quote
                </Button>
              </Link>
              <a 
                href="https://wa.me/971585686852?text=Hello! I need professional snagging services in Dubai."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white px-10 py-4 rounded-md font-semibold hover:bg-white hover:text-brand-black transition-colors text-lg"
              >
                <i className="fab fa-whatsapp mr-2 text-xl"></i>
                WhatsApp Us Now
              </a>
            </div>
            <p className="mt-8 text-gray-400">
              <i className="fas fa-phone mr-2"></i>
              Or call directly: <a href="tel:+971585686852" className="text-white hover:text-brand-green">+971 58 568 6852</a>
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
