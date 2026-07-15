/**
 * Split packed bilingual notices in Supabase into KO / EN columns.
 *
 * Prerequisites — run once in Supabase SQL Editor:
 *   supabase/add-i18n.sql
 *
 * Detects:
 *   - title: "한국어 | English" or "한글 [Notice] English"
 *   - content_html: KO + <hr /> + EN  (or notice-lang-break)
 *   - content: KO + "\\n---\\n" + EN
 *
 * Only fills empty EN fields / unpacks markers. Does not wipe existing EN.
 *
 * Usage:
 *   npm run notices:split-i18n              # dry-run
 *   npm run notices:split-i18n:apply        # write
 */

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const APPLY = process.argv.includes("--apply");
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.\n" +
      "Add the service_role key to .env.local, then re-run."
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function getColumns() {
  const { data, error } = await supabase.from("notices").select("*").limit(1);
  if (error) throw new Error(error.message);
  return new Set(Object.keys(data?.[0] || {}));
}

function stripHtml(html) {
  return (html || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function looksEnglish(s) {
  if (!s) return false;
  const latin = (s.match(/[A-Za-z]/g) || []).length;
  const hangul = (s.match(/[\uAC00-\uD7A3]/g) || []).length;
  return latin >= 3 && latin > hangul;
}

/** "KO | EN" or "date | KO | EN" — last Latin segment is EN */
function splitTitle(title) {
  if (!title) return { ko: "", en: null };
  const parts = title.split("|").map((s) => s.trim()).filter(Boolean);
  if (parts.length > 1 && looksEnglish(parts[parts.length - 1])) {
    const en = parts[parts.length - 1];
    let koParts = parts.slice(0, -1);
    if (
      koParts.length > 1 &&
      /^\d{4}[./-]\d{1,2}[./-]\d{1,2}$/.test(koParts[0])
    ) {
      koParts = koParts.slice(1);
    }
    return {
      ko: koParts.join(" | ").trim() || parts[0],
      en,
    };
  }
  const m = title.match(/^(.*?)\s*\[Notice\]\s*(.+)$/i);
  if (m) return { ko: m[1].trim(), en: `[Notice] ${m[2].trim()}` };
  return { ko: title, en: null };
}

function splitBilingualHtml(html) {
  if (!html) return { ko: "", en: "" };
  const parts = html.split(/<hr\s*\/?>/i);
  if (parts.length >= 2) {
    return { ko: parts[0].trim(), en: parts.slice(1).join("<hr />").trim() };
  }
  if (/notice-lang-break/i.test(html)) {
    const [ko, ...rest] = html.split(
      /<div[^>]*notice-lang-break[^>]*>[\s\S]*?<\/div>/i
    );
    return { ko: (ko || "").trim(), en: rest.join("").trim() };
  }
  return { ko: html, en: "" };
}

function splitPlainContent(text) {
  if (!text) return { ko: "", en: "" };
  const parts = text.split(/\n\s*---\s*\n/);
  if (parts.length >= 2) {
    return { ko: parts[0].trim(), en: parts.slice(1).join("\n\n").trim() };
  }
  return { ko: text, en: "" };
}

function needsTitleSplit(row) {
  if (row.title_en?.trim()) return false;
  return Boolean(splitTitle(row.title || "").en);
}

function needsHtmlSplit(row) {
  if (row.content_html_en?.trim()) return false;
  const html = row.content_html || "";
  if (!html) return false;
  return /<hr\s*\/?>/i.test(html) || /notice-lang-break/i.test(html);
}

function needsContentSplit(row) {
  if (row.content_en?.trim()) return false;
  return /\n\s*---\s*\n/.test(row.content || "");
}

function buildUpdate(row) {
  /** @type {Record<string, unknown>} */
  const patch = {};
  const reasons = [];

  if (needsTitleSplit(row)) {
    const { ko, en } = splitTitle(row.title || "");
    if (en) {
      if (ko && ko !== row.title) patch.title = ko;
      patch.title_en = en;
      reasons.push(patch.title ? "title" : "title_en");
    }
  }

  if (needsHtmlSplit(row)) {
    const { ko, en } = splitBilingualHtml(row.content_html || "");
    if (en) {
      patch.content_html = ko;
      patch.content_html_en = en;
      reasons.push("html");
      if (!row.content_en?.trim()) {
        const plainEn = stripHtml(en);
        if (plainEn) patch.content_en = plainEn;
      }
      if (/\n\s*---\s*\n/.test(row.content || "") || !row.content?.trim()) {
        const plainKo = stripHtml(ko);
        if (plainKo) patch.content = plainKo;
      }
    }
  }

  if (needsContentSplit(row) && !patch.content_en) {
    const { ko, en } = splitPlainContent(row.content || "");
    if (en) {
      patch.content = ko;
      patch.content_en = en;
      reasons.push("content");
    }
  }

  if (patch.title_en || (row.title_en && patch.title)) {
    const ko = /** @type {string} */ (patch.title || row.title);
    const en = /** @type {string} */ (patch.title_en || row.title_en);
    if (ko && en) {
      const datePrefix =
        row.published_at && /^\d{4}-\d{2}-\d{2}/.test(row.published_at)
          ? row.published_at.slice(0, 10).replace(/-/g, ".")
          : null;
      patch.full_title = datePrefix
        ? `${datePrefix} | ${ko} | ${en}`
        : `${ko} | ${en}`;
    }
  }

  return { patch, reasons };
}

function preview(s, n = 72) {
  const t = (s || "").replace(/\s+/g, " ").trim();
  return t.length <= n ? t : `${t.slice(0, n)}…`;
}

function printI18nSqlHelp() {
  const sqlPath = join(ROOT, "supabase", "add-i18n.sql");
  let sql = "";
  try {
    sql = readFileSync(sqlPath, "utf8").trim();
  } catch {
    sql = `-- Add English fields for bilingual notices
alter table public.notices add column if not exists title_en text;
alter table public.notices add column if not exists content_en text not null default '';
alter table public.notices add column if not exists content_html_en text;`;
  }
  console.error("❌ i18n columns missing on public.notices (title_en / content_en / content_html_en).\n");
  console.error("1) Open Supabase → SQL Editor");
  console.error("2) Run this SQL (also in supabase/add-i18n.sql):\n");
  console.error(sql);
  console.error("\n3) Re-run: npm run notices:split-i18n");
}

async function main() {
  const columns = await getColumns();
  const hasI18n =
    columns.has("title_en") &&
    columns.has("content_en") &&
    columns.has("content_html_en");

  if (!hasI18n) {
    // Still show how many would need splitting from packed fields
    const { data } = await supabase
      .from("notices")
      .select("id, title, content, content_html, published_at")
      .order("published_at", { ascending: false });
    const rows = data || [];
    let titleN = 0;
    let htmlN = 0;
    let contentN = 0;
    for (const row of rows) {
      if (splitTitle(row.title || "").en) titleN += 1;
      if (
        /<hr\s*\/?>/i.test(row.content_html || "") ||
        /notice-lang-break/i.test(row.content_html || "")
      ) {
        htmlN += 1;
      }
      if (/\n\s*---\s*\n/.test(row.content || "")) contentN += 1;
    }
    console.log(`Current DB has ${rows.length} notices (no i18n columns yet).`);
    console.log(`Would split — titles: ${titleN}, html <hr>: ${htmlN}, plain ---: ${contentN}\n`);
    printI18nSqlHelp();
    process.exit(1);
  }

  console.log(
    APPLY
      ? "Mode: APPLY (will write to Supabase)\n"
      : "Mode: DRY-RUN (preview only — pass --apply to write)\n"
  );

  const { data, error } = await supabase
    .from("notices")
    .select(
      "id, title, title_en, full_title, content, content_en, content_html, content_html_en, published_at"
    )
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Failed to load notices:", error.message);
    process.exit(1);
  }

  const rows = data || [];
  console.log(`Loaded ${rows.length} notices from Supabase\n`);

  let planned = 0;
  let updated = 0;
  let failed = 0;

  for (const row of rows) {
    const { patch, reasons } = buildUpdate(row);
    if (!reasons.length) continue;
    planned += 1;

    console.log(`── ${row.id}`);
    console.log(`   reasons: ${reasons.join(", ")}`);
    if (patch.title) {
      console.log(`   title:    ${preview(row.title)}`);
      console.log(`         →   ${preview(/** @type {string} */ (patch.title))}`);
    }
    if (patch.title_en) {
      console.log(`   title_en: ${preview(/** @type {string} */ (patch.title_en))}`);
    }
    if (patch.content_html) {
      console.log(
        `   html:     ko ${stripHtml(/** @type {string} */ (patch.content_html)).length}c / en ${stripHtml(/** @type {string} */ (patch.content_html_en || "")).length}c`
      );
    }
    if (patch.content && !patch.content_html) {
      console.log(
        `   content:  ko ${String(patch.content).length}c / en ${String(patch.content_en || "").length}c`
      );
    }

    if (!APPLY) continue;

    const { error: upErr } = await supabase
      .from("notices")
      .update(patch)
      .eq("id", row.id);

    if (upErr) {
      failed += 1;
      console.log(`   ✗ update failed: ${upErr.message}`);
    } else {
      updated += 1;
      console.log(`   ✓ updated`);
    }
  }

  console.log("\n── Summary ─────────────────");
  console.log(`Need split: ${planned}`);
  if (APPLY) {
    console.log(`Updated:    ${updated}`);
    console.log(`Failed:     ${failed}`);
  } else {
    console.log(`(dry-run) Re-run with --apply to write these changes.`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
