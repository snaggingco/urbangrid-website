import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, CheckCircle2, Shield, Award, Building2 } from "lucide-react";
import SEO from "@/components/SEO";

export default function About() {
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
    { number: "7", label: "Emirates Served" },
    { number: "24h", label: "Report Target" },
    { number: "UAE", label: "Independent Consultancy" }
  ];

  return (
    <>
      <SEO
        title="About UrbanGrid - Property Inspection Experts in UAE"
        description="UrbanGrid provides independent property snagging and inspection services across the UAE using documented NFPA, ASHRAE and ASTM references."
      />
    <div className="pt-16">
      {/* Hero Section */}
      <section className="pt-24 pb-20 bg-zinc-950">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <p className="text-[10px] font-semibold tracking-[0.25em] text-white uppercase mb-4">About</p>
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold text-white leading-tight mb-6">
            About UrbanGrid
          </h1>
          <p className="text-sm text-zinc-500 leading-relaxed max-w-2xl">
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
                  UrbanGrid provides independent property inspection and building consultancy services across the UAE. Our work is structured around clear site evidence, practical technical reporting and service scopes that help owners, investors, developers and property managers make informed decisions.
                </p>
                <p>
                  UrbanGrid reports completing more than 40,000 property inspections across all seven emirates. Our work supports homeowners, investors, developers, brokers, and contractors with independent findings and photographic evidence.
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
                  <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500 font-medium">
                    {achievement.label}
                  </div>
                </div>
              ))}
            </div>
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
              <Link href="/contact" className="inline-flex items-center gap-2 text-xs font-semibold text-brand-green border-b border-brand-green pb-0.5 hover:gap-3 transition-all">
                SCHEDULE AN INSPECTION <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* International Network */}
      <section className="py-24 lg:py-32 bg-zinc-50">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
            <div className="max-w-2xl">
              <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">GLOBAL PRESENCE</p>
              <h2 className="text-4xl lg:text-5xl font-bold text-zinc-900 leading-tight">
                Our International Network
              </h2>
            </div>
            <p className="text-sm text-zinc-500 max-w-sm">
              UrbanGrid operates across four markets through a network of sister companies, each delivering the same engineering rigour and inspection standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-100 border border-zinc-100">
            {/* KSA */}
            <div className="bg-white p-10 flex flex-col gap-6">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.25em] text-zinc-400 uppercase mb-2">Saudi Arabia</p>
                <h3 className="text-xl font-bold text-zinc-900 mb-3">Strata Surveyor</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Delivering independent property snagging and building inspection services across Riyadh, Jeddah, and the wider Kingdom. Trusted partner for Vision 2030 real estate developments.
                </p>
              </div>
              <a
                href="https://www.stratasurveyor.com"
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 text-xs font-semibold text-brand-green border-b border-brand-green pb-0.5 hover:gap-3 transition-all w-fit"
              >
                SNAGGING COMPANY IN SAUDI ARABIA <ArrowRight className="w-3 h-3" />
              </a>
            </div>

            {/* India */}
            <div className="bg-white p-10 flex flex-col gap-6">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.25em] text-zinc-400 uppercase mb-2">India</p>
                <h3 className="text-xl font-bold text-zinc-900 mb-3">Snagging.in</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  India's specialist property snagging and pre-handover inspection service, covering major cities including Mumbai, Bangalore, Hyderabad, and Pune for residential and commercial developments.
                </p>
              </div>
              <a
                href="https://www.snagging.in"
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 text-xs font-semibold text-brand-green border-b border-brand-green pb-0.5 hover:gap-3 transition-all w-fit"
              >
                PROPERTY SNAGGING IN INDIA <ArrowRight className="w-3 h-3" />
              </a>
            </div>

            {/* UK */}
            <div className="bg-white p-10 flex flex-col gap-6">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.25em] text-zinc-400 uppercase mb-2">United Kingdom</p>
                <h3 className="text-xl font-bold text-zinc-900 mb-3">UrbanGrid UK</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Professional property snagging and new-build inspection across England, Scotland, and Wales. Helping UK buyers protect their investment from day one with RICS-aligned reporting.
                </p>
              </div>
              <a
                href="https://www.urbangrid.co.uk"
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 text-xs font-semibold text-brand-green border-b border-brand-green pb-0.5 hover:gap-3 transition-all w-fit"
              >
                PROPERTY SNAGGING IN THE UK <ArrowRight className="w-3 h-3" />
              </a>
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
              <h3 className="text-lg font-bold text-zinc-900 mb-2">RERA-Regulated Consultancy</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                UrbanGrid operates as a real estate consultancy in Dubai's regulated property-services environment.
              </p>
            </div>
            
            <div className="p-8 border border-zinc-200 bg-transparent">
              <Award className="w-8 h-8 text-brand-green mb-6" />
              <h3 className="text-lg font-bold text-zinc-900 mb-2">Certified Inspectors</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Property inspections are supported by inspectors holding recognised home-inspection credentials, including InterNACHI certification.
              </p>
            </div>
            
            <div className="p-8 border border-zinc-200 bg-transparent">
              <CheckCircle2 className="w-8 h-8 text-brand-green mb-6" />
              <h3 className="text-lg font-bold text-zinc-900 mb-2">Independent Reporting</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Findings are documented with photographs, observations and practical recommendations for client decision-making.
              </p>
            </div>
            
            <div className="p-8 border border-zinc-200 bg-transparent">
              <Building2 className="w-8 h-8 text-brand-green mb-6" />
              <h3 className="text-lg font-bold text-zinc-900 mb-2">UAE Coverage</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Residential inspections and building consultancy support are available across the Emirates subject to project scope.
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
              <p className="text-sm text-zinc-500 leading-relaxed">
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
    </>
  );
}
