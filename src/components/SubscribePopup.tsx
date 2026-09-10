"use client";

import { useEffect, useId, useRef, useState } from "react";
import { SUBSCRIBED_KEY, submitSubscribe } from "@/lib/subscribe-client";

export default function SubscribePopup({
  articleId,
  articleSlug,
  articleTitle,
  topicId,
  topicSlug,
  topicName,
}: {
  articleId?: string;
  articleSlug?: string;
  articleTitle?: string;
  topicId?: string;
  topicSlug?: string;
  topicName?: string;
}) {
  const titleId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(SUBSCRIBED_KEY) === "1") return;

    const timer = window.setTimeout(() => setOpen(true), 8000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => inputRef.current?.focus(), 80);

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prev;
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = inputRef.current?.value.trim() ?? "";
    setError("");
    setPending(true);
    try {
      await submitSubscribe({
        email,
        source: "popup",
        articleId,
        articleSlug,
        articleTitle,
        topicId,
        topicSlug,
        topicName,
      });
      try {
        window.localStorage.setItem(SUBSCRIBED_KEY, "1");
      } catch {
        // ignore
      }
      setDone(true);
      window.setTimeout(() => setOpen(false), 1600);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not subscribe");
    } finally {
      setPending(false);
    }
  }

  if (!open) return null;

  return (
    <div className="subpop" role="presentation">
      <button
        type="button"
        className="subpop-backdrop"
        aria-label="Close subscribe popup"
        onClick={() => setOpen(false)}
      />
      <div
        className="subpop-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button
          type="button"
          className="subpop-close"
          aria-label="Close"
          onClick={() => setOpen(false)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="subpop-grid">
          <aside className="subpop-aside">
            <span className="subpop-mark" aria-hidden>
              H
            </span>
            <p className="subpop-aside-kicker">HealthMatics Brief</p>
            <h3>Stay ahead of healthcare&apos;s next move</h3>
            <ul className="subpop-perks">
              <li>Daily curated news</li>
              <li>Executive-ready analysis</li>
              <li>Free, unsubscribe anytime</li>
            </ul>
          </aside>

          <div className="subpop-body">
            <p className="subpop-kicker">Subscribe free</p>
            <h2 id={titleId}>
              {done ? "You’re subscribed" : "Get the daily brief"}
            </h2>
            <p className="subpop-copy">
              {done
                ? "Thanks, watch your inbox for the next HealthMatics brief."
                : articleTitle
                  ? "Reading this story? Get the next one delivered before it hits the homepage."
                  : "Concise healthcare news and analysis for busy decision makers."}
            </p>

            {!done ? (
              <form className="subpop-form" onSubmit={onSubmit}>
                <label htmlFor="article-sub-email">Work email</label>
                <input
                  ref={inputRef}
                  id="article-sub-email"
                  type="email"
                  name="email"
                  placeholder="you@organization.com"
                  required
                  autoComplete="email"
                  disabled={pending}
                />
                <button type="submit" className="subpop-btn" disabled={pending}>
                  {pending ? "Saving…" : "Subscribe now"}
                </button>
              </form>
            ) : (
              <div className="subpop-success" aria-live="polite">
                <span className="subpop-check" aria-hidden>✓</span>
                You’re on the list
              </div>
            )}

            {error ? (
              <p className="subpop-note subpop-note--error">{error}</p>
            ) : (
              !done && (
                <p className="subpop-note">
                  No spam. One email on weekdays.
                </p>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
