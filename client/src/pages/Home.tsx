import { useState, lazy, Suspense } from "react";
import { Link } from "wouter";
import HomeHero, { HomeStats } from "@/components/first-paint/HomeHero";
import ServiceCatalogSections, { HomeBuildingConsultancy } from "@/components/ServiceCatalogSections";
import { homepageFAQs } from "@shared/publicFAQs";
import { companyRegistration } from "@shared/companyRegistration";

// Lazy-loaded — both pull in react-phone-number-input (heavy country metadata),
// so deferring them keeps it out of the initial every-page bundle.
const ConsultationForm = lazy(() => import("@/components/ConsultationForm"));
const SampleReportModal = lazy(() => import("@/components/SampleReportModal"));
import { Button } from "@/components/ui/button";
import {
  ArrowRight, Shield, Globe,
  Zap, Droplets, Wind, Building2,
  Layers, DoorOpen, Flame, Sun, Users
} from "lucide-react";

export default function Home() {
  const [reportModalOpen, setReportModalOpen] = useState(false);

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
      <HomeHero
        onSampleReport={() => setReportModalOpen(true)}
      />
      <HomeStats counts={{ inspections: 0, defects: 0, cities: 0 }} />
      <div className="border-b border-zinc-100 bg-zinc-50/70">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-16">
          <div className="flex items-center gap-3">
            <Shield aria-hidden="true" className="h-4 w-4 shrink-0 text-brand-green" />
            <p className="text-xs leading-relaxed text-zinc-600">
              <span className="font-semibold text-zinc-900">RERA Registered</span>
              <span className="mx-2 text-zinc-300" aria-hidden="true">|</span>
              Registration number <span className="font-mono text-zinc-800">{companyRegistration.registrationNumber}</span>
            </p>
          </div>
          <Link
            href={companyRegistration.credentialsHref}
            aria-label="View UrbanGrid's company-level regulatory registration details"
            className="ml-7 inline-flex w-fit items-center gap-1 text-xs font-semibold text-brand-green underline underline-offset-4 hover:text-emerald-700 sm:ml-0"
          >
            View registration details <ArrowRight aria-hidden="true" className="h-3 w-3" />
          </Link>
        </div>
      </div>
      <section className="border-b border-zinc-100 bg-white py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-6 sm:px-10 md:flex-row md:items-center md:justify-between lg:px-16">
          <div>
            <p className="text-sm font-semibold text-zinc-900">Stage 1 residential inspections from AED 800 base</p>
            <p className="mt-1 max-w-2xl text-xs leading-relaxed text-zinc-500">AED 800 is the minimum before 5% VAT (AED 840 minimum total for Stage 1). The report target is within 24 hours after a complete inspection and full payment.</p>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold">
            <Link href="/pricing" className="text-brand-green underline underline-offset-4">Residential pricing</Link>
            <Link href="/sample-report" className="text-brand-green underline underline-offset-4">Report overview</Link>
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
                Reports are targeted within 24 hours after the physical inspection and full payment. Scope, access and report timing are confirmed for each booking.
              </p>
              <Link href="/about">
                <button className="flex items-center gap-2 text-sm font-semibold text-brand-green border-b border-brand-green pb-0.5 hover:gap-3 transition-all">
                  Learn More About Us
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&h=520&q=70"
                alt="Professional property inspection team"
                className="w-full object-cover"
                width="700"
                height="520"
                loading="lazy"
                decoding="async"
              />
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
            <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">Standards</p>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <h2 className="text-4xl lg:text-5xl font-bold text-zinc-900 leading-tight max-w-lg">
                Technical references, carefully scoped
              </h2>
              <p className="text-zinc-500 text-sm leading-relaxed max-w-sm">
                Specialist standards may inform separately agreed scopes. A standard visual property inspection is not a certification or full standards-compliance audit.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-100 border border-zinc-100">
            {[
              {
                label: "NFPA",
                title: "Fire Safety Standards",
                body: "NFPA publishes references for electrical, alarm, life-safety and fire-protection systems. Any specialist testing or compliance assessment needs a separately agreed scope.",
                href: "https://www.nfpa.org",
                color: "text-red-500",
                icon: "fas fa-fire-extinguisher"
              },
              {
                label: "ASHRAE",
                title: "HVAC & Air Quality",
                body: "ASHRAE publishes guidance for building systems and ventilation. A visual inspection does not commission HVAC systems or certify indoor air quality.",
                href: "https://www.ashrae.org",
                color: "text-blue-500",
                icon: "fas fa-wind"
              },
              {
                label: "ASTM",
                title: "Material & Structural",
                body: "ASTM publishes standards used across property and materials work. Formal condition assessments, testing and structural evaluations require an agreed specialist scope.",
                href: "https://www.astm.org",
                color: "text-brand-green",
                icon: "fas fa-cogs"
              }
            ].map((std) => (
              <div key={std.label} className="p-8 lg:p-10 group hover:bg-white transition-colors">
                <p className={`text-[10px] font-semibold tracking-[0.25em] uppercase mb-6 ${std.color}`}>{std.label}</p>
                <h3 className="text-xl font-bold text-zinc-900 mb-4">{std.title}</h3>
                <p className="text-zinc-500 text-xs leading-relaxed mb-6">{std.body}</p>
                <a href={std.href} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-brand-green border-b border-brand-green pb-0.5 hover:gap-3 transition-all">
                  Visit {std.label}.org <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="mt-16 divide-y divide-zinc-100 border-y border-zinc-100">
            {[
              { q: "What does NFPA 101 cover in building inspections?", a: "NFPA 101 Life Safety Code addresses fire protection requirements, exit routes, emergency lighting, and life safety systems to ensure occupant safety in buildings." },
              { q: "How does ASHRAE Standard 180 impact inspections?", a: "ASHRAE 180 provides guidelines for building commissioning processes, ensuring HVAC systems operate efficiently and meet design specifications." },
              { q: "What is ASTM E2018 for Property Assessments?", a: "ASTM E2018 standardises property condition assessments, providing consistent methodology for evaluating building systems and components." },
              { q: "Why follow NFPA 72 for fire alarm systems?", a: "NFPA 72 ensures fire detection and alarm systems are properly installed, tested, and maintained according to national safety standards." }
            ].map((faq) => (
              <div key={faq.q} className="py-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <h4 className="text-sm font-semibold text-zinc-800">{faq.q}</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
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
                Snagging Services Across UAE
              </h2>
              <p className="text-zinc-500 text-sm leading-relaxed max-w-sm">
                Professional property inspection services in Dubai, Abu Dhabi, Sharjah and all Emirates.
              </p>
            </div>
          </div>

          {/* Primary 3-city cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-200 border border-zinc-200">
            {[
              { city: "Dubai", href: "/locations/dubai", stat: "Coverage", note: "Apartments, villas & townhouses", desc: "Dubai Marina, Downtown, Business Bay, Palm Jumeirah and other Dubai areas.", icon: "fas fa-building" },
              { city: "Abu Dhabi", href: "/locations/abu-dhabi", stat: "Coverage", note: "Residential properties", desc: "Saadiyat Island, Yas Island, Al Reem and other Abu Dhabi areas.", icon: "fas fa-mosque" },
              { city: "Sharjah", href: "/locations/sharjah", stat: "Coverage", note: "Residential properties", desc: "Residential communities and new developments across Sharjah.", icon: "fas fa-university" }
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

          {/* Secondary 4-city links */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 divide-x divide-zinc-200 border border-t-0 border-zinc-200">
            {[
              { city: "Ajman", href: "/locations/ajman" },
              { city: "Ras Al Khaimah", href: "/locations/ras-al-khaimah" },
              { city: "Fujairah", href: "/locations/fujairah" },
              { city: "Umm Al Quwain", href: "/locations/umm-al-quwain" },
            ].map((loc) => (
              <Link key={loc.city} href={loc.href}>
                <div className="px-6 py-4 group cursor-pointer hover:bg-zinc-50 transition-colors flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-600 group-hover:text-brand-green transition-colors">{loc.city}</span>
                  <ArrowRight className="w-3 h-3 text-zinc-500 group-hover:text-brand-green transition-colors" />
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
                Don't Accept Your Property<br />Without Reading the Report First.
              </h2>
            </div>
            <div className="flex flex-col gap-4 lg:items-end">
              <p className="text-zinc-500 text-sm leading-relaxed max-w-xs lg:text-right">
                Report target within 24 hours after a complete inspection and full payment. Ask about access, scope and pricing before booking.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <Button asChild size="lg" className="bg-brand-green text-white hover:bg-emerald-700 px-8 py-6 text-sm font-semibold rounded-none">
                  <Link href="/contact">Get a Free Quote</Link>
                </Button>
                <a
                  href="tel:+971585686852"
                  className="inline-flex items-center justify-center border border-zinc-600 text-zinc-400 px-8 py-6 font-medium text-sm hover:border-white hover:text-white transition-all"
                >
                  <i className="fas fa-phone mr-3 text-brand-green"></i>
                  +971 58 568 6852
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
              <Globe className="w-3 h-3 text-brand-green" />
              <span>International Standards</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-500 text-xs font-medium">
              <Shield className="w-3 h-3 text-brand-green" />
              <span>Independent, photographic inspection reports</span>
            </div>
          </div>
        </div>
      </section>

      {reportModalOpen && (
        <Suspense fallback={null}>
          <SampleReportModal
            isOpen={reportModalOpen}
            onClose={() => setReportModalOpen(false)}
          />
        </Suspense>
      )}
    </>
  );
}
