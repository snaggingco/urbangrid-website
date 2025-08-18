import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function DLPSnaggingDubai() {
  const dlpServices = [
    {
      title: "12-Month DLP Inspection",
      description: "Comprehensive inspection at the end of your defects liability period",
      price: "Starting from AED 1,800",
      features: ["Complete property re-inspection", "Outstanding defect verification", "New defect identification", "Developer liaison support"]
    },
    {
      title: "6-Month Mid-Term Review",
      description: "Optional mid-term inspection to track defect rectification progress",
      price: "Starting from AED 1,200",
      features: ["Progress assessment", "Defect tracking", "Developer communication", "Priority defect focus"]
    },
    {
      title: "DLP Documentation Service",
      description: "Professional documentation and legal support for warranty claims",
      price: "Starting from AED 800",
      features: ["Legal documentation", "RERA compliance", "Developer correspondence", "Warranty claim preparation"]
    }
  ];

  const dlpBenefits = [
    {
      icon: "fas fa-calendar-check",
      title: "12-Month Warranty Period",
      description: "Full utilization of your defects liability period with expert guidance"
    },
    {
      icon: "fas fa-handshake",
      title: "Developer Relations",
      description: "Professional communication with developers for efficient defect resolution"
    },
    {
      icon: "fas fa-gavel",
      title: "RERA Compliance",
      description: "Full compliance with Dubai's Real Estate Regulatory Agency requirements"
    },
    {
      icon: "fas fa-shield-alt",
      title: "Legal Protection",
      description: "Comprehensive documentation for potential legal proceedings"
    }
  ];

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-brand-black mb-6">
              DLP Snagging Dubai: Defects Liability Period Warranty Inspection
            </h1>
            <p className="text-xl text-text-grey leading-relaxed mb-8">
              Expert DLP snagging services across Dubai ensuring you maximize your 12-month warranty period. Professional documentation and developer liaison for optimal defect resolution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="bg-brand-green text-white hover:bg-opacity-90 px-8 py-3">
                  Get Free DLP Quote
                </Button>
              </Link>
              <a 
                href="tel:+971585686852"
                className="inline-flex items-center bg-transparent border-2 border-brand-green text-brand-green px-8 py-3 rounded-md font-semibold hover:bg-brand-green hover:text-white transition-colors"
              >
                <i className="fas fa-phone mr-2"></i>
                Call Dubai: +971585686852
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* DLP Services */}
      <section className="py-16 lg:py-20 bg-light-grey">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-12 text-center">
            Dubai DLP Snagging Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {dlpServices.map((service, index) => (
              <Card key={index} className="bg-white hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-brand-black mb-4">{service.title}</h3>
                  <p className="text-text-grey mb-4">{service.description}</p>
                  <div className="text-2xl font-bold text-brand-green mb-4">{service.price}</div>
                  <ul className="space-y-2">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-text-grey">
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

      {/* DLP Benefits */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-12 text-center">
            Dubai DLP Snagging Benefits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {dlpBenefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="bg-brand-green text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className={`${benefit.icon} text-2xl`}></i>
                </div>
                <h3 className="font-semibold text-brand-black mb-2">{benefit.title}</h3>
                <p className="text-text-grey text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Legal Framework */}
      <section className="py-16 lg:py-20 bg-light-grey">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-8 text-center">
              Dubai DLP Legal Framework
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-brand-black mb-4">RERA Regulations</h3>
                <ul className="space-y-2 text-text-grey">
                  <li>• 12-month defects liability period</li>
                  <li>• Developer obligations and responsibilities</li>
                  <li>• Mandatory defect rectification requirements</li>
                  <li>• Legal documentation standards</li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-brand-black mb-4">Legal Compliance</h3>
                <ul className="space-y-2 text-text-grey">
                  <li>• Professional inspection documentation</li>
                  <li>• Admissible evidence for disputes</li>
                  <li>• RERA compliant reporting</li>
                  <li>• Developer communication protocols</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-brand-green text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Maximize Your DLP Period in Dubai
          </h2>
          <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
            Don't let your warranty period expire without professional DLP snagging. Expert service from AED 1,800.
          </p>
          <Link href="/contact">
            <Button className="bg-white text-brand-green hover:bg-gray-100 px-8 py-3">
              Book DLP Inspection
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}