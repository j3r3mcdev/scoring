import { NormalizedEvent } from "../core/scoring-types";
import { EventGrouper, EventGroup } from "./event-grouper";
import { ChainDetector, ChainDetectionResult } from "./chain-detector";

export interface CorrelationResult {
  groups: EventGroup[];
  chains: ChainDetectionResult[];
}

/**
 * ─────────────────────────────────────────────────────────────
 *  CORRELATOR — Orchestrateur de la corrélation
 *  1. Regroupe les événements (EventGrouper)
 *  2. Détecte les chaînes d’attaque (ChainDetector)
 * ─────────────────────────────────────────────────────────────
 */
export class Correlator {
  static correlate(events: NormalizedEvent[]): CorrelationResult {
    if (!Array.isArray(events)) {
      throw new Error("Correlator: events must be an array");
    }

    // 1. Groupement logique (par IP par défaut)
    const groups = EventGrouper.groupBy(events);

    // 2. Détection des chaînes dans chaque groupe
    const chains: ChainDetectionResult[] = [];

    for (const group of groups) {
      const detected = ChainDetector.detect(group.events);
      chains.push(...detected);
    }

    return {
      groups,
      chains,
    };
  }
}
