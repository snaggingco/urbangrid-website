import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Shield, CheckCircle2, Award, Building2 } from "lucide-react";

export default function About() {
  const achievements = [
    { number: "40,000+", label: "Properties Inspected" },
    { number: "100%", label: "Client Satisfaction" },
    { number: "50+", label: "Partner Developers" },
    { number: "10+", label: "Years Experience" }
  ];

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
      position: "Senior Surveyor",
      experience: "8+ years",
      image: "https://images.unsplash.com/photo-1507101105822-7472b28e22ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
      description: "Specialized in luxury residential properties and commercial developments."
    },
    {
      name: "Xi Liang",
      position: "Technical Inspector",
      experience: "6+ years",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
      description: "Expert in MEP systems and structural assessments for high-rise buildings."
    }
  ];

  const serviceAreas = [
    "Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah", "Fujairah", "Umm Al Quwain"
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=900&q=80')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/50 to-zinc-950" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full">
          <p className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] text-brand-green uppercase mb-6">About</p>
          <h1 className="text-6xl sm:text-7xl lg:text-[7rem] xl:text-[8rem] font-bold leading-[0.95] tracking-tight text-white max-w-4xl">
            The UAE's Most Trusted Snagging Company
          </h1>
          <div className="mt-12">
            <Link href="/contact">
              <Button className="bg-brand-green text-white hover:bg-opacity-90 rounded-none h-14 px-10 text-xs font-bold tracking-widest">
                BOOK AN INSPECTION
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50">
          <span className="text-[10px] uppercase tracking-[0.2em]">Scroll to explore</span>
          <div className="w-px h-12 bg-gradient-to-b from-brand-green to-transparent" />
        </div>
      </section>

      {/* Story Section */}
      <section className="py-28 lg:py-40 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32">
            <div>
              <p className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] text-brand-green uppercase mb-6">OUR MISSION</p>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-zinc-900 leading-tight mb-10">
                Integrity in every <br />inspection.
              </h2>
              <div className="space-y-8 text-lg text-zinc-500 font-light leading-relaxed">
                <p>
                  Founded in 2014, UrbanGrid emerged from a simple yet powerful vision: to protect property investments across the UAE through meticulous inspection and quality assurance services.
                </p>
                <p>
                  Today, we stand as one of the UAE's most trusted property inspection companies, having served over 40,000 clients across all seven emirates. Our commitment to excellence, attention to detail, and unwavering integrity has earned us the trust of homeowners, investors, developers, and contractors alike.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-px bg-zinc-100 border border-zinc-100">
              {achievements.map((achievement, index) => (
                <div key={index} className="bg-white p-10 flex flex-col justify-center">
                  <div className="text-5xl sm:text-6xl font-bold text-brand-green leading-none mb-4">
                    {achievement.number}
                  </div>
                  <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                    {achievement.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Chapter Break - Team */}
      <section className="relative py-40 min-h-[60vh] flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1507101105822-7472b28e22ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=600&q=80')` }}
        />
        <div className="absolute inset-0 bg-zinc-950/70 backdrop-grayscale" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 text-center">
          <p className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] text-brand-green uppercase mb-6">EXPERTISE</p>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight">
            Our Expert Team
          </h2>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-28 lg:py-40 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-24">
            {team.map((member, index) => (
              <div key={index} className="group">
                <div className="aspect-[4/5] overflow-hidden mb-8 grayscale hover:grayscale-0 transition-all duration-700">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 mb-2">
                  {member.name}
                </h3>
                <div className="text-[10px] uppercase tracking-[0.2em] text-brand-green font-bold mb-6">
                  {member.position} · {member.experience}
                </div>
                <p className="text-zinc-500 font-light leading-relaxed">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage Section */}
      <section className="py-28 lg:py-40 bg-zinc-950 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex flex-col lg:flex-row items-baseline gap-8 mb-20">
            <p className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] text-brand-green uppercase">COVERAGE</p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">Across the UAE</h2>
          </div>
          
          <div className="relative">
            <div className="flex flex-wrap gap-x-12 gap-y-8 items-center border-t border-zinc-800 pt-16">
              {serviceAreas.map((area, index) => (
                <div key={index} className="flex items-center group cursor-default">
                  <span className="text-2xl sm:text-3xl font-bold text-zinc-700 group-hover:text-brand-green transition-colors duration-300 uppercase tracking-tighter">
                    {area}
                  </span>
                  {index < serviceAreas.length - 1 && (
                    <div className="hidden sm:block ml-12 w-1.5 h-1.5 rounded-full bg-zinc-800" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-28 lg:py-40 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="text-center mb-20">
            <p className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] text-brand-green uppercase mb-6">ACCREDITATIONS</p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-zinc-900 mb-4">Certifications</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-100 border border-zinc-100">
            <div className="bg-white p-12 text-center group">
              <Shield className="w-10 h-10 text-brand-green mx-auto mb-8 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-zinc-900 mb-4 uppercase tracking-wide">RERA Certified</h3>
              <p className="text-sm text-zinc-500 font-light">Licensed by Dubai Real Estate Regulatory Agency</p>
            </div>
            <div className="bg-white p-12 text-center group">
              <CheckCircle2 className="w-10 h-10 text-brand-green mx-auto mb-8 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-zinc-900 mb-4 uppercase tracking-wide">ISO 9001</h3>
              <p className="text-sm text-zinc-500 font-light">Quality Management System Certified</p>
            </div>
            <div className="bg-white p-12 text-center group">
              <Award className="w-10 h-10 text-brand-green mx-auto mb-8 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-zinc-900 mb-4 uppercase tracking-wide">NACHI Member</h3>
              <p className="text-sm text-zinc-500 font-light">International Association of Certified Home Inspectors</p>
            </div>
            <div className="bg-white p-12 text-center group">
              <Building2 className="w-10 h-10 text-brand-green mx-auto mb-8 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-zinc-900 mb-4 uppercase tracking-wide">Municipality</h3>
              <p className="text-sm text-zinc-500 font-light">Approved inspection services provider</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 lg:py-40 bg-zinc-950 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-green/5 -skew-x-12 translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-16">
            <div className="max-w-2xl">
              <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-8">
                Ready to work <br /><span className="text-brand-green">with the best?</span>
              </h2>
              <p className="text-lg text-zinc-400 font-light max-w-lg leading-relaxed">
                Join thousands of satisfied clients who trust UrbanGrid for their property inspection needs across the UAE.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link href="/contact">
                <Button className="bg-brand-green text-white hover:bg-opacity-90 rounded-none h-16 px-12 text-xs font-bold tracking-widest transition-all hover:gap-4">
                  GET FREE CONSULTATION <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/services">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-zinc-950 rounded-none h-16 px-12 text-xs font-bold tracking-widest bg-transparent transition-all">
                  VIEW SERVICES
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
