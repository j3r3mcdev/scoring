import { Finding, Severity, CorrelationChain } from "./scoring-types";

/**
 * ─────────────────────────────────────────────────────────────
 *  SCORING RESULT — Version avancée
 *  Représente le résultat final du moteur de scoring.
 * ─────────────────────────────────────────────────────────────
 */
export interface ScoringResult {
  /**
   * Score global entre 0 et 100.
   * Calculé à partir des findings et des pondérations.
   */
  score: number;

  /**
   * Sévérité globale (low, medium, high, critical).
   */
  severity: Severity;

  /**
   * Liste des findings consolidés.
   * Chaque finding représente une vulnérabilité détectée.
   */
  findings: Finding[];

  /**
   * Chaînes de corrélation détectées (DNS → HTTP → SSRF, etc.)
   */
  chains: CorrelationChain[];

  /**
   * Timestamp de génération du rapport.
   */
  timestamp: number;

  /**
   * Métadonnées additionnelles (optionnelles).
   * Ex : cible, IP, user-agent, contexte d'analyse…
   */
  metadata?: Record<string, any>;
}

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
