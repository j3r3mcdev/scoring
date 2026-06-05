import {
  RuleFinding,
  Finding,
  Severity,
  ScoringContext,
  ScoringResult,
} from "./scoring-types";

import { RuleRegistry } from "../rules/rule-registry";
import { createEmptyResult } from "./scoring-result";

/**
 * ─────────────────────────────────────────────────────────────
 *  SCORING ENGINE — Version avancée
 * ─────────────────────────────────────────────────────────────
 */
export class ScoringEngine {
  run(context: ScoringContext): ScoringResult {
    const rules = RuleRegistry.getAll();
    const rawFindings: RuleFinding[] = [];

    // 1. Exécution des règles
    for (const rule of rules) {
      if (rule.applies(context)) {
        const results = rule.execute(context);
        rawFindings.push(...results);
      }
    }

    // 2. Aucun finding → résultat vide propre
    if (rawFindings.length === 0) {
      return {
        ...createEmptyResult(),
        chains: context.chains,
        metadata: context.metadata,
      };
    }

    // 3. Fusion des findings
    const consolidated = this.consolidateFindings(rawFindings, context);

    // 4. Score global
    const score = this.computeGlobalScore(consolidated);

    // 5. Sévérité globale
    const severity = this.computeGlobalSeverity(consolidated);

    // 6. Résultat final
    return {
      score,
      severity,
      findings: consolidated,
      chains: context.chains,
      timestamp: Date.now(),
      metadata: context.metadata,
    };
  }

  private consolidateFindings(
    raw: RuleFinding[],
    context: ScoringContext,
  ): Finding[] {
    const map = new Map<string, Finding>();

    for (const f of raw) {
      if (!map.has(f.vulnerability)) {
        map.set(f.vulnerability, {
          id: f.vulnerability,
          vulnerability: f.vulnerability,
          severity: f.severity,
          score: f.score,
          evidence: [],
          chains: [],
          details: f.details,
        });
      } else {
        const existing = map.get(f.vulnerability)!;

        existing.score = Math.max(existing.score, f.score);
        existing.severity = this.maxSeverity(existing.severity, f.severity);

        if (f.details) {
          existing.details = (existing.details ?? "") + "\n" + f.details;
        }
      }
    }

    // Ajout des events + chains filtrées
    for (const finding of map.values()) {
      finding.evidence = context.events;
      finding.chains = context.chains.filter(
        (c) => c.type === finding.vulnerability,
      );
    }

    return [...map.values()];
  }

  private computeGlobalScore(findings: Finding[]): number {
    const total = findings.reduce((acc, f) => acc + f.score, 0);
    return Math.round((total / findings.length) * 100);
  }

  private computeGlobalSeverity(findings: Finding[]): Severity {
    return findings
      .map((f) => f.severity)
      .sort((a, b) => this.severityWeight(b) - this.severityWeight(a))[0];
  }

  private maxSeverity(a: Severity, b: Severity): Severity {
    return this.severityWeight(a) >= this.severityWeight(b) ? a : b;
  }

  private severityWeight(s: Severity): number {
    switch (s) {
      case "low":
        return 1;
      case "medium":
        return 2;
      case "high":
        return 3;
      case "critical":
        return 4;
    }
  }
}
