import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function ApartmentInspectionDubai() {
  const towerAreas = [
    "Dubai Marina", "Downtown Dubai", "Business Bay", "Jumeirah Lake Towers",
    "DIFC", "Jumeirah Beach Residence", "Dubai Creek Harbour", "Dubai South",
    "Jumeirah Village Circle", "Dubai Investment Park"
  ];

  const apartmentServices = [
    {
      title: "High-Rise Apartment Inspection",
      description: "Specialized inspection for Dubai's iconic tower apartments",
      price: "From AED 1 / Sq.ft",
      features: ["Complete apartment assessment", "Balcony & terrace safety", "MEP systems check", "View & privacy verification"]
    },
    {
      title: "Luxury Apartment Snagging",
      description: "Premium service for high-end apartment developments",
      price: "From AED 1 / Sq.ft",
      features: ["Luxury finish inspection", "High-end appliance testing", "Smart home features", "Premium material verification"]
    },
    {
      title: "Studio & 1BR Quick Inspection",
      description: "Efficient inspection service for smaller apartment units",
      price: "From AED 1 / Sq.ft",
      features: ["Essential systems check", "Finish quality assessment", "Basic defect identification", "Quick turnaround report"]
    }
  ];

  const highRiseExpertise = [
    {
      icon: "fas fa-building",
      title: "High-Rise Expertise",
      description: "Specialized knowledge of tower-specific systems and regulations"
    },
    {
      icon: "fas fa-elevator",
      title: "Vertical Transportation",
      description: "Elevator access, functionality, and emergency systems assessment"
    },
    {
      icon: "fas fa-wind",
      title: "Wind & Weather Resistance",
      description: "High-altitude weather sealing and structural integrity"
    },
    {
      icon: "fas fa-eye",
      title: "Views & Privacy",
      description: "Window quality, view obstructions, and privacy considerations"
    }
  ];

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-brand-black mb-6">
              Apartment Inspection Dubai: High-Rise Flat Snagging Services
            </h1>
            <p className="text-xl text-text-grey leading-relaxed mb-8">
              Professional apartment inspection services across Dubai's premier towers. From Dubai Marina high-rises to Downtown luxury apartments, we ensure your flat meets quality standards.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="bg-brand-green text-white hover:bg-opacity-90 px-8 py-3">
                  Get Free Apartment Quote
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

      {/* Apartment Services */}
      <section className="py-16 lg:py-20 bg-light-grey">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-12 text-center">
            Dubai Apartment Inspection Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {apartmentServices.map((service, index) => (
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

      {/* High-Rise Expertise */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-12 text-center">
            Dubai High-Rise Apartment Expertise
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {highRiseExpertise.map((item, index) => (
              <div key={index} className="text-center">
                <div className="bg-brand-green text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className={`${item.icon} text-2xl`}></i>
                </div>
                <h3 className="font-semibold text-brand-black mb-2">{item.title}</h3>
                <p className="text-text-grey text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tower Areas */}
      <section className="py-16 lg:py-20 bg-light-grey">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-12 text-center">
            Dubai Tower Communities We Serve
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {towerAreas.map((area, index) => (
              <div key={index} className="bg-white p-3 rounded-lg text-center shadow-sm hover:shadow-md transition-shadow">
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
            Professional Apartment Inspection in Dubai
          </h2>
          <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
            Ensure your Dubai apartment investment with expert high-rise inspection services. From AED 1 / Sq.ft.
          </p>
          <Link href="/contact">
            <Button className="bg-white text-brand-green hover:bg-gray-100 px-8 py-3">
              Book Apartment Inspection
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}