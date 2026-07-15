"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  NOTICE_CATEGORIES,
  categoryLabel,
  type NoticeCategoryId,
} from "@/lib/noticeCategories";
import {
  localizedTitle,
  noticeHasLocale,
  type Notice,
} from "@/lib/notices";
import { withLocale, type Locale } from "@/lib/locale";

type FilterId = "all" | NoticeCategoryId;

const PAGE_SIZE = 10;

export default function NoticeList({
  notices,
  locale,
}: {
  notices: Notice[];
  locale: Locale;
}) {
  const [filter, setFilter] = useState<FilterId>("all");
  const [page, setPage] = useState(1);

  const localeNotices = useMemo(
    () => notices.filter((n) => noticeHasLocale(n, locale)),
    [notices, locale]
  );

  const available = useMemo(() => {
    const present = new Set(
      localeNotices.map((n) => n.category).filter(Boolean) as string[]
    );
    return NOTICE_CATEGORIES.filter((c) => present.has(c.id));
  }, [localeNotices]);

  const filtered = useMemo(() => {
    if (filter === "all") return localeNotices;
    return localeNotices.filter((n) => n.category === filter);
  }, [localeNotices, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  function changeFilter(next: FilterId) {
    setFilter(next);
    setPage(1);
  }

  return (
    <>
      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="tablist"
          aria-label={locale === "en" ? "Category" : "카테고리"}
          className="inline-flex max-w-full flex-wrap gap-1 rounded-[var(--radius)] bg-[var(--band)] p-1"
        >
          <Segment
            active={filter === "all"}
            onClick={() => changeFilter("all")}
            label={locale === "en" ? "All" : "전체"}
          />
          {available.map((c) => (
            <Segment
              key={c.id}
              active={filter === c.id}
              onClick={() => changeFilter(c.id)}
              label={locale === "en" ? c.labelEn : c.label}
            />
          ))}
        </div>
        <p className="text-[13px] tabular-nums text-[var(--muted)]">
          {locale === "en"
            ? `${localeNotices.length} notices`
            : `${localeNotices.length}건`}
        </p>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-24 text-center text-[17px] text-[var(--muted)]">
          {locale === "en"
            ? "No notices in English yet."
            : "해당 카테고리 공지가 없습니다."}
        </p>
      ) : (
        <>
          <ul className="mt-8 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line-soft)] bg-white">
            {pageItems.map((n, i) => (
              <li
                key={n.id}
                className={
                  i > 0 ? "border-t border-[var(--line-soft)]" : undefined
                }
              >
                <Link
                  href={withLocale(`/notice/${n.id}`, locale)}
                  className="group flex items-center gap-4 px-5 py-5 transition hover:bg-[var(--hover)] md:px-6 md:py-[22px]"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 text-[12px] text-[var(--muted)] md:text-[13px]">
                      {n.category && (
                        <span>{categoryLabel(n.category, locale)}</span>
                      )}
                      {n.category && n.date && (
                        <span aria-hidden className="text-[var(--line)]">
                          ·
                        </span>
                      )}
                      <span className="tabular-nums">{n.date ?? ""}</span>
                    </div>
                    <p className="mt-1.5 text-[17px] font-semibold leading-[1.3] tracking-[-0.015em] text-[var(--foreground)] md:text-[18px]">
                      {localizedTitle(n, locale)}
                    </p>
                  </div>
                  <span
                    aria-hidden
                    className="shrink-0 text-[24px] font-light leading-none text-[var(--muted)] transition group-hover:translate-x-0.5 group-hover:text-[var(--foreground)]"
                  >
                    ›
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {totalPages > 1 && (
            <nav
              className="mt-12 flex items-center justify-center gap-2"
              aria-label={locale === "en" ? "Pagination" : "공지 페이지"}
            >
              <PageLink
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                {locale === "en" ? "Prev" : "이전"}
              </PageLink>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <PageLink
                    key={n}
                    active={n === currentPage}
                    onClick={() => setPage(n)}
                  >
                    {n}
                  </PageLink>
                ))}
              </div>
              <PageLink
                disabled={currentPage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                {locale === "en" ? "Next" : "다음"}
              </PageLink>
            </nav>
          )}
        </>
      )}
    </>
  );
}

function Segment({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`rounded-[10px] px-3.5 py-1.5 text-[13px] font-medium transition md:px-4 ${
        active
          ? "bg-white text-[var(--foreground)] shadow-sm"
          : "text-[var(--muted)] hover:text-[var(--foreground)]"
      }`}
    >
      {label}
    </button>
  );
}

function PageLink({
  children,
  onClick,
  active,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex h-9 min-w-9 items-center justify-center rounded-[var(--radius-pill)] px-3 text-[14px] transition disabled:cursor-not-allowed disabled:opacity-30 ${
        active
          ? "bg-[var(--foreground)] text-white"
          : "text-[var(--muted)] hover:bg-[var(--band)] hover:text-[var(--foreground)]"
      }`}
    >
      {children}
    </button>
  );
}
