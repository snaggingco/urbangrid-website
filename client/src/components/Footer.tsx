import { Link } from "wouter";

export default function Footer() {
  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Our Services', href: '/services' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  const services = [
    { name: 'New Build Snagging', href: '/services/new-build-snagging' },
    { name: 'Post Renovation Inspection', href: '/services/post-renovation-inspection' },
    { name: 'DLP Snagging', href: '/services/dlp-snagging' },
    { name: 'Move-in/Move-out', href: '/services/move-in-move-out' },
    { name: 'Secondary Market', href: '/services/secondary-market' },
    { name: 'Developer Projects', href: '/services/developer-projects' },
  ];

  return (
    <footer className="bg-brand-black text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="text-2xl font-bold text-white mb-4">UrbanGrid</div>
            <p className="text-gray-300 mb-4">
              Professional property inspection and snagging services across the UAE. Your trusted partner for quality assurance and peace of mind.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a 
                href="#" 
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a 
                href="#" 
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href}>
                    <a className="text-gray-300 hover:text-white transition-colors">
                      {link.name}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2 text-sm">
              {services.map((service) => (
                <li key={service.name}>
                  <Link href={service.href}>
                    <a className="text-gray-300 hover:text-white transition-colors">
                      {service.name}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start">
                <i className="fas fa-map-marker-alt text-brand-green mr-2 mt-1"></i>
                <span className="text-gray-300">
                  Office 1205, Business Bay<br />Dubai, UAE
                </span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-phone text-brand-green mr-2"></i>
                <a 
                  href="tel:+971501234567" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  +971 50 123 4567
                </a>
              </div>
              <div className="flex items-center">
                <i className="fas fa-envelope text-brand-green mr-2"></i>
                <a 
                  href="mailto:info@urbangrid.ae" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  info@urbangrid.ae
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300 text-sm">
            © 2024 UrbanGrid Property Inspection Services. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
