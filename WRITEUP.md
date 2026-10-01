The typeahead is a Next.js App Router component that queries Open-Meteo’s geocoding API as the user types. That API is free, needs no key, and returns cities with coordinates — enough geographic signal for a location search without standing up maps.

Input is debounced at 300ms. Queries shorter than two characters stay idle so partial keystrokes do not spam the network. Searches go through a Route Handler (`/api/locations`) so the client stays thin and the proxy can later take caching, rate limiting, and logging. The client still cancels in-flight work: effect cleanup aborts the previous `fetch` and sets an `ignore` flag so a slower, older response cannot overwrite newer results.

The list is an ARIA combobox (arrow keys, Enter, Escape, `aria-activedescendant`). Loading, empty, and error are discrete statuses. An upstream response with no matches is treated as empty, not as a failure.

Tradeoffs: no client result cache and no map. A query-to-results map would cut repeat traffic; a map or flood overlay would be product-relevant but outside this task. For high traffic, cache popular prefixes at the edge with a short TTL, lengthen debounce on slow networks, and rate-limit the proxy. Tests cover debounce, stale-response races, keyboard selection, and the three UI states with a mocked fetch.
