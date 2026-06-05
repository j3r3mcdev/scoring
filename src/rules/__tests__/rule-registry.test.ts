import { RuleRegistry } from "../rule-registry";

describe("RuleRegistry", () => {
  beforeEach(() => RuleRegistry.clear());

  test("registers a rule", () => {
    const rule = {
      id: "r1",
      name: "Test",
      applies: () => false,
      execute: () => [],
    };

    RuleRegistry.register(rule);

    expect(RuleRegistry.getAll()).toContain(rule);
  });

  test("registers multiple rules", () => {
    const r1 = { id: "r1", name: "A", applies: () => false, execute: () => [] };
    const r2 = { id: "r2", name: "B", applies: () => false, execute: () => [] };

    RuleRegistry.registerMany([r1, r2]);

    expect(RuleRegistry.getAll()).toHaveLength(2);
  });

  test("clears registry", () => {
    RuleRegistry.register({
      id: "r1",
      name: "A",
      applies: () => false,
      execute: () => [],
    });

    RuleRegistry.clear();

    expect(RuleRegistry.getAll()).toHaveLength(0);
  });
});
