/**
 * Build supabase/seed-notices.sql from data/notices.json
 * (no network / service key needed — paste into SQL Editor)
 *
 *   node scripts/build-seed-sql.mjs
 *
 * Images become https://tomatok.io/notices/... (deploy public/notices first)
 */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://tomatok.io").replace(
  /\/$/,
  ""
);

function slugToUuid(slug) {
  const hash = createHash("md5").update(`tomatok-notice:${slug}`).digest("hex");
  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-5${hash.slice(13, 16)}-a${hash.slice(17, 20)}-${hash.slice(20, 32)}`;
}

function sqlStr(s) {
  return `'${String(s ?? "").replace(/'/g, "''")}'`;
}

function sqlTextArr(arr) {
  if (!arr?.length) return "'{}'::text[]";
  const inner = arr.map((u) => `"${String(u).replace(/"/g, '\\"')}"`).join(",");
  return `ARRAY[${arr.map((u) => sqlStr(u)).join(",")}]::text[]`;
}

function inferCategory(title) {
  if (/이사회|주주총회|의사록/.test(title)) return "shareholder";
  if (/긴급|필독|Important|URGENT|Mandatory|중요 공지/i.test(title))
    return "urgent";
  if (/게임|포인트|채팅|친구|룰렛|T2E|토마콩|기능|언스테이킹 기능/i.test(title))
    return "upgrade";
  return "general";
}

function splitBilingualHtml(html) {
  if (!html) return { ko: "", en: "" };
  const parts = html.split(/<hr\s*\/?>/i);
  if (parts.length < 2) return { ko: html, en: "" };
  return { ko: parts[0].trim(), en: parts.slice(1).join("<hr />").trim() };
}

function splitTitle(title) {
  const parts = title.split("|").map((s) => s.trim());
  if (parts.length > 1 && /[A-Za-z]/.test(parts[parts.length - 1])) {
    return {
      ko: parts.slice(0, -1).join(" | ").trim() || parts[0],
      en: parts[parts.length - 1],
    };
  }
  const m = title.match(/^(.*?)\s*\[Notice\]\s*(.+)$/i);
  if (m) return { ko: m[1].trim(), en: `[Notice] ${m[2].trim()}` };
  return { ko: title, en: null };
}

function stripHtml(html) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function absAsset(u) {
  if (!u) return u;
  if (u.startsWith("/notices/")) return `${SITE}${u}`;
  return u;
}

function rewrite(text) {
  if (!text) return text;
  return text.replaceAll("/notices/", `${SITE}/notices/`);
}

const notices = JSON.parse(
  readFileSync(join(ROOT, "data", "notices.json"), "utf8")
);

const lines = [];
lines.push(`-- Auto-generated from data/notices.json`);
lines.push(`-- Images: ${SITE}/notices/...`);
lines.push(`-- Run after schema.sql + add-i18n.sql + add-category.sql + add-slug.sql`);
lines.push(`truncate public.notices;`);
lines.push("");

for (const n of notices) {
  const titles = splitTitle(n.title || "");
  const { ko: htmlKoRaw, en: htmlEnRaw } = splitBilingualHtml(n.content_html || "");
  const htmlKo = rewrite(htmlKoRaw || n.content_html || "");
  const htmlEn = rewrite(htmlEnRaw || "");
  const contentKo = rewrite(n.content || stripHtml(htmlKo));
  const contentEn = rewrite(stripHtml(htmlEn));
  const images = (n.images || []).map(absAsset);
  const links = (n.links || []).map(absAsset);
  const category = n.category || inferCategory(n.title || "");
  const publishedAt = n.date ? `${n.date}T00:00:00+09:00` : new Date().toISOString();
  const id = slugToUuid(n.id);

  lines.push(`INSERT INTO notices (
  id, slug, title, title_en, full_title,
  content, content_en, content_html, content_html_en,
  category, links, images, published_at, is_published
) VALUES (
  ${sqlStr(id)},
  ${sqlStr(n.id)},
  ${sqlStr(titles.ko)},
  ${titles.en ? sqlStr(titles.en) : "NULL"},
  ${sqlStr(n.full_title || n.title)},
  ${sqlStr(contentKo)},
  ${sqlStr(contentEn)},
  ${sqlStr(htmlKo)},
  ${htmlEn ? sqlStr(htmlEn) : "NULL"},
  ${sqlStr(category)},
  ${sqlTextArr(links)},
  ${sqlTextArr(images)},
  ${sqlStr(publishedAt)},
  true
);`);
  lines.push("");
}

const out = join(ROOT, "supabase", "seed-notices.sql");
writeFileSync(out, lines.join("\n"), "utf8");
console.log(`Wrote ${out} (${notices.length} rows, asset base ${SITE})`);
