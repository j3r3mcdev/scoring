import { Rule, RuleFinding, ScoringContext } from "../core/scoring-types";

/**
 * ─────────────────────────────────────────────────────────────
 *  BASE RULE — Classe abstraite pour toutes les règles
 *  Fournit des helpers communs et une structure standardisée.
 * ─────────────────────────────────────────────────────────────
 */
export abstract class BaseRule implements Rule {
  abstract id: string;
  abstract name: string;
  description?: string;

  /**
   * Vérifie si la règle doit s’appliquer au contexte.
   * Chaque règle doit implémenter sa propre logique.
   */
  abstract applies(context: ScoringContext): boolean;

  /**
   * Exécute la règle et retourne un ou plusieurs findings.
   */
  abstract execute(context: ScoringContext): RuleFinding[];

  /**
   * Helper : sécurise un payload en string.
   */
  protected safeString(value: unknown): string {
    if (typeof value === "string") return value;
    try {
      return JSON.stringify(value);
    } catch {
      return String(value ?? "");
    }
  }

  /**
   * Helper : teste si un input match au moins un regex.
   */
  protected matchAny(input: string, patterns: RegExp[]): boolean {
    return patterns.some((regex) => regex.test(input));
  }
}
