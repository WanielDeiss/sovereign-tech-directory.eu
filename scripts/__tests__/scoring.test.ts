import { describe, it, expect } from "vitest";
import { computeSovereigntyScore, normalizeDataResidency } from "../lib/scoring.js";
import type { ToolData } from "../lib/types.js";

function tool(overrides: Partial<ToolData> & Pick<ToolData, "id" | "name" | "description" | "category" | "website" | "last_reviewed">): ToolData {
  return {
    id: overrides.id,
    name: overrides.name,
    description: overrides.description,
    category: overrides.category,
    countries: overrides.countries ?? [],
    eu_company: overrides.eu_company,
    data_residency: overrides.data_residency,
    open_source: overrides.open_source,
    self_hostable: overrides.self_hostable,
    open_standards: overrides.open_standards,
    data_portability: overrides.data_portability,
    alternatives_to: overrides.alternatives_to,
    website: overrides.website,
    last_reviewed: overrides.last_reviewed,
  };
}

describe("computeSovereigntyScore", () => {
  it("EU OSS self-hostable (Nextcloud-like) scores 10.0 with high confidence", () => {
    const t = tool({
      id: "nextcloud",
      name: "Nextcloud",
      description: "Self-hosted productivity platform.",
      category: "cloud-storage",
      countries: ["DE"],
      eu_company: true,
      data_residency: "EU",
      open_source: true,
      self_hostable: true,
      open_standards: true,
      data_portability: "full",
      website: "https://nextcloud.com",
      last_reviewed: "2026-01",
    });
    const r = computeSovereigntyScore(t);
    expect(r.sovereignty_score).toBe(10);
    expect(r.score_confidence).toBe("high");
    expect(r.sovereignty_breakdown.legal_jurisdiction).toBe(2);
    expect(r.sovereignty_breakdown.data_control).toBe(2);
    expect(r.sovereignty_breakdown.openness).toBe(2);
    expect(r.sovereignty_breakdown.lock_in).toBe(2);
    expect(r.sovereignty_breakdown.operational_autonomy).toBe(2);
  });

  it("EU closed-source SaaS scores low (~4.0) with high confidence", () => {
    const t = tool({
      id: "closed-saas",
      name: "Closed SaaS",
      description: "EU vendor, closed source.",
      category: "analytics",
      countries: ["DE"],
      eu_company: true,
      data_residency: "EU",
      open_source: false,
      self_hostable: false,
      open_standards: false,
      data_portability: "none",
      website: "https://example.com",
      last_reviewed: "2026-01",
    });
    const r = computeSovereigntyScore(t);
    expect(r.sovereignty_score).toBe(4);
    expect(r.score_confidence).toBe("high");
    expect(r.sovereignty_breakdown.legal_jurisdiction).toBe(2);
    expect(r.sovereignty_breakdown.data_control).toBe(1.5);
    expect(r.sovereignty_breakdown.openness).toBe(0);
    expect(r.sovereignty_breakdown.lock_in).toBe(0);
    expect(r.sovereignty_breakdown.operational_autonomy).toBe(0.5);
  });

  it("adequacy-only (GB) OSS self-hostable with EU data_residency (Element-like) scores 8.5 with high confidence", () => {
    const t = tool({
      id: "element",
      name: "Element",
      description: "Matrix client.",
      category: "communication",
      countries: ["GB"],
      eu_company: false,
      data_residency: "EU",
      open_source: true,
      self_hostable: true,
      open_standards: true,
      data_portability: "full",
      website: "https://element.io",
      last_reviewed: "2026-01",
    });
    const r = computeSovereigntyScore(t);
    expect(r.sovereignty_score).toBe(8.5);
    expect(r.score_confidence).toBe("high");
    expect(r.sovereignty_breakdown.legal_jurisdiction).toBe(0.5);
    expect(r.sovereignty_breakdown.data_control).toBe(2);
    expect(r.sovereignty_breakdown.openness).toBe(2);
    expect(r.sovereignty_breakdown.lock_in).toBe(2);
    expect(r.sovereignty_breakdown.operational_autonomy).toBe(2);
  });

  it("EFTA (CH only) gets legal_jurisdiction 1.5 when eu_company true, 1.0 when false", () => {
    const base = {
      id: "swiss-tool",
      name: "Swiss Tool",
      description: "Vendor in Switzerland.",
      category: "communication",
      countries: ["CH"],
      data_residency: "EU" as const,
      open_source: true,
      self_hostable: true,
      open_standards: true,
      data_portability: "full",
      website: "https://example.ch",
      last_reviewed: "2026-01",
    };
    const rTrue = computeSovereigntyScore(tool({ ...base, eu_company: true }));
    expect(rTrue.sovereignty_breakdown.legal_jurisdiction).toBe(1.5);
    const rFalse = computeSovereigntyScore(tool({ ...base, eu_company: false }));
    expect(rFalse.sovereignty_breakdown.legal_jurisdiction).toBe(1);
  });

  it("UNKNOWN data_residency reduces data_control and sets confidence to medium when other fields unknown", () => {
    const t = tool({
      id: "unknown-residency",
      name: "Unknown Residency",
      description: "Unclear where data lives.",
      category: "analytics",
      countries: ["DE"],
      eu_company: true,
      data_residency: "Unknown",
      open_source: true,
      self_hostable: true,
      open_standards: false,
      data_portability: "unknown",
      website: "https://example.com",
      last_reviewed: "2026-01",
    });
    const r = computeSovereigntyScore(t);
    expect(r.sovereignty_breakdown.data_control).toBe(1);
    expect(r.score_confidence).toBe("medium");
  });

  it("missing open_source defaults to false and sets confidence to low", () => {
    const t = tool({
      id: "no-open-source-field",
      name: "No Open Source Field",
      description: "Field not set.",
      category: "development",
      countries: ["DE"],
      eu_company: true,
      data_residency: "EU",
      self_hostable: true,
      website: "https://example.com",
      last_reviewed: "2026-01",
    });
    const r = computeSovereigntyScore(t);
    expect(r.score_confidence).toBe("low");
    expect(r.sovereignty_breakdown.openness).toBe(0);
    expect(r.sovereignty_breakdown.operational_autonomy).toBe(1.5);
  });

  it("self_hostable false and open_source true: data_control and operational_autonomy are independent", () => {
    const t = tool({
      id: "oss-saas",
      name: "OSS SaaS",
      description: "Open source but only cloud.",
      category: "communication",
      countries: ["DE"],
      eu_company: true,
      data_residency: "EU",
      open_source: true,
      self_hostable: false,
      open_standards: true,
      data_portability: "full",
      website: "https://example.com",
      last_reviewed: "2026-01",
    });
    const r = computeSovereigntyScore(t);
    expect(r.sovereignty_breakdown.data_control).toBe(1.5);
    expect(r.sovereignty_breakdown.operational_autonomy).toBe(1);
    expect(r.sovereignty_breakdown.openness).toBe(2);
    expect(r.sovereignty_breakdown.lock_in).toBe(2);
  });

  it("empty countries list lowers confidence", () => {
    const t = tool({
      id: "empty-countries",
      name: "Empty Countries",
      description: "Countries missing in practice.",
      category: "communication",
      countries: [],
      eu_company: true,
      data_residency: "EU",
      open_source: true,
      self_hostable: true,
      open_standards: true,
      data_portability: "full",
      website: "https://example.com",
      last_reviewed: "2026-01",
    });
    const r = computeSovereigntyScore(t);
    expect(r.score_confidence).toBe("medium");
  });
});

describe("normalizeDataResidency", () => {
  it("maps Global to NON_EU", () => {
    expect(normalizeDataResidency("Global")).toBe("NON_EU");
  });
  it("maps EWR to EEA", () => {
    expect(normalizeDataResidency("EWR")).toBe("EEA");
  });
  it("maps Unknown to UNKNOWN", () => {
    expect(normalizeDataResidency("Unknown")).toBe("UNKNOWN");
  });
  it("keeps EU, EEA, NON_EU as-is", () => {
    expect(normalizeDataResidency("EU")).toBe("EU");
    expect(normalizeDataResidency("EEA")).toBe("EEA");
    expect(normalizeDataResidency("NON_EU")).toBe("NON_EU");
  });
  it("returns UNKNOWN for empty or missing", () => {
    expect(normalizeDataResidency("")).toBe("UNKNOWN");
    expect(normalizeDataResidency(undefined)).toBe("UNKNOWN");
  });
});
