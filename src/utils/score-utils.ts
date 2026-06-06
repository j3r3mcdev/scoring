/**
 * ─────────────────────────────────────────────────────────────
 *  SCORE UTILS — Version PRO
 *  Outils avancés pour manipuler les scores et sévérités.
 * ─────────────────────────────────────────────────────────────
 */

import { Severity } from "../core/scoring-types";

/**
 * Normalise un score brut (0 → 1) en score final (0 → 100).
 */
export function normalizeScore(raw: number): number {
  if (raw < 0) return 0;
  if (raw > 1) return 100;
  return Math.round(raw * 100);
}

/**
 * Convertit un score (0–100) en sévérité standardisée.
 */
export function scoreToSeverity(score: number): Severity {
  if (score >= 90) return "critical";
  if (score >= 70) return "high";
  if (score >= 40) return "medium";
  return "low";
}

/**
 * Retourne une couleur lisible pour les reporters HTML/Markdown.
 */
export function severityColor(severity: Severity): string {
  switch (severity) {
    case "critical":
      return "#d32f2f"; // rouge fort
    case "high":
      return "#f57c00"; // orange
    case "medium":
      return "#fbc02d"; // jaune
    case "low":
      return "#388e3c"; // vert
    default:
      return "#616161"; // gris
  }
}

/**
 * Combine plusieurs scores bruts (0 → 1) en un score unique.
 * Utilise la méthode "max" (la plus utilisée en sécurité).
 */
export function combineScoresMax(scores: number[]): number {
  if (scores.length === 0) return 0;
  return Math.max(...scores);
}

/**
 * Combine plusieurs scores bruts en moyenne pondérée.
 */
export function combineScoresWeighted(
  scores: number[],
  weights: number[],
): number {
  if (scores.length === 0 || weights.length === 0) return 0;
  if (scores.length !== weights.length) {
    throw new Error("scores and weights must have the same length");
  }

  const totalWeight = weights.reduce((a, b) => a + b, 0);
  if (totalWeight === 0) return 0;

  const weighted = scores.reduce(
    (acc, score, i) => acc + score * weights[i],
    0,
  );

  return weighted / totalWeight;
}

/**
 * Retourne un label lisible pour un score (utile pour les reporters).
 */
export function scoreLabel(score: number): string {
  if (score >= 90) return "Critical risk";
  if (score >= 70) return "High risk";
  if (score >= 40) return "Medium risk";
  return "Low risk";
}

/**
 * Retourne un objet complet pour les reporters JSON.
 */
export function scoreInfo(raw: number) {
  const normalized = normalizeScore(raw);
  const severity = scoreToSeverity(normalized);

  return {
    raw,
    normalized,
    severity,
    label: scoreLabel(normalized),
    color: severityColor(severity),
  };
}
