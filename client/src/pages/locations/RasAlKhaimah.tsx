import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function RasAlKhaimah() {
  const services = [
    {
      title: "Property Inspection RAK",
      description: "Expert property inspections for Ras Al Khaimah's diverse developments from mountain to beachfront properties",
      link: "/services/secondary-market",
      areas: ["Al Hamra Village", "Mina Al Arab", "RAK Properties", "Julphar Towers"]
    },
    {
      title: "Villa Snagging RAK",
      description: "Specialized villa inspections in RAK's luxury communities and resort-style developments",
      link: "/services/new-build-snagging",
      areas: ["Al Hamra Golf", "Flamingo Villas", "Bermuda Views", "Mangrove Place"]
    },
    {
      title: "Resort Property Inspection",
      description: "Comprehensive inspections for resort properties and holiday homes in RAK's tourism zones",
      link: "/services/move-in-move-out",
      areas: ["Marjan Island", "Al Marjan Resort", "Ras Al Khaimah Beach", "Jebel Jais"]
    }
  ];

  const areas = [
    "Al Hamra Village", "Mina Al Arab", "RAK Properties", "Julphar Towers", "Al Hamra Golf",
    "Flamingo Villas", "Bermuda Views", "Mangrove Place", "Marjan Island", "Al Marjan Resort",
    "Ras Al Khaimah Beach", "Jebel Jais", "RAK City Centre", "Al Nakheel", "Al Rams",
    "Digdaga", "Khatt", "Al Jazirah Al Hamra", "Sha'am"
  ];

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-brand-black mb-6">
              Property Snagging & Inspection Services in Ras Al Khaimah
            </h1>
            <p className="text-xl text-text-grey leading-relaxed mb-8">
              Ras Al Khaimah's premier property inspection company providing comprehensive snagging services across the emirate's diverse landscape. From mountain retreats to beachfront resorts, we ensure your RAK property investment meets the highest standards.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="bg-brand-green text-white hover:bg-opacity-90 px-8 py-3">
                  Get Free Quote in RAK
                </Button>
              </Link>
              <a 
                href="tel:+971501234567"
                className="inline-flex items-center bg-transparent border-2 border-brand-green text-brand-green px-8 py-3 rounded-md font-semibold hover:bg-brand-green hover:text-white transition-colors"
              >
                <i className="fas fa-phone mr-2"></i>
                Call RAK: +971 50 123 4567
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 lg:py-20 bg-light-grey">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-12 text-center">
            RAK Property Inspection Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="bg-white hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-brand-black mb-4">{service.title}</h3>
                  <p className="text-text-grey mb-4">{service.description}</p>
                  <div className="mb-4">
                    <h4 className="font-medium text-brand-black mb-2">Featured Areas:</h4>
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

      {/* RAK Unique Features */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-6">
                RAK's Unique Property Landscape
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <i className="fas fa-mountain text-brand-green mr-3 mt-1"></i>
                  <div>
                    <h3 className="font-semibold text-brand-black">Mountain Properties</h3>
                    <p className="text-text-grey">Specialized inspections for Jebel Jais mountain properties with unique construction challenges and climate considerations.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <i className="fas fa-umbrella-beach text-brand-green mr-3 mt-1"></i>
                  <div>
                    <h3 className="font-semibold text-brand-black">Resort Developments</h3>
                    <p className="text-text-grey">Expert knowledge of resort and hospitality properties on Marjan Island and beachfront locations.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <i className="fas fa-golf-ball text-brand-green mr-3 mt-1"></i>
                  <div>
                    <h3 className="font-semibold text-brand-black">Golf Community Villas</h3>
                    <p className="text-text-grey">Comprehensive villa inspections in Al Hamra Golf and other premium lifestyle communities.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <i className="fas fa-industry text-brand-green mr-3 mt-1"></i>
                  <div>
                    <h3 className="font-semibold text-brand-black">Industrial Properties</h3>
                    <p className="text-text-grey">Commercial and industrial property inspections in RAK's growing business zones.</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Ras Al Khaimah property inspection services" 
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* RAK Investment Guide */}
      <section className="py-16 lg:py-20 bg-light-grey">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-8 text-center">
              RAK Property Investment Guide
            </h2>
            <div className="prose prose-lg max-w-none text-text-grey">
              <h3 className="text-xl font-semibold text-brand-black mb-4">Why Invest in Ras Al Khaimah?</h3>
              <p className="mb-6">
                Ras Al Khaimah offers unique investment opportunities combining natural beauty with modern development. From <strong>Jebel Jais</strong> mountain properties to <strong>Marjan Island</strong> beachfront resorts, RAK provides diverse property options for every investor.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className="font-semibold text-brand-black mb-3">Key Advantages</h4>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>100% foreign ownership in designated areas</li>
                    <li>Growing tourism and hospitality sector</li>
                    <li>Strategic location for business and leisure</li>
                    <li>Competitive property prices</li>
                    <li>Unique natural attractions boosting property values</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-brand-black mb-3">Popular Investment Areas</h4>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Al Hamra Village:</strong> Integrated golf and marina community</li>
                    <li><strong>Marjan Island:</strong> Artificial island with luxury resorts</li>
                    <li><strong>Mina Al Arab:</strong> Waterfront residential development</li>
                    <li><strong>Jebel Jais:</strong> Mountain retreat properties</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RAK Areas */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-12 text-center">
            RAK Areas We Serve
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {areas.map((area, index) => (
              <div key={index} className="bg-white p-3 rounded-lg text-center shadow-sm hover:shadow-md transition-shadow border">
                <span className="text-sm font-medium text-brand-black">{area}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-brand-green text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Professional Property Inspection in RAK
          </h2>
          <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
            Secure your Ras Al Khaimah property investment with expert snagging and inspection services. From mountain retreats to beachfront resorts, we ensure comprehensive quality control.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button className="bg-white text-brand-green hover:bg-gray-100 px-8 py-3">
                Schedule RAK Inspection
              </Button>
            </Link>
            <a 
              href="https://wa.me/971501234567?text=Hello! I need property inspection services in Ras Al Khaimah."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-transparent border-2 border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-brand-green transition-colors"
            >
              <i className="fab fa-whatsapp mr-2"></i>
              WhatsApp RAK Team
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}