import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";

interface HeaderProps {
  isAdmin?: boolean;
}

export default function Header({ isAdmin = false }: HeaderProps) {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  const adminNavigation = [
    { name: 'Dashboard', href: '/admin' },
    { name: 'Add Blog', href: '/admin/add-blog' },
    { name: 'Manage Blogs', href: '/admin/manage-blogs' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-300 ${
        isScrolled ? 'shadow-lg' : ''
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <div className="text-2xl font-bold text-brand-green cursor-pointer">
                UrbanGrid
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <a
                  className={`text-text-grey hover:text-brand-green transition-colors font-medium ${
                    location === item.href ? 'text-brand-green' : ''
                  }`}
                >
                  {item.name}
                </a>
              </Link>
            ))}
          </nav>
          
          {/* Admin Section & Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Admin Login/Dashboard */}
            {isAdmin ? (
              <div className="hidden md:flex items-center space-x-4">
                {adminNavigation.map((item) => (
                  <Link key={item.name} href={item.href}>
                    <a
                      className={`text-text-grey hover:text-brand-green transition-colors text-sm ${
                        location === item.href ? 'text-brand-green' : ''
                      }`}
                    >
                      {item.name}
                    </a>
                  </Link>
                ))}
                <Button 
                  size="sm"
                  variant="outline"
                  onClick={() => window.location.href = '/api/logout'}
                  className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                variant="outline"
                className="hidden md:inline-flex border-brand-green text-brand-green hover:bg-brand-green hover:text-white"
                onClick={() => window.location.href = '/api/login'}
              >
                Admin Login
              </Button>
            )}
            
            {/* Mobile Menu Button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden p-2">
                  <Menu className="h-6 w-6 text-text-grey" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between pb-4 border-b">
                    <div className="text-xl font-bold text-brand-green">UrbanGrid</div>
                  </div>
                  
                  <nav className="flex flex-col space-y-4 mt-8">
                    {navigation.map((item) => (
                      <Link key={item.name} href={item.href}>
                        <a
                          className={`text-lg text-text-grey hover:text-brand-green transition-colors py-2 ${
                            location === item.href ? 'text-brand-green font-medium' : ''
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.name}
                        </a>
                      </Link>
                    ))}
                    
                    {isAdmin && (
                      <>
                        <div className="border-t pt-4 mt-4">
                          <div className="text-sm font-medium text-text-grey mb-2">Admin</div>
                          {adminNavigation.map((item) => (
                            <Link key={item.name} href={item.href}>
                              <a
                                className={`block text-text-grey hover:text-brand-green transition-colors py-2 ${
                                  location === item.href ? 'text-brand-green font-medium' : ''
                                }`}
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                {item.name}
                              </a>
                            </Link>
                          ))}
                        </div>
                        <Button 
                          variant="outline"
                          onClick={() => window.location.href = '/api/logout'}
                          className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white mt-4"
                        >
                          Logout
                        </Button>
                      </>
                    )}
                    
                    {!isAdmin && (
                      <Button
                        variant="outline"
                        className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white mt-4"
                        onClick={() => window.location.href = '/api/login'}
                      >
                        Admin Login
                      </Button>
                    )}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
