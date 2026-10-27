"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { RESOURCE_NAV } from "@/lib/resources/constants";

export default function ResourcesDropdown() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | null>(null);
  const menuId = useId();

  function clearClose() {
    if (closeTimer.current != null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  function openMenu() {
    clearClose();
    setOpen(true);
  }

  function scheduleClose() {
    clearClose();
    closeTimer.current = window.setTimeout(() => setOpen(false), 140);
  }

  useEffect(() => () => clearClose(), []);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={wrapRef}
      className={`nav-dd${open ? " is-open" : ""}`}
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
    >
      <Link
        href="/resources"
        className="nav-dd-trigger"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        onFocus={openMenu}
      >
        Resources
        <svg
          className="nav-dd-chevron"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          aria-hidden
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </Link>

      <div
        id={menuId}
        className="nav-dd-panel"
        role="menu"
        aria-label="Resources"
        aria-hidden={!open}
        onMouseEnter={openMenu}
        onMouseLeave={scheduleClose}
      >
        <p className="nav-dd-kicker">Browse library</p>
        <ul className="nav-dd-list">
          {RESOURCE_NAV.map((item) => (
            <li key={item.key} role="none">
              <Link
                href={item.href}
                role="menuitem"
                className="nav-dd-item"
                onClick={() => setOpen(false)}
              >
                <span className="nav-dd-item-label">{item.label}</span>
                <span className="nav-dd-item-arrow" aria-hidden>
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/resources"
          className="nav-dd-all"
          role="menuitem"
          onClick={() => setOpen(false)}
        >
          All resources
        </Link>
      </div>
    </div>
  );
}
