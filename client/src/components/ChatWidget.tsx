import { useState, useRef, useEffect } from "react";
import { X, Send, Minimize2, CheckCircle, Loader2, CalendarDays, Phone, MessageCircle } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { submitLead } from "@/lib/leads";
interface CartAction {
  serviceKey: string;
  name: string;
  unitAmount: number;
  quoteToken?: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  formType?: "booking" | "fitout";
  formSubmitted?: boolean;
  cartActions?: CartAction[];   // all selectable cart items in this message
  addedKeys?: string[];         // serviceKeys the user has already added
}

const WELCOME_MESSAGE: Message = {
  role: "assistant",
  content:
    "Hi, I'm Nova, UrbanGrid's AI assistant. I can help with inspection scope, pricing and sample reports. For uncertain or custom requirements, I'll direct you to our team.",
};

const QUICK_REPLIES = [
  "Get a price estimate",
  "What does snagging include?",
  "DLP inspection",
  "View sample report",
  "Talk to a person",
];

const PROPERTY_TYPES = [
  "Apartment", "Villa", "Townhouse", "Penthouse",
  "Office", "Retail", "Warehouse", "Other",
];

function parseMessage(content: string): { text: string; formType?: "booking" | "fitout"; cartActions: CartAction[]; bookingLink: boolean; customQuoteLink: boolean } {
  let text = content;
  const bookingLink = /\[SHOW_BOOKING_LINK\]/i.test(text);
  text = text.replace(/\[SHOW_BOOKING_LINK\]/gi, "").trim();
  const customQuoteLink = /\[SHOW_CUSTOM_QUOTE_LINK\]/i.test(text);
  text = text.replace(/\[SHOW_CUSTOM_QUOTE_LINK\]/gi, "").trim();
  let formType: "booking" | "fitout" | undefined;
  const cartActions: CartAction[] = [];

  // Extract [SHOW_FORM:...]
  const formMatch = text.match(/\[SHOW_FORM:(booking|fitout)\]/i);
  if (formMatch) {
    formType = formMatch[1].toLowerCase() as "booking" | "fitout";
    text = text.replace(/\[SHOW_FORM:(booking|fitout)\]/gi, "").trim();
  }

  // Extract ALL [SHOW_CART_ACTION:serviceKey:Display Name:amount] markers
  const cartRegex = /\[SHOW_CART_ACTION:([^:]+):([^:]+):(\d+)\]/gi;
  let m;
  while ((m = cartRegex.exec(text)) !== null) {
    cartActions.push({
      serviceKey: m[1].trim(),
      name: m[2].trim(),
      unitAmount: parseInt(m[3], 10),
    });
  }
  text = text.replace(/\[SHOW_CART_ACTION:[^\]]+\]/gi, "").trim();

  return { text, formType, cartActions, bookingLink, customQuoteLink };
}

// Only link approved destinations. Generated text never becomes HTML.
function linkVerifiedResources(text: string): React.ReactNode[] {
  const tokens = text.split(/(https:\/\/wa\.me\/971567427634|\+971585686852|\/about#regulatory-registration|\/sample-report(?:\.pdf)?|\/pricing|\/book-inspection|\/contact|\/services(?:\/[a-z0-9-]+){0,2})/g);
  return tokens.map((token, i) => {
    if (i % 2 === 0) return token;
    const href = token === "+971585686852" ? `tel:${token}` : token;
    const external = token.startsWith("https:") || token.endsWith(".pdf");
    return <a key={i} href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} className="font-medium text-brand-green underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-green">{token}</a>;
  });
}

/* Lightweight bold formatting, with approved resource/handoff links only. */
function renderMarkdown(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const segments = text.split(/(\*\*)/g);
  let inBold = false;
  let buffer = "";

  for (const seg of segments) {
    if (seg === "**") {
      if (buffer) {
        parts.push(inBold ? <strong key={parts.length}>{linkVerifiedResources(buffer)}</strong> : <span key={parts.length}>{linkVerifiedResources(buffer)}</span>);
        buffer = "";
      }
      inBold = !inBold;
    } else {
      buffer += seg;
    }
  }
  if (buffer) {
    parts.push(inBold ? <strong key={parts.length}>{linkVerifiedResources(buffer)}</strong> : <span key={parts.length}>{linkVerifiedResources(buffer)}</span>);
  }
  return parts;
}

/* Detect Nova's pricing breakdown and render it as a structured table.
   Triggers on any message that contains at least 3 of the known pricing fields,
   regardless of whether a header is present. */
function parsePricingTable(text: string): { cleanText: string; rows: { label: string; value: string }[] } | null {
  // Normalise: strip markdown bold, convert dash bullets to bullet char
  const plain = text.replace(/\*\*/g, "").replace(/^[ \t]*-[ \t]/gm, "\u2022 ");

  // Known pricing field patterns (prefix = optional bullet/whitespace)
  const PFX = /(?:[\u2022\*][ \t]*)?/;
  const FIELDS: Array<[RegExp, string]> = [
    [new RegExp(PFX.source + "Service:\\s*(.+)", "im"), "Service"],
    [new RegExp(PFX.source + "Built-Up Area:\\s*(.+)", "im"), "Built-Up Area"],
    [new RegExp(PFX.source + "Fee \\(excl\\.? VAT\\):\\s*(.+)", "im"), "Fee (excl. VAT)"],
    [new RegExp(PFX.source + "VAT \\(5%\\):\\s*(.+)", "im"), "VAT (5%)"],
    [new RegExp(PFX.source + "Total \\(incl\\.? VAT\\):\\s*(.+)", "im"), "Total (incl. VAT)"],
    [new RegExp(PFX.source + "De[-\\s]?[Ss]nagging Add-On[^:]*:\\s*(.+)", "im"), "De-snagging Add-On (incl. VAT)"],
  ];

  const rows: { label: string; value: string }[] = [];
  for (const [regex, label] of FIELDS) {
    const m = plain.match(regex);
    if (m) rows.push({ label, value: m[1].trim() });
  }

  // Only render as table if we found at least 3 pricing fields
  if (rows.length < 3) return null;

  // Build clean surrounding text by stripping all pricing lines and known headers
  let cleanText = text
    .replace(/\*\*/g, "")
    .replace(/[ \t]*[\u2022\*\-]?[ \t]*Service:\s*.+/gim, "")
    .replace(/[ \t]*[\u2022\*\-]?[ \t]*Built-Up Area:\s*.+/gim, "")
    .replace(/[ \t]*[\u2022\*\-]?[ \t]*Fee \(excl\.? VAT\):\s*.+/gim, "")
    .replace(/[ \t]*[\u2022\*\-]?[ \t]*VAT \(5%\):\s*.+/gim, "")
    .replace(/[ \t]*[\u2022\*\-]?[ \t]*Total \(incl\.? VAT\):\s*.+/gim, "")
    .replace(/[ \t]*[\u2022\*\-]?[ \t]*De[-\s]?[Ss]nagging Add-On[^\n]*/gim, "")
    .replace(/(?:Here's the fee breakdown[^\n]*|calculate your[^\n]*snagging inspection fee[^\n]*|FEE ESTIMATE[^\n]*)\n*/gim, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return { cleanText, rows };
}

// ── Booking form ──────────────────────────────────────────────────────────────
function BookingForm({ onSubmit }: { onSubmit: (summary: string) => void }) {
  const [fields, setFields] = useState({
    name: "", phone: "", email: "",
    serviceType: "",
    projectName: "", projectLocation: "", propertyType: "",
    bedrooms: "", sqft: "", inspectionDate: "",
  });
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function set(k: keyof typeof fields, v: string) {
    setFields((p) => ({ ...p, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setError("");
    try {
      await submitLead("/api/chat/lead", { type: "booking", ...fields, leadSource: "chat_booking" });
    } catch {
      setError("Your enquiry was not sent. Please try again; your details have been kept.");
      setSending(false);
      return;
    }
    const summary =
      `Booking details: Full Name: ${fields.name}, Phone: ${fields.phone}, Email: ${fields.email}, ` +
      `Service Type: ${fields.serviceType || "N/A"}, ` +
      `Project Name: ${fields.projectName || "N/A"}, Project Location: ${fields.projectLocation || "N/A"}, ` +
      `Property Type: ${fields.propertyType || "N/A"}, No. of Bedrooms: ${fields.bedrooms || "N/A"}, ` +
      `Built-Up Area: ${fields.sqft} sq.ft, Preferred Inspection Date/Time: ${fields.inspectionDate || "N/A"}.`;
    setSending(false);
    setSubmitted(true);
    onSubmit(summary);
  }

  const required = fields.name && fields.phone && fields.email && fields.serviceType && fields.propertyType && fields.sqft;
  if (submitted) return null;

  return (
    <form onSubmit={handleSubmit} className="mt-2 bg-green-50 border border-green-200 rounded-xl p-3 space-y-2">
      {error && <p role="alert" className="text-xs text-red-700">{error}</p>}
      <p className="text-xs font-semibold text-brand-green uppercase tracking-wide">Inspection Booking</p>
      <select required value={fields.serviceType} onChange={(e) => set("serviceType", e.target.value)}
        className="w-full text-sm px-2 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-brand-green bg-white text-gray-700">
        <option value="">Service type *</option>
        <optgroup label="Property Snagging">
          <option value="Stage 1 Snagging — New Build Handover">Stage 1 Snagging — New Build Handover</option>
          <option value="Stage 2 De-Snagging">Stage 2 De-Snagging</option>
          <option value="DLP / 11th Month Inspection">DLP / 11th Month Inspection</option>
          <option value="Post-Renovation Inspection">Post-Renovation Inspection</option>
          <option value="Move-In / Move-Out Inspection">Move-In / Move-Out Inspection</option>
          <option value="Secondary Market Inspection">Secondary Market Inspection</option>
          <option value="Developer / Bulk Projects">Developer / Bulk Projects</option>
        </optgroup>
        <optgroup label="RERA Services">
          <option value="Reserve Fund Study">Reserve Fund Study</option>
          <option value="Service Charge Allocation">Service Charge Allocation</option>
          <option value="Reinstatement Cost Assessment">Reinstatement Cost Assessment</option>
          <option value="Building Completion Audit">Building Completion Audit</option>
          <option value="Building Condition Survey">Building Condition Survey</option>
        </optgroup>
        <optgroup label="Technical Inspections">
          <option value="Technical Due Diligence">Technical Due Diligence</option>
          <option value="Dilapidation Survey">Dilapidation Survey</option>
          <option value="Thermographic Survey">Thermographic Survey</option>
          <option value="Noise / Acoustic Survey">Noise / Acoustic Survey</option>
          <option value="Structural Survey">Structural Survey</option>
        </optgroup>
        <option value="Interior Fit-Out">Interior Fit-Out</option>
      </select>
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
        aria-label="Phone number"
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
  const [error, setError] = useState("");

  function set(k: keyof typeof fields, v: string) {
    setFields((p) => ({ ...p, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setError("");
    try {
      await submitLead("/api/chat/lead", { type: "fitout", ...fields, leadSource: "chat_fitout" });
    } catch {
      setError("Your enquiry was not sent. Please try again; your details have been kept.");
      setSending(false);
      return;
    }
    const summary = `Fit-out enquiry — Full Name: ${fields.name}, Phone: ${fields.phone}, Email: ${fields.email}, Property address: ${fields.address}.`;
    setSending(false);
    setSubmitted(true);
    onSubmit(summary);
  }

  const complete = fields.name && fields.phone && fields.email && fields.address;
  if (submitted) return null;

  return (
    <form onSubmit={handleSubmit} className="mt-2 bg-green-50 border border-green-200 rounded-xl p-3 space-y-2">
      {error && <p role="alert" className="text-xs text-red-700">{error}</p>}
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
        aria-label="Phone number"
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
  initialMessageKey?: number;
  onInitialMessageConsumed?: () => void;
}

// Nova phrases that signal the conversation has naturally concluded
const CONVO_END_PATTERNS = [
  /\bbye\b/i, /\bgoodbye\b/i, /\btake care\b/i, /\bhave a (great|wonderful|good|lovely)\b/i,
  /feel free to (reach out|contact|call|message|get in touch)/i,
  /don.t hesitate to (reach out|contact|call|message|get in touch)/i,
  /if (there.s|you have) anything else/i, /any other questions/i,
  /happy to help.*anytime/i, /all the best/i,
];

const INACTIVITY_MS = 60_000; // 1 minute

export default function ChatWindow({ isOpen, onClose, initialMessage, initialMessageKey, onInitialMessageConsumed }: ChatWindowProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [requestError, setRequestError] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [showHumanSupport, setShowHumanSupport] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sendingRef = useRef(false);
  const queuedPromptsRef = useRef<string[]>([]);
  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Clear inactivity timer helper
  function clearInactivity() {
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
      inactivityTimer.current = null;
    }
  }

  // Start/reset the 1-minute inactivity countdown
  function resetInactivityTimer(msgCount: number) {
    clearInactivity();
    // Only count down if there's been at least one real exchange (> 1 message)
    if (msgCount < 2) return;
    inactivityTimer.current = setTimeout(() => {
      setShowHumanSupport(true);
    }, INACTIVITY_MS);
  }

  // Expand whenever chat is opened. The component remains mounted so history survives close.
  useEffect(() => {
    if (isOpen) {
      setIsMinimized(false);
      const focusTimer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(focusTimer);
    } else {
      clearInactivity();
      queuedPromptsRef.current = [];
    }
    return () => clearInactivity();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Hero prompts may arrive while the conversation is already open.
  useEffect(() => {
    if (!isOpen || !initialMessage) return;
    setIsMinimized(false);
    onInitialMessageConsumed?.();
    if (sendingRef.current) queuedPromptsRef.current.push(initialMessage);
    else void sendMessage(initialMessage);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialMessage, initialMessageKey]);

  useEffect(() => {
    if (isLoading || sendingRef.current || queuedPromptsRef.current.length === 0) return;
    const nextPrompt = queuedPromptsRef.current.shift();
    if (nextPrompt) void sendMessage(nextPrompt);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  }, [messages, isLoading]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  async function sendMessage(text: string, retry = false) {
    if ((!text.trim() && !retry) || sendingRef.current) return;
    sendingRef.current = true;
    // User is active — hide the support card and reset inactivity timer
    setShowHumanSupport(false);
    clearInactivity();

    const userMsg: Message = { role: "user", content: text.trim() };
    const updatedMessages = retry ? messages : [...messages, userMsg];
    if (!retry) {
      setMessages(updatedMessages);
      setInput("");
    }
    setRequestError(false);
    setIsLoading(true);
    setShowQuickReplies(false);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30_000);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      if (!res.ok) throw new Error("Chat request failed");

      const reader = res.body?.getReader();
      if (!reader) throw new Error("Chat stream unavailable");
      const decoder = new TextDecoder();
      let rawContent = "";
      let sseBuffer = "";
      // Map of serviceKey → { amountAed, quoteToken } for all signed quotes in this message
      const pendingTokens = new Map<string, { amountAed: number; quoteToken: string }>();
      let streamDone = false;
      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) {
          sseBuffer += decoder.decode();
          streamDone = true;
        }
        // Buffer across chunk boundaries to avoid split-line JSON parse failures
        if (value) sseBuffer += decoder.decode(value, { stream: true });
        const lines = sseBuffer.split("\n");
        // Keep last (potentially incomplete) line in the buffer
        sseBuffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.error) throw new Error("Chat stream returned an error");
            if (data.done) streamDone = true;
            if (data.content) {
              rawContent += data.content;
              setMessages((prev) => {
                const updated = [...prev];
                if (updated[updated.length - 1]?.role === "assistant" && updated[updated.length - 1]?.content === "") {
                  updated.pop();
                }
                return updated;
              });
            }
            // Server sends one signed token event per SHOW_CART_ACTION marker
            if (data.quoteToken && data.serviceKey && data.amountAed) {
              pendingTokens.set(data.serviceKey, {
                amountAed: data.amountAed,
                quoteToken: data.quoteToken,
              });
            }
          } catch (error) {
            if (error instanceof Error && error.message === "Chat stream returned an error") throw error;
          }
        }
      }

      if (sseBuffer.trim().startsWith("data: ")) {
        try {
          const data = JSON.parse(sseBuffer.trim().slice(6));
          if (data.error) throw new Error("Chat stream returned an error");
          if (data.content) rawContent += data.content;
          if (data.quoteToken && data.serviceKey && data.amountAed) {
            pendingTokens.set(data.serviceKey, { amountAed: data.amountAed, quoteToken: data.quoteToken });
          }
        } catch (error) {
          if (error instanceof Error && error.message === "Chat stream returned an error") throw error;
        }
      }
      if (!rawContent.trim()) throw new Error("Chat response was empty");
      const { formType, cartActions } = parseMessage(rawContent);
      // Attach server-signed tokens to each cart action
      const signedCartActions = cartActions.map((action) => {
        const tok = pendingTokens.get(action.serviceKey);
        if (tok && tok.amountAed === action.unitAmount) {
          return { ...action, quoteToken: tok.quoteToken };
        }
        return action;
      });

      setMessages((prev) => {
        const updated = prev.filter((message) => !(message.role === "assistant" && !message.content));
        return [...updated, {
          role: "assistant",
          content: rawContent,
          formType,
          cartActions: signedCartActions.length > 0 ? signedCartActions : undefined,
        }];
      });
      setRequestError(false);

      // Check if Nova is wrapping up — show human support immediately
      const isConvoEnd = CONVO_END_PATTERNS.some((p) => p.test(rawContent));
      if (isConvoEnd) {
        setShowHumanSupport(true);
      } else {
        // Otherwise start the inactivity countdown (user + assistant = at least 2 msgs)
        resetInactivityTimer(updatedMessages.length + 1);
      }
    } catch {
      setRequestError(true);
      setShowHumanSupport(true);
    } finally {
      clearTimeout(timeoutId);
      sendingRef.current = false;
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
    <section
      role="dialog"
      aria-modal="false"
      aria-labelledby="nova-chat-title"
      aria-describedby="nova-chat-description"
      aria-hidden={!isOpen}
      className={`
        fixed z-[60] flex flex-col overflow-hidden
        bg-white rounded-2xl shadow-2xl border border-gray-200
        origin-bottom-right transition-[transform,opacity,height] duration-300 ease-out motion-reduce:transition-none
        w-[calc(100vw-2rem)] max-w-sm
        right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))]
        max-h-[calc(100dvh-5.5rem)]
        md:right-24 md:bottom-6 md:max-h-[calc(100dvh-3rem)]
        ${isOpen ? "pointer-events-auto opacity-100 scale-100" : "hidden"}
        ${isMinimized ? "h-14 min-h-14" : "h-[min(580px,calc(100dvh-5.5rem))]"}
      `}
    >
      {/* Header */}
      <div className="bg-brand-green text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
              N
            </div>
          </div>
          <div>
            <p id="nova-chat-title" className="font-semibold text-sm">Nova — UrbanGrid AI Assistant</p>
            <p id="nova-chat-description" className="text-xs text-green-100">Inspection help and quick answers</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized((m) => !m)}
            className="min-h-11 min-w-11 flex items-center justify-center hover:bg-white/20 rounded-lg transition-colors"
            aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
            aria-expanded={!isMinimized}
          >
            <Minimize2 size={16} />
          </button>
          <button
            onClick={onClose}
            className="min-h-11 min-w-11 flex items-center justify-center hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Close chat"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div role="log" aria-label="Conversation with UrbanGrid AI Assistant" aria-live="polite" aria-relevant="additions" aria-busy={isLoading} className="flex-1 min-h-0 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50">
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
                              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce motion-reduce:animate-none" style={{ animationDelay: "0ms" }} />
                              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce motion-reduce:animate-none" style={{ animationDelay: "150ms" }} />
                              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce motion-reduce:animate-none" style={{ animationDelay: "300ms" }} />
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

                    {/* Pricing summary + contact CTAs (cart checkout temporarily hidden) */}
                    {isAssistant && parseMessage(msg.content).bookingLink && (
                      <a href="/book-inspection" onClick={onClose}
                        className="block rounded-xl bg-brand-green px-4 py-3 text-center text-sm font-semibold text-white">
                        Book residential inspection — no upfront payment
                      </a>
                    )}
                    {isAssistant && parseMessage(msg.content).customQuoteLink && (
                      <a href="/contact?enquiryType=General%20Enquiry" onClick={onClose}
                        className="block rounded-xl border border-brand-green px-4 py-3 text-center text-sm font-semibold text-brand-green">
                        Request Custom Quote
                      </a>
                    )}
                    {isAssistant && msg.cartActions && msg.cartActions.length > 0 && (
                      <div className="hidden">
                        {/* Price summary */}
                        <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3 space-y-1.5">
                          {msg.cartActions.map((action) => (
                            <div key={action.serviceKey} className="flex justify-between text-xs">
                              <span className="text-zinc-600">{action.name}</span>
                              <span className="font-semibold text-zinc-900">AED {action.unitAmount.toLocaleString()}</span>
                            </div>
                          ))}
                          <div className="border-t border-zinc-200 pt-1.5 flex justify-between text-xs font-bold">
                            <span className="text-zinc-900">Estimated Total</span>
                            <span className="text-brand-green">
                              AED {msg.cartActions.reduce((sum, a) => sum + a.unitAmount, 0).toLocaleString()} incl. VAT
                            </span>
                          </div>
                        </div>

                        {/* Contact CTAs */}
                        <div className="flex gap-2">
                          <a
                            href="https://wa.me/971567427634"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-1.5 bg-[#25D366] text-white text-xs font-semibold px-3 py-2.5 rounded-xl hover:bg-opacity-90 transition-colors"
                          >
                            <MessageCircle size={14} />
                            Book via WhatsApp
                          </a>
                          <a
                            href="tel:+971585686852"
                            className="flex-1 flex items-center justify-center gap-1.5 bg-brand-green text-white text-xs font-semibold px-3 py-2.5 rounded-xl hover:bg-opacity-90 transition-colors"
                          >
                            <Phone size={14} />
                            Call us
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Typing indicator: no empty assistant message is added while waiting. */}
            {isLoading && (
              <div role="status" aria-label="Assistant is replying" className="flex justify-start">
                <div className="w-7 h-7 rounded-full bg-brand-green text-white flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0">
                  N
                </div>
                <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm">
                  <span className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce motion-reduce:animate-none" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce motion-reduce:animate-none" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce motion-reduce:animate-none" style={{ animationDelay: "300ms" }} />
                  </span>
                </div>
              </div>
            )}

            {requestError && (
              <div role="alert" className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-gray-800">
                <p className="font-medium">Nova couldn’t complete that reply.</p>
                <p className="mt-1 text-xs text-gray-700">Try again, or reach our team using the contact options below.</p>
                <button
                  type="button"
                  onClick={() => void sendMessage("", true)}
                  className="mt-2 min-h-11 rounded-lg bg-brand-green px-4 text-sm font-semibold text-white hover:bg-opacity-90"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Quick replies */}
            {showQuickReplies && messages.length === 1 && (
              <div className="pt-1 space-y-2">
                {QUICK_REPLIES.map((reply) => (
                  <button
                    key={reply}
                    onClick={() => sendMessage(reply)}
                    className="block w-full min-h-11 text-left text-sm px-3 py-2 rounded-xl border border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition-colors duration-200"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}

            {/* Human support card — shown after inactivity or conversation end */}
            {showHumanSupport && !isLoading && (
              <div className="flex justify-start">
                <div className="w-7 h-7 rounded-full bg-brand-green text-white flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0 mt-0.5">
                  N
                </div>
                <div className="max-w-[85%] bg-white border border-gray-200 rounded-2xl rounded-tl-sm shadow-sm px-3.5 py-3 space-y-2.5">
                  <p className="text-sm text-gray-700 font-medium">Need to speak with someone directly?</p>
                  <div className="flex gap-2">
                    <a
                      href="tel:+971585686852"
                      className="flex-1 flex items-center justify-center gap-1.5 bg-brand-green text-white text-xs font-semibold px-3 py-2 rounded-xl hover:bg-opacity-90 transition-colors"
                    >
                      <Phone size={13} />
                      Call us
                    </a>
                    <a
                      href="https://wa.me/971567427634"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 bg-[#25D366] text-white text-xs font-semibold px-3 py-2 rounded-xl hover:bg-opacity-90 transition-colors"
                    >
                      <MessageCircle size={13} />
                      WhatsApp
                    </a>
                  </div>
                </div>
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
              aria-label="Message UrbanGrid AI Assistant"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about our inspection services..."
              className="flex-1 min-h-11 text-sm px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-brand-green bg-gray-50 placeholder-gray-500"
              disabled={isLoading}
              maxLength={500}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
              className="bg-brand-green text-white min-h-11 min-w-11 rounded-xl flex items-center justify-center hover:bg-opacity-90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            >
              <Send size={16} aria-hidden="true" />
            </button>
          </form>

          <div className="px-3 py-2 bg-white border-t border-gray-100 flex-shrink-0">
            <p className="text-[10px] text-gray-600 text-center mb-1">Powered by UrbanGrid AI</p>
            <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-xs font-medium text-brand-green">
              <a href="/book-inspection" onClick={onClose} className="min-h-11 inline-flex items-center underline underline-offset-2">Book Inspection</a>
              <a href="https://wa.me/971567427634?text=Hello%20UrbanGrid%2C%20I%27m%20interested%20in%20your%20property%20inspection%20services.%20Please%20provide%20me%20with%20more%20information." target="_blank" rel="noopener noreferrer" className="min-h-11 inline-flex items-center underline underline-offset-2">WhatsApp</a>
              <a href="tel:+971585686852" className="min-h-11 inline-flex items-center underline underline-offset-2 gtm-call-button">Call us</a>
              <a href="/contact" onClick={onClose} className="min-h-11 inline-flex items-center underline underline-offset-2">Request Custom Quote</a>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
