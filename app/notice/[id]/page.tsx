import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNoticeById, getNotices } from "@/lib/notices";

export const revalidate = 3600;

export async function generateStaticParams() {
  const notices = await getNotices();
  return notices.map((n) => ({ id: n.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const notice = await getNoticeById(id);
  if (!notice) return { title: "Notice" };
  return {
    title: notice.title,
    description: notice.content.slice(0, 140) || notice.title,
  };
}

export default async function NoticeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const notice = await getNoticeById(id);
  if (!notice) notFound();

  return (
    <article className="mx-auto max-w-3xl px-5 py-16">
      <Link href="/notice" className="text-sm text-white/50 hover:text-white">
        ← 목록
      </Link>
      <p className="mt-8 text-sm text-white/40">{notice.date ?? ""}</p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold leading-snug text-white md:text-4xl">
        {notice.title}
      </h1>

      {notice.links.length > 0 && (
        <ul className="mt-6 space-y-1 text-sm">
          {notice.links.map((href) => (
            <li key={href}>
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="text-[var(--brand)] hover:underline"
              >
                {href}
              </a>
            </li>
          ))}
        </ul>
      )}

      {notice.images.length > 0 && (
        <div className="mt-8 space-y-4">
          {notice.images.map((src) => {
            const isImage = /\.(png|jpe?g|gif|webp|svg)(\?|$)/i.test(src);
            if (!isImage) {
              return (
                <a
                  key={src}
                  href={src}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-xl border border-white/10 px-4 py-3 text-[var(--brand)] hover:bg-white/5"
                >
                  첨부 파일 열기
                </a>
              );
            }
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={src}
                alt=""
                className="w-full rounded-xl border border-white/10"
              />
            );
          })}
        </div>
      )}

      <div className="mt-10 whitespace-pre-wrap text-base leading-relaxed text-white/75">
        {notice.content || "본문이 첨부 파일/이미지로만 제공된 공지입니다."}
      </div>
    </article>
  );
}
