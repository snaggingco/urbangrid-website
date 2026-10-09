import { Link } from "wouter";
import SEO from "@/components/SEO";

const sections = [
  {
    title: "Information you choose to provide",
    body: "If an enquiry form is available, it may ask for your name, contact details, property or project information and a message. Please share only information relevant to your enquiry. A form may not be available while submission processing is being configured; if it cannot be sent, contact the team by phone.",
  },
  {
    title: "How enquiry information is used",
    body: "Information submitted through a form is intended to help the UrbanGrid UK team understand and respond to your request. Details of any further use, retention period or service-provider access should be confirmed in the terms provided for the service you choose.",
  },
  {
    title: "Browser storage and campaign details",
    body: "This website may store first-party campaign attribution in your browser so a later enquiry can retain the source of your visit. This is not an advertising profile. The site does not currently load advertising or analytics tags.",
  },
  {
    title: "External links",
    body: "Links to other websites open services operated by third parties. Their own privacy information applies when you choose to visit them.",
  },
  {
    title: "Questions",
    body: "For questions about an enquiry or this page, call +44 7436 597890 or write to UrbanGrid UK at 28 Manchester Street, London W1U 7LE, United Kingdom. Do not send sensitive information through the website.",
  },
];

export default function PrivacyPolicy() {
  return (
    <>
      <SEO title="Privacy Information | UrbanGrid UK" description="How UrbanGrid UK handles information shared through property inspection and consultancy enquiries." />
      <div className="pt-16">
        <section className="bg-zinc-950 py-20 text-white sm:py-24">
          <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.25em] text-emerald-300">Website information</p>
            <h1 className="text-4xl font-bold leading-tight sm:text-6xl">Privacy information</h1>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-zinc-300">A plain-language summary of information that may be shared when you make an enquiry through this website.</p>
          </div>
        </section>
        <section className="bg-[#f4f1e7] py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-6 sm:px-10 lg:px-16">
            <div className="mb-10 border-l-2 border-brand-green bg-white/70 p-5 text-sm leading-relaxed text-zinc-700">
              This page is general website information, not a complete legal notice. Please review the privacy information supplied with any agreed service for the responsible legal entity, retention details and applicable rights.
            </div>
            <div className="divide-y divide-zinc-200 border-y border-zinc-200">
              {sections.map((section, index) => (
                <article key={section.title} className="py-7">
                  <p className="font-mono text-[10px] text-brand-green">{String(index + 1).padStart(2, "0")}</p>
                  <h2 className="mt-2 text-xl font-semibold text-zinc-900">{section.title}</h2>
                  <p className="mb-0 mt-3 text-sm leading-relaxed text-zinc-600">{section.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="bg-zinc-950 py-14 text-white">
          <div className="mx-auto flex max-w-6xl flex-col gap-5 px-6 sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-16">
            <p className="mb-0 text-sm text-zinc-300">Questions about an enquiry?</p>
            <Link href="/contact" className="inline-flex min-h-11 items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white underline underline-offset-4">Contact UrbanGrid UK</Link>
          </div>
        </section>
      </div>
    </>
  );
}
