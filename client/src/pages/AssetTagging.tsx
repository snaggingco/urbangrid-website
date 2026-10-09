import { useEffect } from "react";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import SEO from "@/components/SEO";
import { assetTaggingSchema, assetTaggingService } from "@shared/assetTagging";

const deliverables = [
  ["Asset register", "A structured inventory recording agreed asset identifiers, descriptions, categories and locations."],
  ["Identification and tagging", "An agreed labelling approach that connects physical assets to their register entries."],
  ["Location and photographic records", "Supporting records that help building teams identify and locate inventoried assets."],
  ["Management handover", "An agreed register format for building management, maintenance coordination and lifecycle planning."],
];

export default function AssetTagging() {
  useEffect(() => {
    let script = document.getElementById("asset-tagging-schema") as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = "asset-tagging-schema";
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(assetTaggingSchema());
    return () => { script?.remove(); };
  }, []);

  return (
    <>
      <SEO
        title={assetTaggingService.seoTitle}
        description={assetTaggingService.description}
        canonical={`https://urbangrid.co.uk${assetTaggingService.path}`}
      />
      <section className="bg-zinc-900 text-white py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <nav aria-label="Breadcrumb" className="flex flex-wrap gap-2 text-xs text-zinc-300 mb-10">
            <Link href="/" className="hover:text-white underline-offset-4 hover:underline">Home</Link>
            <span aria-hidden="true">/</span>
            <a href="/services#building-consultancy" className="hover:text-white underline-offset-4 hover:underline">Building Consultancy</a>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Asset Tagging &amp; Inventory</span>
          </nav>
          <p className="text-xs font-semibold tracking-widest uppercase text-emerald-300 mb-5">Building Consultancy</p>
          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight max-w-3xl mb-6">Asset Tagging &amp; Inventory</h1>
          <p className="text-zinc-300 max-w-2xl leading-relaxed mb-8">
            Know what your building contains, where it is and how it is recorded.
            Our asset register and inventory service supports owners, developers
            and asset managers with building management and lifecycle planning across London and nearby areas.
          </p>
          <Link href="/contact" className="inline-flex items-center gap-3 bg-brand-green text-white px-6 py-4 text-sm font-semibold hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
            Request Custom Quote <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="text-xs text-zinc-400 mt-4">Scope, asset quantities, access and deliverables are agreed before work begins.</p>
        </div>
      </section>
      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-5">A practical record of your building assets</h2>
          <p className="text-zinc-600 max-w-3xl leading-relaxed mb-10">
            The agreed inventory can cover building systems, equipment and common-area
            assets. A consistent register gives your team a reference for maintenance,
            replacement planning and management handovers. This is an inventory service,
            not a substitute for a condition survey or technical due diligence.
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            {deliverables.map(([title, description]) => (
              <article key={title} className="border border-zinc-200 p-6 sm:p-8">
                <h3 className="font-semibold text-lg mb-3">{title}</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-zinc-50 py-16">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <h2 className="text-2xl font-semibold mb-8">How the service works</h2>
          <ol className="grid sm:grid-cols-3 gap-8">
            {[
              ["Agree the scope", "Confirm the building, asset categories, available records, access and required register format."],
              ["Record and identify", "Survey the agreed assets, record their identifiers and locations, and apply the agreed tagging method."],
              ["Hand over the register", "Provide the agreed inventory and supporting records for your management team's use."],
            ].map(([title, description], index) => (
              <li key={title}>
                <p className="text-brand-green text-sm font-semibold mb-3">0{index + 1}</p>
                <h3 className="font-semibold mb-3">{title}</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">{description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <h2 className="text-2xl font-semibold mb-4">Discuss your building's inventory requirements</h2>
          <p className="text-zinc-600 mb-6 max-w-2xl">Share the building type, approximate asset quantities and the records you need. We will prepare a custom quote for the agreed scope.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 text-brand-green font-semibold underline underline-offset-4">Request Custom Quote <ArrowRight className="h-4 w-4" /></Link>
          <div className="flex flex-wrap gap-x-6 gap-y-3 mt-8 text-sm">
            <Link href="/services/rera-services/building-condition-survey" className="underline underline-offset-4">Explore Building Condition Survey</Link>
            <Link href="/services/rera-services/reserve-fund-study" className="underline underline-offset-4">Explore Reserve Fund Study</Link>
            <a href="/services#building-consultancy" className="underline underline-offset-4">All Building Consultancy services</a>
          </div>
        </div>
      </section>
    </>
  );
}