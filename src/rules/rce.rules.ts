import { Rule, RuleFinding, ScoringContext } from "../core/scoring-types";

/**
 * ─────────────────────────────────────────────────────────────
 *  RCE RULE — Détection simple de Remote Code Execution
 *  Version minimaliste, sans heuristique lourde.
 *  Compatible avec le moteur de scoring.
 * ─────────────────────────────────────────────────────────────
 */
export class RceRule implements Rule {
  id = "rce-basic";
  name = "Basic RCE Detection";
  description =
    "Détecte des patterns classiques de Remote Code Execution dans les payloads.";

  /**
   * La règle s’applique si au moins un event contient un payload suspect.
   */
  applies(context: ScoringContext): boolean {
    return context.events.some(
      (evt) => typeof evt.payload === "string" && this.containsRce(evt.payload),
    );
  }

  /**
   * Retourne un ou plusieurs findings RCE.
   */
  execute(context: ScoringContext): RuleFinding[] {
    const findings: RuleFinding[] = [];

    for (const evt of context.events) {
      if (typeof evt.payload !== "string") continue;

      if (this.containsRce(evt.payload)) {
        findings.push({
          ruleId: this.id,
          vulnerability: "rce",
          score: 0.95, // score brut (0 → 1)
          severity: "critical",
          details: `Payload RCE détecté : ${evt.payload}`,
        });
      }
    }

    return findings;
  }

  /**
   * Détection simple de patterns RCE.
   */
  private containsRce(input: string): boolean {
    const patterns = [
      // Command injection classiques
      /;\s*rm\s+-rf\s+/i,
      /;\s*curl\s+http/i,
      /;\s*wget\s+http/i,
      /;\s*nc\s+-e/i,
      /;\s*bash\s+-c/i,

      // Fonctions dangereuses
      /system\s*\(/i,
      /exec\s*\(/i,
      /shell_exec\s*\(/i,
      /passthru\s*\(/i,

      // Substitution de commandes
      /`[^`]+`/i,
      /\$\([^)]*\)/i,
    ];

    return patterns.some((regex) => regex.test(input));
  }
}
