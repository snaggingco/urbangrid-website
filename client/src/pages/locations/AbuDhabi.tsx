import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import SEO from "@/components/SEO";
import { Check, Phone, ArrowRight } from "lucide-react";
import { UNIFORM_SERVICES } from "@/lib/constants";

export default function PropertyInspectionAbuDhabi() {
  const abuDhabiAreas = [
    "Corniche Area", "Al Reem Island", "Saadiyat Island", "Yas Island",
    "Al Raha Beach", "Masdar City", "Al Reef", "Khalifa City",
    "Mohammed Bin Zayed City", "Al Shamkha", "Al Ghadeer", "Shams Abu Dhabi"
  ];

  const stats = [
    { label: "COMPLETED INSPECTIONS", value: "3,200+" },
    { label: "LOCAL EXPERTISE", value: "12+ YRS" },
    { label: "CLIENT SATISFACTION", value: "98%" }
  ];

  return (
    <>
      <SEO 
        title="Property Inspection Abu Dhabi - Expert Property Assessment Services"
        description="Professional property inspection services across Abu Dhabi's premium developments. From Al Reem Island to Saadiyat Island. Call +971585686852"
        keywords="property inspection abu dhabi, property inspection services abu dhabi, abu dhabi property assessment"
      />

      <div className="pt-16">
        {/* Hero Section */}
        <section className="pt-24 pb-16 bg-zinc-950">
          <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
            <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">ABU DHABI · UAE</p>
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold text-white leading-tight mb-8">
              Expert Property <br />Inspection Abu Dhabi
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed mb-12 max-w-2xl">
              Professional property inspection services across Abu Dhabi's premium developments. From Al Reem Island to Saadiyat Island, ensure your property investment meets the highest standards.
            </p>
            <div className="flex flex-wrap gap-6">
              <Link href="/contact">
                <Button className="bg-brand-green text-white hover:bg-opacity-90 px-8 py-6 rounded-none h-auto text-xs font-bold tracking-widest uppercase">
                  Get Quote
                </Button>
              </Link>
              <a 
                href="tel:+971585686852"
                className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-white border-b border-white pb-1 hover:gap-3 transition-all uppercase"
              >
                <Phone className="w-4 h-4" />
                Call Abu Dhabi Office
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

        {/* Inspection Types */}
        <section className="py-24 lg:py-32 bg-zinc-50">
          <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
            <div className="grid lg:grid-cols-2 gap-16 mb-16 items-start">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">SERVICES</p>
                <h2 className="text-4xl lg:text-5xl font-bold text-zinc-900 leading-tight">
                  Abu Dhabi Inspection Solutions
                </h2>
              </div>
              <p className="text-sm text-zinc-500 leading-relaxed pt-4">
                Our Abu Dhabi team brings specialized knowledge of local municipality regulations and developer standards to every property assessment.
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
              Coverage Across Abu Dhabi
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {abuDhabiAreas.map((area, index) => (
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
                  Ready for Your Abu Dhabi Inspection?
                </h2>
                <p className="text-sm text-zinc-400 leading-relaxed mb-8 max-w-md">
                  Protect your Abu Dhabi property investment with professional inspection services. Contact us today for expert assessment and same-day reporting.
                </p>
                <div className="flex flex-wrap gap-6">
                  <Link href="/contact">
                    <Button className="bg-brand-green text-white hover:bg-opacity-90 px-8 py-6 rounded-none h-auto text-xs font-bold tracking-widest uppercase">
                      Book Now
                    </Button>
                  </Link>
                  <a 
                    href="https://wa.me/971585686852?text=Hello! I need property inspection services in Abu Dhabi."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-white border-b border-white pb-1 hover:gap-3 transition-all uppercase"
                  >
                    WhatsApp Abu Dhabi
                  </a>
                </div>
              </div>
              <div className="aspect-video bg-zinc-900 border border-zinc-800 p-12 flex flex-col justify-center">
                <div className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">CONTACT</div>
                <div className="text-2xl font-bold mb-2">+971 58 568 6852</div>
                <div className="text-sm text-zinc-500">Available 24/7 for urgent inspections</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
