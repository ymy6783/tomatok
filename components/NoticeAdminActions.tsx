"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createBrowserSupabase } from "@/lib/supabaseBrowser";
import { isSupabaseNoticeId } from "@/lib/noticeAdmin";
import { withLocale, type Locale } from "@/lib/locale";

const btn =
  "inline-flex h-11 items-center justify-center rounded-[var(--radius-pill)] px-5 text-[14px] font-medium transition";

export default function NoticeAdminActions({
  noticeId,
  locale,
}: {
  noticeId: string;
  locale: Locale;
}) {
  const router = useRouter();
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    try {
      const client = createBrowserSupabase();
      setSupabase(client);
      client.auth.getSession().then(({ data }) => {
        setIsAdmin(Boolean(data.session));
      });
    } catch {
      setIsAdmin(false);
    }
  }, []);

  const canManage = isAdmin && isSupabaseNoticeId(noticeId);

  async function handleDelete() {
    if (!supabase || !canManage) return;
    const ok = window.confirm(
      locale === "en"
        ? "Delete this notice permanently?"
        : "이 공지를 삭제할까요?"
    );
    if (!ok) return;
    setDeleting(true);
    try {
      const { error } = await supabase.from("notices").delete().eq("id", noticeId);
      if (error) throw error;
      router.push(withLocale("/notice", locale));
      router.refresh();
    } catch (err) {
      window.alert((err as Error).message || "삭제 실패");
      setDeleting(false);
    }
  }

  return (
    <div className="mt-16 flex flex-wrap gap-3 border-t border-[var(--line-soft)] pt-10">
      <Link
        href={withLocale("/notice", locale)}
        className={`${btn} bg-[var(--band)] text-[var(--foreground)] hover:bg-[var(--band-deep)]`}
      >
        {locale === "en" ? "Back to list" : "목록으로 가기"}
      </Link>
      {canManage && (
        <>
          <Link
            href={`/admin/notices/${noticeId}/edit`}
            className={`${btn} bg-[var(--band)] text-[var(--foreground)] hover:bg-[var(--band-deep)]`}
          >
            {locale === "en" ? "Edit" : "수정하기"}
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className={`${btn} bg-[var(--accent)] text-white hover:brightness-110 disabled:opacity-60`}
          >
            {deleting
              ? locale === "en"
                ? "Deleting…"
                : "삭제 중…"
              : locale === "en"
                ? "Delete"
                : "삭제"}
          </button>
        </>
      )}
    </div>
  );
}
