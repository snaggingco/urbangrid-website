import { Link } from "wouter";

export default function TermsOfService() {
  return (
    <div className="pt-16">
      <section className="pt-24 pb-20 bg-zinc-950">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <p className="text-[10px] font-semibold tracking-[0.25em] text-brand-green uppercase mb-6">Legal</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight max-w-2xl">
            Terms of Service
          </h1>
          <p className="text-zinc-400 text-sm mt-6 max-w-xl leading-relaxed">
            Last updated: January 2025
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="space-y-12 text-sm text-zinc-600 leading-relaxed">

            <div>
              <h2 className="text-xl font-bold text-zinc-900 mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing or using the website <strong>urbangrid.ae</strong> or engaging any services provided by UrbanGrid Real Estate Consultancies L.L.C. ("UrbanGrid", "we", "us", "our"), you agree to be bound by these Terms of Service. If you do not agree, please do not use our website or services.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-zinc-900 mb-4">2. Services Provided</h2>
              <p>
                UrbanGrid provides professional property inspection and snagging services across the United Arab Emirates, including but not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>New build snagging and defect identification</li>
                <li>Post-renovation inspections</li>
                <li>Defects Liability Period (DLP) snagging</li>
                <li>Move-in / move-out inspections</li>
                <li>Secondary market property inspections</li>
                <li>RERA reserve fund studies and related services</li>
                <li>Technical inspections and surveys</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-zinc-900 mb-4">3. Booking and Appointments</h2>
              <p className="mb-3">When booking an inspection:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You must provide accurate property information including address, type, and size.</li>
                <li>Access to the property must be arranged by the client at the agreed inspection time.</li>
                <li>Cancellations must be made at least 24 hours in advance. Late cancellations may incur a fee.</li>
                <li>UrbanGrid reserves the right to reschedule appointments due to unforeseen circumstances.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-zinc-900 mb-4">4. Inspection Reports</h2>
              <p className="mb-3">Our inspection reports:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Are prepared by qualified inspectors in accordance with applicable UAE standards.</li>
                <li>Are delivered within 24 hours of the completed inspection, unless otherwise agreed in writing.</li>
                <li>Are the opinion of the inspector at the time of inspection and do not constitute a legal guarantee.</li>
                <li>Are intended solely for the use of the commissioning client and must not be relied upon by third parties without our written consent.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-zinc-900 mb-4">5. Fees and Payment</h2>
              <p>
                Service fees are quoted prior to confirmation of each booking. Full payment is required before or at the time of service unless a separate payment arrangement has been agreed in writing. Prices are quoted in UAE Dirhams (AED) and are subject to applicable taxes.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-zinc-900 mb-4">6. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by UAE law, UrbanGrid's liability for any claim arising from our services is limited to the fees paid for the specific inspection giving rise to the claim. We are not liable for consequential, indirect, or incidental losses including but not limited to loss of profit, loss of property value, or costs of remediation works.
              </p>
              <p className="mt-3">
                Our inspections are visual in nature and do not include destructive testing, examination of concealed areas, or areas inaccessible at the time of inspection.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-zinc-900 mb-4">7. Intellectual Property</h2>
              <p>
                All content on this website — including text, images, logos, and reports — is the intellectual property of UrbanGrid Real Estate Consultancies L.L.C. and is protected under applicable copyright laws. Reproduction or distribution without our prior written consent is prohibited.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-zinc-900 mb-4">8. Website Use</h2>
              <p>
                You agree not to use this website for any unlawful purpose, to transmit harmful content, or to interfere with the website's operation. We reserve the right to suspend access to any user who violates these terms.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-zinc-900 mb-4">9. Governing Law</h2>
              <p>
                These Terms of Service are governed by and construed in accordance with the laws of the Emirate of Dubai and the United Arab Emirates. Any disputes shall be subject to the exclusive jurisdiction of the courts of Dubai, UAE.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-zinc-900 mb-4">10. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms of Service at any time. Changes take effect upon posting to this page. Continued use of our website or services following changes constitutes your acceptance of the revised terms.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-zinc-900 mb-4">11. Contact</h2>
              <p>
                For any questions regarding these Terms of Service, please contact us:
              </p>
              <div className="mt-4 p-6 bg-zinc-50 border border-zinc-200">
                <p className="font-semibold text-zinc-900">UrbanGrid Real Estate Consultancies L.L.C.</p>
                <p className="mt-1">Office 1205, Business Bay, Dubai, UAE</p>
                <p className="mt-1">Email: <a href="mailto:info@urbangrid.ae" className="text-brand-green hover:underline">info@urbangrid.ae</a></p>
                <p className="mt-1">Phone: <a href="tel:+971585686852" className="text-brand-green hover:underline">+971 58 568 6852</a></p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="py-16 bg-zinc-950">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-zinc-400 text-sm">Questions about our terms?</p>
          <Link href="/contact">
            <span className="inline-flex items-center gap-2 text-[10px] font-bold tracking-widest text-white border border-white px-6 py-3 hover:bg-white hover:text-zinc-950 transition-all uppercase cursor-pointer">
              Contact Us
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
