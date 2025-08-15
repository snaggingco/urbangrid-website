import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Services() {
  const services = [
    {
      id: 1,
      title: "New Build Handover Snagging & Inspection",
      slug: "new-build-snagging",
      description: "Comprehensive pre-handover inspection of newly constructed properties to identify defects, incomplete work, and quality issues before you take possession.",
      icon: "fas fa-clipboard-list",
      features: [
        "Complete structural assessment",
        "MEP systems inspection",
        "Finishing quality evaluation",
        "Compliance verification",
        "Detailed defect report",
        "Follow-up inspections"
      ],
      duration: "4-8 hours",
      price: "From AED 1,500"
    },
    {
      id: 2,
      title: "Post Renovation / Fit-out Snagging Inspection",
      slug: "post-renovation-inspection",
      description: "Quality assessment after renovation or fit-out work to ensure all improvements meet specifications and industry standards.",
      icon: "fas fa-hammer",
      features: [
        "Renovation work quality check",
        "Material compliance verification",
        "Safety standards assessment",
        "Workmanship evaluation",
        "Before/after comparison",
        "Warranty documentation"
      ],
      duration: "3-6 hours",
      price: "From AED 1,200"
    },
    {
      id: 3,
      title: "Property Defect Liability Period (DLP) Snagging",
      slug: "dlp-snagging",
      description: "Strategic inspection during the defect liability period to identify and document all issues before warranty expires.",
      icon: "fas fa-file-alt",
      features: [
        "Pre-warranty expiry inspection",
        "Comprehensive defect catalog",
        "Developer liaison support",
        "Rectification tracking",
        "Legal documentation",
        "Multiple follow-ups"
      ],
      duration: "5-9 hours",
      price: "From AED 1,800"
    },
    {
      id: 4,
      title: "Property Move-in / Move-out Snagging",
      slug: "move-in-move-out",
      description: "Detailed condition reports for rental properties to protect both tenants and landlords during property transitions.",
      icon: "fas fa-key",
      features: [
        "Comprehensive condition report",
        "Photo documentation",
        "Damage assessment",
        "Security deposit protection",
        "Legal compliance",
        "Tenant/landlord mediation"
      ],
      duration: "2-4 hours",
      price: "From AED 800"
    },
    {
      id: 5,
      title: "Secondary Market Property Snagging",
      slug: "secondary-market",
      description: "Pre-purchase inspections for existing properties to help buyers make informed decisions and negotiate fair prices.",
      icon: "fas fa-search",
      features: [
        "Pre-purchase inspection",
        "Market value assessment",
        "Hidden defect detection",
        "Maintenance requirement analysis",
        "Negotiation support",
        "Investment protection"
      ],
      duration: "3-5 hours",
      price: "From AED 1,000"
    },
    {
      id: 6,
      title: "Developer and Contractor Project Snagging",
      slug: "developer-projects",
      description: "Quality control inspections for developers and contractors to ensure projects meet industry standards and client expectations.",
      icon: "fas fa-users",
      features: [
        "Quality control auditing",
        "Progress milestone verification",
        "Compliance monitoring",
        "Standards enforcement",
        "Client satisfaction assurance",
        "Reputation protection"
      ],
      duration: "6-12 hours",
      price: "Custom Quote"
    }
  ];

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-brand-black mb-6">
              Our Professional Services
            </h1>
            <p className="text-xl text-text-grey leading-relaxed">
              Comprehensive property inspection and snagging services across the UAE, ensuring your investment meets the highest standards of quality and compliance.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 lg:py-20 bg-light-grey">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card key={service.id} className="bg-white overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className="service-icon mb-6">
                    <i className={service.icon}></i>
                  </div>
                  <h2 className="text-2xl font-semibold text-brand-black mb-4">
                    {service.title}
                  </h2>
                  <p className="text-text-grey mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  <div className="space-y-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-semibold text-brand-green mb-2">Key Features:</div>
                        <ul className="text-sm text-text-grey space-y-1">
                          {service.features.slice(0, 3).map((feature, index) => (
                            <li key={index} className="flex items-center">
                              <i className="fas fa-check text-brand-green mr-2"></i>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <i className="fas fa-clock text-brand-green mr-2"></i>
                          <span className="text-text-grey">Duration: {service.duration}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <i className="fas fa-tag text-brand-green mr-2"></i>
                          <span className="text-text-grey">{service.price}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href={`/services/${service.slug}`}>
                      <a onClick={() => window.scrollTo(0, 0)}>
                        <Button className="bg-brand-green text-white hover:bg-opacity-90 w-full">
                          Learn More
                        </Button>
                      </a>
                    </Link>
                    <Link href="/contact">
                      <Button variant="outline" className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white flex-1">
                        Get Quote
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-4">
              Our Inspection Process
            </h2>
            <p className="text-lg text-text-grey max-w-2xl mx-auto">
              A systematic approach ensuring thorough, professional, and reliable property inspections every time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-brand-green text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-brand-black mb-2">Consultation</h3>
              <p className="text-text-grey">
                Initial discussion to understand your requirements and schedule the inspection.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-brand-green text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-brand-black mb-2">Inspection</h3>
              <p className="text-text-grey">
                Comprehensive on-site examination using professional tools and expertise.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-brand-green text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-brand-black mb-2">Reporting</h3>
              <p className="text-text-grey">
                Detailed report with photos, findings, and professional recommendations.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-brand-green text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="text-xl font-semibold text-brand-black mb-2">Follow-up</h3>
              <p className="text-text-grey">
                Ongoing support and follow-up inspections as needed for your peace of mind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-brand-green text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Schedule Your Inspection?
          </h2>
          <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
            Protect your property investment with professional inspection services from UAE's most trusted experts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button className="bg-white text-brand-green hover:bg-gray-100">
                Get Free Consultation
              </Button>
            </Link>
            <a
              href="tel:+971501234567"
              className="inline-flex items-center bg-transparent border-2 border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-brand-green transition-colors"
            >
              <i className="fas fa-phone mr-2"></i>
              Call Now: +971 50 123 4567
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}