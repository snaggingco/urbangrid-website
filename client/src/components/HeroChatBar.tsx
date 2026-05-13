import { useState, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { openLenaWithMessage } from "@/lib/lenaStore";

const CHIPS = [
  "Get a price estimate",
  "What's included in an inspection?",
  "Do you cover my area?",
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
    <div className="w-full max-w-xl mb-5">
      {/* Input bar */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-0 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden focus-within:border-brand-green focus-within:ring-1 focus-within:ring-brand-green transition-all duration-200"
      >
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ask Lena AI about your property or inspection needs…"
          className="flex-1 bg-transparent text-white placeholder-zinc-400 text-sm px-4 py-3.5 focus:outline-none min-w-0"
          maxLength={300}
          aria-label="Ask Lena AI a question"
        />
        <button
          type="submit"
          disabled={!value.trim()}
          className="bg-brand-green text-white px-4 py-3.5 flex items-center justify-center hover:bg-emerald-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          aria-label="Send"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Suggestion chips */}
      <div className="flex gap-2 mt-2.5 overflow-x-auto pb-1 scrollbar-hide">
        {CHIPS.map((chip) => (
          <button
            key={chip}
            onClick={() => submit(chip)}
            className="flex-shrink-0 text-xs text-zinc-300 border border-zinc-600 hover:border-brand-green hover:text-white px-3 py-1.5 rounded-full transition-all duration-150 whitespace-nowrap"
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
}
