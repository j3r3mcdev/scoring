/**
 * ─────────────────────────────────────────────────────────────
 *  REPORT UTILS — Version PRO
 *  Outils avancés pour générer du Markdown, HTML et JSON propres.
 * ─────────────────────────────────────────────────────────────
 */

/**
 * Échappe les caractères Markdown sensibles.
 */
export function escapeMarkdown(text: string): string {
  if (!text) return "";
  return text
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\*/g, "\\*")
    .replace(/_/g, "\\_")
    .replace(/{/g, "\\{")
    .replace(/}/g, "\\}")
    .replace(/\[/g, "\\[")
    .replace(/]/g, "\\]")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/#/g, "\\#")
    .replace(/\+/g, "\\+")
    .replace(/-/g, "\\-")
    .replace(/\!/g, "\\!");
}

/**
 * Échappe les caractères HTML dangereux.
 */
export function escapeHtml(text: string): string {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Nettoie un texte pour éviter les injections dans les rapports.
 */
export function sanitizeText(text: string): string {
  if (!text) return "";
  return escapeHtml(text).trim();
}

/**
 * Rend une liste Markdown propre.
 */
export function renderList(items: string[]): string {
  if (!items || items.length === 0) return "- (empty)";
  return items.map((i) => `- ${escapeMarkdown(i)}`).join("\n");
}

/**
 * Rend un tableau Markdown.
 */
export function renderTable(headers: string[], rows: string[][]): string {
  const escapedHeaders = headers.map(escapeMarkdown);
  const escapedRows = rows.map((row) => row.map(escapeMarkdown));

  const headerLine = `| ${escapedHeaders.join(" | ")} |`;
  const separator = `| ${escapedHeaders.map(() => "---").join(" | ")} |`;
  const rowLines = escapedRows.map((r) => `| ${r.join(" | ")} |`);

  return [headerLine, separator, ...rowLines].join("\n");
}

/**
 * Rend un bloc de code Markdown.
 */
export function renderCodeBlock(code: string, lang = ""): string {
  return `\`\`\`${lang}\n${code}\n\`\`\``;
}

/**
 * Rend une section Markdown avec un titre.
 */
export function renderSection(title: string, content: string): string {
  return `## ${escapeMarkdown(title)}\n\n${content}`;
}

/**
 * Rend un paragraphe HTML sécurisé.
 */
export function renderHtmlParagraph(text: string): string {
  return `<p>${escapeHtml(text)}</p>`;
}

/**
 * Rend une liste HTML sécurisée.
 */
export function renderHtmlList(items: string[]): string {
  const li = items.map((i) => `<li>${escapeHtml(i)}</li>`).join("");
  return `<ul>${li}</ul>`;
}

/**
 * Rend un tableau HTML sécurisé.
 */
export function renderHtmlTable(headers: string[], rows: string[][]): string {
  const thead = `<tr>${headers
    .map((h) => `<th>${escapeHtml(h)}</th>`)
    .join("")}</tr>`;

  const tbody = rows
    .map(
      (row) =>
        `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`,
    )
    .join("");

  return `<table><thead>${thead}</thead><tbody>${tbody}</tbody></table>`;
}
