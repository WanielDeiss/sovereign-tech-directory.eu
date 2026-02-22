import { describe, it, expect } from "vitest";
import { classifyCountries } from "../lib/country-lists.js";

describe("classifyCountries", () => {
  it("returns eu when all countries are EU only", () => {
    expect(classifyCountries(["DE"])).toBe("eu");
    expect(classifyCountries(["DE", "FR", "NL"])).toBe("eu");
  });

  it("returns eea when all are EEA and at least one is non-EU EEA", () => {
    expect(classifyCountries(["NO"])).toBe("eea");
    expect(classifyCountries(["IS", "LI"])).toBe("eea");
    expect(classifyCountries(["DE", "NO"])).toBe("eea");
  });

  it("returns efta when all in EU/EEA/EFTA/adequacy and at least one is EFTA", () => {
    expect(classifyCountries(["CH"])).toBe("efta");
    expect(classifyCountries(["DE", "CH"])).toBe("efta");
    expect(classifyCountries(["CH", "GB"])).toBe("efta");
  });

  it("returns adequacy when all in EU/EEA/adequacy and none is EFTA", () => {
    expect(classifyCountries(["GB"])).toBe("adequacy");
    expect(classifyCountries(["JP"])).toBe("adequacy");
  });

  it("returns mixed when some in EU/EEA/EFTA/adequacy and some outside", () => {
    expect(classifyCountries(["NL", "US"])).toBe("mixed");
    expect(classifyCountries(["DE", "US"])).toBe("mixed");
  });

  it("returns non_eu when none in EU/EEA/EFTA/adequacy or empty", () => {
    expect(classifyCountries(["US"])).toBe("non_eu");
    expect(classifyCountries([])).toBe("non_eu");
    expect(classifyCountries(undefined as unknown as string[])).toBe("non_eu");
  });

  it("normalises country codes to uppercase", () => {
    expect(classifyCountries(["ch"])).toBe("efta");
    expect(classifyCountries(["gb"])).toBe("adequacy");
  });
});
