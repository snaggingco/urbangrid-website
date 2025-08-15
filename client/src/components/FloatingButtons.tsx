import React, { useState, useEffect } from "react";

export default function FloatingButtons() {
  const [showPulse, setShowPulse] = useState(true);

  // Add periodic pulse animation to draw attention
  useEffect(() => {
    const interval = setInterval(() => {
      setShowPulse(true);
      setTimeout(() => setShowPulse(false), 2000);
    }, 8000); // Pulse every 8 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Floating Action Container */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Call-to-Action Badge */}
        <div className="absolute -top-2 -left-8 transform -rotate-12 z-10">
          <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-bounce">
            FREE QUOTE
          </div>
        </div>
        
        <div className="flex flex-col space-y-4">
          {/* WhatsApp Button */}
          <div className="relative">
            <a
              href="https://wa.me/971501234567?text=Hello! I'm interested in your property inspection services."
              target="_blank"
              rel="noopener noreferrer"
              className={`floating-button bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-110 group relative overflow-hidden ${
                showPulse ? 'animate-pulse-glow' : ''
              }`}
              aria-label="Contact us on WhatsApp"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-full bg-green-400 opacity-0 group-hover:opacity-30 transition-opacity duration-300 animate-ping"></div>
              
              <i className="fab fa-whatsapp text-2xl relative z-10"></i>
              
              {/* Enhanced tooltip */}
              <div className="absolute right-full top-1/2 -translate-y-1/2 mr-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0 translate-x-2">
                <div className="bg-green-600 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap relative">
                  <span className="font-medium">Chat on WhatsApp</span>
                  <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-green-600 rotate-45"></div>
                </div>
              </div>
            </a>
            
            {/* WhatsApp online indicator */}
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
          </div>
          
          {/* Call Button */}
          <div className="relative">
            <a
              href="tel:+971501234567"
              className={`floating-button bg-brand-green hover:bg-opacity-90 text-white p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-110 group relative overflow-hidden ${
                showPulse ? 'animate-pulse-glow' : ''
              }`}
              aria-label="Call us"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-full bg-green-400 opacity-0 group-hover:opacity-30 transition-opacity duration-300 animate-ping"></div>
              
              <i className="fas fa-phone text-xl relative z-10 transform group-hover:animate-bounce"></i>
              
              {/* Enhanced tooltip */}
              <div className="absolute right-full top-1/2 -translate-y-1/2 mr-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0 translate-x-2">
                <div className="bg-brand-green text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap relative">
                  <span className="font-medium">Call us now</span>
                  <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-brand-green rotate-45"></div>
                </div>
              </div>
            </a>
            
            {/* Available indicator */}
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white animate-pulse"></div>
          </div>
        </div>
      </div>
      
      {/* Mobile-optimized version */}
      <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-2xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold text-brand-black">Need Help?</p>
              <p className="text-xs text-text-grey">Get your free quote now</p>
            </div>
            <div className="flex space-x-3">
              <a
                href="https://wa.me/971501234567?text=Hello! I'm interested in your property inspection services."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
                aria-label="Contact us on WhatsApp"
              >
                <i className="fab fa-whatsapp text-lg"></i>
              </a>
              <a
                href="tel:+971501234567"
                className="bg-brand-green hover:bg-opacity-90 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
                aria-label="Call us"
              >
                <i className="fas fa-phone text-lg"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
