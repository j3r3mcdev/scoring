import { ScoringEngine } from "../scoring-engine";
import { RuleRegistry } from "../../rules/rule-registry";
import { ContextBuilder } from "../scoring-context";

describe("ScoringEngine", () => {
  beforeEach(() => RuleRegistry.clear());

  test("returns empty result when no rules apply", () => {
    const engine = new ScoringEngine();
    const ctx = new ContextBuilder().build();

    const result = engine.run(ctx);

    expect(result.score).toBe(0);
    expect(result.findings).toHaveLength(0);
  });

  test("executes a rule and returns findings", () => {
    const fakeRule = {
      id: "r1",
      name: "Fake",
      applies: () => true,
      execute: () => [
        {
          ruleId: "r1",
          vulnerability: "xss" as const,
          score: 0.8,
          severity: "high" as const,
          details: "test",
        },
      ],
    };

    RuleRegistry.register(fakeRule);

    const engine = new ScoringEngine();
    const ctx = new ContextBuilder().build();

    const result = engine.run(ctx);

    expect(result.findings).toHaveLength(1);
    expect(result.findings[0].vulnerability).toBe("xss");
    expect(result.score).toBe(80);
    expect(result.severity).toBe("high");
  });

  test("merges multiple findings of same vulnerability", () => {
    const rule = {
      id: "r1",
      name: "MergeTest",
      applies: () => true,
      execute: () => [
        {
          ruleId: "r1",
          vulnerability: "sqli" as const,
          score: 0.4,
          severity: "medium" as const,
        },
        {
          ruleId: "r1",
          vulnerability: "sqli" as const,
          score: 0.9,
          severity: "critical" as const,
        },
      ],
    };

    RuleRegistry.register(rule);

    const engine = new ScoringEngine();
    const ctx = new ContextBuilder().build();

    const result = engine.run(ctx);

    expect(result.findings).toHaveLength(1);
    expect(result.findings[0].score).toBe(0.9);
    expect(result.findings[0].severity).toBe("critical");
  });

  test("computes global severity as highest", () => {
    const rule = {
      id: "r1",
      name: "MergeTest",
      applies: () => true,
      execute: () => [
        {
          ruleId: "r1",
          vulnerability: "sqli" as const,
          score: 0.4,
          severity: "medium" as const,
        },
        {
          ruleId: "r1",
          vulnerability: "sqli" as const,
          score: 0.9,
          severity: "critical" as const,
        },
      ],
    };

    RuleRegistry.register(rule);

    const engine = new ScoringEngine();
    const ctx = new ContextBuilder().build();

    const result = engine.run(ctx);

    expect(result.severity).toBe("critical");
  });
});
