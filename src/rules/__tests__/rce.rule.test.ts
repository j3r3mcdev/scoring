import { RceRule } from "../rce.rules";

describe("RCE Rule", () => {
  const rule = new RceRule();

  it("détecte un payload RCE", () => {
    const ctx = {
      events: [
        {
          id: "1",
          source: "http" as const,
          timestamp: Date.now(),
          metadata: {},
          payload: "test; bash -c 'ls'",
        },
      ],
      chains: [],
    };

    expect(rule.applies(ctx)).toBe(true);
    const findings = rule.execute(ctx);
    expect(findings.length).toBe(1);
    expect(findings[0].vulnerability).toBe("rce");
  });

  it("ne détecte rien sur un payload normal", () => {
    const ctx = {
      events: [
        {
          id: "1",
          source: "http" as const,
          timestamp: Date.now(),
          metadata: {},
          payload: "hello world",
        },
      ],
      chains: [],
    };

    expect(rule.applies(ctx)).toBe(false);
  });
});
