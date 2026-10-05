import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, CheckCircle2, Shield } from "lucide-react";
import SEO from "@/components/SEO";
import { companyRegistration } from "@shared/companyRegistration";

export default function About() {
  useEffect(() => {
    if (window.location.hash !== "#regulatory-registration") return;

    // About is lazy-loaded, so scroll once the section has mounted.
    const scrollToRegistration = () => {
      document.getElementById("regulatory-registration")?.scrollIntoView({ block: "start" });
    };
    const frame = window.requestAnimationFrame(scrollToRegistration);
    const retry = window.setTimeout(scrollToRegistration, 100);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(retry);
    };
  }, []);

  const serviceAreas = [
    "Dubai",
    "Abu Dhabi", 
    "Sharjah",
    "Ajman",
    "Ras Al Khaimah",
    "Fujairah",
    "Umm Al Quwain"
  ];

  const achievements = [
    { number: "01", label: "Observe accessible conditions" },
    { number: "02", label: "Record with context" },
    { number: "03", label: "Explain scope and limits" },
    { number: "04", label: "Support informed follow-up" }
  ];

  return (
    <>
      <SEO
        title="About UrbanGrid | Property Inspection Services UAE"
        description="UrbanGrid provides independent property inspection and snagging services across the UAE, with findings documented for practical follow-up."
      />
    <div className="pt-16">
      {/* Hero Section */}
      <section className="pt-24 pb-20 bg-zinc-950">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <p className="text-[10px] font-semibold tracking-[0.25em] text-white uppercase mb-4">About</p>
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold text-white leading-tight mb-6">
            About UrbanGrid
          </h1>
          <p className="text-sm text-zinc-500 leading-relaxed max-w-2xl">
            Independent property inspection and snagging services across the UAE, with a clear record of accessible conditions and scope limitations.
          </p>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">OUR STORY & MISSION</p>
              <h2 className="text-4xl lg:text-5xl font-bold text-zinc-900 leading-tight mb-8">
                Integrity in every <br />inspection.
              </h2>
              <div className="space-y-6 text-sm text-zinc-500 leading-relaxed">
                <p>
                  UrbanGrid provides independent property inspection and building consultancy services. Our work is centred on documenting accessible conditions, explaining limitations and giving clients a clear record to consider alongside their own due diligence.
                </p>
                <p>
                  Inspections are scoped around the property, requested service and available access. Reports record relevant observations and photographs where useful; inaccessible or concealed elements may require separate investigation.
                </p>
                <p>
                  Our aim is to make inspection findings understandable and useful without overstating what a visual, non-destructive inspection can establish.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 border-t border-l border-zinc-100">
              {achievements.map((achievement, index) => (
                <div key={index} className="p-10 border-r border-b border-zinc-100">
                  <div className="text-4xl font-bold text-brand-green mb-2">
                    {achievement.number}
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500 font-medium">
                    {achievement.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      

      <section
        id="regulatory-registration"
        aria-labelledby="regulatory-registration-heading"
        className="scroll-mt-20 border-y border-zinc-100 bg-zinc-50 py-16 lg:py-20"
      >
        <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">
          <div className="max-w-3xl">
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-brand-green">Company record</p>
            <h2 id="regulatory-registration-heading" className="text-3xl font-bold leading-tight text-zinc-900 sm:text-4xl">
              Regulatory Registration
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-500">
              This is a company-level real estate office registration. It records the registered entity and office details; it is not an endorsement, approval of inspection reports, or evidence of any individual professional qualification.
            </p>
          </div>

          <dl className="mt-10 grid grid-cols-1 border-l border-t border-zinc-200 sm:grid-cols-2 lg:grid-cols-3">
            <div className="border-b border-r border-zinc-200 bg-white p-5 sm:col-span-2 lg:col-span-3">
              <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">Registered company</dt>
              <dd className="mt-2 text-sm font-semibold text-zinc-900">{companyRegistration.companyName}</dd>
            </div>
            <div className="border-b border-r border-zinc-200 bg-white p-5">
              <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">RERA office registration number</dt>
              <dd className="mt-2 font-mono text-sm text-zinc-900">{companyRegistration.registrationNumber}</dd>
            </div>
            <div className="border-b border-r border-zinc-200 bg-white p-5">
              <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">License number</dt>
              <dd className="mt-2 font-mono text-sm text-zinc-900">{companyRegistration.licenseNumber}</dd>
            </div>
            <div className="border-b border-r border-zinc-200 bg-white p-5">
              <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">Issuer</dt>
              <dd className="mt-2 text-sm leading-relaxed text-zinc-900">{companyRegistration.issuer}</dd>
            </div>
            <div className="border-b border-r border-zinc-200 bg-white p-5">
              <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">Registered activities</dt>
              <dd className="mt-2 text-sm leading-relaxed text-zinc-900">{companyRegistration.activities.join(", ")}</dd>
            </div>
            {companyRegistration.registrationDateLabel && (
              <div className="border-b border-r border-zinc-200 bg-white p-5">
                <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">Registration date</dt>
                <dd className="mt-2 text-sm text-zinc-900">{companyRegistration.registrationDateLabel}</dd>
              </div>
            )}
            <div className="border-b border-r border-zinc-200 bg-white p-5">
              <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">Expiry date</dt>
              <dd className="mt-2 text-sm text-zinc-900">{companyRegistration.expiryDateLabel}</dd>
            </div>
            <div className="border-b border-r border-zinc-200 bg-white p-5 sm:col-span-2 lg:col-span-3">
              <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">Document</dt>
              <dd className="mt-2 text-sm text-zinc-900">{companyRegistration.documentName}</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Service Coverage */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
            <div className="max-w-2xl">
              <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">COVERAGE</p>
              <h2 className="text-4xl lg:text-5xl font-bold text-zinc-900 leading-tight">
                Service Coverage Areas
              </h2>
            </div>
            <p className="text-sm text-zinc-500 max-w-sm">
                Availability, access requirements, scope and timing are confirmed for each requested area.
            </p>
          </div>
          
          <div className="border-y border-zinc-100 py-12">
            <div className="flex flex-wrap items-center justify-between gap-y-8">
              {serviceAreas.map((area, index) => (
                <div key={index} className="flex items-center">
                  <span className="text-sm font-bold text-zinc-900 uppercase tracking-widest">{area}</span>
                  {index < serviceAreas.length - 1 && (
                    <span className="mx-6 text-zinc-200">|</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-lg font-bold text-zinc-900 mb-4">
                Service availability
              </h3>
              <p className="text-sm text-zinc-500 leading-relaxed mb-8">
                Availability, access requirements, scope and timing are confirmed for each property. For standard residential inspections, the report preparation target is usually within 24 hours after inspection and full payment.
              </p>
              <Link href="/contact" className="inline-flex items-center gap-2 text-xs font-semibold text-brand-green border-b border-brand-green pb-0.5 hover:gap-3 transition-all">
                SCHEDULE AN INSPECTION <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* International Network */}
      <section className="py-24 lg:py-32 bg-zinc-50">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
            <div className="max-w-2xl">
              <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">GLOBAL PRESENCE</p>
              <h2 className="text-4xl lg:text-5xl font-bold text-zinc-900 leading-tight">
                Our International Network
              </h2>
            </div>
            <p className="text-sm text-zinc-500 max-w-sm">
              UrbanGrid is part of a wider property-services network with separate regional websites and service operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-100 border border-zinc-100">
            {/* KSA */}
            <div className="bg-white p-10 flex flex-col gap-6">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.25em] text-zinc-400 uppercase mb-2">Saudi Arabia</p>
                <h3 className="text-xl font-bold text-zinc-900 mb-3">Strata Surveyor</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Regional property inspection information is available through the Strata Surveyor website. Services, scope and operations are handled independently by that regional business.
                </p>
              </div>
              <a
                href="https://www.stratasurveyor.com"
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 text-xs font-semibold text-brand-green border-b border-brand-green pb-0.5 hover:gap-3 transition-all w-fit"
              >
                SNAGGING COMPANY IN SAUDI ARABIA <ArrowRight className="w-3 h-3" />
              </a>
            </div>

            {/* India */}
            <div className="bg-white p-10 flex flex-col gap-6">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.25em] text-zinc-400 uppercase mb-2">India</p>
                <h3 className="text-xl font-bold text-zinc-900 mb-3">Snagging.in</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Regional property inspection information is available through Snagging.in. Services, scope and operations are handled independently by that regional business.
                </p>
              </div>
              <a
                href="https://www.snagging.in"
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 text-xs font-semibold text-brand-green border-b border-brand-green pb-0.5 hover:gap-3 transition-all w-fit"
              >
                PROPERTY SNAGGING IN INDIA <ArrowRight className="w-3 h-3" />
              </a>
            </div>

            {/* UK */}
            <div className="bg-white p-10 flex flex-col gap-6">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.25em] text-zinc-400 uppercase mb-2">United Kingdom</p>
                <h3 className="text-xl font-bold text-zinc-900 mb-3">UrbanGrid UK</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Regional property inspection information is available through UrbanGrid UK. Services, scope and operations are handled independently by that regional business.
                </p>
              </div>
              <a
                href="https://www.urbangrid.co.uk"
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 text-xs font-semibold text-brand-green border-b border-brand-green pb-0.5 hover:gap-3 transition-all w-fit"
              >
                PROPERTY SNAGGING IN THE UK <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Inspection methodology */}
      <section className="py-24 lg:py-32 bg-zinc-50">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="text-center mb-16">
            <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-4">PROCESS & SCOPE</p>
            <h2 className="text-4xl lg:text-5xl font-bold text-zinc-900 leading-tight mb-4">
              A clear inspection record
            </h2>
          </div>
          
          <div className="grid grid-cols-1 gap-px border border-zinc-200 bg-zinc-200 md:grid-cols-2">
            <div className="bg-white p-8">
              <Shield className="mb-6 h-8 w-8 text-brand-green" />
              <h3 className="mb-2 text-lg font-bold text-zinc-900">Non-destructive visual review</h3>
              <p className="text-sm leading-relaxed text-zinc-500">The inspection is limited to areas and components that can be accessed and observed within the agreed scope. It is not a guarantee that every defect will be found.</p>
            </div>
            <div className="bg-white p-8">
              <CheckCircle2 className="mb-6 h-8 w-8 text-brand-green" />
              <h3 className="mb-2 text-lg font-bold text-zinc-900">Documented observations</h3>
              <p className="text-sm leading-relaxed text-zinc-500">Reports record accessible conditions observed during the agreed visit, with photographs and location details where useful. Scope limitations and inaccessible areas are noted; further assessment may require an appropriately qualified specialist.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32 bg-zinc-950 text-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12">
            <div className="max-w-2xl">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                Ready to discuss <br />your inspection?
              </h2>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Discuss your property, access and intended inspection scope with our team.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-6">
              <Button asChild className="bg-brand-green text-white hover:bg-opacity-90 rounded-none h-12 px-8">
                <Link href="/contact">DISCUSS YOUR SCOPE</Link>
              </Button>
              <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-zinc-950 rounded-none h-12 px-8 bg-transparent">
                <Link href="/services">VIEW OUR SERVICES</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
