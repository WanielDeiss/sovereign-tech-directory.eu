# Contributing

Thanks for your interest in the Sovereign Tech Directory! This project lives from community contributions - whether you're a developer, a sysadmin who knows sovereign tools, or someone who cares about digital sovereignty in Europe.

## Ways to contribute

### Suggest a tool (no coding required)

Know a European or sovereign software tool that should be listed? Use the **[Suggest a tool](https://github.com/WanielDeiss/std/issues/new?template=suggest-tool.yml)** issue template. It will ask you for:

- Tool name and website
- Category and country
- Sovereignty indicators (open source, self-hostable, EU-based, etc.)
- Sources to verify the information

You don't need to fill in everything - we'll research the rest.

### Suggest a new category

Think the directory is missing an entire category? Use the **[Suggest a category](https://github.com/WanielDeiss/std/issues/new?template=suggest-category.yml)** issue template. Describe what kind of tools it would cover, how it differs from existing categories, and list a few example tools.

### Add a tool yourself

If you're comfortable editing YAML files, you can add a tool directly via pull request. Each tool needs three files:

**1. Data file** - `data/tools/<tool-id>.yaml`

```yaml
id: tool-name
name: Tool Name
description: One or two sentences about what the tool does.
category: cloud-storage
countries:
  - DE
eu_company: true
data_residency: EU
open_source: true
self_hostable: true
open_standards: true
data_portability: full
alternatives_to:
  - Google Drive
  - Dropbox
website: https://example.com
last_reviewed: 2026-03
```

**2. Content page** - `content/en/tools/<tool-id>.md`

```markdown
---
title: "Tool Name"
---
```

**3. Logo** - `assets/tools/<tool-id>.svg`

An SVG logo of the tool. Keep it clean and reasonably sized.

#### Field reference

| Field | Required | Values |
|-------|----------|--------|
| `id` | yes | lowercase-kebab-case, must match filename |
| `name` | yes | Display name |
| `description` | yes | 1-2 sentences |
| `category` | yes | Must exist in `data/categories/categories.yaml` |
| `countries` | yes | ISO country codes where the vendor is based |
| `eu_company` | yes | `true` / `false` |
| `data_residency` | yes | `EU` \| `EEA` \| `NON_EU` \| `UNKNOWN` |
| `open_source` | yes | `true` / `false` |
| `self_hostable` | yes | `true` / `false` |
| `open_standards` | no | `true` / `false` (default: `false`) |
| `data_portability` | no | `full` \| `partial` \| `none` \| `unknown` |
| `alternatives_to` | no | List of tools it replaces |
| `website` | yes | Official URL |
| `last_reviewed` | yes | `YYYY-MM` format |

Available categories: `cloud-storage`, `communication`, `analytics`, `project-management`, `development`, `office`, `email`, `social-media`, `security`.

### Review and correct existing data

Browse the tools in `data/tools/` and check if the information is still accurate. Things that go out of date:

- Company got acquired or moved HQ
- Data residency policies changed
- Open source status changed
- New self-hosting options became available

Open a PR with corrections or an issue if you're unsure.

### Report issues

Found a bug on the website, a broken link, or something that looks wrong? [Open a blank issue](https://github.com/WanielDeiss/std/issues/new) - no template needed, just describe what you found.

## Development setup

If you want to work on the site itself (templates, scoring, styling, scripts):

### Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [Go](https://go.dev/) 1.26+
- [Hugo Extended](https://gohugo.io/installation/) 0.156+

### Setup

```bash
git clone https://github.com/WanielDeiss/std.git
cd std
npm install
npm run dev
```

This starts a local server at `http://localhost:1313/` with hot reload. Changes to YAML files in `data/tools/` automatically recompute sovereignty scores.

### Useful commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Dev server with hot reload and score auto-recompute |
| `npm run build` | Production build |
| `npm test` | Run tests |
| `npm run test:watch` | Tests in watch mode |
| `npm run score` | Recompute sovereignty scores |
| `npm run seo:check` | Validate SEO after build |

### How the build works

```
data/tools/*.yaml → score-tools.ts → data/generated/scores.json → Hugo → static site
```

Tool data lives in YAML. At build time, the scoring script reads all YAML files, computes the Sovereignty Score for each tool, and writes the results to `scores.json`. Hugo then renders the site using both the YAML data and the generated scores.

### Commit conventions

This project uses [conventional commits](https://www.conventionalcommits.org/) enforced by commitlint. Your commit messages must follow this format:

```
type: subject
```

Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `chore`, `build`, `ci`

Examples:
- `feat: add signal messenger to communication tools`
- `fix: correct data residency for tresorit`
- `docs: update scoring algorithm documentation`

The subject must be lowercase, max 72 characters, no period at the end.

## Pull request workflow

1. Fork the repo and create a branch
2. Make your changes
3. Run `npm test` to make sure nothing is broken
4. Run `npm run build` to verify the site builds
5. Open a pull request with a clear description of what you changed and why

For tool additions, the PR description should include a source for the data (e.g. link to the company's imprint, privacy policy, or GitHub repo).

## Documentation

- [`docs/architecture.md`](docs/architecture.md) - System design
- [`docs/development.md`](docs/development.md) - Detailed development guide
- [`docs/sovereignty-score-v1.md`](docs/sovereignty-score-v1.md) - How the score is calculated
- [`docs/sovereignty-criteria.md`](docs/sovereignty-criteria.md) - What each field means

## Questions?

Open an issue. There are no dumb questions.
