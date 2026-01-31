# ADR 0004: Routing fuer Tool Detailseiten

Status: accepted  
Datum: 2026-01-30

## Kontext

Die Verzeichnisdaten liegen als YAML unter `data/tools/<id>.yaml`.
Fuer jedes Tool soll es eine stabile, lesbare URL geben:

- /tools/<id>/

Hugo bietet mehrere Moeglichkeiten, solche Seiten zu erzeugen:
- rein datengetrieben (Routing ueber Templates und URL Parsing)
- Content Stubs (Markdown Dateien), die nur das Routing bereitstellen
- Generierung von Content Dateien per Script

Wichtige Anforderungen:
- Stabile URLs
- Klare Trennung zwischen Daten (YAML) und Darstellung (Layouts)
- Geringe Komplexitaet
- Gute Verstaendlichkeit fuer Contributors
- Spaetere Migration auf API oder Headless CMS ohne Bruch

## Entscheidung

Wir verwenden **Content Stubs pro Tool** fuer das Routing.

- Fuer jedes Tool existiert eine Datei:
  - `content/tools/<id>.md`
- Diese Datei enthaelt keinen fachlichen Inhalt.
- Alle fachlichen Daten kommen ausschliesslich aus `data/tools/<id>.yaml`.
- Das Single Layout liest anhand der Tool ID die passenden YAML Daten.

Beispiel:
- URL: `/tools/plausible/`
- Routing: `content/tools/plausible.md`
- Datenquelle: `data/tools/plausible.yaml`

## Konsequenzen

Positiv:
- Sehr klares und explizites Routing
- URLs sind stabil und vorhersehbar
- Hugo Standardmechanismen werden genutzt
- Einfache mentale Modelle fuer neue Contributor
- Gute Vorbereitung fuer spaetere Migration (API oder CMS)

Negativ:
- Zusaetzliche Dateien pro Tool
- Leichte Redundanz zwischen Content Struktur und Datenstruktur
- Disziplin notwendig, damit Inhalte nicht in Markdown wandern

Diese Nachteile werden bewusst akzeptiert, da Klarheit und Wartbarkeit ueberwiegen.

## Alternativen

### 1) Rein datengetriebenes Routing (ohne Content Stubs)

Beschreibung:
- Ein einziges Template rendert alle Tool Detailseiten.
- Tool ID wird aus der URL gelesen.
- YAML Daten werden dynamisch gemappt.

Vorteile:
- Weniger Dateien
- Keine Redundanz

Nachteile:
- Ungewoehnliche Hugo Patterns
- Schwerer zu verstehen und zu debuggen
- Hoehere Komplexitaet in Templates
- Weniger explizite URLs im Content Tree

### 2) Generierte Content Dateien

Beschreibung:
- Content Dateien werden automatisch aus YAML erzeugt.
- Build Step oder Script notwendig.

Vorteile:
- Keine manuelle Pflege der Content Stubs
- Einheitliche Struktur

Nachteile:
- Zusaetzlicher Build Schritt
- Weniger transparent fuer Contributors
- Gefahr von Merge Konflikten

## Entscheidungskriterien

- Klarheit vor Magie
- Standard-Hugo Patterns bevorzugen
- Geringe Einstiegshuerde fuer Contributors
- Zukunftssicherheit fuer spaetere Architekturwechsel

## Hinweise zur Umsetzung

- Content Stubs duerfen minimal sein (zB nur Frontmatter).
- Fachliche Inhalte in Markdown sind nicht erlaubt.
- Source of Truth bleibt immer `data/tools/*.yaml`.
- Review Checks sollten sicherstellen, dass:
  - fuer jedes Tool ein Content Stub existiert
  - IDs uebereinstimmen