import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function AbuDhabi() {
  const services = [
    {
      title: "Property Inspection Abu Dhabi",
      description: "Expert property inspections for Abu Dhabi's luxury developments including Saadiyat Island and Yas Island",
      link: "/services/secondary-market",
      areas: ["Saadiyat Island", "Yas Island", "Al Reem Island", "Corniche Area"]
    },
    {
      title: "Snagging Company Abu Dhabi",
      description: "Professional snagging services for new developments across Abu Dhabi's premium residential areas",
      link: "/services/new-build-snagging",
      areas: ["Al Raha Beach", "Khalifa City", "Mohammed Bin Zayed City", "Masdar City"]
    },
    {
      title: "Home Inspection Abu Dhabi",
      description: "Comprehensive villa and apartment inspections in Abu Dhabi's established and emerging communities",
      link: "/services/move-in-move-out",
      areas: ["Al Reef", "Al Ghadeer", "Bloom Gardens", "Shams Abu Dhabi"]
    }
  ];

  const areas = [
    "Saadiyat Island", "Yas Island", "Al Reem Island", "Corniche Area", "Al Raha Beach",
    "Khalifa City", "Mohammed Bin Zayed City", "Masdar City", "Al Reef", "Al Ghadeer",
    "Bloom Gardens", "Shams Abu Dhabi", "Reem Island", "Al Maryah Island", "Tourist Club Area",
    "Al Bateen", "Khalidiyah", "Al Manhal", "Al Karamah", "Al Mushrif", "Al Shamkha"
  ];

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-brand-black mb-6">
              Property Snagging & Inspection Services in Abu Dhabi
            </h1>
            <p className="text-xl text-text-grey leading-relaxed mb-8">
              Abu Dhabi's premier snagging company providing comprehensive property inspection services across the capital. From luxury villa inspections to apartment snagging, we ensure your Abu Dhabi property investment is protected.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="bg-brand-green text-white hover:bg-opacity-90 px-8 py-3">
                  Get Free Quote in Abu Dhabi
                </Button>
              </Link>
              <a 
                href="tel:+971501234567"
                className="inline-flex items-center bg-transparent border-2 border-brand-green text-brand-green px-8 py-3 rounded-md font-semibold hover:bg-brand-green hover:text-white transition-colors"
              >
                <i className="fas fa-phone mr-2"></i>
                Call Abu Dhabi: +971 50 123 4567
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 lg:py-20 bg-light-grey">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-12 text-center">
            Abu Dhabi Property Inspection Services
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

      {/* Abu Dhabi Market Expertise */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-6">
                Abu Dhabi Property Market Expertise
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <i className="fas fa-building text-brand-green mr-3 mt-1"></i>
                  <div>
                    <h3 className="font-semibold text-brand-black">Luxury Development Focus</h3>
                    <p className="text-text-grey">Specialized in high-end developments on Saadiyat Island, Yas Island, and Al Reem Island with premium finishing standards.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <i className="fas fa-certificate text-brand-green mr-3 mt-1"></i>
                  <div>
                    <h3 className="font-semibold text-brand-black">Government Approved</h3>
                    <p className="text-text-grey">Licensed by Abu Dhabi authorities and familiar with local building codes and developer requirements.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <i className="fas fa-clock text-brand-green mr-3 mt-1"></i>
                  <div>
                    <h3 className="font-semibold text-brand-black">24-Hour Service</h3>
                    <p className="text-text-grey">Quick response times for urgent inspections and same-day reports for Abu Dhabi properties.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <i className="fas fa-handshake text-brand-green mr-3 mt-1"></i>
                  <div>
                    <h3 className="font-semibold text-brand-black">Developer Relations</h3>
                    <p className="text-text-grey">Strong relationships with major Abu Dhabi developers including Aldar, Bloom Properties, and RAK Properties.</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Abu Dhabi property inspection services" 
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Abu Dhabi Areas */}
      <section className="py-16 lg:py-20 bg-light-grey">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-12 text-center">
            Abu Dhabi Communities We Serve
          </h2>
          <p className="text-lg text-text-grey text-center mb-8 max-w-3xl mx-auto">
            Our Abu Dhabi property inspection experts cover all major residential communities, from island developments to mainland communities, ensuring comprehensive property snagging services.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {areas.map((area, index) => (
              <div key={index} className="bg-white p-3 rounded-lg text-center shadow-sm hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-brand-black">{area}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Abu Dhabi Property Guide */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-8 text-center">
              Abu Dhabi Property Investment Guide
            </h2>
            <div className="prose prose-lg max-w-none text-text-grey">
              <h3 className="text-xl font-semibold text-brand-black mb-4">Abu Dhabi's Growing Real Estate Market</h3>
              <p className="mb-6">
                Abu Dhabi's real estate market has seen significant growth, particularly in luxury segments on <strong>Saadiyat Island</strong> and <strong>Yas Island</strong>. With major cultural projects like the Louvre and Guggenheim, property values continue to appreciate, making professional snagging inspection crucial for protecting investments.
              </p>
              
              <h3 className="text-xl font-semibold text-brand-black mb-4">Key Inspection Areas in Abu Dhabi Properties</h3>
              <ul className="list-disc pl-6 mb-6">
                <li><strong>Coastal Property Considerations:</strong> Salt air corrosion and waterproofing in beachfront developments</li>
                <li><strong>Smart Home Integration:</strong> Advanced technology systems in luxury Abu Dhabi developments</li>
                <li><strong>Energy Efficiency:</strong> Sustainability features and LEED compliance in new projects</li>
                <li><strong>Community Facilities:</strong> Shared amenities and infrastructure quality assessments</li>
              </ul>

              <h3 className="text-xl font-semibold text-brand-black mb-4">Popular Abu Dhabi Developments</h3>
              <p className="mb-6">
                From the cultural district of <strong>Saadiyat Island</strong> to the entertainment hub of <strong>Yas Island</strong>, Abu Dhabi offers diverse investment opportunities. Our snagging experts are familiar with the unique characteristics of each development, ensuring comprehensive property inspections tailored to specific community standards.
              </p>
            </div>
            
            <div className="text-center mt-8">
              <Link href="/about">
                <Button variant="outline" className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white">
                  Learn About Our Abu Dhabi Team
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* External Resources */}
      <section className="py-16 lg:py-20 bg-light-grey">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-brand-black mb-8 text-center">
            Abu Dhabi Property Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold text-brand-black mb-4">Abu Dhabi Municipality</h3>
                <p className="text-text-grey mb-4">Official building regulations and urban planning for Abu Dhabi properties.</p>
                <a 
                  href="https://www.adm.gov.ae" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-brand-green hover:underline"
                >
                  Visit Abu Dhabi Municipality
                </a>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold text-brand-black mb-4">Aldar Properties</h3>
                <p className="text-text-grey mb-4">Leading developer in Abu Dhabi with major projects across the emirate.</p>
                <a 
                  href="https://www.aldar.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-brand-green hover:underline"
                >
                  Visit Aldar Properties
                </a>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold text-brand-black mb-4">Department of Urban Planning</h3>
                <p className="text-text-grey mb-4">Abu Dhabi's master planning and development guidelines.</p>
                <a 
                  href="https://dmt.gov.ae" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-brand-green hover:underline"
                >
                  Visit Planning Department
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-brand-green text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Professional Property Inspection in Abu Dhabi
          </h2>
          <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
            Secure your Abu Dhabi property investment with expert snagging and inspection services. Our local team understands the unique requirements of Abu Dhabi's luxury developments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button className="bg-white text-brand-green hover:bg-gray-100 px-8 py-3">
                Schedule Abu Dhabi Inspection
              </Button>
            </Link>
            <a 
              href="https://wa.me/971501234567?text=Hello! I need property inspection services in Abu Dhabi."
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
  );
}