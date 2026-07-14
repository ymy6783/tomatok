import noticesData from "@/data/notices.json";
import { getSupabase } from "@/lib/supabaseClient";
import type { NoticeCategoryId } from "@/lib/noticeCategories";
import type { Locale } from "@/lib/locale";

export type Notice = {
  id: string;
  date: string | null;
  title: string;
  title_en?: string | null;
  full_title: string;
  content: string;
  content_en?: string;
  content_html?: string;
  content_html_en?: string;
  category?: string | null;
  links: string[];
  images: string[];
};

type NoticeRow = {
  id: string;
  title: string;
  title_en?: string | null;
  full_title: string | null;
  content: string;
  content_en?: string | null;
  content_html: string | null;
  content_html_en?: string | null;
  category?: string | null;
  links: string[] | null;
  images: string[] | null;
  published_at: string;
  is_published: boolean;
};

const localNotices = noticesData as Notice[];

function inferCategory(title: string): NoticeCategoryId | null {
  const t = title;
  if (/이사회|주주총회|의사록/.test(t)) return "shareholder";
  if (/긴급|필독|Important|URGENT|Mandatory|중요 공지/i.test(t)) return "urgent";
  if (/게임|포인트|채팅|친구|룰렛|T2E|토마콩|기능|언스테이킹 기능/i.test(t))
    return "upgrade";
  return "general";
}

function splitBilingualHtml(html: string): { ko: string; en: string } {
  if (!html) return { ko: "", en: "" };
  const parts = html.split(/<hr\s*\/?>/i);
  if (parts.length < 2) {
    if (/notice-lang-break/i.test(html)) {
      const [ko, ...rest] = html.split(/<div[^>]*notice-lang-break[^>]*>[\s\S]*?<\/div>/i);
      return { ko: (ko || "").trim(), en: rest.join("").trim() };
    }
    return { ko: html, en: "" };
  }
  return { ko: parts[0].trim(), en: parts.slice(1).join("<hr />").trim() };
}

function rowToNotice(row: NoticeRow): Notice {
  const split = splitBilingualHtml(row.content_html || "");
  const hasSeparateEn = Boolean(row.content_html_en?.trim());
  return {
    id: row.id,
    date: row.published_at ? row.published_at.slice(0, 10) : null,
    title: row.title,
    title_en: row.title_en || null,
    full_title: row.full_title || row.title,
    content: row.content || "",
    content_en: row.content_en || "",
    content_html: hasSeparateEn
      ? row.content_html || ""
      : split.en
        ? split.ko
        : row.content_html || "",
    content_html_en: row.content_html_en || split.en || "",
    category: row.category || inferCategory(row.title),
    links: row.links || [],
    images: row.images || [],
  };
}

function normalizeLocal(n: Notice): Notice {
  const split = splitBilingualHtml(n.content_html || "");
  const titleParts = n.title.split("|").map((s) => s.trim());
  const titleEnGuess =
    n.title_en ||
    (titleParts.length > 1 && /[A-Za-z]/.test(titleParts[titleParts.length - 1])
      ? titleParts[titleParts.length - 1]
      : null);
  const titleKo =
    titleParts.length > 1 && titleEnGuess
      ? titleParts.slice(0, -1).join(" | ").replace(/\s*\|\s*$/, "").trim() ||
        titleParts[0]
      : n.title;

  return {
    ...n,
    title: titleKo,
    title_en: titleEnGuess,
    content_html: n.content_html_en ? n.content_html : split.ko || n.content_html,
    content_html_en: n.content_html_en || split.en || "",
  };
}

export function noticeHasLocale(n: Notice, locale: Locale): boolean {
  if (locale === "ko") return true;
  return Boolean(
    n.title_en?.trim() ||
      n.content_html_en?.trim() ||
      n.content_en?.trim()
  );
}

export function localizedTitle(n: Notice, locale: Locale): string {
  if (locale === "en" && n.title_en?.trim()) return n.title_en.trim();
  return n.title;
}

export function localizedBody(
  n: Notice,
  locale: Locale
): { html: string; text: string } {
  if (locale === "en") {
    return {
      html: n.content_html_en?.trim() || "",
      text: n.content_en?.trim() || "",
    };
  }
  return {
    html: n.content_html?.trim() || "",
    text: n.content?.trim() || "",
  };
}

/** Supabase 연동 시 DB 우선, 실패/미설정 시 로컬 JSON */
export async function getNotices(): Promise<Notice[]> {
  try {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from("notices")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false });
      if (!error && data) return (data as NoticeRow[]).map(rowToNotice);
    }
  } catch {
    // fall through to local
  }
  return [...localNotices].map(normalizeLocal).sort((a, b) =>
    (b.date || "").localeCompare(a.date || "")
  );
}

export async function getNoticeById(id: string): Promise<Notice | null> {
  try {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from("notices")
        .select("*")
        .eq("id", id)
        .eq("is_published", true)
        .maybeSingle();
      if (!error && data) return rowToNotice(data as NoticeRow);
    }
  } catch {
    // fall through
  }
  const found = localNotices.find((n) => n.id === id);
  return found ? normalizeLocal(found) : null;
}
