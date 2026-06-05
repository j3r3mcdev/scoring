import { NormalizedEvent } from "../core/scoring-types";
import crypto from "crypto";

/**
 * ─────────────────────────────────────────────────────────────
 *  DNS NORMALIZER — Transforme un événement DNS brut
 *  en NormalizedEvent standardisé pour le moteur de scoring.
 * ─────────────────────────────────────────────────────────────
 */
export class DnsNormalizer {
  static normalize(raw: any): NormalizedEvent {
    return {
      id: crypto.randomUUID(),
      source: "dns",
      timestamp: Date.now(),

      // Payload utile pour les règles DNS / SSRF / Correlation
      payload: raw.query ?? "",

      metadata: {
        ip: raw.ip ?? "unknown",
        query: raw.query ?? "",
        recordType: raw.type ?? "A",
        raw: raw.raw ?? null,
      },
    };
  }
}
