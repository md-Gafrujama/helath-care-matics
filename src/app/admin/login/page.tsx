import type { Metadata } from "next";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import LoginForm from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Admin login",
  description: "Sign in to the HealthMatics editorial control center.",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <>
      <SiteHeader />
      <main className="admin-login">
        <div className="admin-login-panel">
          <aside className="admin-login-aside">
            <BrandLogo variant="onDark" />
            <span className="admin-login-kicker">Editorial staff</span>
            <h1>Sign in to publish</h1>
            <p>
              Manage healthcare stories, topics, SEO, and AI-assisted publishing
              from one secure workspace.
            </p>
            <ul className="admin-login-features">
              <li>
                <span className="admin-login-dot" aria-hidden />
                Articles, drafts &amp; publish queue
              </li>
              <li>
                <span className="admin-login-dot" aria-hidden />
                SEO · OG · AEO · GEO fields
              </li>
              <li>
                <span className="admin-login-dot" aria-hidden />
                AI generation &amp; Pexels covers
              </li>
              <li>
                <span className="admin-login-dot" aria-hidden />
                Topics &amp; subscribers
              </li>
            </ul>
            <div className="admin-login-aside-foot">
              <span className="admin-login-badge">Secure access</span>
              <span>Authorized editors only</span>
            </div>
          </aside>

          <div className="admin-login-box">
            <div className="admin-login-box-head">
              <span className="admin-login-mark" aria-hidden>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M12 3l7 4v5c0 5-3 8-7 9-4-1-7-4-7-9V7l7-4z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <div>
                <h2>Admin sign in</h2>
                <p className="sub">Use your HealthMatics staff credentials.</p>
              </div>
            </div>
            <LoginForm next={next ?? "/admin"} />
            <Link href="/" className="admin-login-back">
              ← Back to public site
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
