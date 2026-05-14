import { Link } from "wouter";
import SEO from "@/components/SEO";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const communities = [
  { name: "Aljada", types: "Apartments, townhouses, villas", note: "Arada's flagship masterplan. Our engineers regularly find drainage gradient failures in ground-floor units and AC duct sealing gaps in the mid-rise buildings." },
  { name: "Hayyan", types: "Villas, townhouses", note: "Arada's villa community. Structural cracking in boundary walls and inconsistent tile grouting in bathrooms are the most common findings." },
  { name: "Maryam Island", types: "Waterfront apartments", note: "Waterfront exposure creates specific risks — balcony waterproofing, window seal integrity, and metalwork corrosion are priority checks here." },
  { name: "Al Zahia", types: "Villas, townhouses", note: "Sharjah's premier gated community. Finishing quality is generally high, but MEP commissioning gaps and smart home integration defects appear regularly." },
  { name: "Tilal City", types: "Mixed-use, residential plots", note: "Self-build and contractor-built units require particularly thorough structural and MEP inspections before occupation certificates are sought." },
  { name: "Sharjah Waterfront City", types: "Apartments, mixed-use", note: "New waterfront development; our team checks marine-grade material specifications against installed products and waterproofing continuity." },
];

const faqs = [
  {
    q: "Which authority governs property handovers in Sharjah?",
    a: "The Sharjah Real Estate Registration Department (SRERD) is the primary authority for property registration and real estate regulation in Sharjah. Unlike Dubai's DLD/RERA split, SRERD handles both registration and regulatory functions. Developers must comply with SRERD's handover procedures before transferring title."
  },
  {
    q: "Is snagging in Sharjah different from Dubai?",
    a: "The engineering scope is identical — we inspect to the same standards regardless of emirate. Administratively, Sharjah's handover documentation follows SRERD requirements rather than DLD/RERA, and our reports are formatted to work for both. Sharjah also has a different municipality for building permits, which affects certain MEP compliance references."
  },
  {
    q: "How long is the Defects Liability Period in Sharjah?",
    a: "Sharjah follows the UAE Federal Civil Code, which provides a one-year DLP from handover for general defects and a 10-year liability for major structural failures. SRERD maintains a register of developer obligations. We recommend snagging before handover and a second inspection in months 10–11 of the DLP."
  },
  {
    q: "Do you inspect Arada projects in Sharjah?",
    a: "Yes, extensively. Aljada and Hayyan are among our most frequently inspected communities in Sharjah. Our engineers know Arada's typical defect patterns — particularly drainage, tiling, and AC commissioning — and can conduct a highly targeted inspection as a result."
  },
  {
    q: "Can I use a UrbanGrid Sharjah report to renegotiate a resale price?",
    a: "Absolutely. Our secondary market inspection reports are specifically structured to document defects with photographic evidence, area measurements, and estimated rectification costs. Buyers regularly use our reports to negotiate price reductions on Sharjah resale properties."
  },
];

export default function Sharjah() {
  return (
    <>
      <SEO
        title="Snagging Company Sharjah | Property Inspection Services | UrbanGrid"
        description="Sharjah's trusted property snagging company. Independent inspection across Aljada, Hayyan, Maryam Island, Al Zahia and all Sharjah communities. Reports in 24 hours."
        keywords="snagging company sharjah, property inspection sharjah, property snagging sharjah, snagging sharjah, home inspection sharjah, apartment snagging sharjah, villa inspection sharjah, Aljada snagging, Arada inspection"
        canonical="https://urbangrid.ae/locations/sharjah"
      />

      {/* Hero */}
      <section className="pt-28 pb-20 bg-zinc-900">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">Sharjah · UAE</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 max-w-3xl">
            Snagging Company Sharjah
          </h1>
          <p className="text-zinc-300 text-base sm:text-lg leading-relaxed max-w-2xl mb-8">
            Independent property inspection and snagging across all Sharjah communities — Aljada, Hayyan, Maryam Island, Al Zahia, and beyond. Engineer-led, SRERD-aware, reports within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/contact">
              <Button size="lg" className="bg-brand-green text-white hover:bg-emerald-700 px-8 py-6 text-sm font-semibold rounded-none">
                Book Sharjah Inspection <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/services">
              <Button variant="outline" size="lg" className="border-zinc-600 text-zinc-300 hover:border-white hover:text-white px-8 py-6 text-sm font-semibold rounded-none bg-transparent">
                View All Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <div className="bg-brand-green py-4">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 flex flex-wrap gap-6 items-center justify-between">
          {["8,000+ Sharjah inspections completed", "24-hour report delivery", "SRERD-compliant process", "All Sharjah communities covered"].map(t => (
            <span key={t} className="flex items-center gap-2 text-white text-xs font-medium">
              <CheckCircle className="w-3 h-3 shrink-0" /> {t}
            </span>
          ))}
        </div>
      </div>

      {/* Why Snag in Sharjah */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">Why Sharjah</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-zinc-900 leading-tight mb-6">
                Sharjah's Growing Property Market Needs Independent Snagging
              </h2>
              <div className="space-y-4 text-zinc-600 text-sm leading-relaxed">
                <p>
                  Sharjah has emerged as one of the UAE's fastest-growing residential markets, driven by Arada's multi-billion-dirham masterplan developments at Aljada and Hayyan, and major waterfront projects at Maryam Island and Sharjah Waterfront City. The volume and pace of delivery creates the same defect risks seen in Dubai and Abu Dhabi.
                </p>
                <p>
                  Sharjah properties often attract buyers seeking more competitive price points than Dubai — but that same price sensitivity makes it even more important to identify defects before handover. A UrbanGrid inspection ensures you're not absorbing rectification costs that the developer should bear.
                </p>
                <p>
                  Our Sharjah team has completed over 8,000 inspections in the emirate, covering everything from Arada's large-scale communities to smaller boutique developments and secondary market properties across established Sharjah neighbourhoods.
                </p>
              </div>
            </div>
            <div className="bg-zinc-50 p-8 border border-zinc-100">
              <h3 className="text-sm font-bold text-zinc-900 mb-6 uppercase tracking-wide">Sharjah Regulatory Framework</h3>
              <div className="space-y-5">
                {[
                  { label: "SRERD", detail: "Sharjah Real Estate Registration Department — governs property registration and developer obligations in Sharjah." },
                  { label: "SEWA", detail: "Sharjah Electricity & Water Authority — all electrical and plumbing installations must meet SEWA standards. We verify compliance on every inspection." },
                  { label: "Sharjah Municipality", detail: "Issues building permits and occupation certificates. Our reports are structured to support the NOC process where applicable." },
                  { label: "DLP — 1 Year", detail: "One-year defect liability period from handover under UAE Federal Civil Code. Stage 1 snagging before handover is essential to protect your rights." },
                  { label: "10-Year Structural", detail: "Major structural defects carry a 10-year liability period. We flag structural concerns in every report with urgency classification." },
                ].map(item => (
                  <div key={item.label} className="flex gap-4">
                    <div className="w-20 shrink-0">
                      <span className="text-[10px] font-bold text-brand-green uppercase tracking-wide">{item.label}</span>
                    </div>
                    <p className="text-xs text-zinc-600 leading-relaxed">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Communities */}
      <section className="py-20 lg:py-28 bg-zinc-50">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">Communities We Cover</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-zinc-900 leading-tight mb-12 max-w-2xl">
            Sharjah Communities We Inspect
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-200">
            {communities.map(c => (
              <div key={c.name} className="bg-white p-6 lg:p-8">
                <h3 className="text-sm font-bold text-zinc-900 mb-1">{c.name}</h3>
                <p className="text-[11px] text-brand-green font-medium mb-3">{c.types}</p>
                <p className="text-xs text-zinc-500 leading-relaxed">{c.note}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-zinc-400 mt-6">Also covering: Al Taawun, Al Nahda, Al Majaz, Muwaileh Commercial, Halwan, Al Qasbaa, Al Khan, and all Sharjah areas.</p>
        </div>
      </section>

      {/* Developers */}
      <section className="py-20 bg-white border-y border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">Developers</p>
          <h2 className="text-3xl font-bold text-zinc-900 mb-10">Sharjah Developers We Inspect</h2>
          <div className="flex flex-wrap gap-3">
            {["Arada", "Shurooq (Sharjah Investment & Development Authority)", "Sharjah Asset Management (SAM)", "Alef Group", "Eagle Hills Sharjah", "Eskan", "Expo Real Estate"].map(d => (
              <span key={d} className="px-4 py-2 border border-zinc-200 text-xs font-medium text-zinc-700 hover:border-brand-green hover:text-brand-green transition-colors">
                {d}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 lg:py-28 bg-zinc-50">
        <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-16">
          <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">FAQ</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-zinc-900 mb-12">Sharjah Snagging — Common Questions</h2>
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

      {/* CTA */}
      <section className="py-20 bg-zinc-950 text-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold leading-tight mb-3">Ready to Snag Your Sharjah Property?</h2>
            <p className="text-zinc-400 text-sm">Engineer-led · 24-hour report · Contractor-ready format · All Sharjah areas</p>
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
        "name": "UrbanGrid Property Inspection Sharjah",
        "description": "Professional property snagging and inspection services in Sharjah, UAE",
        "url": "https://urbangrid.ae/locations/sharjah",
        "telephone": "+971567427634",
        "email": "info@urbangrid.ae",
        "areaServed": { "@type": "City", "name": "Sharjah", "addressCountry": "AE" },
        "address": { "@type": "PostalAddress", "addressLocality": "Sharjah", "addressCountry": "AE" },
        "priceRange": "$$"
      })}} />
    </>
  );
}
