export type Locale = "ko" | "en";

export const LOCALE_STORAGE_KEY = "tomatok-lang";

export function parseLocale(value?: string | null): Locale {
  return value === "en" ? "en" : "ko";
}

export function withLocale(path: string, locale: Locale): string {
  const [base, query = ""] = path.split("?");
  const params = new URLSearchParams(query);
  if (locale === "en") params.set("lang", "en");
  else params.delete("lang");
  const q = params.toString();
  return q ? `${base}?${q}` : base;
}
