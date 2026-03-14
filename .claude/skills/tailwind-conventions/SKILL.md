---
name: tailwind-conventions
description: Tailwind CSS Konventionen und semantische Klassen für sovereign-tech-directory.eu
---

# Tailwind Konventionen

Tailwind wird als **Design-System und Token-Layer** genutzt, nicht als Utility-Salat im HTML.

## Grundregeln

- Keine langen Utility-Ketten im HTML
- Bevorzuge **semantische Klassen** statt direkter Utilities
- Semantische Klassen werden in `assets/css/main.css` mit `@apply` definiert
- Tailwind Utilities im HTML nur für:
  - Layout Glue (`grid`, `flex`, `hidden`, `md:grid-cols-2`)
  - Responsive Umschaltung
  - Sehr einfache, einmalige Anpassungen
  - Max 3-4 Utility-Klassen pro Element

## Nicht erlaubt im HTML

- Lange Klassenketten für Spacing, Farbe, Border, Shadow
- Wiederholte Utility-Kombinationen auf mehreren Seiten
- Inline Styles
- Utility-Klassen für Design Tokens (Farben, Radius, Shadow)

Schlecht:
```html
<div class="p-6 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4">
```

Gut:
```html
<div class="card">
```

## Design Tokens

Farben, Radius, Shadow und Typografie in `tailwind.config.js` definiert.
Komponenten-Patterns in `assets/css/main.css` über `@apply`.

## Bevorzugte semantische Klassen

`.app-container`, `.page-title`, `.section-title`, `.card`, `.card-header`, `.badge`, `.badge-strong`, `.button`, `.button-secondary`, `.nav`, `.nav-link`, `.nav-link-active`

Wenn eine Klasse fehlt: erst in `main.css` anlegen, dann im HTML verwenden.

## Refactoring-Regel

Wenn du im HTML mehr als **4 Utility-Klassen** brauchst:
1. Stop
2. Erkenne das Pattern
3. Extrahiere eine semantische Klasse in `main.css`
4. Ersetze die Utilities durch diese Klasse

## Review-Check

Vor Abschluss einer UI-Änderung prüfen:
- Wurde Utility-Duplikation reduziert?
- Sind semantische Klassen wiederverwendet?
- Sind Design Tokens konsistent?
- Bleibt das HTML lesbar?
