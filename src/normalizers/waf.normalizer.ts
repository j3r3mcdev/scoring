import { NormalizedEvent } from "../core/scoring-types";
import crypto from "crypto";

/**
 * ─────────────────────────────────────────────────────────────
 *  WAF NORMALIZER — Transforme un signal WAF brut
 *  en NormalizedEvent standardisé pour le moteur de scoring.
 * ─────────────────────────────────────────────────────────────
 */
export class WafNormalizer {
  static normalize(raw: any): NormalizedEvent {
    return {
      id: crypto.randomUUID(),
      source: "waf",
      timestamp: Date.now(),

      // Le payload est volontairement simple : le score ou le message
      payload: WafNormalizer.extractPayload(raw),

      metadata: {
        wafScore: raw.score ?? 0,
        triggeredRules: raw.triggeredRules ?? [],
        ip: raw.ip ?? "unknown",
        path: raw.path ?? null,
        method: raw.method ?? null,
        raw: raw,
      },
    };
  }

  /**
   * Le payload doit être une string exploitable par les règles.
   */
  private static extractPayload(raw: any): string {
    if (typeof raw.message === "string") return raw.message;
    if (typeof raw.score === "number") return `WAF score: ${raw.score}`;
    return "WAF event";
  }
}
