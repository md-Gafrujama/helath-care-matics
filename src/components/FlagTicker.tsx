"use client";

import { FLAG_SIGNALS } from "@/lib/topic-config";

export default function FlagTicker() {
  const items = [...FLAG_SIGNALS, ...FLAG_SIGNALS];

  return (
    <div className="ticker-move" suppressHydrationWarning>
      {items.map((s, i) => (
        <span key={i}>
          <a href="#">{s.label}</a>
          {i < items.length - 1 && <span className="sep">/</span>}
        </span>
      ))}
    </div>
  );
}
