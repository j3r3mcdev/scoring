import { EventGrouper } from "../event-grouper";
import { NormalizedEvent } from "../../core/scoring-types";

const evt = (partial: Partial<NormalizedEvent>): NormalizedEvent => ({
  id: partial.id ?? "id",
  source: partial.source ?? "http",
  timestamp: partial.timestamp ?? Date.now(),
  payload: partial.payload ?? "",
  metadata: partial.metadata ?? {},
});

describe("EventGrouper (PRO)", () => {
  it("groupe les événements par IP (par défaut)", () => {
    const events = [
      evt({ metadata: { ip: "1.1.1.1" } }),
      evt({ metadata: { ip: "1.1.1.1" } }),
      evt({ metadata: { ip: "2.2.2.2" } }),
    ];

    const groups = EventGrouper.groupBy(events);

    expect(groups.length).toBe(2);
    expect(groups.find((g) => g.key === "1.1.1.1")!.events.length).toBe(2);
    expect(groups.find((g) => g.key === "2.2.2.2")!.events.length).toBe(1);
  });

  it("groupe selon un sélecteur personnalisé", () => {
    const events = [
      evt({ metadata: { sessionId: "A" } }),
      evt({ metadata: { sessionId: "B" } }),
      evt({ metadata: { sessionId: "A" } }),
    ];

    const groups = EventGrouper.groupBy(events, (e) => e.metadata.sessionId);

    expect(groups.length).toBe(2);
    expect(groups.find((g) => g.key === "A")!.events.length).toBe(2);
  });

  it("gère les événements sans clé (fallback 'unknown')", () => {
    const events = [evt({ metadata: {} }), evt({ metadata: {} })];

    const groups = EventGrouper.groupBy(events);

    expect(groups.length).toBe(1);
    expect(groups[0].key).toBe("unknown");
    expect(groups[0].events.length).toBe(2);
  });

  it("tri les événements dans chaque groupe", () => {
    const events = [
      evt({ timestamp: 3, metadata: { ip: "1.1.1.1" } }),
      evt({ timestamp: 1, metadata: { ip: "1.1.1.1" } }),
      evt({ timestamp: 2, metadata: { ip: "1.1.1.1" } }),
    ];

    const groups = EventGrouper.groupBy(events);
    const timestamps = groups[0].events.map((e) => e.timestamp);

    expect(timestamps).toEqual([1, 2, 3]);
  });
});
