/**
 * EU member states (ISO 3166-1 alpha-2).
 * 27 members as of 2024.
 */
export const EU_COUNTRIES = new Set([
  "AT", "BE", "BG", "CY", "CZ", "DE", "DK", "EE", "ES", "FI", "FR", "GR", "HR",
  "HU", "IE", "IT", "LT", "LU", "LV", "MT", "NL", "PL", "PT", "RO", "SE", "SI", "SK",
]);

/**
 * EEA countries that are not EU members: Iceland, Liechtenstein, Norway.
 */
export const EEA_EXTRA = new Set(["IS", "LI", "NO"]);

/**
 * EFTA member states: Iceland, Liechtenstein, Norway, Switzerland.
 * Used for legal_jurisdiction scoring (efta classification).
 */
export const EFTA_COUNTRIES = new Set(["IS", "LI", "NO", "CH"]);

/**
 * Countries with EU adequacy decision (simplified list; not exhaustive).
 * Used for legal_jurisdiction scoring.
 */
export const ADEQUACY_COUNTRIES = new Set([
  "AD", "AR", "CA", "CH", "FO", "GB", "GG", "IL", "IM", "JE", "JP", "KR", "NZ", "UY",
]);

const EEA_COUNTRIES = new Set([...EU_COUNTRIES, ...EEA_EXTRA]);

const EU_OR_EEA_OR_ADEQUACY = new Set([
  ...EU_COUNTRIES,
  ...EEA_EXTRA,
  ...ADEQUACY_COUNTRIES,
]);

export type CountryClassification = "eu" | "eea" | "efta" | "adequacy" | "mixed" | "non_eu";

/**
 * Classifies a list of country codes for sovereignty scoring.
 * Returns the strictest classification that applies to the set.
 * Order: eu → eea → efta (at least one EFTA country) → adequacy → mixed → non_eu.
 */
export function classifyCountries(countries: string[]): CountryClassification {
  if (!countries || countries.length === 0) {
    return "non_eu";
  }
  const set = new Set(countries.map((c) => c.toUpperCase()));
  const allInEu = set.size > 0 && [...set].every((c) => EU_COUNTRIES.has(c));
  if (allInEu) return "eu";

  const allInEea = set.size > 0 && [...set].every((c) => EEA_COUNTRIES.has(c));
  const hasEeaExtra = [...set].some((c) => EEA_EXTRA.has(c));
  if (allInEea && hasEeaExtra) return "eea";

  const allInEuEeaAdequacy = [...set].every((c) => EU_OR_EEA_OR_ADEQUACY.has(c));
  const hasAnyEfta = [...set].some((c) => EFTA_COUNTRIES.has(c));
  if (allInEuEeaAdequacy && hasAnyEfta) return "efta";

  const hasOnlyAdequacy =
    [...set].some((c) => ADEQUACY_COUNTRIES.has(c) && !EEA_COUNTRIES.has(c)) &&
    ![...set].some((c) => EFTA_COUNTRIES.has(c));
  if (allInEuEeaAdequacy && hasOnlyAdequacy) return "adequacy";

  const hasEuEeaAdequacy = [...set].some((c) => EU_OR_EEA_OR_ADEQUACY.has(c));
  const hasOther = [...set].some((c) => !EU_OR_EEA_OR_ADEQUACY.has(c));
  if (hasEuEeaAdequacy && hasOther) return "mixed";

  return "non_eu";
}
