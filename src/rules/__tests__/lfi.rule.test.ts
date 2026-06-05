import { LfiRule } from "../lfi.rule";

describe("LFI Rule", () => {
  const rule = new LfiRule();

  it("détecte un payload LFI", () => {
    const ctx = {
      events: [
        {
          id: "1",
          source: "http" as const,
          timestamp: Date.now(),
          metadata: {},
          payload: "../../../../etc/passwd",
        },
      ],
      chains: [],
    };

    expect(rule.applies(ctx)).toBe(true);
    const findings = rule.execute(ctx);
    expect(findings.length).toBe(1);
    expect(findings[0].vulnerability).toBe("lfi");
  });

  it("ne détecte rien sur un payload normal", () => {
    const ctx = {
      events: [
        {
          id: "1",
          source: "http" as const,
          timestamp: Date.now(),
          metadata: {},
          payload: "/home/user/profile",
        },
      ],
      chains: [],
    };

    expect(rule.applies(ctx)).toBe(false);
  });
});
