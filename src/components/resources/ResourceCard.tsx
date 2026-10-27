"use client";

import Link from "next/link";
import { useState } from "react";
import {
  categoryLabel,
  categoryToPath,
  type ResourceCategory,
} from "@/lib/resources/constants";
import {
  openResourceDownload,
  type ResourceDrawerPayload,
} from "@/components/resources/ResourceDownloadDrawer";

function LinkedInIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.73V1.73C24 .77 23.21 0 22.23 0z" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
    </svg>
  );
}

export default function ResourceCard({
  id,
  title,
  slug,
  category,
  coverUrl,
  description,
  vertical,
}: {
  id: string;
  title: string;
  slug: string;
  category: ResourceCategory;
  coverUrl: string | null;
  description?: string | null;
  vertical?: string | null;
}) {
  const href = `/resources/${categoryToPath(category)}/${slug}`;
  const [pending, setPending] = useState(false);
  const [copied, setCopied] = useState(false);
  const dek =
    description?.trim() &&
    description.trim().toLowerCase() !== title.trim().toLowerCase()
      ? description.trim()
      : null;

  function absoluteUrl() {
    if (typeof window === "undefined") return href;
    return `${window.location.origin}${href}`;
  }

  async function onDownload(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setPending(true);
    try {
      const res = await fetch(`/api/resources/${id}`);
      const data = (await res.json()) as ResourceDrawerPayload & {
        error?: string;
      };
      if (!res.ok) throw new Error(data.error || "Could not open download");
      openResourceDownload({
        id: data.id,
        title: data.title,
        slug: data.slug,
        category: data.category,
        coverUrl: data.coverUrl,
        description: data.description,
        vertical: data.vertical,
        form: data.form,
      });
    } catch (err) {
      window.alert(
        err instanceof Error ? err.message : "Could not open download",
      );
    } finally {
      setPending(false);
    }
  }

  async function onCopyLink(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(absoluteUrl());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
      window.dispatchEvent(
        new CustomEvent("healthmatics:toast", {
          detail: { message: "Link copied" },
        }),
      );
    } catch {
      window.dispatchEvent(
        new CustomEvent("healthmatics:toast", {
          detail: { message: "Could not copy link" },
        }),
      );
    }
  }

  function onShareLinkedIn(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(absoluteUrl())}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <article className="rscard">
      <div className="rscard-cover">
        {coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={coverUrl} alt="" className="rscard-img" />
        ) : (
          <div className="rscard-img-fallback" aria-hidden>
            <span className="rscard-fallback-mark">
              {categoryLabel(category).charAt(0)}
            </span>
            <span>{categoryLabel(category)}</span>
          </div>
        )}
        <span className="rscard-gate">
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            aria-hidden
          >
            <rect x="4" y="10" width="16" height="11" rx="2" />
            <path d="M8 10V7a4 4 0 018 0v3" />
          </svg>
          Gated
        </span>
        <div className="rscard-hover">
          <Link href={href} className="rscard-btn rscard-btn--ghost">
            View details
          </Link>
          <button
            type="button"
            className="rscard-btn rscard-btn--solid"
            onClick={onDownload}
            disabled={pending}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              aria-hidden
            >
              <path d="M12 3v12" />
              <path d="M7 10l5 5 5-5" />
              <path d="M5 21h14" />
            </svg>
            {pending ? "Opening…" : "Download"}
          </button>
        </div>
      </div>

      <div className="rscard-body">
        <div className="rscard-meta">
          <div className="rscard-meta-left">
            <span className="rscard-cat">{categoryLabel(category)}</span>
            {vertical ? <span className="rscard-vert">{vertical}</span> : null}
          </div>
          <div className="rscard-share" role="group" aria-label="Share">
            <button
              type="button"
              className="rscard-share-btn"
              onClick={onShareLinkedIn}
              aria-label="Share on LinkedIn"
              title="Share on LinkedIn"
            >
              <LinkedInIcon />
            </button>
            <button
              type="button"
              className="rscard-share-btn"
              onClick={onCopyLink}
              aria-label={copied ? "Link copied" : "Copy link"}
              title={copied ? "Copied" : "Copy link"}
            >
              <LinkIcon />
            </button>
          </div>
        </div>
        <h3 className="rscard-title">
          <Link href={href}>{title}</Link>
        </h3>
        {dek ? <p className="rscard-dek">{dek}</p> : null}
      </div>
    </article>
  );
}
