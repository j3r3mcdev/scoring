import { HTMLReporter } from "../html/HTMLReporter";
import { Finding, CorrelationChain } from "../../core/scoring-types";

describe("HTMLReporter", () => {
  const reporter = new HTMLReporter();

  const findings: Finding[] = [
    {
      id: "f1",
      vulnerability: "xss",
      severity: "medium",
      score: 55,
      details: "<b>HTML</b> injection",
      evidence: ["<script>alert(1)</script>"] as any[],
      chains: [],
    },
  ];

  const chains: CorrelationChain[] = [
    {
      id: "c1",
      type: "xss",
      confidence: 0.8,
      events: [{ id: "e1", source: "path", timestamp: 123 }] as any[],
    },
  ];

  it("génère un HTML valide", () => {
    const out = reporter.generate(findings, chains);

    expect(out.mime).toBe("text/html");
    expect(out.content).toContain("<html");
    expect(out.content).toContain("<h1>");
    expect(out.content).toContain("Findings");
    expect(out.content).toContain("Correlation Chains");
  });

  it("échappe correctement le HTML dangereux", () => {
    const out = reporter.generate(findings, []);

    expect(out.content).toContain("&lt;b&gt;HTML&lt;/b&gt;");
    expect(out.content).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
  });

  it("gère un rapport vide", () => {
    const out = reporter.generate([], []);

    expect(out.content).toContain("_No findings detected._");
    expect(out.content).toContain("_No chains detected._");
  });
});
