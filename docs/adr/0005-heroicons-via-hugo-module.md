# ADR 0005: Heroicons via Hugo Module

Status: accepted  
Datum: 2026-01-31

## Kontext

Fuer die UI werden Icons benoetigt:
- Navigation (Dropdowns, Menues)
- Buttons und Aktionen
- Status-Indikatoren

Anforderungen:
- Einheitliches, professionelles Iconset
- MIT-Lizenz (keine rechtlichen Einschraenkungen)
- Einfache Wartung und Updates
- Passend zum Tailwind-Stack

Heroicons von Tailwind Labs sind ein etabliertes, MIT-lizenziertes Iconset mit:
- Outline und Solid Varianten
- Verschiedene Groessen (16, 20, 24px)
- Optimierte SVGs
- Gute Integration mit Tailwind CSS

## Entscheidung

Wir nutzen **Heroicons** ueber das Hugo-Modul `hugo-mod-heroicons`.

Implementierung:
- Hugo-Modul in `hugo.toml` importieren
- Icons werden unter `assets/svg/heroicons/` gemountet
- Zentrales Partial `layouts/partials/icon.html` fuer einheitliche Nutzung
- Styling ueber semantische CSS-Klassen (nicht inline)

Verwendung:

```html
{{ partial "icon.html" (dict "name" "chevron-down" "class" "my-icon") }}
```

## Konsequenzen

Positiv:
- Einheitliches, professionelles Iconset
- Einfache Updates via `hugo mod get -u`
- Konsistente API ueber das Icon-Partial
- Keine manuellen SVG-Kopien noetig

Negativ:
- Go muss fuer Hugo-Module installiert sein
- Eine externe Abhaengigkeit (aber MIT-lizenziert und gut gepflegt)
- Icons nur zur Build-Zeit verfuegbar

## Alternativen

1) SVGs manuell von heroicons.com kopieren
   - Vorteil: keine Abhaengigkeit
   - Nachteil: manueller Aufwand bei neuen Icons, keine zentrale Konvention

2) Git Submodule tailwindlabs/heroicons
   - Vorteil: volle Kontrolle ueber Version
   - Nachteil: komplexeres Setup, kein Hugo-Mount

3) Anderes Iconset (Feather, Lucide, etc.)
   - Vorteil: mehr Auswahl
   - Nachteil: weniger Tailwind-Integration, zusaetzliche Recherche

## Entscheidungskriterien

- Passend zum Tailwind-Stack
- MIT-Lizenz
- Einfache Wartung
- Professionelle Qualitaet
- Hugo-kompatible Integration
