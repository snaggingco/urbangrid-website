import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ScrollTriggeredForm from "@/components/ScrollTriggeredForm";
import SEO from "@/components/SEO";

export default function Realty() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const services = [
    {
      title: "Property Brokerage",
      description: "Expert real estate brokerage services across Dubai, Abu Dhabi, and the UAE. Whether you're buying, selling, or leasing residential or commercial properties, our team provides market insights, negotiation expertise, and end-to-end transaction support.",
      icon: "fas fa-handshake",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      features: [
        "Residential sales and leasing",
        "Commercial property transactions",
        "Off-plan property advisory",
        "Market analysis and valuation",
        "Negotiation and deal structuring",
        "Legal and documentation support",
      ],
    },
    {
      title: "Property Management",
      description: "Comprehensive property management solutions for landlords and investors. We handle everything from tenant sourcing and rent collection to maintenance coordination and financial reporting, maximizing your return on investment.",
      icon: "fas fa-building",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      features: [
        "Tenant screening and sourcing",
        "Rent collection and accounting",
        "Maintenance coordination",
        "Regular property inspections",
        "Financial performance reporting",
        "Lease renewal management",
      ],
    },
    {
      title: "Investment Advisory",
      description: "Strategic investment guidance backed by technical due diligence from our Consulting division. Our unique position within the UrbanGrid Group means we can provide investment advice supported by thorough property condition data that no other brokerage can match.",
      icon: "fas fa-chart-line",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      features: [
        "Portfolio diversification strategies",
        "ROI analysis and projections",
        "Area growth potential assessment",
        "Technical due diligence integration",
        "Market trend monitoring",
        "Exit strategy planning",
      ],
    },
  ];

  const advantages = [
    {
      icon: "fas fa-clipboard-check",
      title: "Inspection-Backed Listings",
      description: "Every property we list comes with the option for a full UrbanGrid Consulting inspection report, giving buyers unmatched confidence.",
    },
    {
      icon: "fas fa-microchip",
      title: "Tech-Enhanced Properties",
      description: "Access to UrbanGrid Advanced systems means we can recommend value-adding upgrades that increase property appeal and pricing.",
    },
    {
      icon: "fas fa-users",
      title: "Cross-Division Network",
      description: "Our clients benefit from a vast network spanning developers, investors, and homeowners across all three UrbanGrid divisions.",
    },
    {
      icon: "fas fa-globe",
      title: "UAE-Wide Coverage",
      description: "Active across Dubai, Abu Dhabi, Sharjah, and all Emirates with deep local market knowledge in every community.",
    },
  ];

  const areas = [
    "Dubai Marina", "Downtown Dubai", "Business Bay", "Palm Jumeirah",
    "JBR", "Dubai Hills", "Arabian Ranches", "DAMAC Hills",
    "Saadiyat Island", "Yas Island", "Al Reem Island", "Al Zahia",
  ];

  return (
    <>
      <SEO />
      <section className="relative py-24 lg:py-32 bg-gray-900 mt-8 lg:mt-12">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600&q=80')`,
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/50"></div>

        <div
          className={`relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="max-w-3xl">
            <Link href="/">
              <span className="inline-flex items-center text-gray-300 hover:text-white mb-4 cursor-pointer text-sm">
                <i className="fas fa-arrow-left mr-2"></i>
                UrbanGrid Group
              </span>
            </Link>
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-amber-500/20 border border-amber-400/40 rounded-full text-amber-300 text-sm font-medium">
                Real Estate Division
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              UrbanGrid Realty
            </h1>
            <p className="text-xl text-gray-200 leading-relaxed mb-8">
              Real estate brokerage and property management services backed by technical expertise. Buy, sell, lease, and manage with confidence across the UAE.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="tel:+971585686852">
                <Button size="lg" className="bg-brand-green text-white hover:bg-opacity-90">
                  <i className="fas fa-phone mr-2"></i>
                  Speak to an Agent
                </Button>
              </a>
              <a
                href="https://wa.me/971585686852?text=Hello%20UrbanGrid%20Realty%2C%20I%27m%20interested%20in%20your%20real%20estate%20services.%20Please%20provide%20more%20information."
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-brand-black">
                  <i className="fab fa-whatsapp mr-2"></i>
                  WhatsApp Us
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-light-grey">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-4">Our Real Estate Services</h2>
            <p className="text-lg text-text-grey max-w-3xl mx-auto">
              Comprehensive real estate solutions powered by the UrbanGrid Group ecosystem
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card key={service.title} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-0">
                <CardContent className="p-8">
                  <div className={`${service.iconBg} w-14 h-14 rounded-2xl flex items-center justify-center mb-6`}>
                    <i className={`${service.icon} ${service.iconColor} text-xl`}></i>
                  </div>
                  <h3 className="text-xl font-bold text-brand-black mb-3">{service.title}</h3>
                  <p className="text-text-grey text-sm leading-relaxed mb-6">{service.description}</p>

                  <div className="space-y-2">
                    {service.features.map((feature) => (
                      <div key={feature} className="flex items-center text-sm text-text-grey">
                        <i className="fas fa-check-circle text-brand-green mr-2 text-xs"></i>
                        {feature}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-4">The UrbanGrid Realty Advantage</h2>
            <p className="text-lg text-text-grey max-w-3xl mx-auto">
              What sets us apart from traditional real estate companies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {advantages.map((advantage) => (
              <div key={advantage.title} className="flex items-start gap-4 p-6 bg-light-grey rounded-xl">
                <div className="bg-brand-green/10 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className={`${advantage.icon} text-brand-green`}></i>
                </div>
                <div>
                  <h3 className="font-bold text-brand-black mb-2">{advantage.title}</h3>
                  <p className="text-text-grey text-sm">{advantage.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-light-grey">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-4">Areas We Serve</h2>
            <p className="text-lg text-text-grey max-w-3xl mx-auto">
              Active across prime communities in Dubai, Abu Dhabi, Sharjah and all Emirates
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {areas.map((area) => (
              <span
                key={area}
                className="px-4 py-2 bg-white rounded-full text-sm font-medium text-text-grey shadow-sm hover:shadow-md hover:text-brand-green transition-all cursor-default"
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-brand-green text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">Looking to Buy, Sell, or Manage Property?</h2>
            <p className="text-xl mb-8 text-green-100">
              Let UrbanGrid Realty handle your real estate needs with the backing of a full-spectrum property group.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+971585686852"
                className="inline-flex items-center bg-white text-brand-green px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
              >
                <i className="fas fa-phone mr-2"></i>
                Call Now: +971 58 568 6852
              </a>
              <a
                href="https://wa.me/971585686852?text=Hello%20UrbanGrid%20Realty%2C%20I%27m%20interested%20in%20your%20real%20estate%20services."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-transparent border-2 border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-brand-green transition-colors"
              >
                <i className="fab fa-whatsapp mr-2"></i>
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>

      <ScrollTriggeredForm />
    </>
  );
}
