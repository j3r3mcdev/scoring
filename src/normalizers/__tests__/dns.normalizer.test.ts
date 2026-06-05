import { DnsNormalizer } from "../dns.normalizer";

describe("DnsNormalizer (PRO)", () => {
  it("normalise un événement DNS complet", () => {
    const raw = {
      ip: "10.0.0.5",
      query: "internal.service.local",
      type: "A",
      raw: { packet: true },
    };

    const evt = DnsNormalizer.normalize(raw);

    expect(evt.source).toBe("dns");
    expect(evt.payload).toBe("internal.service.local");
    expect(evt.metadata.ip).toBe("10.0.0.5");
    expect(evt.metadata.recordType).toBe("A");
  });

  it("gère un événement DNS minimal", () => {
    const raw = { query: "example.com" };
    const evt = DnsNormalizer.normalize(raw);

    expect(evt.metadata.ip).toBe("unknown");
    expect(evt.metadata.recordType).toBe("A");
  });

  it("gère un événement DNS sans query", () => {
    const evt = DnsNormalizer.normalize({});
    expect(evt.payload).toBe("");
    expect(evt.metadata.query).toBe("");
  });

  it("gère un événement DNS avec type inconnu", () => {
    const raw = { query: "test", type: "AAAAA" };
    const evt = DnsNormalizer.normalize(raw);

    expect(evt.metadata.recordType).toBe("AAAAA");
  });
});
