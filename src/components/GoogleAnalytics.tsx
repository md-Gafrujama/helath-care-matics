"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  CONSENT_EVENT,
  applyGoogleConsent,
  getConsent,
  type ConsentState,
} from "@/lib/consent";

const MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";

/**
 * Loads GA4 with Consent Mode defaults denied until the visitor opts in.
 * No hits before analytics consent. Safe no-op when measurement ID is missing.
 */
export default function GoogleAnalytics() {
  const [ready, setReady] = useState(false);
  const pathname = usePathname() || "/";
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!MEASUREMENT_ID || !MEASUREMENT_ID.startsWith("G-")) return;

    window.dataLayer = window.dataLayer || [];
    function gtag(..._args: unknown[]) {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    }
    window.gtag = gtag;

    gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      functionality_storage: "granted",
      security_storage: "granted",
      wait_for_update: 500,
    });

    gtag("js", new Date());
    gtag("config", MEASUREMENT_ID, {
      anonymize_ip: true,
      send_page_view: false,
    });

    const existing = getConsent();
    if (existing) applyGoogleConsent(existing);

    const onUpdate = (e: Event) => {
      const detail = (e as CustomEvent<ConsentState>).detail;
      applyGoogleConsent(detail || getConsent());
    };

    window.addEventListener(CONSENT_EVENT, onUpdate);
    setReady(true);
    return () => window.removeEventListener(CONSENT_EVENT, onUpdate);
  }, []);

  // SPA navigations: only after analytics consent is granted.
  useEffect(() => {
    if (!ready || !MEASUREMENT_ID.startsWith("G-")) return;
    if (typeof window.gtag !== "function") return;
    const consent = getConsent();
    if (!consent?.analytics) return;

    const pagePath = `${pathname}${searchParams?.toString() ? `?${searchParams.toString()}` : ""}`;
    window.gtag("event", "page_view", { page_path: pagePath });
  }, [ready, pathname, searchParams]);

  if (!MEASUREMENT_ID || !MEASUREMENT_ID.startsWith("G-") || !ready) return null;

  return (
    <Script
      src={`https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`}
      strategy="lazyOnload"
    />
  );
}
