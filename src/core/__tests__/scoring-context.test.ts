import { ContextBuilder } from "../scoring-context";

describe("ScoringContext", () => {
  test("builds an empty context", () => {
    const ctx = new ContextBuilder().build();

    expect(ctx.events).toEqual([]);
    expect(ctx.chains).toEqual([]);
    expect(ctx.metadata).toEqual({});
  });

  test("adds events", () => {
    const event = {
      id: "1",
      source: "waf" as const,
      timestamp: Date.now(),
      metadata: {},
    };

    const ctx = new ContextBuilder().addEvent(event).build();

    expect(ctx.events).toHaveLength(1);
    expect(ctx.events[0]).toBe(event);
  });

  test("adds chains", () => {
    const chain = {
      id: "c1",
      type: "ssrf" as const,
      events: [],
      confidence: 0.9,
    };

    const ctx = new ContextBuilder().addChain(chain).build();

    expect(ctx.chains).toHaveLength(1);
    expect(ctx.chains[0]).toBe(chain);
  });

  test("sets metadata", () => {
    const ctx = new ContextBuilder()
      .setMetadata("target", "https://example.com")
      .build();

    expect(ctx.metadata?.target).toBe("https://example.com");
  });
});
