"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  LOCALE_STORAGE_KEY,
  parseLocale,
  withLocale,
  type Locale,
} from "@/lib/locale";

export default function LocaleTabs({
  locale,
  variant = "default",
}: {
  locale: Locale;
  variant?: "default" | "compact";
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch {
      // ignore
    }
  }, [locale]);

  // Restore preferred language when URL has no lang
  useEffect(() => {
    if (searchParams.get("lang")) return;
    try {
      const saved = parseLocale(localStorage.getItem(LOCALE_STORAGE_KEY));
      if (saved === "en") {
        const q = searchParams.toString();
        const path = q ? `${pathname}?${q}` : pathname;
        router.replace(withLocale(path, "en"));
      }
    } catch {
      // ignore
    }
  }, [pathname, router, searchParams]);

  function setLocale(next: Locale) {
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      // ignore
    }
    const q = searchParams.toString();
    const path = q ? `${pathname}?${q}` : pathname;
    router.push(withLocale(path, next));
  }

  if (variant === "compact") {
    return (
      <div className="inline-flex items-center gap-1 text-[12px] md:text-[13px]">
        <button
          type="button"
          onClick={() => setLocale("ko")}
          className={`px-1.5 py-0.5 font-medium transition ${
            locale === "ko"
              ? "text-[var(--foreground)]"
              : "text-[var(--muted)] hover:text-[var(--foreground)]"
          }`}
          aria-pressed={locale === "ko"}
        >
          KO
        </button>
        <span className="text-[var(--line)]" aria-hidden>
          /
        </span>
        <button
          type="button"
          onClick={() => setLocale("en")}
          className={`px-1.5 py-0.5 font-medium transition ${
            locale === "en"
              ? "text-[var(--foreground)]"
              : "text-[var(--muted)] hover:text-[var(--foreground)]"
          }`}
          aria-pressed={locale === "en"}
        >
          EN
        </button>
      </div>
    );
  }

  return (
    <div className="inline-flex rounded-[10px] bg-[var(--band)] p-1">
      <button
        type="button"
        onClick={() => setLocale("ko")}
        className={`rounded-[10px] px-4 py-1.5 text-[13px] font-medium transition ${
          locale === "ko"
            ? "bg-white text-[var(--foreground)] shadow-sm"
            : "text-[var(--muted)] hover:text-[var(--foreground)]"
        }`}
      >
        한국어
      </button>
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={`rounded-[10px] px-4 py-1.5 text-[13px] font-medium transition ${
          locale === "en"
            ? "bg-white text-[var(--foreground)] shadow-sm"
            : "text-[var(--muted)] hover:text-[var(--foreground)]"
        }`}
      >
        English
      </button>
    </div>
  );
}
