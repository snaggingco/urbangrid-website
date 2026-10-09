import { useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ChevronDown, Menu, ArrowUpRight } from "lucide-react";
import { buildingConsultancyServices, residentialServices } from "@/data/serviceHierarchy";
import { NETWORK_LOGIN_URL } from "@shared/network/country";

interface HeaderProps {
  isAdmin?: boolean;
}

const primaryLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Resources", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

function ServicesMenu({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="grid grid-cols-2 gap-8 p-7">
      <div>
        <a
          href="/services#residential-inspections"
          onClick={onNavigate}
          className="group mb-4 flex items-center justify-between border-b border-zinc-100 pb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-900 hover:text-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-green"
        >
          Residential Inspections <ArrowUpRight className="h-3 w-3" />
        </a>
        <ul className="space-y-3">
          {residentialServices.map((service) => (
            <li key={service.href}>
              <Link
                href={service.href}
                onClick={onNavigate}
                className="block text-xs text-zinc-600 hover:text-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-green"
              >
                {service.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <a
          href="/services#building-consultancy"
          onClick={onNavigate}
          className="group mb-4 flex items-center justify-between border-b border-zinc-100 pb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-900 hover:text-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-green"
        >
          Building Consultancy <ArrowUpRight className="h-3 w-3" />
        </a>
        <ul className="space-y-3">
          {buildingConsultancyServices.map((service) => (
            <li key={service.href}>
              <Link
                href={service.href}
                onClick={onNavigate}
                className="block text-xs text-zinc-600 hover:text-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-green"
              >
                {service.label}
              </Link>
            </li>
          ))}
          <li className="pt-1">
            <Link href="/services" onClick={onNavigate} className="inline-flex items-center gap-2 text-xs font-semibold text-brand-green hover:gap-3 transition-all">
              All Services <ArrowUpRight className="h-3 w-3" />
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

const resourceLinks = [
  { label: "Pricing", href: "/pricing" },
  { label: "Sample Report", href: "/sample-report" },
  { label: "Blog & Guides", href: "/blog" },
];

export default function Header({ isAdmin = false }: HeaderProps) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const desktopServices = useRef<HTMLDetailsElement>(null);
  const closeMobileMenu = () => { setIsMobileMenuOpen(false); setMobileServicesOpen(false); setMobileResourcesOpen(false); };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-zinc-100 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex-shrink-0 text-xl font-bold text-brand-green tracking-tight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green">
            UrbanGrid
          </Link>

          {!isAdmin && (
            <nav aria-label="Main navigation" className="hidden md:flex items-center gap-5 lg:gap-7">
              <Link href="/" className={`text-xs font-medium uppercase tracking-wide transition-colors ${location === "/" ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-900"}`}>Home</Link>
              <details ref={desktopServices} className="relative group" onKeyDown={event => {
                if (event.key === "Escape") {
                  event.currentTarget.open = false;
                  event.currentTarget.querySelector("summary")?.focus();
                }
              }} onBlur={event => {
                if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget as Node)) event.currentTarget.open = false;
              }}>
                <summary className={`list-none cursor-pointer flex items-center gap-1 text-xs font-medium uppercase tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green ${location.startsWith("/services") ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-900"}`}>
                  Services <ChevronDown className="h-3 w-3 opacity-60 transition-transform group-open:rotate-180" />
                </summary>
                <div className="fixed left-1/2 top-16 -translate-x-1/2 w-[min(640px,calc(100vw-3rem))] max-h-[calc(100dvh-5rem)] overflow-y-auto border border-zinc-100 bg-white shadow-xl">
                  <ServicesMenu onNavigate={() => { if (desktopServices.current) desktopServices.current.open = false; }} />
                </div>
              </details>
              {primaryLinks.slice(1, 2).map((item) => (
                <Link key={item.href} href={item.href} className={`text-xs font-medium uppercase tracking-wide transition-colors ${location === item.href ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-900"}`}>{item.name}</Link>
              ))}
              <details className="relative group">
                <summary className={`list-none cursor-pointer flex items-center gap-1 text-xs font-medium uppercase tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green ${["/pricing", "/sample-report", "/blog"].some((path) => location.startsWith(path)) ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-900"}`}>
                  Resources <ChevronDown className="h-3 w-3 opacity-60 transition-transform group-open:rotate-180" />
                </summary>
                <div className="absolute left-0 top-full mt-4 w-48 border border-zinc-100 bg-white py-2 shadow-xl">
                  {resourceLinks.map((item) => (
                    <Link key={item.href} href={item.href} className="block min-h-11 px-4 py-3 text-xs text-zinc-700 hover:bg-zinc-50 hover:text-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-green">{item.label}</Link>
                  ))}
                </div>
              </details>
              <Link href="/contact" className={`text-xs font-medium uppercase tracking-wide transition-colors ${location === "/contact" ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-900"}`}>Contact</Link>
              <Link href="/book-inspection" className="inline-flex items-center bg-brand-green px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-white hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green">
                Book Inspection
              </Link>
            </nav>
          )}

          <div className="flex items-center gap-4">
            {isAdmin ? (
              <button
                onClick={() => window.location.href = "/api/admin/logout"}
                className="text-xs font-medium text-brand-green border-b border-brand-green pb-0.5 hover:text-zinc-900 hover:border-zinc-900 transition-all"
              >
                Logout
              </button>
            ) : (
              <>
                <a
                  href={NETWORK_LOGIN_URL}
                  className="hidden md:inline-flex text-xs font-medium text-brand-green border-b border-brand-green pb-0.5 hover:text-zinc-900 hover:border-zinc-900 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green"
                >
                  Login
                </a>
                <div className="md:hidden">
                  <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-zinc-600 hover:text-zinc-900" aria-label="Open navigation menu">
                        <Menu className="h-5 w-5" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-full sm:w-[400px] border-l border-zinc-100 overflow-y-auto">
                      <SheetTitle className="sr-only">Navigation</SheetTitle>
                      <SheetDescription className="sr-only">Browse inspections, building consultancy and company information.</SheetDescription>
                      <nav aria-label="Mobile navigation" className="flex flex-col mt-12">
                        <Link href="/" onClick={closeMobileMenu} className="py-4 border-b border-zinc-100 text-xs font-medium uppercase tracking-widest text-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-green">Home</Link>
                        <div className="border-b border-zinc-100">
                          <button type="button" aria-expanded={mobileServicesOpen} onClick={() => setMobileServicesOpen((open) => !open)} className="w-full flex items-center justify-between py-4 text-left text-xs font-medium uppercase tracking-widest text-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-green">
                            Services <ChevronDown className={`h-4 w-4 transition-transform ${mobileServicesOpen ? "rotate-180" : ""}`} />
                          </button>
                          {mobileServicesOpen && <ServicesMenu onNavigate={closeMobileMenu} />}
                        </div>
                        <Link href="/about" onClick={closeMobileMenu} className="py-4 border-b border-zinc-100 text-xs font-medium uppercase tracking-widest text-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-green">About</Link>
                        <div className="border-b border-zinc-100">
                          <button type="button" aria-expanded={mobileResourcesOpen} onClick={() => setMobileResourcesOpen((open) => !open)} className="w-full flex items-center justify-between py-4 text-left text-xs font-medium uppercase tracking-widest text-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-green">
                            Resources <ChevronDown className={`h-4 w-4 transition-transform ${mobileResourcesOpen ? "rotate-180" : ""}`} />
                          </button>
                          {mobileResourcesOpen && (
                            <ul className="pb-3 pl-4">
                              {resourceLinks.map((item) => <li key={item.href}><Link href={item.href} onClick={closeMobileMenu} className="flex min-h-11 items-center text-sm text-zinc-600 hover:text-brand-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-green">{item.label}</Link></li>)}
                            </ul>
                          )}
                        </div>
                        <Link href="/contact" onClick={closeMobileMenu} className="py-4 border-b border-zinc-100 text-xs font-medium uppercase tracking-widest text-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-green">Contact</Link>
                        <Link href="/book-inspection" onClick={closeMobileMenu} className="mt-6 inline-flex justify-center bg-brand-green px-5 py-4 text-xs font-semibold uppercase tracking-widest text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green">
                          Book Inspection
                        </Link>
                        <div className="border-t border-zinc-100 pt-6 mt-8">
                          <a
                            href={NETWORK_LOGIN_URL}
                            onClick={closeMobileMenu}
                            className="inline-flex text-xs font-medium text-brand-green border-b border-brand-green pb-0.5 hover:text-zinc-900 hover:border-zinc-900 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-green"
                          >
                            Login
                          </a>
                        </div>
                      </nav>
                    </SheetContent>
                  </Sheet>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}