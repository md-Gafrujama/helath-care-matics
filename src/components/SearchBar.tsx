"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";

interface SearchHit {
  title: string;
  href: string;
  topic: string | null;
}

export default function SearchBar() {
  const router = useRouter();
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchHit[]>([]);
  const [loading, setLoading] = useState(false);

  const closeSearch = useCallback(() => {
    setOpen(false);
    setQuery("");
    setResults([]);
    setLoading(false);
  }, []);

  const openSearch = useCallback(() => {
    setOpen(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 30);
    return () => window.clearTimeout(t);
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
    const timer = window.setTimeout(async () => {
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
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query, open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        e.preventDefault();
        closeSearch();
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openSearch();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeSearch, open, openSearch]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) closeSearch();
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open, closeSearch]);

  return (
    <div
      ref={rootRef}
      className={`search${open ? " is-open" : ""}`}
    >
      {!open ? (
        <button
          type="button"
          className="icon-btn search-trigger"
          aria-label="Open search"
          aria-expanded={false}
          aria-controls={panelId}
          onClick={openSearch}
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
      ) : (
        <div className="search-nav" id={panelId}>
          <form
            className="search-nav-form"
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
              className="search-nav-icon"
              width="16"
              height="16"
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
              placeholder="Search stories…"
              aria-label="Search HealthMatics"
              aria-expanded={query.trim().length >= 2}
              aria-controls={`${panelId}-results`}
              autoComplete="off"
            />
            <kbd className="search-nav-kbd">Esc</kbd>
            <button
              type="button"
              className="search-nav-close"
              aria-label="Close search"
              onClick={closeSearch}
            >
              ×
            </button>
          </form>

          <div
            className="search-nav-panel"
            id={`${panelId}-results`}
            role="listbox"
            hidden={query.trim().length < 2 && !loading}
          >
            {query.trim().length < 2 ? null : loading ? (
              <p className="search-nav-empty">Searching…</p>
            ) : results.length === 0 ? (
              <p className="search-nav-empty">
                No matches for &ldquo;{query}&rdquo;
              </p>
            ) : (
              results.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="search-nav-hit"
                  role="option"
                  onClick={closeSearch}
                >
                  {item.topic ? (
                    <span className="search-nav-hit-topic">{item.topic}</span>
                  ) : null}
                  <span className="search-nav-hit-title">{item.title}</span>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
