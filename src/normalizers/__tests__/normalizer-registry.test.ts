import { normalizeEvent, Normalizers } from "../index";
import { HttpNormalizer } from "../http.normalizer";
import { DnsNormalizer } from "../dns.normalizer";
import { WafNormalizer } from "../waf.normalizer";

describe("NormalizerRegistry (PRO)", () => {
  // ─────────────────────────────────────────────────────────────
  //  Vérifie que le registry expose bien les normalizers
  // ─────────────────────────────────────────────────────────────
  it("expose correctement les normalizers", () => {
    expect(Normalizers.http).toBe(HttpNormalizer);
    expect(Normalizers.dns).toBe(DnsNormalizer);
    expect(Normalizers.waf).toBe(WafNormalizer);
  });

  // ─────────────────────────────────────────────────────────────
  //  Vérifie le dispatch dynamique pour HTTP
  // ─────────────────────────────────────────────────────────────
  it("normalizeEvent('http') utilise HttpNormalizer", () => {
    const spy = jest.spyOn(HttpNormalizer, "normalize").mockReturnValue({
      id: "123",
      source: "http",
      timestamp: 1,
      payload: "test",
      metadata: {},
    });

    const raw = { method: "GET", url: "/test" };
    const evt = normalizeEvent("http", raw);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(raw);
    expect(evt.source).toBe("http");

    spy.mockRestore();
  });

  // ─────────────────────────────────────────────────────────────
  //  Vérifie le dispatch dynamique pour DNS
  // ─────────────────────────────────────────────────────────────
  it("normalizeEvent('dns') utilise DnsNormalizer", () => {
    const spy = jest.spyOn(DnsNormalizer, "normalize").mockReturnValue({
      id: "456",
      source: "dns",
      timestamp: 1,
      payload: "example.com",
      metadata: {},
    });

    const raw = { query: "example.com" };
    const evt = normalizeEvent("dns", raw);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(raw);
    expect(evt.source).toBe("dns");

    spy.mockRestore();
  });

  // ─────────────────────────────────────────────────────────────
  //  Vérifie le dispatch dynamique pour WAF
  // ─────────────────────────────────────────────────────────────
  it("normalizeEvent('waf') utilise WafNormalizer", () => {
    const spy = jest.spyOn(WafNormalizer, "normalize").mockReturnValue({
      id: "789",
      source: "waf",
      timestamp: 1,
      payload: "WAF score: 0.9",
      metadata: {},
    });

    const raw = { score: 0.9 };
    const evt = normalizeEvent("waf", raw);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(raw);
    expect(evt.source).toBe("waf");

    spy.mockRestore();
  });

  // ─────────────────────────────────────────────────────────────
  //  Vérifie qu'une source inconnue provoque une erreur claire
  // ─────────────────────────────────────────────────────────────
  it("lance une erreur si la source est inconnue", () => {
    // @ts-expect-error volontaire : test d'erreur runtime
    expect(() => normalizeEvent("unknown", {})).toThrow();
  });
});
