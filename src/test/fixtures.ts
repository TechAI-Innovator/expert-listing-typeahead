import type { GeoResult, Location } from "@/lib/locations";

export const lagosGeo: GeoResult = {
  id: 2332459,
  name: "Lagos",
  latitude: 6.45407,
  longitude: 3.39467,
  country: "Nigeria",
  country_code: "NG",
  admin1: "Lagos",
  population: 15388000,
};

export const nairobiGeo: GeoResult = {
  id: 184745,
  name: "Nairobi",
  latitude: -1.28333,
  longitude: 36.81667,
  country: "Kenya",
  country_code: "KE",
  admin1: "Nairobi",
  population: 4397073,
};

export const lagos: Location = {
  id: 2332459,
  name: "Lagos",
  country: "Nigeria",
  countryCode: "NG",
  region: "Lagos",
  latitude: 6.45407,
  longitude: 3.39467,
  population: 15388000,
};

export const nairobi: Location = {
  id: 184745,
  name: "Nairobi",
  country: "Kenya",
  countryCode: "KE",
  region: "Nairobi",
  latitude: -1.28333,
  longitude: 36.81667,
  population: 4397073,
};

export function jsonResponse(data: unknown, ok = true, status = 200) {
  return {
    ok,
    status,
    json: async () => data,
  };
}
