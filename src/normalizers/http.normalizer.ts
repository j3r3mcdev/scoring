import { NormalizedEvent } from "../core/scoring-types";
import crypto from "crypto";

/**
 * ─────────────────────────────────────────────────────────────
 *  HTTP NORMALIZER — Transforme une requête HTTP brute
 *  en NormalizedEvent standardisé pour le moteur de scoring.
 * ─────────────────────────────────────────────────────────────
 */
export class HttpNormalizer {
  static normalize(req: any): NormalizedEvent {
    return {
      id: crypto.randomUUID(),
      source: "http",
      timestamp: Date.now(),

      payload: HttpNormalizer.extractPayload(req),

      metadata: {
        method: req.method ?? "UNKNOWN",
        path: req.url ?? "/",
        headers: req.headers ?? {},
        ip: HttpNormalizer.extractIp(req),
        query: req.query ?? {},
        body: req.body ?? null,
      },
    };
  }

  /**
   * Extraction du payload utile pour les règles (RCE, LFI, SSRF…)
   */
  private static extractPayload(req: any): string {
    const body =
      typeof req.body === "string" ? req.body : JSON.stringify(req.body ?? "");

    const query =
      typeof req.query === "string"
        ? req.query
        : JSON.stringify(req.query ?? "");

    return `${req.method} ${req.url} | query=${query} | body=${body}`;
  }

  /**
   * Extraction IP (X-Forwarded-For > socket)
   */
  private static extractIp(req: any): string {
    return (
      req.headers?.["x-forwarded-for"] || req.socket?.remoteAddress || "unknown"
    );
  }
}
