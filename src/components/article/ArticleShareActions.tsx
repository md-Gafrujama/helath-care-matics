"use client";

import { useState } from "react";

const COMPANY_LINKEDIN_URL =
  "https://www.linkedin.com/showcase/healthmatics-healthcare-intelligence/posts/";

function LinkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C20.5 8.65 22 10.9 22 14.3V21h-4v-5.9c0-1.4-.03-3.2-2-3.2-2 0-2.3 1.55-2.3 3.1V21H9z" />
    </svg>
  );
}

export default function ArticleShareActions({
  url,
}: {
  url: string;
  title?: string;
}) {
  const [copied, setCopied] = useState(false);
  const linkedInShare = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
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

  return (
    <div className="share-actions" role="group" aria-label="Share article">
      <button
        type="button"
        className="share-btn share-btn--link"
        onClick={copyLink}
        aria-label={copied ? "Link copied" : "Copy link"}
        title={copied ? "Copied" : "Copy link"}
      >
        <LinkIcon />
      </button>
      <a
        className="share-btn share-btn--share"
        href={linkedInShare}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        title="Share on LinkedIn"
      >
        <ShareIcon />
      </a>
      <a
        className="share-btn share-btn--linkedin"
        href={COMPANY_LINKEDIN_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="HealthMatics on LinkedIn"
        title="HealthMatics on LinkedIn"
      >
        <LinkedInIcon />
      </a>
    </div>
  );
}
