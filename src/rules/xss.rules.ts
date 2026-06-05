import { Rule, RuleFinding, ScoringContext } from "../core/scoring-types";

/**
 * ─────────────────────────────────────────────────────────────
 *  XSS RULE — Détection simple basée sur les patterns classiques
 *  Cette règle est volontairement minimaliste :
 *  - pas d’heuristique lourde
 *  - pas de normalizer
 *  - pas de dépendance externe
 *  - compatible avec le moteur de scoring
 * ─────────────────────────────────────────────────────────────
 */
export class XssRule implements Rule {
  id = "xss-basic";
  name = "Basic XSS Detection";
  description =
    "Détecte les patterns XSS classiques dans les événements normalisés.";

  /**
   * La règle s’applique si au moins un event contient un payload exploitable.
   */
  applies(context: ScoringContext): boolean {
    return context.events.some(
      (evt) => typeof evt.payload === "string" && this.containsXss(evt.payload),
    );
  }

  /**
   * Retourne un ou plusieurs findings XSS.
   */
  execute(context: ScoringContext): RuleFinding[] {
    const findings: RuleFinding[] = [];

    for (const evt of context.events) {
      if (typeof evt.payload !== "string") continue;

      if (this.containsXss(evt.payload)) {
        findings.push({
          ruleId: this.id,
          vulnerability: "xss",
          score: 0.8, // score brut (0 → 1)
          severity: "high",
          details: `Payload suspect détecté : ${evt.payload}`,
        });
      }
    }

    return findings;
  }

  /**
   * Détection simple de patterns XSS.
   */
  private containsXss(input: string): boolean {
    const patterns = [
      /<script[\s>]/i,
      /<\/script>/i,
      /on\w+=/i, // onclick=, onerror=, onload=...
      /javascript:/i,
      /alert\s*\(/i,
      /document\.cookie/i,
    ];

    return patterns.some((regex) => regex.test(input));
  }
}
