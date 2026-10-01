export type Location = {
  id: number;
  name: string;
  country: string;
  countryCode: string;
  region: string;
  latitude: number;
  longitude: number;
  population: number | null;
};

export type GeoResult = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  country_code?: string;
  admin1?: string;
  population?: number;
};

export function normalizeLocations(data: GeoResult[]): Location[] {
  return data.map((place) => ({
    id: place.id,
    name: place.name,
    country: place.country ?? "Unknown",
    countryCode: (place.country_code ?? "").toUpperCase(),
    region: place.admin1 ?? "",
    latitude: place.latitude,
    longitude: place.longitude,
    population: place.population ?? null,
  }));
}

export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException
    ? error.name === "AbortError"
    : error instanceof Error && error.name === "AbortError";
}

export async function searchLocations(
  query: string,
  signal?: AbortSignal,
): Promise<Location[]> {
  const response = await fetch(
    `/api/locations?q=${encodeURIComponent(query)}`,
    { signal },
  );

  const body = (await response.json()) as {
    results?: Location[];
    error?: string;
  };

  if (!response.ok) {
    throw new Error(body.error ?? "Search failed");
  }

  return body.results ?? [];
}
