
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
      popular: true
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
        title="Best Snagging Company Dubai - Expert Property Inspection Services"
        description="UrbanGrid is the best snagging company in Dubai. We provide professional property inspection, villa snagging, and handover inspections with RERA licensed experts. Call +971585686852"
        keywords="best snagging company dubai, property inspection dubai, snagging services dubai, dubai snagging company, property inspector dubai"
      />
      
      <div className="pt-16">
        {/* Hero Section */}
        <section className="pt-24 pb-16 bg-zinc-950">
          <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
            <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">DUBAI · UAE</p>
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold text-white leading-tight mb-8">
              Property Inspection <br />in Dubai
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed mb-12 max-w-2xl">
              UrbanGrid provides comprehensive property inspection services across Dubai. From pre-purchase assessments to new build inspections, protect your investment with our RERA-licensed professional inspectors.
            </p>
            <div className="flex flex-wrap gap-6">
              <Link href="/contact">
                <Button className="bg-brand-green text-white hover:bg-opacity-90 px-8 py-6 rounded-none h-auto text-xs font-bold tracking-widest uppercase">
                  Schedule Inspection
                </Button>
              </Link>
              <a 
                href="tel:+971585686852"
                className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-white border-b border-white pb-1 hover:gap-3 transition-all uppercase"
              >
                <Phone className="w-4 h-4" />
                Call Dubai Office
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
                <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">SOLUTIONS</p>
                <h2 className="text-4xl lg:text-5xl font-bold text-zinc-900 leading-tight">
                  Comprehensive Inspection Services
                </h2>
              </div>
              <p className="text-sm text-zinc-500 leading-relaxed pt-4">
                Our expert team utilizes advanced technology and deep market knowledge to provide the most thorough property assessments in Dubai. Every inspection includes a detailed digital report delivered within 24 hours.
              </p>
            </div>

            <div className="divide-y divide-zinc-200 border-t border-zinc-200">
              {inspectionTypes.map((type, index) => (
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
                      <Link href="/contact" className="inline-flex items-center gap-2 text-[10px] font-bold tracking-widest text-brand-green border-b border-brand-green pb-0.5 hover:gap-3 transition-all uppercase">
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
            <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">COVERAGE</p>
            <h2 className="text-4xl lg:text-5xl font-bold text-zinc-900 leading-tight mb-12">
              Serving All Major Dubai Communities
            </h2>
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {dubaiAreas.map((area, index) => (
                <div key={index} className="px-4 py-2 border border-zinc-100 text-[10px] font-semibold uppercase tracking-widest text-zinc-500 hover:border-brand-green hover:text-brand-green transition-colors">
                  {area}
                </div>
              ))}
            </div>
            <p className="text-xs text-zinc-400 italic">
              24/7 Emergency Inspections Available Across the Emirate
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 lg:py-32 bg-zinc-950 text-white">
          <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
                  Ready to Secure Your Investment?
                </h2>
                <p className="text-sm text-zinc-400 leading-relaxed mb-8 max-w-md">
                  Protect your Dubai property investment with comprehensive inspections from RERA-licensed professionals. Same-day reports guaranteed.
                </p>
                <div className="flex flex-wrap gap-6">
                  <Link href="/contact">
                    <Button className="bg-brand-green text-white hover:bg-opacity-90 px-8 py-6 rounded-none h-auto text-xs font-bold tracking-widest uppercase">
                      Book Now
                    </Button>
                  </Link>
                  <a 
                    href="https://wa.me/971585686852?text=Hello! I need professional property inspection services in Dubai."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-white border-b border-white pb-1 hover:gap-3 transition-all uppercase"
                  >
                    WhatsApp Dubai Team
                  </a>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square bg-zinc-900 border border-zinc-800 p-8 flex flex-col justify-end">
                  <div className="text-3xl font-bold mb-2">24h</div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest leading-tight">Report<br />Delivery</div>
                </div>
                <div className="aspect-square bg-zinc-900 border border-zinc-800 p-8 flex flex-col justify-end">
                  <div className="text-3xl font-bold mb-2">RERA</div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest leading-tight">Licensed<br />Inspectors</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
