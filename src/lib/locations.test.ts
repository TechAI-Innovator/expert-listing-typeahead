import { describe, expect, it } from "vitest";
import { normalizeLocations } from "@/lib/locations";
import { lagosGeo } from "@/test/fixtures";

describe("normalizeLocations", () => {
  it("maps Open-Meteo fields onto the UI model", () => {
    const [location] = normalizeLocations([lagosGeo]);

    expect(location).toMatchObject({
      id: 2332459,
      name: "Lagos",
      country: "Nigeria",
      countryCode: "NG",
      region: "Lagos",
      population: 15388000,
    });
  });

  it("fills safe defaults when optional fields are missing", () => {
    const [location] = normalizeLocations([
      {
        id: 1,
        name: "Somewhere",
        latitude: 0,
        longitude: 0,
      },
    ]);

    expect(location).toMatchObject({
      country: "Unknown",
      countryCode: "",
      region: "",
      population: null,
    });
  });
});
