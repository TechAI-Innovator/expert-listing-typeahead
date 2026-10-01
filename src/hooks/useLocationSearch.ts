"use client";

import { useEffect, useState } from "react";
import {
  isAbortError,
  searchLocations,
  type Location,
} from "@/lib/locations";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

export const MIN_QUERY_LENGTH = 2;
export const SEARCH_DEBOUNCE_MS = 300;

export type SearchStatus = "idle" | "loading" | "success" | "empty" | "error";

export type LocationSearchState = {
  status: SearchStatus;
  results: Location[];
  error: string | null;
  debouncedQuery: string;
};

type RequestResult = {
  query: string;
  results: Location[];
  error: string | null;
};

export function useLocationSearch(query: string): LocationSearchState {
  const debouncedQuery = useDebouncedValue(query.trim(), SEARCH_DEBOUNCE_MS);
  const [data, setData] = useState<RequestResult | null>(null);

  useEffect(() => {
    if (debouncedQuery.length < MIN_QUERY_LENGTH) {
      return;
    }

    const controller = new AbortController();
    let ignore = false;

    searchLocations(debouncedQuery, controller.signal)
      .then((results) => {
        if (ignore) return;
        setData({ query: debouncedQuery, results, error: null });
      })
      .catch((err: unknown) => {
        if (ignore || isAbortError(err)) return;
        setData({
          query: debouncedQuery,
          results: [],
          error: err instanceof Error ? err.message : "Search failed",
        });
      });

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [debouncedQuery]);

  const matching = data?.query === debouncedQuery ? data : null;

  let status: SearchStatus;
  if (debouncedQuery.length < MIN_QUERY_LENGTH) {
    status = "idle";
  } else if (!matching) {
    status = "loading";
  } else if (matching.error) {
    status = "error";
  } else if (matching.results.length === 0) {
    status = "empty";
  } else {
    status = "success";
  }

  return {
    status,
    results: matching?.results ?? [],
    error: matching?.error ?? null,
    debouncedQuery,
  };
}
