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
      {/* Desktop Floating Buttons - Clean & Minimal */}
      <div className="hidden md:block fixed bottom-6 right-6 z-50">
        <div className="flex flex-col space-y-3">
          {/* WhatsApp Button */}
          <a
            href="https://wa.me/971501234567?text=Hello! I'm interested in your property inspection services."
            target="_blank"
            rel="noopener noreferrer"
            className="floating-button-desktop bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105 group"
            aria-label="Contact us on WhatsApp"
          >
            <i className="fab fa-whatsapp text-2xl"></i>
            
            {/* Simple tooltip */}
            <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-black text-white text-sm px-3 py-1 rounded whitespace-nowrap">
                Chat on WhatsApp
              </div>
            </div>
          </a>
          
          {/* Call Button */}
          <a
            href="tel:+971501234567"
            className="floating-button-desktop bg-brand-green hover:bg-opacity-90 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105 group"
            aria-label="Call us"
          >
            <i className="fas fa-phone text-xl"></i>
            
            {/* Simple tooltip */}
            <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-black text-white text-sm px-3 py-1 rounded whitespace-nowrap">
                Call us now
              </div>
            </div>
          </a>
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
