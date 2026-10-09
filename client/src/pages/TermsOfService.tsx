import { Link } from "wouter";
import SEO from "@/components/SEO";

const principles = [
  ["Enquiries are not bookings", "Submitting an enquiry does not reserve an inspection, confirm availability or create a service agreement."],
  ["Scope is agreed in writing", "Property access, areas covered, deliverables, timing and any limitations should be confirmed in a written proposal before work proceeds."],
  ["Custom fees", "Fees are quoted for the agreed scope. This website does not publish a rate card, VAT treatment or payment schedule."],
  ["Visual inspection limits", "A non-destructive visual visit can describe accessible, observable conditions at that time. It does not establish concealed conditions, provide a valuation or guarantee that every issue will be identified."],
  ["Use of website information", "Service descriptions are general information only. They are not a substitute for a service-specific proposal or advice from an appropriately qualified specialist."],
];

export default function TermsOfService() {
  return (
    <>
      <SEO title="Service Information | UrbanGrid UK" description="Important information about enquiries, scope and service-specific proposals from UrbanGrid UK." />
      <div className="pt-16">
        <section className="bg-zinc-950 py-20 text-white sm:py-24">
          <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.25em] text-emerald-300">Before you enquire</p>
            <h1 className="text-4xl font-bold leading-tight sm:text-6xl">Service information</h1>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-zinc-300">This page explains the enquiry process. It is not a service contract or a booking confirmation.</p>
          </div>
        </section>
        <section className="bg-[#f4f1e7] py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-6 sm:px-10 lg:px-16">
            <div className="divide-y divide-zinc-200 border-y border-zinc-200">
              {principles.map(([title, body], index) => (
                <article key={title} className="py-7">
                  <p className="font-mono text-[10px] text-brand-green">{String(index + 1).padStart(2, "0")}</p>
                  <h2 className="mt-2 text-xl font-semibold text-zinc-900">{title}</h2>
                  <p className="mb-0 mt-3 text-sm leading-relaxed text-zinc-600">{body}</p>
                </article>
              ))}
            </div>
            <p className="mt-8 text-xs leading-relaxed text-zinc-500">The applicable contracting party, service terms and legal information should be confirmed in the proposal or other written agreement for each engagement.</p>
          </div>
        </section>
        <section className="bg-zinc-950 py-14 text-white">
          <div className="mx-auto flex max-w-6xl flex-col gap-5 px-6 sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-16">
            <p className="mb-0 text-sm text-zinc-300">Need to discuss your property or project?</p>
            <Link href="/contact" className="inline-flex min-h-11 items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white underline underline-offset-4">Request a custom quote</Link>
          </div>
        </section>
      </div>
    </>
  );
}
