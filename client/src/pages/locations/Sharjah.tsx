import { Button } from "@/components/ui/button";  
import { Link } from "wouter";
import SEO from "@/components/SEO";
import { Check, Phone, ArrowRight } from "lucide-react";

export default function SnaggingCompanySharjah() {
  const services = [
    {
      title: "Family Community Snagging",
      description: "Specialized snagging for Sharjah's family-oriented developments",
      link: "/services/property-snagging/new-build-snagging",
      areas: ["Al Zahia", "Aljada", "Tilal City", "Sharjah Waterfront"]
    },
    {
      title: "Cultural District Properties",
      description: "Heritage and modern property snagging in cultural areas",
      link: "/locations/sharjah/villa-snagging", 
      areas: ["Al Majaz", "Al Qasimia", "University City", "Al Khan"]
    },
    {
      title: "Coastal Property Snagging",
      description: "Expert snagging for beachfront developments",
      link: "/locations/sharjah/apartment-inspection",
      areas: ["Khorfakkan", "Kalba", "Al Hamriyah", "Dibba Al-Hisn"]
    }
  ];

  const stats = [
    { label: "COMMUNITIES COVERED", value: "15+" },
    { label: "SHARJAH PROJECTS", value: "450+" },
    { label: "TRUST RATING", value: "4.8/5" }
  ];

  const sharjahAreas = [
    "Al Zahia", "Aljada", "Tilal City", "Sharjah Waterfront",
    "Al Majaz", "Al Qasimia", "University City", "Al Khan", "Kalba"
  ];

  return (
    <>
      <SEO 
        title="Snagging Company Sharjah - Expert Property Snagging Services | UrbanGrid"
        description="Looking for a reliable snagging company in Sharjah? UrbanGrid provides expert property snagging services for family communities and cultural districts. Professional inspections in Al Zahia, Aljada, and across Sharjah. Call +971585686852"
        keywords="snagging company sharjah, property snagging sharjah, sharjah snagging services, villa snagging sharjah, apartment snagging sharjah, best snagging company sharjah"
      />

      <div className="pt-16">
        {/* Hero Section */}
        <section className="pt-24 pb-16 bg-zinc-950">
          <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
            <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">SHARJAH · UAE</p>
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold text-white leading-tight mb-8">
              Snagging Company <br />in Sharjah
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed mb-12 max-w-2xl">
              UrbanGrid is Sharjah's premier snagging company, providing comprehensive property snagging services across all Sharjah developments. Professional snagging company Sharjah ensuring your cultural emirate investment is thoroughly protected.
            </p>
            <div className="flex flex-wrap gap-6">
              <Link href="/contact">
                <Button className="bg-brand-green text-white hover:bg-opacity-90 px-8 py-6 rounded-none h-auto text-xs font-bold tracking-widest uppercase">
                  Schedule Snagging
                </Button>
              </Link>
              <a 
                href="tel:+971585686852"
                className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-white border-b border-white pb-1 hover:gap-3 transition-all uppercase"
              >
                <Phone className="w-4 h-4" />
                Call Sharjah Office
              </a>
            </div>
          </div>
        </section>

        {/* Stats Strip */}
        <section className="py-12 border-b border-zinc-100 bg-white">
          <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {stats.map((stat, index) => (
                <div key={index} className="flex flex-col">
                  <span className="text-4xl font-bold text-zinc-900 mb-2">{stat.value}</span>
                  <span className="text-[10px] uppercase tracking-[0.18em] text-zinc-400">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services List */}
        <section className="py-24 lg:py-32 bg-zinc-50">
          <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
            <div className="grid lg:grid-cols-2 gap-16 mb-16 items-start">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">EXPERTISE</p>
                <h2 className="text-4xl lg:text-5xl font-bold text-zinc-900 leading-tight">
                  Tailored Snagging Solutions
                </h2>
              </div>
              <p className="text-sm text-zinc-500 leading-relaxed pt-4">
                From modern family communities like Al Zahia to the coastal developments of Kalba, our team provides expert inspection services tailored to Sharjah's unique property landscape.
              </p>
            </div>

            <div className="divide-y divide-zinc-200 border-t border-zinc-200">
              {services.map((service, index) => (
                <div key={index} className="py-12 group">
                  <div className="grid md:grid-cols-12 gap-8 items-start">
                    <div className="md:col-span-1 text-[10px] font-bold text-zinc-300 group-hover:text-brand-green transition-colors">
                      0{index + 1}
                    </div>
                    <div className="md:col-span-5">
                      <h3 className="text-lg font-bold text-zinc-900 mb-2">{service.title}</h3>
                      <p className="text-xs text-zinc-500 mb-4">{service.description}</p>
                    </div>
                    <div className="md:col-span-4">
                      <div className="flex flex-wrap gap-2">
                        {service.areas.map((area, i) => (
                          <span key={i} className="px-2 py-1 border border-zinc-200 text-[9px] font-bold uppercase tracking-wider text-zinc-400 group-hover:border-brand-green group-hover:text-brand-green transition-colors">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="md:col-span-2 flex justify-end">
                      <Link href={service.link} className="inline-flex items-center gap-2 text-[10px] font-bold tracking-widest text-brand-green border-b border-brand-green pb-0.5 hover:gap-3 transition-all uppercase">
                        Details <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Coverage Areas */}
        <section className="py-24 lg:py-32 bg-white">
          <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 text-center">
            <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">AREAS</p>
            <h2 className="text-4xl lg:text-5xl font-bold text-zinc-900 leading-tight mb-12">
              Sharjah Coverage
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {sharjahAreas.map((area, index) => (
                <div key={index} className="px-4 py-2 border border-zinc-100 text-[10px] font-semibold uppercase tracking-widest text-zinc-500 hover:border-brand-green hover:text-brand-green transition-colors">
                  {area}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 lg:py-32 bg-zinc-950 text-white">
          <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
                  Protect Your Sharjah Investment
                </h2>
                <p className="text-sm text-zinc-400 leading-relaxed mb-8 max-w-md">
                  Trust UrbanGrid for professional property snagging services across Sharjah's diverse communities, from cultural districts to coastal developments.
                </p>
                <div className="flex flex-wrap gap-6">
                  <Link href="/contact">
                    <Button className="bg-brand-green text-white hover:bg-opacity-90 px-8 py-6 rounded-none h-auto text-xs font-bold tracking-widest uppercase">
                      Book Now
                    </Button>
                  </Link>
                  <a 
                    href="https://wa.me/971585686852?text=Hello! I need professional snagging services in Sharjah."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-white border-b border-white pb-1 hover:gap-3 transition-all uppercase"
                  >
                    WhatsApp Sharjah Team
                  </a>
                </div>
              </div>
              <div className="aspect-square bg-zinc-900 border border-zinc-800 p-12 flex flex-col justify-end">
                <div className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">LOCAL PRESENCE</div>
                <div className="text-3xl font-bold mb-4 italic">Sharjah's most trusted snagging partner</div>
                <div className="text-sm text-zinc-500">Expertise in both heritage and modern architectural standards.</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
