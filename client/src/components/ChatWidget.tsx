import { useState, useRef, useEffect } from "react";
import { X, MessageCircle, Send, Minimize2, CheckCircle } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  formType?: "booking" | "fitout";
  formSubmitted?: boolean;
}

const WELCOME_MESSAGE: Message = {
  role: "assistant",
  content: "Hi! I'm Nora from UrbanGrid 👋 I'm here to help you with property inspections, snagging, and interior fit-out services. What can I help you with today?",
};

const QUICK_REPLIES = [
  "How much does a snagging inspection cost?",
  "What areas do you cover?",
  "I want to book an inspection",
  "Tell me about fit-out services",
];

const EMIRATES = [
  "Dubai", "Abu Dhabi", "Sharjah", "Ajman",
  "Ras Al Khaimah", "Fujairah", "Umm Al Quwain",
];

const PROPERTY_TYPES = [
  "Apartment", "Villa", "Townhouse", "Penthouse",
  "Office", "Retail", "Warehouse", "Other",
];

// Detect and strip [SHOW_FORM:type] tags from a message
function parseMessage(content: string): { text: string; formType?: "booking" | "fitout" } {
  const match = content.match(/\[SHOW_FORM:(booking|fitout)\]/i);
  if (match) {
    const text = content.replace(/\[SHOW_FORM:(booking|fitout)\]/gi, "").trim();
    return { text, formType: match[1].toLowerCase() as "booking" | "fitout" };
  }
  return { text: content };
}

// ── Booking form ──────────────────────────────────────────────────────────────
function BookingForm({ onSubmit }: { onSubmit: (summary: string) => void }) {
  const [fields, setFields] = useState({
    name: "", phone: "", email: "",
    propertyType: "", size: "", emirate: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function set(k: keyof typeof fields, v: string) {
    setFields((p) => ({ ...p, [k]: v }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const summary =
      `My details: Name: ${fields.name}, Phone: ${fields.phone}, Email: ${fields.email}, ` +
      `Property type: ${fields.propertyType}, Size: ${fields.size} sq.ft, Location: ${fields.emirate}.`;
    setSubmitted(true);
    onSubmit(summary);
  }

  const complete =
    fields.name && fields.phone && fields.email &&
    fields.propertyType && fields.size && fields.emirate;

  if (submitted) return null;

  return (
    <form onSubmit={handleSubmit} className="mt-2 bg-green-50 border border-green-200 rounded-xl p-3 space-y-2">
      <p className="text-xs font-semibold text-brand-green uppercase tracking-wide mb-1">Booking Details</p>
      <input
        required
        placeholder="Full name *"
        value={fields.name}
        onChange={(e) => set("name", e.target.value)}
        className="w-full text-sm px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-brand-green bg-white"
      />
      <input
        required
        type="tel"
        placeholder="Phone number *"
        value={fields.phone}
        onChange={(e) => set("phone", e.target.value)}
        className="w-full text-sm px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-brand-green bg-white"
      />
      <input
        required
        type="email"
        placeholder="Email address *"
        value={fields.email}
        onChange={(e) => set("email", e.target.value)}
        className="w-full text-sm px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-brand-green bg-white"
      />
      <div className="grid grid-cols-2 gap-2">
        <select
          required
          value={fields.propertyType}
          onChange={(e) => set("propertyType", e.target.value)}
          className="text-sm px-2 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-brand-green bg-white text-gray-700"
        >
          <option value="">Property type *</option>
          {PROPERTY_TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
        <input
          required
          type="number"
          min="1"
          placeholder="Size (sq.ft) *"
          value={fields.size}
          onChange={(e) => set("size", e.target.value)}
          className="text-sm px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-brand-green bg-white"
        />
      </div>
      <select
        required
        value={fields.emirate}
        onChange={(e) => set("emirate", e.target.value)}
        className="w-full text-sm px-2 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-brand-green bg-white text-gray-700"
      >
        <option value="">Select emirate *</option>
        {EMIRATES.map((e) => <option key={e}>{e}</option>)}
      </select>
      <button
        type="submit"
        disabled={!complete}
        className="w-full bg-brand-green text-white text-sm font-medium py-2 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Submit Booking Request
      </button>
    </form>
  );
}

// ── Fit-out form ──────────────────────────────────────────────────────────────
function FitoutForm({ onSubmit }: { onSubmit: (summary: string) => void }) {
  const [fields, setFields] = useState({ name: "", phone: "", email: "", address: "" });
  const [submitted, setSubmitted] = useState(false);

  function set(k: keyof typeof fields, v: string) {
    setFields((p) => ({ ...p, [k]: v }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const summary =
      `Fit-out enquiry — Name: ${fields.name}, Phone: ${fields.phone}, ` +
      `Email: ${fields.email}, Property address: ${fields.address}.`;
    setSubmitted(true);
    onSubmit(summary);
  }

  const complete = fields.name && fields.phone && fields.email && fields.address;

  if (submitted) return null;

  return (
    <form onSubmit={handleSubmit} className="mt-2 bg-green-50 border border-green-200 rounded-xl p-3 space-y-2">
      <p className="text-xs font-semibold text-brand-green uppercase tracking-wide mb-1">Fit-Out Enquiry</p>
      <input
        required
        placeholder="Full name *"
        value={fields.name}
        onChange={(e) => set("name", e.target.value)}
        className="w-full text-sm px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-brand-green bg-white"
      />
      <input
        required
        type="tel"
        placeholder="Phone number *"
        value={fields.phone}
        onChange={(e) => set("phone", e.target.value)}
        className="w-full text-sm px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-brand-green bg-white"
      />
      <input
        required
        type="email"
        placeholder="Email address *"
        value={fields.email}
        onChange={(e) => set("email", e.target.value)}
        className="w-full text-sm px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-brand-green bg-white"
      />
      <input
        required
        placeholder="Property address / location *"
        value={fields.address}
        onChange={(e) => set("address", e.target.value)}
        className="w-full text-sm px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-brand-green bg-white"
      />
      <button
        type="submit"
        disabled={!complete}
        className="w-full bg-brand-green text-white text-sm font-medium py-2 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Request Site Visit
      </button>
    </form>
  );
}

// ── Confirmation card ─────────────────────────────────────────────────────────
function ConfirmationCard({ type }: { type: "booking" | "fitout" }) {
  return (
    <div className="mt-2 bg-green-50 border border-green-200 rounded-xl p-3 flex items-start gap-2">
      <CheckCircle size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
      <p className="text-sm text-green-800">
        {type === "booking"
          ? "Booking request received! Our team will call you within a few hours to confirm."
          : "Enquiry received! Our fit-out team will reach out to schedule a free site visit."}
      </p>
    </div>
  );
}

// ── Main widget ───────────────────────────────────────────────────────────────
export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [hasNotification, setHasNotification] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) setHasNotification(true);
    }, 8000);
    return () => clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setHasNotification(false);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  async function sendMessage(text: string) {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: text.trim() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);
    setShowQuickReplies(false);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) throw new Error("Chat request failed");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let rawContent = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.content) {
              rawContent += data.content;
              const { text } = parseMessage(rawContent);
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: "assistant", content: rawContent };
                return updated;
              });
            }
          } catch {}
        }
      }

      // Once streaming is done, finalise with parsed form type
      const { text: finalText, formType } = parseMessage(rawContent);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: rawContent,
          formType,
        };
        return updated;
      });
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I'm having trouble connecting right now. Please call us on +971 585 686 852 or email info@urbangrid.ae.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleFormSubmit(msgIndex: number, summary: string) {
    // Mark the message's form as submitted so the form hides
    setMessages((prev) =>
      prev.map((m, i) => (i === msgIndex ? { ...m, formSubmitted: true } : m))
    );
    // Send the collected details as a user message so Nora can respond
    sendMessage(summary);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  return (
    <>
      {/* Floating chat button */}
      <div className="fixed bottom-24 right-6 z-50 md:bottom-28">
        <button
          onClick={() => { setIsOpen(true); setIsMinimized(false); }}
          className={`relative bg-brand-green hover:bg-opacity-90 text-white w-14 h-14 rounded-full shadow-xl transition-all duration-300 hover:scale-110 items-center justify-center ${isOpen ? "hidden" : "flex"}`}
          aria-label="Open chat"
        >
          <MessageCircle size={24} />
          {hasNotification && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
          )}
        </button>
      </div>

      {/* Chat window */}
      {isOpen && (
        <div
          className={`fixed z-50 right-4 bottom-4 md:right-6 md:bottom-6 w-[calc(100vw-2rem)] max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden transition-all duration-300 ${
            isMinimized ? "h-14" : "h-[560px]"
          }`}
        >
          {/* Header */}
          <div className="bg-brand-green text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">N</div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-brand-green" />
              </div>
              <div>
                <p className="font-semibold text-sm">Nora — UrbanGrid</p>
                <p className="text-xs text-green-200">Property Inspection Expert</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                aria-label={isMinimized ? "Expand" : "Minimize"}
              >
                <Minimize2 size={16} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Close chat"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages area */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50">
                {messages.map((msg, i) => {
                  const { text: displayText, formType } = parseMessage(msg.content);
                  const isAssistant = msg.role === "assistant";

                  return (
                    <div key={i} className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}>
                      {isAssistant && (
                        <div className="w-7 h-7 rounded-full bg-brand-green text-white flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0 mt-0.5">
                          N
                        </div>
                      )}
                      <div className={`max-w-[85%] ${isAssistant ? "" : ""}`}>
                        {/* Bubble */}
                        {(displayText || !isAssistant) && (
                          <div
                            className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                              isAssistant
                                ? "bg-white text-gray-800 border border-gray-200 rounded-tl-sm shadow-sm"
                                : "bg-brand-green text-white rounded-tr-sm"
                            }`}
                          >
                            {displayText || (
                              <span className="flex gap-1 items-center py-0.5">
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                              </span>
                            )}
                          </div>
                        )}

                        {/* Inline form or confirmation */}
                        {isAssistant && formType && (
                          msg.formSubmitted ? (
                            <ConfirmationCard type={formType} />
                          ) : formType === "booking" ? (
                            <BookingForm onSubmit={(s) => handleFormSubmit(i, s)} />
                          ) : (
                            <FitoutForm onSubmit={(s) => handleFormSubmit(i, s)} />
                          )
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Typing indicator */}
                {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                  <div className="flex justify-start">
                    <div className="w-7 h-7 rounded-full bg-brand-green text-white flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0">N</div>
                    <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm">
                      <span className="flex gap-1 items-center">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </span>
                    </div>
                  </div>
                )}

                {/* Quick replies */}
                {showQuickReplies && messages.length === 1 && (
                  <div className="pt-1 space-y-2">
                    {QUICK_REPLIES.map((reply) => (
                      <button
                        key={reply}
                        onClick={() => sendMessage(reply)}
                        className="block w-full text-left text-sm px-3 py-2 rounded-xl border border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition-colors duration-200"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form
                onSubmit={handleSubmit}
                className="border-t border-gray-200 px-3 py-2.5 flex items-center gap-2 bg-white flex-shrink-0"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about our inspection services..."
                  className="flex-1 text-sm px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-brand-green bg-gray-50 placeholder-gray-400"
                  disabled={isLoading}
                  maxLength={500}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="bg-brand-green text-white w-9 h-9 rounded-xl flex items-center justify-center hover:bg-opacity-90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                  aria-label="Send message"
                >
                  <Send size={16} />
                </button>
              </form>

              {/* Footer */}
              <div className="px-3 py-1.5 bg-white border-t border-gray-100 text-center flex-shrink-0">
                <p className="text-[10px] text-gray-400">
                  Powered by UrbanGrid AI · <a href="/contact" className="underline hover:text-brand-green">Book an inspection</a>
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
