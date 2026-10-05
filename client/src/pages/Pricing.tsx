import { useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Calculator, Check } from "lucide-react";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { calculateInspectionPrice, formatAed, residentialServices } from "@shared/inspectionPricing";
import { pricingExamples, seoResources } from "@shared/seoResources";

export default function Pricing() {
  const [service, setService] = useState<string>("new-build-snagging");
  const [area, setArea] = useState("1000");
  const result = useMemo(() => {
    const numericArea = Number(area);
    if (!Number.isFinite(numericArea) || numericArea <= 0) return null;
    try {
      return calculateInspectionPrice(service, numericArea);
    } catch {
      return null;
    }
  }, [area, service]);
  const selected = residentialServices.find(item => item.key === service);

  return (
    <>
      <SEO title={seoResources.pricing.seoTitle} description={seoResources.pricing.description} canonical={`https://urbangrid.ae${seoResources.pricing.path}`} />
      <main className="pt-16">
        <section className="bg-zinc-950 py-16 text-white sm:py-20 lg:py-24">
          <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">
            <nav aria-label="Breadcrumb" className="mb-10 text-xs text-zinc-400">
              <Link href="/" className="hover:text-white">Home</Link><span className="mx-2">/</span><span aria-current="page" className="text-zinc-200">Pricing</span>
            </nav>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-brand-green">Clear residential pricing</p>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">{seoResources.pricing.title}</h1>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-base">Calculate a standard single-property residential inspection. The rate is selected by total area and applied to the whole area, not in marginal bands.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild className="rounded-none bg-brand-green px-6 text-white hover:bg-emerald-700"><Link href="/book-inspection">Book Inspection <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
              <Link href="/sample-report" className="inline-flex min-h-10 items-center border border-zinc-600 px-5 text-sm text-zinc-200 hover:border-white">Explore the report format</Link>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 sm:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:px-16">
            <div>
              <div className="mb-5 flex items-center gap-3 text-brand-green"><Calculator className="h-5 w-5" /><span className="text-[10px] font-semibold uppercase tracking-[0.22em]">Estimate a standard inspection</span></div>
              <h2 className="text-3xl font-bold leading-tight text-zinc-900">One property. One clear scope.</h2>
              <p className="mt-4 text-sm leading-relaxed text-zinc-600">Rates apply to a single standard residential property. Multiple units and building-wide or specialist consultancy work need a scoped custom quote.</p>
              <div className="mt-8 space-y-5">
                <label className="block text-xs font-semibold text-zinc-700">Inspection type
                  <select value={service} onChange={event => setService(event.target.value)} className="mt-2 min-h-12 w-full border border-zinc-300 bg-white px-4 text-sm text-zinc-900 focus:border-brand-green focus:outline-none">
                    {residentialServices.map(item => <option key={item.key} value={item.key}>{item.label}</option>)}
                  </select>
                </label>
                <label className="block text-xs font-semibold text-zinc-700">Property area (sq ft)
                  <input type="number" min="1" step="0.01" value={area} onChange={event => setArea(event.target.value)} className="mt-2 min-h-12 w-full border border-zinc-300 bg-white px-4 text-sm text-zinc-900 focus:border-brand-green focus:outline-none" />
                </label>
              </div>
              {result ? (
                <div className="mt-8 border-l-2 border-brand-green bg-zinc-50 p-6" aria-live="polite">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">{selected?.label} · {area} sq ft</p>
                  <div className="mt-4 flex items-baseline justify-between gap-4"><span className="text-sm text-zinc-600">Base price</span><strong className="text-xl text-zinc-900">{formatAed(result.baseMinor)}</strong></div>
                  <div className="mt-2 flex items-baseline justify-between gap-4"><span className="text-sm text-zinc-600">5% VAT</span><span className="text-sm font-semibold text-zinc-700">{formatAed(result.vatMinor)}</span></div>
                  <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-zinc-200 pt-4"><span className="text-sm font-semibold text-zinc-800">Total incl. VAT</span><strong className="text-2xl text-brand-green">{formatAed(result.totalMinor)}</strong></div>
                  <p className="mt-3 text-[11px] leading-relaxed text-zinc-500">Estimate for a single standard residential inspection. Final scope is confirmed before booking.</p>
                </div>
              ) : <p role="alert" className="mt-6 border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">Enter a valid area up to 1,000,000 sq ft, using no more than two decimal places.</p>}
            </div>
            <div className="lg:pl-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-green">How the rates work</p>
              <h2 className="mt-3 text-3xl font-bold text-zinc-900">A whole-area rate, based on total area.</h2>
              <div className="mt-7 overflow-hidden border border-zinc-200">
                {[
                  ["Up to 1,000 sq ft", "AED 1.00 / sq ft"],
                  ["Above 1,000 to 2,000 sq ft", "AED 0.90 / sq ft"],
                  ["Above 2,000 to 3,000 sq ft", "AED 0.80 / sq ft"],
                  ["Above 3,000 to 4,000 sq ft", "AED 0.75 / sq ft"],
                  ["Above 4,000 sq ft", "AED 0.70 / sq ft"],
                ].map(([band, rate]) => <div key={band} className="flex items-center justify-between gap-4 border-b border-zinc-200 px-5 py-4 last:border-b-0"><span className="text-sm text-zinc-600">{band}</span><strong className="text-sm text-zinc-900">{rate}</strong></div>)}
              </div>
              <p className="mt-4 text-xs leading-relaxed text-zinc-500">The tier applies to the complete measured area. Stage 1 base is the greater of area × applicable rate or AED 800. Stage 2 / de-snagging and DLP are half the Stage 1 base, after the AED 800 minimum has been applied. Move-in / move-out is the greater of area × AED 0.50 or AED 800. VAT of 5% is added to each base price.</p>
              <div className="mt-8 space-y-3 border-t border-zinc-200 pt-6 text-sm text-zinc-600">
                <p className="flex gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />No additional service surcharges for standard residential pricing.</p>
                <p className="flex gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />100% payment is due after the physical inspection and before report release.</p>
                <p className="flex gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />Multi-unit, custom, commercial and consultancy scopes are quoted separately.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-zinc-50 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-green">Worked examples</p>
            <h2 className="mt-3 text-3xl font-bold text-zinc-900">See the calculation in practice.</h2>
            <div className="mt-8 divide-y divide-zinc-200 border-y border-zinc-200">
              {pricingExamples.map(example => <article key={example.label} className="grid gap-3 py-5 sm:grid-cols-[1fr_1.25fr_auto] sm:items-center">
                <div><h3 className="text-sm font-semibold text-zinc-900">{example.label}</h3><p className="mt-1 text-xs text-zinc-500">{example.calculation}</p></div>
                <p className="text-xs text-zinc-500">Base {example.base} <span className="mx-1">·</span> VAT {example.vat}</p>
                <p className="text-sm font-bold text-brand-green">{example.total} total</p>
              </article>)}
            </div>
            <div className="mt-10 flex flex-wrap gap-5">
              <Link href="/book-inspection" className="inline-flex items-center gap-2 bg-brand-green px-6 py-3 text-xs font-semibold text-white hover:bg-emerald-700">Book an inspection <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/contact" className="inline-flex items-center gap-2 py-3 text-xs font-semibold text-brand-green">Ask about a custom scope <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}