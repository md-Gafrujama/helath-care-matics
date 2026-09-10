"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface SearchHit {
  title: string;
  href: string;
  topic: string | null;
}

export default function SearchBar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const closeSearch = useCallback(() => {
    setOpen(false);
    setQuery("");
    setResults([]);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 20);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        setResults(data.results ?? []);
      } catch {
        // aborted or network error
      } finally {
        setLoading(false);
      }
    }, 200);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSearch();
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeSearch]);

  const overlay =
    open && mounted
      ? createPortal(
          <div className="search-overlay" role="dialog" aria-modal="true" aria-label="Search">
            <button
              type="button"
              className="search-overlay-scrim"
              aria-label="Close search"
              onClick={closeSearch}
            />
            <div className="search-box">
              <form
                className="search-form"
                role="search"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (results[0]) {
                    router.push(results[0].href);
                    closeSearch();
                  }
                }}
              >
                <svg
                  className="search-icon"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-4-4" />
                </svg>
                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search stories, topics..."
                  aria-label="Search HealthMatics"
                  autoComplete="off"
                />
                <kbd className="search-kbd">Esc</kbd>
                <button
                  type="button"
                  className="search-close"
                  aria-label="Close search"
                  onClick={closeSearch}
                >
                  ×
                </button>
              </form>

              <div className="search-panel" role="listbox">
                {query.trim().length < 2 ? (
                  <p className="search-empty">Type at least 2 characters to search.</p>
                ) : loading ? (
                  <p className="search-empty">Searching...</p>
                ) : results.length === 0 ? (
                  <p className="search-empty">
                    No matches for &ldquo;{query}&rdquo;
                  </p>
                ) : (
                  results.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="search-hit"
                      role="option"
                      onClick={closeSearch}
                    >
                      {item.topic && (
                        <span className="search-hit-topic">{item.topic}</span>
                      )}
                      <span className="search-hit-title">{item.title}</span>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <div className="search">
      <button
        type="button"
        className="icon-btn search-trigger"
        aria-label="Open search"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4-4" />
        </svg>
      </button>
      {overlay}
    </div>
  );
}
