# sovereign-tech-directory.eu

Kuratiertes Verzeichnis für digitale Souveränität in Europa.
Hugo SSG, keine DB, keine User-Accounts. Deployment via GitHub Pages.

## Build & Dev

- `npm run dev` — Dev-Server (Hugo + Score-Berechnung)
- `npm run build` — Production Build (Score + Hugo)
- `npm run test` — Vitest Tests
- `npm run score` — Sovereignty Scores berechnen
- `npm run seo:check` — SEO-Analyse

## Daten

- Source of Truth: YAML-Dateien in `data/tools/*.yaml` und `data/categories/categories.yaml`
- Generierte Dateien (gitignored): `data/generated/scores.json`, `dist/tools.json`
- IDs: lowercase-kebab-case

## Code-Stil

- Semantisches HTML, keine Inline-Styles
- Tailwind CSS als Design-System: semantische Klassen via `@apply` in `assets/css/main.css`, max 3-4 Utilities pro Element im HTML
- Vanilla JS nur optional, Progressive Enhancement
- Hugo-Templates so einfach wie möglich

## Icons

Heroicons via `hugo-mod-heroicons`:
```
{{ partial "icon.html" (dict "name" "check" "style" "solid" "size" 20) }}
```

## Commits

Conventional Commits, English only, lowercase, max 72 Zeichen, kein Emoji.
Typen: feat, fix, docs, style, refactor, chore, build, ci.
Commitlint erzwingt das Format.

## Nicht-Ziele (Phase 1)

Kein Auth, keine Kommentare/Ratings, kein Backend, kein Tracking.

## Architektur

Siehe @docs/architecture.md und @docs/adr/0000-adr-index.md für ADRs.
