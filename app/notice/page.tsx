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
      <div className="mx-auto w-full max-w-[980px] px-5 py-16 md:py-24">
        <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
          TomaTok
        </p>
        <h1 className="mt-2 text-[40px] font-semibold leading-[1.1] tracking-[-0.025em] text-[var(--foreground)] md:text-[56px]">
          {locale === "en" ? "Notices" : "공지사항"}
        </h1>
        <p className="mt-4 max-w-[540px] text-[19px] leading-[1.38] tracking-[-0.01em] text-[var(--muted)] md:text-[21px]">
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
