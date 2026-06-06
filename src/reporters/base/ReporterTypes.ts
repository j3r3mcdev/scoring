/**
 * ─────────────────────────────────────────────────────────────
 *  REPORTER TYPES — Version PRO
 *  Types communs à tous les reporters
 * ─────────────────────────────────────────────────────────────
 */

export interface ReporterMetadata {
  generatedAt?: number; // timestamp
  title?: string;
  target?: string; // service, app, env…
  version?: string; // version du moteur
}

export interface ReporterOutput {
  filename: string;
  content: string;
  mime: string;
}

export type ReporterFormat = "json" | "markdown" | "html";
