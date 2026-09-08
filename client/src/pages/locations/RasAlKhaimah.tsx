import { Link } from "wouter";
import SEO from "@/components/SEO";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    q: "Which authority governs property handovers in Ras Al Khaimah?",
    a: "The Ras Al Khaimah Real Estate Regulatory Authority (RERA RAK) and RAK Municipality jointly oversee real estate in the emirate. RAK's regulatory framework has been strengthened significantly in recent years, with formal handover procedures and defect liability protections for buyers aligned with UAE federal law."
  },
  {
    q: "Does RAK have good investment potential for snagging buyers?",
    a: "RAK has seen strong investment growth, particularly in Al Hamra Village, Mina Al Arab, and the new Wynn resort precinct. Many buyers are acquiring off-plan units that will complete in 2025–2027. Getting a snagging inspection before handover is essential to protect an investment that may be purchased remotely."
  },
  {
    q: "What areas in Ras Al Khaimah does UrbanGrid cover?",
    a: "We cover all RAK areas including Al Hamra Village, Mina Al Arab, Al Marjan Island, Julphar Towers, Bab Al Bahr, Al Nakheel, Khuzam, Al Dhait, and all major residential developments across the emirate."
  },
  {
    q: "How does UrbanGrid reach Ras Al Khaimah from Dubai?",
    a: "Our RAK-based engineers are stationed in the emirate for regular inspection days. For urgent bookings, our Dubai team can reach RAK within 90 minutes. There is no additional emirate surcharge for standard RAK properties."
  },
];

export default function RasAlKhaimah() {
  return (
    <>
      <SEO
        title="Snagging Company Ras Al Khaimah | Property Inspection | UrbanGrid"
        description="Professional property snagging and inspection in Ras Al Khaimah. Al Hamra Village, Mina Al Arab, Al Marjan Island and all RAK communities. Engineer-led, reports in 24 hours."
        keywords="snagging company ras al khaimah, property inspection ras al khaimah, property snagging RAK, snagging ras al khaimah, home inspection RAK, Al Hamra snagging"
        canonical="https://urbangrid.ae/locations/ras-al-khaimah"
      />

      <section className="pt-28 pb-20 bg-zinc-900">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">Ras Al Khaimah · UAE</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 max-w-3xl">
            Snagging Company Ras Al Khaimah
          </h1>
          <p className="text-zinc-300 text-base sm:text-lg leading-relaxed max-w-2xl mb-8">
            Independent property inspection and snagging across Al Hamra Village, Mina Al Arab, Al Marjan Island, and all RAK communities. Engineer-led, reports within 24 hours.
          </p>
          <Link href="/contact">
            <Button size="lg" className="bg-brand-green text-white hover:bg-emerald-700 px-8 py-6 text-sm font-semibold rounded-none">
              Book RAK Inspection <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      <div className="bg-brand-green py-4">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 flex flex-wrap gap-6 items-center">
          {["All RAK communities covered", "24-hour report delivery", "Local & Dubai-based engineers", "Engineer-led inspections"].map(t => (
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
              <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">Why RAK</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-zinc-900 leading-tight mb-6">
                Ras Al Khaimah's Rising Property Market
              </h2>
              <div className="space-y-4 text-zinc-600 text-sm leading-relaxed">
                <p>
                  Ras Al Khaimah has transformed from a quiet northern emirate into one of the UAE's most watched real estate markets, driven by the Al Marjan Island resort precinct, expanded Al Hamra Village, and the forthcoming Wynn resort development. Investment demand — particularly from international buyers — has grown substantially.
                </p>
                <p>
                  RAK Properties, Al Hamra Real Estate, and a growing roster of developers are delivering significant unit volumes. Many buyers purchase remotely and rely entirely on the developer's walkthrough at handover — without independent verification of defects. This creates significant financial risk.
                </p>
                <p>
                  UrbanGrid's RAK inspections cover the full engineering scope: structural elements, MEP systems, fire safety, finishes, and waterproofing — using the same NFPA, ASHRAE, and ASTM standards applied across all our UAE work.
                </p>
              </div>
            </div>
            <div className="bg-zinc-50 p-8 border border-zinc-100">
              <h3 className="text-sm font-bold text-zinc-900 mb-6 uppercase tracking-wide">RAK Communities We Cover</h3>
              <div className="space-y-3">
                {[
                  "Al Hamra Village", "Mina Al Arab", "Al Marjan Island",
                  "Julphar Towers", "Bab Al Bahr", "Al Nakheel",
                  "Khuzam", "Al Dhait", "Al Mamourah",
                  "Yasmin Village", "Al Jazeera Al Hamra", "RAK City Centre"
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
          <h2 className="text-3xl lg:text-4xl font-bold text-zinc-900 mb-12">RAK Snagging — Common Questions</h2>
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
            <h2 className="text-3xl font-bold leading-tight mb-3">Book Your RAK Property Inspection</h2>
            <p className="text-zinc-400 text-sm">Engineer-led · 24-hour report · All Ras Al Khaimah areas</p>
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
        "name": "UrbanGrid Property Inspection Ras Al Khaimah",
        "description": "Professional property snagging and inspection services in Ras Al Khaimah, UAE",
        "url": "https://urbangrid.ae/locations/ras-al-khaimah",
        "telephone": "+971585686852",
        "email": "info@urbangrid.ae",
        "areaServed": { "@type": "City", "name": "Ras Al Khaimah", "addressCountry": "AE" },
        "priceRange": "$$"
      })}} />
    </>
  );
}
