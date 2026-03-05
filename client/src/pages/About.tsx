import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, CheckCircle2, Shield, Award, Building2 } from "lucide-react";

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
    <div className="pt-16">
      {/* Hero Section */}
      <section className="pt-24 pb-20 bg-zinc-950">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">About</p>
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold text-white leading-tight mb-6">
            About UrbanGrid
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl">
            Your trusted partner for professional property inspection and snagging services across the UAE, ensuring quality, compliance, and peace of mind.
          </p>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">OUR STORY & MISSION</p>
              <h2 className="text-4xl lg:text-5xl font-bold text-zinc-900 leading-tight mb-8">
                Integrity in every <br />inspection.
              </h2>
              <div className="space-y-6 text-sm text-zinc-500 leading-relaxed">
                <p>
                  Founded in 2014, UrbanGrid emerged from a simple yet powerful vision: to protect property investments across the UAE through meticulous inspection and quality assurance services. Our journey began when our founder, Ahmed Al-Rashid, recognized the need for independent, professional property inspections in Dubai's rapidly expanding real estate market.
                </p>
                <p>
                  Today, we stand as one of the UAE's most trusted property inspection companies, having served over 2,000 clients across all seven emirates. Our commitment to excellence, attention to detail, and unwavering integrity has earned us the trust of homeowners, investors, developers, and contractors alike.
                </p>
                <p>
                  Our mission is simple: to ensure that every property meets the highest standards of quality and safety, protecting our clients' investments and providing them with the confidence they need to make informed decisions.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 border-t border-l border-zinc-100">
              {achievements.map((achievement, index) => (
                <div key={index} className="p-10 border-r border-b border-zinc-100">
                  <div className="text-4xl font-bold text-brand-green mb-2">
                    {achievement.number}
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-400 font-medium">
                    {achievement.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="py-24 lg:py-32 bg-zinc-50">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
            <div className="max-w-2xl">
              <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">TEAM</p>
              <h2 className="text-4xl lg:text-5xl font-bold text-zinc-900 leading-tight">
                Meet Our Expert Team
              </h2>
            </div>
            <p className="text-sm text-zinc-500 max-w-sm">
              Our certified professionals bring decades of combined experience in property inspection, construction, and quality assurance.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {team.map((member, index) => (
              <div key={index} className="group">
                <div className="aspect-square overflow-hidden mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 mb-1">
                  {member.name}
                </h3>
                <div className="text-[10px] uppercase tracking-[0.18em] text-brand-green font-semibold mb-4">
                  {member.position} · {member.experience}
                </div>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Coverage */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
            <div className="max-w-2xl">
              <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">COVERAGE</p>
              <h2 className="text-4xl lg:text-5xl font-bold text-zinc-900 leading-tight">
                Service Coverage Areas
              </h2>
            </div>
            <p className="text-sm text-zinc-500 max-w-sm">
              We provide comprehensive property inspection services across all emirates of the UAE.
            </p>
          </div>
          
          <div className="border-y border-zinc-100 py-12">
            <div className="flex flex-wrap items-center justify-between gap-y-8">
              {serviceAreas.map((area, index) => (
                <div key={index} className="flex items-center">
                  <span className="text-sm font-bold text-zinc-900 uppercase tracking-widest">{area}</span>
                  {index < serviceAreas.length - 1 && (
                    <span className="mx-6 text-zinc-200">|</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-lg font-bold text-zinc-900 mb-4">
                Nationwide Coverage
              </h3>
              <p className="text-sm text-zinc-500 leading-relaxed mb-8">
                Our mobile inspection teams are strategically located across the UAE to provide prompt, professional service wherever you need it. We typically respond within 24 hours for urgent inspections.
              </p>
              <Link href="/contact">
                <a className="inline-flex items-center gap-2 text-xs font-semibold text-brand-green border-b border-brand-green pb-0.5 hover:gap-3 transition-all">
                  SCHEDULE AN INSPECTION <ArrowRight className="w-3 h-3" />
                </a>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-24 lg:py-32 bg-zinc-50">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="text-center mb-16">
            <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">ACCREDITATIONS</p>
            <h2 className="text-4xl lg:text-5xl font-bold text-zinc-900 leading-tight mb-4">
              Certifications
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-8 border border-zinc-200 bg-transparent">
              <Shield className="w-8 h-8 text-brand-green mb-6" />
              <h3 className="text-lg font-bold text-zinc-900 mb-2">RERA Certified</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Licensed by Dubai Real Estate Regulatory Agency
              </p>
            </div>
            
            <div className="p-8 border border-zinc-200 bg-transparent">
              <CheckCircle2 className="w-8 h-8 text-brand-green mb-6" />
              <h3 className="text-lg font-bold text-zinc-900 mb-2">ISO 9001</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Quality Management System Certified
              </p>
            </div>
            
            <div className="p-8 border border-zinc-200 bg-transparent">
              <Award className="w-8 h-8 text-brand-green mb-6" />
              <h3 className="text-lg font-bold text-zinc-900 mb-2">NACHI Member</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                International Association of Certified Home Inspectors
              </p>
            </div>
            
            <div className="p-8 border border-zinc-200 bg-transparent">
              <Building2 className="w-8 h-8 text-brand-green mb-6" />
              <h3 className="text-lg font-bold text-zinc-900 mb-2">Dubai Municipality</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Approved inspection services provider
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32 bg-zinc-950 text-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12">
            <div className="max-w-2xl">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                Ready to Work <br />with the Best?
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Join thousands of satisfied clients who trust UrbanGrid for their property inspection needs.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link href="/contact">
                <Button className="bg-brand-green text-white hover:bg-opacity-90 rounded-none h-12 px-8">
                  GET FREE CONSULTATION
                </Button>
              </Link>
              <Link href="/services">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-zinc-950 rounded-none h-12 px-8 bg-transparent">
                  VIEW OUR SERVICES
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
