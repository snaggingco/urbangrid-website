import { Link } from "wouter";
import SEO from "@/components/SEO";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const communities = [
  { name: "Downtown Dubai & Burj Khalifa District", types: "High-rise apartments, luxury units", note: "Emaar-built towers often show hollow tiles, AC balancing issues, and finishing inconsistencies across multi-floor developments." },
  { name: "Dubai Marina & JBR", types: "High-rise, waterfront towers", note: "Waterproofing at balcony thresholds and façade sealant failures are the most commonly logged defects in this corridor." },
  { name: "Palm Jumeirah", types: "Villas, signature apartments", note: "Salt-air corrosion on metalwork, drainage falls on terraces, and window seal failures are unique to the waterfront environment." },
  { name: "Business Bay", types: "Mixed-use towers, serviced apartments", note: "MEP routing conflicts and DEWA meter cabinet deficiencies frequently appear in the dense high-rise developments here." },
  { name: "Jumeirah Village Circle (JVC)", types: "Mid-rise apartments, townhouses", note: "Rapid delivery schedules in JVC mean common areas, stairwells, and parking often contain uncorrected snags at handover." },
  { name: "Dubai Hills Estate", types: "Villas, townhouses, apartments", note: "Emaar's masterplan community sees significant structural crack reports in villa party walls and inconsistent landscaping drainage." },
  { name: "Arabian Ranches I & II", types: "Villas, townhouses", note: "Older DLP windows mean many owners lose rectification rights; secondary market buyers need pre-purchase snagging urgently." },
  { name: "Mohammed Bin Rashid City", types: "Villas, branded residences", note: "Premium finishes demand high-spec snagging — we check marble lippage, bespoke joinery gaps, and smart-home commissioning." },
];

const keyCommunities = [
  { name: "Business Bay", blurb: "Dubai's central business district packs serviced apartments, branded residences, and commercial towers along the canal. Our Business Bay snagging inspections focus on MEP routing conflicts, DEWA meter cabinet deficiencies, and acoustic insulation between mixed-use floors." },
  { name: "Jumeirah Lake Towers (JLT)", blurb: "With more than 80 high-rise towers around its lakes, JLT is one of Dubai's densest residential and office clusters. We log façade sealant failures, chilled-water (district cooling) commissioning gaps, and balcony waterproofing across JLT handovers and resales." },
  { name: "Palm Jumeirah", blurb: "The Palm's signature villas and beachfront apartments face a unique salt-air environment. Our Palm Jumeirah inspections prioritise metalwork corrosion, terrace drainage falls, window seal integrity, and private-pool waterproofing." },
  { name: "Al Barari", blurb: "Al Barari's ultra-low-density luxury villas sit within landscaped botanical gardens. High-spec finishes demand meticulous snagging — we check bespoke joinery tolerances, marble lippage, smart-home commissioning, and irrigation and drainage integration." },
  { name: "Downtown Dubai", blurb: "Home to Burj Khalifa-district towers and premium Emaar residences, Downtown demands precise high-rise snagging. We document hollow tiling, AC balancing across multiple floors, and finishing inconsistencies before handover." },
  { name: "Dubai Marina & JBR", blurb: "This waterfront high-rise corridor is prone to balcony-threshold waterproofing and façade sealant defects. Our Marina and JBR snagging reports capture these issues while your developer DLP is still active." },
  { name: "Emirates Hills & Jumeirah Golf Estates", blurb: "Dubai's most exclusive gated villa communities feature large bespoke homes. We deliver high-spec villa snagging covering structural crack mapping, landscaping drainage, and premium MEP and smart-home systems." },
];

const faqs = [
  {
    q: "Does Dubai law require snagging before property handover?",
    a: "There is no mandatory law requiring buyers to commission an independent inspection, but RERA strongly encourages it. The DLD's handover process includes a developer-led walkthrough — however, developers have a commercial interest in a smooth handover. An independent UrbanGrid inspection identifies defects before you sign, while your DLP is still fully intact."
  },
  {
    q: "How long is the Defects Liability Period (DLP) for Dubai properties?",
    a: "Under Law No. 6 of 2019, Dubai developers must maintain a one-year structural defects warranty from the date of handover, plus a 10-year liability for major structural defects. We recommend booking a snagging inspection before handover and a second DLP inspection in months 10–11 to capture any issues that surface during occupancy."
  },
  {
    q: "Which Dubai developers does UrbanGrid work with most frequently?",
    a: "We work across all major Dubai developments — Emaar, Damac Properties, Sobha Realty, Nakheel, Meraas, Dubai Properties, Azizi, and smaller boutique developers. Our engineers are familiar with each developer's typical defect patterns and handover process, which allows faster, more targeted inspections."
  },
  {
    q: "Can I snag a secondary market (resale) property in Dubai?",
    a: "Yes, and we strongly recommend it. Resale properties may have hidden water damage, concealed electrical faults, or undeclared modifications. Our secondary market snagging report gives you a clear picture before you commit, and often supports price renegotiation. We cover all areas including older Emaar and Nakheel communities."
  },
  {
    q: "How much does a snagging inspection cost in Dubai?",
    a: "Pricing is based on built-up area (BUA) and service type. Stage 1 snagging starts from AED 0.75/sq.ft (under 500 sq.ft) up to AED 0.65/sq.ft for large units, plus 5% VAT. Ask Nova, our AI assistant, for an instant estimate — or contact our team for a tailored quote."
  },
  {
    q: "How quickly can I get a snagging report in Dubai?",
    a: "Reports are delivered within 24 hours of the inspection in the vast majority of cases. Our engineers use structured digital tools on-site, so the report is in contractor-ready format by the time you need it for the developer follow-up."
  },
];

export default function Dubai() {
  return (
    <>
      <SEO
        title="Snagging Company Dubai | Property Inspection Services | UrbanGrid"
        description="Dubai's trusted property snagging company. Independent inspection for Emaar, Damac, Sobha, Nakheel handovers across Downtown Dubai, Marina, Palm Jumeirah, JVC & all areas. Reports in 24 hours."
        keywords="snagging company dubai, property inspection dubai, property snagging dubai, snagging dubai, home inspection dubai, new build snagging dubai, apartment snagging dubai, villa inspection dubai, pre-handover inspection dubai, building inspection companies near me"
        canonical="https://urbangrid.ae/locations/dubai"
      />

      {/* Hero */}
      <section className="pt-28 pb-20 bg-zinc-900">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">Dubai · UAE</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 max-w-3xl">
            Snagging Company Dubai
          </h1>
          <p className="text-zinc-300 text-base sm:text-lg leading-relaxed max-w-2xl mb-8">
            Independent property inspection and snagging across all Dubai communities — from Emaar handovers in Downtown to villa snagging in Arabian Ranches. Engineer-led, RERA-aware, reports within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/contact">
              <Button size="lg" className="bg-brand-green text-white hover:bg-emerald-700 px-8 py-6 text-sm font-semibold rounded-none">
                Book Dubai Inspection <ArrowRight className="ml-2 w-4 h-4" />
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
          {["15,000+ Dubai inspections completed", "24-hour report delivery", "RERA & DLD compliant process", "All Dubai communities covered"].map(t => (
            <span key={t} className="flex items-center gap-2 text-white text-xs font-medium">
              <CheckCircle className="w-3 h-3 shrink-0" /> {t}
            </span>
          ))}
        </div>
      </div>

      {/* Why Snag in Dubai */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">Why Dubai</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-zinc-900 leading-tight mb-6">
                Why Snagging is Critical in Dubai's Property Market
              </h2>
              <div className="space-y-4 text-zinc-600 text-sm leading-relaxed">
                <p>
                  Dubai's property market sees tens of thousands of new-build handovers every year — and the pace of delivery creates pressure that often results in defects slipping through developers' own quality control. Our engineers have documented over 15,000 Dubai inspections and found an average of 24 defects per property at handover.
                </p>
                <p>
                  The Dubai Land Department (DLD) and RERA have established a structured handover process, but the onus is on the buyer to identify and formally log defects before accepting the property. Once you sign the handover form, uncorrected issues become your financial responsibility unless you can prove they existed at handover.
                </p>
                <p>
                  A professional UrbanGrid snagging report provides the documented evidence you need. Our reports are structured specifically for developer liaison — each defect is photographed, geo-referenced within the unit, and categorised by urgency — so your developer cannot dispute or dismiss the findings.
                </p>
              </div>
            </div>
            <div className="bg-zinc-50 p-8 border border-zinc-100">
              <h3 className="text-sm font-bold text-zinc-900 mb-6 uppercase tracking-wide">Dubai Regulatory Framework</h3>
              <div className="space-y-5">
                {[
                  { label: "RERA", detail: "Real Estate Regulatory Agency — oversees the handover process and developer obligations under the Strata Law." },
                  { label: "DLD", detail: "Dubai Land Department — registers the property transfer. Defects must be logged before DLD transfer is finalised." },
                  { label: "1-Year DLP", detail: "Developers are legally liable for one year from handover for all defects. Structural liability extends to 10 years." },
                  { label: "DEWA Standards", detail: "All electrical systems must comply with DEWA regulations. We test every circuit, socket, and distribution board against these standards." },
                  { label: "Dubai Civil Defence", detail: "Fire safety systems — smoke detectors, sprinklers, and emergency lighting — are verified to DCD and NFPA 72 standards." },
                ].map(item => (
                  <div key={item.label} className="flex gap-4">
                    <div className="w-16 shrink-0">
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
          <h2 className="text-3xl lg:text-4xl font-bold text-zinc-900 leading-tight mb-4 max-w-2xl">
            Every Dubai Community — We Know the Defects
          </h2>
          <p className="text-zinc-500 text-sm leading-relaxed max-w-xl mb-12">
            After 15,000+ inspections in Dubai, our engineers know which defects are common in each community, developer, and property type. That knowledge means faster, more thorough inspections.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-200">
            {communities.map(c => (
              <div key={c.name} className="bg-white p-6 lg:p-8">
                <h3 className="text-sm font-bold text-zinc-900 mb-1">{c.name}</h3>
                <p className="text-[11px] text-brand-green font-medium mb-3">{c.types}</p>
                <p className="text-xs text-zinc-500 leading-relaxed">{c.note}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-zinc-400 mt-6">Also covering: Silicon Oasis, International City, Sports City, Al Barsha, Deira, Bur Dubai, Mirdif, Discovery Gardens, and all other Dubai areas.</p>
        </div>
      </section>

      {/* Key Communities Served */}
      <section className="py-20 lg:py-28 bg-white border-t border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">Key Communities Served</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-zinc-900 leading-tight mb-4 max-w-2xl">
            Snagging Expertise Across Dubai's Premier Communities
          </h2>
          <p className="text-zinc-500 text-sm leading-relaxed max-w-2xl mb-12">
            From waterfront towers in Dubai Marina to botanical villas in Al Barari, UrbanGrid provides neighbourhood-specific property inspection and snagging expertise across Dubai's highest-value residential and commercial hubs.
          </p>
          <div className="space-y-10">
            {keyCommunities.map(c => (
              <div key={c.name} className="border-l-2 border-brand-green pl-6">
                <h3 className="text-lg font-bold text-zinc-900 mb-2">Property Snagging in {c.name}</h3>
                <p className="text-sm text-zinc-600 leading-relaxed max-w-3xl">{c.blurb}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Developers */}
      <section className="py-20 bg-white border-y border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">Developers</p>
          <h2 className="text-3xl font-bold text-zinc-900 mb-10">Dubai Developers We Inspect</h2>
          <div className="flex flex-wrap gap-3">
            {["Emaar Properties", "Damac Properties", "Sobha Realty", "Nakheel", "Meraas", "Dubai Properties Group", "Azizi Developments", "Omniyat", "Select Group", "Ellington Properties", "MAG Property Development", "Binghatti Developers"].map(d => (
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
          <h2 className="text-3xl lg:text-4xl font-bold text-zinc-900 mb-12">Dubai Snagging — Common Questions</h2>
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
            <h2 className="text-3xl lg:text-4xl font-bold leading-tight mb-3">Ready to Snag Your Dubai Property?</h2>
            <p className="text-zinc-400 text-sm">Engineer-led · 24-hour report · Contractor-ready format · All Dubai areas</p>
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

      {/* Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "UrbanGrid Property Inspection Dubai",
        "description": "Professional property snagging and inspection services in Dubai, UAE",
        "url": "https://urbangrid.ae/locations/dubai",
        "telephone": "+971567427634",
        "email": "info@urbangrid.ae",
        "areaServed": { "@type": "City", "name": "Dubai", "addressCountry": "AE" },
        "address": { "@type": "PostalAddress", "addressLocality": "Dubai", "addressCountry": "AE" },
        "priceRange": "$$"
      })}} />
    </>
  );
}
