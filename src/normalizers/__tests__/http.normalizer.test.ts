import { HttpNormalizer } from "../http.normalizer";

describe("HttpNormalizer (PRO)", () => {
  it("normalise correctement une requête HTTP complète", () => {
    const raw = {
      method: "POST",
      url: "/login",
      headers: { "x-forwarded-for": "1.2.3.4", host: "example.com" },
      query: { user: "admin" },
      body: { pass: "123" },
      socket: { remoteAddress: "5.6.7.8" },
    };

    const evt = HttpNormalizer.normalize(raw);

    expect(evt.source).toBe("http");
    expect(typeof evt.id).toBe("string");
    expect(typeof evt.timestamp).toBe("number");

    expect(evt.payload).toContain("POST /login");
    expect(evt.metadata.method).toBe("POST");
    expect(evt.metadata.path).toBe("/login");
    expect(evt.metadata.headers.host).toBe("example.com");
    expect(evt.metadata.ip).toBe("1.2.3.4");
  });

  it("gère une requête sans headers ni body", () => {
    const raw = { method: "GET", url: "/test" };
    const evt = HttpNormalizer.normalize(raw);

    expect(evt.metadata.headers).toEqual({});
    expect(evt.metadata.body).toBe(null);
  });

  it("gère une requête avec body string", () => {
    const raw = { method: "POST", url: "/x", body: "raw-body" };
    const evt = HttpNormalizer.normalize(raw);

    expect(evt.payload).toContain("raw-body");
  });

  it("fallback IP si aucune info n'est fournie", () => {
    const raw = { method: "GET", url: "/" };
    const evt = HttpNormalizer.normalize(raw);

    expect(evt.metadata.ip).toBe("unknown");
  });

  it("gère un input vide sans planter", () => {
    const evt = HttpNormalizer.normalize({});
    expect(evt.source).toBe("http");
    expect(evt.metadata.method).toBe("UNKNOWN");
    expect(evt.metadata.path).toBe("/");
  });
});
