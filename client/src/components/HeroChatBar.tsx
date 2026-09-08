import { useState, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { openLenaWithMessage } from "@/lib/lenaStore";

const CHIPS_DESKTOP = [
  "Get a price estimate",
  "What's included in an inspection?",
  "Do you cover my area?",
];

const CHIPS_MOBILE = [
  "Price estimate",
  "What's included?",
  "My area?",
];

export default function HeroChatBar() {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function submit(msg: string) {
    const text = msg.trim();
    if (!text) return;
    setValue("");
    openLenaWithMessage(text);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    submit(value);
  }

  return (
    <div className="w-full mb-3 sm:mb-5">
      {/* Input bar — compact on mobile */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-0 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg sm:rounded-xl overflow-hidden focus-within:border-brand-green focus-within:ring-1 focus-within:ring-brand-green transition-all duration-200"
      >
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ask Nova AI…"
          className="flex-1 bg-transparent text-white placeholder-zinc-400 text-xs sm:text-sm px-3 sm:px-4 py-2.5 sm:py-3.5 focus:outline-none min-w-0"
          maxLength={300}
          aria-label="Ask Nova AI a question"
        />
        <button
          type="submit"
          disabled={!value.trim()}
          className="bg-brand-green text-white px-3 sm:px-4 py-2.5 sm:py-3.5 flex items-center justify-center hover:bg-emerald-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          aria-label="Send"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Suggestion chips — shorter text on mobile, scrollable */}
      <div className="flex gap-1.5 sm:gap-2 mt-2 overflow-x-auto pb-0.5 scrollbar-hide w-full">
        {/* Mobile chips */}
        {CHIPS_MOBILE.map((chip, i) => (
          <button
            key={chip}
            onClick={() => submit(CHIPS_DESKTOP[i])}
            className="sm:hidden flex-shrink-0 text-[11px] text-zinc-300 border border-zinc-600 hover:border-brand-green hover:text-white px-2.5 py-1 rounded-full transition-all duration-150 whitespace-nowrap"
          >
            {chip}
          </button>
        ))}
        {/* Desktop chips */}
        {CHIPS_DESKTOP.map((chip) => (
          <button
            key={chip}
            onClick={() => submit(chip)}
            className="hidden sm:block flex-shrink-0 text-xs text-zinc-300 border border-zinc-600 hover:border-brand-green hover:text-white px-3 py-1.5 rounded-full transition-all duration-150 whitespace-nowrap"
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
}
