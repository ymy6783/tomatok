import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import NoticeAdminActions from "@/components/NoticeAdminActions";
import { categoryLabel } from "@/lib/noticeCategories";
import {
  formatNoticeHtml,
  formatNoticeText,
} from "@/lib/formatNoticeHtml";
import { parseLocale, withLocale } from "@/lib/locale";
import {
  getNoticeById,
  getNotices,
  localizedBody,
  localizedTitle,
  noticeHasLocale,
} from "@/lib/notices";

export const revalidate = 3600;

export async function generateStaticParams() {
  const notices = await getNotices();
  return notices.map((n) => ({ id: n.id }));
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ lang?: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { lang } = await searchParams;
  const locale = parseLocale(lang);
  const notice = await getNoticeById(id);
  if (!notice) return { title: "공지사항" };
  return {
    title: localizedTitle(notice, locale),
    description:
      localizedBody(notice, locale).text.slice(0, 140) ||
      localizedTitle(notice, locale),
  };
}

export default async function NoticeDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const { id } = await params;
  const { lang } = await searchParams;
  const locale = parseLocale(lang);
  const notice = await getNoticeById(id);
  if (!notice) notFound();

  const effectiveLocale = noticeHasLocale(notice, locale) ? locale : "ko";
  const { html: rawHtml, text } = localizedBody(notice, effectiveLocale);
  const bodyHtml = rawHtml
    ? formatNoticeHtml(rawHtml)
    : text
      ? formatNoticeText(text)
      : "";

  return (
    <article className="page-wash">
      <div className="mx-auto w-full max-w-[692px] px-5 py-14 md:py-20">
        <Link
          href={withLocale("/notice", effectiveLocale)}
          className="inline-flex items-center gap-1 text-[14px] text-[var(--link)] hover:underline"
        >
          <span aria-hidden>‹</span>
          {effectiveLocale === "en" ? "Notices" : "공지사항"}
        </Link>

        <header className="mt-8 border-b border-[var(--line-soft)] pb-10 md:mt-10 md:pb-12">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-[var(--muted)]">
            {notice.category && (
              <span>{categoryLabel(notice.category, effectiveLocale)}</span>
            )}
            {notice.category && notice.date && (
              <span aria-hidden className="text-[var(--line)]">
                ·
              </span>
            )}
            <span className="tabular-nums">{notice.date ?? ""}</span>
          </div>
          <h1 className="mt-3 text-[32px] font-semibold leading-[1.125] tracking-[-0.022em] text-[var(--foreground)] md:mt-4 md:text-[40px]">
            {localizedTitle(notice, effectiveLocale)}
          </h1>
          {locale === "en" && !noticeHasLocale(notice, "en") && (
            <p className="mt-3 text-[14px] text-[var(--muted)]">
              English version is not available. Showing Korean.
            </p>
          )}
        </header>

        {notice.links.length > 0 && (
          <ul className="mt-8 space-y-2 rounded-[var(--radius)] bg-[var(--band)] px-5 py-4 text-[15px]">
            {notice.links.map((href) => (
              <li key={href}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[var(--link)] hover:underline"
                >
                  {href}
                </a>
              </li>
            ))}
          </ul>
        )}

        {notice.images.length > 0 && (
          <div className="mt-10 space-y-5">
            {notice.images.map((src) => {
              const isImage = /\.(png|jpe?g|gif|webp|svg)(\?|$)/i.test(src);
              if (!isImage) {
                return (
                  <a
                    key={src}
                    href={src}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-[var(--radius)] bg-[var(--band)] px-5 py-4 text-[15px] text-[var(--link)]"
                  >
                    {effectiveLocale === "en"
                      ? "Open attachment"
                      : "첨부 파일 열기"}
                  </a>
                );
              }
              return (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={src}
                  src={src}
                  alt=""
                  className="w-full rounded-[var(--radius)]"
                />
              );
            })}
          </div>
        )}

        {bodyHtml ? (
          <div
            className="notice-body mt-10 md:mt-12"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />
        ) : (
          <p className="mt-10 text-[17px] text-[var(--muted)] md:mt-12">
            {effectiveLocale === "en"
              ? "This notice has attachment/image content only."
              : "본문이 첨부 파일/이미지로만 제공된 공지입니다."}
          </p>
        )}

        <NoticeAdminActions noticeId={notice.id} locale={effectiveLocale} />
      </div>
    </article>
  );
}
