# SEO Implementation Plan (based on audit 2026-02-22)

## 1) Goal

Resolve all high and medium SEO issues from `docs/seo-analysis-2026-02-22.md` with minimal complexity and clear verification gates.

Primary outcomes:

- clean, descriptive, unique titles on all indexable pages
- page-specific meta descriptions on key landing pages
- canonical, social meta, and robots coverage
- stronger internal linking to tool detail pages

## 2) Scope

Included:

- technical SEO in Hugo templates/config
- on-page metadata quality (title/description)
- crawl/index controls (`robots.txt`, taxonomy cleanup)
- internal links and structured data basics

Excluded:

- backlink strategy
- external keyword research
- content marketing plan
- server/CDN infrastructure changes

## 3) Workstream overview and order

1. **P0 Metadata Core** (highest impact)
2. **P1 Indexability + Social Metadata**
3. **P1 Internal Linking**
4. **P2 Structured Data**
5. **QA + Monitoring Rollout**

Implementation order follows dependency: first fix page identity (title/description), then indexing/share metadata, then link graph, then schema enrichment.

## 4) Detailed implementation plan

## Phase A — P0 Metadata Core (Day 1)

### A1. Centralize SEO metadata logic

**Files**

- `layouts/_default/baseof.html`
- `layouts/partials/` (new partial, e.g. `seo-head.html`)

**Tasks**

- Extract head metadata generation into one reusable partial.
- Compute context-aware `seo_title` and `seo_description` with fallbacks:
  - home/list/single pages: frontmatter (`.Title`, `.Description`)
  - tool detail pages: derive from `data/tools/<id>.yaml` (`name`, `description`)
  - category detail pages: derive from `data/categories/categories.yaml` label + category summary template
  - final fallback: site defaults from `hugo.toml`

**Acceptance criteria**

- No generated page contains `<title> | Sovereign Tech Directory</title>`.
- Tool detail pages use tool names in title.
- Category detail pages use category labels in title.
- Descriptions are no longer generic on tool/category pages.

### A2. Keep content files lean (no forced duplication)

**Files**

- `content/en/tools/*.md`
- `content/en/categories/*.md`

**Tasks**

- Do not duplicate full text into every markdown file.
- Keep metadata logic in templates/data model to preserve single source of truth.

**Acceptance criteria**

- Existing data-driven model remains intact.
- No manual title/description maintenance burden introduced.

## Phase B — P1 Indexability and social sharing (Day 1–2)

### B1. Add canonical URLs

**Files**

- SEO head partial from Phase A

**Tasks**

- Add `<link rel="canonical" href="{{ .Permalink }}">` (or normalized absolute permalink).

**Acceptance criteria**

- Every indexable HTML page includes exactly one canonical tag.

### B2. Add Open Graph and Twitter cards

**Files**

- SEO head partial
- `hugo.toml` (`[params]` defaults for social image/site name if needed)

**Tasks**

- Add minimal but complete set:
  - `og:title`, `og:description`, `og:type`, `og:url`
  - `twitter:card`, `twitter:title`, `twitter:description`
- Reuse the same resolved SEO title/description variables from Phase A.

**Acceptance criteria**

- All key pages emit OG/Twitter metadata.
- Shared previews contain page-specific title and description.

### B3. Enable and control robots output

**Files**

- `hugo.toml`
- optional: `layouts/robots.txt` (custom template)

**Tasks**

- Enable robots generation (`enableRobotsTXT = true`).
- Ensure sitemap URL is declared in robots.
- Define default policy (`Allow: /`) for production.

**Acceptance criteria**

- `public/robots.txt` exists after build.
- Robots includes sitemap reference.

### B4. Remove low-value taxonomy pages from index

**Files**

- `hugo.toml`

**Tasks**

- Disable unused taxonomy kinds (`taxonomy`, `term`) if not needed.
- Confirm `/tags/` is no longer generated/indexed.

**Acceptance criteria**

- `/tags/` removed from output and sitemap.
- No regression on `/categories/` section pages.

## Phase C — P1 Internal linking improvement (Day 2)

### C1. Link from tool cards to internal detail pages

**Files**

- `layouts/partials/tool-card.html`
- `i18n/en.yaml` (if new link label is introduced)

**Tasks**

- Add internal link to `/tools/<id>/` from card title and/or dedicated CTA (e.g. "View details").
- Keep external vendor link but demote to secondary action.

**Acceptance criteria**

- `/tools/` page links to every tool detail page.
- Crawl path to tool detail pages exists from top navigation → tools list → detail.

## Phase D — P2 Structured data (Day 3)

### D1. Add JSON-LD partials

**Files**

- `layouts/partials/seo-jsonld.html` (new)
- `layouts/_default/baseof.html` (inject partial)

**Tasks**

- Implement lightweight schema:
  - Home: `WebSite`
  - Tools list/category pages: `ItemList`
  - Tool detail: `SoftwareApplication` (or `Product`, choose one and keep consistent)
- Generate JSON via Hugo-safe serialization (`jsonify`) to avoid invalid escaping.

**Acceptance criteria**

- Pages render valid JSON-LD blocks.
- No console/schema parse errors in validation tools.

## 5) QA and verification checklist

Run after each phase:

1. `npm run build`
2. Spot-check generated files in `public/`:
   - `/index.html`
   - `/tools/index.html`
   - `/tools/nextcloud/index.html`
   - `/categories/analytics/index.html`
   - `/sitemap.xml`
   - `/robots.txt` (after Phase B)
3. Automated grep/ripgrep checks:
   - no empty title pattern
   - canonical count matches page count
   - OG/Twitter tags present
   - `/tags/` absent (if disabled)

Suggested technical checks:

- no match: `<title> \| Sovereign Tech Directory</title>`
- no match: generic description on tool/category pages

## 6) Rollout strategy

- Merge in small commits per phase (A, B, C, D).
- Deploy after each phase if CI/build is green.
- Validate in Google Search Console:
  - URL inspection for sample tool/category pages
  - sitemap refresh
  - CTR trend on tool/category landing pages (2–4 weeks window)

## 7) Risks and mitigations

- **Risk:** wrong title resolution for data-driven pages  
  **Mitigation:** explicit branch logic for `tools` and `categories` with fallback tests.

- **Risk:** disabling taxonomies removes required pages accidentally  
  **Mitigation:** verify section-based `/categories/` remains intact before merge.

- **Risk:** inconsistent metadata between HTML title and OG title  
  **Mitigation:** compute once, reuse variables for all tags.

## 8) Definition of done

All items below are true:

- No empty/blank titles in generated HTML.
- Tool and category pages have specific descriptions.
- Canonical + OG + Twitter tags available on all key pages.
- `robots.txt` exists and references sitemap.
- Low-value `/tags/` page removed (or explicitly controlled).
- Internal links to tool detail pages exist from `/tools/`.
- Build passes and sitemap/index output is consistent.
