import Link from "next/link";
import {
  getNotices,
  localizedTitle,
  noticeHasLocale,
} from "@/lib/notices";
import { categoryLabel } from "@/lib/noticeCategories";
import { parseLocale, withLocale } from "@/lib/locale";

export const revalidate = 3600;

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang } = await searchParams;
  const locale = parseLocale(lang);
  const notices = (await getNotices())
    .filter((n) => noticeHasLocale(n, locale))
    .slice(0, 5);

  return (
    <div>
      <section className="page-wash px-5">
        <div className="mx-auto flex min-h-[72vh] w-full max-w-[980px] flex-col items-center justify-center py-28 text-center md:min-h-[680px] md:py-32">
          <p className="anim-rise text-[19px] font-semibold tracking-[-0.01em] text-[var(--accent)] md:text-[21px]">
            TOTT Ecosystem
          </p>
          <h1 className="anim-rise anim-rise-delay-1 mt-2 text-[56px] font-semibold leading-[1.07] tracking-[-0.025em] text-[var(--foreground)] md:text-[80px]">
            TomaTok
          </h1>
          <p className="anim-rise anim-rise-delay-2 mt-5 max-w-[480px] text-[19px] leading-[1.38] tracking-[-0.01em] text-[var(--muted)] md:mt-6 md:text-[24px] md:leading-[1.333]">
            {locale === "en"
              ? "Notices and white paper, in one place."
              : "공지사항과 화이트페이퍼를 한곳에서."}
          </p>
          <div className="anim-rise anim-rise-delay-3 mt-9 flex flex-wrap items-center justify-center gap-5 md:mt-10">
            <Link
              href={withLocale("/notice", locale)}
              className="inline-flex h-11 items-center rounded-[var(--radius-pill)] bg-[var(--blue)] px-5 text-[17px] font-normal text-white transition hover:brightness-110"
            >
              {locale === "en" ? "View notices" : "공지사항 보기"}
            </Link>
            <a
              href={
                locale === "en"
                  ? "https://github.com/Needspsersand/WHITEOBER"
                  : "https://github.com/Needspsersand/WHITEOBER-KO"
              }
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[17px] text-[var(--link)] transition hover:underline"
            >
              {locale === "en" ? "Learn more" : "더 알아보기"}
              <span aria-hidden>›</span>
            </a>
          </div>
        </div>
      </section>

      <section className="bg-[var(--band)]">
        <div className="mx-auto w-full max-w-[980px] px-5 py-24 md:py-28">
          <div className="mb-3 flex items-end justify-between gap-4">
            <h2 className="text-[28px] font-semibold tracking-[-0.02em] text-[var(--foreground)] md:text-[40px]">
              {locale === "en" ? "Notices" : "공지사항"}
            </h2>
            <Link
              href={withLocale("/notice", locale)}
              className="mb-1 text-[17px] text-[var(--link)] hover:underline"
            >
              {locale === "en" ? "See all" : "모두 보기"}
              <span aria-hidden> ›</span>
            </Link>
          </div>
          <p className="mb-10 max-w-xl text-[17px] leading-snug text-[var(--muted)] md:text-[19px]">
            {locale === "en"
              ? "The latest updates from TomaTok."
              : "TomaTok의 최신 소식입니다."}
          </p>

          <ul className="overflow-hidden rounded-[var(--radius-lg)] bg-white shadow-[var(--shadow-tile)]">
            {notices.map((n, i) => (
              <li
                key={n.id}
                className={
                  i > 0 ? "border-t border-[var(--line-soft)]" : undefined
                }
              >
                <Link
                  href={withLocale(`/notice/${n.id}`, locale)}
                  className="group flex items-center gap-4 px-5 py-[18px] transition hover:bg-[var(--hover)] md:px-6"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[12px] text-[var(--muted)] md:text-[13px]">
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
                    <p className="mt-1 truncate text-[17px] font-semibold leading-snug tracking-[-0.01em] text-[var(--foreground)] md:text-[19px]">
                      {localizedTitle(n, locale)}
                    </p>
                  </div>
                  <span
                    aria-hidden
                    className="shrink-0 text-[22px] font-light leading-none text-[var(--muted)] transition group-hover:text-[var(--foreground)]"
                  >
                    ›
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
