import noticesData from "@/data/notices.json";
import { getSupabase } from "@/lib/supabaseClient";

export type Notice = {
  id: string;
  date: string | null;
  title: string;
  full_title: string;
  content: string;
  content_html?: string;
  links: string[];
  images: string[];
};

type NoticeRow = {
  id: string;
  title: string;
  full_title: string | null;
  content: string;
  content_html: string | null;
  links: string[] | null;
  images: string[] | null;
  published_at: string;
  is_published: boolean;
};

const localNotices = noticesData as Notice[];

function rowToNotice(row: NoticeRow): Notice {
  return {
    id: row.id,
    date: row.published_at ? row.published_at.slice(0, 10) : null,
    title: row.title,
    full_title: row.full_title || row.title,
    content: row.content || "",
    content_html: row.content_html || "",
    links: row.links || [],
    images: row.images || [],
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
  return [...localNotices].sort((a, b) =>
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
  return localNotices.find((n) => n.id === id) ?? null;
}
