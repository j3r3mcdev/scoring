import { Rule, RuleFinding, ScoringContext } from "../core/scoring-types";

/**
 * ─────────────────────────────────────────────────────────────
 *  SSRF RULE — Détection simple basée sur les patterns classiques
 *  Version minimaliste, sans callback OAST (viendra plus tard).
 *  Compatible avec le moteur de scoring.
 * ─────────────────────────────────────────────────────────────
 */
export class SsrfRule implements Rule {
  id = "ssrf-basic";
  name = "Basic SSRF Detection";
  description = "Détecte les patterns SSRF classiques dans les événements normalisés.";

  /**
   * La règle s’applique si au moins un event contient un payload suspect.
   */
  applies(context: ScoringContext): boolean {
    return context.events.some(
      (evt) => typeof evt.payload === "string" && this.containsSsrf(evt.payload)
    );
  }

  /**
   * Retourne un ou plusieurs findings SSRF.
   */
  execute(context: ScoringContext): RuleFinding[] {
    const findings: RuleFinding[] = [];

    for (const evt of context.events) {
      if (typeof evt.payload !== "string") continue;

      if (this.containsSsrf(evt.payload)) {
        findings.push({
          ruleId: this.id,
          vulnerability: "ssrf",
          score: 0.9, // score brut (0 → 1)
          severity: "critical",
          details: `Payload SSRF détecté : ${evt.payload}`,
        });
      }
    }

    return findings;
  }

  /**
   * Détection simple de patterns SSRF.
   */
  private containsSsrf(input: string): boolean {
    const patterns = [
      // Accès aux IP internes
      /127\.0\.0\.1/i,
      /localhost/i,
      /0\.0\.0\.0/i,
      /169\.254\.169\.254/i, // AWS metadata
      /metadata\.google\.internal/i,
      /metadata\/v1/i,

      // Protocoles dangereux
      /file:\/\//i,
      /gopher:\/\//i,
      /dict:\/\//i,
      /ftp:\/\//i,

      // Bypass classiques
      /\[::1\]/i,
      /@localhost/i,
      /\/\/localhost/i,
      /\/\/127\.0\.0\.1/i,
    ];

    return patterns.some((regex) => regex.test(input));
  }

}
