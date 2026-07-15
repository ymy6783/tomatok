"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import NoticeForm, {
  type NoticeFormValues,
} from "@/components/admin/NoticeForm";
import { createBrowserSupabase } from "@/lib/supabaseBrowser";
import type { NoticeCategoryId } from "@/lib/noticeCategories";

type Row = {
  id: string;
  title: string;
  title_en: string | null;
  content: string;
  content_en: string | null;
  content_html: string | null;
  content_html_en: string | null;
  category: string;
  published_at: string;
};

export default function EditNoticePage({ noticeId }: { noticeId: string }) {
  const router = useRouter();
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [ready, setReady] = useState(false);
  const [initial, setInitial] = useState<Partial<NoticeFormValues> | null>(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    try {
      const client = createBrowserSupabase();
      setSupabase(client);
      client.auth.getSession().then(async ({ data }) => {
        if (!data.session) {
          router.replace("/admin/login");
          return;
        }
        const { data: row, error } = await client
          .from("notices")
          .select(
            "id, title, title_en, content, content_en, content_html, content_html_en, category, published_at"
          )
          .eq("id", noticeId)
          .maybeSingle();
        if (error || !row) {
          setMsg(error?.message || "공지를 찾을 수 없습니다.");
          return;
        }
        const r = row as Row;
        setInitial({
          titleKo: r.title,
          titleEn: r.title_en || "",
          htmlKo: r.content_html || "",
          textKo: r.content || "",
          htmlEn: r.content_html_en || "",
          textEn: r.content_en || "",
          category: r.category as NoticeCategoryId,
          publishedAt: r.published_at.slice(0, 10),
        });
        setReady(true);
      });
    } catch (err) {
      setMsg((err as Error).message);
    }
  }, [noticeId, router]);

  if (msg && !ready) {
    return <div className="px-5 py-20 text-center text-[var(--accent)]">{msg}</div>;
  }

  if (!ready || !supabase || !initial) {
    return (
      <div className="px-5 py-20 text-center text-[var(--muted)]">불러오는 중…</div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)]">
          공지 수정
        </h1>
        <button
          type="button"
          className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
          onClick={async () => {
            await supabase.auth.signOut();
            router.push("/admin/login");
          }}
        >
          로그아웃
        </button>
      </div>
      <NoticeForm
        supabase={supabase}
        mode="edit"
        noticeId={noticeId}
        initial={initial}
        onSuccess={(id) => router.push(`/notice/${id}`)}
        onCancel={() => router.push(`/notice/${noticeId}`)}
      />
    </div>
  );
}
