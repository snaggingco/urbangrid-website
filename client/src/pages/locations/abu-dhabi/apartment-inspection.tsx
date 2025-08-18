import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function ApartmentInspectionAbuDhabi() {
  const apartmentAreas = [
    "Al Reem Island", "Corniche Area", "Capital Gate District", "Saadiyat Island",
    "Yas Island", "Al Reef", "Khalifa City", "Mohammed Bin Zayed City",
    "Masdar City", "Marina Village"
  ];

  const apartmentServices = [
    {
      title: "Capital District Apartment Inspection",
      description: "Premium inspection for government district and business area apartments",
      price: "From AED 1 / Sq.ft",
      features: ["Government standards compliance", "Business district specifications", "Premium finish quality", "Professional tenant standards"]
    },
    {
      title: "Island Tower Apartment Assessment",
      description: "Specialized service for Al Reem and Saadiyat Island high-rises",
      price: "From AED 1 / Sq.ft",
      features: ["Island infrastructure integration", "High-rise tower systems", "Marina and water views", "Resort-style amenities"]
    },
    {
      title: "Cultural District Luxury Inspection",
      description: "Expert evaluation for Saadiyat Cultural District apartments",
      price: "From AED 1 / Sq.ft",
      features: ["Cultural district standards", "Museum-quality finishes", "International compliance", "Premium amenity access"]
    }
  ];

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-brand-black mb-6">
              Apartment Inspection Abu Dhabi: Capital City Flat Snagging
            </h1>
            <p className="text-xl text-text-grey leading-relaxed mb-8">
              Professional apartment inspection services across Abu Dhabi's premier towers. From Al Reem Island high-rises to Corniche luxury apartments, we ensure capital city quality standards.
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
                Call Abu Dhabi: +971585686852
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Apartment Services */}
      <section className="py-16 lg:py-20 bg-light-grey">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-12 text-center">
            Abu Dhabi Apartment Inspection Services
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

      {/* Apartment Areas */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-12 text-center">
            Abu Dhabi Apartment Areas We Serve
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {apartmentAreas.map((area, index) => (
              <div key={index} className="bg-light-grey p-3 rounded-lg text-center shadow-sm hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-brand-black">{area}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-20 bg-brand-green text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Expert Apartment Inspection in Abu Dhabi
          </h2>
          <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
            Ensure your Abu Dhabi apartment investment with capital city's leading inspection experts. From AED 1 / Sq.ft.
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