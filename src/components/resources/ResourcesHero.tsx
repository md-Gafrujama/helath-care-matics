import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import { SITE_NAME, type ResourceCategory } from "@/lib/resources/constants";

export type ResourcesHeroVariant =
  | "hub"
  | ResourceCategory
  | "detail";

type ResourcesHeroProps = {
  variant: ResourcesHeroVariant;
  /** Detail page: resource title */
  title?: string;
  /** Detail page: short description */
  description?: string;
  crumbs?: { href?: string; label: string }[];
  /** Optional count line for type pages */
  countLabel?: string;
  ctaHref?: string;
  ctaLabel?: string;
};

const COPY: Record<
  Exclude<ResourcesHeroVariant, "detail">,
  { kicker: string; headline: string; dek: string; ctaLabel: string; ctaHref: string }
> = {
  hub: {
    kicker: "Resource library",
    headline: "Intelligence you can download and use",
    dek: "White papers, reports, case studies, guides, and webinars from the HealthMatics desk — free with a work email.",
    ctaLabel: "Browse the library",
    ctaHref: "#white-papers",
  },
  whitepaper: {
    kicker: "White papers",
    headline: "Deep briefs for the people running care",
    dek: "Executive-ready analysis on AI, operations, policy, and the systems reshaping healthcare.",
    ctaLabel: "See all resources",
    ctaHref: "/resources",
  },
  report: {
    kicker: "Reports",
    headline: "Research you can take into the next meeting",
    dek: "Data-backed market and operations findings written for healthcare decision makers.",
    ctaLabel: "See all resources",
    ctaHref: "/resources",
  },
  case_study: {
    kicker: "Case studies",
    headline: "How peers solved the hard problems",
    dek: "Real operating stories from health systems, payers, and digital health teams.",
    ctaLabel: "See all resources",
    ctaHref: "/resources",
  },
  guide: {
    kicker: "Guides",
    headline: "Practical playbooks for healthcare teams",
    dek: "Step-by-step resources operators and clinicians can use the same day.",
    ctaLabel: "See all resources",
    ctaHref: "/resources",
  },
  webinar: {
    kicker: "Webinars",
    headline: "Sessions with practitioners and analysts",
    dek: "On-demand briefings you can watch with your team — free with registration.",
    ctaLabel: "See all resources",
    ctaHref: "/resources",
  },
};

function HeroVisual({ variant }: { variant: ResourcesHeroVariant }) {
  const kind =
    variant === "webinar"
      ? "webinar"
      : variant === "hub"
        ? "hub"
        : variant === "guide"
          ? "guides"
          : "doc";

  return (
    <div className={`rs-hero-visual rs-hero-visual--${kind}`} aria-hidden>
      <div className="rs-hero-visual-glow" />
      <div className="rs-hero-visual-stage">
        {kind === "webinar" ? (
          <>
            <div className="rs-hero-screen">
              <span className="rs-hero-screen-bar" />
              <span className="rs-hero-screen-play" />
            </div>
            <div className="rs-hero-sheet rs-hero-sheet--a" />
            <div className="rs-hero-sheet rs-hero-sheet--b" />
          </>
        ) : kind === "guides" ? (
          <>
            <div className="rs-hero-book">
              <span />
              <span />
              <span />
            </div>
            <div className="rs-hero-sheet rs-hero-sheet--a" />
          </>
        ) : (
          <>
            <div className="rs-hero-sheet rs-hero-sheet--c" />
            <div className="rs-hero-sheet rs-hero-sheet--a" />
            <div className="rs-hero-sheet rs-hero-sheet--b" />
            {kind === "hub" ? (
              <div className="rs-hero-mark">{SITE_NAME.slice(0, 1)}</div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

function HeroCta({ href, label }: { href: string; label: string }) {
  if (href.startsWith("#") || href.startsWith("/")) {
    return (
      <Link href={href} className="rs-hero-cta">
        {label}
      </Link>
    );
  }
  return (
    <a href={href} className="rs-hero-cta">
      {label}
    </a>
  );
}

export default function ResourcesHero({
  variant,
  title,
  description,
  crumbs,
  countLabel,
  ctaHref,
  ctaLabel,
}: ResourcesHeroProps) {
  const isDetail = variant === "detail";
  const copy = isDetail
    ? null
    : COPY[variant as Exclude<ResourcesHeroVariant, "detail">];

  const href = ctaHref ?? copy?.ctaHref;
  const label = ctaLabel ?? copy?.ctaLabel;

  return (
    <section
      className={`rs-hero${isDetail ? " rs-hero--detail" : ""}`}
      data-variant={variant}
    >
      <div className="rs-hero-atmosphere" aria-hidden>
        <span className="rs-hero-orb rs-hero-orb--a" />
        <span className="rs-hero-orb rs-hero-orb--b" />
        <span className="rs-hero-grid" />
      </div>

      <div className="wrap rs-hero-inner">
        <div className="rs-hero-copy">
          {crumbs && crumbs.length > 0 ? (
            <nav className="rs-hero-crumbs" aria-label="Breadcrumb">
              {crumbs.map((c, i) => (
                <span key={`${c.label}-${i}`} className="rs-hero-crumb">
                  {i > 0 ? (
                    <span className="rs-hero-crumb-sep" aria-hidden>
                      /
                    </span>
                  ) : null}
                  {c.href ? (
                    <Link href={c.href}>{c.label}</Link>
                  ) : (
                    <span>{c.label}</span>
                  )}
                </span>
              ))}
            </nav>
          ) : null}

          <div className="rs-hero-identity">
            <BrandLogo
              href="/"
              variant="onDark"
              className="rs-hero-brand"
            />
            {!isDetail ? (
              <p className="rs-hero-kicker">{copy!.kicker}</p>
            ) : null}
          </div>

          {isDetail ? (
            <>
              <h1>{title}</h1>
              {description ? <p className="rs-hero-dek">{description}</p> : null}
              {countLabel ? <p className="rs-hero-meta">{countLabel}</p> : null}
              {href && label ? (
                <div className="rs-hero-actions">
                  <HeroCta href={href} label={label} />
                </div>
              ) : null}
            </>
          ) : (
            <>
              <h1>{copy!.headline}</h1>
              <p className="rs-hero-dek">{copy!.dek}</p>
              {countLabel ? <p className="rs-hero-meta">{countLabel}</p> : null}
              {href && label ? (
                <div className="rs-hero-actions">
                  <HeroCta href={href} label={label} />
                </div>
              ) : null}
            </>
          )}
        </div>

        {!isDetail ? <HeroVisual variant={variant} /> : null}
      </div>
    </section>
  );
}
