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
        description="Sharjah's trusted snagging company providing comprehensive property snagging services. Family community & cultural district snagging in Al Zahia, Aljada, Kalba. Call +971585686852"
        keywords="snagging company sharjah, property snagging sharjah, sharjah snagging services, villa snagging sharjah, apartment snagging sharjah, family community snagging"
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
            <p className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] text-brand-green uppercase mb-6">SHARJAH · UAE</p>
            <h1 className="text-6xl sm:text-7xl lg:text-[7rem] xl:text-[8.5rem] font-bold text-white leading-[0.95] tracking-tight mb-12">
              Snagging <br />Company <br />in Sharjah
            </h1>
            <div className="flex flex-wrap gap-6 items-center">
              <Link href="/contact">
                <Button className="bg-brand-green text-white hover:bg-opacity-90 px-10 py-8 rounded-none h-auto text-xs font-bold tracking-widest uppercase">
                  Schedule Snagging
                </Button>
              </Link>
              <a 
                href="tel:+971585686852"
                className="inline-flex items-center gap-3 text-sm font-bold tracking-widest text-white border-b-2 border-white pb-1 hover:gap-4 transition-all uppercase"
              >
                <Phone className="w-5 h-5" />
                Call Sharjah Office
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
                Tailored Snagging Solutions
              </h2>
              <p className="text-lg text-zinc-500 font-light leading-relaxed">
                From modern family communities like Al Zahia to the coastal developments of Kalba, our team provides expert inspection services tailored to Sharjah's unique property landscape.
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
            style={{backgroundImage: `url('https://images.unsplash.com/photo-1574944966950-8467741867ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=900&q=80')`}}
          />
          <div className="absolute inset-0 bg-zinc-950/80" />
          <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 text-center">
            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight mb-8">
              Protecting Sharjah's <br />Cultural Investment
            </h2>
            <p className="text-lg text-zinc-400 font-light max-w-2xl mx-auto leading-relaxed">
              UrbanGrid is Sharjah's premier snagging company, ensuring your cultural emirate investment is thoroughly protected with international engineering standards.
            </p>
          </div>
        </section>

        {/* Coverage Areas */}
        <section className="py-28 lg:py-40 bg-zinc-950">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
            <div className="text-center mb-20">
              <p className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] text-brand-green uppercase mb-6">AREAS</p>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Sharjah Coverage
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {sharjahAreas.map((area, index) => (
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
              Protect Your Sharjah <br />Investment Today
            </h2>
            <div className="flex flex-wrap justify-center gap-8">
              <Link href="/contact">
                <Button className="bg-white text-brand-green hover:bg-zinc-100 px-12 py-8 rounded-none h-auto text-sm font-bold tracking-widest uppercase">
                  Book Snagging
                </Button>
              </Link>
              <a 
                href="tel:+971585686852"
                className="inline-flex items-center gap-3 text-sm font-bold tracking-widest text-white border-b-2 border-white pb-1 hover:gap-4 transition-all uppercase"
              >
                <Phone className="w-5 h-5" />
                Call Sharjah Team
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
