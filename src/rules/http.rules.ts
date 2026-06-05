import { Rule, RuleFinding, ScoringContext } from "../core/scoring-types";

/**
 * ─────────────────────────────────────────────────────────────
 *  HTTP RULE — Détection d’anomalies HTTP simples
 *  Version minimaliste, sans heuristique lourde.
 *  Compatible avec le moteur de scoring.
 * ─────────────────────────────────────────────────────────────
 */
export class HttpRule implements Rule {
  id = "http-basic";
  name = "Basic HTTP Anomaly Detection";
  description =
    "Détecte des anomalies HTTP simples (méthodes, headers, chemins suspects).";

  /**
   * La règle s’applique si au moins un event HTTP contient une anomalie.
   */
  applies(context: ScoringContext): boolean {
    return context.events.some(
      (evt) => evt.source === "http" && this.containsHttpAnomaly(evt),
    );
  }

  /**
   * Retourne un ou plusieurs findings HTTP.
   */
  execute(context: ScoringContext): RuleFinding[] {
    const findings: RuleFinding[] = [];

    for (const evt of context.events) {
      if (evt.source !== "http") continue;

      if (this.containsHttpAnomaly(evt)) {
        findings.push({
          ruleId: this.id,
          vulnerability: "http",
          score: 0.6,
          severity: "medium",
          details: `Anomalie HTTP détectée sur l’événement ${evt.id}`,
        });
      }
    }

    return findings;
  }

  /**
   * Détection simple d’anomalies HTTP.
   */
  private containsHttpAnomaly(evt: any): boolean {
    const method = evt.metadata?.method?.toUpperCase?.() ?? "";
    const path =
      typeof evt.metadata?.path === "string" ? evt.metadata.path : "";
    const headers = evt.metadata?.headers ?? {};

    // Méthodes dangereuses
    if (["TRACE", "TRACK"].includes(method)) return true;

    // Path traversal dans l’URL
    if (/\/\.\.\//.test(path)) return true;

    // Headers suspects (URL rewriting)
    if (typeof headers["x-original-url"] === "string") return true;
    if (typeof headers["x-rewrite-url"] === "string") return true;

    // Double slash anormal
    if (/\/{2,}/.test(path)) return true;

    return false;
  }
}
