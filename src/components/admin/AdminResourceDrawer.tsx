"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import ResourceForm from "@/components/admin/ResourceForm";
import type { Resource } from "@/types/database";

export const OPEN_ADMIN_RESOURCE_DRAWER = "healthmatics:admin-resource-drawer";

export type AdminResourceDrawerDetail =
  | { mode: "new" }
  | { mode: "edit"; resource: Resource };

export function openAdminResourceDrawer(detail: AdminResourceDrawerDetail) {
  window.dispatchEvent(
    new CustomEvent(OPEN_ADMIN_RESOURCE_DRAWER, { detail }),
  );
}

export function NewResourceButton({
  className = "btn btn-solid",
  children = "New resource",
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => openAdminResourceDrawer({ mode: "new" })}
    >
      {children}
    </button>
  );
}

export function AdminResourceDrawer() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [resource, setResource] = useState<Resource | null>(null);
  const [formKey, setFormKey] = useState("new");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent<AdminResourceDrawerDetail>).detail;
      if (!detail) return;
      if (detail.mode === "edit") {
        setResource(detail.resource);
        setFormKey(detail.resource.id);
      } else {
        setResource(null);
        setFormKey(`new-${Date.now()}`);
      }
      setOpen(true);
    };
    window.addEventListener(OPEN_ADMIN_RESOURCE_DRAWER, onOpen);
    return () => window.removeEventListener(OPEN_ADMIN_RESOURCE_DRAWER, onOpen);
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

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="admin-drawer open"
      role="dialog"
      aria-modal="true"
      aria-label={resource ? "Edit resource" : "New resource"}
    >
      <button
        type="button"
        className="admin-drawer-scrim"
        aria-label="Close"
        onClick={() => setOpen(false)}
      />
      <aside className="admin-drawer-panel admin-drawer-panel--resource">
        <div className="admin-drawer-head admin-drawer-head--resource">
          <div>
            <p className="admin-drawer-kicker">Audience · Resources</p>
            <h2>{resource ? "Edit resource" : "New resource"}</h2>
            <p className="admin-drawer-sub">
              Three steps: details &amp; files, download form, then SEO.
            </p>
          </div>
          <button
            type="button"
            className="admin-drawer-close"
            aria-label="Close"
            onClick={() => setOpen(false)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <div className="admin-drawer-body admin-drawer-body--resource">
          <ResourceForm key={formKey} resource={resource} />
        </div>
      </aside>
    </div>,
    document.body,
  );
}
