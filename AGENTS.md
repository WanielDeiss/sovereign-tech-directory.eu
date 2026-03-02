# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

Static Hugo site (SSG) — "Sovereign Tech Directory". Data lives in YAML (`data/tools/`, `data/categories/`), sovereignty scores are generated pre-build by `tsx scripts/score-tools.ts`. No database, no backend, no user accounts.

### Required tooling (pre-installed in snapshot)

| Tool | Version | Notes |
|------|---------|-------|
| Hugo extended | 0.156.0 | Binary at `~/.local/hugo/hugo`; `~/.bashrc` adds it to `PATH` |
| Go | system (1.22+) | Only used for Hugo module resolution (`hugo-mod-heroicons`) |
| Node.js | 22 (CI pins 20, 22 is compatible) | npm is the package manager |

### Key commands

See `docs/development.md` for full details. Quick reference:

- **Dev server:** `npm run dev` → starts score generation + Hugo server on `localhost:1313` with file watcher
- **Build:** `npm run build` → score generation + Hugo production build into `public/`
- **Tests:** `npm test` (Vitest, 26 unit tests in `scripts/__tests__/`)
- **Score generation only:** `npm run score`
- **SEO check (post-build):** `npm run seo:check`

### Non-obvious caveats

- Hugo must be the **extended** variant (needed for PostCSS/Tailwind via Hugo Pipes).
- `npm run dev` (via `scripts/dev.ts`) watches `data/tools/*.yaml` and automatically re-runs score generation when tool YAML files change. You do **not** need to restart the dev server after editing YAML data.
- The project has no dedicated lint command. Code quality is enforced via Husky + commitlint (conventional commits on `commit-msg` hook).
- Go modules are fetched automatically by Hugo on first build; no manual `go mod download` needed.
- The `PATH` must include `~/.local/hugo` for the Hugo binary. This is configured in `~/.bashrc`.
