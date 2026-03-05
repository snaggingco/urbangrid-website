import { Link } from "wouter";
import { SiFacebook, SiInstagram, SiLinkedin } from "react-icons/si";

export default function Footer() {
  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Our Services', href: '/services' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
    { name: 'Careers', href: '/careers' },
    { name: 'Broker Referrals', href: '/broker-referrals' },
  ];

  const footerLocations = [
    { name: 'Dubai', href: '/locations/dubai' },
    { name: 'Abu Dhabi', href: '/locations/abu-dhabi' },
    { name: 'Sharjah', href: '/locations/sharjah' },
    { name: 'Ajman', href: '/locations/ajman' },
    { name: 'Ras Al Khaimah', href: '/locations/ras-al-khaimah' },
    { name: 'Fujairah', href: '/locations/fujairah' },
    { name: 'Umm Al Quwain', href: '/locations/umm-al-quwain' },
  ];

  return (
    <footer className="bg-zinc-950 text-white pt-32 pb-16 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        
        {/* Top Section: Wordmark & Tagline */}
        <div className="mb-24">
          <Link href="/">
            <div className="text-4xl font-black tracking-tighter uppercase mb-4 cursor-pointer">
              UrbanGrid
            </div>
          </Link>
          <p className="text-zinc-500 text-sm tracking-widest uppercase font-medium">
            Setting the standard for engineering excellence across the Emirates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          {/* Mission */}
          <div className="space-y-8">
            <h3 className="text-[10px] font-bold tracking-[0.3em] text-zinc-600 uppercase">Our Mission</h3>
            <p className="text-zinc-400 text-xs leading-relaxed max-w-xs font-light">
              UAE's premier property inspection and snagging company. Delivering international engineering standards across all seven Emirates with 40,000+ properties inspected.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-zinc-900 flex items-center justify-center hover:bg-brand-green transition-all" aria-label="Facebook">
                <SiFacebook className="w-4 h-4 text-zinc-400 hover:text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-zinc-900 flex items-center justify-center hover:bg-brand-green transition-all" aria-label="Instagram">
                <SiInstagram className="w-4 h-4 text-zinc-400 hover:text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-zinc-900 flex items-center justify-center hover:bg-brand-green transition-all" aria-label="LinkedIn">
                <SiLinkedin className="w-4 h-4 text-zinc-400 hover:text-white" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-[10px] font-bold tracking-[0.3em] text-zinc-600 uppercase mb-8">Navigation</h3>
            <ul className="grid grid-cols-1 gap-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href}>
                    <span className="text-zinc-400 hover:text-white transition-colors cursor-pointer text-xs font-light tracking-wide">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Locations */}
          <div>
            <h3 className="text-[10px] font-bold tracking-[0.3em] text-zinc-600 uppercase mb-8">Emirates</h3>
            <ul className="grid grid-cols-1 gap-4">
              {footerLocations.map((loc) => (
                <li key={loc.name}>
                  <Link href={loc.href}>
                    <span className="text-zinc-400 hover:text-white transition-colors cursor-pointer text-xs font-light tracking-wide">
                      {loc.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Info */}
          <div className="space-y-8">
            <h3 className="text-[10px] font-bold tracking-[0.3em] text-zinc-600 uppercase mb-8">Headquarters</h3>
            <div className="space-y-6">
              <div className="flex items-start">
                <span className="text-zinc-400 text-xs leading-relaxed font-light">
                  Office 1205, Business Bay<br />Dubai, United Arab Emirates
                </span>
              </div>
              <div className="flex flex-col space-y-3">
                <a href="tel:+971585686852" className="text-zinc-400 hover:text-brand-green transition-colors text-xs font-medium tracking-wider">
                  +971 58 568 6852
                </a>
                <a href="mailto:info@urbangrid.ae" className="text-zinc-400 hover:text-brand-green transition-colors text-xs font-medium tracking-wider">
                  info@urbangrid.ae
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Secondary Navigation / Tags */}
        <div className="border-t border-zinc-900 pt-12 pb-12">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-[9px] text-zinc-600 uppercase tracking-[0.25em] font-bold">
            <Link href="/locations/dubai/snagging-company"><span className="hover:text-white cursor-pointer transition-colors">Snagging Dubai</span></Link>
            <Link href="/locations/abu-dhabi/snagging-company"><span className="hover:text-white cursor-pointer transition-colors">Snagging Abu Dhabi</span></Link>
            <Link href="/locations/sharjah/snagging-company"><span className="hover:text-white cursor-pointer transition-colors">Snagging Sharjah</span></Link>
            <Link href="/locations/dubai/property-inspection"><span className="hover:text-white cursor-pointer transition-colors">Property Inspection Dubai</span></Link>
            <Link href="/blog"><span className="hover:text-white cursor-pointer transition-colors">Property Snagging Tips</span></Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-zinc-900 pt-12 flex flex-col md:flex-row justify-between items-center text-zinc-600 text-[10px] uppercase tracking-[0.2em] font-medium">
          <p className="text-center md:text-left leading-relaxed">
            © {new Date().getFullYear()} UrbanGrid Real Estate Consultancies L.L.C.<br className="md:hidden" />
            <span className="hidden md:inline mx-2">•</span>
            Licensed by RERA & Dubai Economy Department.
          </p>
          <div className="flex space-x-10 mt-8 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
