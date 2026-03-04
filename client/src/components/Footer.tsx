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
    <footer className="bg-brand-black text-white pt-16 pb-8 border-t border-brand-green/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="text-2xl font-bold tracking-tight">
              Urban<span className="text-brand-green">Grid</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              UAE's premier property inspection and snagging company. Delivering international engineering standards across all seven Emirates with 40,000+ properties inspected.
            </p>
            <div className="flex space-x-5">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-green transition-all group" aria-label="Facebook">
                <i className="fab fa-facebook-f text-gray-400 group-hover:text-white"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-green transition-all group" aria-label="Instagram">
                <i className="fab fa-instagram text-gray-400 group-hover:text-white"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-green transition-all group" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in text-gray-400 group-hover:text-white"></i>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-bold mb-6 pb-2 border-b border-brand-green/30 inline-block">Quick Links</h3>
            <ul className="space-y-4">
              <li><Link href="/"><span className="text-gray-400 hover:text-brand-green transition-colors cursor-pointer flex items-center py-2 md:py-0"><i className="fas fa-chevron-right text-[10px] mr-2 text-brand-green/50"></i>Home</span></Link></li>
              <li><Link href="/about"><span className="text-gray-400 hover:text-brand-green transition-colors cursor-pointer flex items-center py-2 md:py-0"><i className="fas fa-chevron-right text-[10px] mr-2 text-brand-green/50"></i>About UrbanGrid</span></Link></li>
              <li><Link href="/services"><span className="text-gray-400 hover:text-brand-green transition-colors cursor-pointer flex items-center py-2 md:py-0"><i className="fas fa-chevron-right text-[10px] mr-2 text-brand-green/50"></i>Our Services</span></Link></li>
              <li><Link href="/blog"><span className="text-gray-400 hover:text-brand-green transition-colors cursor-pointer flex items-center py-2 md:py-0"><i className="fas fa-chevron-right text-[10px] mr-2 text-brand-green/50"></i>Inspection Insights</span></Link></li>
              <li><Link href="/contact"><span className="text-gray-400 hover:text-brand-green transition-colors cursor-pointer flex items-center py-2 md:py-0"><i className="fas fa-chevron-right text-[10px] mr-2 text-brand-green/50"></i>Book Inspection</span></Link></li>
            </ul>
          </div>
          
          {/* Locations */}
          <div>
            <h3 className="text-lg font-bold mb-6 pb-2 border-b border-brand-green/30 inline-block">Service Locations</h3>
            <ul className="grid grid-cols-1 gap-4">
              {footerLocations.map((loc) => (
                <li key={loc.name}>
                  <Link href={loc.href}>
                    <span className="text-gray-400 hover:text-brand-green transition-colors cursor-pointer flex items-center">
                      <i className="fas fa-map-marker-alt text-[10px] mr-2 text-brand-green/50"></i>
                      {loc.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold mb-6 pb-2 border-b border-brand-green/30 inline-block">Contact Us</h3>
            <div className="space-y-5">
              <div className="flex items-start group">
                <div className="w-10 h-10 rounded bg-brand-green/10 flex items-center justify-center mr-4 group-hover:bg-brand-green/20 transition-colors">
                  <i className="fas fa-map-marker-alt text-brand-green"></i>
                </div>
                <span className="text-gray-400 text-sm leading-relaxed">
                  Office 1205, Business Bay<br />Dubai, United Arab Emirates
                </span>
              </div>
              <div className="flex items-center group">
                <div className="w-10 h-10 rounded bg-brand-green/10 flex items-center justify-center mr-4 group-hover:bg-brand-green/20 transition-colors">
                  <i className="fas fa-phone text-brand-green"></i>
                </div>
                <a href="tel:+971585686852" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
                  +971 58 568 6852
                </a>
              </div>
              <div className="flex items-center group">
                <div className="w-10 h-10 rounded bg-brand-green/10 flex items-center justify-center mr-4 group-hover:bg-brand-green/20 transition-colors">
                  <i className="fas fa-envelope text-brand-green"></i>
                </div>
                <a href="mailto:info@urbangrid.ae" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
                  info@urbangrid.ae
                  info@snagging.me
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Secondary Navigation / Tags */}
        <div className="border-t border-white/5 pt-8 pb-8">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-gray-500 uppercase tracking-widest font-medium">
            <Link href="/locations/dubai/snagging-company"><span className="hover:text-brand-green cursor-pointer">Snagging Dubai</span></Link>
            <span className="text-white/10">•</span>
            <Link href="/locations/abu-dhabi/snagging-company"><span className="hover:text-brand-green cursor-pointer">Snagging Abu Dhabi</span></Link>
            <span className="text-white/10">•</span>
            <Link href="/locations/sharjah/snagging-company"><span className="hover:text-brand-green cursor-pointer">Snagging Sharjah</span></Link>
            <span className="text-white/10">•</span>
            <Link href="/locations/dubai/property-inspection"><span className="hover:text-brand-green cursor-pointer">Property Inspection Dubai</span></Link>
            <span className="text-white/10">•</span>
            <Link href="/blog"><span className="hover:text-brand-green cursor-pointer">Property Snagging Tips</span></Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-xs">
          <p>© {new Date().getFullYear()} UrbanGrid Real Estate Consultancies L.L.C. Licensed by RERA & Dubai Economy Department.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
