"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { useFormStatus } from "react-dom";
import ConsentCopy from "@/components/resources/ConsentCopy";
import { saveResource } from "@/lib/actions/resources";
import {
  FORM_FIELD_OPTIONS,
  RESOURCE_CATEGORIES,
  RESOURCE_CATEGORY_META,
  RESOURCE_VERTICALS,
  SITE_NAME,
  defaultFormConfig,
  type FormFieldKey,
  type ResourceConsent,
  type ResourceInsideSection,
} from "@/lib/resources/constants";
import { parseFormConfig } from "@/lib/resources/form-config";
import { createClient } from "@/lib/supabase/client";
import type { Resource } from "@/types/database";

const MAX_FIELDS = 12;
const MAX_EXTRA_CONSENTS = 8;
const MAX_QUESTIONS = 20;
const DESCRIPTION_MAX = 220;

type FieldDraft = { key: FormFieldKey; required: boolean };
type QuestionDraft = { id: string; text: string; options: string[] };
const MAX_OPTIONS = 8;
const OPTION_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
type CoreConsentKind = "terms" | "partners" | "optout";
type FormStep = "details" | "download" | "seo";

const STEPS: { id: FormStep; label: string; hint: string }[] = [
  { id: "details", label: "Details", hint: "Files & metadata" },
  { id: "download", label: "Download form", hint: "Fields & consent" },
  { id: "seo", label: "SEO & page", hint: "Slug & sections" },
];

const TOKEN_CHIPS = [
  { label: "{terms}", insert: "{{terms}}" },
  { label: "{privacy}", insert: "{{privacy}}" },
  { label: "{privacy-statement}", insert: "{{privacy-statement}}" },
  { label: "{unsubscribe}", insert: "{{unsubscribe}}" },
  { label: "{publisher}", insert: "{{publisher}}" },
  { label: "{text|/path}", insert: "{label|/privacy}" },
] as const;

const CORE_META: {
  kind: CoreConsentKind;
  title: string;
  hint?: string;
}[] = [
  { kind: "terms", title: "Terms checkbox" },
  { kind: "partners", title: "Partners checkbox" },
  {
    kind: "optout",
    title: "Opt-out checkbox",
    hint: "Optional. Visitors can leave this unchecked and still download. Checking it stops further emails.",
  },
];

function fieldLabel(key: FormFieldKey): string {
  return FORM_FIELD_OPTIONS.find((o) => o.key === key)?.label ?? key;
}

function newId(): string {
  return crypto.randomUUID();
}

function seoString(seo: Record<string, unknown> | undefined, key: string) {
  const v = seo?.[key];
  return typeof v === "string" ? v : "";
}

function parseInsideSections(
  seo: Record<string, unknown> | undefined,
): ResourceInsideSection[] {
  const raw = seo?.insideSections;
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (s): s is Record<string, unknown> => Boolean(s) && typeof s === "object",
    )
    .map((s) => ({
      id: typeof s.id === "string" ? s.id : newId(),
      heading: typeof s.heading === "string" ? s.heading : "",
      copy: typeof s.copy === "string" ? s.copy : "",
    }));
}

function insertAtCursor(
  el: HTMLTextAreaElement | HTMLInputElement | null,
  value: string,
  insert: string,
  setValue: (next: string) => void,
) {
  if (!el) {
    setValue(value + insert);
    return;
  }
  const start = el.selectionStart ?? value.length;
  const end = el.selectionEnd ?? value.length;
  const next = value.slice(0, start) + insert + value.slice(end);
  setValue(next);
  requestAnimationFrame(() => {
    el.focus();
    const pos = start + insert.length;
    el.setSelectionRange(pos, pos);
  });
}

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function TokenChips({ onInsert }: { onInsert: (token: string) => void }) {
  return (
    <div className="rf-token-chips" aria-label="Insert link tokens">
      {TOKEN_CHIPS.map((t) => (
        <button
          key={t.label}
          type="button"
          className="rf-token-chip"
          onClick={() => onInsert(t.insert)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

function SaveButton({
  isEdit,
  status,
}: {
  isEdit: boolean;
  status: "draft" | "published";
}) {
  const { pending } = useFormStatus();
  const label = isEdit
    ? "Save changes"
    : status === "published"
      ? "Publish resource"
      : "Save draft";
  return (
    <button type="submit" className="rf-save-btn" disabled={pending}>
      {pending ? (
        <>
          <span className="rf-save-spinner" aria-hidden />
          Saving…
        </>
      ) : (
        label
      )}
    </button>
  );
}

function FileDropzone({
  id,
  name,
  label,
  accept,
  required,
  kind,
  existingUrl,
  existingLabel,
}: {
  id: string;
  name: string;
  label: string;
  accept: string;
  required: boolean;
  kind: "pdf" | "image";
  existingUrl?: string | null;
  existingLabel?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    kind === "image" && existingUrl ? existingUrl : null,
  );
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (!file || kind !== "image") return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file, kind]);

  function pick(next: File | null) {
    if (!next) return;
    if (kind === "pdf" && next.type !== "application/pdf") return;
    if (kind === "image" && !next.type.startsWith("image/")) return;
    setFile(next);
    if (inputRef.current) {
      const dt = new DataTransfer();
      dt.items.add(next);
      inputRef.current.files = dt.files;
    }
  }

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    pick(e.target.files?.[0] ?? null);
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    pick(e.dataTransfer.files?.[0] ?? null);
  }

  const hasFile = Boolean(file);
  const hasExisting = Boolean(existingUrl) && !hasFile;

  return (
    <div className="rf-drop">
      <div className="rf-drop-label-row">
        <label htmlFor={id}>{label}</label>
        {required && !existingUrl ? (
          <span className="rf-req">Required</span>
        ) : null}
      </div>
      <div
        className={`rf-dropzone${dragging ? " is-dragging" : ""}${hasFile || hasExisting ? " has-file" : ""}`}
        onDragEnter={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={`${label} upload`}
      >
        <input
          ref={inputRef}
          id={id}
          name={name}
          type="file"
          accept={accept}
          required={required && !existingUrl}
          onChange={onInputChange}
          className="rf-drop-input"
        />

        {kind === "image" && preview ? (
          <div className="rf-drop-preview">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="" />
            <div className="rf-drop-preview-meta">
              <strong>{file?.name || existingLabel || "Thumbnail"}</strong>
              <span>
                {file
                  ? formatBytes(file.size)
                  : existingUrl
                    ? "Current file — click to replace"
                    : ""}
              </span>
            </div>
          </div>
        ) : hasFile || hasExisting ? (
          <div className="rf-drop-file">
            <span className="rf-drop-icon" aria-hidden>
              {kind === "pdf" ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M7 3h7l5 5v13H7V3z" />
                  <path d="M14 3v5h5" />
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <circle cx="8.5" cy="10" r="1.5" />
                  <path d="M21 16l-5.5-5.5L7 19" />
                </svg>
              )}
            </span>
            <div className="rf-drop-preview-meta">
              <strong>{file?.name || existingLabel || "File attached"}</strong>
              <span>
                {file
                  ? formatBytes(file.size)
                  : existingUrl
                    ? "Current file — click to replace"
                    : ""}
              </span>
            </div>
          </div>
        ) : (
          <div className="rf-drop-empty">
            <span className="rf-drop-icon rf-drop-icon--lg" aria-hidden>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M12 16V5" />
                <path d="M8 9l4-4 4 4" />
                <path d="M4 19h16" />
              </svg>
            </span>
            <strong>Drop {kind === "pdf" ? "PDF" : "image"} here</strong>
            <span>or click to browse</span>
          </div>
        )}
      </div>
      {existingUrl && !file ? (
        <a
          className="rf-drop-link"
          href={existingUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          Open current file ↗
        </a>
      ) : null}
    </div>
  );
}

export default function ResourceForm({
  resource,
}: {
  resource?: Resource | null;
}) {
  const initial = parseFormConfig(resource?.form_config ?? defaultFormConfig());
  const defaults = defaultFormConfig();

  const [step, setStep] = useState<FormStep>("details");
  const [fields, setFields] = useState<FieldDraft[]>(
    initial.fields.map((f) => ({ key: f.key, required: f.required })),
  );
  const [emailNote, setEmailNote] = useState(initial.emailNote);
  const [footerLine, setFooterLine] = useState(initial.footerLine);
  const [coreConsents, setCoreConsents] = useState<
    Record<CoreConsentKind, ResourceConsent>
  >(() => {
    const pick = (kind: CoreConsentKind): ResourceConsent => {
      const found = initial.consents.find((c) => c.kind === kind);
      if (found) return found;
      const fallback = defaults.consents.find((c) => c.kind === kind);
      return (
        fallback ?? {
          id: kind,
          kind,
          show: true,
          required: kind !== "optout",
          text: "",
        }
      );
    };
    return {
      terms: pick("terms"),
      partners: pick("partners"),
      optout: pick("optout"),
    };
  });
  const [extraConsents, setExtraConsents] = useState<ResourceConsent[]>(
    initial.consents.filter((c) => c.kind === "extra"),
  );
  const [questions, setQuestions] = useState<QuestionDraft[]>(
    initial.questions.map((q) => ({
      id: q.id,
      text: q.text,
      options:
        q.options && q.options.length > 0
          ? q.options
          : ["", ""],
    })),
  );

  const [description, setDescription] = useState(resource?.description ?? "");
  const [title, setTitle] = useState(resource?.title ?? "");
  const [slug, setSlug] = useState(resource?.slug ?? "");
  const [status, setStatus] = useState<"draft" | "published">(
    resource?.status === "published" ? "published" : "draft",
  );
  const [vertical, setVertical] = useState(
    resource?.vertical ?? RESOURCE_VERTICALS[0],
  );
  const [verticalQuery, setVerticalQuery] = useState("");
  const [seoMode, setSeoMode] = useState<"claude" | "manual">(
    seoString(resource?.seo, "seoMode") === "claude" ? "claude" : "manual",
  );
  const [metaTitle, setMetaTitle] = useState(
    seoString(resource?.seo, "metaTitle"),
  );
  const [metaDescription, setMetaDescription] = useState(
    seoString(resource?.seo, "metaDescription"),
  );
  const [keywords, setKeywords] = useState(seoString(resource?.seo, "keywords"));
  const [overview, setOverview] = useState(resource?.overview ?? "");
  const [insideSections, setInsideSections] = useState<ResourceInsideSection[]>(
    () => parseInsideSections(resource?.seo),
  );
  const [seoPending, setSeoPending] = useState(false);
  const [seoError, setSeoError] = useState<string | null>(null);

  const emailNoteRef = useRef<HTMLInputElement>(null);
  const footerRef = useRef<HTMLInputElement>(null);
  const consentRefs = useRef<Record<string, HTMLTextAreaElement | null>>({});
  const stepRefs = useRef<Record<FormStep, HTMLElement | null>>({
    details: null,
    download: null,
    seo: null,
  });

  const usedKeys = new Set(fields.map((f) => f.key));
  const nextUnused = FORM_FIELD_OPTIONS.find((o) => !usedKeys.has(o.key));

  const filteredVerticals = useMemo(() => {
    const q = verticalQuery.trim().toLowerCase();
    const list = [...RESOURCE_VERTICALS];
    if (
      resource?.vertical &&
      !list.includes(resource.vertical as (typeof RESOURCE_VERTICALS)[number])
    ) {
      list.unshift(
        resource.vertical as (typeof RESOURCE_VERTICALS)[number],
      );
    }
    if (!q) return list;
    return list.filter((v) => v.toLowerCase().includes(q));
  }, [verticalQuery, resource?.vertical]);

  function goToStep(next: FormStep) {
    setStep(next);
    requestAnimationFrame(() => {
      stepRefs.current[next]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }

  function addField() {
    if (fields.length >= MAX_FIELDS || !nextUnused) return;
    setFields([...fields, { key: nextUnused.key, required: true }]);
  }

  function updateField(index: number, patch: Partial<FieldDraft>) {
    setFields(fields.map((f, i) => (i === index ? { ...f, ...patch } : f)));
  }

  function updateCore(kind: CoreConsentKind, patch: Partial<ResourceConsent>) {
    setCoreConsents({
      ...coreConsents,
      [kind]: { ...coreConsents[kind], ...patch },
    });
  }

  function updateExtra(index: number, patch: Partial<ResourceConsent>) {
    setExtraConsents(
      extraConsents.map((c, i) => (i === index ? { ...c, ...patch } : c)),
    );
  }

  async function fillClaudeSeo() {
    setSeoError(null);
    if (!title.trim() || !description.trim()) {
      setSeoError("Add a title and description in Details first.");
      goToStep("details");
      return;
    }
    if (!vertical.trim()) {
      setSeoError("Select a vertical in Details first.");
      goToStep("details");
      return;
    }

    const categoryEl = document.getElementById(
      "category",
    ) as HTMLSelectElement | null;
    const offeredEl = document.getElementById(
      "offered_by",
    ) as HTMLInputElement | null;

    setSeoPending(true);
    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error("Session expired — refresh and sign in again.");
      }

      const res = await fetch("/api/admin/generate-resource-seo", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          category: categoryEl?.value || "whitepaper",
          vertical,
          offered_by: offeredEl?.value?.trim() || SITE_NAME,
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        slug?: string;
        metaTitle?: string;
        metaDescription?: string;
        keywords?: string;
        overview?: string;
      };
      if (!res.ok || !data.ok) {
        throw new Error(
          res.status === 401
            ? "Unauthorized — refresh and sign in again."
            : data.error || "Claude SEO failed",
        );
      }
      if (data.slug) setSlug(data.slug);
      if (data.metaTitle) setMetaTitle(data.metaTitle);
      if (data.metaDescription) setMetaDescription(data.metaDescription);
      if (data.keywords) setKeywords(data.keywords);
      if (data.overview?.trim()) setOverview(data.overview.trim());
      setSeoMode("manual");
    } catch (err) {
      setSeoError(err instanceof Error ? err.message : "Claude SEO failed");
    } finally {
      setSeoPending(false);
    }
  }

  const formConfigJson = JSON.stringify({
    fields: fields.map((f) => ({
      key: f.key,
      label: fieldLabel(f.key),
      required: f.required,
    })),
    emailNote,
    consents: [
      { ...coreConsents.terms, required: true },
      { ...coreConsents.partners, required: true },
      { ...coreConsents.optout, required: false },
      ...extraConsents.filter((c) => c.text.trim()),
    ],
    footerLine,
    questions: questions
      .filter((q) => q.text.trim())
      .map((q) => {
        const options = q.options.map((o) => o.trim()).filter(Boolean);
        return {
          id: q.id,
          text: q.text.trim(),
          options: options.length >= 2 ? options : undefined,
        };
      }),
  });

  const seoJson = JSON.stringify({
    ...(resource?.seo ?? {}),
    seoMode,
    metaTitle: metaTitle.trim(),
    metaDescription: metaDescription.trim(),
    keywords: keywords.trim(),
    insideSections: insideSections
      .filter((s) => s.heading.trim() || s.copy.trim())
      .map((s) => ({
        id: s.id,
        heading: s.heading.trim(),
        copy: s.copy.trim(),
      })),
  });

  const descPct = Math.min(100, (description.length / DESCRIPTION_MAX) * 100);

  return (
    <form action={saveResource} className="rf-form admin-form">
      <input type="hidden" name="id" value={resource?.id ?? ""} />
      <input type="hidden" name="form_config" value={formConfigJson} />
      <input type="hidden" name="seo" value={seoJson} />
      <input type="hidden" name="vertical" value={vertical} />
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="overview" value={overview} />
      <input type="hidden" name="status" value={status} />

      <nav className="rf-steps" aria-label="Form sections">
        {STEPS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            className={`rf-step${step === s.id ? " is-active" : ""}`}
            onClick={() => goToStep(s.id)}
          >
            <span className="rf-step-num">{i + 1}</span>
            <span className="rf-step-copy">
              <strong>{s.label}</strong>
              <span>{s.hint}</span>
            </span>
          </button>
        ))}
      </nav>

      {/* —— Details —— */}
      <section
        className="rf-panel"
        id="rf-step-details"
        ref={(el) => {
          stepRefs.current.details = el;
        }}
      >
        <header className="rf-panel-head">
          <div>
            <p className="rf-panel-kicker">Step 1</p>
            <h2>Resource details</h2>
            <p>Upload the PDF, set the cover, and fill the basics visitors see.</p>
          </div>
          <div className="rf-status-toggle" role="group" aria-label="Status">
            <button
              type="button"
              className={status === "draft" ? "is-active" : undefined}
              onClick={() => setStatus("draft")}
            >
              Draft
            </button>
            <button
              type="button"
              className={status === "published" ? "is-active is-live" : undefined}
              onClick={() => setStatus("published")}
            >
              Published
            </button>
          </div>
        </header>

        <div className="rf-grid-2">
          <div className="field">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              defaultValue={resource?.category ?? "whitepaper"}
              required
            >
              {RESOURCE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {RESOURCE_CATEGORY_META[c].label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. AI readiness for health systems"
              required
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="description">
            Description
            <span
              className={`seo-count ${description.length > DESCRIPTION_MAX - 20 ? "is-warn" : ""} ${description.length >= DESCRIPTION_MAX ? "is-over" : ""}`}
            >
              {description.length}/{DESCRIPTION_MAX}
            </span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            maxLength={DESCRIPTION_MAX}
            value={description}
            onChange={(e) =>
              setDescription(e.target.value.slice(0, DESCRIPTION_MAX))
            }
            placeholder="One short paragraph for cards and SEO."
            required
          />
          <div className="rf-meter" aria-hidden>
            <span style={{ width: `${descPct}%` }} />
          </div>
        </div>

        <div className="field">
          <label htmlFor="vertical-search">Vertical</label>
          <input
            id="vertical-search"
            type="search"
            placeholder="Search verticals"
            value={verticalQuery}
            onChange={(e) => setVerticalQuery(e.target.value)}
            autoComplete="off"
          />
          <div className="rf-vertical-list" role="listbox" aria-label="Verticals">
            {filteredVerticals.map((v) => (
              <button
                key={v}
                type="button"
                role="option"
                aria-selected={vertical === v}
                className={
                  vertical === v
                    ? "rf-vertical-option is-selected"
                    : "rf-vertical-option"
                }
                onClick={() => {
                  setVertical(v);
                  setVerticalQuery("");
                }}
              >
                {v}
              </button>
            ))}
            {filteredVerticals.length === 0 ? (
              <p className="field-hint">No verticals match.</p>
            ) : null}
          </div>
        </div>

        <div className="rf-uploads">
          <FileDropzone
            id="pdf"
            name="pdf"
            label="PDF"
            accept="application/pdf"
            required={!resource?.pdf_url}
            kind="pdf"
            existingUrl={resource?.pdf_url}
            existingLabel="Current PDF"
          />
          <FileDropzone
            id="cover"
            name="cover"
            label="Thumbnail"
            accept="image/png,image/jpeg,image/webp"
            required={!resource?.cover_url}
            kind="image"
            existingUrl={resource?.cover_url}
            existingLabel="Current thumbnail"
          />
        </div>

        <div className="rf-grid-2">
          <div className="field">
            <label htmlFor="offered_by">Offered by</label>
            <input
              id="offered_by"
              name="offered_by"
              defaultValue={resource?.offered_by ?? SITE_NAME}
            />
          </div>
          <div className="field">
            <label htmlFor="author_name">Author</label>
            <input
              id="author_name"
              name="author_name"
              defaultValue={resource?.author_name ?? ""}
              placeholder="Optional"
            />
          </div>
        </div>

        <div className="rf-panel-nav">
          <span />
          <button
            type="button"
            className="rf-next"
            onClick={() => goToStep("download")}
          >
            Next: Download form →
          </button>
        </div>
      </section>

      {/* —— Download form —— */}
      <section
        className="rf-panel rf-panel--download"
        id="rf-step-download"
        ref={(el) => {
          stepRefs.current.download = el;
        }}
      >
        <header className="rf-panel-head">
          <div>
            <p className="rf-panel-kicker">Step 2</p>
            <h2>Download form</h2>
            <p>
              These fields and checkboxes are what visitors see. Add a section
              or checkbox, then save.
            </p>
          </div>
        </header>

        <div className="rf-block">
          <h3>Form sections</h3>
          <p className="field-hint">
            Zip and phone are on by default. First and last name always appear
            on step 2 for visitors.
          </p>
          {fields.map((f, i) => (
            <div className="rf-row" key={`${f.key}-${i}`}>
              <select
                aria-label={`Section ${i + 1} field`}
                value={f.key}
                onChange={(e) =>
                  updateField(i, { key: e.target.value as FormFieldKey })
                }
              >
                {FORM_FIELD_OPTIONS.map((o) => (
                  <option
                    key={o.key}
                    value={o.key}
                    disabled={o.key !== f.key && usedKeys.has(o.key)}
                  >
                    {o.label}
                  </option>
                ))}
              </select>
              <label className="rf-check">
                <input
                  type="checkbox"
                  checked={f.required}
                  onChange={(e) =>
                    updateField(i, { required: e.target.checked })
                  }
                />
                Required
              </label>
              <button
                type="button"
                className="rf-icon-btn"
                aria-label="Remove section"
                onClick={() => setFields(fields.filter((_, j) => j !== i))}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="rf-add"
            onClick={addField}
            disabled={fields.length >= MAX_FIELDS || !nextUnused}
          >
            + Add section
          </button>
        </div>

        <div className="rf-block">
          <h3>Consent text</h3>
          <p className="field-hint">
            Use the green chips to drop a link into the sentence.{" "}
            <code>**text**</code> is bold.
          </p>

          <div className="field">
            <label htmlFor="rf-email-note">Email note</label>
            <input
              ref={emailNoteRef}
              id="rf-email-note"
              type="text"
              value={emailNote}
              onChange={(e) => setEmailNote(e.target.value)}
            />
          </div>

          {CORE_META.map(({ kind, title: cTitle, hint }) => {
            const c = coreConsents[kind];
            return (
              <div className="rf-consent" key={kind}>
                <div className="rf-consent-head">
                  <span>
                    {cTitle}
                    {kind === "optout" ? (
                      <span className="rf-optional-pill">Optional</span>
                    ) : null}
                  </span>
                  <label className="rf-check">
                    <input
                      type="checkbox"
                      checked={c.show}
                      onChange={(e) =>
                        updateCore(kind, { show: e.target.checked })
                      }
                    />
                    Show
                  </label>
                </div>
                {hint ? <p className="field-hint">{hint}</p> : null}
                <label className="rf-mini-label">Text</label>
                <textarea
                  ref={(el) => {
                    consentRefs.current[kind] = el;
                  }}
                  rows={3}
                  aria-label={`${cTitle} text`}
                  value={c.text}
                  onChange={(e) => updateCore(kind, { text: e.target.value })}
                />
                <TokenChips
                  onInsert={(token) =>
                    insertAtCursor(
                      consentRefs.current[kind],
                      c.text,
                      token,
                      (next) => updateCore(kind, { text: next }),
                    )
                  }
                />
                <div className="rf-consent-preview" aria-live="polite">
                  <ConsentCopy text={c.text} />
                </div>
              </div>
            );
          })}

          <div className="field">
            <label htmlFor="rf-footer">Line under Download Now</label>
            <input
              ref={footerRef}
              id="rf-footer"
              type="text"
              value={footerLine}
              onChange={(e) => setFooterLine(e.target.value)}
            />
            <TokenChips
              onInsert={(token) =>
                insertAtCursor(
                  footerRef.current,
                  footerLine,
                  token,
                  setFooterLine,
                )
              }
            />
            <div className="rf-consent-preview">
              <ConsentCopy text={footerLine} />
            </div>
          </div>

          {extraConsents.map((c, i) => (
            <div className="rf-consent" key={c.id}>
              <div className="rf-consent-head">
                <span>Extra checkbox {i + 1}</span>
                <span className="rf-consent-tools">
                  <label className="rf-check">
                    <input
                      type="checkbox"
                      checked={c.show}
                      onChange={(e) =>
                        updateExtra(i, { show: e.target.checked })
                      }
                    />
                    Show
                  </label>
                  <label className="rf-check">
                    <input
                      type="checkbox"
                      checked={c.required}
                      onChange={(e) =>
                        updateExtra(i, { required: e.target.checked })
                      }
                    />
                    Required
                  </label>
                  <button
                    type="button"
                    className="rf-icon-btn"
                    onClick={() =>
                      setExtraConsents(
                        extraConsents.filter((_, j) => j !== i),
                      )
                    }
                  >
                    Remove
                  </button>
                </span>
              </div>
              <textarea
                ref={(el) => {
                  consentRefs.current[c.id] = el;
                }}
                rows={2}
                aria-label={`Extra checkbox ${i + 1} text`}
                value={c.text}
                onChange={(e) => updateExtra(i, { text: e.target.value })}
              />
              <TokenChips
                onInsert={(token) =>
                  insertAtCursor(
                    consentRefs.current[c.id],
                    c.text,
                    token,
                    (next) => updateExtra(i, { text: next }),
                  )
                }
              />
              <div className="rf-consent-preview">
                <ConsentCopy text={c.text} />
              </div>
            </div>
          ))}
          <button
            type="button"
            className="rf-add"
            disabled={extraConsents.length >= MAX_EXTRA_CONSENTS}
            onClick={() =>
              setExtraConsents([
                ...extraConsents,
                {
                  id: newId(),
                  kind: "extra",
                  show: true,
                  required: true,
                  text: "",
                },
              ])
            }
          >
            + Add checkbox
          </button>
        </div>

        <div className="rf-block">
          <h3>Questions</h3>
          <p className="field-hint">
            Optional. Fill 2+ separate options for a dropdown. Leave options
            empty for a text field. Max {MAX_QUESTIONS} questions.
          </p>
          {questions.map((q, i) => (
            <div className="rf-consent" key={q.id}>
              <div className="rf-consent-head">
                <span>Question {i + 1}</span>
                <button
                  type="button"
                  className="rf-icon-btn"
                  onClick={() =>
                    setQuestions(questions.filter((_, j) => j !== i))
                  }
                >
                  Remove
                </button>
              </div>
              <label className="rf-mini-label">Question</label>
              <input
                type="text"
                value={q.text}
                placeholder="Question text"
                onChange={(e) =>
                  setQuestions(
                    questions.map((x, j) =>
                      j === i ? { ...x, text: e.target.value } : x,
                    ),
                  )
                }
              />
              <label className="rf-mini-label">Options</label>
              <div className="rf-options">
                {q.options.map((opt, oi) => (
                  <div className="rf-option-row" key={`${q.id}-opt-${oi}`}>
                    <span className="rf-option-letter" aria-hidden>
                      {OPTION_LETTERS[oi] ?? oi + 1}
                    </span>
                    <input
                      type="text"
                      value={opt}
                      placeholder={`Option ${OPTION_LETTERS[oi] ?? oi + 1}`}
                      aria-label={`Question ${i + 1} option ${OPTION_LETTERS[oi] ?? oi + 1}`}
                      onChange={(e) =>
                        setQuestions(
                          questions.map((x, j) => {
                            if (j !== i) return x;
                            const next = [...x.options];
                            next[oi] = e.target.value;
                            return { ...x, options: next };
                          }),
                        )
                      }
                    />
                    <button
                      type="button"
                      className="rf-icon-btn"
                      aria-label={`Remove option ${OPTION_LETTERS[oi] ?? oi + 1}`}
                      disabled={q.options.length <= 1}
                      onClick={() =>
                        setQuestions(
                          questions.map((x, j) =>
                            j === i
                              ? {
                                  ...x,
                                  options: x.options.filter((_, k) => k !== oi),
                                }
                              : x,
                          ),
                        )
                      }
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="rf-add rf-add--sm"
                disabled={q.options.length >= MAX_OPTIONS}
                onClick={() =>
                  setQuestions(
                    questions.map((x, j) =>
                      j === i ? { ...x, options: [...x.options, ""] } : x,
                    ),
                  )
                }
              >
                + Add option
              </button>
            </div>
          ))}
          <button
            type="button"
            className="rf-add"
            disabled={questions.length >= MAX_QUESTIONS}
            onClick={() =>
              setQuestions([
                ...questions,
                { id: newId(), text: "", options: ["", ""] },
              ])
            }
          >
            + Add question
          </button>
        </div>

        <div className="rf-panel-nav">
          <button
            type="button"
            className="rf-back"
            onClick={() => goToStep("details")}
          >
            ← Details
          </button>
          <button
            type="button"
            className="rf-next"
            onClick={() => goToStep("seo")}
          >
            Next: SEO & page →
          </button>
        </div>
      </section>

      {/* —— SEO —— */}
      <section
        className="rf-panel"
        id="rf-step-seo"
        ref={(el) => {
          stepRefs.current.seo = el;
        }}
      >
        <header className="rf-panel-head">
          <div>
            <p className="rf-panel-kicker">Step 3</p>
            <h2>{seoMode === "claude" ? "Claude SEO" : "Manual SEO"}</h2>
            <p>Nothing publishes until you save.</p>
          </div>
          <div className="rf-seo-mode" role="group" aria-label="SEO mode">
            <button
              type="button"
              className={seoMode === "claude" ? "is-active" : undefined}
              onClick={() => setSeoMode("claude")}
            >
              Claude
            </button>
            <button
              type="button"
              className={seoMode === "manual" ? "is-active" : undefined}
              onClick={() => setSeoMode("manual")}
            >
              Manual
            </button>
          </div>
        </header>

        {seoMode === "claude" ? (
          <div className="rf-claude-box">
            <p>
              Claude fills slug, meta title, meta description, keywords, and an
              optional overview from the title and description. Nothing
              publishes until you save.
            </p>
            <button
              type="button"
              className="btn btn-solid"
              onClick={() => void fillClaudeSeo()}
              disabled={seoPending}
            >
              {seoPending ? "Generating with Claude…" : "Generate SEO with Claude"}
            </button>
            {seoError ? <p className="rf-seo-error">{seoError}</p> : null}
          </div>
        ) : (
          <p className="field-hint" style={{ marginTop: -4 }}>
            Type the SEO yourself, or switch to Claude to generate it.
          </p>
        )}

        <div className="field">
          <label htmlFor="slug-visible">Slug</label>
          <input
            id="slug-visible"
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="auto from title if blank"
          />
        </div>
        <div className="field">
          <label htmlFor="seo_meta_title">Meta title</label>
          <input
            id="seo_meta_title"
            type="text"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="seo_meta_description">Meta description</label>
          <textarea
            id="seo_meta_description"
            rows={3}
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="seo_keywords">Keywords</label>
          <input
            id="seo_keywords"
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="Comma-separated"
          />
        </div>
        <div className="field">
          <label htmlFor="overview-visible">Overview</label>
          <textarea
            id="overview-visible"
            rows={4}
            value={overview}
            onChange={(e) => setOverview(e.target.value)}
            placeholder="Longer page copy shown above inside sections."
          />
        </div>

        <div className="rf-block">
          <h3>Inside sections</h3>
          <p className="field-hint">
            Heading and section copy on the public detail page.
          </p>
          {insideSections.map((s, i) => (
            <div className="rf-consent" key={s.id}>
              <div className="rf-consent-head">
                <span>Section {i + 1}</span>
                <button
                  type="button"
                  className="rf-icon-btn"
                  onClick={() =>
                    setInsideSections(
                      insideSections.filter((_, j) => j !== i),
                    )
                  }
                >
                  Remove
                </button>
              </div>
              <label className="rf-mini-label">Heading</label>
              <input
                type="text"
                value={s.heading}
                onChange={(e) =>
                  setInsideSections(
                    insideSections.map((x, j) =>
                      j === i ? { ...x, heading: e.target.value } : x,
                    ),
                  )
                }
              />
              <label className="rf-mini-label">Section copy</label>
              <textarea
                rows={3}
                value={s.copy}
                onChange={(e) =>
                  setInsideSections(
                    insideSections.map((x, j) =>
                      j === i ? { ...x, copy: e.target.value } : x,
                    ),
                  )
                }
              />
            </div>
          ))}
          <button
            type="button"
            className="rf-add"
            onClick={() =>
              setInsideSections([
                ...insideSections,
                { id: newId(), heading: "", copy: "" },
              ])
            }
          >
            + Add inside section
          </button>
        </div>

        <div className="rf-panel-nav">
          <button
            type="button"
            className="rf-back"
            onClick={() => goToStep("download")}
          >
            ← Download form
          </button>
        </div>
      </section>

      <div className="rf-footer">
        <div className="rf-footer-meta">
          <span className={`rf-pill ${status === "published" ? "is-live" : ""}`}>
            {status === "published" ? "Will publish" : "Saving as draft"}
          </span>
          <span className="rf-footer-hint">
            {title.trim() || "Untitled resource"}
          </span>
        </div>
        <SaveButton isEdit={Boolean(resource?.id)} status={status} />
      </div>
    </form>
  );
}
