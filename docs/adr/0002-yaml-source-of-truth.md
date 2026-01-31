# ADR 0002: YAML Daten als Source of Truth

Status: accepted  
Datum: 2026-01-30

## Kontext

Das Projekt ist ein Verzeichnis. Die zentralen Inhalte sind strukturierte Tool Eintraege und Kategorien.
Diese Inhalte muessen:
- leicht reviewbar sein
- diffbar im PR
- ohne Spezialtools bearbeitbar
- von einer Community erweiterbar sein

## Entscheidung

Wir speichern alle Verzeichnisdaten als YAML im Repository.

- Tools: `data/tools/<id>.yaml`
- Kategorien: `data/categories/categories.yaml`

Templates und Seiten in Hugo konsumieren diese Daten direkt.
Content Stubs duerfen existieren (Routing), aber die inhaltliche Wahrheit bleibt in `data/`.

## Konsequenzen

Positiv:
- Sehr gute Reviewbarkeit (kleine Diffs)
- Gute Community Contribution per PR
- Offline und ohne Admin UI bearbeitbar
- Einfache Exportierbarkeit (Open Data)

Negativ:
- Validierung wird wichtig (Pflichtfelder, IDs, Referenzen)
- Formate und Konventionen muessen strikt dokumentiert werden
- Keine direkte Bearbeitung im Browser ohne Git Workflow (optional spaeter)

## Alternativen

1) Markdown pro Tool als Content
- Vorteil: simpler fuer reine Texte
- Nachteil: schlechter fuer strukturierte Filter, weniger konsistent

2) JSON statt YAML
- Vorteil: strenger, maschinenfreundlich
- Nachteil: weniger angenehm fuer Menschen, laenger, unhandlicher

3) Datenbank
- Vorteil: dynamisch, mehr Features
- Nachteil: widerspricht ADR 0001 in Phase 1

## Entscheidungskriterien

- Menschlich gut editierbar
- PR Workflow, diffbar
- Struktur fuer Filter und Darstellung
- Spaeterer Export moeglich