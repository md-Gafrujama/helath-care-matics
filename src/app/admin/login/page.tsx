import type { Metadata } from "next";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import LoginForm from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Admin login - HealthMatics",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="admin-login">
      <div className="admin-login-panel">
        <aside className="admin-login-aside">
          <BrandLogo variant="onDark" />
          <span className="admin-login-kicker">Editorial staff</span>
          <h1>HealthMatics control center</h1>
          <p>
            Publish healthcare intelligence, manage topics, and run AI-assisted
            article generation from one place.
          </p>
          <ul className="admin-login-features">
            <li>
              <span className="admin-login-dot" aria-hidden />
              Articles &amp; drafts
            </li>
            <li>
              <span className="admin-login-dot" aria-hidden />
              Topic management
            </li>
            <li>
              <span className="admin-login-dot" aria-hidden />
              AI generation &amp; Pexels covers
            </li>
            <li>
              <span className="admin-login-dot" aria-hidden />
              Subscriber list
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
              H
            </span>
            <div>
              <h2>Sign in</h2>
              <p className="sub">Use your HealthMatics admin credentials.</p>
            </div>
          </div>
          <LoginForm next={next ?? "/admin"} />
          <Link href="/" className="admin-login-back">
            ← Back to public site
          </Link>
        </div>
      </div>
    </div>
  );
}
