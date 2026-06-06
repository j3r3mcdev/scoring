import { ChainDetector } from "../chain-detector";
import { NormalizedEvent } from "../../core/scoring-types";

const evt = (partial: Partial<NormalizedEvent>): NormalizedEvent => ({
  id: partial.id ?? "id",
  source: partial.source ?? "http",
  timestamp: partial.timestamp ?? Date.now(),
  payload: partial.payload ?? "",
  metadata: partial.metadata ?? {},
});

describe("ChainDetector (PRO)", () => {
  it("détecte une chaîne SSRF (HTTP + DNS)", () => {
    const events = [
      evt({ source: "http", timestamp: 1 }),
      evt({ source: "dns", timestamp: 2 }),
    ];

    const chains = ChainDetector.detect(events);

    expect(chains.length).toBe(1);
    expect(chains[0].chain).toBe("ssrf_chain");
    expect(chains[0].events.length).toBe(2);
  });

  it("détecte une chaîne XSS (HTTP + WAF)", () => {
    const events = [
      evt({ source: "http", timestamp: 1 }),
      evt({
        source: "waf",
        timestamp: 2,
        metadata: { triggeredRules: ["xss"] },
      }),
    ];

    const chains = ChainDetector.detect(events);

    expect(chains.some((c) => c.chain === "xss_chain")).toBe(true);
  });

  it("détecte une chaîne SQLi", () => {
    const events = [
      evt({ source: "http", timestamp: 1 }),
      evt({
        source: "waf",
        timestamp: 2,
        metadata: { triggeredRules: ["sqli"] },
      }),
    ];

    const chains = ChainDetector.detect(events);

    expect(chains.some((c) => c.chain === "sqli_chain")).toBe(true);
  });

  it("détecte une chaîne WAF confirmée (score >= 0.9)", () => {
    const events = [
      evt({
        source: "waf",
        metadata: { wafScore: 0.95 },
      }),
    ];

    const chains = ChainDetector.detect(events);

    expect(chains.some((c) => c.chain === "waf_confirmed_chain")).toBe(true);
  });

  it("ne détecte rien si aucun pattern n'est présent", () => {
    const events = [evt({ source: "http" }), evt({ source: "http" })];

    const chains = ChainDetector.detect(events);

    expect(chains.length).toBe(0);
  });
});
