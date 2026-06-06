/**
 * ─────────────────────────────────────────────────────────────
 *  FINDING UTILS — Version PRO
 *  Outils avancés pour manipuler les findings consolidés.
 * ─────────────────────────────────────────────────────────────
 */

import { Finding, Severity } from "../core/scoring-types";

/**
 * Poids interne pour trier les sévérités.
 */
const SEVERITY_ORDER: Record<Severity, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

/**
 * Trie les findings par sévérité décroissante.
 */
export function sortFindingsBySeverity(findings: Finding[]): Finding[] {
  return [...findings].sort(
    (a, b) => SEVERITY_ORDER[b.severity] - SEVERITY_ORDER[a.severity],
  );
}

/**
 * Trie les findings par score décroissant.
 */
export function sortFindingsByScore(findings: Finding[]): Finding[] {
  return [...findings].sort((a, b) => b.score - a.score);
}

/**
 * Groupe les findings par vulnérabilité.
 */
export function groupFindingsByVulnerability(
  findings: Finding[],
): Record<string, Finding[]> {
  return findings.reduce((acc, f) => {
    if (!acc[f.vulnerability]) acc[f.vulnerability] = [];
    acc[f.vulnerability].push(f);
    return acc;
  }, {} as Record<string, Finding[]>);
}

/**
 * Filtre les findings par sévérité minimale.
 */
export function filterFindingsBySeverity(
  findings: Finding[],
  min: Severity,
): Finding[] {
  const minWeight = SEVERITY_ORDER[min];
  return findings.filter((f) => SEVERITY_ORDER[f.severity] >= minWeight);
}

/**
 * Génère une signature unique pour un finding.
 * Utile pour les reporters, logs, déduplication.
 */
export function findingSignature(f: Finding): string {
  return `${f.vulnerability}:${f.score}:${f.severity}`;
}

/**
 * Résumé compact d’un finding (pour tableaux, logs, JSON).
 */
export function findingSummary(f: Finding): string {
  return `${f.vulnerability.toUpperCase()} | score=${f.score} | severity=${f.severity}`;
}

/**
 * Fusionne plusieurs findings du même type (utile si un reporter veut regrouper).
 */
export function mergeFindings(findings: Finding[]): Finding {
  if (findings.length === 1) return findings[0];

  const base = findings[0];

  const merged: Finding = {
    ...base,
    score: Math.max(...findings.map((f) => f.score)),
    severity: findings.reduce(
      (acc, f) =>
        SEVERITY_ORDER[f.severity] > SEVERITY_ORDER[acc] ? f.severity : acc,
      base.severity,
    ),
    evidence: findings.flatMap((f) => f.evidence),
    chains: findings.flatMap((f) => f.chains ?? []),
    details: findings.map((f) => f.details ?? "").join("\n"),
  };

  return merged;
}
