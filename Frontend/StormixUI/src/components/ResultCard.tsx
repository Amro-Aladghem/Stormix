import React from "react";
import { Play, Sparkles } from "lucide-react";
import { SearchResult } from "../types";
import { formatTime, ytThumb } from "../utils";
import TagBadge from "./TagBadge";

interface ResultCardProps {
  key?: React.Key;
  rank: number;
  result: SearchResult;
  onClick: () => void;
  usedTags: string[];
}

export default function ResultCard({ rank, result, onClick, usedTags }: ResultCardProps) {
  const p = result.payload;
  const thumb = ytThumb(p.url);
  const matchPercentage = Math.round(result.score * 100);

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick();
        }
      }}
      className="group cursor-pointer text-left rounded border border-border bg-card p-4 hover:border-primary/50 hover:bg-card/80 transition-all shadow-sm focus:outline-none focus:ring-1 focus:ring-primary/40"
    >
      <div className="flex items-start gap-4">
        {/* Play/Rank Indicator */}
        <div className="w-7 h-7 shrink-0 rounded bg-muted text-xs font-mono flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all">
          <span className="group-hover:hidden">{rank}</span>
          <Play className="w-3 h-3 hidden group-hover:block" />
        </div>

        {/* Content body */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
              {p.primaryTopic}
            </h4>
            <span className="text-[11px] font-semibold font-mono text-muted-foreground bg-background px-1.5 py-0.5 rounded border border-border shrink-0">
              {formatTime(p.start)} – {formatTime(p.end)}
            </span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {p.summary}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {p.tags.map((t) => (
              <TagBadge key={t} tag={t} highlight={usedTags.includes(t)} />
            ))}
          </div>
        </div>

        {/* Thumbnail and Confidence Score */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <div className="text-[11px] font-bold font-mono text-primary flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
            <Sparkles className="w-2.5 h-2.5" />
            <span>{matchPercentage}%</span>
          </div>
          
          {thumb && (
            <div
              className="w-24 h-14 rounded overflow-hidden bg-black/40 border border-border pointer-events-none select-none relative"
              aria-hidden="true"
            >
              <img
                src={thumb}
                alt=""
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
