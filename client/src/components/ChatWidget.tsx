import { useState, useRef, useEffect } from "react";
import { X, Send, Minimize2, CheckCircle, Loader2, CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

interface Message {
  role: "user" | "assistant";
  content: string;
  formType?: "booking" | "fitout";
  formSubmitted?: boolean;
}

const WELCOME_MESSAGE: Message = {
  role: "assistant",
  content:
    "Hi! I'm Lena AI from UrbanGrid 👋 I'm here to help you with property inspections, snagging, and interior fit-out services. What can I help you with today?",
};

const QUICK_REPLIES = [
  "How much does a snagging inspection cost?",
  "What areas do you cover?",
  "I want to book an inspection",
  "Tell me about fit-out services",
];

const PROPERTY_TYPES = [
  "Apartment", "Villa", "Townhouse", "Penthouse",
  "Office", "Retail", "Warehouse", "Other",
];

function parseMessage(content: string): { text: string; formType?: "booking" | "fitout" } {
  const match = content.match(/\[SHOW_FORM:(booking|fitout)\]/i);
  if (match) {
    const text = content.replace(/\[SHOW_FORM:(booking|fitout)\]/gi, "").trim();
    return { text, formType: match[1].toLowerCase() as "booking" | "fitout" };
  }
  return { text: content };
}

/* Lightweight markdown-to-JSX: converts **bold** into <strong> elements.
   Keeps everything else as plain text (no headings, links, etc.). */
function renderMarkdown(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const segments = text.split(/(\*\*)/g);
  let inBold = false;
  let buffer = "";

  for (const seg of segments) {
    if (seg === "**") {
      if (buffer) {
        parts.push(inBold ? <strong key={parts.length}>{buffer}</strong> : buffer);
        buffer = "";
      }
      inBold = !inBold;
    } else {
      buffer += seg;
    }
  }
  if (buffer) {
    parts.push(inBold ? <strong key={parts.length}>{buffer}</strong> : buffer);
  }
  return parts;
}

/* Detect Lena's pricing breakdown and split it out as a structured table.
   Handles markdown bold, •/-/* bullets, and plain text formats. */
function parsePricingTable(text: string): { cleanText: string; rows: { label: string; value: string }[]; addOn?: string } | null {
  // Flexible header matching — Lena uses several variations
  const hasHeader = /(?:Here's the fee breakdown for|calculate your.*snagging inspection fee|FEE ESTIMATE)/i.test(text);
  if (!hasHeader) return null;

  // Strip markdown bold so regexes work on plain text; also normalise dash bullets
  const plain = text.replace(/\*\*/g, "").replace(/^- /gm, "\u2022 ");

  const rows: { label: string; value: string }[] = [];
  let addOn: string | undefined;

  const extract = (regex: RegExp, label: string) => {
    const m = plain.match(regex);
    if (m) rows.push({ label, value: m[1].trim() });
  };

  extract(/(?:\u2022\s*)?Service:\s*(.+)/im, "Service");
  extract(/(?:\u2022\s*)?Built-Up Area:\s*(.+)/im, "Built-Up Area");
  extract(/(?:\u2022\s*)?Fee \(excl\. VAT\):\s*(.+)/im, "Fee (excl. VAT)");
  extract(/(?:\u2022\s*)?VAT \(5%\):\s*(.+)/im, "VAT (5%)");
  extract(/(?:\u2022\s*)?Total \(incl\. VAT\):\s*(.+)/im, "Total (incl. VAT)");
  extract(/(?:\u2022\s*)?De[-\s]?[Ss]nagging Add-On \(incl\. 5% VAT\):\s*(.+)/im, "De-snagging Add-On (incl. VAT)");

  if (rows.length === 0) return null;

  // Strip pricing lines, header, and all markdown bold from clean text
  let cleanText = text
    .replace(/\*\*/g, "")
    .replace(/(?:\u2022\s*|-\s*)?Service:\s*.+/gim, "")
    .replace(/(?:\u2022\s*|-\s*)?Built-Up Area:\s*.+/gim, "")
    .replace(/(?:\u2022\s*|-\s*)?Fee \(excl\. VAT\):\s*.+/gim, "")
    .replace(/(?:\u2022\s*|-\s*)?VAT \(5%\):\s*.+/gim, "")
    .replace(/(?:\u2022\s*|-\s*)?Total \(incl\. VAT\):\s*.+/gim, "")
    .replace(/(?:\u2022\s*|-\s*)?De[-\s]?[Ss]nagging Add-On[^\n]*/gim, "")
    .replace(/(?:Here's the fee breakdown for your snagging inspection|calculate your.*snagging inspection fee|FEE ESTIMATE)[:.]*\n*/gim, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return { cleanText, rows };
}

// ── Booking form ──────────────────────────────────────────────────────────────
function BookingForm({ onSubmit }: { onSubmit: (summary: string) => void }) {
  const [fields, setFields] = useState({
    name: "", phone: "", email: "",
    projectName: "", projectLocation: "", propertyType: "",
    bedrooms: "", sqft: "", inspectionDate: "",
  });
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function set(k: keyof typeof fields, v: string) {
    setFields((p) => ({ ...p, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    try {
      await fetch("/api/chat/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "booking", ...fields }),
      });
    } catch {}
    const summary =
      `Booking details: Full Name: ${fields.name}, Phone: ${fields.phone}, Email: ${fields.email}, ` +
      `Project Name: ${fields.projectName || "N/A"}, Project Location: ${fields.projectLocation || "N/A"}, ` +
      `Property Type: ${fields.propertyType}, No. of Bedrooms: ${fields.bedrooms || "N/A"}, ` +
      `Built-Up Area: ${fields.sqft} sq.ft, Preferred Inspection Date/Time: ${fields.inspectionDate || "N/A"}.`;
    setSending(false);
    setSubmitted(true);
    onSubmit(summary);
  }

  const required = fields.name && fields.phone && fields.email && fields.propertyType && fields.sqft;
  if (submitted) return null;

  return (
    <form onSubmit={handleSubmit} className="mt-2 bg-green-50 border border-green-200 rounded-xl p-3 space-y-2">
      <p className="text-xs font-semibold text-brand-green uppercase tracking-wide">Inspection Booking</p>
      <input required placeholder="Full name *" value={fields.name}
        onChange={(e) => set("name", e.target.value)}
        className="w-full text-sm px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-brand-green bg-white" />
      <PhoneInput
        international
        countryCallingCodeEditable={false}
        defaultCountry="AE"
        value={fields.phone}
        onChange={(value) => set("phone", value || "")}
        placeholder="Phone number *"
        className="chat-phone-input"
      />
      <input required type="email" placeholder="Email *" value={fields.email}
        onChange={(e) => set("email", e.target.value)}
        className="w-full text-sm px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-brand-green bg-white" />
      <input placeholder="Project name (e.g. Aura Elegance)" value={fields.projectName}
        onChange={(e) => set("projectName", e.target.value)}
        className="w-full text-sm px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-brand-green bg-white" />
      <input placeholder="Project location (e.g. Dubai Silicon Oasis)" value={fields.projectLocation}
        onChange={(e) => set("projectLocation", e.target.value)}
        className="w-full text-sm px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-brand-green bg-white" />
      <div className="grid grid-cols-2 gap-2">
        <select required value={fields.propertyType} onChange={(e) => set("propertyType", e.target.value)}
          className="text-sm px-2 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-brand-green bg-white text-gray-700">
          <option value="">Property type *</option>
          {PROPERTY_TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
        <select value={fields.bedrooms} onChange={(e) => set("bedrooms", e.target.value)}
          className="text-sm px-2 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-brand-green bg-white text-gray-700">
          <option value="">No. of bedrooms</option>
          {["Studio", "1", "2", "3", "4", "5", "6+"].map((b) => <option key={b}>{b}</option>)}
        </select>
      </div>
      <input required type="number" min="1" placeholder="Built-up area (sq.ft) *" value={fields.sqft}
        onChange={(e) => set("sqft", e.target.value)}
        className="w-full text-sm px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-brand-green bg-white" />
      <Popover>
        <PopoverTrigger asChild>
          <button type="button"
            className="w-full text-sm px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-brand-green bg-white text-left flex items-center gap-2 text-gray-600 hover:bg-gray-50 transition-colors">
            <CalendarDays size={14} />
            {fields.inspectionDate
              ? fields.inspectionDate
              : "Pick inspection date"}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 z-[100]" align="start" side="top" sideOffset={8}>
          <Calendar
            mode="single"
            selected={fields.inspectionDate ? new Date(fields.inspectionDate) : undefined}
            onSelect={(date) => {
              if (date) {
                set("inspectionDate", format(date, "dd MMMM yyyy"));
              }
            }}
            disabled={(date) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return date < today;
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <button type="submit" disabled={!required || sending}
        className="w-full bg-brand-green text-white text-sm font-medium py-2 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
        {sending && <Loader2 size={14} className="animate-spin" />}
        {sending ? "Submitting…" : "Submit Booking Request"}
      </button>
    </form>
  );
}

// ── Fit-out form ──────────────────────────────────────────────────────────────
function FitoutForm({ onSubmit }: { onSubmit: (summary: string) => void }) {
  const [fields, setFields] = useState({ name: "", phone: "", email: "", address: "" });
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function set(k: keyof typeof fields, v: string) {
    setFields((p) => ({ ...p, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    try {
      await fetch("/api/chat/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "fitout", ...fields }),
      });
    } catch {}
    const summary = `Fit-out enquiry — Full Name: ${fields.name}, Phone: ${fields.phone}, Email: ${fields.email}, Property address: ${fields.address}.`;
    setSending(false);
    setSubmitted(true);
    onSubmit(summary);
  }

  const complete = fields.name && fields.phone && fields.email && fields.address;
  if (submitted) return null;

  return (
    <form onSubmit={handleSubmit} className="mt-2 bg-green-50 border border-green-200 rounded-xl p-3 space-y-2">
      <p className="text-xs font-semibold text-brand-green uppercase tracking-wide">Fit-Out Enquiry</p>
      <input required placeholder="Full name *" value={fields.name}
        onChange={(e) => set("name", e.target.value)}
        className="w-full text-sm px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-brand-green bg-white" />
      <PhoneInput
        international
        countryCallingCodeEditable={false}
        defaultCountry="AE"
        value={fields.phone}
        onChange={(value) => set("phone", value || "")}
        placeholder="Phone number *"
        className="chat-phone-input"
      />
      <input required type="email" placeholder="Email *" value={fields.email}
        onChange={(e) => set("email", e.target.value)}
        className="w-full text-sm px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-brand-green bg-white" />
      <input required placeholder="Property address / location *" value={fields.address}
        onChange={(e) => set("address", e.target.value)}
        className="w-full text-sm px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-brand-green bg-white" />
      <button type="submit" disabled={!complete || sending}
        className="w-full bg-brand-green text-white text-sm font-medium py-2 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
        {sending && <Loader2 size={14} className="animate-spin" />}
        {sending ? "Submitting…" : "Request Free Site Visit"}
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
          ? "Booking request submitted! Our team will call you within a few hours to confirm your appointment."
          : "Enquiry received! Our fit-out team will reach out to schedule a free site visit."}
      </p>
    </div>
  );
}

// ── Chat window — receives open/close state from FloatingButtons ──────────────
interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessage?: string;
  onInitialMessageConsumed?: () => void;
}

export default function ChatWindow({ isOpen, onClose, initialMessage, onInitialMessageConsumed }: ChatWindowProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sentInitialRef = useRef(false);

  // Expand whenever chat is opened
  useEffect(() => {
    if (isOpen) {
      setIsMinimized(false);
      setTimeout(() => inputRef.current?.focus(), 380);
    } else {
      sentInitialRef.current = false;
    }
  }, [isOpen]);

  // Auto-send initialMessage whenever it arrives — works whether chat was
  // already open (isOpen stays true, effect still runs) or just opened
  useEffect(() => {
    if (!isOpen || !initialMessage || sentInitialRef.current) return;
    sentInitialRef.current = true;
    onInitialMessageConsumed?.();
    // Delay slightly so spring-open animation starts first when chat was closed
    setTimeout(() => sendMessage(initialMessage), 420);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialMessage]);

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
        for (const line of chunk.split("\n")) {
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.content) {
              rawContent += data.content;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: "assistant", content: rawContent };
                return updated;
              });
            }
          } catch {}
        }
      }

      const { formType } = parseMessage(rawContent);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "assistant", content: rawContent, formType };
        return updated;
      });
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I'm having trouble connecting. Please call us on +971 585 686 852 or email info@urbangrid.ae.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleFormSubmit(msgIndex: number, summary: string) {
    setMessages((prev) =>
      prev.map((m, i) => (i === msgIndex ? { ...m, formSubmitted: true } : m))
    );
    sendMessage(summary);
  }

  return (
    /*
     * iPhone-style spring pop: scale(0) → scale(1) from bottom-right origin.
     * custom cubic-bezier gives the characteristic overshoot bounce.
     * We always render the element so CSS transitions run smoothly;
     * pointer-events:none when closed prevents stray clicks.
     */
    <div
      className={`
        fixed z-[60] flex flex-col overflow-hidden
        bg-white rounded-2xl shadow-2xl border border-gray-200
        origin-bottom-right
        w-[calc(100vw-2rem)] max-w-sm
        right-4 bottom-28
        md:right-24 md:bottom-6
        ${isOpen ? "pointer-events-auto opacity-100 scale-100" : "pointer-events-none opacity-0 scale-0"}
        ${isOpen && isMinimized ? "h-14" : "h-[580px]"}
      `}
      style={{
        transition:
          "transform 0.38s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.22s ease, height 0.22s ease",
      }}
    >
      {/* Header */}
      <div className="bg-brand-green text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
              N
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-brand-green" />
          </div>
          <div>
            <p className="font-semibold text-sm">Lena — UrbanGrid</p>
            <p className="text-xs text-green-200">Property Inspection Expert</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized((m) => !m)}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Minimize"
          >
            <Minimize2 size={16} />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
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
                  <div className="max-w-[85%]">
                    {(() => {
                      if (!isAssistant) {
                        return displayText ? (
                          <div className="px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap bg-brand-green text-white rounded-tr-sm">
                            {renderMarkdown(displayText)}
                          </div>
                        ) : null;
                      }
                      const pricing = parsePricingTable(displayText);
                      if (pricing) {
                        return (
                          <div className="space-y-2">
                            {pricing.cleanText && (
                              <div className="px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap bg-white text-gray-800 border border-gray-200 rounded-tl-sm shadow-sm">
                                {renderMarkdown(pricing.cleanText)}
                              </div>
                            )}
                            <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                              <table className="w-full text-sm">
                                <tbody>
                                  {pricing.rows.map((row, ri) => {
                                    const isAddOn = row.label.toLowerCase().includes("de-snag");
                                    return (
                                      <tr key={ri} className={`border-b border-gray-100 last:border-0 ${isAddOn ? "bg-green-50" : ""}`}>
                                        <td className={`px-3 py-2 font-medium w-[40%] ${isAddOn ? "text-green-800" : "text-gray-700 bg-gray-50"}`}>{row.label}</td>
                                        <td className={`px-3 py-2 text-right font-semibold ${isAddOn ? "text-green-900" : "text-gray-900"}`}>{row.value}</td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        );
                      }
                      return (
                        <div className="px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap bg-white text-gray-800 border border-gray-200 rounded-tl-sm shadow-sm">
                          {displayText ? renderMarkdown(displayText) : (
                            <span className="flex gap-1 items-center py-0.5">
                              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                            </span>
                          )}
                        </div>
                      );
                    })()}

                    {isAssistant && formType && (
                      msg.formSubmitted ? (
                        <ConfirmationCard type={formType} />
                      ) : formType === "booking" ? (
                        <BookingForm onSubmit={(summary) => handleFormSubmit(i, summary)} />
                      ) : (
                        <FitoutForm onSubmit={(summary) => handleFormSubmit(i, summary)} />
                      )
                    )}
                  </div>
                </div>
              );
            })}

            {/* Typing indicator */}
            {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
              <div className="flex justify-start">
                <div className="w-7 h-7 rounded-full bg-brand-green text-white flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0">
                  N
                </div>
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
            onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
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
            >
              <Send size={16} />
            </button>
          </form>

          <div className="px-3 py-1.5 bg-white border-t border-gray-100 text-center flex-shrink-0">
            <p className="text-[10px] text-gray-400">
              Powered by UrbanGrid AI ·{" "}
              <a href="/contact" className="underline hover:text-brand-green">
                Book online
              </a>
            </p>
          </div>
        </>
      )}
    </div>
  );
}
