import { Link } from "wouter";
import SEO from "@/components/SEO";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const communities = [
  { name: "Yas Island", types: "Apartments, villas, townhouses", note: "Aldar's flagship community. Common findings include AC commissioning gaps, swimming pool waterproofing failures, and smart home system deficiencies." },
  { name: "Al Reem Island", types: "High-rise towers, mixed-use", note: "Dense development pace means MEP routing errors and façade sealant gaps are consistently the top findings in towers here." },
  { name: "Saadiyat Island", types: "Premium villas, cultural district apartments", note: "Ultra-premium finishes demand high-spec snagging — stone lippage, custom joinery tolerances, and smart lighting commissioning are key focus areas." },
  { name: "Al Raha Beach", types: "Waterfront apartments, townhouses", note: "Salt-air exposure accelerates sealant degradation; balcony waterproofing and metalwork corrosion are priority checks." },
  { name: "Khalifa City", types: "Villas, townhouses", note: "Established community with active secondary market. Pre-purchase inspections regularly uncover concealed plumbing leaks and undeclared structural modifications." },
  { name: "Masdar City", types: "Eco-apartments, offices", note: "Sustainable systems (solar, district cooling) require specialist commissioning verification — we check integration and performance against spec." },
];

const keyCommunities = [
  { name: "Yas Island", blurb: "Aldar's flagship leisure-and-residential destination spans apartments, villas, and townhouses beside world-class attractions. Our Yas Island snagging inspections focus on AC commissioning gaps, swimming-pool waterproofing, and smart-home system deficiencies common to fast-paced Aldar handovers." },
  { name: "Saadiyat Island", blurb: "The cultural district's ultra-premium villas and beachfront apartments demand high-spec snagging. We prioritise stone lippage, custom joinery tolerances, salt-air metalwork protection, and smart-lighting commissioning across Saadiyat developments." },
  { name: "Al Reem Island", blurb: "One of Abu Dhabi's densest high-rise clusters, Al Reem is dominated by mixed-use towers. Our Al Reem inspections consistently log MEP routing errors, façade sealant gaps, and chilled-water (district cooling) commissioning issues." },
  { name: "Al Raha Beach", blurb: "This waterfront community of apartments and townhouses faces accelerated sealant degradation from salt-air exposure. We prioritise balcony waterproofing, metalwork corrosion, and window-seal integrity in every Al Raha Beach inspection." },
  { name: "Al Maryah Island", blurb: "Abu Dhabi's central business and financial district features premium residences and commercial space. Our Al Maryah snagging covers high-rise MEP balancing, acoustic separation, and finishing quality across mixed-use towers." },
  { name: "Hudayriyat Island & Nurai Island", blurb: "Emerging luxury and branded-residence destinations demand meticulous villa snagging. We deliver bespoke high-spec inspections covering structural detailing, premium finishes, waterfront drainage, and smart-home commissioning." },
];

const faqs = [
  {
    q: "Which authority governs property handovers in Abu Dhabi?",
    a: "The Abu Dhabi Department of Municipalities and Transport (DMT) oversees real estate regulation in Abu Dhabi, replacing the former Abu Dhabi Real Estate Centre (ADREC). The DMT mandates specific handover procedures and a defect liability period similar to Dubai's RERA framework."
  },
  {
    q: "How long is the Defects Liability Period in Abu Dhabi?",
    a: "Abu Dhabi's property law provides a one-year DLP for general defects from the date of handover, and a 10-year structural warranty under Federal Law No. 5 of 1985. We recommend a Stage 1 snagging inspection before handover and a follow-up DLP inspection in months 10–11."
  },
  {
    q: "Which Abu Dhabi developers does UrbanGrid inspect most frequently?",
    a: "We work extensively across Aldar Properties (Yas Island, Al Raha, Saadiyat), Imkan Properties (Nudra, Makers District), Modon Properties, ADNEC Group, and smaller Abu Dhabi boutique developers. Our engineers know each developer's quality patterns and handover documentation requirements."
  },
  {
    q: "Is the snagging process different in Abu Dhabi vs Dubai?",
    a: "The technical scope is identical — we check MEP systems, finishes, structural elements, and safety systems to the same engineering standards. Administratively, the DMT's documentation requirements differ slightly from the DLD's, and our reports are formatted to satisfy both regimes."
  },
  {
    q: "Can UrbanGrid inspect properties in Abu Dhabi city, Al Ain, and the Western Region?",
    a: "Yes. We cover Abu Dhabi Island, the mainland, Al Ain, and Al Dhafra region. Coverage in Al Ain and Western Region may require an additional travel allowance for distant properties — contact us for a tailored quote."
  },
];

export default function AbuDhabi() {
  return (
    <>
      <SEO
        title="Snagging Company Abu Dhabi | Property Inspection | UrbanGrid"
        description="Abu Dhabi's trusted property snagging company. Independent inspection across Yas Island, Al Reem, Saadiyat, Al Raha and all communities. Aldar, Imkan & all developers. Reports in 24 hours."
        keywords="snagging company abu dhabi, property inspection abu dhabi, property snagging abu dhabi, snagging abu dhabi, home inspection abu dhabi, new build snagging abu dhabi, apartment inspection abu dhabi, villa inspection abu dhabi, building inspection companies near me"
        canonical="https://urbangrid.ae/locations/abu-dhabi"
      />

      {/* Hero */}
      <section className="pt-28 pb-20 bg-zinc-900">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">Abu Dhabi · UAE</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 max-w-3xl">
            Snagging Company Abu Dhabi
          </h1>
          <p className="text-zinc-300 text-base sm:text-lg leading-relaxed max-w-2xl mb-8">
            Independent property inspection and snagging across all Abu Dhabi communities — Yas Island, Al Reem, Saadiyat, Al Raha and the entire emirate. Engineer-led, DMT-aware, reports within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/contact">
              <Button size="lg" className="bg-brand-green text-white hover:bg-emerald-700 px-8 py-6 text-sm font-semibold rounded-none">
                Book Abu Dhabi Inspection <ArrowRight className="ml-2 w-4 h-4" />
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
          {["12,000+ Abu Dhabi inspections completed", "24-hour report delivery", "DMT-compliant process", "All Abu Dhabi communities covered"].map(t => (
            <span key={t} className="flex items-center gap-2 text-white text-xs font-medium">
              <CheckCircle className="w-3 h-3 shrink-0" /> {t}
            </span>
          ))}
        </div>
      </div>

      {/* Why Snag in Abu Dhabi */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">Why Abu Dhabi</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-zinc-900 leading-tight mb-6">
                Why Independent Snagging Matters in Abu Dhabi
              </h2>
              <div className="space-y-4 text-zinc-600 text-sm leading-relaxed">
                <p>
                  Abu Dhabi's property market is undergoing a significant expansion phase, with major masterplan communities on Yas Island, Saadiyat, and Al Reem delivering thousands of units each year. The speed of delivery — and the premium price points — make independent snagging more important than ever.
                </p>
                <p>
                  Aldar Properties, Abu Dhabi's largest developer, operates its own snagging teams. But their mandate is to meet handover targets, not to advocate for the buyer. Our engineers work exclusively for you — their job is to find every defect before you accept the keys, not to facilitate a smooth handover for the developer.
                </p>
                <p>
                  Our Abu Dhabi inspections follow the same engineering standards applied across all UrbanGrid work — NFPA, ASHRAE, and ASTM — with reporting structured to meet the Department of Municipalities and Transport's documentation requirements.
                </p>
              </div>
            </div>
            <div className="bg-zinc-50 p-8 border border-zinc-100">
              <h3 className="text-sm font-bold text-zinc-900 mb-6 uppercase tracking-wide">Abu Dhabi Regulatory Framework</h3>
              <div className="space-y-5">
                {[
                  { label: "DMT", detail: "Department of Municipalities and Transport — the Abu Dhabi authority governing real estate registration, handover procedures, and developer obligations." },
                  { label: "Law 3/2015", detail: "Abu Dhabi's real estate ownership law governs defect liability. Buyers have one year from handover to formally log defects with the developer." },
                  { label: "ADDC/AADC", detail: "Abu Dhabi Distribution Company (Abu Dhabi city) and Al Ain Distribution Company — electrical systems must comply with their standards. We test every installation." },
                  { label: "10-Year Structural", detail: "Federal Civil Code provides a 10-year structural defects warranty from date of handover for load-bearing elements." },
                  { label: "NCEMA Standards", detail: "Fire safety compliance with National Emergency Crisis & Disaster Management Authority standards is verified on every inspection." },
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
          <h2 className="text-3xl lg:text-4xl font-bold text-zinc-900 leading-tight mb-4 max-w-2xl">
            Every Abu Dhabi Community Covered
          </h2>
          <p className="text-zinc-500 text-sm leading-relaxed max-w-xl mb-12">
            12,000+ Abu Dhabi inspections mean our engineers know the defect profiles of each community in depth.
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
          <p className="text-xs text-zinc-400 mt-6">Also covering: Al Karamah, Al Mushrif, Khalifa City B, Al Reef, Al Shamkha, Al Ain all districts, and Western Region communities.</p>
        </div>
      </section>

      {/* Key Communities Served */}
      <section className="py-20 lg:py-28 bg-white border-t border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">Key Communities Served</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-zinc-900 leading-tight mb-4 max-w-2xl">
            Snagging Expertise Across Abu Dhabi's Premier Communities
          </h2>
          <p className="text-zinc-500 text-sm leading-relaxed max-w-2xl mb-12">
            From Aldar's Yas Island handovers to the ultra-premium villas of Saadiyat, UrbanGrid provides neighbourhood-specific property inspection and snagging expertise across Abu Dhabi's highest-value residential and commercial hubs.
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
          <h2 className="text-3xl font-bold text-zinc-900 mb-10">Abu Dhabi Developers We Inspect</h2>
          <div className="flex flex-wrap gap-3">
            {["Aldar Properties", "Imkan Properties", "Modon Properties", "ADNEC Group", "National Corporation for Tourism & Hotels", "Reportage Properties", "Bloom Properties", "Eagle Hills", "Sorouh Real Estate", "Abu Dhabi National Hotels"].map(d => (
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
          <h2 className="text-3xl lg:text-4xl font-bold text-zinc-900 mb-12">Abu Dhabi Snagging — Common Questions</h2>
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
            <h2 className="text-3xl lg:text-4xl font-bold leading-tight mb-3">Ready to Snag Your Abu Dhabi Property?</h2>
            <p className="text-zinc-400 text-sm">Engineer-led · 24-hour report · Contractor-ready format · All Abu Dhabi areas</p>
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
        "name": "UrbanGrid Property Inspection Abu Dhabi",
        "description": "Professional property snagging and inspection services in Abu Dhabi, UAE",
        "url": "https://urbangrid.ae/locations/abu-dhabi",
        "telephone": "+971585686852",
        "email": "info@urbangrid.ae",
        "areaServed": { "@type": "City", "name": "Abu Dhabi", "addressCountry": "AE" },
        "address": { "@type": "PostalAddress", "addressLocality": "Abu Dhabi", "addressCountry": "AE" },
        "priceRange": "$$"
      })}} />
    </>
  );
}
