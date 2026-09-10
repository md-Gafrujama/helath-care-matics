import type { Metadata } from "next";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import UnsubscribeForm from "@/components/UnsubscribeForm";
import { unsubscribeByToken } from "@/lib/subscribers";

export const metadata: Metadata = {
  title: "Unsubscribe",
  robots: { index: false, follow: false },
};

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const tokenResult = token
    ? ((await unsubscribeByToken(token)) ? "ok" : "invalid")
    : null;

  return (
    <main className="unsub-page">
      <div className="unsub-shell">
        <Link href="/" className="unsub-back">
          <span aria-hidden>←</span> Back to HealthMatics
        </Link>

        <section className="unsub-card" aria-labelledby="unsub-title">
          <header className="unsub-card-head">
            <BrandLogo variant="onDark" href="/" />
            <p id="unsub-title">Manage email updates</p>
          </header>

          <div className="unsub-card-body">
            {tokenResult === "ok" ? (
              <div className="unsub-result" role="status">
                <div className="unsub-result-icon" aria-hidden>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 12.5l4.5 4.5L19 7.5"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h2>You are unsubscribed</h2>
                <p>
                  You will no longer get related-article emails from
                  HealthMatics. You can subscribe again from any story.
                </p>
                <Link href="/" className="unsub-btn unsub-btn--ghost">
                  Back to HealthMatics
                </Link>
              </div>
            ) : tokenResult === "invalid" ? (
              <div className="unsub-result unsub-result--warn" role="status">
                <h2>Link is invalid or expired</h2>
                <p>
                  This unsubscribe link is missing or no longer works. Enter
                  your email below and we will take you off the list.
                </p>
                <UnsubscribeForm />
              </div>
            ) : (
              <UnsubscribeForm />
            )}
          </div>
        </section>

        <p className="unsub-fine">
          Prefer to stay?{" "}
          <Link href="/#nl">Keep receiving the weekday brief</Link>
        </p>
      </div>
    </main>
  );
}
