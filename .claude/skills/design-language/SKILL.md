---
name: design-language
description: Design Language und UI-Konventionen für sovereign-tech-directory.eu
---

# Design Language

Modernes, ruhiges, seriöses Directory Design. Content first. Keine Spielereien.

## Stilrichtung

Keywords: modern SaaS directory, soft borders, subtle shadows, generous spacing, typography forward, content first.

Nicht: knallige Farben, harte Schatten, zu viele Icons, zu viele Badge-Styles, Animationen als Selbstzweck.

## Icons

Heroicons via `hugo-mod-heroicons`. Nur wo sie echten Mehrwert bieten (Navigation, Buttons, Status). Keine dekorativen Icons ohne Funktion.

## Design Tokens

- **Primary**: kühle, seriöse Farbe (sparsam — Links, Buttons)
- **Accent**: zweite Farbe für Highlights (sehr sparsam)
- **Neutrals**: Grautöne für Text, Border, Background
- **Spacing**: konsistente Stufen, lieber mehr Luft als zu eng
- **Radius**: modern, eher groß
- **Shadow**: weich und subtil
- **Typografie**: klar, gut lesbar, keine extremen Font Weights

## Komponenten-Patterns

Bevorzugt semantische Klassen aus `assets/css/main.css`:
- `.app-container` — Seitenbreite und Padding
- `.page-title` / `.section-title` — Headings
- `.card` / `.card-header` — Standard Card
- `.badge` / `.badge-strong` — Pill Badges
- `.button` / `.button-secondary` — Buttons
- `.nav` / `.nav-link` / `.nav-link-active` — Navigation

## Layout-Regeln

- Jede Seite nutzt `.app-container` für konsistente Breite
- Cards sind Standard für Tool-Einträge und Checklisten
- Meta-Informationen (Land, Lizenz, Flags) sekundär und kompakt
- Detailseiten: 2 Spalten Desktop, 1 Spalte Mobile

## Accessibility

- Kontrast beachten, Text nie zu hell
- Fokus-States für Links und Buttons nicht entfernen
- Hover-States dezent, aber vorhanden
- Interaktionen ohne JS müssen nutzbar bleiben

## Review-Check

Bei UI-Änderungen prüfen:
- Spacing konsistent?
- Cards und Badges einheitlich?
- Klare Typografie-Hierarchie?
- Primary/Accent sparsam eingesetzt?
