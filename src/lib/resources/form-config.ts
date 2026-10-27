import {
  defaultFormConfig,
  resolveFormFields,
  type ResourceConsent,
  type ResourceFormConfig,
  type ResourceFormField,
  type ResourceQuestion,
  SITE_NAME,
} from "@/lib/resources/constants";

function asString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function asBool(v: unknown, fallback: boolean): boolean {
  return typeof v === "boolean" ? v : fallback;
}

function parseFields(raw: unknown): ResourceFormField[] {
  if (!Array.isArray(raw)) return [];
  const out: ResourceFormField[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const row = item as Record<string, unknown>;
    const key = asString(row.key);
    const label = asString(row.label) || key;
    if (!key) continue;
    out.push({
      key: key as ResourceFormField["key"],
      label,
      required: asBool(row.required, true),
    });
  }
  return out;
}

function parseConsents(raw: unknown): ResourceConsent[] {
  if (!Array.isArray(raw)) return defaultFormConfig().consents;
  const out: ResourceConsent[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const row = item as Record<string, unknown>;
    const id = asString(row.id) || crypto.randomUUID();
    const kind = asString(row.kind, "extra") as ResourceConsent["kind"];
    out.push({
      id,
      kind:
        kind === "terms" ||
        kind === "partners" ||
        kind === "optout" ||
        kind === "extra"
          ? kind
          : "extra",
      text: asString(row.text),
      show: asBool(row.show, true),
      required: asBool(row.required, kind !== "optout"),
    });
  }
  return out.length ? out : defaultFormConfig().consents;
}

function parseQuestions(raw: unknown): ResourceQuestion[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((q): q is Record<string, unknown> => Boolean(q) && typeof q === "object")
    .map((q) => {
      const options = Array.isArray(q.options)
        ? q.options
            .filter((o): o is string => typeof o === "string")
            .map((o) => o.trim())
            .filter(Boolean)
        : [];
      return {
        id: asString(q.id) || crypto.randomUUID(),
        text: asString(q.text),
        options: options.length ? options : undefined,
      };
    })
    .filter((q) => q.text.trim().length > 0);
}

export function parseFormConfig(raw: unknown): ResourceFormConfig {
  const base = defaultFormConfig();
  if (!raw || typeof raw !== "object") return base;
  const obj = raw as Record<string, unknown>;
  const fields = resolveFormFields(parseFields(obj.fields));
  return {
    fields,
    emailNote: asString(obj.emailNote, base.emailNote) || base.emailNote,
    consents: parseConsents(obj.consents),
    footerLine: asString(obj.footerLine, base.footerLine) || base.footerLine,
    questions: parseQuestions(obj.questions),
  };
}

/** Render consent / footer tokens to HTML-safe React-friendly segments. */
export type ConsentSegment =
  | { type: "text"; value: string }
  | { type: "bold"; value: string }
  | { type: "link"; href: string; label: string };

const TOKEN_HREFS: Record<string, { href: string; label: string }> = {
  "{{terms}}": { href: "/privacy", label: "Terms of Use" },
  "{{privacy}}": { href: "/privacy", label: "Privacy Policy" },
  "{{privacy-statement}}": { href: "/privacy", label: "privacy statement" },
  "{{unsubscribe}}": { href: "/unsubscribe", label: "unsubscribe" },
  "{{publisher}}": { href: "/", label: SITE_NAME },
};

export function parseConsentCopy(input: string): ConsentSegment[] {
  const segments: ConsentSegment[] = [];
  const src = input
    .replace(/\{Privacy Policy\}/gi, "{{privacy}}")
    .replace(/\{terms\}/gi, "{{terms}}")
    .replace(/\{privacy\}/gi, "{{privacy}}")
    .replace(/\{privacy-statement\}/gi, "{{privacy-statement}}")
    .replace(/\{unsubscribe\}/gi, "{{unsubscribe}}")
    .replace(/\{publisher\}/gi, "{{publisher}}")
    .replace(/\{([^}|]+)\|([^}]+)\}/g, "[$1]($2)")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label: string, href: string) => {
      return `%%LINK:${href}::${label}%%`;
    });

  const tokenRe =
    /(\*\*[^*]+\*\*|{{terms}}|{{privacy}}|{{privacy-statement}}|{{unsubscribe}}|{{publisher}}|%%LINK:[^%]+%%)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = tokenRe.exec(src))) {
    if (match.index > last) {
      segments.push({ type: "text", value: src.slice(last, match.index) });
    }
    const token = match[0];
    if (token.startsWith("**") && token.endsWith("**")) {
      segments.push({ type: "bold", value: token.slice(2, -2) });
    } else if (token.startsWith("%%LINK:")) {
      const inner = token.slice(7, -2);
      const [href, label] = inner.split("::");
      segments.push({ type: "link", href: href || "/privacy", label: label || href });
    } else if (TOKEN_HREFS[token]) {
      const t = TOKEN_HREFS[token];
      if (token === "{{publisher}}") {
        segments.push({ type: "text", value: t.label });
      } else {
        segments.push({ type: "link", href: t.href, label: t.label });
      }
    } else {
      segments.push({ type: "text", value: token });
    }
    last = match.index + token.length;
  }
  if (last < src.length) {
    segments.push({ type: "text", value: src.slice(last) });
  }
  return segments;
}

export function step2AdminFields(config: ResourceFormConfig): ResourceFormField[] {
  const fields = resolveFormFields(config.fields);
  return fields.filter((f) => f.key !== "first_name" && f.key !== "last_name");
}
