import { HttpRule } from "../http.rules";

describe("HTTP Rule", () => {
  const rule = new HttpRule();

  it("détecte une anomalie HTTP", () => {
    const ctx = {
      events: [
        {
          id: "1",
          source: "http" as const,
          timestamp: Date.now(),
          metadata: {
            method: "TRACE",
            path: "/",
          },
        },
      ],
      chains: [],
    };

    expect(rule.applies(ctx)).toBe(true);
    const findings = rule.execute(ctx);
    expect(findings.length).toBe(1);
    expect(findings[0].vulnerability).toBe("http");
  });

  it("ne détecte rien sur une requête normale", () => {
    const ctx = {
      events: [
        {
          id: "1",
          source: "http" as const,
          timestamp: Date.now(),
          metadata: {
            method: "GET",
            path: "/home",
          },
        },
      ],
      chains: [],
    };

    expect(rule.applies(ctx)).toBe(false);
  });
});
