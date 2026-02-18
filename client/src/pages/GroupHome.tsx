import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ScrollTriggeredForm from "@/components/ScrollTriggeredForm";
import SEO from "@/components/SEO";

export default function GroupHome() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const divisions = [
    {
      name: "UrbanGrid Advanced",
      tagline: "Innovation & Luxury Technology",
      description: "Cutting-edge architectural solutions including automated swimming pool covers, PDLC smart films, and movable pool floors. Transforming luxury living with advanced technology systems across the UAE.",
      icon: "fas fa-microchip",
      color: "from-blue-600 to-cyan-500",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      href: "/advanced-systems",
      features: ["Swimming Pool Covers", "PDLC Smart Films", "Movable Pool Floors"],
    },
    {
      name: "UrbanGrid Realty",
      tagline: "Trust & Performance",
      description: "Full-spectrum real estate services including property brokerage, asset management, and portfolio advisory. Backed by deep technical knowledge that gives our clients a decisive advantage.",
      icon: "fas fa-city",
      color: "from-amber-500 to-orange-500",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      href: "/realty",
      features: ["Property Brokerage", "Property Management", "Investment Advisory"],
    },
    {
      name: "UrbanGrid Consulting",
      tagline: "Authority & Precision",
      description: "UAE's leading property inspection and snagging experts. NFPA, ASHRAE & ASTM certified services protecting property investments across Dubai, Abu Dhabi, Sharjah and all Emirates.",
      icon: "fas fa-clipboard-check",
      color: "from-emerald-600 to-green-500",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      href: "/consulting",
      features: ["Property Snagging", "RERA Services", "Technical Inspections"],
    },
  ];

  const stats = [
    { number: "40,000+", label: "Properties Served" },
    { number: "3", label: "Divisions" },
    { number: "7", label: "Emirates Covered" },
    { number: "10+", label: "Years of Experience" },
  ];

  return (
    <>
      <SEO />
      <section className="relative min-h-screen flex items-center justify-center bg-gray-900 mt-8 lg:mt-12">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80')`,
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>

        <div
          className={`relative z-10 text-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-brand-green/20 border border-brand-green/40 rounded-full text-brand-green text-sm font-medium tracking-wide uppercase">
              Advanced Systems &bull; Realty &bull; Consulting
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            UrbanGrid Group
          </h1>
          <p className="text-xl sm:text-2xl text-gray-200 leading-relaxed max-w-3xl mx-auto mb-8">
            One partner for the entire lifecycle of your property. From smart technology installations to expert inspections and real estate services across the UAE.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#divisions">
              <Button size="lg" className="bg-brand-green text-white hover:bg-opacity-90 text-lg px-8 py-6">
                Explore Our Divisions
                <i className="fas fa-arrow-down ml-2"></i>
              </Button>
            </a>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-brand-black text-lg px-8 py-6">
                Get in Touch
                <i className="fas fa-arrow-right ml-2"></i>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-brand-green mb-1">{stat.number}</div>
                <div className="text-text-grey text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="divisions" className="py-16 lg:py-24 bg-light-grey">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-4">Our Divisions</h2>
            <p className="text-lg text-text-grey max-w-3xl mx-auto">
              Three specialized divisions working together to provide a comprehensive property ecosystem across the UAE
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {divisions.map((division) => (
              <Card
                key={division.name}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border-0"
              >
                <div className={`h-2 bg-gradient-to-r ${division.color}`}></div>
                <CardContent className="p-8">
                  <div className={`${division.iconBg} w-16 h-16 rounded-2xl flex items-center justify-center mb-6`}>
                    <i className={`${division.icon} ${division.iconColor} text-2xl`}></i>
                  </div>
                  <h3 className="text-2xl font-bold text-brand-black mb-2">{division.name}</h3>
                  <p className="text-sm font-medium text-brand-green mb-4">{division.tagline}</p>
                  <p className="text-text-grey mb-6 leading-relaxed">{division.description}</p>

                  <div className="space-y-2 mb-8">
                    {division.features.map((feature) => (
                      <div key={feature} className="flex items-center text-sm text-text-grey">
                        <i className="fas fa-check-circle text-brand-green mr-2 text-xs"></i>
                        {feature}
                      </div>
                    ))}
                  </div>

                  <Link href={division.href}>
                    <Button className="w-full bg-brand-green text-white hover:bg-opacity-90">
                      Explore {division.name.replace("UrbanGrid ", "")}
                      <i className="fas fa-arrow-right ml-2"></i>
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-3 py-1 bg-brand-green/10 text-brand-green text-sm font-medium rounded-full mb-4">
                The UrbanGrid Advantage
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-6">
                One Partner for Your Entire Property Lifecycle
              </h2>
              <p className="text-lg text-text-grey mb-6 leading-relaxed">
                UrbanGrid Group offers an unmatched ecosystem of property services. Whether you are purchasing a new home, enhancing a luxury villa, or managing your real estate portfolio, our integrated divisions work together to deliver seamless solutions.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4">
                  <div className="bg-amber-100 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <i className="fas fa-search text-amber-600"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-brand-black">Find</h4>
                    <p className="text-text-grey text-sm">UrbanGrid Realty finds your ideal property</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <i className="fas fa-clipboard-check text-green-600"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-brand-black">Inspect</h4>
                    <p className="text-text-grey text-sm">UrbanGrid Consulting performs expert snagging and inspections</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <i className="fas fa-microchip text-blue-600"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-brand-black">Enhance</h4>
                    <p className="text-text-grey text-sm">UrbanGrid Advanced installs smart technology and luxury systems</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <i className="fas fa-chart-line text-purple-600"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-brand-black">Manage</h4>
                    <p className="text-text-grey text-sm">UrbanGrid Realty manages and grows your investment</p>
                  </div>
                </div>
              </div>

              <Link href="/contact">
                <Button className="bg-brand-green text-white hover:bg-opacity-90">
                  Talk to Our Team
                  <i className="fas fa-arrow-right ml-2"></i>
                </Button>
              </Link>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=500&q=80"
                alt="UrbanGrid Group - Modern property services"
                className="rounded-xl shadow-2xl w-full"
                loading="lazy"
              />
              <div className="absolute -bottom-6 -left-6 bg-brand-green text-white p-6 rounded-xl shadow-xl">
                <div className="text-2xl font-bold">40,000+</div>
                <div className="text-sm">Properties Served</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-brand-green text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">Ready to Experience the UrbanGrid Difference?</h2>
            <p className="text-xl mb-8 text-green-100">
              From advanced technology solutions to expert property services, we have you covered. Contact us today.
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
                href="https://wa.me/971585686852?text=Hello%20UrbanGrid%2C%20I%27m%20interested%20in%20your%20services.%20Please%20provide%20me%20with%20more%20information."
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
