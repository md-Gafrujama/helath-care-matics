"use client";

import { useState } from "react";

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.73V1.73C24 .77 23.21 0 22.23 0z" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
    </svg>
  );
}

export default function ResourceDetailShare({
  path,
  title,
}: {
  path: string;
  title: string;
}) {
  const [copied, setCopied] = useState(false);

  function absoluteUrl() {
    if (typeof window === "undefined") return path;
    return `${window.location.origin}${path}`;
  }

  async function copyLink() {
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

  function shareLinkedIn() {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(absoluteUrl())}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <div className="rs-detail-share" role="group" aria-label={`Share ${title}`}>
      <button
        type="button"
        className="rs-detail-share-btn rs-detail-share-btn--li"
        onClick={shareLinkedIn}
        aria-label="Share on LinkedIn"
        title="Share on LinkedIn"
      >
        <LinkedInIcon />
        <span>LinkedIn</span>
      </button>
      <button
        type="button"
        className="rs-detail-share-btn"
        onClick={copyLink}
        aria-label={copied ? "Link copied" : "Copy link"}
        title={copied ? "Copied" : "Copy link"}
      >
        <LinkIcon />
        <span>{copied ? "Copied" : "Copy link"}</span>
      </button>
    </div>
  );
}
