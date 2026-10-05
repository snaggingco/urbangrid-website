import { Link } from "wouter";
import { ArrowRight, CheckCircle, MapPin, Phone } from "lucide-react";
import DubaiQuoteForm from "@/components/DubaiQuoteForm";

export default function DubaiHero() {
  return (
    <section data-analytics-region="dubai_hero" className="relative overflow-hidden bg-zinc-900 pt-24 pb-10 sm:pt-28 sm:pb-14 lg:pt-32 lg:pb-16">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_28%,rgba(6,78,59,0.36),transparent_40%)]" />
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-9 px-5 sm:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:px-16">
        <div className="text-white">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-emerald-300">Independent property inspection · Dubai, UAE</p>
          <h1 className="mb-5 max-w-2xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.55rem]">
            Property Inspection Coverage Across Dubai
          </h1>
          <p className="mb-6 max-w-xl text-sm leading-relaxed text-zinc-300 sm:text-base">
            Engineer-led handover, pre-purchase and villa inspections across all Dubai communities. Get a clear, photo-documented report to take to your developer.
          </p>
          <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-zinc-300">
            <span className="inline-flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-emerald-300" aria-hidden="true" /> All Dubai areas</span>
            <span className="inline-flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-emerald-300" aria-hidden="true" /> Report preparation target: 24h after inspection and payment</span>
          </div>
          <div className="border-l-2 border-brand-green pl-4">
            <p className="text-sm font-semibold text-white">Stage 1 snagging from AED 800</p>
            <p className="mt-1 text-xs leading-relaxed text-zinc-400">AED 800 base minimum, excluding 5% VAT. Full payment follows the physical inspection and is due before report release. <Link href="/pricing" className="text-emerald-300 underline underline-offset-2">See rates</Link>.</p>
          </div>
          <a href="#dubai-quote" className="mt-6 flex min-h-12 items-center justify-center gap-2 bg-brand-green px-5 text-sm font-semibold text-white hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white lg:hidden">
            Get my Dubai inspection quote <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
            <a href="tel:+971585686852" className="inline-flex items-center gap-2 text-xs font-medium text-zinc-300 underline decoration-zinc-600 underline-offset-4 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green">
              <Phone className="h-3.5 w-3.5" aria-hidden="true" /> +971 58 568 6852
            </a>
            <a href="https://wa.me/971567427634" target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-zinc-300 underline decoration-zinc-600 underline-offset-4 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green">
              WhatsApp
            </a>
            <Link href="/services" className="inline-flex items-center gap-1 text-xs font-medium text-zinc-300 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green">
              Explore inspection services <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
          <p className="mt-7 max-w-md border-t border-zinc-700/80 pt-5 text-[11px] leading-relaxed text-zinc-400">
            Reports describe observations from accessible areas within the agreed inspection scope. Concealed conditions and specialist investigations require separate agreement.
          </p>
        </div>
        <div id="dubai-quote" className="scroll-mt-24">
          <DubaiQuoteForm />
        </div>
      </div>
    </section>
  );
}