import { PathTraversalRule } from "../path-transversal.rule";

describe("Path Traversal Rule", () => {
  const rule = new PathTraversalRule();

  it("détecte un path traversal", () => {
    const ctx = {
      events: [
        {
          id: "1",
          source: "http" as const,
          timestamp: Date.now(),
          metadata: {},
          payload: "../etc/passwd",
        },
      ],
      chains: [],
    };

    expect(rule.applies(ctx)).toBe(true);
    const findings = rule.execute(ctx);
    expect(findings.length).toBe(1);
    expect(findings[0].vulnerability).toBe("path_traversal");
  });

  it("ne détecte rien sur un payload normal", () => {
    const ctx = {
      events: [
        {
          id: "1",
          source: "http" as const,
          timestamp: Date.now(),
          metadata: {},
          payload: "/api/user",
        },
      ],
      chains: [],
    };

    expect(rule.applies(ctx)).toBe(false);
  });
});
