import type { DataResidency, DataPortability, ScoreConfidence } from "./types.js";
import type { SovereigntyBreakdown, ScoreResult, ToolData } from "./types.js";
import { classifyCountries, type CountryClassification } from "./country-lists.js";

const VALID_RESIDENCY: DataResidency[] = ["EU", "EEA", "NON_EU", "UNKNOWN"];
const VALID_PORTABILITY: DataPortability[] = ["full", "partial", "none", "unknown"];

/**
 * Normalizes legacy data_residency values to the canonical enum.
 */
export function normalizeDataResidency(raw: string | undefined): DataResidency {
  if (raw == null || raw === "") return "UNKNOWN";
  const u = raw.toUpperCase().replace(/\s/g, "_");
  if (u === "GLOBAL") return "NON_EU";
  if (u === "EWR") return "EEA";
  if (u === "UNKNOWN") return "UNKNOWN";
  if (VALID_RESIDENCY.includes(u as DataResidency)) return u as DataResidency;
  return "UNKNOWN";
}

function getDataPortability(raw: string | undefined): DataPortability {
  if (raw == null || raw === "") return "unknown";
  const lower = raw.toLowerCase();
  if (VALID_PORTABILITY.includes(lower as DataPortability)) return lower as DataPortability;
  return "unknown";
}

function scoreLegalJurisdiction(tool: ToolData): number {
  const euCompany = tool.eu_company === true;
  const countries = tool.countries ?? [];
  const classification: CountryClassification = classifyCountries(countries);

  if (euCompany && (classification === "eu" || classification === "eea")) return 2.0;
  if (euCompany && classification === "adequacy") return 1.5;
  if (euCompany && classification === "mixed") return 1.0;
  if (euCompany && classification === "non_eu") return 0.5;
  if (!euCompany && (classification === "eu" || classification === "eea")) return 1.5;
  if (!euCompany && classification === "adequacy") return 1.0;
  if (!euCompany && classification === "mixed") return 0.5;
  if (!euCompany && classification === "non_eu") return 0.0;
  return 0.0;
}

function scoreDataControl(tool: ToolData): number {
  const selfHostable = tool.self_hostable === true;
  const residency = normalizeDataResidency(tool.data_residency);

  if (selfHostable && residency === "EU") return 2.0;
  if (selfHostable && residency === "EEA") return 2.0;
  if (selfHostable && residency === "NON_EU") return 1.5;
  if (selfHostable && residency === "UNKNOWN") return 1.0;
  if (!selfHostable && residency === "EU") return 1.5;
  if (!selfHostable && residency === "EEA") return 1.0;
  if (!selfHostable && residency === "NON_EU") return 0.5;
  if (!selfHostable && residency === "UNKNOWN") return 0.0;
  return 0.0;
}

function scoreOpenness(tool: ToolData): number {
  const openSource = tool.open_source === true;
  const openStandards = tool.open_standards === true;

  if (openSource && openStandards) return 2.0;
  if (openSource && !openStandards) return 1.5;
  if (!openSource && openStandards) return 1.0;
  return 0.0;
}

function scoreLockIn(tool: ToolData): number {
  const openStandards = tool.open_standards === true;
  const portability = getDataPortability(tool.data_portability);

  let score = 0;
  if (openStandards) score += 1.0;
  if (portability === "full") score += 1.0;
  else if (portability === "partial") score += 0.5;
  return Math.min(2.0, score);
}

function scoreOperationalAutonomy(tool: ToolData): number {
  const selfHostable = tool.self_hostable === true;
  const openSource = tool.open_source === true;
  const euCompany = tool.eu_company === true;

  if (selfHostable && openSource) return 2.0;
  if (selfHostable && !openSource) return 1.5;
  if (!selfHostable && openSource) return 1.0;
  if (!selfHostable && !openSource && euCompany) return 0.5;
  return 0.0;
}

function computeScoreConfidence(tool: ToolData): ScoreConfidence {
  const hasBool = (v: unknown) => typeof v === "boolean";
  const residency = normalizeDataResidency(tool.data_residency);
  const portability = getDataPortability(tool.data_portability);

  if (!hasBool(tool.open_source) || !hasBool(tool.self_hostable)) return "low";

  const missingOrUnknown =
    (hasBool(tool.eu_company) ? 0 : 1) +
    (Array.isArray(tool.countries) && tool.countries.length > 0 ? 0 : 1) +
    (residency === "UNKNOWN" ? 1 : 0) +
    (hasBool(tool.open_standards) ? 0 : 1) +
    (portability === "unknown" ? 1 : 0);

  if (missingOrUnknown >= 3) return "low";
  if (missingOrUnknown >= 1) return "medium";
  return "high";
}

/**
 * Rounds a number to the nearest 0.5 (e.g. for sovereignty_score 0.0 to 10.0).
 */
function roundToHalf(n: number): number {
  return Math.round(n * 2) / 2;
}

/**
 * Computes the Sovereignty Score v1.0 for a single tool.
 * Deterministic; uses conservative defaults for missing fields.
 */
export function computeSovereigntyScore(tool: ToolData): ScoreResult {
  const legal_jurisdiction = scoreLegalJurisdiction(tool);
  const data_control = scoreDataControl(tool);
  const openness = scoreOpenness(tool);
  const lock_in = scoreLockIn(tool);
  const operational_autonomy = scoreOperationalAutonomy(tool);

  const breakdown: SovereigntyBreakdown = {
    legal_jurisdiction,
    data_control,
    openness,
    lock_in,
    operational_autonomy,
  };

  const rawSum =
    legal_jurisdiction + data_control + openness + lock_in + operational_autonomy;
  const sovereignty_score = Math.min(10, Math.max(0, roundToHalf(rawSum)));
  const score_confidence = computeScoreConfidence(tool);

  return {
    sovereignty_score,
    sovereignty_breakdown: breakdown,
    score_confidence,
  };
}
