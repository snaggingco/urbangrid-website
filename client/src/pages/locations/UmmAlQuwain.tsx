import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import SEO from "@/components/SEO";
import { Check, Phone, ArrowRight } from "lucide-react";

export default function UmmAlQuwain() {
  const services = [
    {
      title: "Property Inspection UAQ",
      description: "Expert property inspections for Umm Al Quwain's residential and commercial developments",
      link: "/services/secondary-market",
      areas: ["UAQ City Centre", "Al Salam City", "Al Humaidiya", "Al Rashidiya"]
    },
    {
      title: "Residential Snagging Services",
      description: "Comprehensive snagging services for villas and apartments in UAQ's growing communities",
      link: "/services/new-build-snagging",
      areas: ["Marina District", "Al Dar Complex", "Presidential Villas", "Family Compounds"]
    },
    {
      title: "Commercial Property Inspection",
      description: "Professional inspections for commercial properties and business developments",
      link: "/services/developer-projects",
      areas: ["UAQ Free Trade Zone", "Umm Al Quwain Mall", "Industrial Area", "Business District"]
    }
  ];

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

      <div>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-end pt-32 pb-24">
          <div 
            className="absolute inset-0 bg-cover bg-center z-0" 
            style={{backgroundImage: `url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=1000&q=80')`}}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent z-10" />
          
          <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full">
            <p className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] text-brand-green uppercase mb-6">UMM AL QUWAIN · UAE</p>
            <h1 className="text-6xl sm:text-7xl lg:text-[7rem] xl:text-[8.5rem] font-bold text-white leading-[0.95] tracking-tight mb-12">
              Property <br />Inspection <br />in UAQ
            </h1>
            <div className="flex flex-wrap gap-6 items-center">
              <Link href="/contact">
                <Button className="bg-brand-green text-white hover:bg-opacity-90 px-10 py-8 rounded-none h-auto text-xs font-bold tracking-widest uppercase">
                  Free Quote
                </Button>
              </Link>
              <a 
                href="tel:+971585686852"
                className="inline-flex items-center gap-3 text-sm font-bold tracking-widest text-white border-b-2 border-white pb-1 hover:gap-4 transition-all uppercase"
              >
                <Phone className="w-5 h-5" />
                Call UAQ Office
              </a>
            </div>
          </div>
        </section>

        {/* Stats Strip */}
        <section className="bg-zinc-950 py-24 border-b border-zinc-900">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:divide-x md:divide-zinc-800">
              {stats.map((stat, index) => (
                <div key={index} className="flex flex-col items-center md:items-start md:pl-12 first:pl-0">
                  <span className="text-6xl lg:text-7xl font-bold text-brand-green leading-none mb-4">{stat.value}</span>
                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services List */}
        <section className="py-28 lg:py-40 bg-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
            <div className="max-w-3xl mb-24">
              <p className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] text-brand-green uppercase mb-6">EXPERTISE</p>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-zinc-900 leading-tight mb-8">
                UAQ Inspection Solutions
              </h2>
              <p className="text-lg text-zinc-500 font-light leading-relaxed">
                Our UAQ team ensures quality control for both residential compounds and commercial business developments across the emirate's growing infrastructure.
              </p>
            </div>

            <div className="divide-y divide-zinc-100 border-t border-zinc-100">
              {services.map((service, index) => (
                <div key={index} className="py-16 group">
                  <div className="grid md:grid-cols-12 gap-12 items-start">
                    <div className="md:col-span-1 text-5xl font-bold text-zinc-100 group-hover:text-brand-green/20 transition-colors leading-none">
                      0{index + 1}
                    </div>
                    <div className="md:col-span-5">
                      <h3 className="text-2xl font-bold text-zinc-900 mb-4">{service.title}</h3>
                      <p className="text-zinc-500 font-light mb-8">{service.description}</p>
                      <div className="flex flex-wrap gap-3">
                        {service.areas.map((area, i) => (
                          <span key={i} className="px-3 py-1 border border-zinc-100 text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover:border-brand-green group-hover:text-brand-green transition-colors">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="md:col-span-6 flex flex-col items-end justify-center h-full">
                      <Link href={service.link}>
                        <Button variant="outline" className="rounded-none border-zinc-200 text-zinc-900 hover:bg-zinc-900 hover:text-white group">
                          View Details <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Chapter Break */}
        <section className="relative min-h-[60vh] flex items-center py-24">
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{backgroundImage: `url('https://images.unsplash.com/photo-1590216087343-802521876547?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=900&q=80')`}}
          />
          <div className="absolute inset-0 bg-zinc-950/80" />
          <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 text-center">
            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight mb-8">
              Strategic Growth & <br />Affordable Investment
            </h2>
            <p className="text-lg text-zinc-400 font-light max-w-2xl mx-auto leading-relaxed">
              Umm Al Quwain's central location provides easy access to all other emirates. We ensure quality and value for your UAQ property investment.
            </p>
          </div>
        </section>

        {/* Coverage Areas */}
        <section className="py-28 lg:py-40 bg-zinc-950">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
            <div className="text-center mb-20">
              <p className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] text-brand-green uppercase mb-6">DISTRICTS</p>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Coverage Across UAQ
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {areas.map((area, index) => (
                <div key={index} className="px-6 py-4 border border-zinc-800 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:border-brand-green hover:text-white transition-all text-center">
                  {area}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-28 lg:py-40 bg-brand-green text-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 text-center">
            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-12">
              Ready for Your UAQ <br />Property Inspection?
            </h2>
            <div className="flex flex-wrap justify-center gap-8">
              <Link href="/contact">
                <Button className="bg-white text-brand-green hover:bg-zinc-100 px-12 py-8 rounded-none h-auto text-sm font-bold tracking-widest uppercase">
                  Book Now
                </Button>
              </Link>
              <a 
                href="tel:+971585686852"
                className="inline-flex items-center gap-3 text-sm font-bold tracking-widest text-white border-b-2 border-white pb-1 hover:gap-4 transition-all uppercase"
              >
                <Phone className="w-5 h-5" />
                Call UAQ Team
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
