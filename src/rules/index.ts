/**
 * ─────────────────────────────────────────────────────────────
 *  RULES AUTO-LOAD — Version avancée et stable
 *  Charge automatiquement toutes les règles du moteur.
 * ─────────────────────────────────────────────────────────────
 */

import { RuleRegistry } from "./rule-registry";

// Import de toutes les règles individuelles
import { XssRule } from "./xss.rules";
import { SqliRule } from "./sqli.rules";
import { SsrfRule } from "./ssrf.rules";
import { LfiRule } from "./lfi.rule";
import { PathTraversalRule } from "./path-transversal.rule";
import { DnsRule } from "./dns.rules";
import { HttpRule } from "./http.rules";
import { WafRule } from "./waf.rules";
import { RceRule } from "./rce.rules";

// Enregistrement global
RuleRegistry.registerMany([
  new XssRule(),
  new SqliRule(),
  new SsrfRule(),
  new LfiRule(),
  new PathTraversalRule(),
  new DnsRule(),
  new HttpRule(),
  new WafRule(),
  new RceRule(),
]);

// Export optionnel (utile pour debug ou tests)
export const loadedRules = RuleRegistry.getAll();
