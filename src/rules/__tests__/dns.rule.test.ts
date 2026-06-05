import { DnsRule } from "../dns.rules";

describe("DNS Rule", () => {
  const rule = new DnsRule();

  it("détecte une anomalie DNS", () => {
    const ctx = {
      events: [
        {
          id: "1",
          source: "dns" as const,
          timestamp: Date.now(),
          metadata: {},
          payload: "internal.localdomain",
        },
      ],
      chains: [],
    };

    expect(rule.applies(ctx)).toBe(true);
    const findings = rule.execute(ctx);
    expect(findings.length).toBe(1);
    expect(findings[0].vulnerability).toBe("dns");
  });

  it("ne détecte rien sur un domaine normal", () => {
    const ctx = {
      events: [
        {
          id: "1",
          source: "dns" as const,
          timestamp: Date.now(),
          metadata: {},
          payload: "google.com",
        },
      ],
      chains: [],
    };

    expect(rule.applies(ctx)).toBe(false);
  });
});
