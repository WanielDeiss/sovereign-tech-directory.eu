# ADR 0003: Progressive Enhancement statt JS Pflicht

Status: accepted  
Datum: 2026-01-30

## Kontext

Die Seite soll auch ohne JavaScript nutzbar sein:
- schnelle Ladezeiten
- hohe Kompatibilitaet
- barrierearme Basis
- klare Mission: Minimalismus und Vertrauen

Gleichzeitig sind Filter und Suche fuer ein Verzeichnis sehr hilfreich.

## Entscheidung

Wir bauen die Kernnavigation und Kerninhalte so, dass sie ohne JavaScript funktionieren:
- Kategorienseiten als natuerliche Filter
- Tools Liste komplett sichtbar

JavaScript ist optional und darf spaeter fuer Komfortfunktionen genutzt werden:
- client-side Filter UI
- client-side Suche

Dabei gilt:
- Vanilla JS
- kein Framework
- Seite bleibt ohne JS voll nutzbar

## Konsequenzen

Positiv:
- Stabile Basis UX
- Kein JS Zwang, keine unnötige Komplexitaet
- Performance und Vertrauen steigen
- Weniger Abhaengigkeiten

Negativ:
- Filter ohne JS sind weniger flexibel
- Suche ist ohne JS nur ueber Browser Suche oder spaeter via prebuilt index moeglich

## Alternativen

1) JS first Filter und Suche (Framework)
- Vorteil: bessere UX sofort
- Nachteil: mehr Komplexitaet, mehr Abhaengigkeiten, groessere Bundle

2) Serverseitige Suche (Backend)
- Vorteil: sehr gute Suche
- Nachteil: widerspricht ADR 0001 in Phase 1

## Entscheidungskriterien

- Accessibility und Performance
- Minimaler Tech Stack
- Gute Basis ohne JS
- Optionaler Ausbau ohne Architekturbruch