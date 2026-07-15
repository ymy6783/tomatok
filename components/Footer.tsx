"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { parseLocale, withLocale } from "@/lib/locale";

function FooterInner() {
  const searchParams = useSearchParams();
  const locale = parseLocale(searchParams.get("lang"));

  return (
    <footer className="mt-auto border-t border-[var(--line-soft)] bg-[var(--band)]">
      <div className="mx-auto w-full max-w-[var(--content)] px-5 py-14 md:px-10 md:py-16">
        <p className="text-[21px] font-semibold tracking-[-0.02em] text-[var(--foreground)]">
          Toma<span className="text-[var(--accent)]">Tok</span>
        </p>
        <div className="mt-5 flex flex-wrap gap-x-7 gap-y-2 text-[12px] text-[var(--muted)]">
          <Link
            href={withLocale("/notice", locale)}
            className="hover:text-[var(--foreground)]"
          >
            {locale === "en" ? "Notices" : "공지사항"}
          </Link>
          <a
            href={
              locale === "en"
                ? "https://github.com/Needspsersand/WHITEOBER"
                : "https://github.com/Needspsersand/WHITEOBER-KO"
            }
            target="_blank"
            rel="noreferrer"
            className="hover:text-[var(--foreground)]"
          >
            {locale === "en" ? "White Paper" : "화이트페이퍼"}
          </a>
        </div>
        <p className="mt-10 text-[12px] leading-relaxed text-[var(--muted)]">
          Copyright © {new Date().getFullYear()} TomaTok. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default function Footer() {
  return (
    <Suspense
      fallback={
        <footer className="mt-auto border-t border-[var(--line-soft)] bg-[var(--band)]">
          <div className="mx-auto w-full max-w-[var(--content)] px-5 py-14 md:px-10">
            <p className="text-[21px] font-semibold tracking-[-0.02em] text-[var(--foreground)]">
              Toma<span className="text-[var(--accent)]">Tok</span>
            </p>
          </div>
        </footer>
      }
    >
      <FooterInner />
    </Suspense>
  );
}
