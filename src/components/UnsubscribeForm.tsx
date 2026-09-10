"use client";

import { useState, type FormEvent } from "react";

const REASONS = [
  {
    id: "not-relevant",
    label: "The coverage no longer matches what I follow.",
  },
  {
    id: "delivery",
    label: "Emails are hard to open or keep landing in spam.",
  },
  {
    id: "too-many",
    label: "I am getting more messages than I need right now.",
  },
  {
    id: "unknown",
    label: "I do not recall signing up for these emails.",
  },
  {
    id: "other",
    label: "Something else.",
  },
] as const;

export default function UnsubscribeForm() {
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState<string>(REASONS[0].id);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<"ok" | "already" | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          reason: REASONS.find((r) => r.id === reason)?.label ?? reason,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        already?: boolean;
      };
      if (!res.ok) {
        throw new Error(data.error || "Could not unsubscribe");
      }
      setDone(data.already ? "already" : "ok");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not unsubscribe");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="unsub-result" role="status">
        <div className="unsub-result-icon" aria-hidden>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12.5l4.5 4.5L19 7.5"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2>{done === "already" ? "Already unsubscribed" : "You are unsubscribed"}</h2>
        <p>
          {done === "already"
            ? "That email is already off the HealthMatics list. You will not receive further briefs."
            : "You will no longer receive HealthMatics briefs. You can subscribe again anytime from the site."}
        </p>
        <a href="/" className="unsub-btn unsub-btn--ghost">
          Back to HealthMatics
        </a>
      </div>
    );
  }

  return (
    <form className="unsub-form" onSubmit={onSubmit} noValidate>
      <p className="unsub-lede">
        Enter the email you used to subscribe. We will remove it from the
        HealthMatics list.
      </p>

      <label className="unsub-label" htmlFor="unsub-email">
        Email
      </label>
      <input
        id="unsub-email"
        className="unsub-input"
        type="email"
        name="email"
        autoComplete="email"
        placeholder="you@yourcompany.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={busy}
      />

      <fieldset className="unsub-reasons" disabled={busy}>
        <legend className="unsub-label">
          Why are you leaving? <span>(helps us improve)</span>
        </legend>
        <div className="unsub-reason-list">
          {REASONS.map((item) => (
            <label key={item.id} className="unsub-reason">
              <input
                type="radio"
                name="reason"
                value={item.id}
                checked={reason === item.id}
                onChange={() => setReason(item.id)}
              />
              <span className="unsub-radio" aria-hidden />
              <span className="unsub-reason-text">{item.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {error && (
        <p className="unsub-error" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="unsub-btn" disabled={busy || !email.trim()}>
        {busy ? "Unsubscribing…" : "Unsubscribe"}
      </button>
    </form>
  );
}
