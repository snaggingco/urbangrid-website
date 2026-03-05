import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import SEO from "@/components/SEO";
import { Check, Phone, ArrowRight } from "lucide-react";

export default function PropertyInspectionAbuDhabi() {
  const abuDhabiAreas = [
    "Corniche Area", "Al Reem Island", "Saadiyat Island", "Yas Island",
    "Al Raha Beach", "Masdar City", "Al Reef", "Khalifa City",
    "Mohammed Bin Zayed City", "Al Shamkha", "Al Ghadeer", "Shams Abu Dhabi"
  ];

  const inspectionTypes = [
    {
      title: "New Build Property Inspection",
      description: "Pre-handover inspections for new developments in Abu Dhabi",
      price: "From AED 1 / Sq.ft",
      features: ["Pre-handover assessment", "Structural integrity check", "MEP systems testing", "Quality compliance review", "Developer coordination"]
    },
    {
      title: "Pre-Purchase Property Inspection",
      description: "Comprehensive inspection before buying property in Abu Dhabi",
      price: "From AED 1 / Sq.ft",
      features: ["Investment protection", "Market value assessment", "Condition evaluation", "Risk identification", "Purchase recommendation"]
    },
    {
      title: "Villa Property Inspection",
      description: "Specialized villa inspection services across Abu Dhabi",
      price: "From AED 1 / Sq.ft",
      features: ["Complete villa assessment", "Exterior & landscape", "Pool & amenities", "Smart home systems", "Premium reporting"]
    }
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

      <div>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-end pt-32 pb-24">
          <div 
            className="absolute inset-0 bg-cover bg-center z-0" 
            style={{backgroundImage: `url('https://images.unsplash.com/photo-1548813831-38faf5a5cdfb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=1000&q=80')`}}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent z-10" />
          
          <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full">
            <p className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] text-brand-green uppercase mb-6">ABU DHABI · UAE</p>
            <h1 className="text-6xl sm:text-7xl lg:text-[7rem] xl:text-[8.5rem] font-bold text-white leading-[0.95] tracking-tight mb-12">
              Property <br />Inspection <br />Abu Dhabi
            </h1>
            <div className="flex flex-wrap gap-6 items-center">
              <Link href="/contact">
                <Button className="bg-brand-green text-white hover:bg-opacity-90 px-10 py-8 rounded-none h-auto text-xs font-bold tracking-widest uppercase">
                  Get Quote
                </Button>
              </Link>
              <a 
                href="tel:+971585686852"
                className="inline-flex items-center gap-3 text-sm font-bold tracking-widest text-white border-b-2 border-white pb-1 hover:gap-4 transition-all uppercase"
              >
                <Phone className="w-5 h-5" />
                Call Abu Dhabi Office
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
              <p className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] text-brand-green uppercase mb-6">SERVICES</p>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-zinc-900 leading-tight mb-8">
                Abu Dhabi Inspection Solutions
              </h2>
              <p className="text-lg text-zinc-500 font-light leading-relaxed">
                Our Abu Dhabi team brings specialized knowledge of local municipality regulations and developer standards to every property assessment across the capital.
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
                        {type.features.map((item, i) => (
                          <div key={i} className="flex items-center text-[10px] text-zinc-400 uppercase tracking-[0.1em]">
                            <Check className="w-3 h-3 text-brand-green mr-2" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="md:col-span-6 flex flex-col items-end justify-center h-full">
                      <div className="text-right mb-8">
                        <div className="text-xs text-zinc-400 uppercase tracking-widest mb-1">Reports</div>
                        <div className="text-lg font-bold text-zinc-900">Digital Delivery</div>
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
            style={{backgroundImage: `url('https://images.unsplash.com/photo-1572535032870-82a945f34057?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=900&q=80')`}}
          />
          <div className="absolute inset-0 bg-zinc-950/80" />
          <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 text-center">
            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight mb-8">
              Excellence in the <br />Capital's Landscape
            </h2>
            <p className="text-lg text-zinc-400 font-light max-w-2xl mx-auto leading-relaxed">
              From the high-rises of Al Reem to the luxury villas of Saadiyat, we provide the technical due diligence required for Abu Dhabi's premium real estate.
            </p>
          </div>
        </section>

        {/* Coverage Areas */}
        <section className="py-28 lg:py-40 bg-zinc-950">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
            <div className="text-center mb-20">
              <p className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] text-brand-green uppercase mb-6">DISTRICTS</p>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Coverage Across <br />Abu Dhabi
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {abuDhabiAreas.map((area, index) => (
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
              Ready for Your Abu Dhabi <br />Property Inspection?
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
                Call +971 58 568 6852
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
