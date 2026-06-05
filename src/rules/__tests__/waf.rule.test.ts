import { WafRule } from "../waf.rules";

describe("WAF Rule", () => {
  const rule = new WafRule();

  it("détecte un score WAF élevé", () => {
    const ctx = {
      events: [
        {
          id: "1",
          source: "waf" as const,
          timestamp: Date.now(),
          metadata: { wafScore: 0.9 },
        },
      ],
      chains: [],
    };

    expect(rule.applies(ctx)).toBe(true);
    const findings = rule.execute(ctx);
    expect(findings.length).toBe(1);
    expect(findings[0].severity).toBe("critical");
  });

  it("ignore un score WAF nul", () => {
    const ctx = {
      events: [
        {
          id: "1",
          source: "waf" as const,
          timestamp: Date.now(),
          metadata: { wafScore: 0 },
        },
      ],
      chains: [],
    };

    expect(rule.applies(ctx)).toBe(false);
  });
});
