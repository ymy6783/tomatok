"use client";

import Link from "next/link";
import { Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import LocaleTabs from "@/components/LocaleTabs";
import { parseLocale, withLocale } from "@/lib/locale";

const WHITEPAPER = {
  ko: "https://github.com/Needspsersand/WHITEOBER-KO",
  en: "https://github.com/Needspsersand/WHITEOBER",
};

function HeaderInner() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const locale = parseLocale(searchParams.get("lang"));

  const nav = [
    {
      href: withLocale("/", locale),
      match: "/",
      label: locale === "en" ? "Home" : "홈",
    },
    {
      href: withLocale("/notice", locale),
      match: "/notice",
      label: locale === "en" ? "Notices" : "공지사항",
    },
    {
      href: WHITEPAPER[locale],
      label: locale === "en" ? "White Paper" : "화이트페이퍼",
      external: true,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[var(--surface)] backdrop-blur-[20px] backdrop-saturate-[180%]">
      <div className="mx-auto flex h-12 w-full max-w-[980px] items-center justify-between gap-4 px-5 md:h-[44px]">
        <Link
          href={withLocale("/", locale)}
          className="shrink-0 text-[19px] font-semibold tracking-[-0.02em] text-[var(--foreground)]"
        >
          Toma<span className="text-[var(--accent)]">Tok</span>
        </Link>
        <div className="flex items-center gap-4 md:gap-7">
          <nav className="flex items-center gap-5 text-[12px] md:gap-6 md:text-[12px]">
            {nav.map((l) => {
              const active =
                !l.external &&
                (l.match === "/"
                  ? pathname === "/"
                  : pathname.startsWith(l.match!));
              const className = `transition ${
                active
                  ? "font-medium text-[var(--foreground)]"
                  : "text-[var(--foreground)]/70 hover:text-[var(--foreground)]"
              }`;
              return l.external ? (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[var(--foreground)]/70 transition hover:text-[var(--foreground)]"
                >
                  {l.label}
                </a>
              ) : (
                <Link key={l.href} href={l.href} className={className}>
                  {l.label}
                </Link>
              );
            })}
          </nav>
          <LocaleTabs locale={locale} variant="compact" />
        </div>
      </div>
      <div className="h-px w-full bg-[var(--line-soft)]" />
    </header>
  );
}

export default function Header() {
  return (
    <Suspense
      fallback={
        <header className="sticky top-0 z-40 bg-[var(--surface)] backdrop-blur-[20px]">
          <div className="mx-auto flex h-12 w-full max-w-[980px] items-center px-5 md:h-[44px]">
            <span className="text-[19px] font-semibold tracking-[-0.02em] text-[var(--foreground)]">
              Toma<span className="text-[var(--accent)]">Tok</span>
            </span>
          </div>
          <div className="h-px w-full bg-[var(--line-soft)]" />
        </header>
      }
    >
      <HeaderInner />
    </Suspense>
  );
}
