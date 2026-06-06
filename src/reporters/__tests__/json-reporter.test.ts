import { JSONReporter } from "../json/JSONReporter";
import { Finding, CorrelationChain } from "../../core/scoring-types";

describe("JSONReporter", () => {
  const reporter = new JSONReporter();

  const findings: Finding[] = [
    {
      id: "f1",
      vulnerability: "xss",
      severity: "high",
      score: 80,
      details: "Reflected XSS detected",
      evidence: [{ id: "ev1", source: "payload", timestamp: 789 }] as any[],
      chains: [],
    },
  ];

  const chains: CorrelationChain[] = [
    {
      id: "c1",
      type: "xss",
      confidence: 0.9,
      events: [
        { id: "e1", source: "path", timestamp: 123 },
        { id: "e2", source: "path", timestamp: 456 },
      ] as any[],
    },
  ];

  it("génère un JSON valide", () => {
    const out = reporter.generate(findings, chains);

    expect(out.mime).toBe("application/json");

    const parsed = JSON.parse(out.content);

    expect(parsed.format).toBe("json");
    expect(parsed.summary.totalFindings).toBe(1);
    expect(parsed.summary.totalChains).toBe(1);
  });

  it("gère un rapport vide", () => {
    const out = reporter.generate([], []);
    const parsed = JSON.parse(out.content);

    expect(parsed.summary.totalFindings).toBe(0);
    expect(parsed.summary.totalChains).toBe(0);
  });
});
