import { Rule } from "../core/scoring-types";

/**
 * ─────────────────────────────────────────────────────────────
 *  RULE REGISTRY — Version avancée, stable
 *  Gestion centralisée des règles du moteur.
 * ─────────────────────────────────────────────────────────────
 */
export class RuleRegistry {
  private static rules: Rule[] = [];

  /**
   * Enregistre une règle unique.
   */
  static register(rule: Rule): void {
    this.rules.push(rule);
  }

  /**
   * Enregistre plusieurs règles d'un coup.
   */
  static registerMany(rules: Rule[]): void {
    this.rules.push(...rules);
  }

  /**
   * Retourne toutes les règles enregistrées.
   */
  static getAll(): Rule[] {
    return [...this.rules];
  }

  /**
   * Vide la registry (utile pour les tests).
   */
  static clear(): void {
    this.rules = [];
  }
}
