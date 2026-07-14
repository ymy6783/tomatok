import type { Metadata } from "next";
import Link from "next/link";
import { getNotices } from "@/lib/notices";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Notice",
  description: "TomaTok 공지사항",
};

export default async function NoticeListPage() {
  const notices = await getNotices();

  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold text-white">
        Notice
      </h1>
      <p className="mt-3 text-white/55">공식 공지 및 업데이트</p>

      <ul className="mt-12 divide-y divide-white/10 border-y border-white/10">
        {notices.map((n) => (
          <li key={n.id}>
            <Link
              href={`/notice/${n.id}`}
              className="flex flex-col gap-1 py-5 transition hover:bg-white/[0.03] sm:flex-row sm:items-baseline sm:gap-8"
            >
              <span className="w-28 shrink-0 text-sm text-white/40">{n.date ?? "—"}</span>
              <span className="font-medium text-white/90">{n.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
