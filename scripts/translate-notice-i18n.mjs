/**
 * Fill empty EN fields for Korean-only notices using scripts/notice-en-translations.json
 *
 * Usage:
 *   npm run notices:translate-en              # dry-run
 *   npm run notices:translate-en:apply        # write
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

const translations = JSON.parse(
  readFileSync(join(ROOT, "scripts/notice-en-translations.json"), "utf8")
);

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Plain text → simple HTML paragraphs */
function plainToHtml(plain) {
  const blocks = String(plain || "")
    .trim()
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);
  return blocks
    .map((block) => {
      const inner = escapeHtml(block).replace(/\n/g, "<br />\n");
      return `<p>${inner}</p>`;
    })
    .join("\n");
}

async function main() {
  const ids = Object.keys(translations);
  console.log(`${APPLY ? "APPLY" : "DRY-RUN"} — ${ids.length} notices\n`);

  const { data, error } = await supabase
    .from("notices")
    .select(
      "id, title, title_en, content, content_en, content_html, content_html_en"
    )
    .in("id", ids);

  if (error) throw new Error(error.message);

  const byId = new Map((data || []).map((r) => [r.id, r]));
  let updated = 0;
  let skipped = 0;

  for (const id of ids) {
    const tr = translations[id];
    const row = byId.get(id);
    if (!row) {
      console.log(`✗ missing in DB: ${id}`);
      continue;
    }

    const hasEn = Boolean(
      row.title_en?.trim() ||
        row.content_en?.trim() ||
        row.content_html_en?.trim()
    );

    // Allow burn unpack even if somehow partially filled; skip only if ALL EN set and no fix_ko
    if (hasEn && !tr.fix_ko) {
      console.log(`· skip (EN already set): ${row.title}`);
      skipped++;
      continue;
    }

    const title_en = tr.title_en;
    const content_en = tr.content_en;
    const content_html_en = tr.html_en || plainToHtml(content_en);

    const patch = {
      title_en,
      content_en,
      content_html_en,
    };

    if (tr.fix_ko) {
      patch.title = tr.fix_ko.title;
      patch.content = tr.fix_ko.content;
      patch.content_html = tr.fix_ko.content_html;
    }

    console.log(
      `${APPLY ? "✓" : "→"} ${row.title}\n   EN title: ${title_en}\n   content_en: ${content_en.length}c  html_en: ${content_html_en.length}c${tr.fix_ko ? "  (+fix KO unpack)" : ""}`
    );

    if (APPLY) {
      const { error: upErr } = await supabase
        .from("notices")
        .update(patch)
        .eq("id", id);
      if (upErr) throw new Error(`${id}: ${upErr.message}`);
    }
    updated++;
  }

  console.log(
    `\n${APPLY ? "Updated" : "Would update"}: ${updated}, skipped: ${skipped}`
  );
  if (!APPLY) {
    console.log("Re-run with --apply to write.");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
