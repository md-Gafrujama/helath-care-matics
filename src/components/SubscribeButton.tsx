"use client";

import type { ReactNode } from "react";
import { OPEN_SUBSCRIBE_EVENT } from "@/components/SubscribeModal";

export default function SubscribeButton({
  className,
  children,
  style,
  onClick,
}: {
  className?: string;
  children: ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      className={className}
      style={style}
      aria-haspopup="dialog"
      onClick={() => {
        onClick?.();
        window.dispatchEvent(
          new CustomEvent(OPEN_SUBSCRIBE_EVENT, { detail: { source: "navbar" } }),
        );
      }}
    >
      {children}
    </button>
  );
}
