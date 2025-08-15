import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function About() {
  const team = [
    {
      name: "Ahmed Al-Rashid",
      position: "Lead Inspector & Founder",
      experience: "12+ years",
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
      description: "Certified property inspector with extensive experience in UAE construction standards."
    },
    {
      name: "Sarah Mitchell",
      position: "Senior Property Inspector",
      experience: "8+ years",
      image: "https://images.unsplash.com/photo-1507101105822-7472b28e22ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
      description: "Specialized in luxury residential properties and commercial developments."
    },
    {
      name: "Mohammed Hassan",
      position: "Technical Inspector",
      experience: "6+ years",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
      description: "Expert in MEP systems and structural assessments for high-rise buildings."
    }
  ];

  const serviceAreas = [
    "Dubai",
    "Abu Dhabi", 
    "Sharjah",
    "Ajman",
    "Ras Al Khaimah",
    "Fujairah",
    "Umm Al Quwain"
  ];

  const achievements = [
    { number: "40000+", label: "Properties Inspected" },
    { number: "100%", label: "Client Satisfaction" },
    { number: "50+", label: "Partner Developers" },
    { number: "10+", label: "Years Experience" }
  ];

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-brand-black mb-6">
              About UrbanGrid
            </h1>
            <p className="text-xl text-text-grey leading-relaxed">
              Your trusted partner for professional property inspection and snagging services across the UAE, ensuring quality, compliance, and peace of mind.
            </p>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16 lg:py-20 bg-light-grey">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-6">
                Our Story & Mission
              </h2>
              <div className="space-y-6 text-text-grey">
                <p className="leading-relaxed">
                  Founded in 2014, UrbanGrid emerged from a simple yet powerful vision: to protect property investments across the UAE through meticulous inspection and quality assurance services. Our journey began when our founder, Ahmed Al-Rashid, recognized the need for independent, professional property inspections in Dubai's rapidly expanding real estate market.
                </p>
                <p className="leading-relaxed">
                  Today, we stand as one of the UAE's most trusted property inspection companies, having served over 2,000 clients across all seven emirates. Our commitment to excellence, attention to detail, and unwavering integrity has earned us the trust of homeowners, investors, developers, and contractors alike.
                </p>
                <p className="leading-relaxed">
                  Our mission is simple: to ensure that every property meets the highest standards of quality and safety, protecting our clients' investments and providing them with the confidence they need to make informed decisions.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              {achievements.map((achievement, index) => (
                <Card key={index} className="text-center p-6">
                  <CardContent className="p-0">
                    <div className="text-3xl font-bold text-brand-green mb-2">
                      {achievement.number}
                    </div>
                    <div className="text-text-grey font-medium">
                      {achievement.label}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-4">
              Meet Our Expert Team
            </h2>
            <p className="text-lg text-text-grey max-w-2xl mx-auto">
              Our certified professionals bring decades of combined experience in property inspection, construction, and quality assurance.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold text-brand-black mb-1">
                    {member.name}
                  </h3>
                  <div className="text-brand-green font-medium mb-2">
                    {member.position}
                  </div>
                  <div className="text-sm text-text-grey mb-4">
                    {member.experience} Experience
                  </div>
                  <p className="text-text-grey text-sm">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Service Coverage */}
      <section className="py-16 lg:py-20 bg-light-grey">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-4">
              Service Coverage Areas
            </h2>
            <p className="text-lg text-text-grey max-w-2xl mx-auto">
              We provide comprehensive property inspection services across all emirates of the UAE.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
              {serviceAreas.map((area, index) => (
                <div key={index} className="text-center">
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <i className="fas fa-map-marker-alt text-brand-green text-2xl mb-2"></i>
                    <div className="text-sm font-medium text-brand-black">{area}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center bg-white rounded-lg p-8 shadow-md">
              <h3 className="text-xl font-semibold text-brand-black mb-4">
                Nationwide Coverage
              </h3>
              <p className="text-text-grey mb-6">
                Our mobile inspection teams are strategically located across the UAE to provide prompt, professional service wherever you need it. We typically respond within 24 hours for urgent inspections.
              </p>
              <Link href="/contact">
                <Button className="bg-brand-green text-white hover:bg-opacity-90">
                  Schedule an Inspection
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-black mb-4">
              Certifications & Accreditations
            </h2>
            <p className="text-lg text-text-grey max-w-2xl mx-auto">
              Our commitment to excellence is recognized by leading industry bodies and regulatory authorities.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <i className="fas fa-certificate text-brand-green text-4xl mb-4"></i>
                <h3 className="text-lg font-semibold text-brand-black mb-2">RERA Certified</h3>
                <p className="text-sm text-text-grey">
                  Licensed by Dubai Real Estate Regulatory Agency
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <i className="fas fa-shield-alt text-brand-green text-4xl mb-4"></i>
                <h3 className="text-lg font-semibold text-brand-black mb-2">ISO 9001</h3>
                <p className="text-sm text-text-grey">
                  Quality Management System Certified
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <i className="fas fa-award text-brand-green text-4xl mb-4"></i>
                <h3 className="text-lg font-semibold text-brand-black mb-2">NACHI Member</h3>
                <p className="text-sm text-text-grey">
                  International Association of Certified Home Inspectors
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <i className="fas fa-building text-brand-green text-4xl mb-4"></i>
                <h3 className="text-lg font-semibold text-brand-black mb-2">Dubai Municipality</h3>
                <p className="text-sm text-text-grey">
                  Approved inspection services provider
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-brand-green text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Work with the Best?
          </h2>
          <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
            Join thousands of satisfied clients who trust UrbanGrid for their property inspection needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button className="bg-white text-brand-green hover:bg-gray-100">
                Get Free Consultation
              </Button>
            </Link>
            <Link href="/services">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-brand-green">
                View Our Services
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
