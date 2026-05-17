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
    { q: 'What is new build handover snagging?', a: 'New build snagging is a detailed inspection of your property before you accept the keys from the developer. We identify defects in finishes, MEP systems, and safety items so the developer fixes them under warranty before you move in.' },
    { q: 'When should I book a snagging inspection?', a: 'Book the inspection before your handover walkthrough. This gives you an independent defect list to present to the developer, rather than relying on their own quality control team.' },
    { q: 'What defects are most common in new builds in the UAE?', a: 'The most frequent findings are hollow tiles, uneven paint, AC balancing issues, plumbing leaks, window seal failures, and incomplete fire safety installations. Our engineers document every item with photographs.' }
  ],
  'post-renovation-inspection': [
    { q: 'What is a post-renovation inspection?', a: 'A post-renovation inspection verifies that fit-out or renovation work has been completed to specification and quality standards before you make the final payment to your contractor.' },
    { q: 'Why should I inspect after renovation work?', a: 'Contractors often rush the final phase, leaving incomplete work, substandard finishes, or unsafe electrical modifications. An independent inspection protects your investment and provides documented evidence for rectification claims.' },
    { q: 'What do you check after a renovation or fit-out?', a: 'We verify finishing quality, MEP modifications, structural changes, compliance with approved plans, and safety system integrity. Every item is photographed and referenced against your contractor\'s specification.' }
  ],
  'dlp-snagging': [
    { q: 'What is the Defects Liability Period (DLP)?', a: 'The DLP is a one-year warranty period from handover during which the developer is legally obligated to repair defects at no cost to you. In the UAE, this is enforced under Federal Law and RERA regulations.' },
    { q: 'When should I book a DLP snagging inspection?', a: 'Book in months 10\u201311 of your DLP. This gives you time to formally log all defects with the developer before the warranty expires. Once the DLP ends, uncorrected defects become your financial responsibility.' },
    { q: 'What happens if defects are found after my DLP expires?', a: 'After DLP expiry, the developer is no longer legally required to fix defects for free. Our pre-expiry inspection maximizes your warranty claims and ensures nothing is missed before your rights lapse.' }
  ],
  'move-in-move-out': [
    { q: 'What is a move-in/move-out inspection?', a: 'It is an independent condition assessment of a rental property documenting its state before you move in and after you move out. This creates a clear, photographic record that protects both tenant and landlord.' },
    { q: 'Who needs a rental property condition report?', a: 'Both tenants and landlords benefit. Tenants use it to protect their security deposit. Landlords use it to justify deductions for damage caused during the tenancy and to maintain property value.' },
    { q: 'Can the inspection report protect my security deposit?', a: 'Yes. A professional condition report with dated photographs provides objective evidence if there is a dispute over deposit deductions. Without it, disagreements often become costly and time-consuming.' }
  ],
  'secondary-market': [
    { q: 'What is a secondary market property inspection?', a: 'A secondary market inspection is a comprehensive assessment of an existing (resale) property before you complete the purchase. It identifies hidden defects that the seller may not have disclosed.' },
    { q: 'Should I inspect before buying a resale property in the UAE?', a: 'Absolutely. Resale properties may have concealed water damage, structural cracks, electrical faults, or unapproved modifications. An inspection gives you a clear picture of the true condition before you commit.' },
    { q: 'Can your report help me negotiate the purchase price?', a: 'Yes. Our reports include estimated rectification costs for every defect documented. Buyers regularly use this evidence to negotiate price reductions or request repairs before completion.' }
  ],
  'developer-projects': [
    { q: 'What is developer and contractor snagging?', a: 'It is an independent quality control inspection conducted before handover to your clients. We identify defects in finishes, MEP, and safety systems so you can correct them before they damage your reputation.' },
    { q: 'Why do developers need independent inspection?', a: 'Internal quality teams have commercial pressure to meet deadlines. An independent inspector works solely for you and reports every defect objectively, protecting your brand and reducing post-handover complaints.' },
    { q: 'What standards do you check against?', a: 'We inspect against UAE Civil Defence requirements, DEWA/ADDC electrical standards, NFPA fire safety codes, ASHRAE HVAC standards, and your project specification documents.' }
  ],

  // ── RERA Services ──
  'reserve-fund-study': [
    { q: 'What is a reserve fund study?', a: 'A reserve fund study (also called a sinking fund analysis) is a long-term financial projection that calculates how much money a strata building needs to maintain and replace major building components over time.' },
    { q: 'Is a reserve fund study required by RERA?', a: 'Yes. RERA mandates reserve fund studies for strata properties in Dubai. The study must be conducted by a qualified professional and updated periodically to ensure the building remains financially viable.' },
    { q: 'How often should a reserve fund study be conducted?', a: 'RERA typically requires an update every 3\u20135 years, or whenever there is a significant change in the building\'s condition or planned capital expenditure. We provide studies that meet RERA\'s exact documentation requirements.' }
  ],
  'service-charge-allocation': [
    { q: 'What is service charge allocation?', a: 'Service charge allocation is the process of distributing common area maintenance costs (cleaning, security, utilities, landscaping) fairly across all unit owners in a strata building according to RERA guidelines.' },
    { q: 'How are service charges calculated in the UAE?', a: 'RERA specifies that service charges must be allocated based on unit share (often tied to square footage) and common area usage. We assess the building, verify the calculation method, and ensure full regulatory compliance.' },
    { q: 'Can your report resolve service charge disputes?', a: 'Yes. Our independent allocation report provides transparent, RERA-compliant cost distribution backed by documented methodology. This evidence is regularly used to resolve disputes between owners\' associations and individual unit owners.' }
  ],
  'reinstatement-cost-assessment': [
    { q: 'What is a reinstatement cost assessment?', a: 'It is a professional valuation of the cost to rebuild or reinstate a property to its original condition in the event of total loss. This figure is used by insurers to set adequate coverage limits.' },
    { q: 'Why do I need a reinstatement cost assessment for insurance?', a: 'If your insured value is too low, you will be underinsured in a claim and the insurer will apply average clause deductions. If it is too high, you are paying unnecessary premiums. Our assessment gets the figure exactly right.' },
    { q: 'How is the reinstatement value calculated?', a: 'We assess built-up area, construction type, finishes quality, MEP systems, and current construction costs per square metre in the UAE. The assessment is documented to RERA and insurance industry standards.' }
  ],
  'building-completion-audit': [
    { q: 'What is a building completion audit?', a: 'A building completion audit is a comprehensive verification that a constructed building matches the approved plans, regulatory requirements, and developer\'s specifications before handover and title registration.' },
    { q: 'Is a completion audit mandatory for handover in the UAE?', a: 'RERA requires developers to complete specific handover procedures and documentation before transferring title. Our audit verifies that all regulatory checkpoints have been met, protecting buyers from accepting non-compliant properties.' },
    { q: 'What does the audit verify?', a: 'We check plan compliance, MEP system commissioning, fire safety installations, structural integrity, finishing quality, common area completion, and all regulatory certificates required for the occupation permit.' }
  ],
  'building-condition-survey': [
    { q: 'What is a building condition survey?', a: 'A building condition survey is a detailed assessment of a property\'s physical state, covering structural elements, MEP systems, finishes, and common areas. It is used for maintenance planning and regulatory reporting.' },
    { q: 'How often should a condition survey be conducted?', a: 'For commercial and strata properties, RERA recommends periodic condition surveys as part of ongoing building management. We recommend every 3\u20135 years, or before major maintenance decisions or property transactions.' },
    { q: 'What systems do you assess in a condition survey?', a: 'We examine structural elements, roofing and waterproofing, electrical and plumbing systems, HVAC, lifts, fire safety, external cladding, and common areas. Every finding is rated by urgency and estimated rectification cost.' }
  ],

  // ── Technical Inspections ──
  'technical-due-diligence': [
    { q: 'What is technical due diligence?', a: 'Technical due diligence is a comprehensive engineering assessment of a property before acquisition. It covers structural integrity, MEP systems, compliance status, and hidden risks that could affect investment value.' },
    { q: 'When should I commission technical due diligence?', a: 'Before any significant property acquisition \u2014 whether off-plan, resale, or commercial. The report gives investors, lenders, and fund managers the engineering confidence to proceed or renegotiate.' },
    { q: 'What risks does technical due diligence identify?', a: 'We identify structural defects, MEP deficiencies, compliance gaps, environmental risks, maintenance backlogs, and unapproved modifications. Every risk is quantified with estimated remediation costs.' }
  ],
  'dilapidation-survey': [
    { q: 'What is a dilapidation survey?', a: 'A dilapidation survey documents the condition of a property before and after nearby construction work. It creates a legal record that protects adjacent property owners from liability for pre-existing damage.' },
    { q: 'When is a dilapidation survey required in the UAE?', a: 'Developers and contractors are increasingly required by municipalities and insurers to conduct pre-construction dilapidation surveys of adjacent properties. We provide reports accepted by Dubai Municipality and major insurers.' },
    { q: 'Does a dilapidation survey provide legal protection?', a: 'Yes. The report establishes a baseline condition with dated photographs and detailed descriptions. If post-construction damage occurs, this evidence determines whether the contractor is liable.' }
  ],
  'thermographic-survey': [
    { q: 'What is a thermographic survey?', a: 'A thermographic survey uses infrared thermal imaging cameras to detect temperature variations across a building\'s surfaces. These variations reveal hidden defects invisible to the naked eye.' },
    { q: 'What can thermal imaging detect in a property?', a: 'Thermal imaging identifies energy losses, moisture intrusion behind walls, electrical hotspots, underfloor heating faults, insulation gaps, and water leak paths. It is particularly effective for detecting hidden water damage.' },
    { q: 'Is a thermographic survey non-invasive?', a: 'Yes. Thermal imaging is completely non-contact and non-destructive. We scan walls, ceilings, floors, and MEP systems without drilling, cutting, or dismantling any building element.' }
  ],
  'noise-survey': [
    { q: 'What is a noise survey?', a: 'A noise survey is a professional acoustic assessment that measures and analyses sound levels within and around a property to ensure compliance with UAE environmental and habitability regulations.' },
    { q: 'What are the UAE noise level limits for residential properties?', a: 'UAE municipalities enforce specific decibel limits for daytime and nighttime noise. Our surveys measure against these thresholds and identify sources of non-compliance, whether from neighbouring construction, traffic, or building services.' },
    { q: 'How long does acoustic testing take?', a: 'A typical residential noise survey takes 2\u20134 hours, depending on property size and the number of measurement points required. We use calibrated Class 1 sound level meters for legally defensible results.' }
  ],
  'structural-survey': [
    { q: 'What is a structural survey?', a: 'A structural survey is a detailed engineering assessment of a building\'s load-bearing elements, foundations, walls, and structural frame. It identifies defects that could compromise safety or require costly remediation.' },
    { q: 'When is a structural survey necessary?', a: 'Before purchasing older properties, after seismic events, when cracks appear, before major alterations, or when a mortgage lender requires structural certification. It is essential for properties over 10 years old.' },
    { q: 'What structural elements do you examine?', a: 'We assess foundations, load-bearing walls, columns, beams, slabs, roof structures, balconies, and staircases. Our engineers look for cracks, settlement, corrosion, overloading signs, and code non-compliance.' }
  ]
};
