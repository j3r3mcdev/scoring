import { NormalizedEvent } from "../core/scoring-types";

export type AttackChain =
  | "ssrf_chain"
  | "xss_chain"
  | "sqli_chain"
  | "lfi_chain"
  | "path_traversal_chain"
  | "waf_confirmed_chain";

export interface ChainDetectionResult {
  chain: AttackChain;
  events: NormalizedEvent[];
}

/**
 * ─────────────────────────────────────────────────────────────
 *  CHAIN DETECTOR — Détecte les chaînes d’attaque multi‑événements
 *  Exemple : HTTP suspect → DNS interne → WAF → SSRF confirmé
 * ─────────────────────────────────────────────────────────────
 */
export class ChainDetector {
  /**
   * Analyse une liste d'événements normalisés et détecte
   * les chaînes d’attaque connues.
   */
  static detect(events: NormalizedEvent[]): ChainDetectionResult[] {
    const results: ChainDetectionResult[] = [];

    // Tri chronologique (important pour les chaînes)
    const sorted = [...events].sort((a, b) => a.timestamp - b.timestamp);

    // ─────────────────────────────────────────────────────────────
    // 1. Chaîne SSRF : HTTP → DNS → WAF
    // ─────────────────────────────────────────────────────────────
    const http = sorted.find((e) => e.source === "http");
    const dns = sorted.find((e) => e.source === "dns");
    const waf = sorted.find((e) => e.source === "waf");

    if (http && dns) {
      results.push({
        chain: "ssrf_chain",
        events: [http, dns, ...(waf ? [waf] : [])],
      });
    }

    // ─────────────────────────────────────────────────────────────
    // 2. Chaîne XSS : HTTP → WAF
    // ─────────────────────────────────────────────────────────────
    if (http && waf && waf.metadata.triggeredRules?.includes("xss")) {
      results.push({
        chain: "xss_chain",
        events: [http, waf],
      });
    }

    // ─────────────────────────────────────────────────────────────
    // 3. Chaîne SQLi : HTTP → WAF
    // ─────────────────────────────────────────────────────────────
    if (http && waf && waf.metadata.triggeredRules?.includes("sqli")) {
      results.push({
        chain: "sqli_chain",
        events: [http, waf],
      });
    }

    // ─────────────────────────────────────────────────────────────
    // 4. Chaîne LFI : HTTP → WAF
    // ─────────────────────────────────────────────────────────────
    if (http && waf && waf.metadata.triggeredRules?.includes("lfi")) {
      results.push({
        chain: "lfi_chain",
        events: [http, waf],
      });
    }

    // ─────────────────────────────────────────────────────────────
    // 5. Chaîne Path Traversal : HTTP → WAF
    // ─────────────────────────────────────────────────────────────
    if (http && waf && waf.metadata.triggeredRules?.includes("path")) {
      results.push({
        chain: "path_traversal_chain",
        events: [http, waf],
      });
    }

    // ─────────────────────────────────────────────────────────────
    // 6. Chaîne WAF Confirmed : WAF seul
    // ─────────────────────────────────────────────────────────────
    if (waf && waf.metadata.wafScore >= 0.9) {
      results.push({
        chain: "waf_confirmed_chain",
        events: [waf],
      });
    }

    return results;
  }
}
