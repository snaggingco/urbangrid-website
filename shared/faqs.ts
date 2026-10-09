// Shared FAQ data for service pages.
// Used by:
//   - server/schema.ts   → generates FAQPage JSON-LD for SSR
//   - client ServiceDetail.tsx → renders visible FAQ section
//
// Keeping this in one file guarantees the visible HTML and the schema markup
// always match, which is required for Google FAQ rich results.

export interface FAQEntry {
  q: string; // Question text (must match exactly in schema + visible HTML)
  a: string; // Answer text (must match exactly in schema + visible HTML)
}

export const serviceFAQs: Record<string, FAQEntry[]> = {
  'new-build-snagging': [
    { q: 'What is new build handover snagging?', a: 'New build snagging records accessible, visible defects in finishes, MEP systems and safety items before handover. The photographic report helps you raise items with the developer; repair responsibility and timescales depend on your agreement.' },
    { q: 'When should I book a snagging inspection?', a: 'Book the inspection before your handover walkthrough. This gives you an independent defect list to present to the developer, rather than relying on their own quality control team.' },
    { q: 'What may be found during a new-build inspection?', a: 'Observations vary by property and access. Findings can include visible finish issues, incomplete work, leaks or system concerns; the agreed report records what could be observed on the day.' }
  ],
  'post-renovation-inspection': [
    { q: 'What is a post-renovation inspection?', a: 'A post-renovation inspection records observable workmanship and condition against the agreed project information and scope.' },
    { q: 'Why should I inspect after renovation work?', a: 'Contractors often rush the final phase, leaving incomplete work, substandard finishes, or unsafe electrical modifications. An independent inspection protects your investment and provides documented evidence for rectification claims.' },
    { q: 'What do you check after a renovation or fit-out?', a: 'We review accessible workmanship and visible conditions against the information provided, within an agreed inspection scope. A condition report is not a structural certification, electrical safety certificate or statutory building-control approval.' }
  ],
  'dlp-snagging': [
    { q: 'What is the Defects Liability Period (DLP)?', a: 'The DLP is a contract-defined period for notifying the developer or contractor about defects. Check your handover documents for its start date, duration, covered items and notification requirements. An inspection report is evidence of observed condition, not a legal opinion or guarantee of repair.' },
    { q: 'When should I book a DLP snagging inspection?', a: 'Allow time for inspection, report preparation, payment and written notification before your contractual deadline. For a stated 12-month DLP, months 10–11 can be a practical planning window; confirm the actual dates and submission process with your developer.' },
    { q: 'What happens if defects are found after my DLP expires?', a: 'Responsibility may depend on the defect, contract and applicable law. Do not assume that every right ends on one date. Seek qualified legal advice where needed; UrbanGrid records accessible findings but does not determine legal liability.' }
  ],
  'move-in-move-out': [
    { q: 'What is a move-in/move-out inspection?', a: 'It is an independent condition assessment of a rental property documenting its state before you move in and after you move out. This creates a clear, photographic record that protects both tenant and landlord.' },
    { q: 'Who needs a rental property condition report?', a: 'Both tenants and landlords benefit. Tenants use it to protect their security deposit. Landlords use it to justify deductions for damage caused during the tenancy and to maintain property value.' },
    { q: 'Can the inspection report protect my security deposit?', a: 'Yes. A professional condition report with dated photographs provides objective evidence if there is a dispute over deposit deductions. Without it, disagreements often become costly and time-consuming.' }
  ],
  'secondary-market': [
    { q: 'What is a secondary market property inspection?', a: 'A secondary market inspection assesses the accessible condition of an existing property before purchase. It records visible defects and indications that may warrant further investigation; it cannot guarantee detection of concealed problems.' },
    { q: 'Should I inspect before buying a resale property?', a: 'An inspection can document accessible conditions and help you ask informed questions before proceeding. Concealed defects may require specialist investigation.' },
    { q: 'Can your report help me negotiate the purchase price?', a: 'The documented findings can inform discussions about repairs or price with the seller. Any negotiation outcome depends on the parties and contract. Obtain specialist repair quotations where needed; the inspection is not a valuation or a promise of savings.' }
  ],
  'developer-projects': [
    { q: 'What is developer and contractor snagging?', a: 'It is an independent quality control inspection conducted before handover to your clients. We identify defects in finishes, MEP, and safety systems so you can correct them before they damage your reputation.' },
    { q: 'Why do developers need independent inspection?', a: 'Internal quality teams have commercial pressure to meet deadlines. An independent inspector works solely for you and reports every defect objectively, protecting your brand and reducing post-handover complaints.' },
    { q: 'What standards do you check against?', a: 'The agreed inspection scope can reference project information supplied by the client. UrbanGrid does not represent a standard inspection as regulatory approval or certification.' }
  ],

  // ── Building consultancy services ──
  'reserve-fund-study': [
    { q: 'What is a reserve fund study?', a: 'A reserve fund study (also called a sinking fund analysis) is a long-term financial projection that calculates how much money a strata building needs to maintain and replace major building components over time.' },
    { q: 'Is a reserve fund study required?', a: 'Requirements depend on the property, its governing documents and applicable rules. Confirm requirements with the relevant managing party or qualified adviser; the study is scoped to the information supplied.' },
    { q: 'How often should a reserve fund study be conducted?', a: 'Review the study periodically and when building condition, costs or planned expenditure change. Confirm the applicable regulatory and management requirements for your building before agreeing the update interval and scope.' }
  ],
  'service-charge-allocation': [
    { q: 'What is service charge allocation?', a: 'Service charge allocation reviews how shared building costs are apportioned between units, based on the available building records, ownership information and agreed methodology.' },
    { q: 'How are service charges calculated?', a: 'The applicable approach depends on the governing documents, unit interests, costs and requirements relevant to the property. We document the agreed method; approval or acceptance by others is not implied.' },
    { q: 'Can your report resolve service charge disputes?', a: 'A documented allocation methodology can inform discussions about shared costs. It does not determine legal rights or guarantee acceptance by owners, regulators or dispute-resolution bodies.' }
  ],
  'reinstatement-cost-assessment': [
    { q: 'What is a reinstatement cost assessment?', a: 'It is a professional valuation of the cost to rebuild or reinstate a property to its original condition in the event of total loss. This figure is used by insurers to set adequate coverage limits.' },
    { q: 'Why do I need a reinstatement cost assessment for insurance?', a: 'An assessment supports discussion of the rebuilding sum insured with your insurer. Costs and policy conditions can change; the assessment is an estimate based on the agreed date, scope and assumptions, not a guarantee of settlement.' },
    { q: 'How is the reinstatement cost estimated?', a: 'The estimate uses the agreed property information, construction details, scope assumptions and cost basis at the assessment date. It is not a guarantee of an insurer’s settlement or acceptance.' }
  ],
  'building-completion-audit': [
    { q: 'What is a building completion audit?', a: 'A building completion audit reviews accessible conditions and the project documents provided against the agreed scope. It does not replace statutory building-control inspections, a completion certificate, legal advice or approval by a public authority.' },
    { q: 'Is a completion audit mandatory?', a: 'Requirements depend on the project and applicable arrangements. Confirm them with the relevant parties. An agreed-scope audit documents findings; it does not issue statutory approval or certification.' },
    { q: 'What does the audit verify?', a: 'We check plan compliance, MEP system commissioning, fire safety installations, structural integrity, finishing quality, common area completion, and all regulatory certificates required for the occupation permit.' }
  ],
  'building-condition-survey': [
    { q: 'What is a building condition survey?', a: 'A building condition survey is a detailed assessment of a property\'s physical state, covering structural elements, MEP systems, finishes, and common areas. It is used for maintenance planning and regulatory reporting.' },
    { q: 'How often should a condition survey be conducted?', a: 'The appropriate interval depends on the building, its management plan, condition and planned works. A survey can also support review before significant maintenance or a property transaction.' },
    { q: 'What systems do you assess in a condition survey?', a: 'The agreed scope may cover accessible structural elements, roofing, waterproofing, MEP systems, external finishes and common areas. Access limitations, specialist testing and any cost-estimation work are defined before the survey.' }
  ],

  // ── Technical Inspections ──
  'technical-due-diligence': [
    { q: 'What is technical due diligence?', a: 'Technical due diligence is a comprehensive engineering assessment of a property before acquisition. It covers structural integrity, MEP systems, compliance status, and hidden risks that could affect investment value.' },
    { q: 'When should I commission technical due diligence?', a: 'Before any significant property acquisition \u2014 whether off-plan, resale, or commercial. The report gives investors, lenders, and fund managers the engineering confidence to proceed or renegotiate.' },
    { q: 'What risks does technical due diligence identify?', a: 'An agreed-scope review can flag visible condition issues, MEP concerns, documentation gaps and maintenance needs. Concealed defects and environmental matters may require specialist investigation. Cost allowances are provided only where agreed and remain estimates.' }
  ],
  'dilapidation-survey': [
    { q: 'What is a dilapidation survey?', a: 'A dilapidation survey documents the condition of a property before and after nearby construction work. It creates a legal record that protects adjacent property owners from liability for pre-existing damage.' },
    { q: 'When should a dilapidation survey be arranged?', a: 'Consider documenting condition before nearby works begin, subject to access and project arrangements. Agree the survey area and reporting scope; acceptance by third parties is not guaranteed.' },
    { q: 'Does a dilapidation survey provide legal protection?', a: 'The report records baseline condition with dated photographs and observations. It can inform a later comparison, but it does not determine causation or legal liability.' }
  ],
  'thermographic-survey': [
    { q: 'What is a thermographic survey?', a: 'A thermographic survey uses infrared thermal imaging cameras to detect temperature variations across a building\'s surfaces. These variations reveal hidden defects invisible to the naked eye.' },
    { q: 'What can thermal imaging detect in a property?', a: 'Thermal imaging identifies energy losses, moisture intrusion behind walls, electrical hotspots, underfloor heating faults, insulation gaps, and water leak paths. It is particularly effective for detecting hidden water damage.' },
    { q: 'Is a thermographic survey non-invasive?', a: 'Yes. Thermal imaging is completely non-contact and non-destructive. We scan walls, ceilings, floors, and MEP systems without drilling, cutting, or dismantling any building element.' }
  ],
  'noise-survey': [
    { q: 'What is a noise survey?', a: 'A noise survey records sound levels at agreed locations and times, with the method and equipment defined for the project. Assessment against any specific criteria must be agreed in advance.' },
    { q: 'Can a noise survey assess compliance?', a: 'A report can compare recorded results with criteria specified in the agreed scope. It is not a statutory determination unless separately agreed and appropriately qualified.' },
    { q: 'How long does acoustic testing take?', a: 'Duration depends on the property, measurement points, access and agreed method. The scope and expected site time are confirmed when preparing a custom quote.' }
  ],
  'structural-survey': [
    { q: 'What is a structural survey?', a: 'A structural survey is a detailed engineering assessment of a building\'s load-bearing elements, foundations, walls, and structural frame. It identifies defects that could compromise safety or require costly remediation.' },
    { q: 'When is a structural survey necessary?', a: 'Before purchasing older properties, after seismic events, when cracks appear, before major alterations, or when a mortgage lender requires structural certification. It is essential for properties over 10 years old.' },
    { q: 'What structural elements do you examine?', a: 'We assess foundations, load-bearing walls, columns, beams, slabs, roof structures, balconies, and staircases. Our engineers look for cracks, settlement, corrosion, overloading signs, and code non-compliance.' }
  ]
};
