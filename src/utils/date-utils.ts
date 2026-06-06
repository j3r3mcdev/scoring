/**
 * ─────────────────────────────────────────────────────────────
 *  DATE UTILS — Version PRO
 *  Outils avancés pour formater les dates dans les rapports.
 * ─────────────────────────────────────────────────────────────
 */

/**
 * Formate un timestamp en ISO (lisible, stable, triable).
 */
export function formatIso(timestamp: number): string {
  return new Date(timestamp).toISOString();
}

/**
 * Formate une date en format humain (YYYY-MM-DD HH:mm:ss).
 */
export function formatHuman(timestamp: number): string {
  const d = new Date(timestamp);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    `${d.getFullYear()}-` +
    `${pad(d.getMonth() + 1)}-` +
    `${pad(d.getDate())} ` +
    `${pad(d.getHours())}:` +
    `${pad(d.getMinutes())}:` +
    `${pad(d.getSeconds())}`
  );
}

/**
 * Retourne la durée entre deux timestamps (ms → texte lisible).
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;

  const sec = Math.floor(ms / 1000);
  if (sec < 60) return `${sec}s`;

  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ${sec % 60}s`;

  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h ${min % 60}m`;

  const d = Math.floor(h / 24);
  return `${d}d ${h % 24}h`;
}

/**
 * Retourne "il y a X" (utile pour les rapports Markdown/HTML).
 */
export function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;

  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}s ago`;

  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;

  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h ago`;

  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

/**
 * Retourne un objet détaillé (utile pour JSON reporter).
 */
export function dateInfo(timestamp: number) {
  return {
    iso: formatIso(timestamp),
    human: formatHuman(timestamp),
    ago: timeAgo(timestamp),
  };
}
