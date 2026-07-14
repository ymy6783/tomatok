"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import NoticeForm from "@/components/admin/NoticeForm";
import { createBrowserSupabase } from "@/lib/supabaseBrowser";

export default function NewNoticePage() {
  const router = useRouter();
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [ready, setReady] = useState(false);
  const [msg, setMsg] = useState("");

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

  if (msg && !ready) {
    return (
      <div className="px-5 py-20 text-center text-[var(--accent)]">{msg}</div>
    );
  }

  if (!ready || !supabase) {
    return (
      <div className="px-5 py-20 text-center text-[var(--muted)]">확인 중…</div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)]">
          공지 작성
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
        mode="create"
        onSuccess={(id) => router.push(`/notice/${id}`)}
      />
    </div>
  );
}
