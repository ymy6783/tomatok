import { createHash } from "node:crypto";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { basename, join, extname } from "node:path";
import { createClient } from "@supabase/supabase-js";

/**
 * Import WordPress-exported notices from data/notices.json into Supabase.
 *
 * Requires in .env.local (or env):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY   (Settings → API → service_role)
 *
 * Optional:
 *   NEXT_PUBLIC_SITE_URL=https://tomatok.io
 *   IMPORT_ASSET_MODE=storage|site   (default: storage)
 *     storage → upload public/notices/* to Storage bucket `notices`
 *     site    → rewrite to ${SITE_URL}/notices/...
 *
 * Usage:
 *   node --env-file=.env.local scripts/import-notices.mjs
 */

const ROOT = new URL("..", import.meta.url).pathname;
const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://tomatok.io"
).replace(/\/$/, "");
const ASSET_MODE = process.env.IMPORT_ASSET_MODE || "storage";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.\n" +
      "Add the service_role key to .env.local (never commit it), then re-run."
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

function slugToUuid(slug) {
  const hash = createHash("md5").update(`tomatok-notice:${slug}`).digest("hex");
  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-5${hash.slice(13, 16)}-a${hash.slice(17, 20)}-${hash.slice(20, 32)}`;
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
  if (parts.length < 2) {
    if (/notice-lang-break/i.test(html)) {
      const [ko, ...rest] = html.split(
        /<div[^>]*notice-lang-break[^>]*>[\s\S]*?<\/div>/i
      );
      return { ko: (ko || "").trim(), en: rest.join("").trim() };
    }
    return { ko: html, en: "" };
  }
  return { ko: parts[0].trim(), en: parts.slice(1).join("<hr />").trim() };
}

function splitTitle(title) {
  const parts = title.split("|").map((s) => s.trim());
  if (parts.length > 1 && /[A-Za-z]/.test(parts[parts.length - 1])) {
    return {
      ko: parts.slice(0, -1).join(" | ").replace(/\s*\|\s*$/, "").trim() || parts[0],
      en: parts[parts.length - 1],
    };
  }
  // "한글 [Notice] English" pattern
  const m = title.match(/^(.*?)\s*\[Notice\]\s*(.+)$/i);
  if (m) return { ko: m[1].trim(), en: `[Notice] ${m[2].trim()}` };
  return { ko: title, en: null };
}

function stripHtml(html) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function contentTypeFor(path) {
  const e = extname(path).toLowerCase();
  if (e === ".png") return "image/png";
  if (e === ".jpg" || e === ".jpeg") return "image/jpeg";
  if (e === ".gif") return "image/gif";
  if (e === ".webp") return "image/webp";
  if (e === ".pdf") return "application/pdf";
  if (e === ".svg") return "image/svg+xml";
  return "application/octet-stream";
}

/** Storage object keys must be ASCII-safe */
function safeObjectName(file) {
  const ext = extname(file);
  const base = basename(file, ext);
  const ascii = base
    .normalize("NFKD")
    .replace(/[^\w.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  const hash = createHash("md5").update(file).digest("hex").slice(0, 8);
  return `${ascii || "file"}-${hash}${ext.toLowerCase()}`;
}

function rewriteAssetUrls(text, map) {
  if (!text) return text;
  let out = text;
  // Longer keys first so partial overlaps don’t break
  const keys = Object.keys(map).sort((a, b) => b.length - a.length);
  for (const from of keys) {
    out = out.split(from).join(map[from]);
  }
  return out;
}

async function ensureBucket() {
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = (buckets || []).some((b) => b.id === "notices");
  if (!exists) {
    const { error } = await supabase.storage.createBucket("notices", {
      public: true,
    });
    if (error) throw new Error(`createBucket: ${error.message}`);
    console.log("Created storage bucket: notices");
  }
}

async function uploadAssets() {
  const dir = join(ROOT, "public", "notices");
  if (!existsSync(dir)) throw new Error(`Missing ${dir}`);
  await ensureBucket();

  const map = {};
  const files = readdirSync(dir).filter((f) => !f.startsWith("."));
  for (const file of files) {
    const localPath = join(dir, file);
    const buf = readFileSync(localPath);
    const objectPath = `legacy/${safeObjectName(file)}`;
    const { error } = await supabase.storage
      .from("notices")
      .upload(objectPath, buf, {
        contentType: contentTypeFor(file),
        upsert: true,
      });
    if (error) throw new Error(`upload ${file}: ${error.message}`);
    const { data } = supabase.storage.from("notices").getPublicUrl(objectPath);
    const publicUrl = data.publicUrl;
    map[`/notices/${file}`] = publicUrl;
    map[`/notices/${encodeURIComponent(file)}`] = publicUrl;
    console.log(`↑ ${file} → ${objectPath}`);
  }
  return map;
}

function siteAssetMap() {
  const dir = join(ROOT, "public", "notices");
  const map = {};
  for (const file of readdirSync(dir).filter((f) => !f.startsWith("."))) {
    const abs = `${SITE_URL}/notices/${encodeURIComponent(file).replace(/%2F/g, "/")}`;
    // Keep readable Korean filenames unencoded where possible
    const plain = `${SITE_URL}/notices/${file}`;
    map[`/notices/${file}`] = plain;
  }
  return map;
}

async function getNoticeColumns() {
  const res = await fetch(`${url}/rest/v1/`, {
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
    },
  });
  const json = await res.json();
  const props =
    json?.definitions?.notices?.properties ||
    json?.components?.schemas?.notices?.properties ||
    {};
  return new Set(Object.keys(props));
}

function pickColumns(row, columns) {
  const out = {};
  for (const [k, v] of Object.entries(row)) {
    if (columns.has(k)) out[k] = v;
  }
  return out;
}

async function main() {
  const notices = JSON.parse(
    readFileSync(join(ROOT, "data", "notices.json"), "utf8")
  );
  console.log(`Loaded ${notices.length} notices from JSON`);

  const columns = await getNoticeColumns();
  console.log(`Table columns: ${[...columns].sort().join(", ") || "(unknown)"}`);

  const hasI18n = columns.has("title_en") || columns.has("content_html_en");
  const hasCategory = columns.has("category");
  if (!hasI18n) {
    console.warn(
      "⚠ i18n columns missing — run supabase/add-i18n.sql then re-import for KO/EN fields.\n" +
        "  For now bilingual HTML is stored with <hr /> so the site can still split languages."
    );
  }
  if (!hasCategory) {
    console.warn(
      "⚠ category column missing — run supabase/add-category.sql then re-import."
    );
  }

  const assetMap =
    ASSET_MODE === "site" ? siteAssetMap() : await uploadAssets();
  console.log(`Asset mode: ${ASSET_MODE} (${Object.keys(assetMap).length} paths)`);

  const rows = notices.map((n) => {
    const titles = splitTitle(n.title || "");
    const htmlSplit = splitBilingualHtml(n.content_html || "");
    let htmlKo = rewriteAssetUrls(htmlSplit.ko || n.content_html || "", assetMap);
    let htmlEn = rewriteAssetUrls(htmlSplit.en || "", assetMap);
    let contentKo = rewriteAssetUrls(n.content || stripHtml(htmlKo), assetMap);
    let contentEn = rewriteAssetUrls(stripHtml(htmlEn), assetMap);

    const images = (n.images || []).map((u) => assetMap[u] || u);
    const links = (n.links || []).map((u) => assetMap[u] || u);

    const category = n.category || inferCategory(n.title || "");
    const publishedAt = n.date
      ? `${n.date}T00:00:00+09:00`
      : new Date().toISOString();

    /** @type {Record<string, unknown>} */
    const row = {
      id: slugToUuid(n.id),
      full_title: n.full_title || n.title,
      links,
      images,
      published_at: publishedAt,
      is_published: true,
    };

    if (hasI18n) {
      row.title = titles.ko;
      row.title_en = titles.en;
      row.content = contentKo;
      row.content_en = contentEn;
      row.content_html = htmlKo;
      row.content_html_en = htmlEn || null;
    } else {
      // Merge into legacy single fields
      row.title = titles.en ? `${titles.ko} | ${titles.en}` : titles.ko;
      row.content = contentEn
        ? `${contentKo}\n\n---\n\n${contentEn}`
        : contentKo;
      row.content_html = htmlEn
        ? `${htmlKo}\n<hr />\n${htmlEn}`
        : htmlKo;
    }

    if (hasCategory) row.category = category;
    if (columns.has("slug") || process.env.IMPORT_WITH_SLUG === "1") {
      row.slug = n.id;
    }

    return pickColumns(row, columns.size ? columns : new Set(Object.keys(row)));
  });

  // Upsert in chunks
  const chunk = 10;
  for (let i = 0; i < rows.length; i += chunk) {
    const slice = rows.slice(i, i + chunk);
    const { error } = await supabase.from("notices").upsert(slice, {
      onConflict: "id",
    });
    if (error) throw error;
    console.log(`Saved ${Math.min(i + chunk, rows.length)}/${rows.length}`);
  }

  const { count } = await supabase
    .from("notices")
    .select("*", { count: "exact", head: true });
  console.log(`Done. notices table count ≈ ${count}`);
  console.log(
    "Images are on Supabase Storage. Edit via /admin after login.\n" +
      "Old URLs like /notice/20260626-00 still work via deterministic UUID mapping."
  );
  if (!hasI18n || !hasCategory) {
    console.log(
      "\nNext: In Supabase SQL Editor run add-i18n.sql + add-category.sql, then:\n" +
        "  npm run seed:import"
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
