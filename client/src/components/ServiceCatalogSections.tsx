import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { buildingConsultancyServices, residentialServices } from "@/data/serviceHierarchy";

function ServiceLinks({ services }: { services: typeof residentialServices }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-200 border border-zinc-200">
      {services.map((service, index) => (
        <Link
          key={service.href}
          href={service.href}
          className="group bg-white flex items-start gap-5 p-6 sm:p-8 hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-green"
        >
          <span className="text-[10px] font-semibold tracking-widest text-zinc-400 pt-1">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="flex-1">
            <span className="block text-sm font-semibold text-zinc-900 group-hover:text-brand-green transition-colors">
              {service.label}
            </span>
            <span className="block mt-2 text-xs leading-relaxed text-zinc-500">{service.description}</span>
          </span>
          <ArrowRight className="w-4 h-4 mt-1 shrink-0 text-zinc-400 group-hover:text-brand-green group-hover:translate-x-1 transition-all" />
        </Link>
      ))}
    </div>
  );
}

export default function ServiceCatalogSections() {
  return (
    <section id="residential-inspections" className="scroll-mt-24 py-20 lg:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="mb-10 lg:mb-14">
            <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">For Homebuyers & Residents</p>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 leading-tight max-w-xl">
                Residential Inspections
              </h2>
              <p className="text-zinc-500 text-sm leading-relaxed max-w-md">
                Independent, engineer-led evidence for buyers and residents at the moments that matter.
              </p>
            </div>
          </div>
          <ServiceLinks services={residentialServices} />
          <div className="mt-8 border-l-2 border-brand-green bg-zinc-50 px-5 py-5 sm:px-7">
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-brand-green mb-4">An enquiry-led process</p>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {[
                ["01", "Send an enquiry"],
                ["02", "Review availability & scope"],
                ["03", "Receive a custom quote"],
                ["04", "Agree the next steps"],
              ].map(([step, label]) => (
                <div key={step} className="flex gap-3">
                  <span className="text-[10px] font-semibold text-zinc-400">{step}</span>
                  <span className="text-xs font-medium leading-relaxed text-zinc-700">{label}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[11px] text-zinc-500">Fees and deliverables are confirmed individually before work is agreed.</p>
          </div>
          <div className="mt-7 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Link href="/contact" className="inline-flex items-center gap-2 bg-brand-green px-6 py-3 text-xs font-semibold text-white hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green">
              Request Custom Quote <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/services" className="inline-flex items-center gap-2 text-xs font-semibold text-brand-green hover:gap-3 transition-all">
              Explore all inspection services <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 border-t border-zinc-100 pt-5 text-xs">
            <Link href="/pricing" className="font-semibold text-brand-green underline underline-offset-4">Custom quotes</Link>
          </div>
        </div>
    </section>
  );
}

export function HomeBuildingConsultancy() {
  return (
    <section id="building-consultancy" className="scroll-mt-24 py-20 lg:py-28 bg-zinc-50 border-y border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="mb-10 lg:mb-14">
            <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">For Owners, Developers & Asset Managers</p>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 leading-tight max-w-xl">
                Building consultancy
              </h2>
              <p className="text-zinc-500 text-sm leading-relaxed max-w-md">
                Practical technical advice for building performance, condition, costs and lifecycle planning.
              </p>
            </div>
          </div>
          <ServiceLinks services={buildingConsultancyServices} />
          <div className="mt-8">
            <Link href="/contact?category=consultancy" className="inline-flex items-center gap-2 bg-zinc-900 px-6 py-3 text-xs font-semibold text-white hover:bg-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green">
              Request Custom Quote <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-xs">
            <Link href="/pricing" className="font-semibold text-brand-green underline underline-offset-4">Custom quote guide</Link>
            <Link href="/contact?category=consultancy" className="font-semibold text-brand-green underline underline-offset-4">Discuss consultancy requirements</Link>
          </div>
        </div>
    </section>
  );
}