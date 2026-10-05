import { Link } from "wouter";
import { ArrowRight, Camera, ClipboardList, MapPin, ShieldCheck } from "lucide-react";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { seoResources } from "@shared/seoResources";

const sections = [
  { icon: MapPin, number: "01", title: "Finding location", text: "Each observation is tied to a room or identifiable area so the item can be revisited on site." },
  { icon: Camera, number: "02", title: "Photographic evidence", text: "Images illustrate visible conditions at the time of inspection and support the written observation." },
  { icon: ClipboardList, number: "03", title: "Defect record", text: "A concise description makes the observed issue and its location easier to discuss with the relevant contractor or developer." },
];

export default function SampleReport() {
  return (
    <>
      <SEO title={seoResources.sampleReport.seoTitle} description={seoResources.sampleReport.description} canonical={`https://urbangrid.ae${seoResources.sampleReport.path}`} />
      <main className="pt-16">
        <section className="bg-zinc-950 py-16 text-white sm:py-20 lg:py-24">
          <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">
            <nav aria-label="Breadcrumb" className="mb-10 text-xs text-zinc-400"><Link href="/" className="hover:text-white">Home</Link><span className="mx-2">/</span><span aria-current="page" className="text-zinc-200">Sample report</span></nav>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-brand-green">A report, at a glance</p>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">{seoResources.sampleReport.title}</h1>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-base">A practical overview of how findings are organised: by location, with photographic context and a clear description of the observed condition.</p>
            <a href="/sample-report.pdf" target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex min-h-12 items-center rounded-none bg-brand-green px-6 text-sm font-semibold text-white hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Open the anonymized sample report PDF <ArrowRight className="ml-2 h-4 w-4" /></a>
            <Button asChild variant="outline" className="ml-0 mt-4 min-h-12 rounded-none border-white/50 bg-transparent px-6 text-white hover:bg-white/10 hover:text-white sm:ml-4"><Link href="/book-inspection">Book Inspection</Link></Button>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">
            <div className="grid gap-px border border-zinc-200 bg-zinc-200 md:grid-cols-3">
              {sections.map(item => <article key={item.number} className="bg-white p-7 sm:p-9">
                <div className="flex items-center justify-between"><item.icon className="h-5 w-5 text-brand-green" /><span className="text-[10px] tracking-widest text-zinc-400">{item.number}</span></div>
                <h2 className="mt-8 text-lg font-bold text-zinc-900">{item.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-zinc-600">{item.text}</p>
              </article>)}
            </div>
            <div className="mt-14 grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-green">Scope & limitations</p>
                <h2 className="mt-3 text-3xl font-bold text-zinc-900">A visual inspection, not an invasive survey.</h2>
              </div>
              <div className="space-y-5 text-sm leading-relaxed text-zinc-600">
                <p>Findings describe conditions that could be observed and accessed during the agreed inspection. A standard inspection is non-destructive: concealed areas, finishes behind fixed coverings and inaccessible systems cannot be confirmed without separate access or specialist testing.</p>
                <p>Observations are not a guarantee that every defect will be found, nor a substitute for specialist engineering investigation, statutory approval, legal advice, valuation or a contractor’s repair scope. Recommendations and next steps depend on the specific finding and access available.</p>
                <p>Reports document observed conditions; they do not promise a developer response, rectification, negotiation result or property outcome.</p>
              </div>
            </div>
            <aside className="mt-12 flex gap-4 border-l-2 border-brand-green bg-zinc-50 p-6 sm:p-8">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-green" />
              <div><h2 className="text-sm font-semibold text-zinc-900">Anonymized for public viewing</h2><p className="mt-2 text-sm leading-relaxed text-zinc-600">Client names, precise property identifiers and individual preparer names have been permanently redacted from the 27-page sample. Photographs and findings illustrate the report format, not your property's condition. The sample is a historical illustration: your agreed scope and current booking terms govern your inspection. Full payment is due after physical inspection and before release of your final report.</p></div>
            </aside>
            <div className="mt-12 flex flex-col items-start justify-between gap-6 border-t border-zinc-200 pt-8 sm:flex-row sm:items-center">
              <p className="max-w-xl text-sm text-zinc-600">For current residential inspection rates and the payment sequence, see the pricing guide.</p>
              <Link href="/pricing" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-green hover:gap-3">View pricing <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}