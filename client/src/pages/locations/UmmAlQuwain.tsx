import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import SEO from "@/components/SEO";
import { Check, Phone, ArrowRight } from "lucide-react";
import { UNIFORM_SERVICES } from "@/lib/constants";

export default function UmmAlQuwain() {
  const stats = [
    { label: "UAQ COVERAGE", value: "100%" },
    { label: "EXPERTISE", value: "10+ YRS" },
    { label: "CLIENT RATING", value: "4.8/5" }
  ];

  const areas = [
    "UAQ City Centre", "Al Salam City", "Al Humaidiya", "Al Rashidiya", "Marina District",
    "Al Dar Complex", "Presidential Villas", "Family Compounds", "UAQ Free Trade Zone",
    "Umm Al Quwain Mall", "Industrial Area", "Business District", "Al Dour", "Falaj Al Mualla",
    "Old Town UAQ", "UAQ Corniche", "Creek Area", "Residential Complexes"
  ];

  return (
    <>
      <SEO 
        title="Property Snagging & Inspection Services in Umm Al Quwain"
        description="Umm Al Quwain's dedicated property inspection company providing comprehensive snagging services across the emirate. Call +971585686852"
        keywords="snagging company uaq, property inspection umm al quwain, uaq property assessment"
      />

      <div className="pt-16">
        {/* Hero Section */}
        <section className="pt-24 pb-16 bg-zinc-950">
          <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
            <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">UMM AL QUWAIN · UAE</p>
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold text-white leading-tight mb-8">
              Property Inspection <br />in Umm Al Quwain
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed mb-12 max-w-2xl text-left">
              Umm Al Quwain's dedicated property inspection company providing comprehensive snagging services across the emirate. From residential compounds to commercial developments, we ensure quality and protection for your UAQ property investment.
            </p>
            <div className="flex flex-wrap gap-6">
              <Link href="/contact">
                <Button className="bg-brand-green text-white hover:bg-opacity-90 px-8 py-6 rounded-none h-auto text-xs font-bold tracking-widest uppercase">
                  Free Quote
                </Button>
              </Link>
              <a 
                href="tel:+971585686852"
                className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-white border-b border-white pb-1 hover:gap-3 transition-all uppercase"
              >
                <Phone className="w-4 h-4" />
                Call UAQ Office
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
                  UAQ Inspection Solutions
                </h2>
              </div>
              <p className="text-sm text-zinc-500 leading-relaxed pt-4">
                Our UAQ team ensures quality control for both residential compounds and commercial business developments across the emirate's growing infrastructure.
              </p>
            </div>

            <div className="divide-y divide-zinc-200 border-t border-zinc-200">
              {UNIFORM_SERVICES.map((type, index) => (
                <div key={index} className="py-12 group">
                  <div className="grid md:grid-cols-12 gap-8 items-start">
                    <div className="md:col-span-1 text-[10px] font-bold text-zinc-300 group-hover:text-brand-green transition-colors">
                      0{index + 1}
                    </div>
                    <div className="md:col-span-4">
                      <h3 className="text-lg font-bold text-zinc-900 mb-2">{type.title}</h3>
                      <p className="text-xs text-zinc-500">{type.description}</p>
                    </div>
                    <div className="md:col-span-4">
                      <div className="flex flex-wrap gap-x-6 gap-y-2">
                        {type.coverage.map((item, i) => (
                          <div key={i} className="flex items-center text-[10px] text-zinc-400 uppercase tracking-wider">
                            <Check className="w-3 h-3 text-brand-green mr-2" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="md:col-span-3 flex flex-col items-end gap-4">
                      <div className="text-right">
                        <div className="text-xs font-bold text-zinc-900">{type.price}</div>
                        <div className="text-[10px] text-zinc-400 uppercase tracking-widest">{type.duration}</div>
                      </div>
                      <Link href={type.link} className="inline-flex items-center gap-2 text-[10px] font-bold tracking-widest text-brand-green border-b border-brand-green pb-0.5 hover:gap-3 transition-all uppercase">
                        Book Now <ArrowRight className="w-3 h-3" />
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
            <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">DISTRICTS</p>
            <h2 className="text-4xl lg:text-5xl font-bold text-zinc-900 leading-tight mb-12">
              Coverage Across UAQ
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {areas.map((area, index) => (
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
                  Ready for Your UAQ Inspection?
                </h2>
                <p className="text-sm text-zinc-400 leading-relaxed mb-8 max-w-md">
                  Secure your Umm Al Quwain property investment with professional snagging and inspection services. Ensure quality and value in this growing emirate.
                </p>
                <div className="flex flex-wrap gap-6">
                  <Link href="/contact">
                    <Button className="bg-brand-green text-white hover:bg-opacity-90 px-8 py-6 rounded-none h-auto text-xs font-bold tracking-widest uppercase">
                      Book Now
                    </Button>
                  </Link>
                  <a 
                    href="https://wa.me/971585686852?text=Hello! I need property inspection services in Umm Al Quwain."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-white border-b border-white pb-1 hover:gap-3 transition-all uppercase"
                  >
                    WhatsApp UAQ Team
                  </a>
                </div>
              </div>
              <div className="aspect-video bg-zinc-900 border border-zinc-800 p-12 flex flex-col justify-center">
                <div className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">UAQ MARKET</div>
                <div className="text-xl font-bold mb-4 italic">Strategic Growth & Affordable Investment</div>
                <div className="text-sm text-zinc-500">Central location with easy access to all other emirates.</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
