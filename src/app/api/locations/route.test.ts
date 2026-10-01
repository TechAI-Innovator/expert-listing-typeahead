import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "@/app/api/locations/route";
import { jsonResponse, lagosGeo } from "@/test/fixtures";

describe("GET /api/locations", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns an empty list for short queries without calling the upstream API", async () => {
    const response = await GET(new Request("http://localhost/api/locations?q=l"));
    const body = await response.json();

    expect(body.results).toEqual([]);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("treats a missing results array as empty", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({}) as Response);

    const response = await GET(
      new Request("http://localhost/api/locations?q=zzzz"),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.results).toEqual([]);
  });

  it("normalizes a successful upstream response", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({ results: [lagosGeo] }) as Response,
    );

    const response = await GET(
      new Request("http://localhost/api/locations?q=lagos"),
    );
    const body = await response.json();

    expect(body.results[0]).toMatchObject({
      id: 2332459,
      name: "Lagos",
      country: "Nigeria",
      countryCode: "NG",
    });
  });
});
