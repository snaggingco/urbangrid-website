import { Link } from "wouter";
import HeroChatBar from "@/components/HeroChatBar";
import { ArrowRight, Shield } from "lucide-react";

export interface HomeStatsCounts {
  inspections: number;
  defects: number;
  cities: number;
}

interface HomeHeroProps {
  onSampleReport: () => void;
}

export default function HomeHero({ onSampleReport: _onSampleReport }: HomeHeroProps) {
  return (
    <section className="relative min-h-[80vh] sm:min-h-[85vh] md:min-h-[85vh] flex flex-col justify-center bg-zinc-900 mt-8 lg:mt-12 overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(6,78,59,0.48),transparent_38%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/60 via-zinc-900/45 to-zinc-900" />

      <div className="relative z-10 max-w-6xl mx-auto w-full px-6 sm:px-10 lg:px-16 pt-10 sm:pt-16 pb-10 sm:pb-24">
        <h1 className="text-[1.75rem] sm:text-4xl lg:text-7xl font-bold text-white leading-[1.2] sm:leading-[1.05] tracking-tight mb-4 sm:mb-5 max-w-3xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
          Property Snagging
          <span className="block text-brand-white">&amp; Building Consultancy in Dubai &amp; UAE</span>
        </h1>

        <p className="text-sm sm:text-lg text-zinc-300 mb-2 max-w-lg leading-relaxed font-normal">
          Residential inspections for homeowners and investors. Building consultancy for communities, developers and property portfolios.
        </p>
        <p className="text-xs sm:text-sm text-zinc-300/80 mb-4 max-w-xl leading-relaxed">
          Choose the service that matches your property or building requirement.
        </p>
        <p className="text-xs sm:text-sm text-zinc-500 mb-6 sm:mb-8 max-w-lg leading-relaxed font-normal tracking-wide">
          UAE &nbsp;·&nbsp;
          <a href="https://www.stratasurveyor.com" target="_blank" rel="noopener" className="hover:text-zinc-300 transition-colors">KSA</a>
          &nbsp;·&nbsp;
          <a href="https://www.urbansnag.in" target="_blank" rel="noopener" className="hover:text-zinc-300 transition-colors">India</a>
          &nbsp;·&nbsp;
          <a href="https://www.urbangrid.co.uk" target="_blank" rel="noopener" className="hover:text-zinc-300 transition-colors">United Kingdom</a>
        </p>

        <HeroChatBar />

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6 sm:mb-6">
          <Link
            href="/book-inspection"
            className="inline-flex items-center justify-center bg-brand-green text-white hover:bg-emerald-700 transition-all px-8 py-6 text-sm font-semibold tracking-wide rounded-none group relative overflow-hidden active:scale-95 w-full sm:w-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
          >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
              <span className="flex items-center gap-3">
                Book a Residential Inspection
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
          </Link>

          <Link
            href="/contact?category=consultancy"
            className="inline-flex items-center justify-center border border-zinc-500 text-white px-8 py-[14px] text-sm font-semibold hover:border-white hover:bg-white hover:text-zinc-900 transition-all w-full sm:w-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
          >
            Request a Consultancy Proposal <ArrowRight className="w-4 h-4 ml-2" />
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
          <span className="flex items-center gap-1.5"><Shield className="w-3 h-3 text-brand-green" />Report target: 24h after inspection and full payment</span>
          <span className="text-zinc-700">·</span>
          <span>Contractor-ready format</span>
          <span className="text-zinc-700">·</span>
          <span>7 Emirates covered</span>
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
            <div className="text-sm font-bold text-white">Area-based</div>
            <div className="text-[7px] uppercase tracking-[0.1em] text-zinc-500 font-medium mt-0.5">Pricing</div>
          </div>
          <div className="py-3 px-1 text-center">
            <div className="text-sm font-bold text-white">After site visit</div>
            <div className="text-[7px] uppercase tracking-[0.1em] text-zinc-500 font-medium mt-0.5">Payment</div>
          </div>
          <div className="py-3 px-1 text-center">
            <div className="text-sm font-bold text-white">24h</div>
            <div className="text-[7px] uppercase tracking-[0.1em] text-zinc-500 font-medium mt-0.5">After full payment</div>
          </div>
        </div>
        {/* Desktop */}
        <div className="hidden md:grid grid-cols-4 divide-x divide-white/10">
          <div className="py-5 px-4">
            <div className="text-xl lg:text-2xl font-bold text-white">Area-based</div>
            <div className="text-[9px] uppercase tracking-[0.15em] text-zinc-500 font-medium mt-1">Standard residential pricing</div>
          </div>
          <div className="py-5 px-4">
            <div className="text-xl lg:text-2xl font-bold text-white">Physical inspection</div>
            <div className="text-[9px] uppercase tracking-[0.15em] text-zinc-500 font-medium mt-1">Payment follows visit</div>
          </div>
          <div className="py-5 px-4">
            <div className="text-xl lg:text-2xl font-bold text-white">100%</div>
            <div className="text-[9px] uppercase tracking-[0.15em] text-zinc-500 font-medium mt-1">Due before report release</div>
          </div>
          <div className="py-5 px-4">
            <div className="text-xl lg:text-2xl font-bold text-white">24h</div>
            <div className="text-[9px] uppercase tracking-[0.15em] text-zinc-500 font-medium mt-1">Preparation target after inspection & payment</div>
          </div>
        </div>
      </div>
    </div>
  );
}