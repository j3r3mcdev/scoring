import { NormalizedEvent } from "../core/scoring-types";
import { HttpNormalizer } from "./http.normalizer";
import { DnsNormalizer } from "./dns.normalizer";
import { WafNormalizer } from "./waf.normalizer";

/**
 * Type générique pour un normalizer.
 * Tous les normalizers doivent exposer une méthode static normalize().
 */
export type Normalizer = {
  normalize: (raw: any) => NormalizedEvent;
};

/**
 * Registry simple des normalizers disponibles.
 * Peut être étendu plus tard (scan, oast, smtp…)
 */
export const Normalizers = {
  http: HttpNormalizer,
  dns: DnsNormalizer,
  waf: WafNormalizer,
} as const;

/**
 * Helper : normalisation dynamique selon la source.
 */
export function normalizeEvent(
  source: keyof typeof Normalizers,
  raw: any,
): NormalizedEvent {
  return Normalizers[source].normalize(raw);
}

export { HttpNormalizer, DnsNormalizer, WafNormalizer };
