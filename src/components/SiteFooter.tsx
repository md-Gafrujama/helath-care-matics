import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import CookiePreferencesTrigger from "@/components/CookiePreferencesTrigger";
import { getNavTopics } from "@/lib/topic-config";

export default function SiteFooter() {
  const navTopics = getNavTopics();
  const year = new Date().getFullYear();

  return (
    <footer className="site-foot">
      <div className="wrap">
        <div className="foot-nl-band">
          <div className="foot-nl-copy">
            <span className="foot-nl-kicker">Newsletter</span>
            <h3>Healthcare intelligence in your inbox</h3>
            <p>One concise brief for busy decision makers. Free, every weekday.</p>
          </div>
          <div className="foot-nl-actions">
            <form
              className="foot-nl-form js-fake-subscribe"
              data-source="footer"
            >
              <label htmlFor="fem" className="sr-only">
                Work email
              </label>
              <input
                id="fem"
                type="email"
                name="email"
                placeholder="Work email"
                aria-label="Work email"
                required
              />
              <button type="submit">Subscribe</button>
            </form>
            <p className="foot-nl-unsub">
              Already subscribed?{" "}
              <Link href="/unsubscribe">Unsubscribe</Link>
            </p>
          </div>
        </div>

        <div className="foot-main">
          <div className="foot-brand">
            <BrandLogo variant="onDark" />
            <p>
              Independent news, analysis, and research for the people shaping
              healthcare&apos;s next chapter.
            </p>
            <div className="foot-socials">
              <a
                href="https://www.linkedin.com"
                aria-label="LinkedIn"
                rel="noopener noreferrer"
                target="_blank"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C20.5 8.65 22 10.9 22 14.3V21h-4v-5.9c0-1.4-.03-3.2-2-3.2-2 0-2.3 1.55-2.3 3.1V21H9z" />
                </svg>
              </a>
              <a
                href="https://x.com"
                aria-label="X"
                rel="noopener noreferrer"
                target="_blank"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M18.9 2h3.3l-7.2 8.2L23.6 22h-6.6l-5.2-6.8L5.9 22H2.6l7.7-8.8L2 2h6.8l4.7 6.2L18.9 2zm-1.2 18h1.8L7.4 3.9H5.5L17.7 20z" />
                </svg>
              </a>
              <a
                href="https://youtube.com"
                aria-label="YouTube"
                rel="noopener noreferrer"
                target="_blank"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M23 12s0-3.2-.4-4.7a2.5 2.5 0 00-1.8-1.8C19.3 5 12 5 12 5s-7.3 0-8.8.5A2.5 2.5 0 001.4 7.3C1 8.8 1 12 1 12s0 3.2.4 4.7a2.5 2.5 0 001.8 1.8C4.7 19 12 19 12 19s7.3 0 8.8-.5a2.5 2.5 0 001.8-1.8C23 15.2 23 12 23 12zm-13 3.3V8.7l5.7 3.3z" />
                </svg>
              </a>
            </div>
          </div>

          <nav className="foot-nav" aria-label="Footer">
            <div className="foot-col">
              <h4>Explore</h4>
              <Link href="/#latest">News</Link>
              <Link href="/#analysis">Analysis</Link>
              <Link href="/#research">Research</Link>
              <Link href="/resources">Resources</Link>
            </div>

            <div className="foot-col">
              <h4>Topics</h4>
              {navTopics.slice(0, 5).map((topic) => (
                <Link key={topic.slug} href={`/topic/${topic.slug}`}>
                  {topic.navLabel}
                </Link>
              ))}
            </div>

            <div className="foot-col">
              <h4>Company</h4>
              <Link href="/about">About</Link>
              <Link href="/about#advertise">Advertise</Link>
              <Link href="/about#contact">Contact</Link>
              <Link href="/about#standards">Editorial</Link>
              <Link href="/privacy">Privacy</Link>
              <Link href="/unsubscribe">Unsubscribe</Link>
            </div>
          </nav>
        </div>

        <div className="foot-bottom">
          <span className="foot-copy">
            © {year} HealthMatics. Independent publication. Published by Quore
            B2B Marketing
          </span>
          <div className="foot-legal">
            <Link href="/privacy">Privacy</Link>
            <Link href="/privacy#cookies">Cookies</Link>
            <CookiePreferencesTrigger className="foot-cookie-prefs" />
            <Link href="/unsubscribe">Unsubscribe</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
