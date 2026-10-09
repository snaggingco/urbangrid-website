// Authoritative residential pricing. All monetary outputs are integer fils.
export const residentialServices = [
  { key: "new-build-snagging", label: "New Build / Stage 1 Snagging" },
  { key: "post-renovation-inspection", label: "Post-Renovation Inspection" },
  { key: "secondary-market-inspection", label: "Secondary Market Inspection" },
  { key: "de-snagging", label: "Stage 2 / De-Snagging" },
  { key: "dlp-inspection", label: "DLP / 11th Month Inspection" },
  { key: "move-in-move-out", label: "Move-In / Move-Out Inspection" },
] as const;
export type ResidentialService = typeof residentialServices[number]["key"];
export function calculateInspectionPrice(service: string, areaSqft: number, units = 1) {
  if (!residentialServices.some(s => s.key === service) || units > 1) throw new Error("Request Custom Quote");
  if (!Number.isFinite(areaSqft) || areaSqft <= 0 || areaSqft > 1000000 ||
      Math.abs(areaSqft * 100 - Math.round(areaSqft * 100)) > 0.000001 ||
      !Number.isInteger(units) || units < 1) throw new Error("Enter a valid area (up to two decimal places)");
  const hundredths = Math.round(areaSqft * 100);
  const tier = areaSqft <= 1000 ? 1 : areaSqft <= 2000 ? 2 : areaSqft <= 3000 ? 3 : areaSqft <= 4000 ? 4 : 5;
  const rateMinor = service === "move-in-move-out" ? 50 : [100, 90, 80, 75, 70][tier - 1];
  const stage1BaseMinor = Math.max(Math.floor((hundredths * rateMinor + 50) / 100), 80000);
  const baseMinor = (service === "de-snagging" || service === "dlp-inspection"
    ? Math.ceil(stage1BaseMinor / 2) : stage1BaseMinor) * units;
  const vatMinor = Math.floor((baseMinor * 5 + 50) / 100);
  const totalMinor = baseMinor + vatMinor;
  return { baseMinor, vatMinor, totalMinor,
    currency: "AED" as const, rateMinor, tier: service === "move-in-move-out" ? null : tier, units };
}
export type InspectionPrice = ReturnType<typeof calculateInspectionPrice>;
export const formatAed = (minor: number) => `AED ${(minor / 100).toLocaleString("en-AE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
export function serviceFromLabel(label: string): ResidentialService | undefined {
  if (/stage 1|new.?build/i.test(label)) return "new-build-snagging";
  if (/post.?renovation/i.test(label)) return "post-renovation-inspection";
  if (/secondary.?market|resale/i.test(label)) return "secondary-market-inspection";
  if (/de.?snag|stage 2/i.test(label)) return "de-snagging";
  if (/dlp|11th month/i.test(label)) return "dlp-inspection";
  if (/move.?in|move.?out/i.test(label)) return "move-in-move-out";
}