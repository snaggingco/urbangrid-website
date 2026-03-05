import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import SEO from "@/components/SEO";
import { Check, Phone, ArrowRight } from "lucide-react";

export default function RasAlKhaimah() {
  const services = [
    {
      title: "Property Inspection RAK",
      description: "Expert property inspections for Ras Al Khaimah's diverse developments from mountain to beachfront properties",
      link: "/services/secondary-market",
      areas: ["Al Hamra Village", "Mina Al Arab", "RAK Properties", "Julphar Towers"]
    },
    {
      title: "Villa Snagging RAK",
      description: "Specialized villa inspections in RAK's luxury communities and resort-style developments",
      link: "/services/new-build-snagging",
      areas: ["Al Hamra Golf", "Flamingo Villas", "Bermuda Views", "Mangrove Place"]
    },
    {
      title: "Resort Property Inspection",
      description: "Comprehensive inspections for resort properties and holiday homes in RAK's tourism zones",
      link: "/services/move-in-move-out",
      areas: ["Marjan Island", "Al Marjan Resort", "Ras Al Khaimah Beach", "Jebel Jais"]
    }
  ];

  const stats = [
    { label: "EMIRATE COVERAGE", value: "100%" },
    { label: "RAK EXPERTS", value: "10+ YRS" },
    { label: "CLIENT RATING", value: "4.9/5" }
  ];

  const areas = [
    "Al Hamra Village", "Mina Al Arab", "RAK Properties", "Julphar Towers", "Al Hamra Golf",
    "Flamingo Villas", "Bermuda Views", "Mangrove Place", "Marjan Island", "Al Marjan Resort",
    "Ras Al Khaimah Beach", "Jebel Jais", "RAK City Centre", "Al Nakheel", "Al Rams",
    "Digdaga", "Khatt", "Al Jazirah Al Hamra", "Sha'am"
  ];

  return (
    <>
      <SEO 
        title="Property Snagging & Inspection Services in Ras Al Khaimah"
        description="Ras Al Khaimah's premier property inspection company providing comprehensive snagging services. From mountain retreats to beachfront resorts. Call +971585686852"
        keywords="snagging company rak, property inspection ras al khaimah, rak property assessment"
      />

      <div className="pt-16">
        {/* Hero Section */}
        <section className="pt-24 pb-16 bg-zinc-950">
          <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
            <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">RAS AL KHAIMAH · UAE</p>
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold text-white leading-tight mb-8">
              Property Inspection <br />in Ras Al Khaimah
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed mb-12 max-w-2xl text-left">
              Ras Al Khaimah's premier property inspection company providing comprehensive snagging services across the emirate's diverse landscape. From mountain retreats to beachfront resorts, we ensure your RAK property investment meets the highest standards.
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
                Call RAK Office
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
                  RAK Inspection Services
                </h2>
              </div>
              <p className="text-sm text-zinc-500 leading-relaxed pt-4">
                Our RAK team specializes in the emirate's unique property landscape, from Jebel Jais mountain retreats to the luxury resorts of Marjan Island.
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
              Serving All RAK Communities
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
                  Expert Assessment in RAK
                </h2>
                <p className="text-sm text-zinc-400 leading-relaxed mb-8 max-w-md">
                  Secure your Ras Al Khaimah property investment with expert snagging and inspection services. We ensure comprehensive quality control.
                </p>
                <div className="flex flex-wrap gap-6">
                  <Link href="/contact">
                    <Button className="bg-brand-green text-white hover:bg-opacity-90 px-8 py-6 rounded-none h-auto text-xs font-bold tracking-widest uppercase">
                      Book Now
                    </Button>
                  </Link>
                  <a 
                    href="https://wa.me/971585686852?text=Hello! I need property inspection services in Ras Al Khaimah."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-white border-b border-white pb-1 hover:gap-3 transition-all uppercase"
                  >
                    WhatsApp RAK Team
                  </a>
                </div>
              </div>
              <div className="aspect-square bg-zinc-900 border border-zinc-800 p-12 flex flex-col justify-end">
                <div className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">RAK LANDSCAPE</div>
                <div className="text-xl font-bold mb-4">Mountain, Coastal & Resort Expertise</div>
                <p className="text-xs text-zinc-500">Unique construction challenges require specialized local knowledge. Our team delivers.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
