"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminShell({
  email,
  children,
}: {
  email: string | undefined;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [fadeKey, setFadeKey] = useState(pathname);

  useEffect(() => {
    setFadeKey(pathname);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <div className={`admin-shell${open ? " is-nav-open" : ""}`}>
      <button
        type="button"
        className="admin-menu-toggle"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
        Menu
      </button>

      {open && (
        <button
          type="button"
          className="admin-nav-scrim"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      )}

      <AdminSidebar email={email} onNavigate={() => setOpen(false)} />
      <main className="admin-main">
        <div key={fadeKey} className="admin-main-fade">
          {children}
        </div>
      </main>
    </div>
  );
}
