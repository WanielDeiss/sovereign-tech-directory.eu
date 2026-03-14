# Sovereign Tech Directory

A curated directory for digital sovereignty in Europe. We help organisations and individuals discover software that respects privacy, keeps data in Europe, and avoids vendor lock-in.

**[sovereign-tech-directory.eu](https://sovereign-tech-directory.eu/)**

## What this project does

The directory evaluates European and sovereign software tools across transparent criteria:

- **Data residency** - Where is your data stored?
- **Open source** - Can you inspect and modify the code?
- **Self-hosting** - Can you run it on your own infrastructure?
- **Open standards** - Does it use interoperable formats?
- **Data portability** - Can you take your data and leave?

Each tool receives a **Sovereignty Score** (0-10), computed deterministically from these criteria. The algorithm is fully documented in [`docs/sovereignty-score-v1.md`](docs/sovereignty-score-v1.md).

Currently the directory includes 30 tools across 9 categories, from cloud storage (Nextcloud, ownCloud) to communication (Element, Threema) to development platforms (GitLab, Forgejo, Codeberg).

## Tech stack

This is a static site with no backend, no database, and no tracking.

- **[Hugo](https://gohugo.io/)** - Static site generator
- **[Tailwind CSS](https://tailwindcss.com/)** - Styling
- **[Fuse.js](https://www.fusejs.io/)** - Client-side search
- **YAML** - Source of truth for all tool data
- **GitHub Pages** - Hosting

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [Go](https://go.dev/) 1.26+
- [Hugo Extended](https://gohugo.io/installation/) 0.156+

### Setup

```bash
git clone https://github.com/WanielDeiss/std.git
cd std
npm install
```

### Development

```bash
npm run dev
```

Opens a local server at `http://localhost:1313/` with hot reload. Changes to tool data files automatically recompute sovereignty scores.

### Build

```bash
npm run build
```

### Test

```bash
npm test
```

## Contributing

We welcome contributions from everyone - you don't need to be a developer. You can suggest tools, review existing data, report issues, or work on the codebase.

See **[CONTRIBUTING.md](CONTRIBUTING.md)** for the full guide.

## Project structure

```
data/tools/          # YAML files - one per tool (source of truth)
data/categories/     # Category definitions
content/en/          # Hugo content pages
layouts/             # Hugo templates
assets/              # CSS, JS, logos, flags
scripts/             # Build scripts (scoring, SEO checks, dev server)
docs/                # Architecture, scoring spec, development guide
```

## Principles

- **Curation over completeness** - Fewer verified tools are better than many unvetted ones
- **Transparency** - Scoring criteria are fully visible and auditable
- **Privacy** - No cookies, no tracking, no analytics
- **Simplicity** - Static-first, minimal dependencies, progressive enhancement

## License

See [LICENSE](LICENSE) for details.
