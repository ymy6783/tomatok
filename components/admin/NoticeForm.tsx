"use client";

import { FormEvent, useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import NoticeEditor from "@/components/admin/NoticeEditor";
import {
  NOTICE_CATEGORIES,
  type NoticeCategoryId,
} from "@/lib/noticeCategories";
import { collectMedia } from "@/lib/noticeAdmin";

type LangTab = "ko" | "en";

export type NoticeFormValues = {
  titleKo: string;
  titleEn: string;
  htmlKo: string;
  textKo: string;
  htmlEn: string;
  textEn: string;
  category: NoticeCategoryId;
  publishedAt: string;
};

const box =
  "w-full rounded-[10px] border border-[var(--line)] bg-white px-4 py-3 text-[var(--foreground)] outline-none focus:border-[var(--foreground)]";

type Props = {
  supabase: SupabaseClient;
  mode: "create" | "edit";
  noticeId?: string;
  initial?: Partial<NoticeFormValues>;
  onSuccess: (id: string) => void;
  onCancel?: () => void;
};

export default function NoticeForm({
  supabase,
  mode,
  noticeId,
  initial,
  onSuccess,
  onCancel,
}: Props) {
  const [lang, setLang] = useState<LangTab>("ko");
  const [titleKo, setTitleKo] = useState(initial?.titleKo ?? "");
  const [titleEn, setTitleEn] = useState(initial?.titleEn ?? "");
  const [htmlKo, setHtmlKo] = useState(initial?.htmlKo ?? "");
  const [textKo, setTextKo] = useState(initial?.textKo ?? "");
  const [htmlEn, setHtmlEn] = useState(initial?.htmlEn ?? "");
  const [textEn, setTextEn] = useState(initial?.textEn ?? "");
  const [category, setCategory] = useState<NoticeCategoryId>(
    initial?.category ?? "general"
  );
  const [publishedAt, setPublishedAt] = useState(
    initial?.publishedAt ?? new Date().toISOString().slice(0, 10)
  );
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!initial) return;
    setTitleKo(initial.titleKo ?? "");
    setTitleEn(initial.titleEn ?? "");
    setHtmlKo(initial.htmlKo ?? "");
    setTextKo(initial.textKo ?? "");
    setHtmlEn(initial.htmlEn ?? "");
    setTextEn(initial.textEn ?? "");
    setCategory(initial.category ?? "general");
    setPublishedAt(initial.publishedAt ?? new Date().toISOString().slice(0, 10));
  }, [initial]);

  async function uploadImage(file: File): Promise<string> {
    const ext = file.name.split(".").pop() || "png";
    const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from("notices").upload(path, file, {
      contentType: file.type,
      upsert: false,
    });
    if (error) throw error;
    const { data } = supabase.storage.from("notices").getPublicUrl(path);
    return data.publicUrl;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!titleKo.trim()) {
      setMsg("한국어 제목을 입력해 주세요.");
      setLang("ko");
      return;
    }
    if (!textKo.trim()) {
      setMsg("한국어 본문을 입력해 주세요.");
      setLang("ko");
      return;
    }
    setLoading(true);
    setMsg("");
    try {
      const title = titleKo.trim();
      const title_en = titleEn.trim() || null;
      const content = textKo.trim();
      const content_en = textEn.trim();
      const content_html = htmlKo;
      const content_html_en =
        textEn.trim() && htmlEn.trim() && htmlEn !== "<p></p>" ? htmlEn : null;
      const { links, images } = collectMedia(
        [content_html, content_html_en || ""].join("\n")
      );
      const payload = {
        title,
        title_en,
        full_title: title_en ? `${title} | ${title_en}` : title,
        content,
        content_en,
        content_html,
        content_html_en,
        category,
        links,
        images,
        published_at: `${publishedAt}T00:00:00+09:00`,
        is_published: true,
      };

      if (mode === "create") {
        const { data, error } = await supabase
          .from("notices")
          .insert(payload)
          .select("id")
          .single();
        if (error) throw error;
        onSuccess(data.id);
      } else {
        if (!noticeId) throw new Error("공지 ID가 없습니다.");
        const { error } = await supabase
          .from("notices")
          .update(payload)
          .eq("id", noticeId);
        if (error) throw error;
        onSuccess(noticeId);
      }
    } catch (err) {
      setMsg((err as Error).message || "저장 실패");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm text-[var(--muted)]">
            카테고리
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as NoticeCategoryId)}
            className={box}
          >
            {NOTICE_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-[var(--muted)]">
            게시일
          </label>
          <input
            type="date"
            required
            value={publishedAt}
            onChange={(e) => setPublishedAt(e.target.value)}
            className={box}
          />
        </div>
      </div>

      <div className="flex gap-2 rounded-[10px] bg-[var(--band)] p-1">
        <button
          type="button"
          onClick={() => setLang("ko")}
          className={`flex-1 rounded-[10px] py-2.5 text-sm font-medium transition ${
            lang === "ko"
              ? "bg-white text-[var(--foreground)] shadow-sm"
              : "text-[var(--muted)] hover:text-[var(--foreground)]"
          }`}
        >
          한국어
        </button>
        <button
          type="button"
          onClick={() => setLang("en")}
          className={`flex-1 rounded-[10px] py-2.5 text-sm font-medium transition ${
            lang === "en"
              ? "bg-white text-[var(--foreground)] shadow-sm"
              : "text-[var(--muted)] hover:text-[var(--foreground)]"
          }`}
        >
          English
        </button>
      </div>

      {lang === "ko" ? (
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm text-[var(--muted)]">
              제목 (한국어)
            </label>
            <input
              required
              value={titleKo}
              onChange={(e) => setTitleKo(e.target.value)}
              placeholder="한국어 제목"
              className={box}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-[var(--muted)]">
              본문 (한국어)
            </label>
            <NoticeEditor
              key={`editor-ko-${mode}-${noticeId ?? "new"}`}
              initialHtml={htmlKo}
              placeholder="한국어 본문을 작성하세요."
              uploadImage={uploadImage}
              onChange={(html, text) => {
                setHtmlKo(html);
                setTextKo(text);
              }}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm text-[var(--muted)]">
              Title (English)
            </label>
            <input
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              placeholder="English title (optional)"
              className={box}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-[var(--muted)]">
              Body (English)
            </label>
            <NoticeEditor
              key={`editor-en-${mode}-${noticeId ?? "new"}`}
              initialHtml={htmlEn}
              placeholder="Write the English version here (optional)."
              uploadImage={uploadImage}
              onChange={(html, text) => {
                setHtmlEn(html);
                setTextEn(text);
              }}
            />
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-[10px] bg-[var(--accent)] px-6 py-3 text-sm font-medium text-white disabled:opacity-60"
        >
          {loading ? "저장 중…" : mode === "create" ? "발행" : "저장"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-[10px] border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--hover)]"
          >
            취소
          </button>
        )}
      </div>
      {msg && <p className="text-sm text-[var(--accent)]">{msg}</p>}
    </form>
  );
}
