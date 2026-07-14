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
