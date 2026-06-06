import { createReporter } from "../reporter-factory";
import { Finding, CorrelationChain } from "../../core/scoring-types";

describe("Reporters Integration", () => {
  const findings: Finding[] = [
    {
      id: "f1",
      vulnerability: "sqli",
      severity: "high",
      score: 75,
      details: "SQL injection",
      evidence: [{ id: "ev1", source: "payload", timestamp: 111 }] as any[],
      chains: [],
    },
  ];

  const chains: CorrelationChain[] = [
    {
      id: "c1",
      type: "sqli",
      confidence: 0.9,
      events: [{ id: "e1", source: "path", timestamp: 123 }] as any[],
    },
  ];

  const formats = ["json", "markdown", "html"] as const;

  for (const format of formats) {
    it(`génère un rapport complet en ${format}`, () => {
      const reporter = createReporter(format);
      const out = reporter.generate(findings, chains);

      expect(out.filename).toContain(
        format === "markdown" ? ".md" : `.${format}`,
      );
      expect(out.content.length).toBeGreaterThan(50);
      expect(out.mime).toBe(
        format === "json"
          ? "application/json"
          : format === "markdown"
            ? "text/markdown"
            : "text/html",
      );
    });
  }
});
