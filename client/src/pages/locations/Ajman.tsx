import { Link } from "wouter";
import SEO from "@/components/SEO";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    q: "Which authority regulates property handovers in Ajman?",
    a: "The Ajman Real Estate Regulatory Agency (ARRA) oversees all real estate registration and developer obligations in Ajman. ARRA has established handover procedures similar to Dubai's RERA, including defect liability period requirements that buyers should understand before accepting a property."
  },
  {
    q: "How long is the DLP in Ajman?",
    a: "Under UAE Federal Civil Code, the defect liability period in Ajman is one year from handover for general defects and 10 years for major structural failures. ARRA enforces these obligations. We recommend a snagging inspection before handover and a follow-up DLP check in months 10–11."
  },
  {
    q: "What areas in Ajman does UrbanGrid cover?",
    a: "We cover all Ajman areas including Al Rashidiya, Al Nuaimia, Emirates City, Al Hamidiya, Al Mowaihat, Garden City, Ajman Corniche, Al Jurf, and all new developments across the emirate."
  },
  {
    q: "Is property inspection in Ajman cheaper than Dubai?",
    a: "Our pricing is based on the property's built-up area (BUA) and service type, not the emirate. Ajman properties are often smaller in BUA, which may result in a lower overall fee. Contact us or use the Nova AI chat for an instant estimate based on your property's specific size and type."
  },
];

export default function Ajman() {
  return (
    <>
      <SEO
        title="Snagging Company Ajman | Property Inspection Services | UrbanGrid"
        description="Professional property snagging and inspection services in Ajman. ARRA-compliant process, engineer-led inspections across all Ajman communities. Reports in 24 hours."
        keywords="snagging company ajman, property inspection ajman, property snagging ajman, snagging ajman, home inspection ajman, apartment inspection ajman"
        canonical="https://urbangrid.ae/locations/ajman"
      />

      <section className="pt-28 pb-20 bg-zinc-900">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">Ajman · UAE</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 max-w-3xl">
            Snagging Company Ajman
          </h1>
          <p className="text-zinc-300 text-base sm:text-lg leading-relaxed max-w-2xl mb-8">
            Independent property inspection and snagging across all Ajman communities. Engineer-led, ARRA-aware, reports within 24 hours.
          </p>
          <Link href="/contact">
            <Button size="lg" className="bg-brand-green text-white hover:bg-emerald-700 px-8 py-6 text-sm font-semibold rounded-none">
              Book Ajman Inspection <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      <div className="bg-brand-green py-4">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 flex flex-wrap gap-6 items-center">
          {["All Ajman areas covered", "24-hour report delivery", "ARRA-compliant process", "Engineer-led inspections"].map(t => (
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
              <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">Why Ajman</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-zinc-900 leading-tight mb-6">
                Property Snagging in Ajman's Growing Market
              </h2>
              <div className="space-y-4 text-zinc-600 text-sm leading-relaxed">
                <p>
                  Ajman has long been valued for its competitive property prices, attracting buyers from across the Northern Emirates and beyond. The emirate's real estate market has matured significantly, with the Ajman Real Estate Regulatory Agency (ARRA) introducing structured handover procedures that protect buyers' rights.
                </p>
                <p>
                  Despite regulatory improvements, the pace of delivery in communities like Emirates City and Al Mowaihat means that defects still regularly slip through developer quality control. Our engineers have inspected properties across Ajman's major communities and know the typical defect profiles — from waterproofing failures in low-rise apartments to MEP commissioning gaps in high-rise towers.
                </p>
                <p>
                  UrbanGrid's Ajman inspections cover the full scope: finishing quality, MEP systems, structural elements, fire safety, and building services — with reports delivered within 24 hours in contractor-ready format.
                </p>
              </div>
            </div>
            <div className="bg-zinc-50 p-8 border border-zinc-100">
              <h3 className="text-sm font-bold text-zinc-900 mb-6 uppercase tracking-wide">Ajman Communities We Cover</h3>
              <div className="space-y-3">
                {[
                  "Emirates City", "Al Rashidiya", "Al Nuaimia 1, 2 & 3", "Al Mowaihat",
                  "Garden City", "Al Hamidiya", "Ajman Corniche", "Al Jurf Industrial",
                  "Al Rumaila", "Al Rawda", "City Towers Ajman", "Ajman Uptown"
                ].map(area => (
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
          <h2 className="text-3xl lg:text-4xl font-bold text-zinc-900 mb-12">Ajman Snagging — Common Questions</h2>
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
            <h2 className="text-3xl font-bold leading-tight mb-3">Book Your Ajman Property Inspection</h2>
            <p className="text-zinc-400 text-sm">Engineer-led · 24-hour report · All Ajman areas</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <Link href="/contact">
              <Button size="lg" className="bg-brand-green text-white hover:bg-emerald-700 px-8 py-6 text-sm font-semibold rounded-none">
                Get a Free Quote
              </Button>
            </Link>
            <a href="tel:+971585686852" className="inline-flex items-center justify-center border border-zinc-600 text-zinc-300 px-8 py-6 text-sm font-medium hover:border-white hover:text-white transition-all">
              Call Us Now
            </a>
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "UrbanGrid Property Inspection Ajman",
        "description": "Professional property snagging and inspection services in Ajman, UAE",
        "url": "https://urbangrid.ae/locations/ajman",
        "telephone": "+971585686852",
        "email": "info@urbangrid.ae",
        "areaServed": { "@type": "City", "name": "Ajman", "addressCountry": "AE" },
        "priceRange": "$$"
      })}} />
    </>
  );
}
