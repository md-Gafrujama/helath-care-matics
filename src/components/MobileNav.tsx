"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import BrandLogo from "@/components/BrandLogo";
import { HR_TOPICS } from "@/lib/topic-config";

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

  const close = () => setOpen(false);

  const panel =
    open && mounted
      ? createPortal(
          <div className="mnav open" role="dialog" aria-modal="true" aria-label="Site menu">
            <button type="button" className="mnav-scrim" aria-label="Close menu" onClick={close} />
            <div className="mnav-panel">
              <div className="mnav-head">
                <BrandLogo />
                <button type="button" className="icon-btn" aria-label="Close menu" onClick={close}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>
              <Link href="/#latest" onClick={close}>
                News
              </Link>
              <Link href="/#analysis" onClick={close}>
                Analysis
              </Link>
              <Link href="/#research" onClick={close}>
                Research
              </Link>
              <Link href="/resources" onClick={close}>
                Resources
              </Link>
              <Link href="/#nl" onClick={close}>
                Newsletters
              </Link>
              <Link href="/#advertise" onClick={close}>
                For Marketers
              </Link>

              <p className="mnav-section-label">Topics</p>
              {HR_TOPICS.map((topic) => (
                <Link
                  key={topic.slug}
                  href={`/topic/${topic.slug}`}
                  className={currentTopicSlug === topic.slug ? "active" : undefined}
                  onClick={close}
                >
                  {topic.navLabel}
                </Link>
              ))}

              <div style={{ marginTop: 20 }}>
                <Link
                  href="/#nl"
                  className="btn btn-primary"
                  style={{ width: "100%", justifyContent: "center" }}
                  onClick={close}
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
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" aria-hidden>
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>
      {panel}
    </>
  );
}
