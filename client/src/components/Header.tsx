import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu, ChevronDown, Shield, Search } from "lucide-react";

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
    { name: 'Broker Referrals', href: '/broker-referrals' },
    { name: 'Career', href: '/careers' },
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
                  <span
                    className={`text-text-grey hover:text-brand-green transition-colors font-medium cursor-pointer ${
                      location === item.href ? 'text-brand-green' : ''
                    }`}
                    onClick={() => window.scrollTo(0, 0)}
                  >
                    {item.name}
                  </span>
                </Link>
              ))}
            </nav>
          )}
          
          {/* Admin Section */}
          <div className="flex items-center space-x-4">
            {/* Login/Logout Section */}
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
                {/* Desktop Dual Login Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white hidden md:flex items-center gap-2"
                    >
                      Login
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem 
                      onClick={() => window.location.href = '/api/admin/login'}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Shield className="h-4 w-4 text-brand-green" />
                      Admin Portal
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => window.location.href = '/inspector/login'}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Search className="h-4 w-4 text-brand-green" />
                      Inspector Portal
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                {/* Mobile menu - only show when not admin */}
                <div className="md:hidden">
                  <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                    <SheetTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-text-grey hover:text-brand-green"
                        aria-label="Open navigation menu"
                      >
                        <Menu className="h-5 w-5" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                      <nav className="flex flex-col space-y-4 mt-8">
                        {navigation.map((item) => (
                          <Link key={item.name} href={item.href}>
                            <span
                              className={`block py-2 px-3 text-lg text-text-grey hover:text-brand-green transition-colors cursor-pointer ${
                                location === item.href ? 'text-brand-green' : ''
                              }`}
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                window.scrollTo(0, 0);
                              }}
                            >
                              {item.name}
                            </span>
                          </Link>
                        ))}
                        
                        {/* Mobile Login Options */}
                        <div className="border-t pt-4 mt-4">
                          <p className="text-sm font-medium text-text-grey mb-3">Login Options</p>
                          <div className="space-y-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full border-brand-green text-brand-green hover:bg-brand-green hover:text-white flex items-center gap-2"
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                window.location.href = '/api/admin/login';
                              }}
                            >
                              <Shield className="h-4 w-4" />
                              Admin Portal
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full border-brand-green text-brand-green hover:bg-brand-green hover:text-white flex items-center gap-2"
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                window.location.href = '/inspector/login';
                              }}
                            >
                              <Search className="h-4 w-4" />
                              Inspector Portal
                            </Button>
                          </div>
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