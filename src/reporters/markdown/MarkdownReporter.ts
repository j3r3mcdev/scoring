/**
 * ─────────────────────────────────────────────────────────────
 *  MARKDOWN REPORTER — Version PRO
 *  Génère un rapport Markdown propre, lisible et structuré.
 * ─────────────────────────────────────────────────────────────
 */

import { BaseReporter } from "../base/BaseReporter";
import { ReporterMetadata, ReporterOutput } from "../base/ReporterTypes";
import { Finding, CorrelationChain } from "../../core/scoring-types";

import {
  escapeMarkdown,
  renderTable,
  renderList,
  renderSection,
} from "../../utils/report-utils";
import { sortFindingsBySeverity } from "../../utils/finding-utils";
import { sortChains, chainSummary } from "../../utils/chain-utils";
import { scoreInfo } from "../../utils/score-utils";
import { formatIso } from "../../utils/date-utils";

export class MarkdownReporter extends BaseReporter {
  getName(): string {
    return "markdown";
  }

  getExtension(): string {
    return ".md";
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

    // ─────────────────────────────────────────────────────────────
    // HEADER
    // ─────────────────────────────────────────────────────────────
    let md = `# ${escapeMarkdown(metadata.title ?? "Security Scan Report")}\n\n`;

    md += `**Generated at:** ${generatedAtIso}\n\n`;
    md += `**Target:** ${escapeMarkdown(metadata.target ?? "unknown")}\n\n`;
    md += `**Engine version:** ${escapeMarkdown(metadata.version ?? "1.0.0")}\n\n`;

    // ─────────────────────────────────────────────────────────────
    // SUMMARY
    // ─────────────────────────────────────────────────────────────
    md += renderSection(
      "Summary",
      renderTable(
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
            String(
              preparedFindings.filter((f) => f.severity === "high").length,
            ),
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
      ),
    );

    // ─────────────────────────────────────────────────────────────
    // FINDINGS
    // ─────────────────────────────────────────────────────────────
    const findingsContent = preparedFindings
      .map((f) => {
        const info = scoreInfo(f.score / 100);

        return (
          `### ${escapeMarkdown(f.vulnerability.toUpperCase())}\n\n` +
          `**Severity:** ${escapeMarkdown(f.severity)}\n\n` +
          `**Score:** ${info.normalized} (${escapeMarkdown(info.label)})\n\n` +
          (f.details
            ? `**Details:**\n\n${escapeMarkdown(f.details)}\n\n`
            : "") +
          (f.evidence?.length
            ? `**Evidence:**\n\n${renderList(
                f.evidence.map((e) => escapeMarkdown(String(e))),
              )}\n\n`
            : "") +
          (f.chains?.length
            ? `**Related Chains:**\n\n${renderList(f.chains.map((c) => escapeMarkdown(chainSummary(c))))}\n\n`
            : "")
        );
      })
      .join("\n");

    md += renderSection(
      "Findings",
      findingsContent || "_No findings detected._",
    );

    // ─────────────────────────────────────────────────────────────
    // CHAINS
    // ─────────────────────────────────────────────────────────────
    const chainsContent = preparedChains
      .map((c) => `- ${escapeMarkdown(chainSummary(c))}`)
      .join("\n");

    md += renderSection(
      "Correlation Chains",
      chainsContent || "_No chains detected._",
    );

    // ─────────────────────────────────────────────────────────────
    // OUTPUT
    // ─────────────────────────────────────────────────────────────
    return {
      filename: `report${this.getExtension()}`,
      content: md,
      mime: "text/markdown",
    };
  }

  /**
   * Prépare les données avant génération :
   * - tri des findings par sévérité
   * - tri des chains par confiance
   */
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
