# Sovereignty Score v1.0

## Purpose and overview

The Sovereignty Score is a deterministic, comparable metric (0.0 to 10.0 in 0.5 steps) for tools in the directory. It is computed from structured YAML fields and reflects five orthogonal dimensions of digital sovereignty. Scores are generated at build time and are not stored in the source YAML files.

## Dimensions

Each dimension is scored from 0 to 2 points in 0.5 steps. The total score is the sum of the five dimension scores (max 10.0).

| Dimension | Meaning |
|-----------|--------|
| **legal_jurisdiction** | Where the vendor is based and operates (EU/EEA/adequacy/mixed/non-EU). |
| **data_control** | Where data is stored and whether users can self-host. |
| **openness** | Open source and use of open standards. |
| **lock_in** | Lock-in risk (inverted: higher = less lock-in); driven by open standards and data portability. |
| **operational_autonomy** | Ability to run and control the tool independently (self-host, open source). |

## Field-to-dimension mapping

Each input field is used in at most two dimensions to keep weighting balanced:

- `eu_company`: legal_jurisdiction, operational_autonomy (tiebreaker only)
- `countries`: legal_jurisdiction
- `data_residency`: data_control
- `self_hostable`: data_control, operational_autonomy
- `open_source`: openness, operational_autonomy
- `open_standards`: openness, lock_in
- `data_portability`: lock_in

## Scoring tables

### legal_jurisdiction (eu_company, countries)

Country classification: **eu** (all EU), **eea** (all EEA, at least one non-EU EEA), **adequacy** (all EU/EEA/adequacy, at least one adequacy-only), **mixed** (at least one EU/EEA/adequacy and one other), **non_eu** (none of the above).

| eu_company | Classification | Points |
|------------|----------------|--------|
| true | eu or eea | 2.0 |
| true | adequacy | 1.5 |
| true | mixed | 1.0 |
| true | non_eu | 0.5 |
| false | eu or eea | 1.5 |
| false | adequacy | 1.0 |
| false | mixed | 0.5 |
| false | non_eu | 0.0 |

### data_control (self_hostable, data_residency)

| self_hostable | data_residency | Points |
|---------------|----------------|--------|
| true | EU | 2.0 |
| true | EEA | 2.0 |
| true | NON_EU | 1.5 |
| true | UNKNOWN | 1.0 |
| false | EU | 1.5 |
| false | EEA | 1.0 |
| false | NON_EU | 0.5 |
| false | UNKNOWN | 0.0 |

### openness (open_source, open_standards)

| open_source | open_standards | Points |
|-------------|----------------|--------|
| true | true | 2.0 |
| true | false | 1.5 |
| false | true | 1.0 |
| false | false | 0.0 |

### lock_in (open_standards, data_portability)

Additive: +1.0 if open_standards = true; +1.0 (full), +0.5 (partial), or +0.0 (none/unknown) for data_portability. Capped at 2.0.

### operational_autonomy (self_hostable, open_source, eu_company)

| self_hostable | open_source | eu_company | Points |
|---------------|-------------|------------|--------|
| true | true | - | 2.0 |
| true | false | - | 1.5 |
| false | true | - | 1.0 |
| false | false | true | 0.5 |
| false | false | false | 0.0 |

## Examples

### Element (9.0)

- eu_company: false, countries: [GB] (adequacy) -> legal_jurisdiction 1.0
- self_hostable: true, data_residency: EU -> data_control 2.0
- open_source: true, open_standards: true -> openness 2.0
- open_standards: true, data_portability: full -> lock_in 2.0
- self_hostable: true, open_source: true -> operational_autonomy 2.0  
**Total: 9.0, confidence: high**

### Nextcloud (10.0)

- eu_company: true, countries: [DE] (eu) -> legal_jurisdiction 2.0
- All other dimensions 2.0 as above.  
**Total: 10.0, confidence: high**

### GitLab (8.0)

- eu_company: false, countries: [NL, US] (mixed) -> legal_jurisdiction 0.5
- self_hostable: true, data_residency: NON_EU -> data_control 1.5
- openness 2.0, lock_in 2.0, operational_autonomy 2.0  
**Total: 8.0, confidence: high**

## Score interpretation

| Range | Interpretation |
|-------|----------------|
| 0.0 - 2.0 | Low sovereignty; strong dependency on non-EU or non-transparent providers. |
| 3.0 - 5.0 | Limited sovereignty; some EU/control aspects, but material lock-in or lack of openness. |
| 6.0 - 8.0 | Good sovereignty; EU/EEA or strong openness and control, with some gaps. |
| 9.0 - 10.0 | High sovereignty; EU/EEA where relevant, open, self-hostable, low lock-in. |

## Missing data and score_confidence

- **high**: All relevant fields present and not UNKNOWN.
- **medium**: One or two fields missing or UNKNOWN.
- **low**: Three or more fields missing, or a critical field (open_source, self_hostable) missing.

Missing booleans are treated as false; missing `data_portability` is treated as unknown. Scores remain deterministic; confidence indicates how much the score may change if data is completed.

## Generated outputs

- **data/generated/scores.json**: Map of tool id -> { sovereignty_score, sovereignty_breakdown, score_confidence } for Hugo (e.g. `.Site.Data.generated.scores`).
- **dist/tools.json**: Full list of tools with all fields plus score and breakdown (gitignored; build artifact).

Scores are computed by `npm run score` (or automatically before `npm run build` / `npm run dev`).
