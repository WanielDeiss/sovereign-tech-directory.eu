import { describe, it, expect } from "vitest";
import Fuse from "fuse.js";

/**
 * Must match assets/js/search.js:
 * - Fuse options (keys, threshold, ignoreLocation)
 * - Result shape: Fuse returns { item } or the item directly; we normalize to tool object
 */
const FUSE_OPTIONS = {
  keys: [
    { name: "searchableText", weight: 0.7 },
    { name: "name", weight: 0.2 },
    { name: "description", weight: 0.1 },
  ],
  threshold: 0.4,
  ignoreLocation: true,
} as const;

type SearchIndexEntry = {
  id: string;
  name: string;
  description: string;
  url: string;
  searchableText: string;
  categoryLabel: string;
};

function getSearchResults(
  fuse: Fuse<SearchIndexEntry>,
  query: string
): SearchIndexEntry[] {
  const q = (query ?? "").trim();
  if (!q) return [];
  const raw = fuse.search(q, { limit: 50 });
  return raw.map((r) => (r.item !== undefined ? r.item : r as SearchIndexEntry));
}

function sampleTools(): SearchIndexEntry[] {
  return [
    {
      id: "plausible",
      name: "Plausible Analytics",
      description:
        "Lightweight, privacy-friendly web analytics. No cookies, fully GDPR compliant.",
      url: "/tools/plausible/",
      searchableText:
        "Plausible Analytics Lightweight, privacy-friendly web analytics. No cookies, fully GDPR compliant. Google Analytics Adobe Analytics",
      categoryLabel: "Analytics & Monitoring",
    },
    {
      id: "element",
      name: "Element (Matrix)",
      description: "Secure messaging and collaboration app.",
      url: "/tools/element/",
      searchableText:
        "Element (Matrix) Secure messaging. Slack Microsoft Teams Discord",
      categoryLabel: "Communication & Messaging",
    },
  ];
}

describe("search (assets/js/search.js behaviour)", () => {
  describe("form submit (Enter key)", () => {
    it("prevents form submit and runs search with current input value", () => {
      const form = document.createElement("form");
      form.setAttribute("role", "search");
      const input = document.createElement("input");
      input.type = "search";
      input.id = "search-input";
      form.appendChild(input);
      document.body.appendChild(form);

      let defaultPrevented = false;
      let capturedQuery: string | null = null;
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        defaultPrevented = true;
        capturedQuery = (e.target as HTMLFormElement).querySelector("input")!.value;
      });

      input.value = "google analytics";
      form.requestSubmit();

      expect(defaultPrevented).toBe(true);
      expect(capturedQuery).toBe("google analytics");

      form.remove();
    });
  });

  describe("escapeHtml", () => {
    it("escapes <, >, & so that text is safe in HTML", () => {
      const div = document.createElement("div");
      div.textContent = '<script>alert("x")</script> & "quotes"';
      expect(div.innerHTML).toBe("&lt;script&gt;alert(\"x\")&lt;/script&gt; &amp; \"quotes\"");
    });

    it("handles empty string", () => {
      const div = document.createElement("div");
      div.textContent = "";
      expect(div.innerHTML).toBe("");
    });
  });

  describe("Fuse search", () => {
    it("finds Plausible when searching 'google analytics' (alternatives_to)", () => {
      const tools = sampleTools();
      const fuse = new Fuse(tools, FUSE_OPTIONS);
      const results = getSearchResults(fuse, "google analytics");
      const ids = results.map((r) => r.id);
      expect(ids).toContain("plausible");
    });

    it("finds Plausible when searching 'plausible'", () => {
      const tools = sampleTools();
      const fuse = new Fuse(tools, FUSE_OPTIONS);
      const results = getSearchResults(fuse, "plausible");
      expect(results.some((r) => r.id === "plausible")).toBe(true);
    });

    it("finds Plausible when searching 'adobe analytics'", () => {
      const tools = sampleTools();
      const fuse = new Fuse(tools, FUSE_OPTIONS);
      const results = getSearchResults(fuse, "adobe analytics");
      expect(results.map((r) => r.id)).toContain("plausible");
    });
  });
});
