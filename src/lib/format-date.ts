export function formatPublishedDate(
  iso: string | null | undefined,
  style: "short" | "long" = "short",
) {
  if (!iso) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: style === "long" ? "long" : "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}
