import { Rule, RuleFinding, ScoringContext } from "../core/scoring-types";

/**
 * ─────────────────────────────────────────────────────────────
 *  WAF RULE — Agrégation des signaux WAF
 *  Cette règle transforme les scores WAF en findings consolidés.
 *  Elle ne détecte rien elle-même : elle consomme les signaux
 *  produits par ton middleware WAF.
 * ─────────────────────────────────────────────────────────────
 */
export class WafRule implements Rule {
  id = "waf-basic";
  name = "Basic WAF Signal Aggregation";
  description = "Transforme les signaux WAF (scores) en findings consolidés.";

  /**
   * La règle s’applique si au moins un event WAF contient un score.
   */
  applies(context: ScoringContext): boolean {
    return context.events.some(
      (evt) =>
        evt.source === "waf" &&
        typeof evt.metadata?.wafScore === "number" &&
        evt.metadata.wafScore > 0,
    );
  }

  /**
   * Retourne un ou plusieurs findings basés sur les scores WAF.
   */
  execute(context: ScoringContext): RuleFinding[] {
    const findings: RuleFinding[] = [];

    for (const evt of context.events) {
      if (evt.source !== "waf") continue;

      const score =
        typeof evt.metadata?.wafScore === "number" ? evt.metadata.wafScore : 0;

      if (score <= 0) continue;

      const severity =
        score >= 0.85
          ? "critical"
          : score >= 0.65
            ? "high"
            : score >= 0.4
              ? "medium"
              : "low";

      findings.push({
        ruleId: this.id,
        vulnerability: "waf",
        score,
        severity,
        details: `Score WAF détecté (${score}) sur l’événement ${evt.id}`,
      });
    }

    return findings;
  }
}
