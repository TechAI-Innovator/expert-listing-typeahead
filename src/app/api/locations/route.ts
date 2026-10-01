import { NextResponse } from "next/server";
import { normalizeLocations, type GeoResult } from "@/lib/locations";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";

  if (query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const upstream = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=8&language=en&format=json`,
      { cache: "no-store" },
    );

    if (!upstream.ok) {
      return NextResponse.json(
        { error: "The location service is unavailable." },
        { status: 502 },
      );
    }

    const data = (await upstream.json()) as { results?: GeoResult[] };
    return NextResponse.json({
      results: normalizeLocations(data.results ?? []),
    });
  } catch {
    return NextResponse.json(
      { error: "Could not reach the location service." },
      { status: 502 },
    );
  }
}
