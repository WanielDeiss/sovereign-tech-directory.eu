# SEO Analysis Report (2026-02-22)

## Scope

This audit covers technical and on-page SEO for the current Hugo setup of `sovereign-tech-directory.eu`, based on:

- source templates and content files
- generated output from a local Hugo build

## Method

Checked the following areas:

- title and meta description quality
- indexability (robots, sitemap)
- crawlability and internal linking
- social sharing metadata (Open Graph / Twitter)
- structured data (JSON-LD)
- thin or low-value pages in index

## Key Findings

### 1) Empty `<title>` on tool and category detail pages (high)

In generated HTML, multiple detail pages render as:

- `<title> | Sovereign Tech Directory</title>`

Observed on all tool detail pages and all category detail pages.

Impact:

- weak relevance signals for search engines
- lower click-through rates in SERPs
- duplicated/near-empty title patterns across important landing pages

Likely source:

- `layouts/_default/baseof.html` uses `.Title`
- corresponding content files (`content/en/tools/*.md`, `content/en/categories/*.md`) currently set `title: ""`

### 2) Generic meta descriptions on many pages (high)

A large share of pages reuses the site-wide fallback:

- `A curated directory for digital sovereignty in Europe`

This appears on tool details, category details, and tags.

Impact:

- less specific snippets in search results
- reduced differentiation between pages

Likely source:

- `layouts/_default/baseof.html` fallback to `.Site.Params.description` when page descriptions are missing

### 3) Missing canonical URLs (medium)

No `rel="canonical"` tag found in generated pages.

Impact:

- harder canonicalization if alternate URLs emerge (trailing slash variants, parameterized URLs, mirrored environments)

### 4) Missing Open Graph / Twitter metadata (medium)

No `og:*` or `twitter:*` tags found in generated pages.

Impact:

- weak previews when pages are shared on social platforms
- lower referral CTR from social channels

### 5) No `robots.txt` generated (medium)

No `robots.txt` found in generated output.

Impact:

- no explicit crawler directives
- no explicit sitemap declaration in robots

### 6) Limited crawl path to tool detail pages (medium)

`/tools/` cards link to vendor websites but not to internal tool detail pages.
Internal links to `/tools/<id>/` are mainly concentrated on `/categories/`.

Impact:

- weaker internal link graph to key detail pages
- reduced discoverability and internal PageRank flow

Likely source:

- `layouts/partials/tool-card.html` lacks link to internal detail URL

### 7) Thin `/tags/` page indexed and present in sitemap (low)

`/tags/` exists but has no meaningful content.

Impact:

- low-value indexable URL in sitemap
- potential quality dilution

## Positive Signals

- XML sitemap is generated and includes key sections and detail pages.
- Semantic heading structure is generally clean (`h1` per page, section headings).
- Core pages (home, tools index, categories index, about, search) have explicit titles and descriptions.
- Performance-oriented asset pipeline with minification/fingerprinting is in place.

## Prioritized Recommendations

## P0 (immediate)

1. Fix detail page title generation:
   - derive title from data model for tools/categories in `<head>`
2. Provide unique meta descriptions for:
   - tool pages (`tool.description`)
   - category pages (category label + context sentence)

## P1 (next)

3. Add canonical tag for all pages.
4. Add Open Graph + Twitter Card defaults and page-specific overrides.
5. Enable `robots.txt` and include sitemap URL.

## P2 (afterward)

6. Add internal detail links from `/tools/` cards.
7. Disable unused taxonomy pages (`tags`) or mark as non-index.
8. Add JSON-LD:
   - `WebSite` for home
   - `ItemList` for listing pages
   - `SoftwareApplication` (or `Product`) for tool detail pages

## Suggested KPIs after implementation

- 100% pages with non-empty, unique titles
- 100% indexable pages with specific meta descriptions
- 100% pages with canonical URLs
- improved CTR on tool/category landing pages in Search Console
