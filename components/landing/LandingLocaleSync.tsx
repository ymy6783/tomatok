"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  LOCALE_STORAGE_KEY,
  parseLocale,
  withLocale,
} from "@/lib/locale";

/** Restores saved EN preference on `/` without rendering a language menu. */
export default function LandingLocaleSync() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const current = parseLocale(searchParams.get("lang"));
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, current);
    } catch {
      // ignore
    }
  }, [searchParams]);

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

  return null;
}
