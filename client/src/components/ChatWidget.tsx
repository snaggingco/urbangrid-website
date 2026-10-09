import { useState, useRef, useEffect } from "react";
import { X, Send, Minimize2, Phone, MessageCircle } from "lucide-react";
interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessage?: string;
  initialMessageKey: number;
  onInitialMessageConsumed?: () => void;
}

const INACTIVITY_MS = 60_000;
const CONVO_END_PATTERNS = [/custom quote/i, /contact our team/i, /speak (?:to|with) (?:a|the) person/i];

const WELCOME_MESSAGE: Message = {
  role: "assistant",
  content:
    "Hi, I'm Nova, UrbanGrid's AI assistant. I can help with inspection scope, services and custom quotes. For uncertain or custom requirements, I'll direct you to our team.",
};

const QUICK_REPLIES = [
  "Get a custom quote",
  "What does an inspection include?",
  "Building consultancy services",
  "Talk to UrbanGrid UK",
];

function parseMessage(content: string): { text: string; customQuoteLink: boolean } {
  const customQuoteLink = /\[SHOW_CUSTOM_QUOTE_LINK\]/i.test(content);
  const text = content
    .replace(/\[SHOW_CUSTOM_QUOTE_LINK\]/gi, "")
    .replace(/\[SHOW_BOOKING_LINK\]|\[SHOW_FORM:[^\]]+\]|\[SHOW_CART_ACTION:[^\]]+\]/gi, "")
    .trim();
  return { text, customQuoteLink };
}

// Only link approved destinations. Generated text never becomes HTML.
function linkVerifiedResources(text: string): React.ReactNode[] {
  const tokens = text.split(/(\+44 7436 597890|\/pricing|\/contact|\/locations\/london|\/services(?:\/[a-z0-9-]+){0,2})/g);
  return tokens.map((token, i) => {
    if (i % 2 === 0) return token;
    const href = token === "+44 7436 597890" ? "tel:+447436597890" : token;
    return <a key={i} href={href} className="font-medium text-brand-green underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-green">{token}</a>;
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
        } catch (error) {
          if (error instanceof Error && error.message === "Chat stream returned an error") throw error;
        }
      }
      if (!rawContent.trim()) throw new Error("Chat response was empty");
      setMessages((prev) => {
        const updated = prev.filter((message) => !(message.role === "assistant" && !message.content));
        return [...updated, {
          role: "assistant",
          content: rawContent,
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
              const { text: displayText } = parseMessage(msg.content);
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



                    {/* UK assistant replies can offer a custom quote enquiry. */}
                    {isAssistant && parseMessage(msg.content).customQuoteLink && (
                      <a href="/contact" onClick={onClose}
                        className="block rounded-xl border border-brand-green px-4 py-3 text-center text-sm font-semibold text-brand-green">
                        Request Custom Quote
                      </a>
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
                      href="tel:+447436597890"
                      className="flex-1 flex items-center justify-center gap-1.5 bg-brand-green text-white text-xs font-semibold px-3 py-2 rounded-xl hover:bg-opacity-90 transition-colors"
                    >
                      <Phone size={13} />
                      Call us
                    </a>
                    <a
                      href="/contact"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 bg-[#25D366] text-white text-xs font-semibold px-3 py-2 rounded-xl hover:bg-opacity-90 transition-colors"
                    >
                      <MessageCircle size={13} />
                      Send an enquiry
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
              <a href="/contact" onClick={onClose} className="min-h-11 inline-flex items-center underline underline-offset-2">Send an enquiry</a>
              <a href="tel:+447436597890" className="min-h-11 inline-flex items-center underline underline-offset-2 gtm-call-button">Call +44 7436 597890</a>
              <a href="/contact" onClick={onClose} className="min-h-11 inline-flex items-center underline underline-offset-2">Request Custom Quote</a>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
