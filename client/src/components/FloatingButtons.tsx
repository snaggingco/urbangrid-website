import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { trackConversion } from "@/lib/analytics";
import ChatWindow from "@/components/ChatWidget";
import { registerLenaOpenHandler } from "@/lib/lenaStore";

export default function FloatingButtons() {
  const [showPulse, setShowPulse] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [hasNotification, setHasNotification] = useState(false);
  const [initialMessage, setInitialMessage] = useState<string | undefined>();

  useEffect(() => {
    const interval = setInterval(() => {
      setShowPulse(true);
      setTimeout(() => setShowPulse(false), 2000);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isChatOpen) setHasNotification(true);
    }, 8000);
    return () => clearTimeout(timer);
  }, [isChatOpen]);

  // Register the hero bar handler so HeroChatBar can open Lena with a pre-sent message
  useEffect(() => {
    const unregister = registerLenaOpenHandler((msg) => {
      setInitialMessage(msg);
      setIsChatOpen(true);
      setHasNotification(false);
    });
    return unregister;
  }, []);

  // Open Lena once at 50 % scroll depth — fires exactly one time per session
  useEffect(() => {
    if (sessionStorage.getItem("lena_auto_opened")) return;
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const total =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      if (total > 0 && (scrolled / total) * 100 >= 50) {
        // Remove listener immediately so closing and scrolling more never re-opens
        window.removeEventListener("scroll", handleScroll);
        sessionStorage.setItem("lena_auto_opened", "1");
        setIsChatOpen(true);
        setHasNotification(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function openChat() {
    setIsChatOpen(true);
    setHasNotification(false);
  }

  return (
    <>
      {/* ── Desktop ── */}
      <div className="hidden md:block fixed bottom-6 right-6 z-50">
        <div className="flex flex-col items-center space-y-4">

          {/* Lena AI button + label */}
          <div className="flex flex-col items-center gap-1.5">
            {/* "Lena AI" label */}
            <span className="text-[10px] font-bold tracking-widest uppercase text-brand-green bg-white px-2.5 py-1 rounded-full shadow border border-brand-green/25 select-none">
              Lena AI
            </span>

            <div className="relative">
              <button
                onClick={openChat}
                className={`relative bg-brand-green hover:bg-opacity-90 text-white w-14 h-14 rounded-full shadow-xl transition-all duration-300 hover:scale-110 group flex items-center justify-center ${
                  showPulse ? "animate-pulse-glow-desktop" : ""
                }`}
                aria-label="Chat with Lena AI"
              >
                <MessageCircle size={22} />

                {/* notification dot */}
                {hasNotification && !isChatOpen && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                )}

                {/* tooltip */}
                <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0 pointer-events-none">
                  <div className="bg-brand-green text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap relative">
                    <span className="font-medium">Chat with Lena</span>
                    <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-brand-green rotate-45" />
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* WhatsApp */}
          <div className="relative">
            <a
              href="https://wa.me/971567427634?text=Hello%20UrbanGrid%2C%20I%27m%20interested%20in%20your%20property%20inspection%20services.%20Please%20provide%20me%20with%20more%20information."
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackConversion("whatsapp_click")}
              className={`floating-button-desktop bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110 group flex items-center justify-center ${
                showPulse ? "animate-pulse-glow-desktop" : ""
              }`}
              aria-label="Contact us on WhatsApp"
            >
              <i className="fab fa-whatsapp text-2xl" />
              <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0 pointer-events-none">
                <div className="bg-green-600 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap relative">
                  <span className="font-medium">Chat on WhatsApp</span>
                  <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-green-600 rotate-45" />
                </div>
              </div>
            </a>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
          </div>

          {/* Call */}
          <div className="relative">
            <a
              href="tel:+971567427634"
              onClick={() => trackConversion("call_click")}
              className={`floating-button-desktop bg-brand-green hover:bg-opacity-90 text-white w-14 h-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110 group flex items-center justify-center gtm-call-button ${
                showPulse ? "animate-pulse-glow-desktop" : ""
              }`}
              aria-label="Call us"
            >
              <i className="fas fa-phone text-xl" />
              <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0 pointer-events-none">
                <div className="bg-brand-green text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap relative">
                  <span className="font-medium">Call us now</span>
                  <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-brand-green rotate-45" />
                </div>
              </div>
            </a>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white animate-pulse" />
          </div>
        </div>
      </div>

      {/* ── Mobile bar ── */}
      <div className="fixed bottom-3 left-4 right-4 z-50 md:hidden">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-2xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex-1 pr-3">
              <p className="text-[13px] font-semibold text-brand-black">Need Help?</p>
              <p className="text-[11px] text-text-grey leading-tight">Call or chat with Lena</p>
            </div>
            <div className="flex items-center space-x-2.5">
              {/* Lena (mobile) */}
              <button
                onClick={openChat}
                className="relative bg-brand-green text-white w-10 h-10 rounded-full shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center"
                aria-label="Chat with Lena AI"
              >
                <MessageCircle size={18} />
                {hasNotification && !isChatOpen && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                )}
              </button>

              <a
                href="https://wa.me/971567427634?text=Hello%20UrbanGrid%2C%20I%27m%20interested%20in%20your%20property%20inspection%20services.%20Please%20provide%20me%20with%20more%20information."
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackConversion("whatsapp_click")}
                className="bg-green-500 hover:bg-green-600 text-white w-10 h-10 rounded-full shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center"
                aria-label="Contact us on WhatsApp"
              >
                <i className="fab fa-whatsapp text-base" />
              </a>

              <a
                href="tel:+971567427634"
                onClick={() => trackConversion("call_click")}
                className="bg-brand-green hover:bg-opacity-90 text-white w-10 h-10 rounded-full shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gtm-call-button"
                aria-label="Call us"
              >
                <i className="fas fa-phone text-base" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Chat window (spring animation, rendered above everything) ── */}
      <ChatWindow
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        initialMessage={initialMessage}
        onInitialMessageConsumed={() => setInitialMessage(undefined)}
      />
    </>
  );
}
