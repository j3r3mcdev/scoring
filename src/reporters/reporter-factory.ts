/**
 * ─────────────────────────────────────────────────────────────
 *  REPORTER FACTORY
 *  Crée dynamiquement un reporter selon le format demandé.
 * ─────────────────────────────────────────────────────────────
 */

import { ReporterFormat } from "./base/ReporterTypes";
import { BaseReporter } from "./base/BaseReporter";

import { JSONReporter } from "./json/JSONReporter";
import { MarkdownReporter } from "./markdown/MarkdownReporter";
import { HTMLReporter } from "./html/HTMLReporter";

export function createReporter(format: ReporterFormat): BaseReporter {
  switch (format) {
    case "json":
      return new JSONReporter();

    case "markdown":
      return new MarkdownReporter();

    case "html":
      return new HTMLReporter();

    default:
      throw new Error(`Unknown reporter format: ${format}`);
  }
}
