/**
 * ─────────────────────────────────────────────────────────────
 *  BASE REPORTER — Version PRO
 *  Classe abstraite pour tous les reporters (JSON, MD, HTML)
 * ─────────────────────────────────────────────────────────────
 */

import { Finding, CorrelationChain } from "../../core/scoring-types";
import { ReporterMetadata, ReporterOutput } from "./ReporterTypes";

export abstract class BaseReporter {
  /**
   * Nom du reporter (ex: "json", "markdown", "html").
   */
  abstract getName(): string;

  /**
   * Extension du fichier généré (ex: ".json", ".md", ".html").
   */
  abstract getExtension(): string;

  /**
   * Génère le rapport final.
   */
  abstract generate(
    findings: Finding[],
    chains: CorrelationChain[],
    metadata?: ReporterMetadata,
  ): ReporterOutput;

  /**
   * Vérifie que les données d'entrée sont valides.
   */
  protected validateInput(
    findings: Finding[],
    chains: CorrelationChain[],
  ): void {
    if (!Array.isArray(findings)) {
      throw new Error("findings must be an array");
    }
    if (!Array.isArray(chains)) {
      throw new Error("chains must be an array");
    }
  }

  /**
   * Prépare les données avant génération (tri, normalisation…).
   * Peut être overridé par les reporters avancés.
   */
  protected prepareData(
    findings: Finding[],
    chains: CorrelationChain[],
  ): { findings: Finding[]; chains: CorrelationChain[] } {
    return { findings, chains };
  }
}
