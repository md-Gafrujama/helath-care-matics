"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function MobileNav({
  currentTopicSlug,
}: {
  currentTopicSlug?: string;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const panel = open && mounted
    ? createPortal(
        <div className="mnav open" role="dialog" aria-modal="true" aria-label="Site menu">
          <div className="mnav-scrim" onClick={() => setOpen(false)} />
          <div className="mnav-panel">
            <div className="mnav-head">
              <span className="brand" style={{ fontSize: 21 }}>
                <span className="mark" style={{ width: 26, height: 26, fontSize: 15 }}>H</span>
                Health<em style={{ fontStyle: "normal" }}>Matics</em>
              </span>
              <button
                type="button"
                className="icon-btn"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            <Link href="/#latest" onClick={() => setOpen(false)}>News</Link>
            <Link href="/#analysis" onClick={() => setOpen(false)}>Analysis</Link>
            <Link href="/#research" onClick={() => setOpen(false)}>Research</Link>
            <Link href="/#events" onClick={() => setOpen(false)}>Events</Link>
            <Link href="/resources" onClick={() => setOpen(false)}>Resources</Link>
            <Link href="/#nl" onClick={() => setOpen(false)}>Newsletters</Link>
            <Link href="/#advertise" onClick={() => setOpen(false)}>For Marketers</Link>
            <div style={{ marginTop: 20 }}>
              <Link
                href="/#nl"
                className="btn btn-primary"
                style={{ width: "100%", justifyContent: "center" }}
                onClick={() => setOpen(false)}
              >
                Subscribe free
              </Link>
            </div>
          </div>
        </div>,
        document.body,
      )
    : null;

  return (
    <>
      <button
        type="button"
        className="icon-btn menu-toggle"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>
      {panel}
    </>
  );
}
