import { SsrfRule } from "../ssrf.rules";

describe("SSRF Rule", () => {
  const rule = new SsrfRule();

  it("détecte un payload SSRF", () => {
    const ctx = {
      events: [
        {
          id: "1",
          source: "http" as const,
          timestamp: Date.now(),
          metadata: {},
          payload: "http://169.254.169.254/latest/meta-data/",
        },
      ],
      chains: [],
    };

    expect(rule.applies(ctx)).toBe(true);
    const findings = rule.execute(ctx);
    expect(findings.length).toBe(1);
    expect(findings[0].vulnerability).toBe("ssrf");
  });

  it("ne détecte rien sur un payload normal", () => {
    const ctx = {
      events: [
        {
          id: "1",
          source: "http" as const,
          timestamp: Date.now(),
          metadata: {},
          payload: "https://example.com",
        },
      ],
      chains: [],
    };

    expect(rule.applies(ctx)).toBe(false);
  });
});
