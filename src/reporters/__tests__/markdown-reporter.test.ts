import { MarkdownReporter } from "../markdown/MarkdownReporter";
import { Finding, CorrelationChain } from "../../core/scoring-types";

describe("MarkdownReporter", () => {
  const reporter = new MarkdownReporter();

  const findings: Finding[] = [
    {
      id: "f1",
      vulnerability: "sqli",
      severity: "critical",
      score: 95,
      details: "SQL injection detected",
      evidence: [
        { id: "ev1", source: "payload", timestamp: 111 },
        { id: "ev2", source: "db", timestamp: 222 },
      ] as any[],
      chains: [],
    },
  ];

  const chains: CorrelationChain[] = [
    {
      id: "c1",
      type: "sqli",
      confidence: 0.85,
      events: [
        { id: "e1", source: "path", timestamp: 123 },
        { id: "e2", source: "query", timestamp: 456 },
      ] as any[],
    },
  ];

  it("génère un markdown avec les sections obligatoires", () => {
    const out = reporter.generate(findings, chains);

    expect(out.mime).toBe("text/markdown");

    expect(out.content).toContain("# Security Scan Report");
    expect(out.content).toContain("## Summary");
    expect(out.content).toContain("## Findings");
    expect(out.content).toContain("## Correlation Chains");

    // Vérifie que la vulnérabilité apparaît bien
    expect(out.content).toContain("SQLI");
  });

  it("échappe correctement le markdown dangereux", () => {
    const out = reporter.generate(
      [
        {
          id: "f2",
          vulnerability: "xss",
          severity: "high",
          score: 80,
          details: "`code` *bold* _italic_",
          evidence: [],
          chains: [],
        },
      ],
      [],
    );

    expect(out.content).toContain("\\`code\\`");
    expect(out.content).toContain("\\*bold\\*");
    expect(out.content).toContain("\\_italic\\_");
  });

  it("gère un rapport vide", () => {
    const out = reporter.generate([], []);

    expect(out.content).toContain("_No findings detected._");
    expect(out.content).toContain("_No chains detected._");
  });
});
