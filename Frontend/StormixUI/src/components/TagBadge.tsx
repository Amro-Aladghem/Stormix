import React from "react";

interface TagBadgeProps {
  key?: React.Key;
  tag: string;
  highlight?: boolean;
}

export default function TagBadge({ tag, highlight }: TagBadgeProps) {
  return (
    <span
      className={
        "px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide border transition-all " +
        (highlight
          ? "bg-primary/15 text-primary border-primary/30"
          : "bg-[#313130] text-[#888888] border-[#444443]")
      }
    >
      {tag}
    </span>
  );
}
