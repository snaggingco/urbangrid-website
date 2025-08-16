import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function PrePurchaseInspectionDubai() {
  const focusAreas = [
    "Dubai Marina", "Downtown Dubai", "Business Bay", "Jumeirah Lake Towers",
    "Dubai Creek Harbour", "Dubai Hills Estate", "Mohammed Bin Rashid City",
    "Dubai South", "Dubailand", "Jumeirah Village Circle"
  ];

  const inspectionAreas = [
    {
      title: "Structural Assessment",
      description: "Complete structural integrity evaluation",
      features: ["Foundation inspection", "Wall and ceiling cracks", "Structural defects", "Load-bearing elements"]
    },
    {
      title: "MEP Systems",
      description: "Mechanical, electrical & plumbing systems check",
      features: ["Electrical safety testing", "Plumbing leak detection", "AC system performance", "Water pressure testing"]
    },
    {
      title: "Interior & Finishes",
      description: "Quality assessment of all interior elements",
      features: ["Flooring condition", "Paint and finishes", "Doors and windows", "Built-in fixtures"]
    },
    {
      title: "Documentation & Report",
      description: "Comprehensive inspection report with recommendations",
      features: ["Detailed defect list", "Priority recommendations", "Cost estimates", "Legal compliance"]
    }
  ];

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-brand-black mb-6">
              Pre-Purchase Property Inspection Dubai: Expert Buyer Protection Services
            </h1>
            <p className="text-xl text-text-grey leading-relaxed mb-8">
              Professional pre-purchase inspections across Dubai's premium locations. Make informed property investment decisions with comprehensive inspection reports from Dubai Marina to Downtown Dubai.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="bg-brand-green text-white hover:bg-opacity-90 px-8 py-3">
                  Get Dubai Inspection Quote
                </Button>
              </Link>
              <a 
                href="tel:+971585686852"
                className="inline-flex items-center bg-transparent border-2 border-brand-green text-brand-green px-8 py-3 rounded-md font-semibold hover:bg-brand-green hover:text-white transition-colors"
              >
                <i className="fas fa-phone mr-2"></i>
                Call Dubai: +971 58 568 6852
              </a>
              <a 
                href="https://wa.me/971585686852?text=Hello! I need pre-purchase inspection services in Dubai."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-green-500 text-white px-8 py-3 rounded-md font-semibold hover:bg-green-600 transition-colors"
              >
                <i className="fab fa-whatsapp mr-2"></i>
                WhatsApp Dubai Team
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Inspection Process */}
      <section className="py-16 lg:py-20 bg-light-grey">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-black mb-4">
              Dubai Pre-Purchase Inspection Process
            </h2>
            <p className="text-lg text-text-grey max-w-2xl mx-auto">
              Our comprehensive inspection process ensures you have complete visibility into your Dubai property investment before making the purchase decision.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {inspectionAreas.map((area, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="bg-brand-green text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="font-bold">{index + 1}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-brand-black mb-2">{area.title}</h3>
                  <p className="text-text-grey mb-4">{area.description}</p>
                  <ul className="text-sm text-text-grey space-y-1">
                    {area.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center">
                        <i className="fas fa-check text-brand-green mr-2"></i>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Dubai Focus Areas */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-black mb-4">
              Pre-Purchase Inspection Coverage Across Dubai
            </h2>
            <p className="text-lg text-text-grey max-w-2xl mx-auto">
              We provide professional pre-purchase inspection services across all major Dubai developments and communities.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {focusAreas.map((area, index) => (
              <div key={index} className="bg-light-grey p-4 rounded-lg text-center">
                <h3 className="font-semibold text-brand-black">{area}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing & Service Levels */}
      <section className="py-16 lg:py-20 bg-light-grey">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-black mb-4">
              Dubai Pre-Purchase Inspection Packages
            </h2>
            <p className="text-lg text-text-grey max-w-2xl mx-auto">
              Comprehensive inspection packages tailored for Dubai property buyers, from apartments to luxury villas.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="relative">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold text-brand-black mb-4">Apartment Inspection</h3>
                <div className="text-3xl font-bold text-brand-green mb-4">AED 1,200</div>
                <p className="text-text-grey mb-6">Perfect for studio to 3BR apartments in Dubai</p>
                <ul className="text-left space-y-2 text-text-grey">
                  <li><i className="fas fa-check text-brand-green mr-2"></i>Structural assessment</li>
                  <li><i className="fas fa-check text-brand-green mr-2"></i>MEP systems check</li>
                  <li><i className="fas fa-check text-brand-green mr-2"></i>Interior & finishes</li>
                  <li><i className="fas fa-check text-brand-green mr-2"></i>Detailed report</li>
                  <li><i className="fas fa-check text-brand-green mr-2"></i>Same-day service</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative border-2 border-brand-green">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-brand-green text-white px-4 py-1 rounded-full text-sm font-semibold">Most Popular</span>
              </div>
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold text-brand-black mb-4">Villa Inspection</h3>
                <div className="text-3xl font-bold text-brand-green mb-4">AED 2,500</div>
                <p className="text-text-grey mb-6">Comprehensive villa inspection service</p>
                <ul className="text-left space-y-2 text-text-grey">
                  <li><i className="fas fa-check text-brand-green mr-2"></i>Full structural survey</li>
                  <li><i className="fas fa-check text-brand-green mr-2"></i>Complete MEP testing</li>
                  <li><i className="fas fa-check text-brand-green mr-2"></i>Exterior & landscaping</li>
                  <li><i className="fas fa-check text-brand-green mr-2"></i>Pool & amenities</li>
                  <li><i className="fas fa-check text-brand-green mr-2"></i>Comprehensive report</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold text-brand-black mb-4">Premium Inspection</h3>
                <div className="text-3xl font-bold text-brand-green mb-4">AED 3,500</div>
                <p className="text-text-grey mb-6">Luxury property comprehensive inspection</p>
                <ul className="text-left space-y-2 text-text-grey">
                  <li><i className="fas fa-check text-brand-green mr-2"></i>Executive villa inspection</li>
                  <li><i className="fas fa-check text-brand-green mr-2"></i>Advanced testing equipment</li>
                  <li><i className="fas fa-check text-brand-green mr-2"></i>Smart home systems</li>
                  <li><i className="fas fa-check text-brand-green mr-2"></i>Investment analysis</li>
                  <li><i className="fas fa-check text-brand-green mr-2"></i>Priority service</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-brand-black mb-4">
                Why Choose UrbanGrid for Dubai Pre-Purchase Inspections
              </h2>
              <p className="text-lg text-text-grey">
                Dubai's most trusted pre-purchase inspection specialists with extensive local market knowledge.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start">
                <div className="bg-brand-green text-white p-3 rounded-full mr-4 flex-shrink-0">
                  <i className="fas fa-user-tie"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-brand-black mb-2">Dubai Market Expertise</h3>
                  <p className="text-text-grey">Deep knowledge of Dubai property market, developers, and common issues in different communities.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-brand-green text-white p-3 rounded-full mr-4 flex-shrink-0">
                  <i className="fas fa-clock"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-brand-black mb-2">Same-Day Reports</h3>
                  <p className="text-text-grey">Receive your comprehensive inspection report within hours, not days, to make quick purchase decisions.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-brand-green text-white p-3 rounded-full mr-4 flex-shrink-0">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-brand-black mb-2">Comprehensive Coverage</h3>
                  <p className="text-text-grey">From structure to smart home systems, we inspect every aspect of your potential Dubai property investment.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-brand-green text-white p-3 rounded-full mr-4 flex-shrink-0">
                  <i className="fas fa-handshake"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-brand-black mb-2">Purchase Decision Support</h3>
                  <p className="text-text-grey">Expert advice to help you make informed decisions and negotiate better terms with sellers.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-brand-green text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready for Your Dubai Pre-Purchase Inspection?
          </h2>
          <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
            Protect your Dubai property investment with professional pre-purchase inspection services. Book your inspection today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:+971585686852"
              className="inline-flex items-center bg-white text-brand-green px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
            >
              <i className="fas fa-phone mr-2"></i>
              Call Dubai: +971 58 568 6852
            </a>
            
            <a 
              href="https://wa.me/971585686852?text=Hello%20UrbanGrid%2C%20I%20need%20pre-purchase%20inspection%20services%20in%20Dubai.%20Please%20provide%20more%20information."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-transparent border-2 border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-brand-green transition-colors"
            >
              <i className="fab fa-whatsapp mr-2"></i>
              WhatsApp Dubai Team
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}