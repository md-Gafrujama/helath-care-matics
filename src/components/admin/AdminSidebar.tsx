"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandLogo from "@/components/BrandLogo";
import { signOut } from "@/lib/actions/auth";

const LINKS = [
  {
    href: "/admin",
    label: "Dashboard",
    exact: true,
    hint: "Overview & activity",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="8" height="8" rx="1.5" />
        <rect x="13" y="3" width="8" height="5" rx="1.5" />
        <rect x="13" y="10" width="8" height="11" rx="1.5" />
        <rect x="3" y="13" width="8" height="8" rx="1.5" />
      </svg>
    ),
  },
  {
    href: "/admin/articles",
    label: "Articles",
    hint: "Drafts & published",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M6 4h9l5 5v11a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" />
        <path d="M15 4v5h5M8 13h8M8 17h5" />
      </svg>
    ),
  },
  {
    href: "/admin/topics",
    label: "Topics",
    hint: "Navbar categories",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4l1.4-1.4M17 7l1.4-1.4" />
      </svg>
    ),
  },
  {
    href: "/admin/subscribers",
    label: "Subscribers",
    hint: "Newsletter list",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 6h16v12H4z" />
        <path d="M4 7l8 6 8-6" />
      </svg>
    ),
  },
] as const;

export default function AdminSidebar({
  email,
  onNavigate,
}: {
  email: string | undefined;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const initial = (email?.[0] ?? "A").toUpperCase();

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-head">
        <BrandLogo variant="onDark" href="/admin" className="admin-sidebar-brand" />
        <p className="admin-sidebar-kicker">Editorial control center</p>
      </div>

      <nav className="admin-sidebar-nav" aria-label="Admin">
        <p className="admin-nav-label">Manage</p>
        {LINKS.map((link) => {
          const active =
            "exact" in link && link.exact
              ? pathname === link.href
              : pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={active ? "active" : undefined}
              aria-current={active ? "page" : undefined}
              onClick={onNavigate}
            >
              <span className="admin-nav-icon" aria-hidden>
                {link.icon}
              </span>
              <span className="admin-nav-copy">
                <span className="admin-nav-title">{link.label}</span>
                <span className="admin-nav-hint">{link.hint}</span>
              </span>
            </Link>
          );
        })}

        <p className="admin-nav-label">Shortcuts</p>
        <Link href="/admin/articles/new#generate" onClick={onNavigate}>
          <span className="admin-nav-icon" aria-hidden>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </span>
          <span className="admin-nav-copy">
            <span className="admin-nav-title">New article</span>
            <span className="admin-nav-hint">AI or manual</span>
          </span>
        </Link>
        <Link href="/" onClick={onNavigate} target="_blank" rel="noopener noreferrer">
          <span className="admin-nav-icon" aria-hidden>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 11l8-7 8 7" />
              <path d="M6 10v9h12v-9" />
            </svg>
          </span>
          <span className="admin-nav-copy">
            <span className="admin-nav-title">Public site</span>
            <span className="admin-nav-hint">Open homepage</span>
          </span>
        </Link>
      </nav>

      <div className="admin-sidebar-foot">
        <div className="admin-user">
          <span className="admin-user-avatar" aria-hidden>
            {initial}
          </span>
          <div className="admin-user-meta">
            <span className="admin-user-role">Administrator</span>
            {email && <p className="admin-sidebar-email">{email}</p>}
          </div>
        </div>
        <form action={signOut}>
          <button type="submit" className="admin-signout">
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
