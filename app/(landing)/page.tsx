import { Suspense } from "react";
import LandingPage from "@/components/landing/LandingPage";
import { parseLocale } from "@/lib/locale";
import { getNotices, localizedTitle, noticeHasLocale } from "@/lib/notices";

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
    .slice(0, 3);
  const news = notices.map((n) => ({
    id: n.slug || n.id,
    title: localizedTitle(n, locale),
    date: n.date,
    category: n.category,
  }));

  return (
    <Suspense fallback={null}>
      <LandingPage news={news} locale={locale} />
    </Suspense>
  );
}
