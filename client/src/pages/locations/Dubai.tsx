import { Link } from "wouter";
import SEO from "@/components/SEO";
import { ArrowRight, CheckCircle } from "lucide-react";
import DubaiHero from "@/components/first-paint/DubaiHero";
import { dubaiFAQs } from "@shared/publicFAQs";

const communities = [
  { name: "Downtown Dubai & Burj Khalifa District", types: "High-rise apartments and residences", note: "Inspection scope is agreed for each property and depends on access to the unit and relevant building areas." },
  { name: "Dubai Marina & JBR", types: "High-rise and waterfront properties", note: "Accessible rooms and agreed exterior areas can be reviewed during the physical inspection." },
  { name: "Palm Jumeirah", types: "Villas and apartments", note: "Availability, access and requested inspection type are confirmed for the specific address." },
  { name: "Business Bay", types: "Residential and mixed-use towers", note: "Building access requirements and any common-area scope should be confirmed with management in advance." },
  { name: "Jumeirah Village Circle (JVC)", types: "Apartments and townhouses", note: "Unit access, utilities and booking requirements are coordinated for each property." },
  { name: "Dubai Hills Estate", types: "Villas, townhouses and apartments", note: "The inspection is limited to areas that can be accessed and observed within the agreed scope." },
  { name: "Arabian Ranches I & II", types: "Villas and townhouses", note: "Share available property records and any previous observations when arranging the inspection." },
  { name: "Mohammed Bin Rashid City", types: "Villas and apartments", note: "Requested checks and access limitations are confirmed before the site visit." },
];

export default function Dubai() {
  return (
    <>
      <SEO
        title="Dubai Inspection Services & Community Coverage | UrbanGrid"
        description="Explore UrbanGrid's Dubai inspection coverage, communities and service options. Find handover, DLP and resale inspections and request a property quote."
        keywords="Dubai inspection coverage, Dubai communities, handover inspection Dubai, DLP inspection Dubai, resale property inspection Dubai"
        canonical="https://urbangrid.ae/locations/dubai"
      />

      <DubaiHero />

      <div className="bg-brand-green py-3.5">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-x-8 gap-y-2 px-5 text-xs font-medium text-white sm:px-10 lg:px-16">
          {["Independent property inspections", "24-hour report preparation target after inspection & payment", "Apartments, villas & townhouses", "Coverage across Dubai"].map((item) => (
            <span key={item} className="flex items-center gap-2"><CheckCircle className="h-3 w-3 shrink-0" aria-hidden="true" />{item}</span>
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
                Plan inspection access before your property visit
              </h2>
              <div className="space-y-4 text-zinc-600 text-sm leading-relaxed">
                <p>
                  An independent inspection can provide a dated record of visible conditions before a handover or purchase decision. The value of that record depends on access, agreed scope and what can be observed on the day.
                </p>
                <p>
                  Coordinate appointments, keys, visitor permits and utility access with the seller, developer or building management. Warranty terms and notification requirements depend on the documents and circumstances that apply to your property.
                </p>
                <p>
                  The report records observations and supporting photographs where appropriate. It can help you raise clear questions with the relevant party, but does not guarantee acceptance, repairs or a particular outcome.
                </p>
              </div>
            </div>
            <div className="bg-zinc-50 p-8 border border-zinc-100">
              <h3 className="text-sm font-bold text-zinc-900 mb-6 uppercase tracking-wide">Before the inspection</h3>
              <div className="space-y-5">
                {[
                  { label: "Access", detail: "Confirm building registration, keys, visitor permits and any seller or management requirements." },
                  { label: "Documents", detail: "Share available plans, handover notes, warranty information or prior defect lists." },
                  { label: "Utilities", detail: "Ask whether electricity and water can be available for any agreed functional observations." },
                  { label: "Scope", detail: "Confirm requested inspection type, accessible areas and any limitations before booking." },
                  { label: "Timing", detail: "Check any relevant contractual deadlines and leave time for your own follow-up." },
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
          <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">Coverage</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-zinc-900 leading-tight mb-4 max-w-2xl">
            Residential inspection coverage across Dubai
          </h2>
          <p className="text-zinc-500 text-sm leading-relaxed max-w-xl mb-12">
            Apartment, villa and townhouse availability is confirmed for each property. Community listing does not imply an office or developer affiliation.
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
          <p className="mt-6 text-sm leading-relaxed text-zinc-600">
            Choose the inspection for your Dubai property:{" "}
            <Link href="/services/property-snagging/new-build-snagging" className="font-medium text-brand-green underline underline-offset-4 hover:text-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green">New Build Handover Snagging</Link>
            {" "}before a new-property handover,{" "}
            <Link href="/services/property-snagging/dlp-snagging" className="font-medium text-brand-green underline underline-offset-4 hover:text-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green">DLP Snagging</Link>
            {" "}during the applicable warranty period, or{" "}
            <Link href="/services/property-snagging/secondary-market" className="font-medium text-brand-green underline underline-offset-4 hover:text-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green">Secondary Market / Resale Inspection</Link>
            {" "}before purchasing an existing property.
          </p>
        </div>
      </section>

      {/* Developers */}
      <section className="py-20 bg-white border-y border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">Developers</p>
          <h2 className="text-3xl font-bold text-zinc-900 mb-3">Developers active in Dubai</h2>
          <p className="mb-8 max-w-2xl text-xs leading-relaxed text-zinc-500">Names shown are examples only; listing a developer does not imply affiliation or endorsement.</p>
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
            {dubaiFAQs.map(faq => (
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
          <div className="flex flex-col gap-4 shrink-0 sm:flex-row sm:items-center">
            <a href="#dubai-quote" className="inline-flex items-center justify-center gap-2 bg-brand-green px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              Request a tailored quote <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a href="tel:+971585686852" className="inline-flex items-center justify-center border border-zinc-600 px-8 py-4 text-sm font-medium text-zinc-300 transition-colors hover:border-white hover:text-white">
              Call +971 58 568 6852
            </a>
          </div>
        </div>
      </section>

      {/* Schema */}
    </>
  );
}
