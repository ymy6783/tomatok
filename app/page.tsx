import Link from "next/link";
import { getNotices } from "@/lib/notices";

export const revalidate = 3600;

export default async function HomePage() {
  const notices = (await getNotices()).slice(0, 5);

  return (
    <div className="mx-auto max-w-5xl px-5">
      <section className="flex min-h-[70vh] flex-col justify-center py-20">
        <p className="mb-4 text-sm font-medium tracking-[0.2em] text-[var(--brand)] uppercase">
          TOTT Ecosystem
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-5xl leading-[1.05] font-extrabold tracking-tight text-white md:text-7xl">
          Toma<span className="text-[var(--accent)]">Tok</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-white/65">
          토마톡 공식 웹사이트. 공지사항과 화이트페이퍼를 여기서 확인하세요.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/notice"
            className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white hover:brightness-110"
          >
            공지사항
          </Link>
          <a
            href="https://github.com/Needspsersand/WHITEPAPER-KO"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/5"
          >
            화이트페이퍼
          </a>
        </div>
      </section>

      <section className="pb-24">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-white">
            Latest Notices
          </h2>
          <Link href="/notice" className="text-sm text-white/55 hover:text-white">
            전체보기
          </Link>
        </div>
        <ul className="divide-y divide-white/10 border-y border-white/10">
          {notices.map((n) => (
            <li key={n.id}>
              <Link
                href={`/notice/${n.id}`}
                className="flex flex-col gap-1 py-4 transition hover:bg-white/[0.03] sm:flex-row sm:items-baseline sm:gap-6"
              >
                <span className="shrink-0 text-sm text-white/40">{n.date ?? "—"}</span>
                <span className="text-white/90">{n.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
