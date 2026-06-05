import { Rule, RuleFinding, ScoringContext } from "../core/scoring-types";

/**
 * ─────────────────────────────────────────────────────────────
 *  PATH TRAVERSAL RULE — Détection simple des patterns ../
 *  Version minimaliste, sans heuristique lourde.
 *  Compatible avec le moteur de scoring.
 * ─────────────────────────────────────────────────────────────
 */
export class PathTraversalRule implements Rule {
  id = "path-traversal-basic";
  name = "Basic Path Traversal Detection";
  description =
    "Détecte les patterns de Path Traversal dans les événements normalisés.";

  /**
   * La règle s’applique si au moins un event contient un payload suspect.
   */
  applies(context: ScoringContext): boolean {
    return context.events.some(
      (evt) =>
        typeof evt.payload === "string" &&
        this.containsPathTraversal(evt.payload),
    );
  }

  /**
   * Retourne un ou plusieurs findings Path Traversal.
   */
  execute(context: ScoringContext): RuleFinding[] {
    const findings: RuleFinding[] = [];

    for (const evt of context.events) {
      if (typeof evt.payload !== "string") continue;

      if (this.containsPathTraversal(evt.payload)) {
        findings.push({
          ruleId: this.id,
          vulnerability: "path_traversal",
          score: 0.75, // score brut (0 → 1)
          severity: "medium",
          details: `Payload Path Traversal détecté : ${evt.payload}`,
        });
      }
    }

    return findings;
  }

  /**
   * Détection simple de patterns Path Traversal.
   */
  private containsPathTraversal(input: string): boolean {
    const patterns = [
      /\.\.\//i, // ../
      /\.\.\\/, // ..\ (Windows)
      /%2e%2e%2f/i, // ../ encodé
      /%2e%2e%5c/i, // ..\ encodé
      /\/etc\/passwd/i,
      /c:\\windows\\system32/i,
    ];

    return patterns.some((regex) => regex.test(input));
  }
}
