import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import BrandLogo from "@/components/BrandLogo";
import MobileNav from "@/components/MobileNav";

function todayLabel() {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());
}

export default function SiteHeader({
  currentTopicSlug,
}: {
  currentTopicSlug?: string;
} = {}) {
  return (
    <>
      {/* ============ UTILITY BAR ============ */}
      <div className="utility">
        <div className="wrap">
          <nav className="utility-links" aria-label="Utility">
            <a href="#latest">Latest News</a>
            <Link href="/#nl">Newsletters</Link>
            <a href="#events">Events</a>
            <a href="#research">Research</a>
            <a href="#advertise">Advertise</a>
          </nav>
          <div className="utility-right">
            <span className="date">{todayLabel()}</span>
            <span aria-hidden="true">|</span>
            <a href="#" style={{ color: "#cfe0d9" }}>Sign in</a>
          </div>
        </div>
      </div>

      {/* ============ MASTHEAD ============ */}
      <header className="masthead">
        <div className="wrap">
          <BrandLogo />
          <nav className="nav" aria-label="Primary">
            <Link href="/#latest" className={currentTopicSlug === "news" ? "active" : undefined}>News</Link>
            <Link href="/#analysis" className={currentTopicSlug === "analysis" ? "active" : undefined}>Analysis</Link>
            <Link href="/#research" className={currentTopicSlug === "research" ? "active" : undefined}>Research</Link>
            <Link href="/#events" className={currentTopicSlug === "events" ? "active" : undefined}>Events</Link>
            <Link href="/resources" className={currentTopicSlug === "resources" ? "active" : undefined}>Resources</Link>
          </nav>
          <div className="masthead-right">
            <SearchBar />
            <Link href="/#nl" className="btn btn-primary subscribe-top">
              <span className="label">Subscribe</span>
            </Link>
            <MobileNav currentTopicSlug={currentTopicSlug} />
          </div>
        </div>
      </header>

      {/* ============ TICKER ============ */}
      <TickerBar />
    </>
  );
}

function TickerBar() {
  return (
    <div className="ticker">
      <div className="wrap">
        <span className="ticker-label">
          <span className="live-dot" />
          Trending
        </span>
        <div className="ticker-track">
          <TickerContent />
        </div>
      </div>
    </div>
  );
}

function TickerContent() {
  const items = [
    "AI in Healthcare",
    "Hospital M&A",
    "Healthcare Cybersecurity",
    "Digital Health",
    "Revenue Cycle",
    "Health Policy",
  ];

  return (
    <div className="ticker-move">
      {[...items, ...items].map((label, i) => (
        <span key={i}>
          <a href="#">{label}</a>
          {i < items.length * 2 - 1 && <span className="sep">/</span>}
        </span>
      ))}
    </div>
  );
}
