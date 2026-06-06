/**
 * ─────────────────────────────────────────────────────────────
 *  STRING UTILS — Outils génériques pour les reporters
 *  Version PRO, minimaliste et utile
 * ─────────────────────────────────────────────────────────────
 */

/**
 * Met une majuscule au début d'une chaîne.
 */
export function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Tronque une chaîne avec "…" si elle dépasse une longueur donnée.
 */
export function truncate(str: string, max: number): string {
  if (!str) return "";
  return str.length > max ? str.slice(0, max - 1) + "…" : str;
}

/**
 * Indente chaque ligne d'un texte.
 */
export function indent(text: string, spaces = 2): string {
  const pad = " ".repeat(spaces);
  return text
    .split("\n")
    .map((line) => pad + line)
    .join("\n");
}

/**
 * Supprime les caractères ANSI (utile pour les exports Markdown/HTML).
 */
const ANSI_REGEX = /\u001b\[[0-9]{1,3}(;[0-9]{1,3})*m/g;

export function stripAnsi(str: string): string {
  return str.replace(ANSI_REGEX, "");
}


/**
 * JSON safe (évite les erreurs sur les objets circulaires).
 */
export function safeJson(value: any, space = 2): string {
  try {
    return JSON.stringify(value, null, space);
  } catch {
    return `"[[unserializable]]"`;
  }
}
