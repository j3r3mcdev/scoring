/**
 * ─────────────────────────────────────────────────────────────
 *  JSON REPORTER — Version PRO
 *  Génère un rapport JSON structuré, stable et lisible.
 * ─────────────────────────────────────────────────────────────
 */

import { BaseReporter } from "../base/BaseReporter";
import { ReporterMetadata, ReporterOutput } from "../base/ReporterTypes";
import { Finding, CorrelationChain } from "../../core/scoring-types";

import { sortFindingsBySeverity } from "../../utils/finding-utils";
import { sortChains } from "../../utils/chain-utils";
import { scoreInfo } from "../../utils/score-utils";
import { formatIso } from "../../utils/date-utils";

export class JSONReporter extends BaseReporter {
  getName(): string {
    return "json";
  }

  getExtension(): string {
    return ".json";
  }

  generate(
    findings: Finding[],
    chains: CorrelationChain[],
    metadata: ReporterMetadata = {},
  ): ReporterOutput {
    this.validateInput(findings, chains);

    const { findings: preparedFindings, chains: preparedChains } =
      this.prepareData(findings, chains);

    const report = {
      format: "json",
      generatedAt: metadata.generatedAt ?? Date.now(),
      generatedAtIso: formatIso(metadata.generatedAt ?? Date.now()),
      title: metadata.title ?? "Security Scan Report",
      target: metadata.target ?? "unknown",
      version: metadata.version ?? "1.0.0",

      summary: {
        totalFindings: preparedFindings.length,
        totalChains: preparedChains.length,
        severities: {
          critical: preparedFindings.filter((f) => f.severity === "critical")
            .length,
          high: preparedFindings.filter((f) => f.severity === "high").length,
          medium: preparedFindings.filter((f) => f.severity === "medium")
            .length,
          low: preparedFindings.filter((f) => f.severity === "low").length,
        },
      },

      findings: preparedFindings.map((f) => ({
        ...f,
        scoreInfo: scoreInfo(f.score / 100), // ton score brut est 0–100
      })),

      chains: preparedChains.map((c) => ({
        ...c,
        confidenceLabel:
          c.confidence >= 0.9
            ? "very_high"
            : c.confidence >= 0.75
              ? "high"
              : c.confidence >= 0.5
                ? "medium"
                : c.confidence >= 0.25
                  ? "low"
                  : "very_low",
      })),
    };

    return {
      filename: `report${this.getExtension()}`,
      content: JSON.stringify(report, null, 2),
      mime: "application/json",
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
