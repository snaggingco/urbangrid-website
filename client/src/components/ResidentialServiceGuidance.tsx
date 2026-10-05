import { Check, Info } from "lucide-react";

type GuidanceKind = "new-build" | "dlp" | "resale";

const guidance: Record<GuidanceKind, { eyebrow: string; title: string; intro: string; prep: string[]; scope: string }> = {
  "new-build": {
    eyebrow: "Before handover",
    title: "Prepare for a new-build inspection",
    intro: "Arrange access before your handover appointment where possible, so observations can be recorded while the property is available and before your own walkthrough.",
    prep: ["Confirm access, parking and any building registration requirements.", "Share available floor plans, handover notes and the developer’s snagging checklist.", "Ensure utilities are on where safe and permitted; provide access to rooms, balconies and service points."],
    scope: "The inspection records visible, accessible conditions using non-destructive methods. Concealed construction and inaccessible systems are outside a visual inspection. Findings can support a discussion with the developer but do not guarantee acceptance, rectification or a particular handover outcome.",
  },
  dlp: {
    eyebrow: "During the applicable DLP",
    title: "Make time for access and records",
    intro: "Plan the visit early enough to review and submit any observations under the terms and deadlines that apply to your property. Warranty terms and responsibilities vary by contract and circumstance.",
    prep: ["Share the handover date, available warranty or DLP documents, and previous defect lists.", "Note any changes or recurring symptoms, including when and where they appear.", "Arrange access to affected rooms and systems, and keep developer correspondence for your own records."],
    scope: "A visual inspection documents observable conditions on the inspection date. It does not determine legal entitlement, guarantee developer acceptance or replace specialist testing. A reinspection is only available by agreed separate scope and is not guaranteed.",
  },
  resale: {
    eyebrow: "Before purchasing",
    title: "Focus the visit on access and evidence",
    intro: "Coordinate access with the seller or agent and allow time for a room-by-room review before your transaction decision deadline.",
    prep: ["Share available plans, listing details, maintenance records and known repair history.", "Ask that rooms and agreed accessible areas are unlocked and available during the visit.", "Bring questions about visible concerns; note areas that could not be accessed for follow-up."],
    scope: "The report records visible conditions and may help you frame questions or discussions with the seller. It is not a valuation, legal opinion, guarantee of hidden condition, repair quotation or promise of a negotiated result. Non-destructive inspection cannot confirm concealed elements.",
  },
};

export default function ResidentialServiceGuidance({ kind }: { kind: GuidanceKind }) {
  const item = guidance[kind];
  return (
    <section className="border-y border-zinc-200 bg-zinc-50 py-16 lg:py-20">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 sm:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:px-16">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-brand-green">{item.eyebrow}</p>
          <h2 className="mt-4 text-3xl font-bold leading-tight text-zinc-900">{item.title}</h2>
          <p className="mt-4 text-sm leading-relaxed text-zinc-600">{item.intro}</p>
        </div>
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700">A useful checklist</h3>
          <ul className="mt-4 space-y-3">
            {item.prep.map(line => <li key={line} className="flex gap-3 text-sm leading-relaxed text-zinc-600"><Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />{line}</li>)}
          </ul>
          <div className="mt-7 flex gap-3 border-l-2 border-zinc-300 bg-white p-5">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" /><p className="text-xs leading-relaxed text-zinc-600">{item.scope}</p>
          </div>
        </div>
      </div>
    </section>
  );
}