/**
 * ─────────────────────────────────────────────────────────────
 *  SCORING TYPES — Version avancée et stable
 *  Source de vérité unique pour tout le moteur.
 * ─────────────────────────────────────────────────────────────
 */

//
// 1. Vulnérabilités supportées
//
export type Vulnerability =
  | "ssrf"
  | "xss"
  | "sqli"
  | "dns"
  | "http"
  | "waf"
  | "rce"
  | "lfi"
  | "path_traversal";

//
// 2. Sévérité standardisée
//
export type Severity = "low" | "medium" | "high" | "critical";

//
// 3. Source d’un événement normalisé
//
export type EventSource = "oast" | "scan" | "waf";

//
// 4. Événement normalisé (format unique pour tout le moteur)
//
export interface NormalizedEvent {
  id: string; // UUID
  source: EventSource;
  protocol?: string; // http, dns, smtp, websocket, etc.
  timestamp: number;

  // Payload brut ou transformé
  payload?: string;

  // Données additionnelles (headers, body, metadata…)
  metadata: Record<string, any>;
}

//
// 5. Résultat d’une règle individuelle
//
export interface RuleFinding {
  ruleId: string;
  vulnerability: Vulnerability;
  score: number; // score brut (0 → 1)
  severity: Severity;
  details?: string;
}

//
// 6. Chaîne de corrélation (ex : DNS → HTTP = SSRF)
//
export interface CorrelationChain {
  id: string;
  type: Vulnerability;
  events: NormalizedEvent[];
  confidence: number; // 0 → 1
}

//
// 7. Résultat final d’une vulnérabilité consolidée
//
export interface Finding {
  id: string;
  vulnerability: Vulnerability;
  severity: Severity;
  score: number; // score final pondéré
  evidence: NormalizedEvent[];
  chains?: CorrelationChain[];
  details?: string;
}

//
// 8. Interface de base pour toutes les règles
//
export interface Rule {
  id: string;
  name: string;
  description?: string;

  /**
   * Vérifie si la règle doit s’appliquer au contexte.
   */
  applies(context: ScoringContext): boolean;

  /**
   * Retourne un ou plusieurs findings bruts.
   */
  execute(context: ScoringContext): RuleFinding[];
}

//
// 9. Contexte minimal pour les règles et le moteur
//
export interface ScoringContext {
  events: NormalizedEvent[];
  chains: CorrelationChain[];
  metadata?: Record<string, any>;
}

//
// 10. Résultat final du moteur de scoring
//
export interface ScoringResult {
  score: number; // score global (0–100)
  severity: Severity;
  findings: Finding[];
  chains: CorrelationChain[];
  timestamp: number;

  /**
   * Métadonnées additionnelles (optionnelles).
   * Ex : cible, IP, user-agent, contexte d'analyse…
   */
  metadata?: Record<string, any>;
}
