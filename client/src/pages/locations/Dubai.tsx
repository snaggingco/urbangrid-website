
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import SEO from "@/components/SEO";
import { Check, Phone, ArrowRight } from "lucide-react";

export default function PropertyInspectionDubai() {
  const inspectionTypes = [
    {
      title: "Pre-Purchase Property Inspection",
      description: "Comprehensive property assessment before buying to protect your investment",
      price: "From AED 1,500",
      duration: "3-5 hours",
      coverage: ["Structural assessment", "MEP systems", "Legal compliance", "Market valuation input"],
    },
    {
      title: "New Build Property Inspection", 
      description: "Pre-handover inspection for newly constructed properties",
      price: "From AED 1,200",
      duration: "4-6 hours", 
      coverage: ["Construction quality", "Developer compliance", "Defect identification", "Handover preparation"]
    },
    {
      title: "Rental Property Inspection",
      description: "Move-in/move-out inspections for rental properties",
      price: "From AED 800",
      duration: "2-3 hours",
      coverage: ["Condition documentation", "Inventory checking", "Damage assessment", "Security deposit protection"]
    },
    {
      title: "Commercial Property Inspection",
      description: "Professional inspection for commercial real estate",
      price: "From AED 2,500", 
      duration: "4-8 hours",
      coverage: ["Code compliance", "Safety systems", "Business suitability", "Investment analysis"]
    }
  ];

  const dubaiAreas = [
    "Downtown Dubai", "Dubai Marina", "Business Bay", "JLT", "DIFC", "Palm Jumeirah",
    "Dubai Hills", "Arabian Ranches", "Emirates Hills", "JBR", "City Walk", "Dubai Creek Harbour"
  ];

  const stats = [
    { label: "PROPERTIES INSPECTED", value: "8,500+" },
    { label: "EXPERT INSPECTORS", value: "25+" },
    { label: "CUSTOMER RATING", value: "4.9/5" }
  ];

  return (
    <>
      <SEO 
        title="Property Inspection Dubai - Professional Property Assessment Services"
        description="Expert property inspection services in Dubai. Pre-purchase inspections, new build assessments, rental property checks. RERA licensed inspectors covering all Dubai areas. Call +971585686852"
        keywords="property inspection dubai, property inspection services dubai, dubai property inspection, property inspector dubai, pre purchase inspection dubai, property assessment dubai"
      />
      
      <div>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-end pt-32 pb-24">
          <div 
            className="absolute inset-0 bg-cover bg-center z-0" 
            style={{backgroundImage: `url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=1000&q=80')`}}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent z-10" />
          
          <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full">
            <p className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] text-brand-green uppercase mb-6">DUBAI · UAE</p>
            <h1 className="text-6xl sm:text-7xl lg:text-[7rem] xl:text-[8.5rem] font-bold text-white leading-[0.95] tracking-tight mb-12">
              Property <br />Inspection <br />in Dubai
            </h1>
            <div className="flex flex-wrap gap-6 items-center">
              <Link href="/contact">
                <Button className="bg-brand-green text-white hover:bg-opacity-90 px-10 py-8 rounded-none h-auto text-xs font-bold tracking-widest uppercase">
                  Schedule Inspection
                </Button>
              </Link>
              <a 
                href="tel:+971585686852"
                className="inline-flex items-center gap-3 text-sm font-bold tracking-widest text-white border-b-2 border-white pb-1 hover:gap-4 transition-all uppercase"
              >
                <Phone className="w-5 h-5" />
                Call Dubai Office
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

        {/* Inspection Types */}
        <section className="py-28 lg:py-40 bg-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
            <div className="max-w-3xl mb-24">
              <p className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] text-brand-green uppercase mb-6">SOLUTIONS</p>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-zinc-900 leading-tight mb-8">
                Comprehensive Inspection Services
              </h2>
              <p className="text-lg text-zinc-500 font-light leading-relaxed">
                Our expert team utilizes advanced technology and deep market knowledge to provide the most thorough property assessments in Dubai. Every inspection includes a detailed digital report delivered within 24 hours.
              </p>
            </div>

            <div className="divide-y divide-zinc-100 border-t border-zinc-100">
              {inspectionTypes.map((type, index) => (
                <div key={index} className="py-16 group">
                  <div className="grid md:grid-cols-12 gap-12 items-start">
                    <div className="md:col-span-1 text-5xl font-bold text-zinc-100 group-hover:text-brand-green/20 transition-colors leading-none">
                      0{index + 1}
                    </div>
                    <div className="md:col-span-5">
                      <div className="flex items-center gap-4 mb-4">
                        <h3 className="text-2xl font-bold text-zinc-900">{type.title}</h3>
                        <span className="px-3 py-1 bg-zinc-50 text-[10px] font-bold text-zinc-500 uppercase tracking-widest border border-zinc-100">
                          {type.price}
                        </span>
                      </div>
                      <p className="text-zinc-500 font-light mb-8">{type.description}</p>
                      <div className="flex flex-wrap gap-x-8 gap-y-3">
                        {type.coverage.map((item, i) => (
                          <div key={i} className="flex items-center text-[10px] text-zinc-400 uppercase tracking-[0.1em]">
                            <Check className="w-3 h-3 text-brand-green mr-2" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="md:col-span-6 flex flex-col items-end justify-center h-full">
                      <div className="text-right mb-8">
                        <div className="text-xs text-zinc-400 uppercase tracking-widest mb-1">Duration</div>
                        <div className="text-lg font-bold text-zinc-900">{type.duration}</div>
                      </div>
                      <Link href="/contact">
                        <Button variant="outline" className="rounded-none border-zinc-200 text-zinc-900 hover:bg-zinc-900 hover:text-white group">
                          Book Now <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
            style={{backgroundImage: `url('https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=900&q=80')`}}
          />
          <div className="absolute inset-0 bg-zinc-950/80" />
          <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 text-center">
            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight mb-8">
              Protecting Dubai's <br />Real Estate Legacy
            </h2>
            <p className="text-lg text-zinc-400 font-light max-w-2xl mx-auto leading-relaxed">
              With over 8,500 properties inspected across the emirate, UrbanGrid is the trusted partner for developers, buyers, and investors in Dubai's dynamic market.
            </p>
          </div>
        </section>

        {/* Coverage Areas */}
        <section className="py-28 lg:py-40 bg-zinc-950">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
            <div className="text-center mb-20">
              <p className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] text-brand-green uppercase mb-6">COVERAGE</p>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Serving All Major <br />Dubai Communities
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {dubaiAreas.map((area, index) => (
                <div key={index} className="px-6 py-4 border border-zinc-800 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:border-brand-green hover:text-white transition-all text-center">
                  {area}
                </div>
              ))}
            </div>
            <div className="mt-16 text-center">
              <p className="text-xs text-zinc-500 tracking-[0.1em] uppercase">
                24/7 Emergency Inspections Available Across the Emirate
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-28 lg:py-40 bg-brand-green text-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 text-center">
            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-12">
              Ready to Secure Your <br />Investment in Dubai?
            </h2>
            <div className="flex flex-wrap justify-center gap-8">
              <Link href="/contact">
                <Button className="bg-white text-brand-green hover:bg-zinc-100 px-12 py-8 rounded-none h-auto text-sm font-bold tracking-widest uppercase">
                  Book Inspection
                </Button>
              </Link>
              <a 
                href="tel:+971585686852"
                className="inline-flex items-center gap-3 text-sm font-bold tracking-widest text-white border-b-2 border-white pb-1 hover:gap-4 transition-all uppercase"
              >
                <Phone className="w-5 h-5" />
                Call +971 58 568 6852
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
