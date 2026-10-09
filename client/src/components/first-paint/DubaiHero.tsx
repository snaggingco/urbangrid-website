import { Link } from "wouter";
import { ArrowRight, MapPin, Phone } from "lucide-react";

export default function DubaiHero() {
  return (
    <section data-analytics-region="london_hero" className="relative overflow-hidden bg-zinc-900 pt-24 pb-10 sm:pt-28 sm:pb-14 lg:pt-32 lg:pb-16">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_28%,rgba(6,78,59,0.36),transparent_40%)]" />
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-9 px-5 sm:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:px-16">
        <div className="text-white">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-emerald-300">Property inspection &amp; consultancy · London</p>
          <h1 className="mb-5 max-w-2xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.55rem]">Property services for London owners.</h1>
          <p className="mb-6 max-w-xl text-sm leading-relaxed text-zinc-300 sm:text-base">Explore the group's existing inspection and consultancy catalogue. Scope and availability are discussed individually for London and nearby areas.</p>
          <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-zinc-300">
            <span className="inline-flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-emerald-300" aria-hidden="true" /> London &amp; nearby areas</span>
            <span className="inline-flex items-center gap-2">Custom quotes · Enquiries only</span>
          </div>
          <div className="border-l-2 border-brand-green pl-4">
            <p className="text-sm font-semibold text-white">Tell us what you need.</p>
            <p className="mt-1 text-xs leading-relaxed text-zinc-400">We will review the property, service and requested scope before preparing a quote.</p>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
            <a href="tel:+447436597890" className="inline-flex items-center gap-2 text-xs font-medium text-zinc-300 underline decoration-zinc-600 underline-offset-4 transition-colors hover:text-white"><Phone className="h-3.5 w-3.5" aria-hidden="true" /> +44 7436 597890</a>
            <Link href="/services" className="inline-flex items-center gap-1 text-xs font-medium text-zinc-300 transition-colors hover:text-white">Explore services <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></Link>
          </div>
          <p className="mt-7 max-w-md border-t border-zinc-700/80 pt-5 text-[11px] leading-relaxed text-zinc-400">Reports describe observations within an agreed scope. Concealed conditions, specialist investigations and statutory approvals are not implied.</p>
        </div>
        <div className="border border-white/10 bg-white/[0.04] p-7 sm:p-9">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-300">UK enquiries</p>
          <h2 className="mt-4 text-2xl font-bold text-white">Start with the property and the question.</h2>
          <p className="mt-4 text-sm leading-relaxed text-zinc-300">Use the enquiry form to share your location, service interest and any project context. There is no online booking or payment.</p>
          <Link href="/contact" className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-brand-green px-5 text-sm font-semibold text-white hover:bg-emerald-800">Make an enquiry <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </div>
      </div>
    </section>
  );
}
