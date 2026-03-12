# Dokumentations-Review: Widersprüche und Inkonsistenzen

Datum: 2026-03-12

## Zusammenfassung

Review aller Dokumentationen (docs/, ADRs, .cursor/rules/, .cursorrules, Content-Seiten) auf Widersprüche. **8 Widersprüche / Inkonsistenzen** gefunden, davon 3 mit hoher Priorität.

---

## W1 — `data_residency` Enum-Werte sind inkonsistent (HOCH)

Das Feld `data_residency` wird in verschiedenen Dokumenten mit **unterschiedlichen Enum-Werten** beschrieben:

| Dokument | Enum-Werte |
|----------|------------|
| `docs/architecture.md` (Z. 68) | `EU \| EWR \| Unknown \| Global` |
| `docs/sovereignty-criteria.md` (Z. 15, 27–31) | `EU \| EWR \| Unknown \| Global` |
| `.cursor/rules/020-data-model.mdc` (Z. 15) | `EU \| EEA \| NON_EU \| UNKNOWN` |
| `docs/sovereignty-score-v1.md` (Z. 54–61) | `EU \| EEA \| NON_EU \| UNKNOWN` |
| ADR 0006 (Z. 29) | Migration dokumentiert: `Global → NON_EU, EWR → EEA, Unknown → UNKNOWN` |

**Befund:** `docs/architecture.md` und `docs/sovereignty-criteria.md` verwenden die **veralteten** Werte (`EWR`, `Unknown`, `Global`). Die tatsächlich gültigen Werte sind `EU | EEA | NON_EU | UNKNOWN` (wie in 020-data-model.mdc und sovereignty-score-v1.md).

**Empfehlung:** `docs/architecture.md` und `docs/sovereignty-criteria.md` auf die aktuellen Enum-Werte aktualisieren.

---

## W2 — CSS-Strategie widerspricht sich (HOCH)

Mehrere Dokumente sagen "kein CSS-Framework", obwohl Tailwind CSS aktiv genutzt wird:

| Dokument | Aussage |
|----------|---------|
| `docs/architecture.md` (Z. 137) | "Minimal CSS, kein Framework" |
| `.cursor/rules/030-style-and-quality.mdc` (Z. 13–14) | "CSS: Minimal, Kein Framework" |
| `.cursorrules` (Z. 16) | "Tailwind CSS + Bootstrap (via Docsy) parallel" |
| `.cursor/rules/040-tailwind-conventions.mdc` | Komplette Tailwind-Konventionen |
| `.cursor/rules/010-hugo-conventions.mdc` (Z. 19) | "Tailwind CSS wird parallel zu Bootstrap via `hooks/head-end.html` geladen" |
| `docs/development.md` (Z. 25–27) | "CSS is processed by Hugo Pipes using PostCSS (Tailwind, Autoprefixer)" |

**Befund:** `docs/architecture.md` und `030-style-and-quality.mdc` behaupten "kein Framework", aber das Projekt nutzt **Tailwind CSS** (und Bootstrap via Docsy). Diese Dokumente sind veraltet und wurden nach Einführung von Tailwind + Docsy nicht aktualisiert.

**Empfehlung:** `docs/architecture.md` Abschnitt "UI und UX Leitlinien" aktualisieren: "Tailwind CSS als Design-System, semantische Klassen via @apply" statt "Minimal CSS, kein Framework". `030-style-and-quality.mdc` ebenfalls korrigieren.

---

## W3 — Element Sovereignty Score widerspricht sich (HOCH)

| Dokument | Element Score |
|----------|-------------|
| `docs/sovereignty-score-v1.md` (Z. 88–95) | **8.5** |
| `content/en/sovereignty-score.md` (Z. 139–146) | **9.0** |
| ADR 0006 (Z. 45) | Erklärt die Änderung 9.0 → 8.5 durch EFTA-Erweiterung |

**Befund:** Die öffentliche Sovereignty-Score-Seite zeigt Element mit 9.0, aber die technische Spezifikation sagt 8.5 nach der EFTA-Erweiterung. Außerdem fehlt in der öffentlichen Tabelle (`content/en/sovereignty-score.md` Z. 54–63) die **EFTA-Klassifikation** komplett — die Tabelle hat nur 8 Zeilen statt 10 (ohne EFTA-Einträge).

**Empfehlung:** `content/en/sovereignty-score.md` aktualisieren: Element-Beispiel auf 8.5 korrigieren, EFTA-Zeilen in die Legal-Jurisdiction-Tabelle aufnehmen.

---

## W4 — Kategorien-Pfad in .cursorrules (MITTEL)

| Dokument | Pfad |
|----------|------|
| `.cursorrules` (Z. 22) | `data/categories/*.yaml` (Wildcard, impliziert mehrere Dateien) |
| `docs/architecture.md` (Z. 47) | `data/categories/categories.yaml` (eine Datei) |
| ADR 0002 (Z. 20) | `data/categories/categories.yaml` (eine Datei) |
| Tatsächlich im Repo | `data/categories/categories.yaml` (eine Datei) |

**Befund:** `.cursorrules` suggeriert mit `*.yaml` mehrere Kategorie-Dateien, es gibt aber nur eine einzige `categories.yaml`.

**Empfehlung:** `.cursorrules` auf `data/categories/categories.yaml` korrigieren.

---

## W5 — "Kein Gesamtscore" vs. Sovereignty Score (MITTEL)

| Dokument | Aussage |
|----------|---------|
| `docs/architecture.md` (Z. 25) | "Transparenz vor Score: Kriterien werden als Checkliste dargestellt, **kein intransparenter Gesamtscore**" |
| ADR 0006 | Führt einen Sovereignty Score von 0.0–10.0 ein |

**Befund:** Das Architektur-Leitprinzip sagt "kein Gesamtscore", aber ADR 0006 führt genau einen solchen ein. Zwar ist der Score transparent (nicht "intransparent"), aber das Prinzip ist missverständlich formuliert und könnte als Widerspruch gelesen werden.

**Empfehlung:** Leitprinzip in `docs/architecture.md` präzisieren, z.B.: "Transparenz vor Score: Kriterien sind als Checkliste und mit nachvollziehbarer Bewertungslogik dargestellt (→ ADR 0006)."

---

## W6 — Score-Interpretationstabelle hat Lücken (NIEDRIG)

In `docs/sovereignty-score-v1.md` und `content/en/sovereignty-score.md`:

| Range | Interpretation |
|-------|---------------|
| 0.0 – 2.0 | Low |
| 3.0 – 5.0 | Limited |
| 6.0 – 8.0 | Good |
| 9.0 – 10.0 | High |

Die Werte **2.5**, **5.5** und **8.5** fallen in keine Range. Die Farbdefinitionen auf der Content-Seite (Z. 16) verwenden dagegen korrekt: red (0.0–2.0), amber (2.5–5.0), lime/green (5.5–8.0), green (8.5–10.0).

**Empfehlung:** Interpretationstabelle auf lückenlose Ranges korrigieren: 0.0–2.0, 2.5–5.0, 5.5–8.0, 8.5–10.0.

---

## W7 — Leere root `architecture.md` (NIEDRIG)

Die Datei `/architecture.md` (Wurzelverzeichnis) ist leer (1 Zeile, kein Inhalt). Die eigentliche Architekturdokumentation liegt unter `/docs/architecture.md`.

**Empfehlung:** Leere `/architecture.md` löschen oder als Redirect/Verweis auf `docs/architecture.md` nutzen.

---

## W8 — `sovereignty-criteria.md` spiegelt nicht den aktuellen Score wider (MITTEL)

`docs/sovereignty-criteria.md` beschreibt nur die vier einfachen Boolean/Enum-Indikatoren (`eu_company`, `data_residency`, `open_source`, `self_hostable`) und eine einfache "Bewertungslogik" (Z. 42–48). Es fehlen:

- Die zwei neuen Felder `open_standards` und `data_portability` (eingeführt in ADR 0006)
- Der tatsächliche Score-Algorithmus (5 Dimensionen)
- Verweis auf `docs/sovereignty-score-v1.md`

Das Dokument spiegelt den Stand **vor** ADR 0006 wider.

**Empfehlung:** `docs/sovereignty-criteria.md` aktualisieren: `open_standards` und `data_portability` als Felder ergänzen, auf `sovereignty-score-v1.md` verweisen, oder das Dokument in die Score-Doku integrieren.

---

## Übersicht: Keine Widersprüche gefunden

Die folgenden Bereiche sind konsistent:

- **ADRs untereinander**: ADR 0001–0007 referenzieren sich korrekt und widersprechen sich nicht.
- **SEO-Dokumente**: `seo-analysis` und `seo-implementation-plan` sind konsistent.
- **Hugo-Konventionen** (010-hugo-conventions.mdc): Konsistent mit ADR 0004 und ADR 0005.
- **Commit-Konventionen** (060-commit-message-conventions.mdc): Kein Widerspruch.
- **Design Language** (050-design-language.mdc): Konsistent mit Tailwind-Konventionen.
- **Datenmodell** (020-data-model.mdc): Konsistent mit sovereignty-score-v1.md und ADR 0006.
- **Tool-YAML-Dateien**: Verwenden die korrekten aktuellen Enum-Werte.
