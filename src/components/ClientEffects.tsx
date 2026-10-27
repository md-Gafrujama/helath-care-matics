"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { SUBSCRIBED_KEY, submitSubscribe } from "@/lib/subscribe-client";

function resolveSourceFromPath(path: string, form: HTMLFormElement) {
  const articleMatch = path.match(/^\/article\/([^/]+)/);
  if (articleMatch || form.dataset.articleSlug) {
    return {
      sourceType: "blog",
      sourceSlug: form.dataset.articleSlug || articleMatch?.[1] || null,
      sourceTitle: form.dataset.articleTitle || null,
    };
  }
  const resourceMatch = path.match(
    /^\/resources\/(white-papers|reports|case-studies|webinars)\/([^/]+)/,
  );
  if (resourceMatch) {
    const map: Record<string, string> = {
      "white-papers": "whitepaper",
      reports: "report",
      "case-studies": "case_study",
      webinars: "webinar",
    };
    return {
      sourceType: form.dataset.sourceType || map[resourceMatch[1]] || "whitepaper",
      sourceSlug: form.dataset.sourceSlug || resourceMatch[2],
      sourceTitle: form.dataset.sourceTitle || null,
    };
  }
  if (path === "/" || path.startsWith("/#")) {
    return { sourceType: "blog", sourceSlug: null, sourceTitle: "Home" };
  }
  return {
    sourceType: form.dataset.sourceType || form.dataset.source || "site",
    sourceSlug: form.dataset.sourceSlug || null,
    sourceTitle: form.dataset.sourceTitle || null,
  };
}

export default function ClientEffects() {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.classList.add("js");

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

    const onSubmit = (e: Event) => {
      e.preventDefault();
      const f = e.target as HTMLFormElement;
      const input = f.querySelector(
        'input[type="email"]',
      ) as HTMLInputElement | null;
      const b = f.querySelector("button") as HTMLButtonElement | null;
      const email = input?.value.trim() ?? "";
      if (!email) return;

      const prevLabel = b?.textContent;
      if (b) {
        b.textContent = "Saving…";
        b.disabled = true;
      }

      const lead = resolveSourceFromPath(pathname || "/", f);

      void submitSubscribe({
        email,
        source: f.dataset.source || lead.sourceType || "site",
        articleId: f.dataset.articleId || null,
        articleSlug: f.dataset.articleSlug || null,
        articleTitle: f.dataset.articleTitle || null,
        topicId: f.dataset.topicId || null,
        topicSlug: f.dataset.topicSlug || null,
        topicName: f.dataset.topicName || null,
        sourceType: lead.sourceType,
        sourceSlug: lead.sourceSlug,
        sourceTitle: lead.sourceTitle,
        pathname,
      })
        .then(() => {
          try {
            window.localStorage.setItem(SUBSCRIBED_KEY, "1");
          } catch {
            // ignore
          }
          if (b) b.textContent = "✓ Subscribed";
          f.querySelectorAll("input").forEach((i) => {
            if ((i as HTMLInputElement).type !== "checkbox") {
              (i as HTMLInputElement).value = "";
            }
          });
        })
        .catch(() => {
          if (b) {
            b.textContent = prevLabel || "Subscribe";
            b.disabled = false;
          }
          window.alert("Could not subscribe. Try again.");
        });
    };

    const forms = Array.from(
      document.querySelectorAll("form.js-fake-subscribe"),
    );
    forms.forEach((f) => f.addEventListener("submit", onSubmit));

    const modalButtons = Array.from(
      document.querySelectorAll("[data-open-modal]"),
    );
    const openModal = () => {
      window.dispatchEvent(new CustomEvent("healthmatics:open-modal"));
    };
    modalButtons.forEach((btn) => btn.addEventListener("click", openModal));

    return () => {
      io.disconnect();
      forms.forEach((f) => f.removeEventListener("submit", onSubmit));
      modalButtons.forEach((btn) => btn.removeEventListener("click", openModal));
    };
  }, [pathname]);

  return null;
}
