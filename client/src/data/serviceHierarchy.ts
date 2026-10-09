export interface ServiceEntry {
  label: string;
  href: string;
  description: string;
}

export const residentialServices: ServiceEntry[] = [
  {
    label: "New Build / Pre-Handover",
    href: "/services/property-snagging/new-build-snagging",
    description: "Document incomplete work and defects before accepting the keys.",
  },
  {
    label: "Post-Renovation / Fit-out Inspection",
    href: "/services/property-snagging/post-renovation-inspection",
    description: "Check the completed workmanship against the agreed scope.",
  },
  {
    label: "DLP / Warranty Inspection",
    href: "/services/property-snagging/dlp-snagging",
      description: "Record visible condition concerns within the relevant warranty period.",
  },
  {
    label: "Move-In / Move-Out Inspection",
    href: "/services/property-snagging/move-in-move-out",
    description: "Create a clear condition record at a tenancy handover.",
  },
  {
    label: "Resale / Secondary Market Inspection",
    href: "/services/property-snagging/secondary-market",
    description: "Understand a property's condition before you commit to buy.",
  },
];

export const buildingConsultancyServices: ServiceEntry[] = [
  {
    label: "Developer & Contractor Projects",
    href: "/services/property-snagging/developer-projects",
    description: "Independent quality checks for developer and contractor projects.",
  },
  {
    label: "Reserve Fund Study",
    href: "/services/rera-services/reserve-fund-study",
    description: "Plan long-term building maintenance and capital requirements.",
  },
  {
    label: "Service Charge Allocation",
    href: "/services/rera-services/service-charge-allocation",
    description: "Assess how building service costs are allocated.",
  },
  {
    label: "Reinstatement Cost Assessment",
    href: "/services/rera-services/reinstatement-cost-assessment",
      description: "Estimate building reinstatement costs to inform insurance discussions.",
  },
  {
    label: "Building Completion Audit",
    href: "/services/rera-services/building-completion-audit",
      description: "Review completion against agreed drawings and project information.",
  },
  {
    label: "Building Condition Survey",
    href: "/services/rera-services/building-condition-survey",
    description: "Assess visible building condition and maintenance priorities.",
  },
  {
    label: "Technical Due Diligence",
    href: "/services/technical-inspections/technical-due-diligence",
    description: "Review technical risks before an acquisition or investment.",
  },
  {
    label: "Dilapidation Survey",
    href: "/services/technical-inspections/dilapidation-survey",
    description: "Record property condition around nearby construction works.",
  },
  {
    label: "Thermographic Survey",
    href: "/services/technical-inspections/thermographic-survey",
    description: "Use thermal imaging to investigate temperature anomalies.",
  },
  {
    label: "Noise Survey",
    href: "/services/technical-inspections/noise-survey",
    description: "Measure and assess sound conditions within a property.",
  },
  {
    label: "Structural Survey",
    href: "/services/technical-inspections/structural-survey",
    description: "Review visible structural elements and reported concerns.",
  },
  {
    label: "Asset Tagging & Inventory",
    href: "/services/asset-tagging-inventory",
    description: "Create a building asset register and inventory for management and lifecycle planning.",
  },
];

export const serviceLocations = [{ name: "London & nearby areas", href: "/locations/london" }];