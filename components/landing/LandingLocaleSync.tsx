"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LOCALE_STORAGE_KEY,
  parseLocale,
  withLocale,
} from "@/lib/locale";

function currentSearch(): string {
  if (typeof window === "undefined") return "";
  return window.location.search.replace(/^\?/, "");
}

/** Restores saved EN preference on `/` without rendering a language menu. */
export default function LandingLocaleSync() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const params = new URLSearchParams(currentSearch());
    const current = parseLocale(params.get("lang"));
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, current);
    } catch {
      // ignore
    }
  }, [pathname]);

  useEffect(() => {
    const params = new URLSearchParams(currentSearch());
    if (params.get("lang")) return;
    try {
      const saved = parseLocale(localStorage.getItem(LOCALE_STORAGE_KEY));
      if (saved === "en") {
        const q = params.toString();
        const path = q ? `${pathname}?${q}` : pathname;
        router.replace(withLocale(path, "en"));
      }
    } catch {
      // ignore
    }
  }, [pathname, router]);

  return null;
}
