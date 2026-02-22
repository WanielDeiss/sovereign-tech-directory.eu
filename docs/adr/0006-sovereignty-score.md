# ADR 0006: Sovereignty Score v1.0

Status: accepted  
Datum: 2026-02-22

## Kontext

Das Verzeichnis soll Nutzern eine objektiv vergleichbare Bewertung der digitalen Souveraenitaet von Tools ermoeglichen. Dafuer ist ein deterministisches, aus den strukturierten Quelldaten berechenbares Metrik noetig, das mehrere Aspekte (Rechtsraum, Datenkontrolle, Offenheit, Lock-in, Betriebsautonomie) abdeckt.

## Entscheidung

Wir fuehren den **Sovereignty Score v1.0** ein: eine Summe von fuenf Dimensionen mit je 0 bis 2 Punkten (Schrittweite 0,5), Gesamt 0,0 bis 10,0.

- Berechnung aus bestehenden und zwei neuen optionalen YAML-Feldern (`open_standards`, `data_portability`).
- Dimensionen sind orthogonal gehalten (jedes Feld in max. zwei Dimensionen).
- Scores werden **nicht** in die Tool-YAMLs zurueckgeschrieben (ADR 0002: YAML bleibt Source of Truth fuer Eingabedaten). Berechnete Werte landen in generierten Dateien.
- Build-Integration: `npm run build` und `npm run dev` fuehren zuerst das Score-Script aus, danach Hugo.
- Implementierung in TypeScript (Node 20+), Tests mit Vitest, Doku in `docs/sovereignty-score-v1.md`.

## Konsequenzen

Positiv:
- Vergleichbarkeit und Transparenz der Bewertung
- Reproduzierbar und ohne manuelle Bewertung
- Hugo und externe Consumer koennen Scores aus `data/generated/scores.json` bzw. `dist/tools.json` nutzen

Negativ:
- Zwei neue optionale Felder in den Tool-YAMLs
- `data_residency` wird auf Enum `EU | EEA | NON_EU | UNKNOWN` normalisiert (Migration: Global -> NON_EU, EWR -> EEA, Unknown -> UNKNOWN)
- TypeScript und Score-Script werden Teil des Builds

## Alternativen

1) Manuelle Scores in YAML
- Nachteil: subjektiv, schwer konsistent, keine klare Logik

2) Scores in YAML schreiben (vom Script ueberschrieben)
- Nachteil: abgeleitete Daten in Source of Truth, veraltet bei Aenderung der Logik

3) Weniger Dimensionen oder andere Gewichtung
- Aktuelle Aufteilung bildet Rechtsraum, Datenkontrolle, Offenheit, Lock-in und Betriebsautonomie getrennt ab und erlaubt konsistente Vergleiche

## Referenzen

- Spezifikation und Tabellen: `docs/sovereignty-score-v1.md`
- Implementierung: `scripts/score-tools.ts`, `scripts/lib/scoring.ts`
