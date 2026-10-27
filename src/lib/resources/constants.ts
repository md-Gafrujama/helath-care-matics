export const SITE_NAME = "HealthMatics";

export const RESOURCE_VERTICALS = [
  "AI in Healthcare",
  "Hospital M&A",
  "Healthcare Cybersecurity",
  "Digital Health",
  "Revenue Cycle",
  "Health Policy",
] as const;

export type ResourceVertical = (typeof RESOURCE_VERTICALS)[number];

export const RESOURCE_CATEGORIES = [
  "whitepaper",
  "report",
  "case_study",
  "guide",
  "webinar",
] as const;

export type ResourceCategory = (typeof RESOURCE_CATEGORIES)[number];

export const RESOURCE_CATEGORY_META: Record<
  ResourceCategory,
  { label: string; plural: string; path: string }
> = {
  whitepaper: {
    label: "White paper",
    plural: "White papers",
    path: "white-papers",
  },
  report: { label: "Report", plural: "Reports", path: "reports" },
  case_study: {
    label: "Case study",
    plural: "Case studies",
    path: "case-studies",
  },
  guide: { label: "Guide", plural: "Guides", path: "guides" },
  webinar: { label: "Webinar", plural: "Webinars", path: "webinars" },
};

/** Hub / nav / footer order. */
export const RESOURCE_NAV = [
  { key: "blogs", label: "Blogs", href: "/blogs" },
  {
    key: "whitepaper",
    label: "White papers",
    href: "/resources/white-papers",
    category: "whitepaper" as const,
  },
  {
    key: "report",
    label: "Reports",
    href: "/resources/reports",
    category: "report" as const,
  },
  {
    key: "case_study",
    label: "Case studies",
    href: "/resources/case-studies",
    category: "case_study" as const,
  },
  {
    key: "guide",
    label: "Guides",
    href: "/resources/guides",
    category: "guide" as const,
  },
  {
    key: "webinar",
    label: "Webinars",
    href: "/resources/webinars",
    category: "webinar" as const,
  },
] as const;

export const FORM_FIELD_OPTIONS = [
  { key: "zip", label: "Zip/Postal Code" },
  { key: "phone", label: "Phone" },
  { key: "first_name", label: "First name" },
  { key: "last_name", label: "Last name" },
  { key: "job_title", label: "Job title" },
  { key: "street", label: "Street address" },
  { key: "suite", label: "Suite / office" },
  { key: "city", label: "City" },
  { key: "state", label: "State / province" },
  { key: "country", label: "Country" },
] as const;

export type FormFieldKey = (typeof FORM_FIELD_OPTIONS)[number]["key"];

export type ResourceFormField = {
  key: FormFieldKey;
  label: string;
  required: boolean;
};

export type ResourceConsent = {
  id: string;
  kind: "terms" | "partners" | "optout" | "extra";
  text: string;
  show: boolean;
  required: boolean;
};

export type ResourceQuestion = {
  id: string;
  text: string;
  /** If 2+ options, public form shows a dropdown; otherwise a text field. */
  options?: string[];
};

export type ResourceInsideSection = {
  id: string;
  heading: string;
  copy: string;
};

export type ResourceFormConfig = {
  fields: ResourceFormField[];
  emailNote: string;
  consents: ResourceConsent[];
  footerLine: string;
  questions: ResourceQuestion[];
};

export const DOWNLOAD_ACCENT = "#F58220";
export const DOWNLOAD_ACCENT_HOVER = "#e67410";
export const DOWNLOAD_NAVY = "#0B1F3D";
export const DOWNLOAD_PANEL_BG = "#f3f3f3";

const PERSONAL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "yahoo.co.uk",
  "yahoo.co.in",
  "ymail.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "msn.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "aol.com",
  "protonmail.com",
  "proton.me",
  "gmx.com",
  "mail.com",
  "zoho.com",
  "yandex.com",
  "pm.me",
]);

export function isPersonalEmail(email: string): boolean {
  const domain = email.trim().toLowerCase().split("@")[1] ?? "";
  return PERSONAL_DOMAINS.has(domain);
}

export function pathToCategory(pathSeg: string): ResourceCategory | null {
  const found = (
    Object.entries(RESOURCE_CATEGORY_META) as [
      ResourceCategory,
      (typeof RESOURCE_CATEGORY_META)[ResourceCategory],
    ][]
  ).find(([, meta]) => meta.path === pathSeg);
  return found?.[0] ?? null;
}

export function categoryToPath(category: ResourceCategory): string {
  return RESOURCE_CATEGORY_META[category].path;
}

export function categoryLabel(category: ResourceCategory): string {
  return RESOURCE_CATEGORY_META[category].label;
}

export function defaultFormConfig(): ResourceFormConfig {
  return {
    fields: [
      { key: "zip", label: "Zip/Postal Code", required: true },
      { key: "phone", label: "Phone", required: true },
    ],
    emailNote:
      "Company email only. Not Gmail, Yahoo, Outlook, or other personal addresses.",
    consents: [
      {
        id: "terms",
        kind: "terms",
        show: true,
        required: true,
        text: `I agree to ${SITE_NAME}'s {{terms}}, {{privacy}}, and the transfer of my information to the United States for processing to provide me with relevant information as described in our {{privacy}}.`,
      },
      {
        id: "partners",
        kind: "partners",
        show: true,
        required: true,
        text: `I agree to my information being processed by ${SITE_NAME} and its partners to contact me via phone, email or other means regarding information relevant to my professional interests. I may {{unsubscribe}} at any time.`,
      },
      {
        id: "optout",
        kind: "optout",
        show: true,
        required: false,
        text: `**Optional:** check this box only if you want to **opt out of further emails** from ${SITE_NAME}. Leave it unchecked to keep receiving relevant updates. Read our {{privacy-statement}}.`,
      },
    ],
    footerLine: `I have read and understood privacy statement of {{publisher}}.`,
    questions: [],
  };
}

/** Resolve published form fields without wiping a filled list via empty-flag mistakes. */
export function resolveFormFields(
  saved: ResourceFormField[] | null | undefined,
): ResourceFormField[] {
  if (Array.isArray(saved) && saved.length > 0) return saved;
  return defaultFormConfig().fields;
}

export function isOptOutConsent(c: ResourceConsent): boolean {
  if (c.kind === "optout") return true;
  if (c.required === false) {
    const t = c.text.toLowerCase();
    return (
      t.includes("contact me") ||
      t.includes("related research") ||
      t.includes("marketing") ||
      t.includes("opt out") ||
      t.includes("opt-out")
    );
  }
  return false;
}
