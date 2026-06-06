/**
 * ─────────────────────────────────────────────────────────────
 *  HTML REPORTER — Version PRO
 *  Génère un rapport HTML structuré, lisible et sécurisé.
 * ─────────────────────────────────────────────────────────────
 */

import { BaseReporter } from "../base/BaseReporter";
import { ReporterMetadata, ReporterOutput } from "../base/ReporterTypes";
import { Finding, CorrelationChain } from "../../core/scoring-types";

import {
  escapeHtml,
  renderHtmlTable,
  renderHtmlList,
  renderHtmlParagraph,
} from "../../utils/report-utils";
import { sortFindingsBySeverity } from "../../utils/finding-utils";
import { sortChains, chainSummary } from "../../utils/chain-utils";
import { scoreInfo } from "../../utils/score-utils";
import { formatIso } from "../../utils/date-utils";

function severityClass(severity: Finding["severity"]): string {
  switch (severity) {
    case "critical":
      return "sev-critical";
    case "high":
      return "sev-high";
    case "medium":
      return "sev-medium";
    case "low":
      return "sev-low";
    default:
      return "sev-unknown";
  }
}

export class HTMLReporter extends BaseReporter {
  getName(): string {
    return "html";
  }

  getExtension(): string {
    return ".html";
  }

  generate(
    findings: Finding[],
    chains: CorrelationChain[],
    metadata: ReporterMetadata = {},
  ): ReporterOutput {
    this.validateInput(findings, chains);

    const { findings: preparedFindings, chains: preparedChains } =
      this.prepareData(findings, chains);

    const generatedAt = metadata.generatedAt ?? Date.now();
    const generatedAtIso = formatIso(generatedAt);

    const title = metadata.title ?? "Security Scan Report";

    const summaryTable = renderHtmlTable(
      ["Metric", "Value"],
      [
        ["Total Findings", String(preparedFindings.length)],
        ["Total Chains", String(preparedChains.length)],
        [
          "Critical",
          String(
            preparedFindings.filter((f) => f.severity === "critical").length,
          ),
        ],
        [
          "High",
          String(preparedFindings.filter((f) => f.severity === "high").length),
        ],
        [
          "Medium",
          String(
            preparedFindings.filter((f) => f.severity === "medium").length,
          ),
        ],
        [
          "Low",
          String(preparedFindings.filter((f) => f.severity === "low").length),
        ],
      ],
    );

    const findingsHtml =
      preparedFindings.length === 0
        ? renderHtmlParagraph("_No findings detected._")
        : preparedFindings
            .map((f) => {
              const info = scoreInfo(f.score / 100);

              const evidenceHtml =
                f.evidence && f.evidence.length
                  ? `<h4>Evidence</h4>${renderHtmlList(
                      f.evidence.map((e) => String(e)),
                    )}`
                  : "";

              const chainsHtml =
                f.chains && f.chains.length
                  ? `<h4>Related Chains</h4>${renderHtmlList(
                      f.chains.map((c) => chainSummary(c)),
                    )}`
                  : "";

              return `
<section class="finding ${severityClass(f.severity)}">
  <h3>${escapeHtml(f.vulnerability.toUpperCase())}</h3>
  <p><strong>Severity:</strong> ${escapeHtml(f.severity)}</p>
  <p><strong>Score:</strong> ${info.normalized} (${escapeHtml(info.label)})</p>
  ${f.details ? `<h4>Details</h4>${renderHtmlParagraph(f.details)}` : ""}
  ${evidenceHtml}
  ${chainsHtml}
</section>`;
            })
            .join("\n");

    const chainsHtml =
      preparedChains.length === 0
        ? renderHtmlParagraph("_No chains detected._")
        : renderHtmlList(preparedChains.map((c) => chainSummary(c)));

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)}</title>
  <style>
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      margin: 0;
      padding: 2rem;
      background: #0b1020;
      color: #f5f7ff;
    }
    h1, h2, h3, h4 {
      color: #ffffff;
    }
    a {
      color: #7aa2ff;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 1rem 0;
      background: #11162a;
    }
    th, td {
      border: 1px solid #252b45;
      padding: 0.5rem 0.75rem;
      text-align: left;
    }
    th {
      background: #181e36;
      font-weight: 600;
    }
    tr:nth-child(even) td {
      background: #101528;
    }
    .finding {
      border: 1px solid #252b45;
      border-left-width: 4px;
      padding: 1rem;
      margin: 1rem 0;
      background: #11162a;
      border-radius: 4px;
    }
    .sev-critical { border-left-color: #ff4b5c; }
    .sev-high { border-left-color: #ff9f43; }
    .sev-medium { border-left-color: #feca57; }
    .sev-low { border-left-color: #1dd1a1; }
    ul {
      padding-left: 1.5rem;
    }
    code {
      font-family: "Fira Code", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      background: #181e36;
      padding: 0.1rem 0.25rem;
      border-radius: 3px;
    }
    .meta {
      margin-bottom: 1.5rem;
      font-size: 0.95rem;
      color: #c3c8e8;
    }
    .section {
      margin-top: 2rem;
    }
  </style>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>

  <div class="meta">
    <p><strong>Generated at:</strong> ${escapeHtml(generatedAtIso)}</p>
    <p><strong>Target:</strong> ${escapeHtml(metadata.target ?? "unknown")}</p>
    <p><strong>Engine version:</strong> ${escapeHtml(
      metadata.version ?? "1.0.0",
    )}</p>
  </div>

  <section class="section">
    <h2>Summary</h2>
    ${summaryTable}
  </section>

  <section class="section">
    <h2>Findings</h2>
    ${findingsHtml}
  </section>

  <section class="section">
    <h2>Correlation Chains</h2>
    ${chainsHtml}
  </section>
</body>
</html>`;

    return {
      filename: `report${this.getExtension()}`,
      content: html,
      mime: "text/html",
    };
  }

  protected prepareData(
    findings: Finding[],
    chains: CorrelationChain[],
  ): { findings: Finding[]; chains: CorrelationChain[] } {
    return {
      findings: sortFindingsBySeverity(findings),
      chains: sortChains(chains),
    };
  }
}
