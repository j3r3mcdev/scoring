# @j3r3mcdev/auth-service – Scoring & Reporting Engine

Moteur de scoring, corrélation d'événements et génération de rapports (JSON, Markdown, HTML) destiné aux middlewares de sécurité, WAF applicatifs et pipelines DevSecOps.

Ce module fournit :

- un moteur de scoring normalisé
- un système de corrélation d'événements
- un format unifié pour les findings
- trois reporters professionnels (JSON, Markdown, HTML)
- une factory pour sélectionner dynamiquement un reporter
- des utilitaires de rendu sécurisés (Markdown/HTML)
- une suite de tests complète (74 tests)

---

## Installation

```bash
npm install @j3r3mcdev/auth-service
```

## Fonctionnalités principales

### Scoring

Score normalisé entre 0 et 100

Conversion automatique en labels (Low, Medium, High, Critical)

Informations enrichies via scoreInfo() (label, couleur, niveau de risque)

Tri automatique des findings par sévérité

### Corrélation

Construction de chaînes d'événements (CorrelationChain)

Calcul de confiance (0–1)

Résumés lisibles via chainSummary()

Tri automatique des chaînes par confiance

### Reporting

JSONReporter : export structuré pour CI/CD, ingestion ou stockage

MarkdownReporter : rapport lisible pour développeurs, compatible GitHub/GitLab/VSCode

HTMLReporter : rapport visuel, thème sombre, sections claires

ReporterFactory : sélection dynamique du reporter (json, markdown, html)

Génération de fichiers avec nom, MIME type et contenu final

### Sécurité

Échappement Markdown (escapeMarkdown)

Échappement HTML (escapeHtml)

Rendu sécurisé des tableaux, listes, sections et paragraphes

Protection contre l’injection dans les rapports

### Utilitaires

renderTable, renderList, renderSection (Markdown)

renderHtmlTable, renderHtmlList, renderHtmlParagraph (HTML)

formatIso() pour les dates

sortFindingsBySeverity() et sortChains() pour un rendu cohérent

### Utilisation

Génération d’un rapport

```ts
import { createReporter } from "@j3r3mcdev/auth-service";

const reporter = createReporter("markdown");

const findings = [
  {
    id: "f1",
    vulnerability: "xss",
    severity: "high",
    score: 80,
    details: "Reflected XSS detected",
    evidence: ["<script>alert(1)</script>"],
    chains: [],
  },
];

const chains = [];

const report = reporter.generate(findings, chains);

console.log(report.filename);
console.log(report.mime);
console.log(report.content);
```

## API

createReporter(format)

```ts
const reporter = createReporter("json" | "markdown" | "html");
```

Retourne une instance de :

JSONReporter
MarkdownReporter
HTMLReporter

ReporterOutput

```ts
interface ReporterOutput {
  filename: string;
  content: string;
  mime: string;
}
```

### Reporters

JSONReporter
Format structuré
Idéal pour CI/CD, ingestion, stockage

### MarkdownReporter

Rapport lisible
Compatible GitHub/GitLab/VSCode

### HTMLReporter

Rapport visuel
Thème sombre
Sections claires et structurées

## Tests

La suite de tests couvre :

scoring
corrélation
reporters
factory
échappements Markdown/HTML
rapports vides
intégration complète

Exécution :

```bash
npm run test
Résultat attendu :
```

```bash
Test Suites: 24 passed, 24 total
Tests: 74 passed, 74 total
Structure du projet
```

Licence

MIT
