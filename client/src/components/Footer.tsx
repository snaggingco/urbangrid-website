import { Link } from "wouter";
import { buildingConsultancyServices, residentialServices } from "@/data/serviceHierarchy";

const companyLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "All Services", href: "/services" },
  { name: "Custom Quotes", href: "/pricing" },
  { name: "Resources", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

function ServiceLinks({ services }: { services: typeof residentialServices }) {
  return <ul className="space-y-2.5">{services.map(service => <li key={service.href}><Link href={service.href} className="text-xs text-zinc-400 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300">{service.label}</Link></li>)}</ul>;
}

export default function Footer() {
  return (
    <footer className="border-t border-zinc-900 bg-zinc-950 pb-32 pt-16 text-white md:pb-10 lg:pt-20">
      <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">
        <div className="mb-8 flex flex-col gap-4 border-b border-zinc-800 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-lg font-bold tracking-tight text-white">UrbanGrid UK</div>
            <p className="mt-3 max-w-md text-xs leading-relaxed text-zinc-400">Property inspection and building consultancy enquiries for owners in London and nearby areas.</p>
          </div>
        </div>
        <div className="hidden gap-x-8 gap-y-10 pb-12 md:grid md:grid-cols-2 lg:grid-cols-[1.1fr_1.4fr_1.4fr_1fr]">
          <section><h2 className="mb-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Company</h2><ul className="space-y-3">{companyLinks.map(item => <li key={item.href}><Link href={item.href} className="text-xs text-zinc-300 hover:text-white">{item.name}</Link></li>)}</ul></section>
          <section><h2 className="mb-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Residential Inspections</h2><ServiceLinks services={residentialServices} /></section>
          <section><h2 className="mb-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Building Consultancy</h2><ServiceLinks services={buildingConsultancyServices} /></section>
          <section>
            <h2 className="mb-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Contact</h2>
            <p className="text-xs leading-relaxed text-zinc-400">28 Manchester Street<br />London W1U 7LE<br />United Kingdom</p>
            <div className="mt-4 flex flex-col gap-3">
              <a href="tel:+447436597890" className="text-xs text-zinc-400 hover:text-white">+44 7436 597890</a>
              <Link href="/contact" className="text-xs text-zinc-400 hover:text-white">Send an enquiry</Link>
              <Link href="/locations/london" className="text-xs text-zinc-400 hover:text-white">London coverage</Link>
            </div>
          </section>
        </div>
        <div className="divide-y divide-zinc-800 border-y border-zinc-800 md:hidden">
          <details className="py-1"><summary className="cursor-pointer py-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-300">Company & Contact</summary><div className="grid grid-cols-2 gap-8 pb-5"><ul className="space-y-3">{companyLinks.map(item => <li key={item.href}><Link href={item.href} className="text-xs text-zinc-400 hover:text-white">{item.name}</Link></li>)}</ul><div className="space-y-3 text-xs text-zinc-400"><p>28 Manchester Street<br />London W1U 7LE<br />United Kingdom</p><a href="tel:+447436597890" className="block">+44 7436 597890</a><Link href="/contact" className="block">Send an enquiry</Link><Link href="/locations/london" className="block">London coverage</Link></div></div></details>
          <details className="py-1"><summary className="cursor-pointer py-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-300">Residential Inspections</summary><div className="pb-5"><ServiceLinks services={residentialServices} /></div></details>
          <details className="py-1"><summary className="cursor-pointer py-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-300">Building Consultancy</summary><div className="pb-5"><ServiceLinks services={buildingConsultancyServices} /></div></details>
        </div>
        <div className="mt-8 flex flex-col items-start justify-between gap-5 border-t border-zinc-800 pt-7 text-[10px] uppercase tracking-wider text-zinc-500 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} UrbanGrid UK</p>
          <div className="flex gap-6"><Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link><Link href="/terms-of-service" className="hover:text-white">Terms of Service</Link></div>
        </div>
      </div>
    </footer>
  );
}
