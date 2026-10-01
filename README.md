# Location typeahead

Next.js typeahead that queries [Open-Meteo Geocoding](https://open-meteo.com/en/docs/geocoding-api) as the user types.

## Requirements

| Requirement | Implementation |
| --- | --- |
| Debounced input | `useDebouncedValue` waits 300ms after the last keystroke. Queries under 2 characters do not hit the network. |
| Loading / empty / error | Explicit `status` on `useLocationSearch`. The list renders “Searching…”, “No places match…”, or an error alert. Upstream misses become `{ results: [] }`, not a failure. |
| Keyboard navigation | ARIA combobox: `↓` / `↑` move `aria-activedescendant`, Enter selects, Escape closes, Home / End jump. Focus stays on the input. |
| Stale / out-of-order responses | Effect cleanup aborts the previous `fetch` and sets an `ignore` flag so a slower, older response cannot overwrite newer results. |

Write-up (tradeoffs, scaling, testing): [`WRITEUP.md`](./WRITEUP.md).

## How it works

```
keystroke
  → useDebouncedValue (300ms)
  → useLocationSearch
      abort previous fetch + ignore its result
      GET /api/locations?q=...
  → LocationTypeahead (ARIA combobox)
```

The browser calls `/api/locations`. The Route Handler (`src/app/api/locations/route.ts`) calls Open-Meteo and normalizes the payload. That hop keeps the upstream URL off the client and is the place to add caching or rate limits later.

`cache: "no-store"` is used so each search is fresh. A short TTL would be the high-traffic alternative.

Open-Meteo is used because it is free, needs no API key, and returns cities with coordinates (e.g. Lagos) rather than a country-only list.

## Structure

```
src/app/page.tsx                      Page
src/app/api/locations/route.ts        Proxy to Open-Meteo
src/components/SearchDemo.tsx         Query + selection state
src/components/LocationTypeahead.tsx  Combobox UI
src/hooks/useDebouncedValue.ts
src/hooks/useLocationSearch.ts        Fetch, abort, status
src/lib/locations.ts                  Types, normalize, client fetch
```

The page is a Server Component. Search state and keystrokes live in client components (`"use client"`).

## Tests

Vitest + React Testing Library, `fetch` mocked:

- debounce emits only the latest value
- short queries do not request
- empty and error states
- a slower first response cannot overwrite a newer one
- keyboard select and Escape
- the route treats a missing result list as empty

```bash
npm install
npm run dev        # http://localhost:3000
npm run test:run
npm run lint
```

Try `Lagos` (matches), `zzzz` (empty), arrow keys / Enter / Escape, and typing `l` → `la` → `lag` quickly (latest query wins).
