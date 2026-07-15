import type { Metadata } from "next";
import { Suspense } from "react";
import NoticeList from "@/components/NoticeList";
import { parseLocale } from "@/lib/locale";
import { getNotices } from "@/lib/notices";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "공지사항",
  description: "TomaTok 공지사항",
};

export default async function NoticeListPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang } = await searchParams;
  const locale = parseLocale(lang);
  const notices = await getNotices();

  return (
    <div className="page-wash">
      <div className="mx-auto w-full max-w-[var(--content)] px-5 py-14 md:px-10 md:py-20">
        <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
          TomaTok
        </p>
        <h1 className="mt-2 text-[28px] font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--foreground)] md:text-[34px]">
          {locale === "en" ? "Notices" : "공지사항"}
        </h1>
        <p className="mt-3 max-w-[560px] text-[15px] leading-[1.5] tracking-[-0.01em] text-[var(--muted)] md:text-[17px]">
          {locale === "en"
            ? "Latest updates from TomaTok."
            : "TomaTok의 최신 소식과 업데이트를 확인하세요."}
        </p>
        <Suspense fallback={null}>
          <NoticeList notices={notices} locale={locale} />
        </Suspense>
      </div>
    </div>
  );
}
