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
| `data_residency` | Wo liegen die Daten? (EU \| EEA \| NON_EU \| UNKNOWN) |
| `open_source` | Boolean: Ist der Quellcode offen? |
| `self_hostable` | Boolean: Kann selbst gehostet werden? |
| `website` | Offizielle Website |
| `last_reviewed` | Letztes Review-Datum (YYYY-MM) |

### Optionale Felder (Sovereignty Score v1.0)

| Feld | Beschreibung |
|------|--------------|
| `open_standards` | Boolean: Nutzt offene Standards/Protokolle? (Default: false) |
| `data_portability` | Exportierbarkeit: full \| partial \| none \| unknown (Default: unknown) |
| `governance_type` | Organisationsform: community \| company \| nonprofit (Default: unknown) |

## Souveränitätsindikatoren

### EU-Unternehmen (`eu_company`)
- **true**: Firmensitz innerhalb der EU
- **false**: Firmensitz außerhalb der EU

### Datenresidenz (`data_residency`)
- **EU**: Daten werden ausschließlich in der EU gespeichert
- **EEA**: Daten im Europäischen Wirtschaftsraum (EWR)
- **NON_EU**: Daten außerhalb der EU/EWR gespeichert
- **UNKNOWN**: Keine klare Aussage verfügbar

### Open Source (`open_source`)
- **true**: Quellcode öffentlich einsehbar
- **false**: Proprietäre Software

### Self-Hostable (`self_hostable`)
- **true**: Kann auf eigener Infrastruktur betrieben werden
- **false**: Nur als SaaS verfügbar

### Offene Standards (`open_standards`)
- **true**: Nutzt oder implementiert offene Standards/Protokolle (z.B. Matrix, WebDAV, CalDAV)
- **false**: Nutzt proprietäre Protokolle oder Formate

### Datenportabilität (`data_portability`)
- **full**: Vollständiger Export aller Nutzerdaten möglich
- **partial**: Teilweiser Export möglich
- **none**: Kein Export vorgesehen
- **unknown**: Keine klare Aussage verfügbar

### Organisationsform (`governance_type`)
- **community**: Projekt wird von einer offenen Community getragen (z.B. Forgejo, Lemmy)
- **nonprofit**: Träger ist eine gemeinnützige Organisation wie e.V., Stiftung, Foundation (z.B. Codeberg, Mastodon)
- **company**: Träger ist ein gewinnorientiertes Unternehmen wie GmbH, AG, Ltd (z.B. Nextcloud, Element)

## Bewertungslogik

Die Souveränitätsbewertung erfolgt über den **Sovereignty Score** (0.0–10.0), der deterministisch aus den oben genannten Feldern berechnet wird. Der Score bildet fünf Dimensionen ab:

1. **Legal Jurisdiction** — Rechtsraum des Anbieters (basierend auf `eu_company`, `countries`)
2. **Data Control** — Datenkontrolle (basierend auf `data_residency`, `self_hostable`)
3. **Openness** — Offenheit (basierend auf `open_source`, `open_standards`)
4. **Lock-in** — Bindungsrisiko (basierend auf `open_standards`, `data_portability`)
5. **Operational Autonomy** — Betriebsautonomie (basierend auf `self_hostable`, `open_source`, `eu_company`, `governance_type`)

Jede Dimension wird mit 0–2 Punkten bewertet. Details zur Berechnung: → [Sovereignty Score v1.0](sovereignty-score-v1.md) und [ADR 0006](adr/0006-sovereignty-score.md).

Diese Kriterien sind keine subjektive Wertung, sondern Transparenzindikatoren für informierte Entscheidungen.
