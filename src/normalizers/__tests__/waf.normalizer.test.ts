import { WafNormalizer } from "../waf.normalizer";

describe("WafNormalizer (PRO)", () => {
  it("normalise un signal WAF complet", () => {
    const raw = {
      score: 0.92,
      triggeredRules: ["xss", "sqli"],
      ip: "8.8.8.8",
      path: "/admin",
      method: "GET",
      message: "Suspicious activity detected",
    };

    const evt = WafNormalizer.normalize(raw);

    expect(evt.source).toBe("waf");
    expect(evt.payload).toBe("Suspicious activity detected");
    expect(evt.metadata.wafScore).toBe(0.92);
    expect(evt.metadata.triggeredRules).toContain("xss");
    expect(evt.metadata.ip).toBe("8.8.8.8");
  });

  it("fallback payload si aucun message n'est fourni", () => {
    const raw = { score: 0.5 };
    const evt = WafNormalizer.normalize(raw);

    expect(evt.payload).toBe("WAF score: 0.5");
  });

  it("gère un signal WAF minimal", () => {
    const evt = WafNormalizer.normalize({});
    expect(evt.metadata.wafScore).toBe(0);
    expect(evt.payload).toBe("WAF event");
  });

  it("gère triggeredRules non fournis", () => {
    const evt = WafNormalizer.normalize({ score: 0.7 });
    expect(evt.metadata.triggeredRules).toEqual([]);
  });

  it("gère un score non numérique", () => {
    const evt = WafNormalizer.normalize({ score: "invalid" });
    expect(evt.metadata.wafScore).toBe("invalid");
  });
});
