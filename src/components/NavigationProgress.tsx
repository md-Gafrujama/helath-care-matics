"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Thin top progress bar for internal navigations + form submits that change routes.
 * Matches HealthMatics pine brand; does not block interaction.
 */
function NavigationProgressInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [active, setActive] = useState(false);
  const [width, setWidth] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const routeKey = `${pathname}?${searchParams?.toString() ?? ""}`;
  const startedFor = useRef<string | null>(null);

  const stop = () => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
    setWidth(100);
    window.setTimeout(() => {
      setActive(false);
      setWidth(0);
    }, 220);
  };

  const start = () => {
    if (timer.current) return;
    setActive(true);
    setWidth(14);
    timer.current = setInterval(() => {
      setWidth((w) => {
        if (w >= 88) return w;
        return w + 4 + Math.random() * 6;
      });
    }, 180);
  };

  // Complete when the URL actually changes.
  useEffect(() => {
    if (startedFor.current && startedFor.current !== routeKey) {
      startedFor.current = null;
      stop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeKey]);

  useEffect(() => {
    const shouldTrackAnchor = (a: HTMLAnchorElement) => {
      if (a.target === "_blank" || a.hasAttribute("download")) return false;
      const href = a.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:"))
        return false;
      try {
        const url = new URL(href, window.location.href);
        if (url.origin !== window.location.origin) return false;
        const next = `${url.pathname}?${url.searchParams.toString()}`;
        const cur = `${window.location.pathname}?${window.location.search.slice(1)}`;
        if (next === cur) return false;
        return true;
      } catch {
        return false;
      }
    };

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return;
      const a = (e.target as HTMLElement | null)?.closest?.("a");
      if (!a || !(a instanceof HTMLAnchorElement)) return;
      if (!shouldTrackAnchor(a)) return;
      startedFor.current = routeKey;
      start();
    };

    const onSubmit = (e: Event) => {
      const form = e.target as HTMLFormElement | null;
      if (!form || form.method?.toLowerCase() === "dialog") return;
      startedFor.current = routeKey;
      start();
      // If navigation does not happen (validation / inline action), finish quickly.
      window.setTimeout(() => {
        if (startedFor.current === routeKey) {
          startedFor.current = null;
          stop();
        }
      }, 1200);
    };

    document.addEventListener("click", onClick, true);
    document.addEventListener("submit", onSubmit, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("submit", onSubmit, true);
      if (timer.current) clearInterval(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeKey]);

  if (!active && width === 0) return null;

  return (
    <div
      className={`nav-progress${active ? " is-active" : ""}`}
      role="progressbar"
      aria-hidden={!active}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(width)}
    >
      <div className="nav-progress-bar" style={{ width: `${width}%` }} />
    </div>
  );
}

export default function NavigationProgress() {
  return (
    <Suspense fallback={null}>
      <NavigationProgressInner />
    </Suspense>
  );
}
