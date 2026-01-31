# Souveränitätskriterien

Dieses Dokument beschreibt die Kriterien, nach denen Tools im sovereign-tech-directory.eu bewertet werden.

## Pflichtfelder pro Tool

| Feld | Beschreibung |
|------|--------------|
| `id` | Eindeutiger Slug (lowercase-kebab-case) |
| `name` | Anzeigename des Tools |
| `description` | Kurzbeschreibung |
| `category` | Muss in `/data/categories/` existieren |
| `countries` | ISO-Ländercodes (z.B. DE, FR, NL) |
| `eu_company` | Boolean: Ist das Unternehmen in der EU ansässig? |
| `data_residency` | Wo liegen die Daten? (EU \| EWR \| Unknown \| Global) |
| `open_source` | Boolean: Ist der Quellcode offen? |
| `self_hostable` | Boolean: Kann selbst gehostet werden? |
| `website` | Offizielle Website |
| `last_reviewed` | Letztes Review-Datum (YYYY-MM) |

## Souveränitätsindikatoren

### EU-Unternehmen (`eu_company`)
- **true**: Firmensitz innerhalb der EU
- **false**: Firmensitz außerhalb der EU

### Datenresidenz (`data_residency`)
- **EU**: Daten werden ausschließlich in der EU gespeichert
- **EWR**: Daten im Europäischen Wirtschaftsraum
- **Global**: Daten weltweit verteilt
- **Unknown**: Keine klare Aussage verfügbar

### Open Source (`open_source`)
- **true**: Quellcode öffentlich einsehbar
- **false**: Proprietäre Software

### Self-Hostable (`self_hostable`)
- **true**: Kann auf eigener Infrastruktur betrieben werden
- **false**: Nur als SaaS verfügbar

## Bewertungslogik

Ein Tool gilt als **besonders souveränitätsfreundlich**, wenn:
- `eu_company: true`
- `data_residency: EU` oder `EWR`
- `open_source: true`
- `self_hostable: true`

Diese Kriterien sind keine Wertung, sondern Transparenzindikatoren für informierte Entscheidungen.
