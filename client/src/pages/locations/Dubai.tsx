import { Link } from "wouter";
import SEO from "@/components/SEO";
import { ArrowRight, CheckCircle } from "lucide-react";
import DubaiHero from "@/components/first-paint/DubaiHero";
import { homepageFAQs } from "@shared/publicFAQs";

export default function LondonCoverage() {
  return (
    <>
      <SEO title="London Property Inspection Coverage | UrbanGrid UK" description="UrbanGrid UK serves London and nearby areas. Enquire with your property location to confirm availability and request a custom quote." canonical="https://urbangrid.co.uk/locations/london" />
      <DubaiHero />
      <div className="bg-brand-green py-3.5">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-x-8 gap-y-2 px-5 text-xs font-medium text-white sm:px-10 lg:px-16">
          {["London and nearby areas", "Residential inspections", "Building consultancy", "Custom quotes"].map(item => <span key={item} className="flex items-center gap-2"><CheckCircle className="h-3 w-3 shrink-0" aria-hidden="true" />{item}</span>)}
        </div>
      </div>
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-16 px-6 sm:px-10 lg:grid-cols-2 lg:px-16">
          <div>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-brand-green">Coverage</p>
            <h2 className="mb-6 text-3xl font-bold leading-tight text-zinc-900 lg:text-4xl">London, with nearby areas considered.</h2>
            <div className="space-y-4 text-sm leading-relaxed text-zinc-600">
              <p>UrbanGrid UK provides access to the group’s existing inspection and consultancy catalogue for London property owners. Share the property's full location and the service you are considering so availability can be checked.</p>
              <p>Service scope, property access, information required and deliverables are discussed before a custom quote is prepared. Coverage depends on the specific address and assignment.</p>
              <p>The listed office is 28 Manchester Street, London W1U 7LE, United Kingdom. Contact the team before visiting.</p>
            </div>
          </div>
          <div className="border border-zinc-200 bg-zinc-50 p-8">
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wide text-zinc-900">Tell us about the property</h3>
            <div className="space-y-5">
              {[
                ["Location", "Share the postcode or area and confirm property access."],
                ["Service", "Choose from the existing residential inspection or consultancy catalogue."],
                ["Scope", "Describe the question you need the inspection or survey to address."],
                ["Quote", "The team will confirm availability and prepare a tailored proposal."],
              ].map(([label, detail]) => <div key={label} className="flex gap-4"><span className="w-16 shrink-0 text-[10px] font-bold uppercase tracking-wide text-brand-green">{label}</span><p className="text-xs leading-relaxed text-zinc-600">{detail}</p></div>)}
            </div>
          </div>
        </div>
      </section>
      <section className="bg-zinc-50 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-brand-green">Services</p>
          <h2 className="mb-10 max-w-2xl text-3xl font-bold leading-tight text-zinc-900 lg:text-4xl">Inspections and consultancy for property owners.</h2>
          <div className="divide-y divide-zinc-200 border-y border-zinc-200">
            {[
              ["Residential inspections", "New build, renovation, warranty-period, tenancy change and resale inspections."],
              ["Building consultancy", "Condition surveys, completion audits, reserve fund studies, reinstatement assessments and service-charge allocation."],
              ["Specialist surveys", "Technical due diligence, dilapidation, thermographic, noise and structural surveys; asset tagging and inventory."],
            ].map(([name, detail]) => <article key={name} className="grid gap-3 py-6 sm:grid-cols-[0.7fr_1fr]"><h3 className="text-sm font-semibold text-zinc-900">{name}</h3><p className="text-sm leading-relaxed text-zinc-600">{detail}</p></article>)}
          </div>
          <p className="mt-8 text-xs leading-relaxed text-zinc-500">Any technical standards, statutory criteria or other specific requirements are considered only when relevant to the agreed scope. No UK certification or regulatory approval is implied.</p>
        </div>
      </section>
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-4xl px-6 sm:px-10 lg:px-16">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-brand-green">FAQ</p>
          <h2 className="mb-10 text-3xl font-bold text-zinc-900">London service enquiries</h2>
          <div className="divide-y divide-zinc-200 border-y border-zinc-200">
            {homepageFAQs.map(faq => <div key={faq.q} className="grid grid-cols-1 gap-4 py-6 md:grid-cols-2"><h3 className="text-sm font-semibold text-zinc-800">{faq.q}</h3><p className="text-xs leading-relaxed text-zinc-500">{faq.a}</p></div>)}
          </div>
        </div>
      </section>
      <section className="bg-zinc-950 py-20 text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-16">
          <div><h2 className="mb-3 text-3xl font-bold leading-tight lg:text-4xl">Need an inspection or consultancy quote?</h2><p className="text-sm text-zinc-400">London and nearby areas · Scope confirmed individually</p></div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 bg-brand-green px-8 py-4 text-sm font-semibold text-white hover:bg-emerald-700">Send an enquiry <ArrowRight className="h-4 w-4" /></Link>
            <a href="tel:+447436597890" className="inline-flex items-center justify-center border border-zinc-600 px-8 py-4 text-sm font-medium text-zinc-300 hover:border-white hover:text-white">Call +44 7436 597890</a>
          </div>
        </div>
      </section>
    </>
  );
}
