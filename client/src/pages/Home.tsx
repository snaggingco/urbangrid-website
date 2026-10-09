import { lazy, Suspense } from "react";
import { Link } from "wouter";
import HomeHero, { HomeStats } from "@/components/first-paint/HomeHero";
import ServiceCatalogSections, { HomeBuildingConsultancy } from "@/components/ServiceCatalogSections";
import { homepageFAQs } from "@shared/publicFAQs";

// Lazy-loaded — both pull in react-phone-number-input (heavy country metadata),
// so deferring them keeps it out of the initial every-page bundle.
const ConsultationForm = lazy(() => import("@/components/ConsultationForm"));
import { Button } from "@/components/ui/button";
import {
  ArrowRight, Shield,
  Zap, Droplets, Wind, Building2,
  Layers, DoorOpen, Flame, Sun, Users
} from "lucide-react";

export default function Home() {

  const inspectionCategories = [
    { icon: <Wind className="w-5 h-5" />, title: "Air Conditioning & Ventilation", caption: "Accessible vents and selected operating conditions can be observed during the agreed inspection." },
    { icon: <Zap className="w-5 h-5" />, title: "Electrical Systems", caption: "Visible fixtures and agreed functional checks are recorded; this is not an electrical compliance certificate." },
    { icon: <Droplets className="w-5 h-5" />, title: "Plumbing & Drainage", caption: "Accessible fittings and visible signs of leakage are noted during the site visit." },
    { icon: <Shield className="w-5 h-5" />, title: "Waterproofing", caption: "Visible finishes and accessible areas are reviewed; concealed membranes cannot be confirmed visually." },
    { icon: <Building2 className="w-5 h-5" />, title: "Structural Elements", caption: "Visible cracks and accessible elements may be noted; a visual inspection is not structural certification." },
    { icon: <Layers className="w-5 h-5" />, title: "Finishes & Tiling", caption: "Accessible finishes are reviewed and observable items can be photographed and location-referenced." },
    { icon: <DoorOpen className="w-5 h-5" />, title: "Doors & Windows", caption: "Accessible operation, visible alignment and apparent sealing conditions are observed." },
    { icon: <Flame className="w-5 h-5" />, title: "Fire Safety Systems", caption: "Visible devices may be recorded; system testing and authority approvals are outside a standard visual inspection." },
    { icon: <Sun className="w-5 h-5" />, title: "Balconies & External", caption: "Accessible balconies and visible exterior elements are reviewed within the confirmed inspection scope." },
    { icon: <Users className="w-5 h-5" />, title: "Common Areas", caption: "Common-area access and scope must be agreed with the relevant building management." }
  ];

  return (
    <>
      <HomeHero />
      <HomeStats counts={{ inspections: 0, defects: 0, cities: 0 }} />
      <section className="border-b border-zinc-100 bg-white py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-6 sm:px-10 md:flex-row md:items-center md:justify-between lg:px-16">
          <div>
            <p className="text-sm font-semibold text-zinc-900">Enquiries for inspections and building consultancy</p>
            <p className="mt-1 max-w-2xl text-xs leading-relaxed text-zinc-500">Tell us about your property or project in London and nearby areas. Each service is scoped and quoted individually.</p>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold">
             <Link href="/contact" className="text-brand-green underline underline-offset-4">Request a custom quote</Link>
          </div>
        </div>
      </section>
      <ServiceCatalogSections />

      {/* ── INSPECTION APPROACH ───────────────────────────────────────────── */}
      <section className="py-16 bg-white border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">Inspection approach</p>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              ["Observe", "Review accessible areas and visible components during the physical inspection."],
              ["Document", "Record findings with location details and photographs where useful."],
              ["Explain", "Present observations in a report that supports the client’s own follow-up."],
            ].map(([title, body]) => <div key={title} className="border-t border-zinc-200 pt-5"><h2 className="text-lg font-bold text-zinc-900">{title}</h2><p className="mt-2 text-sm leading-relaxed text-zinc-500">{body}</p></div>)}
          </div>
        </div>
      </section>

      {/* ── WHAT WE INSPECT ───────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-zinc-50 border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="mb-16">
            <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">Scope of Inspection</p>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <h2 className="text-4xl lg:text-5xl font-bold text-zinc-900 leading-tight max-w-lg">
                What We Inspect in Your Property
              </h2>
              <p className="text-zinc-500 text-sm leading-relaxed max-w-sm">
                A structured visual review of accessible areas, with findings recorded clearly for follow-up.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-px bg-zinc-200">
            {inspectionCategories.map((item) => (
              <div key={item.title} className="bg-white p-6 lg:p-7 group hover:bg-brand-green/5 transition-colors">
                <div className="w-10 h-10 flex items-center justify-center border border-zinc-100 text-brand-green mb-5 group-hover:border-brand-green/30 transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-xs font-bold text-zinc-900 mb-2 leading-snug">{item.title}</h3>
                <p className="text-[11px] text-zinc-500 leading-relaxed">{item.caption}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/services">
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-brand-green border-b border-brand-green pb-0.5 hover:gap-3 transition-all cursor-pointer">
                See All Inspection Services <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── CONSULTATION FORM ─────────────────────────────────────────────── */}
      <Suspense fallback={<div className="min-h-[400px]" />}>
        <ConsultationForm />
      </Suspense>
      <HomeBuildingConsultancy />

      {/* ── PHILOSOPHY / WHY CHOOSE ───────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">Philosophy</p>
              <h2 className="text-4xl lg:text-5xl font-bold text-zinc-900 leading-tight mb-4">
                Your home is likely the largest purchase of your life.
              </h2>
              <p className="text-brand-green text-sm font-semibold mb-6">Here's how we protect it.</p>
              <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                A property inspection gives you a dated record of conditions that could be observed and accessed on the day. Findings can help you ask informed questions, raise items with the relevant party and decide what specialist advice may be needed.
              </p>
              <p className="text-zinc-500 text-sm leading-relaxed mb-10">
                Scope, access, deliverables and timing are confirmed individually before work is agreed.
              </p>
             <Link href="/about" className="flex items-center gap-2 text-sm font-semibold text-brand-green border-b border-brand-green pb-0.5 hover:gap-3 transition-all">
                  Learn More About Us
                  <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="relative">
              <div className="aspect-[4/3] w-full bg-[linear-gradient(135deg,#e8eee8_0%,#d2ddd3_42%,#f0ede5_100%)]" role="img" aria-label="A considered approach to property inspection and building consultancy" />
              <div className="absolute -bottom-6 -right-6 bg-zinc-950 text-white p-6">
                <div className="text-base font-bold text-brand-green">Observed conditions</div>
                <div className="text-xs text-zinc-500 mt-1 uppercase tracking-widest">Recorded with context</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ACCREDITATIONS ────────────────────────────────────────────────── */}
      <section className="py-20 bg-zinc-50 border-y border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">Inspection Principles</p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
            <h2 className="text-3xl font-bold text-zinc-900">Clear evidence, practical decisions</h2>
            <p className="text-zinc-500 text-xs leading-relaxed max-w-xs">Each inspection is designed to give property buyers and owners a usable record of observed defects.</p>
          </div>
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 divide-x divide-zinc-200 border border-zinc-200">
            {[
              { label: "Independent Findings", icon: "fas fa-search" },
              { label: "Photographic Evidence", icon: "fas fa-camera" },
              { label: "Room-by-Room Checks", icon: "fas fa-clipboard-check" },
              { label: "Actionable Reports", icon: "fas fa-file-alt" },
            ].map((cert) => (
              <div key={cert.label} className="flex flex-col items-center justify-center py-10 px-4 gap-3">
                <i className={`${cert.icon} text-brand-green text-xl`}></i>
                <span className="text-[11px] font-semibold text-zinc-600 tracking-wide text-center">{cert.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EVIDENCE-LED METHOD ───────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="mb-16">
              <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">A useful record</p>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <h2 className="text-4xl lg:text-5xl font-bold text-zinc-900 leading-tight max-w-lg">Evidence made practical.</h2>
              <p className="text-zinc-500 text-sm max-w-sm">A clear structure helps you understand what was observed, where it was seen and what may need further attention.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-px border border-zinc-200 bg-zinc-200 md:grid-cols-3">
            {[
              ["Location", "Room and area references help connect an observation to the place it was seen."],
              ["Photographs", "Images add context to visible findings and help with later review."],
              ["Limitations", "The report distinguishes observations from concealed or inaccessible conditions that require other investigation."],
            ].map(([title, body]) => <article key={title} className="bg-white p-8"><h3 className="text-sm font-bold text-zinc-900">{title}</h3><p className="mt-3 text-sm leading-relaxed text-zinc-500">{body}</p></article>)}
          </div>

          <div className="mt-10 text-center">
            <Button asChild className="bg-brand-green text-white hover:bg-emerald-700 px-8 py-6 text-sm font-semibold rounded-none">
              <Link href="/contact">Book Your Inspection Today</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── INTERNATIONAL STANDARDS ───────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-zinc-50">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="mb-16">
          <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">Approach</p>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <h2 className="text-4xl lg:text-5xl font-bold text-zinc-900 leading-tight max-w-lg">
                A scope shaped around your brief
              </h2>
              <p className="text-zinc-500 text-sm leading-relaxed max-w-sm">
                We agree the purpose, available information and intended deliverables before starting. Inspection observations are not a substitute for specialist testing or statutory approval.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-100 border border-zinc-100">
            {[
              ["Define", "Confirm the property, purpose, access and information available."],
              ["Record", "Document agreed observations with clear locations and supporting detail."],
              ["Discuss", "Deliver a practical report for your review and follow-up decisions."],
            ].map(([label, body]) => <article key={label} className="p-8 lg:p-10"><p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-brand-green">{label}</p><h3 className="mt-6 text-xl font-bold text-zinc-900">{label} the work</h3><p className="mt-4 text-xs leading-relaxed text-zinc-500">{body}</p></article>)}
          </div>

          {/* FAQ */}
          <div className="mt-16 divide-y divide-zinc-100 border-y border-zinc-100">
            <div className="py-6 grid grid-cols-1 md:grid-cols-2 gap-4"><h4 className="text-sm font-semibold text-zinc-800">What is outside a standard visual inspection?</h4><p className="text-xs text-zinc-500 leading-relaxed">Concealed conditions, intrusive investigation, specialist testing and statutory approvals are outside a visual inspection unless separately agreed.</p></div>
          </div>
        </div>
      </section>

      {/* ── COVERAGE ──────────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="mb-16">
            <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">Coverage</p>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <h2 className="text-4xl lg:text-5xl font-bold text-zinc-900 leading-tight">
                Inspection and consultancy across London
              </h2>
              <p className="text-zinc-500 text-sm leading-relaxed max-w-sm">
                UrbanGrid UK serves London and nearby areas. Availability depends on the service and property address.
              </p>
            </div>
          </div>

          {/* Primary 3-city cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-200 border border-zinc-200">
            {[
              { city: "London & nearby areas", href: "/locations/london", stat: "UK coverage", note: "Confirm your address with us", desc: "Enquire with the property location and service you need. The team will confirm availability and prepare a custom quote.", icon: "fas fa-building" },
            ].map((loc) => (
              <Link key={loc.city} href={loc.href}>
                <div className="p-8 lg:p-10 h-full group cursor-pointer hover:bg-zinc-50 transition-colors">
                  <i className={`${loc.icon} text-brand-green text-xl mb-6 block`}></i>
                  <div className="text-2xl font-bold text-brand-green mb-1">{loc.stat}</div>
                  <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-4">{loc.note}</div>
                  <h3 className="text-lg font-bold text-zinc-900 mb-3 group-hover:text-brand-green transition-colors">{loc.city}</h3>
                  <p className="text-zinc-500 text-xs leading-relaxed">{loc.desc}</p>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-green mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    View {loc.city} <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/contact">
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-brand-green border-b border-brand-green pb-0.5 hover:gap-3 transition-all cursor-pointer">
                Request a Quote in Your Area <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32 bg-zinc-50">
        <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="mb-12">
            <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">FAQ</p>
            <h2 className="text-4xl lg:text-5xl font-bold text-zinc-900 leading-tight">
              Common questions about our inspection services.
            </h2>
          </div>
          <div className="divide-y divide-zinc-200 border-t border-b border-zinc-200">
            {[
              ...homepageFAQs
            ].map((faq) => (
              <div key={faq.q} className="py-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <h3 className="text-sm font-semibold text-zinc-800">{faq.q}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-zinc-950 text-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-12">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-6">Get Started</p>
              <h2 className="text-4xl lg:text-6xl font-bold text-white leading-tight max-w-xl">
                Make your next property decision<br />with a clearer view.
              </h2>
            </div>
            <div className="flex flex-col gap-4 lg:items-end">
              <p className="text-zinc-500 text-sm leading-relaxed max-w-xs lg:text-right">
                Availability, scope, deliverables and fees are discussed individually before any work is agreed.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <Button asChild size="lg" className="bg-brand-green text-white hover:bg-emerald-700 px-8 py-6 text-sm font-semibold rounded-none">
                 <Link href="/contact">Request a Custom Quote</Link>
                </Button>
                <a
                  href="tel:+447436597890"
                  className="inline-flex items-center justify-center border border-zinc-600 text-zinc-400 px-8 py-6 font-medium text-sm hover:border-white hover:text-white transition-all"
                >
                  <i className="fas fa-phone mr-3 text-brand-green"></i>
                  +44 7436 597890
                </a>
              </div>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-zinc-800 flex flex-wrap gap-8 items-center">
              <div className="flex items-center gap-2 text-zinc-500 text-xs font-medium">
              <Shield className="w-3 h-3 text-brand-green" />
              <span>Independent observations</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-500 text-xs font-medium">
              <Shield className="w-3 h-3 text-brand-green" />
              <span>Independent, photographic inspection reports</span>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
