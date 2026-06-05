import { Rule, RuleFinding, ScoringContext } from "../core/scoring-types";

/**
 * ─────────────────────────────────────────────────────────────
 *  LFI RULE — Détection simple basée sur les patterns classiques
 *  Version minimaliste, sans heuristique lourde.
 *  Compatible avec le moteur de scoring.
 * ─────────────────────────────────────────────────────────────
 */
export class LfiRule implements Rule {
  id = "lfi-basic";
  name = "Basic LFI Detection";
  description =
    "Détecte les patterns LFI classiques dans les événements normalisés.";

  /**
   * La règle s’applique si au moins un event contient un payload suspect.
   */
  applies(context: ScoringContext): boolean {
    return context.events.some(
      (evt) => typeof evt.payload === "string" && this.containsLfi(evt.payload),
    );
  }

  /**
   * Retourne un ou plusieurs findings LFI.
   */
  execute(context: ScoringContext): RuleFinding[] {
    const findings: RuleFinding[] = [];

    for (const evt of context.events) {
      if (typeof evt.payload !== "string") continue;

      if (this.containsLfi(evt.payload)) {
        findings.push({
          ruleId: this.id,
          vulnerability: "lfi",
          score: 0.85, // score brut (0 → 1)
          severity: "high",
          details: `Payload LFI détecté : ${evt.payload}`,
        });
      }
    }

    return findings;
  }

  /**
   * Détection simple de patterns LFI.
   */
  private containsLfi(input: string): boolean {
    const patterns = [
      // Path traversal
      /\.\.\//i,
      /\.\.\\/, // Windows

      // Accès à /etc/passwd
      /\/etc\/passwd/i,

      // Accès à des fichiers sensibles
      /\/proc\/self/i,
      /\/proc\/net/i,
      /\/var\/log/i,

      // Inclusion PHP
      /php:\/\//i,
      /data:\/\//i,

      // Encodages
      /%2e%2e%2f/i, // ../ encodé
      /%2fetc%2fpasswd/i,
    ];

    return patterns.some((regex) => regex.test(input));
  }
}
