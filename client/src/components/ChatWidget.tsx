import { useState, useRef, useEffect } from "react";
import { X, MessageCircle, Send, Minimize2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const WELCOME_MESSAGE: Message = {
  role: "assistant",
  content: "Hi! I'm Nora from UrbanGrid 👋 I'm here to help you with property inspections, snagging services, and anything else you need. What can I help you with today?",
};

const QUICK_REPLIES = [
  "How much does a snagging inspection cost?",
  "What areas do you cover?",
  "What does the report include?",
  "I want to book an inspection",
];

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

  // Show notification badge after 8 seconds if chat hasn't been opened
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
      let assistantContent = "";

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
              assistantContent += data.content;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: "assistant",
                  content: assistantContent,
                };
                return updated;
              });
            }
          } catch {}
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I'm having trouble connecting right now. Please call us directly on +971 585 686 852 or email info@urbangrid.ae.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleQuickReply(text: string) {
    sendMessage(text);
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
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className={`relative bg-brand-green hover:bg-opacity-90 text-white w-14 h-14 rounded-full shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center ${isOpen ? "hidden" : "flex"}`}
          aria-label="Open chat"
        >
          <MessageCircle size={24} />
          {hasNotification && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
          )}
          {/* Tooltip */}
          <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 opacity-0 group-hover:opacity-100 transition-all hidden md:block">
            <div className="bg-brand-green text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
              Chat with Nora
            </div>
          </div>
        </button>
      </div>

      {/* Chat window */}
      {isOpen && (
        <div
          className={`fixed z-50 right-4 bottom-4 md:right-6 md:bottom-6 w-[calc(100vw-2rem)] max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden transition-all duration-300 ${
            isMinimized ? "h-14" : "h-[520px]"
          }`}
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
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "assistant" && (
                      <div className="w-7 h-7 rounded-full bg-brand-green text-white flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0 mt-0.5">
                        N
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-brand-green text-white rounded-tr-sm"
                          : "bg-white text-gray-800 border border-gray-200 rounded-tl-sm shadow-sm"
                      }`}
                    >
                      {msg.content || (
                        <span className="flex gap-1 items-center py-0.5">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </span>
                      )}
                    </div>
                  </div>
                ))}

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

                {/* Quick replies — only show after welcome */}
                {showQuickReplies && messages.length === 1 && (
                  <div className="pt-1 space-y-2">
                    {QUICK_REPLIES.map((reply) => (
                      <button
                        key={reply}
                        onClick={() => handleQuickReply(reply)}
                        className="block w-full text-left text-sm px-3 py-2 rounded-xl border border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition-colors duration-200"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input area */}
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
