import { createReporter } from "../reporter-factory";
import { JSONReporter } from "../json/JSONReporter";
import { MarkdownReporter } from "../markdown/MarkdownReporter";
import { HTMLReporter } from "../html/HTMLReporter";

describe("ReporterFactory", () => {
  it("retourne un JSONReporter", () => {
    const r = createReporter("json");
    expect(r).toBeInstanceOf(JSONReporter);
  });

  it("retourne un MarkdownReporter", () => {
    const r = createReporter("markdown");
    expect(r).toBeInstanceOf(MarkdownReporter);
  });

  it("retourne un HTMLReporter", () => {
    const r = createReporter("html");
    expect(r).toBeInstanceOf(HTMLReporter);
  });

  it("lève une erreur pour un format inconnu", () => {
    expect(() => createReporter("unknown" as any)).toThrow();
  });
});
