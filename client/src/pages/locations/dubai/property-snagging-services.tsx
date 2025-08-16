import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function PropertySnaggingServicesDubai() {
  const services = [
    {
      title: "Pre-Handover Snagging",
      icon: "fas fa-clipboard-check",
      description: "Comprehensive inspection before property handover",
      features: ["7-14 days before handover", "Complete defect identification", "Developer communication", "Priority defect listing", "Handover readiness assessment"],
      price: "AED 1,500+"
    },
    {
      title: "New Build Snagging Services",
      icon: "fas fa-hammer",
      description: "Specialized snagging for new construction properties",
      features: ["Construction quality review", "Building compliance check", "MEP systems testing", "Finish quality assessment", "Warranty documentation"],
      price: "AED 1,200+"
    },
    {
      title: "Villa Snagging Services",
      icon: "fas fa-home",
      description: "Complete villa snagging and inspection services",
      features: ["Interior & exterior inspection", "Pool and landscape review", "Smart home systems check", "Security systems testing", "Premium property focus"],
      price: "AED 2,800+"
    },
    {
      title: "Apartment Snagging Services",
      icon: "fas fa-building",
      description: "Apartment-focused snagging and quality assessment",
      features: ["Studio to penthouse coverage", "Balcony and terrace inspection", "Common area assessment", "Building amenities check", "Maintenance planning"],
      price: "AED 1,200+"
    },
    {
      title: "Commercial Snagging Services",
      icon: "fas fa-briefcase",
      description: "Professional commercial property snagging",
      features: ["Office space inspection", "Retail unit assessment", "Commercial compliance", "Business readiness review", "Investment protection"],
      price: "AED 2,000+"
    },
    {
      title: "Post-Renovation Snagging",
      icon: "fas fa-paint-brush",
      description: "Quality assessment after property renovations",
      features: ["Renovation quality check", "Contractor work review", "Compliance verification", "Safety assessment", "Final acceptance support"],
      price: "AED 1,000+"
    }
  ];

  const serviceProcess = [
    {
      step: "Initial Consultation",
      description: "Discuss your property snagging requirements and schedule inspection",
      duration: "15 minutes"
    },
    {
      step: "Property Assessment",
      description: "Comprehensive on-site snagging inspection using professional equipment",
      duration: "2-6 hours"
    },
    {
      step: "Report Generation",
      description: "Detailed snagging report with photos, priority levels, and recommendations",
      duration: "Same day"
    },
    {
      step: "Developer Communication",
      description: "Professional liaison with developers for defect resolution",
      duration: "Ongoing"
    },
    {
      step: "Follow-up Inspection",
      description: "Verification of completed repairs and final sign-off",
      duration: "1-2 hours"
    }
  ];

  const whyChooseUs = [
    {
      title: "Dubai Market Leaders",
      description: "Most experienced property snagging service in Dubai with 1000+ completed inspections",
      icon: "fas fa-trophy"
    },
    {
      title: "Same-Day Reports",
      description: "Receive your comprehensive snagging report within hours, not days",
      icon: "fas fa-clock"
    },
    {
      title: "All Property Types",
      description: "Complete snagging services for apartments, villas, commercial, and luxury properties",
      icon: "fas fa-th-large"
    },
    {
      title: "Professional Equipment",
      description: "Advanced inspection tools and technology for accurate defect identification",
      icon: "fas fa-tools"
    },
    {
      title: "Developer Relations",
      description: "Established relationships with major Dubai developers for effective resolution",
      icon: "fas fa-handshake"
    },
    {
      title: "Transparent Pricing",
      description: "Clear, upfront pricing with no hidden costs for all snagging services",
      icon: "fas fa-dollar-sign"
    }
  ];

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero Section - Targeting "property snagging services in dubai" (2,050 impressions) */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-brand-black mb-6">
              Property Snagging Services in Dubai: Comprehensive Snagging Solutions
            </h1>
            <p className="text-xl text-text-grey leading-relaxed mb-8">
              Professional property snagging services in Dubai offering complete inspection solutions for all property types. From pre-handover snagging to commercial inspections, we provide Dubai's most comprehensive snagging services.
            </p>
            <div className="bg-brand-green text-white p-4 rounded-lg inline-block mb-8">
              <p className="text-lg font-semibold">Dubai's #1 Property Snagging Services | 1000+ Properties Inspected | Same-Day Reports</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="bg-brand-green text-white hover:bg-opacity-90 px-8 py-3">
                  Book Snagging Service
                </Button>
              </Link>
              <a 
                href="tel:+971585686852"
                className="inline-flex items-center bg-transparent border-2 border-brand-green text-brand-green px-8 py-3 rounded-md font-semibold hover:bg-brand-green hover:text-white transition-colors"
              >
                <i className="fas fa-phone mr-2"></i>
                Call Dubai: +971 58 568 6852
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Property Snagging Services Grid */}
      <section className="py-16 lg:py-20 bg-light-grey">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-black mb-4">
              Complete Property Snagging Services in Dubai
            </h2>
            <p className="text-lg text-text-grey max-w-2xl mx-auto">
              Comprehensive range of professional snagging services covering all property types and inspection requirements in Dubai.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="bg-brand-green text-white w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <i className={`${service.icon} text-xl`}></i>
                  </div>
                  <h3 className="text-xl font-semibold text-brand-black mb-3">{service.title}</h3>
                  <p className="text-text-grey mb-4">{service.description}</p>
                  <div className="text-lg font-bold text-brand-green mb-4">{service.price}</div>
                  <ul className="space-y-2">
                    {service.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start text-sm text-text-grey">
                        <i className="fas fa-check text-brand-green mr-2 mt-1"></i>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Service Process */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-black mb-4">
              Our Property Snagging Service Process
            </h2>
            <p className="text-lg text-text-grey max-w-2xl mx-auto">
              Streamlined process ensuring comprehensive property snagging services with professional results.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {serviceProcess.map((step, index) => (
                <div key={index} className="flex items-start">
                  <div className="bg-brand-green text-white w-10 h-10 rounded-full flex items-center justify-center mr-6 flex-shrink-0">
                    <span className="font-bold">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-brand-black">{step.step}</h3>
                      <span className="text-sm text-brand-green font-medium">{step.duration}</span>
                    </div>
                    <p className="text-text-grey">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Our Services */}
      <section className="py-16 lg:py-20 bg-light-grey">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-black mb-4">
              Why Choose UrbanGrid Property Snagging Services
            </h2>
            <p className="text-lg text-text-grey max-w-2xl mx-auto">
              Dubai's most trusted property snagging service provider with proven expertise and exceptional results.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseUs.map((reason, index) => (
              <div key={index} className="text-center">
                <div className="bg-brand-green text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className={`${reason.icon} text-2xl`}></i>
                </div>
                <h3 className="text-lg font-semibold text-brand-black mb-3">{reason.title}</h3>
                <p className="text-text-grey">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Areas & Coverage */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-black mb-4">
              Dubai Property Snagging Service Coverage
            </h2>
            <p className="text-lg text-text-grey max-w-2xl mx-auto">
              Comprehensive snagging services available across all Dubai communities and property types.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <i className="fas fa-map-marked-alt text-4xl text-brand-green mb-4"></i>
                <h3 className="text-xl font-semibold text-brand-black mb-3">All Dubai Areas</h3>
                <p className="text-text-grey">Dubai Marina, Downtown, Business Bay, JLT, Dubai Hills, MBR City and all major developments</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <i className="fas fa-building text-4xl text-brand-green mb-4"></i>
                <h3 className="text-xl font-semibold text-brand-black mb-3">All Property Types</h3>
                <p className="text-text-grey">Apartments, villas, townhouses, commercial properties, and luxury developments</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <i className="fas fa-users text-4xl text-brand-green mb-4"></i>
                <h3 className="text-xl font-semibold text-brand-black mb-3">All Developer Projects</h3>
                <p className="text-text-grey">Emaar, DAMAC, Nakheel, Dubai Properties, Meraas and all major Dubai developers</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Overview */}
      <section className="py-16 lg:py-20 bg-light-grey">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-black mb-4">
              Property Snagging Service Pricing
            </h2>
            <p className="text-lg text-text-grey max-w-2xl mx-auto">
              Transparent, competitive pricing for professional property snagging services in Dubai.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto bg-white rounded-lg p-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-brand-black mb-4">Residential Properties</h3>
                <ul className="space-y-2 text-text-grey">
                  <li className="flex justify-between"><span>Studio/1BR Apartment</span><span className="font-semibold">AED 1,200</span></li>
                  <li className="flex justify-between"><span>2-3BR Apartment</span><span className="font-semibold">AED 1,500</span></li>
                  <li className="flex justify-between"><span>Penthouse/4BR+</span><span className="font-semibold">AED 2,000</span></li>
                  <li className="flex justify-between"><span>Villa/Townhouse</span><span className="font-semibold">AED 2,800</span></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-brand-black mb-4">Commercial Properties</h3>
                <ul className="space-y-2 text-text-grey">
                  <li className="flex justify-between"><span>Small Office</span><span className="font-semibold">AED 1,500</span></li>
                  <li className="flex justify-between"><span>Large Office</span><span className="font-semibold">AED 2,500</span></li>
                  <li className="flex justify-between"><span>Retail Unit</span><span className="font-semibold">AED 2,000</span></li>
                  <li className="flex justify-between"><span>Warehouse/Industrial</span><span className="font-semibold">AED 3,000</span></li>
                </ul>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <p className="text-text-grey">All prices include comprehensive inspection, same-day reporting, and developer communication</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-brand-green text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready for Professional Property Snagging Services?
          </h2>
          <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
            Protect your Dubai property investment with comprehensive snagging services. Contact Dubai's leading property inspection experts today.
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
              href="https://wa.me/971585686852?text=Hello%20UrbanGrid%2C%20I%20need%20property%20snagging%20services%20in%20Dubai.%20Please%20provide%20service%20details%20and%20pricing."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-transparent border-2 border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-brand-green transition-colors"
            >
              <i className="fab fa-whatsapp mr-2"></i>
              Get Service Quote
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}