import { Correlator } from "../correlator";
import { NormalizedEvent } from "../../core/scoring-types";

const evt = (partial: Partial<NormalizedEvent>): NormalizedEvent => ({
  id: partial.id ?? "id",
  source: partial.source ?? "http",
  timestamp: partial.timestamp ?? Date.now(),
  payload: partial.payload ?? "",
  metadata: partial.metadata ?? {},
});

describe("Correlator (PRO)", () => {
  it("retourne des groupes et des chaînes", () => {
    const events = [
      evt({ source: "http", timestamp: 1, metadata: { ip: "1.1.1.1" } }),
      evt({ source: "dns", timestamp: 2, metadata: { ip: "1.1.1.1" } }),
    ];

    const result = Correlator.correlate(events);

    expect(result.groups.length).toBe(1);
    expect(result.chains.length).toBe(1);
    expect(result.chains[0].chain).toBe("ssrf_chain");
  });

  it("gère plusieurs groupes distincts", () => {
    const events = [
      evt({ metadata: { ip: "A" } }),
      evt({ metadata: { ip: "B" } }),
    ];

    const result = Correlator.correlate(events);

    expect(result.groups.length).toBe(2);
  });

  it("lance une erreur si l'entrée n'est pas un tableau", () => {
    // @ts-expect-error test volontaire
    expect(() => Correlator.correlate(null)).toThrow();
  });

  it("ne détecte aucune chaîne si aucun pattern n'est présent", () => {
    const events = [evt({ source: "http" }), evt({ source: "http" })];

    const result = Correlator.correlate(events);

    expect(result.chains.length).toBe(0);
  });
});
