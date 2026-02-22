# SEO Implementation Plan v2 (2026-02-22)

This version incorporates clarified product decisions from stakeholder feedback.

## 1) Final decisions (locked)

1. No staging/preview environment is available.
2. `/imprint/` and `/search/` must be non-indexable.
3. No OG image exists yet; one must be created.
4. Category-specific descriptions should be added to the data model.
5. Title/description quality rules are required.
6. Internal detail links on tool cards: decided here as **primary CTA**.
7. Structured data for tool detail pages: use `Product`.
8. Add CI automation for SEO guardrails.

## 2) Goal

Resolve all high and medium issues from `docs/seo-analysis-2026-02-22.md` with deterministic outputs and regression safety in CI.

Primary outcomes:

- unique, quality-controlled metadata on indexable pages
- explicit index/noindex policy by page type
- complete canonical + social metadata + robots coverage
- improved internal crawl path to tool detail pages
- baseline structured data for discoverability

## 3) Scope

Included:

- technical SEO in Hugo templates/config/data
- on-page metadata quality (title/description constraints)
- crawl/index controls (`robots.txt`, sitemap relevance, utility pages)
- social cards (including share image)
- internal linking and structured data baseline
- CI checks for SEO regressions

Excluded:

- backlink strategy
- external keyword research
- paid/social campaign planning

## 4) Indexability policy (explicit)

### Indexable

- `/`
- `/tools/`
- `/tools/<id>/`
- `/categories/`
- `/categories/<id>/`
- `/sovereignty-score/`
- `/about/`

### Non-indexable

- `/search/`
- `/imprint/`
- `/tags/` (remove output entirely if unused)

Implementation note:

- Prefer `noindex,follow` for `/search/` and `/imprint/`.
- Also remove these two from sitemap to keep sitemap focused on indexable URLs.

## 5) Workstreams and execution order

1. **P0 Metadata + index policy core**
2. **P1 Social metadata + OG image**
3. **P1 Internal linking**
4. **P2 Structured data**
5. **CI guardrails + rollout monitoring**

Because no staging exists, production safety relies on CI and phased, small deploys.

## 6) Detailed implementation plan

## Phase A — P0 Metadata and index policy core (Day 1)

### A1. Centralize head metadata logic

**Files**

- `layouts/_default/baseof.html`
- `layouts/partials/seo-head.html` (new)

**Tasks**

- Extract title/description/canonical/social boilerplate into one partial.
- Resolve metadata using page-type logic:
  - home/list/single pages: frontmatter first
  - tools detail: `data/tools/<id>.yaml` (`name`, `description`)
  - category detail: `data/categories/categories.yaml` (`label`, `description`)
  - final fallback: site defaults in `hugo.toml`

**Acceptance criteria**

- No `<title> | Sovereign Tech Directory</title>` in generated output.
- Tool details use tool names in title.
- Category details use category labels in title.
- Tool/category descriptions are page-specific.

### A2. Add category descriptions to data model

**Files**

- `data/categories/categories.yaml`
- `scripts/` validation logic (if category schema is validated)
- optional docs update: `docs/` data model docs

**Tasks**

- Add `description` field per category entry.
- Consume this field in metadata generation for category detail pages.

**Acceptance criteria**

- Every category has a non-empty description in data.
- Category meta descriptions are unique enough and no longer generic.

### A3. Enforce index/noindex for utility pages

**Files**

- `content/en/search.md`
- `content/en/imprint.md`
- `layouts/partials/seo-head.html`

**Tasks**

- Add frontmatter flag for robots (e.g. `robots: "noindex,follow"`).
- Render `<meta name="robots" ...>` when flag is set.
- Ensure page-type fallback keeps key pages indexable.

**Acceptance criteria**

- `/search/` and `/imprint/` output `noindex,follow`.
- All other target pages remain indexable.

## Phase B — P1 Social metadata and robots output (Day 1–2)

### B1. Canonical on all indexable pages

**Files**

- `layouts/partials/seo-head.html`

**Tasks**

- Emit one absolute canonical URL per page (`.Permalink`).

**Acceptance criteria**

- Exactly one canonical tag on each indexable HTML page.

### B2. Open Graph + Twitter complete set

**Files**

- `layouts/partials/seo-head.html`
- `hugo.toml` (`[params]` defaults)

**Tasks**

- Add:
  - `og:title`, `og:description`, `og:type`, `og:url`, `og:image`, `og:image:alt`
  - `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
- Reuse resolved title/description variables from A1.

**Acceptance criteria**

- Key pages render full OG/Twitter metadata.
- Shared previews are page-specific and include image.

### B3. Create default OG image asset

**Files**

- `static/images/social/og-default.png` (1200x630, new)
- optional editable source: `assets/images/social/og-default.svg` (new)

**Tasks**

- Create branded default image for social sharing.
- Add clear alt text in metadata (`og:image:alt`).
- Ensure image URL is absolute in generated meta tags.

**Acceptance criteria**

- `og:image` points to valid, publicly reachable PNG.
- Social debugger tools can fetch the image.

### B4. Enable robots.txt and keep sitemap focused

**Files**

- `hugo.toml`
- optional `layouts/robots.txt`

**Tasks**

- Enable `enableRobotsTXT = true`.
- Include sitemap URL in robots output.
- Remove `/tags/` generation if taxonomy is unused.
- Exclude noindex utility pages from sitemap (search/imprint).

**Acceptance criteria**

- `public/robots.txt` exists and references sitemap.
- `/tags/` removed from output and sitemap.
- `/search/` and `/imprint/` absent from sitemap.

## Phase C — P1 Internal linking (Day 2)

### C1. Make internal detail path primary on tool cards

**Decision rationale**

- Improves crawl depth and discovery of key landing pages.
- Keeps external website as secondary user option.

**Files**

- `layouts/partials/tool-card.html`
- `i18n/en.yaml` (new label, e.g. `label_view_details`)

**Tasks**

- Link tool name and primary CTA to `/tools/<id>/`.
- Keep vendor website link as secondary action.

**Acceptance criteria**

- `/tools/` links to all `/tools/<id>/` pages.
- User can still reach vendor site from each card.

## Phase D — P2 Structured data (Day 3)

### D1. Add JSON-LD partials with fixed type choice

**Files**

- `layouts/partials/seo-jsonld.html` (new)
- `layouts/_default/baseof.html`

**Tasks**

- Implement:
  - Home: `WebSite`
  - Listing pages: `ItemList`
  - Tool detail pages: `Product` (fixed decision)
- Use `jsonify` to avoid escaping errors.

**Acceptance criteria**

- Valid JSON-LD emitted on target templates.
- Schema validators show no critical errors.

## 7) Metadata quality rules (enforced)

## Title

- Target length: 45-60 characters (soft bound).
- Must be unique across indexable pages.
- Pattern:
  - home: `Sovereign Tech Directory`
  - detail/list: `<page-specific title> | Sovereign Tech Directory`

## Description

- Target length: 140-160 characters (soft bound).
- Must be specific (no generic global fallback on tool/category details).
- Must be unique per tool detail page.

## 8) CI guardrails (required)

Add a dedicated SEO check step to CI:

1. `npm run build`
2. script-based assertions (new script, e.g. `scripts/seo-check.ts`) to validate:
   - no empty title pattern
   - canonical present exactly once on indexable pages
   - OG/Twitter tags present
   - `noindex,follow` present on `/search/` and `/imprint/`
   - `/tags/` not generated
   - `/search/` and `/imprint/` not present in `sitemap.xml`
   - no duplicate titles among indexable pages

Expose as npm script:

- `npm run seo:check`

CI should fail on any violation.

## 9) QA checklist (manual spot checks)

After each phase:

1. Run `npm run build`
2. Validate generated files:
   - `/index.html`
   - `/tools/index.html`
   - `/tools/nextcloud/index.html`
   - `/categories/analytics/index.html`
   - `/search/index.html`
   - `/imprint/index.html`
   - `/robots.txt`
   - `/sitemap.xml`
3. Confirm OG image loads in browser and social debugger.

## 10) Rollout strategy (chosen)

Given no staging:

- release **P0 + P1 together** in one controlled deploy (metadata + index policy + robots/social)
- release **P1 internal linking** and **P2 schema** in follow-up small deploys
- keep commits small and self-contained

## 11) Risks and mitigations

- **Risk:** accidental deindexing of important pages  
  **Mitigation:** explicit allowlist of indexable page types + CI assertions.

- **Risk:** wrong canonical host/path  
  **Mitigation:** canonical checks against `baseURL` in CI.

- **Risk:** OG image path breaks after deployment  
  **Mitigation:** absolute URL generation + fetch check in CI if possible.

- **Risk:** metadata drift across tags  
  **Mitigation:** compute metadata once in partial and reuse for title/OG/Twitter.

## 12) Definition of done

All are true:

- No empty/blank titles in generated HTML.
- Tool and category pages have specific descriptions.
- Category descriptions exist in data model.
- `/search/` and `/imprint/` are `noindex,follow` and not in sitemap.
- Canonical + OG + Twitter tags available on all indexable key pages.
- Default OG image exists and is referenced.
- `/tags/` is not generated.
- `/tools/` provides internal links to all tool details.
- JSON-LD (`WebSite`, `ItemList`, `Product`) is valid.
- `npm run seo:check` passes in CI.
