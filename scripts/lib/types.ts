/**
 * Data residency: where the vendor stores data by default (or where self-hosted users typically host).
 * Normalized from legacy values: Global -> NON_EU, EWR -> EEA, Unknown -> UNKNOWN.
 */
export type DataResidency = "EU" | "EEA" | "NON_EU" | "UNKNOWN";

/**
 * Data portability: can users export their data in a usable way?
 * Optional field; default is "unknown".
 */
export type DataPortability = "full" | "partial" | "none" | "unknown";

export type ScoreConfidence = "low" | "medium" | "high";

export interface SovereigntyBreakdown {
  legal_jurisdiction: number;
  data_control: number;
  openness: number;
  lock_in: number;
  operational_autonomy: number;
}

export interface ScoreResult {
  sovereignty_score: number;
  sovereignty_breakdown: SovereigntyBreakdown;
  score_confidence: ScoreConfidence;
}

/**
 * Raw tool data as read from YAML.
 * All scoring-relevant fields are optional for conservative defaults when missing.
 */
export interface ToolData {
  id: string;
  name: string;
  description: string;
  category: string;
  countries: string[];
  eu_company?: boolean;
  data_residency?: string;
  open_source?: boolean;
  self_hostable?: boolean;
  open_standards?: boolean;
  data_portability?: string;
  alternatives_to?: string[];
  website: string;
  last_reviewed: string;
}

/**
 * Tool with computed score, for JSON output.
 */
export interface ToolWithScore extends ToolData {
  sovereignty_score: number;
  sovereignty_breakdown: SovereigntyBreakdown;
  score_confidence: ScoreConfidence;
}
