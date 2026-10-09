import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, CheckCircle2, Shield } from "lucide-react";
import SEO from "@/components/SEO";

const approach = [
  { number: "01", title: "Understand the brief", copy: "We start with the property, the questions you need answered and the access available." },
  { number: "02", title: "Agree the scope", copy: "Availability, deliverables and fees are discussed before any work is agreed." },
  { number: "03", title: "Record what is visible", copy: "The visit is limited to agreed, accessible areas and non-destructive observations." },
  { number: "04", title: "Make findings clear", copy: "The report distinguishes observed conditions from areas that could not be inspected." },
];

export default function About() {
  return (
    <>
      <SEO title="About UrbanGrid UK | London Property Inspections" description="Learn about UrbanGrid UK's enquiry-led property inspection and building consultancy services in London and nearby areas." />
      <div className="pt-16">
        <section className="bg-zinc-950 pb-20 pt-24 text-white">
          <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-emerald-300">About UrbanGrid UK</p>
            <h1 className="mb-6 max-w-4xl text-5xl font-bold leading-[1.04] tracking-tight sm:text-6xl lg:text-8xl">A clearer view of your property.</h1>
            <p className="max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-base">Property inspections and building consultancy enquiries for London and nearby areas. Clear scope, careful observations and no inflated promises.</p>
          </div>
        </section>

        <section className="bg-[#f4f1e7] py-20 lg:py-28">
          <div className="mx-auto grid max-w-6xl gap-14 px-6 sm:px-10 lg:grid-cols-[0.85fr_1.15fr] lg:px-16">
            <div>
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-brand-green">The work</p>
              <h2 className="text-4xl font-bold leading-tight text-zinc-900">Useful detail. Honest limits.</h2>
            </div>
            <div className="space-y-5 text-sm leading-relaxed text-zinc-600">
              <p>Every property and brief is different. UrbanGrid UK offers residential inspection and building consultancy enquiries, with availability and scope confirmed individually.</p>
              <p>A visual inspection can only describe what is accessible and observable at the time of the visit. It does not reveal concealed conditions, provide a valuation or replace advice from a specialist where further investigation is needed.</p>
              <p>We keep the process straightforward: tell us about the property and what you need to understand, then we can discuss a suitable scope and custom quote.</p>
            </div>
          </div>
        </section>

        <section className="bg-white py-20 lg:py-28">
          <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">
            <div className="mb-12 max-w-2xl">
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-brand-green">How it works</p>
              <h2 className="text-4xl font-bold leading-tight text-zinc-900">A measured process, from first question to report.</h2>
            </div>
            <div className="grid border-l border-t border-zinc-200 sm:grid-cols-2">
              {approach.map(step => (
                <article key={step.number} className="border-b border-r border-zinc-200 p-7 sm:p-9">
                  <span className="font-mono text-xs text-brand-green">{step.number}</span>
                  <h3 className="mt-8 text-xl font-semibold text-zinc-900">{step.title}</h3>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-zinc-500">{step.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-zinc-50 py-20 lg:py-28">
          <div className="mx-auto grid max-w-6xl gap-5 px-6 sm:px-10 md:grid-cols-2 lg:px-16">
            <article className="border border-zinc-200 bg-white p-8 sm:p-10">
              <Shield className="mb-7 h-8 w-8 text-brand-green" />
              <h2 className="text-xl font-bold text-zinc-900">A visual, non-destructive review</h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-500">Inspections are limited to agreed areas and available access. They are not a guarantee that every defect will be found.</p>
            </article>
            <article className="border border-zinc-200 bg-white p-8 sm:p-10">
              <CheckCircle2 className="mb-7 h-8 w-8 text-brand-green" />
              <h2 className="text-xl font-bold text-zinc-900">Observations with context</h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-500">Reports can record accessible conditions and photographs where useful, while noting relevant scope limitations and inaccessible areas.</p>
            </article>
          </div>
        </section>

        <section className="bg-zinc-950 py-20 text-white lg:py-28">
          <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 sm:px-10 md:flex-row md:items-end md:justify-between lg:px-16">
            <div>
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-emerald-300">London & nearby areas</p>
              <h2 className="max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">Start with the question you need answered.</h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-400">Share a few details and UrbanGrid UK can discuss availability, a suitable scope and a custom quote.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="h-12 rounded-none bg-brand-green px-7 text-white hover:bg-opacity-90"><Link href="/contact">Discuss your scope <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
              <Button asChild variant="outline" className="h-12 rounded-none border-white/40 bg-transparent px-7 text-white hover:bg-white hover:text-zinc-950"><Link href="/locations/london">London coverage</Link></Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
