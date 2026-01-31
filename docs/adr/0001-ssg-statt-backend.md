# ADR 0001: Static Site Generator statt Backend

Status: accepted  
Datum: 2026-01-30

## Kontext

sovereign-tech-directory.eu ist ein kuratiertes Verzeichnis fuer digitale Souveraenitaet in Europa.
In Phase 1 soll das Projekt:
- schnell startklar sein
- einfach betreibbar sein
- eine minimale Angriffsoberflaeche haben
- ohne User Accounts und ohne Speicherung personenbezogener Daten auskommen

Es gibt einen hohen Read Anteil und einen sehr niedrigen Write Anteil (Eintraege werden selten geaendert, aber oft gelesen).

## Entscheidung

Wir nutzen einen Static Site Generator (Hugo) und liefern ausschliesslich statische Assets aus.
Es gibt in Phase 1:
- kein Backend
- keine Datenbank
- keine serverseitige Laufzeitumgebung ausser dem Build

## Konsequenzen

Positiv:
- Sehr kleine Angriffsoberflaeche
- Einfaches Hosting (Static Hosting + CDN)
- Geringe Betriebskosten
- Keine personenbezogenen Daten im Betrieb notwendig
- Sehr gute Performance

Negativ:
- Inhalte werden nur per Rebuild aktualisiert
- Kein serverseitiges Such oder Filter Backend
- Beitragseinreichung erfolgt nicht direkt ueber eine Web UI, sondern ueber PR oder externe Formulare

## Alternativen

1) Backend + Datenbank (zB Node, Go, Rails)
- Vorteil: Admin UI, dynamische Suche, sofortige Updates
- Nachteil: Security, Betrieb, Komplexitaet, Datenschutzthemen

2) Headless CMS (zB Directus, Strapi) + SSG
- Vorteil: bessere Redaktion, UI fuer Eintraege
- Nachteil: trotzdem Backend Betrieb, Auth, neue Abhaengigkeiten

## Entscheidungskriterien

- Minimaler Betrieb
- Sicherheit und Datenschutz by default
- Schneller MVP
- PR basierter Workflow ausreichend