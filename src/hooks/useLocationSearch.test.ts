import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SEARCH_DEBOUNCE_MS, useLocationSearch } from "@/hooks/useLocationSearch";
import { jsonResponse, lagos, nairobi } from "@/test/fixtures";

describe("useLocationSearch", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("stays idle until the query is at least 2 characters", async () => {
    const { result } = renderHook(() => useLocationSearch("l"));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(SEARCH_DEBOUNCE_MS);
    });

    expect(result.current.status).toBe("idle");
    expect(fetch).not.toHaveBeenCalled();
  });

  it("exposes empty and error states from the API", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(jsonResponse({ results: [] }) as Response)
      .mockResolvedValueOnce(
        jsonResponse({ error: "The location service is unavailable." }, false, 502) as Response,
      );

    const { result, rerender } = renderHook(
      ({ query }) => useLocationSearch(query),
      { initialProps: { query: "zz" } },
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(SEARCH_DEBOUNCE_MS);
    });

    expect(result.current.status).toBe("empty");

    rerender({ query: "lagos" });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(SEARCH_DEBOUNCE_MS);
    });

    expect(result.current.status).toBe("error");
    expect(result.current.error).toMatch(/unavailable/i);
  });

  it("ignores a slower stale response when a newer query finishes first", async () => {
    let resolveFirst!: (value: unknown) => void;
    let resolveSecond!: (value: unknown) => void;

    vi.mocked(fetch)
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveFirst = resolve;
          }),
      )
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveSecond = resolve;
          }),
      );

    const { result, rerender } = renderHook(
      ({ query }) => useLocationSearch(query),
      { initialProps: { query: "la" } },
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(SEARCH_DEBOUNCE_MS);
    });

    rerender({ query: "na" });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(SEARCH_DEBOUNCE_MS);
    });

    await act(async () => {
      resolveSecond(jsonResponse({ results: [nairobi] }));
    });

    expect(result.current.results).toEqual([nairobi]);
    expect(result.current.status).toBe("success");

    await act(async () => {
      resolveFirst(jsonResponse({ results: [lagos] }));
    });

    expect(result.current.results).toEqual([nairobi]);
    expect(result.current.results[0]?.name).not.toBe("Lagos");
  });
});
