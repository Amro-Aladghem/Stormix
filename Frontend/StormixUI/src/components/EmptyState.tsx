import React, { useRef, FormEvent } from "react";
import { Search, Sparkles, Youtube } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import HistoryDropdown from "./HistoryDropdown";

interface EmptyStateProps {
  query: string;
  setQuery: (v: string) => void;
  onSubmit: (e?: FormEvent, override?: string) => void;
  history: string[];
  showHistory: boolean;
  setShowHistory: (v: boolean) => void;
}

export default function EmptyState({
  query,
  setQuery,
  onSubmit,
  history,
  showHistory,
  setShowHistory,
}: EmptyStateProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const presetSuggestions = [
    "Claude Design",
    "Cursor",
    "Codex Skills",
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-20 flex flex-col items-center text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center"
      >
        <div className="w-10 h-10 rounded bg-primary/10 border border-primary/30 flex items-center justify-center text-primary mb-5 shadow-sm">
          <Youtube className="w-5 h-5" />
        </div>
        <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight leading-normal">
          Search <span className="text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/25">Stormix</span> understands YouTube videos with AI
        </h1>
        <p className="mt-3.5 text-xs md:text-sm text-muted-foreground max-w-md leading-relaxed">
          Currently optimized for Claude, Codex, Cursor, Vibe coding Video Topics.
        </p>
      </motion.div>

      {/* Primary search form bar */}
      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        onSubmit={(e) => onSubmit(e)}
        className="mt-8 w-full relative"
      >
        <div className="flex items-center bg-card rounded border border-border overflow-hidden shadow focus-within:border-primary/80 transition-all p-1 pl-3.5">
          <Search className="w-4 h-4 text-[#888888] mr-2 shrink-0" />
          <input
            ref={inputRef}
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowHistory(true)}
            onBlur={() => setTimeout(() => setShowHistory(false), 200)}
            placeholder="e.g. Claude design system, MCP connectors …"
            className="flex-1 bg-transparent py-2.5 text-xs md:text-sm outline-none placeholder:text-[#666666] min-w-0"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded text-xs font-bold uppercase tracking-wider bg-primary text-primary-foreground hover:opacity-95 transition-all cursor-pointer shrink-0"
          >
            Search
          </button>
        </div>

        {/* Dynamic history search suggests list */}
        <AnimatePresence>
          {showHistory && history.length > 0 && (
            <HistoryDropdown
              items={history}
              onPick={(v) => {
                setQuery(v);
                onSubmit(undefined, v);
              }}
            />
          )}
        </AnimatePresence>
      </motion.form>

      {/* Preset fast explore buttons lists */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-6 flex flex-col items-center gap-2.5 w-full"
      >
        <span className="text-[9px] uppercase tracking-[0.15em] text-[#888888] font-bold flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-primary animate-pulse" /> Quick suggestions
        </span>
        <div className="flex flex-wrap justify-center gap-1.5 max-w-xl">
          {presetSuggestions.map((s) => (
            <button
              key={s}
              onClick={() => {
                setQuery(s);
                onSubmit(undefined, s);
              }}
              className="px-3 py-1.5 text-[11px] font-medium rounded border border-border bg-card/60 hover:border-primary hover:text-primary transition-all cursor-pointer"
            >
              {s}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
