"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createBrowserSupabase } from "@/lib/supabaseBrowser";

export default function NewNoticePage() {
  const router = useRouter();
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [ready, setReady] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [publishedAt, setPublishedAt] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const client = createBrowserSupabase();
      setSupabase(client);
      client.auth.getSession().then(({ data }) => {
        if (!data.session) router.replace("/admin/login");
        else setReady(true);
      });
    } catch (err) {
      setMsg((err as Error).message);
    }
  }, [router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setLoading(true);
    setMsg("");
    try {
      const { data, error } = await supabase
        .from("notices")
        .insert({
          title,
          full_title: title,
          content,
          published_at: `${publishedAt}T00:00:00+09:00`,
          is_published: true,
        })
        .select("id")
        .single();
      if (error) throw error;
      router.push(`/notice/${data.id}`);
    } catch (err) {
      setMsg((err as Error).message || "저장 실패");
    } finally {
      setLoading(false);
    }
  }

  if (msg && !ready) {
    return <div className="px-5 py-20 text-center text-red-400">{msg}</div>;
  }

  if (!ready) {
    return <div className="px-5 py-20 text-center text-white/50">확인 중…</div>;
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-16">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-white">
          공지 작성
        </h1>
        <button
          type="button"
          className="text-sm text-white/50 hover:text-white"
          onClick={async () => {
            await supabase?.auth.signOut();
            router.push("/admin/login");
          }}
        >
          로그아웃
        </button>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목"
          className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none focus:border-[var(--brand)]"
        />
        <input
          type="date"
          required
          value={publishedAt}
          onChange={(e) => setPublishedAt(e.target.value)}
          className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none focus:border-[var(--brand)]"
        />
        <textarea
          required
          rows={12}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="본문"
          className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none focus:border-[var(--brand)]"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? "저장 중…" : "발행"}
        </button>
      </form>
      {msg && <p className="mt-4 text-sm text-red-400">{msg}</p>}
    </div>
  );
}
