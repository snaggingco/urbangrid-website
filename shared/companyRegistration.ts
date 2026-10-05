// Company-level certificate facts supplied by the owner. These establish
// office registration, not endorsement or individual professional credentials.
export const companyRegistration = {
  companyName: "URBANGRID REAL ESTATE CONSULTANCIES L.L.C",
  documentName: "Real Estate Office Registration Certificate",
  registrationNumber: "60346",
  licenseNumber: "1254374",
  registrationDate: "2023-11-10",
  registrationDateLabel: "10 November 2023",
  expiryDate: "2027-11-09",
  expiryDateLabel: "9 November 2027",
  activities: ["Property Observer", "Real Estate Consultancies"],
  issuer: "Dubai Land Department / Real Estate Regulatory Agency (RERA)",
  credentialsHref: "/about#regulatory-registration",
} as const;

// Schema.org identifier accepts PropertyValue on Organization and its
// LocalBusiness subtype. Do not model this as a professional accreditation.
export function companyRegistrationIdentifiers() {
  return [
    { "@type": "PropertyValue", name: "RERA real estate office registration number",
      propertyID: "Real Estate Regulatory Agency (RERA) registration number",
      value: companyRegistration.registrationNumber },
    { "@type": "PropertyValue", name: "Trade license number",
      propertyID: "Trade license number", value: companyRegistration.licenseNumber },
  ];
}