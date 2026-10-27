"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import DownloadGate from "@/components/resources/DownloadGate";
import {
  categoryLabel,
  type ResourceCategory,
} from "@/lib/resources/constants";
import type { ResourceFormConfig } from "@/lib/resources/constants";

export type ResourceDrawerPayload = {
  id: string;
  title: string;
  slug: string;
  category: ResourceCategory;
  coverUrl: string | null;
  description?: string | null;
  vertical?: string | null;
  form: ResourceFormConfig;
};

export const OPEN_RESOURCE_DOWNLOAD_EVENT = "healthmatics:open-resource-download";

export function openResourceDownload(payload: ResourceDrawerPayload) {
  window.dispatchEvent(
    new CustomEvent(OPEN_RESOURCE_DOWNLOAD_EVENT, { detail: payload }),
  );
}

export default function ResourceDownloadDrawer() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [resource, setResource] = useState<ResourceDrawerPayload | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent<ResourceDrawerPayload>).detail;
      if (!detail?.id) return;
      setResource(detail);
      setOpen(true);
    };
    window.addEventListener(OPEN_RESOURCE_DOWNLOAD_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_RESOURCE_DOWNLOAD_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!mounted || !open || !resource) return null;

  return createPortal(
    <div className="rs-drawer open" role="dialog" aria-modal="true" aria-label="Download resource">
      <button
        type="button"
        className="rs-drawer-scrim"
        aria-label="Close"
        onClick={() => setOpen(false)}
      />
      <aside className="rs-drawer-panel rs-drawer-panel--download">
        <div className="rs-drawer-head">
          <div>
            <p className="rs-drawer-kicker">
              {categoryLabel(resource.category)}
            </p>
            <h2>{resource.title}</h2>
          </div>
          <button
            type="button"
            className="rs-drawer-close"
            aria-label="Close"
            onClick={() => setOpen(false)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {resource.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={resource.coverUrl}
            alt=""
            className="rs-drawer-cover"
          />
        ) : null}

        {resource.description ? (
          <p className="rs-drawer-lead">{resource.description}</p>
        ) : null}
        {resource.vertical ? (
          <p className="rs-drawer-vert">{resource.vertical}</p>
        ) : null}

        <DownloadGate
          resourceId={resource.id}
          resourceSlug={resource.slug}
          resourceTitle={resource.title}
          resourceCategory={resource.category}
          form={resource.form}
        />
      </aside>
    </div>,
    document.body,
  );
}
