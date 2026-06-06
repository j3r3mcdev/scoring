/**
 * ─────────────────────────────────────────────────────────────
 *  CHAIN UTILS — Version PRO
 *  Outils avancés pour manipuler les chaînes de corrélation.
 * ─────────────────────────────────────────────────────────────
 */

import { CorrelationChain, NormalizedEvent } from "../core/scoring-types";

/**
 * Retourne un label lisible pour la confiance (0 → 1).
 */
export function chainConfidenceLabel(confidence: number): string {
  if (confidence >= 0.9) return "very_high";
  if (confidence >= 0.75) return "high";
  if (confidence >= 0.5) return "medium";
  if (confidence >= 0.25) return "low";
  return "very_low";
}

/**
 * Formate une chaîne en texte lisible (pour Markdown/HTML).
 */
export function formatChain(chain: CorrelationChain): string {
  const events = chain.events
    .map(
      (e) => `${e.source.toUpperCase()}@${new Date(e.timestamp).toISOString()}`,
    )
    .join(" → ");

  return `${chain.type.toUpperCase()} (${chainConfidenceLabel(chain.confidence)})\n${events}`;
}

/**
 * Résumé compact d'une chaîne (pour tableaux, JSON, logs).
 */
export function chainSummary(chain: CorrelationChain): string {
  const first = chain.events[0];
  const last = chain.events[chain.events.length - 1];

  return `${chain.type} | ${first.source} → ${last.source} | conf=${chain.confidence.toFixed(2)}`;
}

/**
 * Trie les chaînes par confiance décroissante.
 */
export function sortChains(chains: CorrelationChain[]): CorrelationChain[] {
  return [...chains].sort((a, b) => b.confidence - a.confidence);
}

/**
 * Groupe les chaînes par type de vulnérabilité.
 */
export function groupChainsByType(
  chains: CorrelationChain[],
): Record<string, CorrelationChain[]> {
  return chains.reduce(
    (acc, chain) => {
      if (!acc[chain.type]) acc[chain.type] = [];
      acc[chain.type].push(chain);
      return acc;
    },
    {} as Record<string, CorrelationChain[]>,
  );
}

/**
 * Génère une signature unique pour une chaîne (utile pour les reporters).
 */
export function chainSignature(chain: CorrelationChain): string {
  const ids = chain.events.map((e: NormalizedEvent) => e.id).join("-");
  return `${chain.type}:${ids}`;
}
