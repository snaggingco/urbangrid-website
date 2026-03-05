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
      className={`fixed top-0 left-0 right-0 z-50 bg-white border-b border-zinc-100 transition-all duration-300`}
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <div 
                className="text-xl font-bold text-brand-green cursor-pointer tracking-tight"
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
                    className={`text-xs font-medium tracking-wide transition-colors uppercase cursor-pointer ${
                      location === item.href ? 'text-zinc-900' : 'text-zinc-500 hover:text-zinc-900'
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
              <button 
                onClick={() => window.location.href = '/api/admin/logout'}
                className="text-xs font-medium text-brand-green border-b border-brand-green pb-0.5 hover:text-zinc-900 hover:border-zinc-900 transition-all"
              >
                Logout
              </button>
            ) : (
              <>
                {/* Desktop Dual Login Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="text-xs font-medium text-brand-green border-b border-brand-green pb-0.5 hover:text-zinc-900 hover:border-zinc-900 transition-all hidden md:flex items-center gap-1"
                    >
                      Login
                      <ChevronDown className="h-3 w-3" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 rounded-none border-zinc-100 shadow-none mt-2">
                    <DropdownMenuItem 
                      onClick={() => window.location.href = '/api/admin/login'}
                      className="text-xs font-medium uppercase tracking-wide py-3 focus:bg-zinc-50 cursor-pointer"
                    >
                      Admin Portal
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => window.location.href = 'https://arban-inspect.replit.app/login'}
                      className="text-xs font-medium uppercase tracking-wide py-3 focus:bg-zinc-50 cursor-pointer"
                    >
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
                        className="text-zinc-500 hover:text-zinc-900"
                        aria-label="Open navigation menu"
                      >
                        <Menu className="h-5 w-5" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-full sm:w-[400px] border-l border-zinc-100">
                      <nav className="flex flex-col space-y-6 mt-12">
                        {navigation.map((item) => (
                          <Link key={item.name} href={item.href}>
                            <span
                              className={`text-xs font-medium tracking-widest uppercase transition-colors cursor-pointer ${
                                location === item.href ? 'text-zinc-900' : 'text-zinc-500 hover:text-zinc-900'
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
                        <div className="border-t border-zinc-100 pt-6 mt-6">
                          <p className="text-[10px] font-semibold tracking-[0.25em] text-zinc-400 uppercase mb-4">Login Options</p>
                          <div className="flex flex-col space-y-4 items-start">
                            <button
                              className="text-xs font-medium text-brand-green border-b border-brand-green pb-0.5"
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                window.location.href = '/api/admin/login';
                              }}
                            >
                              Admin Portal
                            </button>
                            <button
                              className="text-xs font-medium text-brand-green border-b border-brand-green pb-0.5"
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                window.location.href = 'https://arban-inspect.replit.app/login';
                              }}
                            >
                              Inspector Portal
                            </button>
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