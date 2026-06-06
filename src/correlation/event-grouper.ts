import { NormalizedEvent } from "../core/scoring-types";

export interface EventGroup {
  key: string;
  events: NormalizedEvent[];
}

/**
 * ─────────────────────────────────────────────────────────────
 *  EVENT GROUPER — Regroupe les événements par contexte
 *  (IP, sessionId, requestId, etc.)
 * ─────────────────────────────────────────────────────────────
 */
export class EventGrouper {
  /**
   * Regroupe les événements selon une clé dynamique.
   * Par défaut : groupement par IP.
   */
  static groupBy(
    events: NormalizedEvent[],
    selector: (evt: NormalizedEvent) => string = EventGrouper.defaultSelector,
  ): EventGroup[] {
    const map = new Map<string, NormalizedEvent[]>();

    for (const evt of events) {
      const key = selector(evt) || "unknown";

      if (!map.has(key)) {
        map.set(key, []);
      }

      map.get(key)!.push(evt);
    }

    return Array.from(map.entries()).map(([key, events]) => ({
      key,
      events: events.sort((a, b) => a.timestamp - b.timestamp),
    }));
  }

  /**
   * Sélecteur par défaut : groupement par IP.
   */
  private static defaultSelector(evt: NormalizedEvent): string {
    return evt.metadata?.ip ?? "unknown";
  }
}
