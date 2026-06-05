import { Rule, RuleFinding, ScoringContext } from "../core/scoring-types";

export class DnsRule implements Rule {
  id = "dns-basic";
  name = "Basic DNS Anomaly Detection";
  description =
    "Détecte des patterns DNS suspects (rebinding, domaines internes, etc.).";

  applies(context: ScoringContext): boolean {
    return context.events.some(
      (evt) =>
        evt.source === "dns" &&
        typeof evt.payload === "string" &&
        this.containsDnsAnomaly(evt.payload),
    );
  }

  execute(context: ScoringContext): RuleFinding[] {
    const findings: RuleFinding[] = [];

    for (const evt of context.events) {
      if (evt.source !== "dns" || typeof evt.payload !== "string") continue;

      if (this.containsDnsAnomaly(evt.payload)) {
        findings.push({
          ruleId: this.id,
          vulnerability: "dns",
          score: 0.7,
          severity: "medium",
          details: `Anomalie DNS détectée : ${evt.payload}`,
        });
      }
    }

    return findings;
  }

  private containsDnsAnomaly(input: string): boolean {
    const patterns = [
      /localhost/i,
      /127\.0\.0\.1/i,
      /\[::1\]/i,
      /internal/i,
      /corp/i,
      /localdomain/i,
    ];

    return patterns.some((regex) => regex.test(input));
  }
}
