import { createEmptyResult } from "../scoring-result";

describe("createEmptyResult", () => {
  test("returns a valid empty scoring result", () => {
    const result = createEmptyResult();

    expect(result.score).toBe(0);
    expect(result.severity).toBe("low");
    expect(result.findings).toEqual([]);
    expect(result.chains).toEqual([]);
    expect(result.metadata).toEqual({});
    expect(typeof result.timestamp).toBe("number");
  });
});
