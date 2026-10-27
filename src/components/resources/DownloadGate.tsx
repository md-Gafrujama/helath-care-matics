"use client";

import { useMemo, useState } from "react";
import ConsentCopy from "@/components/resources/ConsentCopy";
import {
  isOptOutConsent,
  SITE_NAME,
  type ResourceFormConfig,
} from "@/lib/resources/constants";
import { step2AdminFields } from "@/lib/resources/form-config";

type Props = {
  resourceId: string;
  resourceSlug: string;
  resourceTitle: string;
  resourceCategory: string;
  form: ResourceFormConfig;
};

export default function DownloadGate({
  resourceId,
  resourceSlug,
  resourceTitle,
  resourceCategory,
  form,
}: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [downloadId, setDownloadId] = useState<string | null>(null);
  const [fields, setFields] = useState<Record<string, string>>({
    first_name: "",
    last_name: "",
  });
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [consents, setConsents] = useState<Record<string, boolean>>({});
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const adminFields = useMemo(() => step2AdminFields(form), [form]);
  const visibleConsents = useMemo(
    () => form.consents.filter((c) => c.show),
    [form.consents],
  );

  const requiredConsentsOk = visibleConsents.every((c) => {
    if (isOptOutConsent(c)) return true;
    if (!c.required) return true;
    return Boolean(consents[c.id]);
  });

  async function onContinue(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setPending(true);
    try {
      const res = await fetch("/api/resources/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resourceId,
          email,
          saveOnly: true,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        id?: string;
        ok?: boolean;
      };
      if (!res.ok) throw new Error(data.error || "Could not continue");
      if (!data.id) throw new Error("Could not save lead");
      setDownloadId(data.id);
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not continue");
    } finally {
      setPending(false);
    }
  }

  async function onDownload(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!requiredConsentsOk) {
      setError("Please accept the required consents");
      return;
    }
    setPending(true);
    try {
      const res = await fetch("/api/resources/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resourceId,
          email,
          id: downloadId,
          saveOnly: false,
          fields,
          answers,
          consents,
        }),
      });

      const contentType = res.headers.get("Content-Type") || "";
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || "Download failed");
      }

      if (!contentType.includes("application/pdf")) {
        throw new Error("Unexpected response from server");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${resourceSlug || "download"}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed");
    } finally {
      setPending(false);
    }
  }

  async function downloadAgain() {
    setError("");
    setPending(true);
    try {
      const res = await fetch("/api/resources/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resourceId,
          email,
          id: downloadId,
          saveOnly: false,
          fields,
          answers,
          consents,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || "Download failed");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${resourceSlug || "download"}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="dl-panel" id="download">
      <p className="dl-panel-kicker">Free download</p>
      <h2 className="dl-panel-title">{resourceTitle}</h2>

      {step === 3 ? (
        <div className="dl-done">
          <p className="dl-done-msg">Download started</p>
          <button
            type="button"
            className="dl-btn"
            onClick={downloadAgain}
            disabled={pending}
          >
            {pending ? "Preparing…" : "Download PDF again"}
          </button>
          {error ? <p className="dl-error">{error}</p> : null}
        </div>
      ) : step === 1 ? (
        <form className="dl-form" onSubmit={onContinue}>
          <label className="dl-label" htmlFor="dl-email">
            Work email
          </label>
          <input
            id="dl-email"
            className="dl-input"
            type="email"
            name="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            disabled={pending}
          />
          <p className="dl-note">{form.emailNote}</p>
          {error ? <p className="dl-error">{error}</p> : null}
          <button type="submit" className="dl-btn" disabled={pending}>
            {pending ? "Saving…" : "Download"}
          </button>
        </form>
      ) : (
        <form className="dl-form" onSubmit={onDownload}>
          <label className="dl-label" htmlFor="dl-email-ro">
            Work email
          </label>
          <input
            id="dl-email-ro"
            className="dl-input"
            type="email"
            value={email}
            readOnly
          />
          <p className="dl-note">{form.emailNote}</p>

          <div className="dl-row">
            <div>
              <label className="dl-label" htmlFor="dl-fn">
                First name
              </label>
              <input
                id="dl-fn"
                className="dl-input"
                required
                value={fields.first_name || ""}
                onChange={(e) =>
                  setFields((f) => ({ ...f, first_name: e.target.value }))
                }
                disabled={pending}
              />
            </div>
            <div>
              <label className="dl-label" htmlFor="dl-ln">
                Last name
              </label>
              <input
                id="dl-ln"
                className="dl-input"
                required
                value={fields.last_name || ""}
                onChange={(e) =>
                  setFields((f) => ({ ...f, last_name: e.target.value }))
                }
                disabled={pending}
              />
            </div>
          </div>

          {adminFields.map((field) => (
            <div key={field.key}>
              <label className="dl-label" htmlFor={`dl-${field.key}`}>
                {field.label}
                {field.required ? "" : " (optional)"}
              </label>
              <input
                id={`dl-${field.key}`}
                className="dl-input"
                required={field.required}
                value={fields[field.key] || ""}
                onChange={(e) =>
                  setFields((f) => ({ ...f, [field.key]: e.target.value }))
                }
                disabled={pending}
                autoComplete={
                  field.key === "phone"
                    ? "tel"
                    : field.key === "zip"
                      ? "postal-code"
                      : undefined
                }
              />
            </div>
          ))}

          {form.questions.map((q) => {
            const opts = (q.options ?? []).filter(Boolean);
            const useSelect = opts.length >= 2;
            return (
              <div key={q.id}>
                <label className="dl-label" htmlFor={`dl-q-${q.id}`}>
                  {q.text}
                </label>
                {useSelect ? (
                  <select
                    id={`dl-q-${q.id}`}
                    className="dl-input"
                    required
                    value={answers[q.id] || ""}
                    onChange={(e) =>
                      setAnswers((a) => ({ ...a, [q.id]: e.target.value }))
                    }
                    disabled={pending}
                  >
                    <option value="">Select…</option>
                    {opts.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={`dl-q-${q.id}`}
                    className="dl-input"
                    required
                    value={answers[q.id] || ""}
                    onChange={(e) =>
                      setAnswers((a) => ({ ...a, [q.id]: e.target.value }))
                    }
                    disabled={pending}
                  />
                )}
              </div>
            );
          })}

          <div className="dl-consents">
            {visibleConsents.map((c) => (
              <label key={c.id} className="dl-check">
                <input
                  type="checkbox"
                  checked={Boolean(consents[c.id])}
                  onChange={(e) =>
                    setConsents((prev) => ({
                      ...prev,
                      [c.id]: e.target.checked,
                    }))
                  }
                  disabled={pending}
                />
                <span>
                  <ConsentCopy text={c.text} />
                </span>
              </label>
            ))}
          </div>

          {error ? <p className="dl-error">{error}</p> : null}

          <button
            type="submit"
            className="dl-btn"
            disabled={pending || !requiredConsentsOk}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M12 3v12" />
              <path d="M7 10l5 5 5-5" />
              <path d="M5 21h14" />
            </svg>
            {pending ? "Preparing…" : "Download Now"}
          </button>

          <p className="dl-footer-line">
            <ConsentCopy
              text={
                form.footerLine ||
                `I have read and understood privacy statement of ${SITE_NAME}.`
              }
            />
          </p>
          <p className="sr-only">
            {resourceCategory} {resourceSlug}
          </p>
        </form>
      )}
    </div>
  );
}
