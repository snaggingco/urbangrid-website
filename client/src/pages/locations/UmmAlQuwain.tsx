import { Link } from "wouter";
import SEO from "@/components/SEO";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    q: "Is there a defect liability period in Umm Al Quwain?",
    a: "Yes. UAE Federal Civil Code applies across all emirates, including Umm Al Quwain. Buyers have a one-year defect liability period from handover for general defects and a 10-year structural warranty. Umm Al Quwain Municipality oversees building regulation and can assist with formal defect logging where needed."
  },
  {
    q: "What areas in Umm Al Quwain does UrbanGrid inspect?",
    a: "We cover UAQ City, Al Salam City, UAQ Marina, Al Rashidiya, Al Qurm, and all residential developments across the emirate. UAQ's newer developments near the marina and Al Salam City are our most frequently inspected areas."
  },
  {
    q: "Why is UAQ becoming more popular with property investors?",
    a: "Umm Al Quwain offers among the most competitive property prices in the UAE, and new developments like Al Salam City by Rakeen are attracting buyers priced out of Dubai and Sharjah. Independent snagging is especially important for buyers acquiring at these price points — defect rectification costs can represent a significant percentage of the purchase price."
  },
];

export default function UmmAlQuwain() {
  return (
    <>
      <SEO
        title="Snagging Company Umm Al Quwain | Property Inspection | UrbanGrid"
        description="Professional property snagging and inspection in Umm Al Quwain. Engineer-led inspections across UAQ City, Al Salam City, UAQ Marina and all communities. Reports in 24 hours."
        keywords="snagging company umm al quwain, property inspection umm al quwain, property snagging UAQ, snagging umm al quwain, home inspection UAQ"
        canonical="https://urbangrid.ae/locations/umm-al-quwain"
      />

      <section className="pt-28 pb-20 bg-zinc-900">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">Umm Al Quwain · UAE</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 max-w-3xl">
            Snagging Company Umm Al Quwain
          </h1>
          <p className="text-zinc-300 text-base sm:text-lg leading-relaxed max-w-2xl mb-8">
            Independent property inspection and snagging in Umm Al Quwain — UAQ City, Al Salam City, UAQ Marina and all communities. Engineer-led, reports within 24 hours.
          </p>
          <Link href="/contact">
            <Button size="lg" className="bg-brand-green text-white hover:bg-emerald-700 px-8 py-6 text-sm font-semibold rounded-none">
              Book UAQ Inspection <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      <div className="bg-brand-green py-4">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 flex flex-wrap gap-6 items-center">
          {["All UAQ areas covered", "24-hour report delivery", "Northern Emirates specialists", "Engineer-led inspections"].map(t => (
            <span key={t} className="flex items-center gap-2 text-white text-xs font-medium">
              <CheckCircle className="w-3 h-3 shrink-0" /> {t}
            </span>
          ))}
        </div>
      </div>

      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">Why UAQ</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-zinc-900 leading-tight mb-6">
                Property Inspection in Umm Al Quwain
              </h2>
              <div className="space-y-4 text-zinc-600 text-sm leading-relaxed">
                <p>
                  Umm Al Quwain is the UAE's least densely developed emirate, but its property market is growing as buyers seek affordable alternatives to Dubai, Sharjah, and Ajman. Developments like Al Salam City by Rakeen have brought large residential unit volumes to UAQ, with handover timelines that require the same independent snagging diligence as any other emirate.
                </p>
                <p>
                  The emirate's coastal and lagoon-front properties carry specific environmental inspection requirements — waterproofing, metalwork corrosion, and window seal integrity are priority items given UAQ's humidity and proximity to water.
                </p>
                <p>
                  UrbanGrid covers all Umm Al Quwain areas, delivering engineer-led inspections with the same report standards applied across our UAE-wide operations.
                </p>
              </div>
            </div>
            <div className="bg-zinc-50 p-8 border border-zinc-100">
              <h3 className="text-sm font-bold text-zinc-900 mb-6 uppercase tracking-wide">UAQ Areas We Cover</h3>
              <div className="space-y-3">
                {["UAQ City Centre", "Al Salam City", "UAQ Marina", "Al Rashidiya", "Al Qurm", "Al Dar Al Baida", "UAQ Free Trade Zone Area", "Falaj Al Mualla", "Al Salamah"].map(area => (
                  <div key={area} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-green shrink-0" />
                    <span className="text-xs text-zinc-700">{area}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-zinc-50">
        <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-16">
          <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">FAQ</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-zinc-900 mb-12">UAQ Snagging — Common Questions</h2>
          <div className="divide-y divide-zinc-200 border-t border-b border-zinc-200">
            {faqs.map(faq => (
              <div key={faq.q} className="py-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <h3 className="text-sm font-semibold text-zinc-800">{faq.q}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-zinc-950 text-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div>
            <h2 className="text-3xl font-bold leading-tight mb-3">Book Your UAQ Property Inspection</h2>
            <p className="text-zinc-400 text-sm">Engineer-led · 24-hour report · All Umm Al Quwain areas</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <Link href="/contact">
              <Button size="lg" className="bg-brand-green text-white hover:bg-emerald-700 px-8 py-6 text-sm font-semibold rounded-none">
                Get a Free Quote
              </Button>
            </Link>
            <a href="tel:+971567427634" className="inline-flex items-center justify-center border border-zinc-600 text-zinc-300 px-8 py-6 text-sm font-medium hover:border-white hover:text-white transition-all">
              Call Us Now
            </a>
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "UrbanGrid Property Inspection Umm Al Quwain",
        "description": "Professional property snagging and inspection services in Umm Al Quwain, UAE",
        "url": "https://urbangrid.ae/locations/umm-al-quwain",
        "telephone": "+971567427634",
        "email": "info@urbangrid.ae",
        "areaServed": { "@type": "City", "name": "Umm Al Quwain", "addressCountry": "AE" },
        "priceRange": "$$"
      })}} />
    </>
  );
}
