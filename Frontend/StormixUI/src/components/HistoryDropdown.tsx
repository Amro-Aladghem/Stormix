import { motion } from "motion/react";
import { RotateCcw } from "lucide-react";

interface HistoryDropdownProps {
  items: string[];
  onPick: (v: string) => void;
}

export default function HistoryDropdown({ items, onPick }: HistoryDropdownProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.15 }}
      className="absolute left-0 right-0 mt-1.5 bg-card border border-border rounded shadow-lg z-50 overflow-hidden"
    >
      <div className="px-3.5 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border bg-background/50">
        Recent searches
      </div>
      <div className="max-h-60 overflow-y-auto">
        {items.map((h, idx) => (
          <button
            key={`${h}-${idx}`}
            type="button"
            onMouseDown={(e) => {
              // Prevent standard blur from dismissing input before select
              e.preventDefault();
              onPick(h);
            }}
            className="w-full text-left px-4 py-2.5 text-sm hover:bg-muted flex items-center gap-2.5 transition-colors group"
          >
            <RotateCcw className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            <span className="truncate text-foreground group-hover:text-primary transition-colors">{h}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
