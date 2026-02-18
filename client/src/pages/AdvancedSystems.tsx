import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ScrollTriggeredForm from "@/components/ScrollTriggeredForm";
import SEO from "@/components/SEO";

export default function AdvancedSystems() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const products = [
    {
      title: "Automatic Swimming Pool Covers",
      description: "State-of-the-art motorized pool cover systems engineered for the UAE climate. Our automated covers provide safety, reduce water evaporation by up to 95%, minimize chemical usage, and keep your pool pristine year-round. Available in slatted, fabric, and thermal options for residential and commercial pools.",
      icon: "fas fa-swimming-pool",
      iconBg: "bg-cyan-100",
      iconColor: "text-cyan-600",
      features: [
        "Motorized retractable systems",
        "Child and pet safety compliant",
        "95% reduction in water evaporation",
        "Reduces chemical usage by up to 70%",
        "Solar heating compatible options",
        "Remote control and smart home integration",
      ],
      image: "https://images.unsplash.com/photo-1572331165267-854da2b021b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
    },
    {
      title: "PDLC Smart Film",
      description: "Polymer Dispersed Liquid Crystal (PDLC) switchable smart film that transforms ordinary glass into a dynamic privacy solution. With a single touch, glass transitions from transparent to opaque. Ideal for office partitions, bathroom glass, storefronts, and luxury residential applications across Dubai and the UAE.",
      icon: "fas fa-glass-whiskey",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      features: [
        "Instant privacy at the touch of a button",
        "UV protection and glare reduction",
        "Energy-efficient temperature regulation",
        "Retrofit onto existing glass surfaces",
        "Smart home and automation compatible",
        "Projection screen capability when opaque",
      ],
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
    },
    {
      title: "Movable Pool Floor",
      description: "Revolutionary hydraulic pool floor systems that transform your swimming pool depth from zero to full depth at the push of a button. Convert your pool into a terrace, event space, or children's wading area instantly. The ultimate luxury feature for high-end villas and hotels in the UAE.",
      icon: "fas fa-arrows-alt-v",
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
      features: [
        "Adjustable depth from 0 to 3+ meters",
        "Converts pool to solid floor/terrace",
        "Hydraulic or pneumatic lift systems",
        "Safety sensors and emergency stop",
        "Custom sizes and finishes available",
        "Ideal for events and multi-use spaces",
      ],
      image: "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
    },
  ];

  const benefits = [
    { icon: "fas fa-leaf", title: "Sustainability", text: "Aligned with UAE Net Zero 2050 goals through energy-efficient solutions" },
    { icon: "fas fa-shield-alt", title: "Safety First", text: "All systems meet international safety standards and certifications" },
    { icon: "fas fa-cogs", title: "Smart Integration", text: "Seamlessly connects with home automation and smart building systems" },
    { icon: "fas fa-tools", title: "Expert Installation", text: "Professional installation and ongoing maintenance by certified teams" },
  ];

  return (
    <>
      <SEO />
      <section className="relative py-24 lg:py-32 bg-gray-900 mt-8 lg:mt-12">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600&q=80')`,
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
              <span className="inline-block px-3 py-1 bg-blue-500/20 border border-blue-400/40 rounded-full text-blue-300 text-sm font-medium">
                Advanced Systems Division
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              UrbanGrid Advanced
            </h1>
            <p className="text-xl text-gray-200 leading-relaxed mb-8">
              Cutting-edge architectural technology solutions for luxury properties across the UAE. Swimming pool covers, PDLC smart films, and movable pool floors.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="tel:+971585686852">
                <Button size="lg" className="bg-brand-green text-white hover:bg-opacity-90">
                  <i className="fas fa-phone mr-2"></i>
                  Request a Consultation
                </Button>
              </a>
              <a
                href="https://wa.me/971585686852?text=Hello%20UrbanGrid%2C%20I%27m%20interested%20in%20your%20Advanced%20Systems%20products.%20Please%20provide%20more%20information."
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

      <section className="py-12 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="text-center">
                <div className="bg-brand-green/10 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <i className={`${benefit.icon} text-brand-green`}></i>
                </div>
                <h3 className="font-semibold text-brand-black text-sm mb-1">{benefit.title}</h3>
                <p className="text-text-grey text-xs">{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-light-grey">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-4">Our Products & Solutions</h2>
            <p className="text-lg text-text-grey max-w-3xl mx-auto">
              Premium technology solutions designed for the UAE's luxury property market
            </p>
          </div>

          <div className="space-y-16">
            {products.map((product, index) => (
              <div
                key={product.title}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className={`${product.iconBg} w-14 h-14 rounded-2xl flex items-center justify-center mb-4`}>
                    <i className={`${product.icon} ${product.iconColor} text-xl`}></i>
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-brand-black mb-4">{product.title}</h3>
                  <p className="text-text-grey leading-relaxed mb-6">{product.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                    {product.features.map((feature) => (
                      <div key={feature} className="flex items-center text-sm text-text-grey">
                        <i className="fas fa-check-circle text-brand-green mr-2 text-xs"></i>
                        {feature}
                      </div>
                    ))}
                  </div>

                  <a
                    href="https://wa.me/971585686852?text=Hello%20UrbanGrid%2C%20I%27m%20interested%20in%20your%20Advanced%20Systems%20products.%20Please%20provide%20more%20information."
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="bg-brand-green text-white hover:bg-opacity-90">
                      Enquire About {product.title.split(" ").slice(0, 2).join(" ")}
                      <i className="fas fa-arrow-right ml-2"></i>
                    </Button>
                  </a>
                </div>

                <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                  <img
                    src={product.image}
                    alt={product.title}
                    className="rounded-xl shadow-xl w-full object-cover h-[350px]"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-4">Why UrbanGrid Advanced?</h2>
            <p className="text-lg text-text-grey max-w-3xl mx-auto">
              As part of the UrbanGrid Group, our Advanced Systems division brings together engineering excellence and luxury innovation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="bg-light-grey border-0">
              <CardContent className="p-8 text-center">
                <i className="fas fa-drafting-compass text-brand-green text-3xl mb-4"></i>
                <h3 className="font-bold text-brand-black mb-2">Custom Engineering</h3>
                <p className="text-text-grey text-sm">Every installation is custom-designed for your specific property requirements and aesthetic preferences</p>
              </CardContent>
            </Card>
            <Card className="bg-light-grey border-0">
              <CardContent className="p-8 text-center">
                <i className="fas fa-headset text-brand-green text-3xl mb-4"></i>
                <h3 className="font-bold text-brand-black mb-2">Lifetime Support</h3>
                <p className="text-text-grey text-sm">Comprehensive warranty and dedicated after-sales support for all installations across the UAE</p>
              </CardContent>
            </Card>
            <Card className="bg-light-grey border-0">
              <CardContent className="p-8 text-center">
                <i className="fas fa-award text-brand-green text-3xl mb-4"></i>
                <h3 className="font-bold text-brand-black mb-2">Certified Quality</h3>
                <p className="text-text-grey text-sm">International certifications and premium materials ensuring the highest quality standards</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-brand-green text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">Transform Your Property with Advanced Technology</h2>
            <p className="text-xl mb-8 text-green-100">
              From automated pool covers to smart glass solutions, elevate your property with UrbanGrid Advanced.
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
                href="https://wa.me/971585686852?text=Hello%20UrbanGrid%2C%20I%27m%20interested%20in%20your%20Advanced%20Systems.%20Please%20provide%20more%20information."
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
