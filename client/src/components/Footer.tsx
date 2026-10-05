import { Link } from "wouter";
import { openConsentPreferences } from "@/lib/consent";
import { buildingConsultancyServices, residentialServices, serviceLocations } from "@/data/serviceHierarchy";

const companyLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "All Services", href: "/services" },
  { name: "Residential Pricing", href: "/pricing" },
  { name: "Sample Report", href: "/sample-report" },
  { name: "Resources", href: "/blog" },
  { name: "Contact", href: "/contact" },
  { name: "Broker Referrals", href: "/broker-referrals" },
  { name: "Careers", href: "/careers" },
];

const internationalLinks = [
  { name: "Snagging Company KSA", href: "https://www.stratasurveyor.com" },
  { name: "Property Snagging India", href: "https://www.snagging.in" },
  { name: "Property Snagging UK", href: "https://www.urbangrid.co.uk" },
];

function ServiceLinks({ services }: { services: typeof residentialServices }) {
  return (
    <ul className="space-y-2.5">
      {services.map((service) => (
        <li key={service.href}>
          <Link href={service.href} className="text-zinc-400 hover:text-white transition-colors text-xs focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300">
            {service.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function Footer() {
  return (
    <footer className="bg-zinc-950 text-white pt-16 lg:pt-20 pb-32 md:pb-10 border-t border-zinc-900">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-zinc-800 pb-8">
          <div>
            <div className="text-lg font-bold tracking-tight text-white">UrbanGrid</div>
            <p className="mt-3 max-w-md text-zinc-400 text-xs leading-relaxed">
              Engineer-led property inspections for homebuyers, and practical building consultancy for owners and managers.
            </p>
          </div>
          <button type="button" onClick={openConsentPreferences} className="self-start sm:self-auto min-h-11 text-xs text-zinc-300 underline underline-offset-4 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-300">
            Cookie preferences
          </button>
        </div>

        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-[1.25fr_1.35fr_1.35fr_1fr_1.15fr] gap-x-8 gap-y-10 pb-12">
          <section>
            <h2 className="text-[10px] font-semibold tracking-[0.2em] text-zinc-500 uppercase mb-5">Company</h2>
              <ul className="space-y-3">
              {companyLinks.map((item) => <li key={item.href}><Link href={item.href} className="text-zinc-300 hover:text-white text-xs focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300">{item.name}</Link></li>)}
            </ul>
          </section>
          <section>
            <h2 className="text-[10px] font-semibold tracking-[0.2em] text-zinc-500 uppercase mb-5">Residential Inspections</h2>
            <ServiceLinks services={residentialServices} />
          </section>
          <section>
            <h2 className="text-[10px] font-semibold tracking-[0.2em] text-zinc-500 uppercase mb-5">Building Consultancy</h2>
            <ServiceLinks services={buildingConsultancyServices} />
          </section>
          <section>
            <h2 className="text-[10px] font-semibold tracking-[0.2em] text-zinc-500 uppercase mb-5">Locations</h2>
            <ul className="space-y-3">{serviceLocations.map((item) => <li key={item.href}><Link href={item.href} className="text-zinc-400 hover:text-white text-xs">{item.name}</Link></li>)}</ul>
            <h2 className="text-[10px] font-semibold tracking-[0.2em] text-zinc-500 uppercase mt-7 mb-4">International</h2>
            <ul className="space-y-3">{internationalLinks.map((item) => <li key={item.href}><a href={item.href} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white text-xs">{item.name}</a></li>)}</ul>
          </section>
          <section>
            <h2 className="text-[10px] font-semibold tracking-[0.2em] text-zinc-500 uppercase mb-5">Contact</h2>
            <p className="text-zinc-400 text-xs leading-relaxed">Office 1205, Business Bay<br />Dubai, United Arab Emirates</p>
            <div className="mt-4 flex flex-col gap-3">
              <a href="tel:+971585686852" className="text-zinc-400 hover:text-white text-xs gtm-call-button">+971 58 568 6852</a>
              <a href="mailto:info@urbangrid.ae" className="text-zinc-400 hover:text-white text-xs">info@urbangrid.ae</a>
              <a href="https://wa.me/971567427634?text=Hello%20UrbanGrid%2C%20I%27m%20interested%20in%20your%20property%20inspection%20services.%20Please%20provide%20me%20with%20more%20information." target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white text-xs">WhatsApp</a>
            </div>
          </section>
        </div>

        <div className="md:hidden divide-y divide-zinc-800 border-y border-zinc-800">
          <details className="py-1">
            <summary className="cursor-pointer py-4 text-[10px] font-semibold tracking-[0.2em] text-zinc-300 uppercase focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-300">Company & Contact</summary>
            <div className="pb-5 grid grid-cols-2 gap-8">
              <ul className="space-y-3">{companyLinks.map((item) => <li key={item.href}><Link href={item.href} className="text-zinc-400 hover:text-white text-xs">{item.name}</Link></li>)}</ul>
              <div className="space-y-3 text-xs text-zinc-400">
                <p>Office 1205, Business Bay<br />Dubai, United Arab Emirates</p>
                <a href="tel:+971585686852" className="block gtm-call-button">+971 58 568 6852</a>
                <a href="mailto:info@urbangrid.ae" className="block">info@urbangrid.ae</a>
                <a href="https://wa.me/971567427634?text=Hello%20UrbanGrid%2C%20I%27m%20interested%20in%20your%20property%20inspection%20services.%20Please%20provide%20me%20with%20more%20information." target="_blank" rel="noopener noreferrer" className="block">WhatsApp</a>
              </div>
            </div>
          </details>
          <details className="py-1">
            <summary className="cursor-pointer py-4 text-[10px] font-semibold tracking-[0.2em] text-zinc-300 uppercase focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-300">Residential Inspections</summary>
            <div className="pb-5"><ServiceLinks services={residentialServices} /></div>
          </details>
          <details className="py-1">
            <summary className="cursor-pointer py-4 text-[10px] font-semibold tracking-[0.2em] text-zinc-300 uppercase focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-300">Building Consultancy</summary>
            <div className="pb-5"><ServiceLinks services={buildingConsultancyServices} /></div>
          </details>
          <details className="py-1">
            <summary className="cursor-pointer py-4 text-[10px] font-semibold tracking-[0.2em] text-zinc-300 uppercase focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-300">Locations & International</summary>
            <div className="pb-5 grid grid-cols-2 gap-8">
              <ul className="space-y-3">{serviceLocations.map((item) => <li key={item.href}><Link href={item.href} className="text-zinc-400 hover:text-white text-xs">{item.name}</Link></li>)}</ul>
              <ul className="space-y-3">{internationalLinks.map((item) => <li key={item.href}><a href={item.href} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white text-xs">{item.name}</a></li>)}</ul>
            </div>
          </details>
        </div>

        <div className="border-t border-zinc-800 mt-8 pt-7 flex flex-col md:flex-row justify-between gap-5 items-start md:items-center text-zinc-500 text-[10px] uppercase tracking-wider">
          <p>© {new Date().getFullYear()} UrbanGrid Real Estate Consultancies L.L.C.</p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}