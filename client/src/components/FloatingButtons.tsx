import React from "react";

export default function FloatingButtons() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3">
      {/* WhatsApp Button */}
      <a
        href="https://wa.me/971501234567?text=Hello! I'm interested in your property inspection services."
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 group"
        aria-label="Contact us on WhatsApp"
      >
        <i className="fab fa-whatsapp text-2xl"></i>
        <span className="absolute right-full top-1/2 -translate-y-1/2 mr-3 bg-black text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Chat on WhatsApp
        </span>
      </a>
      
      {/* Call Button */}
      <a
        href="tel:+971501234567"
        className="bg-brand-green hover:bg-opacity-90 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 group"
        aria-label="Call us"
      >
        <i className="fas fa-phone text-xl"></i>
        <span className="absolute right-full top-1/2 -translate-y-1/2 mr-3 bg-black text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Call us now
        </span>
      </a>
    </div>
  );
}
