import { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import SEO from "@/components/SEO";
import { buildingConsultancyServices, residentialServices } from "@/data/serviceHierarchy";

function ServiceCards({ services, consultancy = false }: { services: typeof residentialServices; consultancy?: boolean }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-200 border border-zinc-200">
      {services.map((service, index) => (
        <article key={service.href} className="bg-white p-6 sm:p-8 flex flex-col min-h-[220px]">
          <div className="flex items-start justify-between gap-4">
            <span className="text-[10px] font-semibold tracking-[0.2em] text-zinc-400">{String(index + 1).padStart(2, "0")}</span>
            <span className="text-[9px] uppercase tracking-[0.16em] text-zinc-400">{consultancy ? "Building Consultancy" : "Residential"}</span>
          </div>
          <h3 className="mt-5 text-base sm:text-lg font-semibold text-zinc-900 leading-snug">{service.label}</h3>
          <p className="mt-2 text-xs leading-relaxed text-zinc-500 flex-1">{service.description}</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link href={service.href} className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-brand-green hover:gap-3 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green">
              {consultancy ? "Explore Service" : "Explore Inspection"} <ArrowRight className="h-3 w-3" />
            </Link>
            <Link href={`/contact?category=${consultancy ? "consultancy" : "residential"}&service=${encodeURIComponent(service.href.split("/").pop() || "")}`} className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500 hover:text-zinc-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green">
              Request Custom Quote
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}

export default function Services() {
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id !== "residential-inspections" && id !== "building-consultancy") return;
    // Native fragment navigation can precede the lazy page's React commit.
    // Wait until both the section and the parent route effects are mounted.
    const frame = requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
    return () => cancelAnimationFrame(frame);
  }, []);
  return (
    <>
      <SEO
        title="Property Inspection & Building Consultancy Services | UrbanGrid UK"
        description="Explore UrbanGrid UK's residential inspections, technical surveys and building consultancy services in London and nearby areas."
      />
      <div className="pt-16">
        <section className="pt-24 pb-16 bg-zinc-950">
          <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
            <p className="text-[10px] font-semibold tracking-[0.25em] text-white uppercase mb-4">Services</p>
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold text-white leading-tight mb-6">Our Professional Services</h1>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl">
              Two clear ways UrbanGrid UK helps: residential inspections for buyers and residents, and technical consultancy for building owners, developers and managers.
            </p>
          </div>
        </section>

        <section id="residential-inspections" className="scroll-mt-20 py-20 lg:py-28 bg-white">
          <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
            <div className="mb-10 lg:mb-14 grid lg:grid-cols-[1fr_0.8fr] gap-6 items-end">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">For Homebuyers & Residents</p>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 leading-tight">Residential Inspections</h2>
              </div>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Engineer-led inspections give you a documented view of a home's condition before handover, after renovation, during warranty, at tenancy change or before resale.
              </p>
            </div>
            <ServiceCards services={residentialServices} />
            <div className="mt-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 bg-zinc-50 border-l-2 border-brand-green px-5 py-5 sm:px-7">
              <p className="text-xs leading-relaxed text-zinc-600">Enquiries are reviewed individually. Scope, availability, deliverables and fees are agreed before work proceeds.</p>
              <Link href="/contact" className="inline-flex items-center gap-2 shrink-0 bg-brand-green px-5 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white hover:bg-emerald-700">
                Request Custom Quote <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </section>

        <section id="building-consultancy" className="scroll-mt-20 py-20 lg:py-28 bg-zinc-50 border-y border-zinc-100">
          <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
            <div className="mb-10 lg:mb-14 grid lg:grid-cols-[1fr_0.8fr] gap-6 items-end">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">For Owners, Developers & Asset Managers</p>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 leading-tight">Building Consultancy</h2>
              </div>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Practical technical support for building operations, project quality, property condition and long-term asset planning. Consultancy assignments are scoped individually.
              </p>
            </div>
            <ServiceCards services={buildingConsultancyServices} consultancy />
            <div className="mt-7">
              <Link href="/contact" className="inline-flex items-center gap-2 bg-zinc-900 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white hover:bg-zinc-700">
                Request Custom Quote <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-3">Coverage</p>
              <h2 className="text-2xl font-bold text-zinc-900">London and nearby areas</h2>
            </div>
            <Link href="/locations/london" className="inline-flex items-center gap-2 text-xs font-semibold text-brand-green hover:gap-3 transition-all">
              View London coverage <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}