#!/usr/bin/env node
/**
 * SEO check: validates generated public/ output against SEO rules.
 * Hard fail: empty title, missing canonical, noindex/sitemap/OG violations.
 * Soft warn: title/description length, duplicate titles.
 * Run after build: npm run build && npm run seo:check
 */
import { readFile, readdir, access } from "node:fs/promises";
import { join } from "node:path";

const PUBLIC_DIR = process.env.PUBLIC_DIR || join(process.cwd(), "public");

const EMPTY_TITLE_PATTERN = /<title>\s*\|\s*Sovereign Tech Directory<\/title>|<title>\s*<\/title>/i;
const TITLE_TAG = /<title>([^<]*)<\/title>/i;

/** Match canonical link; minified HTML may use unquoted attributes (rel=canonical href=...) */
const CANONICAL_PATTERN = /<link\s+rel=["']?canonical["']?\s+href=/i;
/** Match noindex,follow; minified may use name=robots and optional space after comma */
const ROBOTS_NOINDEX = /<meta\s+name=["']?robots["']?\s+content=["']?noindex\s*,\s*follow["']?/i;
/** Match og:title meta; minified may use unquoted attribute names */
const OG_TITLE = /<meta\s+property=["']?og:title["']?\s+content=/i;
/** Match twitter:card meta; minified may use name=twitter:card */
const TWITTER_CARD = /<meta\s+name=["']?twitter:card["']?\s+content=/i;

const INDEXABLE_PAGES = [
  "index.html",
  "tools/index.html",
  "tools/nextcloud/index.html",
  "categories/index.html",
  "categories/analytics/index.html",
  "about/index.html",
  "sovereignty-score/index.html",
];

const NOINDEX_PAGES = ["search/index.html", "imprint/index.html"];

let hasHardFailure = false;
const warnings: string[] = [];
const titles = new Map<string, string>();

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function readHtml(path: string): Promise<string> {
  try {
    return await readFile(path, "utf-8");
  } catch (e) {
    return "";
  }
}

function checkEmptyTitle(html: string, page: string): void {
  if (EMPTY_TITLE_PATTERN.test(html)) {
    console.error(`[FAIL] ${page}: empty or blank title pattern found`);
    hasHardFailure = true;
  }
}

function checkCanonical(html: string, page: string): void {
  const count = (html.match(new RegExp(CANONICAL_PATTERN.source, "gi")) || []).length;
  if (count !== 1) {
    console.error(`[FAIL] ${page}: expected exactly one canonical link, found ${count}`);
    hasHardFailure = true;
  }
}

function checkNoindex(html: string, page: string): void {
  if (!ROBOTS_NOINDEX.test(html)) {
    console.error(`[FAIL] ${page}: expected noindex,follow meta, not found`);
    hasHardFailure = true;
  }
}

function checkOgTwitter(html: string, page: string): void {
  if (!OG_TITLE.test(html)) {
    console.error(`[FAIL] ${page}: missing og:title`);
    hasHardFailure = true;
  }
  if (!TWITTER_CARD.test(html)) {
    console.error(`[FAIL] ${page}: missing twitter:card`);
    hasHardFailure = true;
  }
}

function extractTitle(html: string): string | null {
  const m = html.match(TITLE_TAG);
  return m ? m[1].trim() : null;
}

function warnTitleLength(title: string, page: string): void {
  const len = title.length;
  if (len < 45 || len > 60) {
    warnings.push(`${page}: title length ${len} (recommended 45–60)`);
  }
}

async function checkSitemap(): Promise<void> {
  const path = join(PUBLIC_DIR, "sitemap.xml");
  const exists = await fileExists(path);
  if (!exists) {
    console.error("[FAIL] sitemap.xml not found");
    hasHardFailure = true;
    return;
  }
  const xml = await readFile(path, "utf-8");
  if (xml.includes("/search/") || xml.includes("/imprint/")) {
    console.error("[FAIL] sitemap.xml must not contain /search/ or /imprint/");
    hasHardFailure = true;
  }
}

async function checkRobotsTxt(): Promise<void> {
  const path = join(PUBLIC_DIR, "robots.txt");
  const exists = await fileExists(path);
  if (!exists) {
    console.error("[FAIL] robots.txt not found");
    hasHardFailure = true;
    return;
  }
  const text = await readFile(path, "utf-8");
  if (!text.includes("Sitemap:") || !text.includes("sitemap.xml")) {
    console.error("[FAIL] robots.txt must reference sitemap (Sitemap: ... sitemap.xml)");
    hasHardFailure = true;
  }
}

async function checkTagsNotGenerated(): Promise<void> {
  const path = join(PUBLIC_DIR, "tags");
  const exists = await fileExists(path);
  if (exists) {
    console.error("[FAIL] /tags/ must not be generated");
    hasHardFailure = true;
  }
}

async function checkOgImageExists(): Promise<void> {
  const path = join(PUBLIC_DIR, "images", "social", "og-default.png");
  const exists = await fileExists(path);
  if (!exists) {
    console.error("[FAIL] og-default.png not found at public/images/social/");
    hasHardFailure = true;
  }
}

async function main(): Promise<void> {
  console.log("SEO check (public dir):", PUBLIC_DIR);

  for (const page of INDEXABLE_PAGES) {
    const path = join(PUBLIC_DIR, page);
    const html = await readHtml(path);
    if (!html) {
      console.error(`[FAIL] ${page}: file not found or empty`);
      hasHardFailure = true;
      continue;
    }
    checkEmptyTitle(html, page);
    checkCanonical(html, page);
    checkOgTwitter(html, page);
    const title = extractTitle(html);
    if (title) {
      titles.set(page, title);
      warnTitleLength(title, page);
    }
  }

  for (const page of NOINDEX_PAGES) {
    const path = join(PUBLIC_DIR, page);
    const html = await readHtml(path);
    if (!html) continue;
    checkNoindex(html, page);
  }

  await checkSitemap();
  await checkRobotsTxt();
  await checkTagsNotGenerated();
  await checkOgImageExists();

  const titleValues = [...titles.values()];
  const duplicates = titleValues.filter(
    (t, i) => titleValues.indexOf(t) !== i
  );
  if (duplicates.length) {
    warnings.push(`Duplicate titles found: ${[...new Set(duplicates)].join(", ")}`);
  }

  for (const w of warnings) {
    console.warn("[WARN]", w);
  }

  if (hasHardFailure) {
    process.exit(1);
  }
  console.log("SEO check passed (hard rules).");
  if (warnings.length) {
    console.log("Warnings:", warnings.length);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
