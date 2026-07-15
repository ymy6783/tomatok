"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabaseBrowser";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const supabase = createBrowserSupabase();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.push("/admin/notices/new");
    } catch (err) {
      setMsg((err as Error).message || "로그인 실패");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-16">
      <h1 className="text-3xl font-bold text-[var(--foreground)]">
        Admin
      </h1>
      <p className="mt-2 text-sm text-[var(--muted)]">공지 작성용 로그인</p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <input
          type="email"
          required
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-[10px] border border-[var(--line)] bg-white px-4 py-3 text-[var(--foreground)] outline-none focus:border-[var(--foreground)]"
        />
        <input
          type="password"
          required
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-[10px] border border-[var(--line)] bg-white px-4 py-3 text-[var(--foreground)] outline-none focus:border-[var(--foreground)]"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-[10px] bg-[var(--accent)] py-3 text-sm font-medium text-white disabled:opacity-60"
        >
          {loading ? "…" : "로그인"}
        </button>
      </form>
      {msg && <p className="mt-4 text-sm text-[var(--accent)]">{msg}</p>}
    </div>
  );
}
