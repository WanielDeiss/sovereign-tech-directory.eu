# Architektur: sovereign-tech-directory.eu

## Ziel und Prinzipien

**sovereign-tech-directory.eu** ist ein kuratiertes, datengetriebenes Verzeichnis für digitale Souveränität in Europa.

Ziele:
- Auffindbarkeit: Nutzer finden europäische, souveräne Tools schnell.
- Vergleichbarkeit: Tools werden strukturiert beschrieben, nicht marketinggetrieben.
- Transparenz: Kriterien wie EU-Company oder Datenresidenz sind sichtbar.
- Beitragbarkeit: Community kann per PR Tools vorschlagen und bestehende Einträge verbessern.
- Wartbarkeit: Minimaler Tech-Stack, niedrige Betriebs- und Sicherheitslast.

Nicht-Ziele in Phase 1:
- User Accounts, Login, Rollen, Kommentare
- Bewertungen, Like-Systeme, Gamification
- Backend, Datenbank, Echtzeitfunktionen
- Tracking und personalisierte Inhalte

Leitprinzipien:
- **Static first**: Alles ist statisch gebaut und ausgeliefert.
- **Data as Source of Truth**: YAML Daten sind die Wahrheit, Templates sind Views.
- **Progressive Enhancement**: Ohne JavaScript funktioniert alles, JS ist optional.
- **Kuration vor Vollständigkeit**: Lieber weniger Einträge, dafür verlässlich.
- **Transparenz vor Score**: Kriterien werden als Checkliste dargestellt, kein intransparenter Gesamtscore.

## Systemübersicht

Das System besteht aus:
- **Hugo SSG** zum Build der Website
- **YAML Daten** als Content-Quelle
- **Layouts/Templates** zur Darstellung und Navigation
- Optional **Vanilla JS** für client-side Filter (Phase 1 optional)

High-Level Datenfluss:
1) Tool und Kategorie Daten werden als YAML in `data/` gepflegt.
2) Hugo rendert daraus statische Seiten in `public/`.
3) Deployment liefert die statischen Assets über CDN oder statisches Hosting aus.

## Repository Struktur

Wichtige Verzeichnisse:
- `.cursor/rules/`  
  Dauerhafte Agent-Regeln für Cursor (Kontext, Konventionen, Datenmodell, Qualität).
- `data/`  
  `data/tools/*.yaml` für Tools  
  `data/categories/categories.yaml` für Kategorien
- `content/`  
  Statische Seiten wie Startseite, About, Index-Seiten für Sections.
- `layouts/`  
  Hugo Templates für Listen, Detailseiten, Partials.
- `assets/`  
  CSS und optionales JS (Vanilla, ohne Framework).

## Datenmodell

### Tool Eintrag

Tools liegen als einzelne Dateien unter `data/tools/<id>.yaml`.

Pflichtfelder:
- `id`: eindeutiger slug, lowercase-kebab-case
- `name`: Anzeigename
- `description`: 1 bis 2 Sätze, sachlich
- `category`: Referenz auf eine Kategorie ID
- `countries`: ISO Ländercodes als Array, zB `["DE","FR"]`
- `eu_company`: boolean
- `data_residency`: enum `EU | EWR | Unknown | Global`
- `open_source`: boolean
- `self_hostable`: boolean
- `website`: URL
- `last_reviewed`: `YYYY-MM`

Optionale Felder:
- `tags`: Array
- `license`: String, zB `AGPL-3.0`
- `repo_url`: URL
- `alternatives_to`: Array von Strings

### Kategorien

Kategorien liegen zentral unter `data/categories/categories.yaml`.

Empfohlene Felder:
- `id`: lowercase-kebab-case
- `label`: Anzeigename
- optional `description`: kurze Erklärung

## Rendering und Routing

### Tools Liste

Route:
- `/tools/`

Inhalt:
- Alle Tools, sortiert nach Name.
- Anzeige relevanter Metadaten.
- Filter UI kann optional client-side ergänzt werden.

### Tool Detail

Route:
- `/tools/<id>/`

Inhalt:
- Tool Details
- Sovereignty Checklist:
  - EU Company
  - Data Residency
  - Open Source
  - Self-hostable
- Alternatives to
- Last reviewed
- Website Link

Implementierungsoptionen:
- Data-driven rendering innerhalb eines Single Templates, das anhand der URL das passende Tool aus `data/tools` auswählt.
- Alternativ: Generierung von Content Stubs in `content/tools/<id>.md`, die nur als Routing-Hülle dienen.

Entscheidung in Phase 1:
- Fokus auf einfaches Setup, stabile URLs und minimalen Code.
- Content Stubs sind ok, solange YAML die Quelle bleibt.

### Kategorien

Route:
- `/categories/` listet alle Kategorien und Anzahl Tools je Kategorie.
- `/categories/<id>/` listet Tools einer Kategorie.

Umsetzung:
- Kategorien aus YAML lesen und Tools nach `category` gruppieren.

## UI und UX Leitlinien

- Semantisches HTML
- Minimal CSS, kein Framework
- Gute Lesbarkeit, klare Hierarchie
- Mobile first
- Barrierearm:
  - sinnvolle Überschriftenstruktur
  - ausreichend Kontrast
  - Links und Buttons klar unterscheidbar

## Filter Strategie

Phase 1:
- Ohne JS: Kategorien Seiten und Tools Liste sind vollständig nutzbar.
- Mit JS optional:
  - kleine Filter UI, die die Tool Karten client-side ein und ausblendet
  - kein externer Build Schritt, kein Framework

Phase 2:
- Erweiterte Filter, zB nach Lizenz oder Hosting Optionen
- Export oder API Endpoints

## Beitrag und Review Prozess

Workflow:
- Änderungen passieren per Pull Request.
- Neue Tools werden als neue YAML Datei hinzugefügt.
- Änderungen an bestehenden Tools werden nachvollziehbar gemacht.

Review Regeln:
- Pflichtfelder vorhanden
- Category existiert
- Format stimmt (IDs, last_reviewed)
- Beschreibung ist sachlich, kein Marketing
- Links funktionieren

Empfohlen:
- Validierungs Script im Repo
- CI Workflow, der YAML prüft

## Security und Betrieb

Security Vorteile durch Static Architecture:
- Keine Datenbank, keine User Daten
- Minimale Angriffsfläche
- Keine server-side Runtime nötig

Trotzdem beachten:
- Outbound Links sind potenziell riskant:
  - `rel="noopener noreferrer"` bei externen Links
- Build muss reproduzierbar sein
- Supply chain minimieren:
  - wenige Dependencies
  - lock files, falls Node Tools genutzt werden

## Observability und Datenschutz

- Standard: kein Tracking
- Wenn Analytics nötig wird:
  - datenschutzfreundliche europäische Lösung bevorzugen
  - optional self-hosted

## Roadmap und Erweiterungspfade

Phase 1:
- MVP Seiten: Home, Tools, Tool Detail, Kategorien, About
- YAML Datenmodell + Beispiele
- Minimal CSS
- Optional JS Filter
- Contributor Docs und Issue Templates

Phase 2:
- Vergleichsansicht für Tools
- Export (CSV, JSON)
- Öffentliche API oder Open Data Dump
- Automatisierte Link Checks
- Redaktionsprozess (zB Status: active, unknown, deprecated)

Phase 3:
- Headless CMS als optionaler Autorierungsweg
- Moderations-Queue für Community Vorschläge
- Mehrsprachigkeit (DE/EN)

## Architektur Entscheidungen

ADR 001: Static Site Generator statt Backend
- Grund: Minimale Komplexität, maximale Sicherheit und günstiger Betrieb.
- Konsequenz: Alle Daten müssen build-time verfügbar sein.

ADR 002: YAML Daten als Source of Truth
- Grund: PR-freundlich, diffbar, gut reviewbar.
- Konsequenz: Strikte Validierung nötig.

ADR 003: Progressive Enhancement
- Grund: Gute Basis ohne JS, dann optional bessere UX.
- Konsequenz: Filter und Suche müssen ohne JS nicht notwendig sein.