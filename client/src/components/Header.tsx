import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu, ChevronDown } from "lucide-react";

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
      setIsScrolled(window.scrollY > 80);
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 h-20 flex items-center ${
        isScrolled 
          ? 'bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-800' 
          : 'bg-transparent border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <div 
                className="text-2xl font-black text-white cursor-pointer tracking-tighter uppercase"
                onClick={() => window.scrollTo(0, 0)}
              >
                UrbanGrid
              </div>
            </Link>
          </div>

          {/* Show navigation only when not admin */}
          {!isAdmin && (
            <nav className="hidden md:flex items-center space-x-10">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <span
                    className={`text-[11px] font-semibold tracking-[0.2em] transition-all uppercase cursor-pointer ${
                      location === item.href 
                        ? 'text-white' 
                        : 'text-white/60 hover:text-white'
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
          <div className="flex items-center space-x-6">
            {/* Login/Logout Section */}
            {isAdmin ? (
              <button 
                onClick={() => window.location.href = '/api/admin/logout'}
                className="text-[11px] font-bold tracking-widest uppercase text-brand-green border-b border-brand-green/30 pb-0.5 hover:text-white hover:border-white transition-all"
              >
                Logout
              </button>
            ) : (
              <>
                {/* Desktop Dual Login Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="text-[11px] font-bold tracking-widest uppercase text-brand-green border-b border-brand-green/30 pb-0.5 hover:text-white hover:border-white transition-all hidden md:flex items-center gap-1.5"
                    >
                      Login
                      <ChevronDown className="h-3 w-3" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-none border-zinc-800 bg-zinc-950 text-white shadow-2xl mt-4 p-0">
                    <DropdownMenuItem 
                      onClick={() => window.location.href = '/api/admin/login'}
                      className="text-[10px] font-bold uppercase tracking-[0.2em] py-4 px-6 focus:bg-zinc-900 focus:text-brand-green cursor-pointer border-b border-zinc-900/50"
                    >
                      Admin Portal
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => window.location.href = 'https://arban-inspect.replit.app/login'}
                      className="text-[10px] font-bold uppercase tracking-[0.2em] py-4 px-6 focus:bg-zinc-900 focus:text-brand-green cursor-pointer"
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
                        className="text-white hover:bg-zinc-900"
                        aria-label="Open navigation menu"
                      >
                        <Menu className="h-6 w-6" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-full sm:w-[400px] bg-zinc-950 border-l border-zinc-800 p-0">
                      <div className="flex flex-col h-full px-10 py-16">
                        <div className="text-2xl font-black text-white tracking-tighter uppercase mb-16">
                          UrbanGrid
                        </div>
                        <nav className="flex flex-col space-y-8">
                          {navigation.map((item) => (
                            <Link key={item.name} href={item.href}>
                              <span
                                className={`text-xs font-bold tracking-[0.3em] uppercase transition-colors cursor-pointer ${
                                  location === item.href ? 'text-brand-green' : 'text-zinc-400 hover:text-white'
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
                          <div className="border-t border-zinc-900 pt-10 mt-6">
                            <p className="text-[10px] font-bold tracking-[0.3em] text-zinc-600 uppercase mb-8">Access Portals</p>
                            <div className="flex flex-col space-y-6">
                              <button
                                className="text-xs font-bold tracking-[0.2em] uppercase text-brand-green text-left"
                                onClick={() => {
                                  setIsMobileMenuOpen(false);
                                  window.location.href = '/api/admin/login';
                                }}
                              >
                                Admin Portal
                              </button>
                              <button
                                className="text-xs font-bold tracking-[0.2em] uppercase text-brand-green text-left"
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
                      </div>
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