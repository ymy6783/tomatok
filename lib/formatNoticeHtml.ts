/** Clean legacy WordPress HTML into readable article markup. */

function unwrapSpans(html: string): string {
  return html
    .replace(/<\/?span\b[^>]*>/gi, "")
    .replace(/\s+style=("|\')[^"']*\1/gi, "")
    .replace(/\s+class=("|\')(p\d+|s\d+|wp-image-\d+|alignnone|size-\w+|aligncenter)[^"']*\1/gi, "");
}

function promoteSectionTitles(html: string): string {
  // ■ Title  / ※※ Title ※※  pattern paragraphs → h2
  return html.replace(
    /<p>\s*(?:■\s*)?([^<]{2,80}?)\s*<\/p>/gi,
    (full, inner: string) => {
      const text = inner.replace(/&nbsp;/g, " ").trim();
      if (
        /^[■※*]/.test(text) ||
        /^(주요|안내|중요|긴급|일정|변경|목적|대상|유의사항|Service|Key|Important|Notice|Schedule|Update)/i.test(
          text
        ) ||
        (/^\d+\.\s/.test(text) && text.length < 60)
      ) {
        const clean = text.replace(/^[■※*\s]+|[※*\s]+$/g, "").trim();
        return `<h2>${clean}</h2>`;
      }
      return full;
    }
  );
}

function markLanguageBreak(html: string): string {
  // First <hr> between KO / EN → labeled divider
  let seen = false;
  return html.replace(/<hr\s*\/?>/gi, () => {
    if (seen) return '<hr class="notice-divider" />';
    seen = true;
    return `<div class="notice-lang-break" role="separator"><span>English</span></div>`;
  });
}

function tidyWhitespace(html: string): string {
  return html
    .replace(/<p>\s*<\/p>/gi, "")
    .replace(/(?:<br\s*\/?>\s*){3,}/gi, "<br /><br />")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function formatNoticeHtml(raw: string): string {
  if (!raw?.trim()) return "";
  let html = unwrapSpans(raw);
  html = html.replace(/<(b|strong)>(.*?)<\/\1>/gi, "<strong>$2</strong>");
  // Flatten decorative h4/h1 from WP into consistent section headings
  html = html.replace(/<h4\b[^>]*>([\s\S]*?)<\/h4>/gi, "<h2>$1</h2>");
  html = html.replace(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi, "<h2>$1</h2>");
  html = promoteSectionTitles(html);
  html = markLanguageBreak(html);
  html = tidyWhitespace(html);
  return html;
}

/** Turn plain-text notices into simple structured HTML. */
export function formatNoticeText(raw: string): string {
  if (!raw?.trim()) return "";

  const blocks = raw
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);

  const parts: string[] = [];
  let langBreakDone = false;

  for (const block of blocks) {
    // Detect start of English block
    if (
      !langBreakDone &&
      /^(Hello|Dear|We |This |Important|Notice|Service|Urgent|TOTT |TomaTok )/i.test(
        block
      ) &&
      parts.length > 2
    ) {
      parts.push(
        `<div class="notice-lang-break" role="separator"><span>English</span></div>`
      );
      langBreakDone = true;
    }

    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
    const first = lines[0] ?? "";

    if (
      lines.length === 1 &&
      (first.length < 48 ||
        /^[■※]/.test(first) ||
        /^\d+\.\s/.test(first) ||
        /^(주요|안내|중요|긴급|Service|Key|Important|Notice|Schedule)/i.test(first))
    ) {
      const clean = first.replace(/^[■※*\s]+|[※*\s]+$/g, "").trim();
      parts.push(`<h2>${escapeHtml(clean)}</h2>`);
      continue;
    }

    if (lines.every((l) => /^[-•·]\s+/.test(l) || /^\d+\.\s+/.test(l))) {
      const items = lines
        .map((l) => l.replace(/^[-•·]\s+/, "").replace(/^\d+\.\s+/, ""))
        .map((l) => `<li>${escapeHtml(l)}</li>`)
        .join("");
      parts.push(`<ul>${items}</ul>`);
      continue;
    }

    parts.push(
      `<p>${lines.map((l) => escapeHtml(l)).join("<br />")}</p>`
    );
  }

  return parts.join("\n");
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
