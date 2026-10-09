import { Link } from "wouter";
import HeroChatBar from "@/components/HeroChatBar";
import { ArrowRight, Shield } from "lucide-react";

export interface HomeStatsCounts {
  inspections: number;
  defects: number;
  cities: number;
}

export default function HomeHero() {
  return (
    <section className="relative min-h-[80vh] sm:min-h-[85vh] md:min-h-[85vh] flex flex-col justify-center bg-zinc-900 mt-8 lg:mt-12 overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(6,78,59,0.48),transparent_38%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/60 via-zinc-900/45 to-zinc-900" />

      <div className="relative z-10 max-w-6xl mx-auto w-full px-6 sm:px-10 lg:px-16 pt-10 sm:pt-16 pb-10 sm:pb-24">
        <h1 className="text-[1.75rem] sm:text-4xl lg:text-7xl font-bold text-white leading-[1.2] sm:leading-[1.05] tracking-tight mb-4 sm:mb-5 max-w-3xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
          Property Snagging
          <span className="block text-brand-white">&amp; Building Consultancy in London</span>
        </h1>

        <p className="text-sm sm:text-lg text-zinc-300 mb-2 max-w-lg leading-relaxed font-normal">
          Residential inspections for homeowners and investors. Building consultancy for communities, developers and property portfolios.
        </p>
        <p className="text-xs sm:text-sm text-zinc-300/80 mb-4 max-w-xl leading-relaxed">
          Choose the service that matches your property or building requirement.
        </p>
        <p className="text-xs sm:text-sm text-zinc-500 mb-6 sm:mb-8 max-w-lg leading-relaxed font-normal tracking-wide">
          London &amp; nearby areas
        </p>

        <HeroChatBar />

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6 sm:mb-6">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center bg-brand-green text-white hover:bg-emerald-700 transition-all px-8 py-6 text-sm font-semibold tracking-wide rounded-none group relative overflow-hidden active:scale-95 w-full sm:w-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
          >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
              <span className="flex items-center gap-3">
                Request a Custom Quote
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
          </Link>

          <Link
            href="/contact?category=consultancy"
            className="inline-flex items-center justify-center border border-zinc-500 text-white px-8 py-[14px] text-sm font-semibold hover:border-white hover:bg-white hover:text-zinc-900 transition-all w-full sm:w-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
          >
            Enquire About Consultancy <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 gap-3 max-w-3xl mb-6 text-[11px] leading-relaxed">
          <div className="border-l border-brand-green/60 pl-3">
            <span className="font-semibold text-zinc-300">Residential:</span>
            <span className="text-zinc-400"> Handover · DLP · Resale · Move-in/out</span>
          </div>
          <div className="border-l border-zinc-600 pl-3">
            <span className="font-semibold text-zinc-300">Consultancy:</span>
            <span className="text-zinc-400"> BCS · TDD · Reserve Fund · RCA · Service Charge · Technical Surveys</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-zinc-400 font-medium">
          <span className="flex items-center gap-1.5"><Shield className="w-3 h-3 text-brand-green" />Custom scope and quote</span>
          <span className="text-zinc-700">·</span>
          <span>Contractor-ready format</span>
          <span className="text-zinc-700">·</span>
          <span>London &amp; nearby areas</span>
        </div>

      </div>
    </section>
  );
}

export function HomeStats({ counts: _counts }: { counts: HomeStatsCounts }) {
  return (
    <div className="bg-zinc-900 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-10 lg:px-16">
        {/* Mobile */}
        <div className="md:hidden grid grid-cols-3 divide-x divide-white/10">
          <div className="py-3 px-1 text-center">
            <div className="text-sm font-bold text-white">Custom</div>
            <div className="text-[7px] uppercase tracking-[0.1em] text-zinc-500 font-medium mt-0.5">Quote</div>
          </div>
          <div className="py-3 px-1 text-center">
            <div className="text-sm font-bold text-white">London</div>
            <div className="text-[7px] uppercase tracking-[0.1em] text-zinc-500 font-medium mt-0.5">Coverage</div>
          </div>
          <div className="py-3 px-1 text-center">
            <div className="text-sm font-bold text-white">Enquiries</div>
            <div className="text-[7px] uppercase tracking-[0.1em] text-zinc-500 font-medium mt-0.5">Only</div>
          </div>
        </div>
        {/* Desktop */}
        <div className="hidden md:grid grid-cols-4 divide-x divide-white/10">
          <div className="py-5 px-4">
            <div className="text-xl lg:text-2xl font-bold text-white">Custom quote</div>
            <div className="text-[9px] uppercase tracking-[0.15em] text-zinc-500 font-medium mt-1">For each requirement</div>
          </div>
          <div className="py-5 px-4">
            <div className="text-xl lg:text-2xl font-bold text-white">London</div>
            <div className="text-[9px] uppercase tracking-[0.15em] text-zinc-500 font-medium mt-1">Nearby areas too</div>
          </div>
          <div className="py-5 px-4">
            <div className="text-xl lg:text-2xl font-bold text-white">Enquiry</div>
            <div className="text-[9px] uppercase tracking-[0.15em] text-zinc-500 font-medium mt-1">Discuss your scope</div>
          </div>
          <div className="py-5 px-4">
            <div className="text-xl lg:text-2xl font-bold text-white">Clear</div>
            <div className="text-[9px] uppercase tracking-[0.15em] text-zinc-500 font-medium mt-1">Scope agreed in advance</div>
          </div>
        </div>
      </div>
    </div>
  );
}