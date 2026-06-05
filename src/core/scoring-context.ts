import {
  NormalizedEvent,
  CorrelationChain,
  ScoringContext,
} from "./scoring-types";

/**
 * ─────────────────────────────────────────────────────────────
 *  SCORING CONTEXT — Version avancée
 *  Construit un contexte propre, stable et extensible.
 * ─────────────────────────────────────────────────────────────
 */

export class ContextBuilder {
  private events: NormalizedEvent[] = [];
  private chains: CorrelationChain[] = [];
  private metadata: Record<string, any> = {};

  /**
   * Ajoute un événement normalisé au contexte.
   */
  addEvent(event: NormalizedEvent): this {
    this.events.push(event);
    return this;
  }

  /**
   * Ajoute plusieurs événements d'un coup.
   */
  addEvents(events: NormalizedEvent[]): this {
    this.events.push(...events);
    return this;
  }

  /**
   * Ajoute une chaîne de corrélation.
   */
  addChain(chain: CorrelationChain): this {
    this.chains.push(chain);
    return this;
  }

  /**
   * Ajoute plusieurs chaînes.
   */
  addChains(chains: CorrelationChain[]): this {
    this.chains.push(...chains);
    return this;
  }

  /**
   * Ajoute des métadonnées arbitraires (ex: URL cible, IP, user-agent…)
   */
  setMetadata(key: string, value: any): this {
    this.metadata[key] = value;
    return this;
  }

  /**
   * Construit le contexte final.
   */
  build(): ScoringContext {
    return {
      events: [...this.events],
      chains: [...this.chains],
      metadata: { ...this.metadata },
    };
  }
}

/**
 * Helper simple pour créer un contexte vide.
 */
export function createEmptyContext(): ScoringContext {
  return {
    events: [],
    chains: [],
    metadata: {},
  };
}
