"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import type { Location } from "@/lib/locations";
import {
  MIN_QUERY_LENGTH,
  type SearchStatus,
} from "@/hooks/useLocationSearch";

type LocationTypeaheadProps = {
  query: string;
  onQueryChange: (value: string) => void;
  results: Location[];
  status: SearchStatus;
  error: string | null;
  onSelect: (location: Location) => void;
};

function placeLabel(location: Location) {
  return [location.region, location.country].filter(Boolean).join(", ");
}

export function LocationTypeahead({
  query,
  onQueryChange,
  results,
  status,
  error,
  onSelect,
}: LocationTypeaheadProps) {
  const listId = useId();
  const inputId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const resultsKey = results.map((location) => location.id).join(",");
  const [prevResultsKey, setPrevResultsKey] = useState(resultsKey);

  if (resultsKey !== prevResultsKey) {
    setPrevResultsKey(resultsKey);
    setActiveIndex(0);
  }

  const showList =
    open &&
    query.trim().length >= MIN_QUERY_LENGTH &&
    (status === "loading" ||
      status === "success" ||
      status === "empty" ||
      status === "error");

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  function selectLocation(location: Location) {
    onSelect(location);
    onQueryChange(location.name);
    setOpen(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      if (results.length === 0) return;
      setActiveIndex((index) => (index + 1) % results.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      if (results.length === 0) return;
      setActiveIndex((index) => (index - 1 + results.length) % results.length);
      return;
    }

    if (event.key === "Home" && results.length > 0 && showList) {
      event.preventDefault();
      setActiveIndex(0);
      return;
    }

    if (event.key === "End" && results.length > 0 && showList) {
      event.preventDefault();
      setActiveIndex(results.length - 1);
      return;
    }

    if (event.key === "Enter" && showList && results[activeIndex]) {
      event.preventDefault();
      selectLocation(results[activeIndex]);
    }
  }

  const activeLocation = showList ? results[activeIndex] : undefined;
  const activeOptionId = activeLocation
    ? `${listId}-option-${activeLocation.id}`
    : undefined;

  return (
    <div ref={rootRef} className="relative w-full">
      <label htmlFor={inputId} className="mb-2 block text-sm font-medium text-stone-700">
        Search a city or area
      </label>
      <div className="relative">
        <input
          id={inputId}
          type="text"
          role="combobox"
          autoComplete="off"
          spellCheck={false}
          aria-autocomplete="list"
          aria-expanded={showList}
          aria-controls={listId}
          aria-activedescendant={activeOptionId}
          placeholder="Try Lagos, Abuja, or Nairobi"
          value={query}
          onChange={(event) => {
            onQueryChange(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 pr-12 text-base text-stone-900 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-teal-800 focus:ring-2 focus:ring-teal-800/20"
        />
        <span
          className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-stone-400"
          aria-hidden="true"
        >
          {status === "loading" ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-stone-300 border-t-teal-800" />
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Zm10 2.5-4.3-4.3"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          )}
        </span>
      </div>

      {query.trim().length > 0 && query.trim().length < MIN_QUERY_LENGTH ? (
        <p className="mt-2 text-sm text-stone-500">Type at least 2 letters to search.</p>
      ) : null}

      {showList ? (
        <ul
          id={listId}
          role="listbox"
          aria-label="Location suggestions"
          className="absolute z-10 mt-2 max-h-80 w-full overflow-auto rounded-xl border border-stone-200 bg-white py-1 shadow-lg"
        >
          {status === "loading" && results.length === 0 ? (
            <li className="px-4 py-3 text-sm text-stone-500" role="presentation">
              Searching…
            </li>
          ) : null}

          {status === "empty" ? (
            <li className="px-4 py-3 text-sm text-stone-500" role="presentation">
              No places match “{query.trim()}”.
            </li>
          ) : null}

          {status === "error" ? (
            <li className="px-4 py-3 text-sm text-red-700" role="alert">
              {error ?? "Couldn’t load results. Check your connection and try again."}
            </li>
          ) : null}

          {results.map((location, index) => {
            const isActive = index === activeIndex;
            return (
              <li
                key={location.id}
                id={`${listId}-option-${location.id}`}
                role="option"
                aria-selected={isActive}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseDown={(event) => {
                  event.preventDefault();
                  selectLocation(location);
                }}
                className={`flex cursor-pointer items-center gap-3 px-3 py-2.5 ${
                  isActive ? "bg-teal-800 text-white" : "text-stone-900"
                }`}
              >
                <span
                  className={`w-8 shrink-0 text-center text-xs font-semibold ${
                    isActive ? "text-teal-100" : "text-stone-400"
                  }`}
                >
                  {location.countryCode || "—"}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{location.name}</span>
                  <span
                    className={`block truncate text-sm ${
                      isActive ? "text-teal-100" : "text-stone-500"
                    }`}
                  >
                    {placeLabel(location)}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
