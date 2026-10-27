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

const FALLBACK_COVERS = [
  {
    bg: "#0A2E27",
    svg: (
      <>
        <g stroke="#14463B">
          <path d="M0 80H400M0 160H400M133 0V240M266 0V240" />
        </g>
        <path
          d="M20 190 100 140 180 160 260 90 340 110"
          fill="none"
          stroke="#B0842B"
          strokeWidth="3.5"
        />
        <g fill="#B0842B">
          <circle cx="180" cy="160" r="6" />
          <circle cx="340" cy="110" r="6" />
        </g>
      </>
    ),
  },
  {
    bg: "#123A54",
    svg: (
      <g fill="#1C4E6E">
        <rect x="40" y="150" width="34" height="70" />
        <rect x="94" y="120" width="34" height="100" />
        <rect x="148" y="130" width="34" height="90" />
        <rect x="202" y="90" width="34" height="130" />
        <rect x="256" y="110" width="34" height="110" />
        <rect x="310" y="70" width="34" height="150" />
      </g>
    ),
  },
  {
    bg: "#0C5245",
    svg: (
      <>
        <g fill="none" stroke="#0A3E34">
          <circle cx="200" cy="120" r="40" />
          <circle cx="200" cy="120" r="72" />
          <circle cx="200" cy="120" r="104" />
        </g>
        <g fill="#7FCBB8">
          <circle cx="240" cy="92" r="6" />
          <circle cx="152" cy="150" r="6" />
        </g>
      </>
    ),
  },
] as const;

function formatDate(iso: string | null | undefined) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export default function HomeResearchCard({
  id,
  title,
  slug,
  category,
  coverUrl,
  description,
  vertical,
  publishedAt,
  index = 0,
}: {
  id: string;
  title: string;
  slug: string;
  category: ResourceCategory;
  coverUrl: string | null;
  description?: string | null;
  vertical?: string | null;
  publishedAt?: string | null;
  index?: number;
}) {
  const href = `/resources/${categoryToPath(category)}/${slug}`;
  const [pending, setPending] = useState(false);
  const fallback = FALLBACK_COVERS[index % FALLBACK_COVERS.length];
  const dateLabel = formatDate(publishedAt);
  const footLeft = vertical || dateLabel || categoryLabel(category);

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

  return (
    <article className="research-card">
      <div className="art research-cover">
        {coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={coverUrl} alt="" className="research-cover-img" />
        ) : (
          <svg
            viewBox="0 0 400 240"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden
          >
            <rect width="400" height="240" fill={fallback.bg} />
            {fallback.svg}
          </svg>
        )}
        <span className="research-gate">
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            aria-hidden
          >
            <rect x="4" y="10" width="16" height="11" rx="2" />
            <path d="M8 10V7a4 4 0 018 0v3" />
          </svg>
          Gated {categoryLabel(category).toLowerCase()}
        </span>
      </div>
      <div className="research-body">
        <div className="rtype">{categoryLabel(category)}</div>
        <h3>
          <Link href={href} className="headline-link">
            {title}
          </Link>
        </h3>
        {description ? <p>{description}</p> : null}
        <div className="research-foot">
          <span className="rdate">{footLeft}</span>
          <button
            type="button"
            className="btn btn-gold"
            onClick={onDownload}
            disabled={pending}
          >
            {pending ? "Opening…" : "Download"}
          </button>
        </div>
      </div>
    </article>
  );
}
