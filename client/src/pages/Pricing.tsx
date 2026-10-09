import { Link } from "wouter";
import { ArrowRight, ClipboardCheck, MapPin, MessagesSquare } from "lucide-react";
import SEO from "@/components/SEO";
import { seoResources } from "@shared/seoResources";

const steps = [
  { icon: MapPin, number: "01", title: "Tell us where", description: "Share the property or project location and the type of building involved." },
  { icon: ClipboardCheck, number: "02", title: "Describe the work", description: "Let us know which inspection, survey or consultancy service you are considering." },
  { icon: MessagesSquare, number: "03", title: "Receive a custom quote", description: "We will discuss scope, access, deliverables and availability before anything is agreed." },
];

export default function Pricing() {
  return (
    <>
      <SEO title={seoResources.pricing.seoTitle} description={seoResources.pricing.description} canonical="https://urbangrid.co.uk/pricing" />
      <main className="pt-16">
        <section className="bg-zinc-950 py-20 text-white sm:py-24">
          <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">
            <nav aria-label="Breadcrumb" className="mb-10 text-xs text-zinc-400"><Link href="/" className="hover:text-white">Home</Link><span className="mx-2">/</span><span aria-current="page" className="text-zinc-200">Custom quotes</span></nav>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-brand-green">Enquiries only</p>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">{seoResources.pricing.title}</h1>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-base">UrbanGrid UK provides custom quotes for inspections and consultancy in London and nearby areas. There are no online bookings or payments.</p>
            <Link href="/contact" className="mt-8 inline-flex min-h-12 items-center bg-brand-green px-6 text-sm font-semibold text-white hover:bg-emerald-700">Tell us what you need <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </div>
        </section>
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-green">How it works</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-bold text-zinc-900">A considered scope comes first.</h2>
            <div className="mt-10 grid gap-px border border-zinc-200 bg-zinc-200 md:grid-cols-3">
              {steps.map(({ icon: Icon, number, title, description }) => <article key={number} className="bg-white p-7 sm:p-9">
                <div className="flex items-center justify-between"><Icon className="h-5 w-5 text-brand-green" /><span className="text-[10px] tracking-widest text-zinc-400">{number}</span></div>
                <h3 className="mt-8 text-lg font-bold text-zinc-900">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-600">{description}</p>
              </article>)}
            </div>
            <p className="mt-8 max-w-3xl border-l-2 border-brand-green bg-zinc-50 px-5 py-4 text-xs leading-relaxed text-zinc-600">Fees, scope and timing are confirmed individually. No VAT treatment or payment schedule is represented on this website; these details will be set out in any written proposal.</p>
          </div>
        </section>
      </main>
    </>
  );
}
