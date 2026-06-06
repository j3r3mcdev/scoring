import { ScoringResult } from "./scoring-types";

/**
 * Helper pour créer un résultat vide (utile pour les tests).
 */
export function createEmptyResult(): ScoringResult {
  return {
    score: 0,
    severity: "low",
    findings: [],
    chains: [],
    timestamp: Date.now(),
    metadata: {},
  };
}
