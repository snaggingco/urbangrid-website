import { Link } from "wouter";
import SEO from "@/components/SEO";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    q: "Which authority governs property in Fujairah?",
    a: "Fujairah Municipality is the primary authority for building permits and property regulation in Fujairah. Real estate registration is handled through the Fujairah Land Registration Department. While Fujairah's market is smaller than Dubai or Abu Dhabi, buyers still have defect liability protections under UAE Federal Civil Code."
  },
  {
    q: "What areas in Fujairah does UrbanGrid cover?",
    a: "We cover Fujairah City, Dibba Al Fujairah, Al Aqah (beach resort areas), Qidfa, Masafi, Kalba, and Khor Fakkan. Coverage across all Fujairah communities is available with advance booking."
  },
  {
    q: "Is snagging in Fujairah different due to the coastal environment?",
    a: "Coastal exposure in Fujairah — especially in the Al Aqah and Dibba beachfront areas — creates specific risks: salt-air corrosion on metalwork, balcony waterproofing failures, and window seal degradation are priority items in our Fujairah inspections. We calibrate our focus accordingly."
  },
];

export default function Fujairah() {
  return (
    <>
      <SEO
        title="Snagging Company Fujairah | Property Inspection Services | UrbanGrid"
        description="Professional property snagging and inspection in Fujairah. Engineer-led inspections across Fujairah City, Dibba, Al Aqah and all communities. Reports in 24 hours."
        keywords="snagging company fujairah, property inspection fujairah, property snagging fujairah, snagging fujairah, home inspection fujairah"
        canonical="https://urbangrid.ae/locations/fujairah"
      />

      <section className="pt-28 pb-20 bg-zinc-900">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">Fujairah · UAE</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 max-w-3xl">
            Snagging Company Fujairah
          </h1>
          <p className="text-zinc-300 text-base sm:text-lg leading-relaxed max-w-2xl mb-8">
            Independent property inspection and snagging in Fujairah, Dibba, Al Aqah, and surrounding areas. Engineer-led, reports within 24 hours.
          </p>
          <Link href="/contact">
            <Button size="lg" className="bg-brand-green text-white hover:bg-emerald-700 px-8 py-6 text-sm font-semibold rounded-none">
              Book Fujairah Inspection <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      <div className="bg-brand-green py-4">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 flex flex-wrap gap-6 items-center">
          {["All Fujairah areas covered", "24-hour report delivery", "Coastal property specialists", "Engineer-led inspections"].map(t => (
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
              <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">Why Fujairah</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-zinc-900 leading-tight mb-6">
                Property Inspection in the East Coast Emirates
              </h2>
              <div className="space-y-4 text-zinc-600 text-sm leading-relaxed">
                <p>
                  Fujairah's property market is characterised by its unique east coast setting — beachfront developments in Al Aqah, residential communities in Fujairah City, and growing tourism-led investment in Dibba. The coastal environment creates specific inspection requirements that generic inspectors often overlook.
                </p>
                <p>
                  Salt-air exposure accelerates the degradation of window seals, metalwork, and façade cladding in ways that are not immediately visible. Our engineers are experienced in east coast coastal inspections and calibrate their focus to the unique environmental risks of Fujairah's waterfront and near-coastal properties.
                </p>
                <p>
                  We inspect all residential property types in Fujairah — villas, apartments, townhouses, and resort units — delivering the same engineering-standard reports used across our UAE-wide operations.
                </p>
              </div>
            </div>
            <div className="bg-zinc-50 p-8 border border-zinc-100">
              <h3 className="text-sm font-bold text-zinc-900 mb-6 uppercase tracking-wide">Fujairah Areas We Cover</h3>
              <div className="space-y-3">
                {["Fujairah City", "Dibba Al Fujairah", "Al Aqah Beach Area", "Qidfa", "Masafi", "Kalba", "Khor Fakkan", "Mirbah", "Al Hayl", "Fujairah Free Zone Area"].map(area => (
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
          <h2 className="text-3xl lg:text-4xl font-bold text-zinc-900 mb-12">Fujairah Snagging — Common Questions</h2>
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
            <h2 className="text-3xl font-bold leading-tight mb-3">Book Your Fujairah Property Inspection</h2>
            <p className="text-zinc-400 text-sm">Engineer-led · 24-hour report · All Fujairah areas</p>
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
        "name": "UrbanGrid Property Inspection Fujairah",
        "description": "Professional property snagging and inspection services in Fujairah, UAE",
        "url": "https://urbangrid.ae/locations/fujairah",
        "telephone": "+971567427634",
        "email": "info@urbangrid.ae",
        "areaServed": { "@type": "City", "name": "Fujairah", "addressCountry": "AE" },
        "priceRange": "$$"
      })}} />
    </>
  );
}
