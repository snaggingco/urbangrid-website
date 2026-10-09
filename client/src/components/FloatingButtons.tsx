import { useEffect, useRef, useState, lazy, Suspense, startTransition } from "react";
import { MessageCircle, Phone, ArrowUpRight } from "lucide-react";
import { registerLenaOpenHandler } from "@/lib/lenaStore";

const ChatWindow = lazy(() => import("@/components/ChatWidget"));
export default function FloatingButtons() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMounted, setChatMounted] = useState(false);
  const [initialMessage, setInitialMessage] = useState<string | undefined>();
  const [initialMessageKey, setInitialMessageKey] = useState(0);
  const desktopTrigger = useRef<HTMLButtonElement>(null);
  const mobileTrigger = useRef<HTMLButtonElement>(null);
  const focusReturnTarget = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isChatOpen) startTransition(() => setChatMounted(true));
  }, [isChatOpen]);

  function openChat(message?: string, trigger?: HTMLElement | null) {
    if (trigger) focusReturnTarget.current = trigger;
    setInitialMessage(message);
    if (message) setInitialMessageKey((key) => key + 1);
    setIsChatOpen(true);
  }

  function closeChat() {
    setIsChatOpen(false);
    window.setTimeout(() => focusReturnTarget.current?.focus(), 0);
  }

  useEffect(() => {
    return registerLenaOpenHandler((message) => {
      openChat(message, document.activeElement instanceof HTMLElement ? document.activeElement : null);
    });
  }, []);

  return (
    <>
      <div data-analytics-region="floating_desktop" className="hidden md:block fixed bottom-6 right-6 z-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-[10px] font-bold tracking-widest uppercase text-brand-green bg-white px-2.5 py-1 rounded-full shadow border border-brand-green/25 select-none">
              Nova AI
            </span>
            <button
              ref={desktopTrigger}
              type="button"
              onClick={(event) => openChat(undefined, event.currentTarget)}
              className="bg-brand-green hover:bg-opacity-90 text-white w-14 h-14 rounded-full shadow-xl transition-transform duration-200 hover:scale-105 flex items-center justify-center"
              aria-label="Open UrbanGrid AI Assistant"
              aria-expanded={isChatOpen}
            >
              <MessageCircle size={22} aria-hidden="true" />
            </button>
          </div>
          <a href="/contact"
            className="floating-button-desktop bg-white border border-zinc-200 text-brand-green w-14 h-14 rounded-full shadow-lg transition-transform duration-200 hover:scale-105 flex items-center justify-center"
            aria-label="Send an enquiry">
            <ArrowUpRight size={20} aria-hidden="true" />
          </a>
          <a href="tel:+447436597890"
            className="floating-button-desktop bg-brand-green hover:bg-opacity-90 text-white w-14 h-14 rounded-full shadow-lg transition-transform duration-200 hover:scale-105 flex items-center justify-center gtm-call-button"
            aria-label="Call UrbanGrid">
            <Phone size={20} aria-hidden="true" />
          </a>
        </div>
      </div>

      <div data-analytics-region="floating_mobile"
          className={`fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom))] left-4 right-4 z-50 md:hidden ${isChatOpen ? "hidden" : ""}`}>
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex-1 pr-3">
                 <p className="text-[13px] font-semibold text-brand-black">Need a custom quote?</p>
                 <p className="text-[11px] text-gray-600 leading-tight">Enquire or call UrbanGrid UK</p>
              </div>
              <div className="flex items-center space-x-2.5">
                <button ref={mobileTrigger} type="button"
                  onClick={(event) => openChat(undefined, event.currentTarget)}
                  className="bg-brand-green text-white w-11 h-11 rounded-full shadow-lg transition-transform duration-200 hover:scale-105 flex items-center justify-center"
                  aria-label="Open UrbanGrid AI Assistant" aria-expanded={isChatOpen}>
                  <MessageCircle size={19} aria-hidden="true" />
                </button>
                <a href="/contact"
                   className="bg-white border border-zinc-200 text-brand-green w-11 h-11 rounded-full shadow-lg transition-transform duration-200 hover:scale-105 flex items-center justify-center"
                   aria-label="Send an enquiry">
                   <ArrowUpRight size={18} aria-hidden="true" />
                </a>
                 <a href="tel:+447436597890"
                  className="bg-brand-green hover:bg-opacity-90 text-white w-11 h-11 rounded-full shadow-lg transition-transform duration-200 hover:scale-105 flex items-center justify-center gtm-call-button"
                  aria-label="Call UrbanGrid">
                   <Phone size={17} aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>

      {chatMounted && (
        <Suspense fallback={isChatOpen ? (
          <div role="status" aria-live="polite"
            className="fixed z-[60] bottom-4 right-4 md:right-24 w-[calc(100vw-2rem)] max-w-sm rounded-2xl border border-gray-200 bg-white p-5 shadow-xl text-sm text-gray-700">
            Opening UrbanGrid AI Assistant…
          </div>
        ) : null}>
          <ChatWindow
            isOpen={isChatOpen}
            onClose={closeChat}
            initialMessage={initialMessage}
            initialMessageKey={initialMessageKey}
            onInitialMessageConsumed={() => setInitialMessage(undefined)}
          />
        </Suspense>
      )}
    </>
  );
}