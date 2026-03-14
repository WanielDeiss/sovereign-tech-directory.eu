---
name: data-model
description: Tool-Datenmodell, YAML-Validierung und Sovereignty Score für sovereign-tech-directory.eu
---

# Datenmodell

## Pflichtfelder für Tools (`data/tools/*.yaml`)

- `id` — slug, eindeutig, lowercase-kebab-case
- `name`
- `description`
- `category` — muss in `data/categories/categories.yaml` existieren
- `countries` — ISO Codes
- `eu_company` — bool
- `data_residency` — `EU` | `EEA` | `NON_EU` | `UNKNOWN`
- `open_source` — bool
- `self_hostable` — bool
- `website`
- `last_reviewed` — `YYYY-MM`

## Optionale Felder (Sovereignty Score v1.0)

Defaults sind konservativ (false/unknown):
- `open_standards` — bool: Nutzt/implementiert offene Standards oder Protokolle
- `data_portability` — `full` | `partial` | `none` | `unknown`: Exportierbarkeit der Nutzerdaten

## Regeln

- Keine freien Textkategorien
- IDs sind lowercase-kebab-case
- `last_reviewed` immer aktuell halten

## Generierte Ausgaben (Build-Zeit, nicht in YAML)

- `data/generated/scores.json` — Map tool-id -> ScoreResult (für Hugo via `.Site.Data.generated.scores`)
- `dist/tools.json` — Alle Tools inkl. sovereignty_score, sovereignty_breakdown, score_confidence (gitignored)
- Berechnung: `npm run score` bzw. automatisch vor build/dev

Details: siehe `docs/sovereignty-score-v1.md` und ADR 0006.
