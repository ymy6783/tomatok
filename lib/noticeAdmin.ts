import { createHash } from "crypto";

export function collectMedia(html: string): { links: string[]; images: string[] } {
  const links = new Set<string>();
  const images = new Set<string>();
  const hrefRe = /href=["']([^"']+)["']/gi;
  const srcRe = /src=["']([^"']+)["']/gi;
  let m: RegExpExecArray | null;
  while ((m = hrefRe.exec(html))) {
    if (m[1] && !m[1].startsWith("#")) links.add(m[1]);
  }
  while ((m = srcRe.exec(html))) {
    if (m[1]) images.add(m[1]);
  }
  return { links: [...links], images: [...images] };
}

export function isSupabaseNoticeId(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    id
  );
}

/** Deterministic UUID used by scripts/import-notices.mjs for WP slug ids */
export function noticeSlugToUuid(slug: string): string {
  const hash = createHash("md5")
    .update(`tomatok-notice:${slug}`)
    .digest("hex");
  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-5${hash.slice(13, 16)}-a${hash.slice(17, 20)}-${hash.slice(20, 32)}`;
}
