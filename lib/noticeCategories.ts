import type { Locale } from "@/lib/locale";

export const NOTICE_CATEGORIES = [
  {
    id: "general",
    label: "일반공지",
    labelEn: "General",
    description: "스테이킹, 약관, 감사, 소각 등 일반 안내",
  },
  {
    id: "upgrade",
    label: "업그레이드",
    labelEn: "Upgrade",
    description: "앱·기능 업데이트, 신규 서비스",
  },
  {
    id: "shareholder",
    label: "주주",
    labelEn: "Shareholder",
    description: "이사회, 주주총회, 의사록",
  },
  {
    id: "urgent",
    label: "긴급",
    labelEn: "Urgent",
    description: "필독·긴급·운영 이슈",
  },
] as const;

export type NoticeCategoryId = (typeof NOTICE_CATEGORIES)[number]["id"];

export function categoryLabel(
  id: string | null | undefined,
  locale: Locale = "ko"
): string {
  const cat = NOTICE_CATEGORIES.find((c) => c.id === id);
  if (!cat) return locale === "en" ? "General" : "일반공지";
  return locale === "en" ? cat.labelEn : cat.label;
}
