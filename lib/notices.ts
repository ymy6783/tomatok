import noticesData from "@/data/notices.json";

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

const localNotices = noticesData as Notice[];

/** 우선 로컬 JSON. 이후 Supabase posts 테이블 연동 가능 */
export async function getNotices(): Promise<Notice[]> {
  return [...localNotices].sort((a, b) =>
    (b.date || "").localeCompare(a.date || "")
  );
}

export async function getNoticeById(id: string): Promise<Notice | null> {
  return localNotices.find((n) => n.id === id) ?? null;
}
