import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

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
              <div 
                className="text-2xl font-bold text-brand-green cursor-pointer"
                onClick={() => window.scrollTo(0, 0)}
              >
                UrbanGrid
              </div>
            </Link>
          </div>

          {/* Show navigation only when not admin */}
          {!isAdmin && (
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <a
                    className={`text-text-grey hover:text-brand-green transition-colors font-medium ${
                      location === item.href ? 'text-brand-green' : ''
                    }`}
                    onClick={() => window.scrollTo(0, 0)}
                  >
                    {item.name}
                  </a>
                </Link>
              ))}
            </nav>
          )}
          
          {/* Admin Section */}
          <div className="flex items-center space-x-4">
            {/* Admin Login/Logout */}
            {isAdmin ? (
              <Button 
                size="sm"
                variant="outline"
                onClick={() => window.location.href = '/api/admin/logout'}
                className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white"
              >
                Logout
              </Button>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white hidden md:block"
                  onClick={() => window.location.href = '/api/admin/login'}
                >
                  Admin Login
                </Button>
                
                {/* Mobile menu - only show when not admin */}
                <div className="md:hidden">
                  <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                    <SheetTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-text-grey hover:text-brand-green"
                      >
                        <Menu className="h-5 w-5" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                      <nav className="flex flex-col space-y-4 mt-8">
                        {navigation.map((item) => (
                          <Link key={item.name} href={item.href}>
                            <a
                              className={`block py-2 px-3 text-lg text-text-grey hover:text-brand-green transition-colors ${
                                location === item.href ? 'text-brand-green' : ''
                              }`}
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                window.scrollTo(0, 0);
                              }}
                            >
                              {item.name}
                            </a>
                          </Link>
                        ))}
                        
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white mt-4"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            window.location.href = '/api/admin/login';
                          }}
                        >
                          Admin Login
                        </Button>
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