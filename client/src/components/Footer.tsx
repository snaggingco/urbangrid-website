import { Link } from "wouter";

export default function Footer() {
  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Our Services', href: '/services' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
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
    <footer className="bg-zinc-950 text-white pt-24 pb-12 border-t border-zinc-900">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Company Info */}
          <div className="space-y-8">
            <div className="text-lg font-bold tracking-tight text-white">
              UrbanGrid
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed max-w-xs">
              UAE's premier property inspection and snagging company. Delivering international engineering standards across all seven Emirates with 40,000+ properties inspected.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-brand-green transition-all group" aria-label="Facebook">
                <i className="fab fa-facebook-f text-[10px] text-zinc-400 group-hover:text-white"></i>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-brand-green transition-all group" aria-label="Instagram">
                <i className="fab fa-instagram text-[10px] text-zinc-400 group-hover:text-white"></i>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-brand-green transition-all group" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in text-[10px] text-zinc-400 group-hover:text-white"></i>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-[10px] font-semibold tracking-[0.25em] text-zinc-600 uppercase mb-8">Quick Links</h3>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href}>
                    <span className="text-zinc-400 hover:text-white transition-colors cursor-pointer text-xs">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Locations */}
          <div>
            <h3 className="text-[10px] font-semibold tracking-[0.25em] text-zinc-600 uppercase mb-8">Service Locations</h3>
            <ul className="space-y-4">
              {footerLocations.map((loc) => (
                <li key={loc.name}>
                  <Link href={loc.href}>
                    <span className="text-zinc-400 hover:text-white transition-colors cursor-pointer text-xs">
                      {loc.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Info */}
          <div className="space-y-8">
            <h3 className="text-[10px] font-semibold tracking-[0.25em] text-zinc-600 uppercase mb-8">Contact Us</h3>
            <div className="space-y-6">
              <div className="flex items-start">
                <span className="text-zinc-400 text-xs leading-relaxed">
                  Office 1205, Business Bay<br />Dubai, United Arab Emirates
                </span>
              </div>
              <div className="flex flex-col space-y-2">
                <a href="tel:+971585686852" className="text-zinc-400 hover:text-white transition-colors text-xs gtm-call-button">
                  +971 58 568 6852
                </a>
                <a href="mailto:info@urbangrid.ae" className="text-zinc-400 hover:text-white transition-colors text-xs">
                  info@urbangrid.ae
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Secondary Navigation / Tags */}
        <div className="border-t border-zinc-800 pt-10 pb-10">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-[10px] text-zinc-500 uppercase tracking-widest font-medium">
            <Link href="/locations/dubai/snagging-company"><span className="hover:text-white cursor-pointer transition-colors">Snagging Dubai</span></Link>
            <span className="text-zinc-800">•</span>
            <Link href="/locations/abu-dhabi/snagging-company"><span className="hover:text-white cursor-pointer transition-colors">Snagging Abu Dhabi</span></Link>
            <span className="text-zinc-800">•</span>
            <Link href="/locations/sharjah/snagging-company"><span className="hover:text-white cursor-pointer transition-colors">Snagging Sharjah</span></Link>
            <span className="text-zinc-800">•</span>
            <Link href="/locations/dubai/property-inspection"><span className="hover:text-white cursor-pointer transition-colors">Property Inspection Dubai</span></Link>
            <span className="text-zinc-800">•</span>
            <Link href="/blog"><span className="hover:text-white cursor-pointer transition-colors">Property Snagging Tips</span></Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-zinc-800 pt-10 flex flex-col md:flex-row justify-between items-center text-zinc-500 text-[10px] uppercase tracking-wider">
          <p className="text-center md:text-left">© {new Date().getFullYear()} UrbanGrid Real Estate Consultancies L.L.C. Licensed by RERA & Dubai Economy Department.</p>
          <div className="flex space-x-8 mt-6 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
