"use client";

import { useState } from "react";
import { LocationTypeahead } from "@/components/LocationTypeahead";
import { SelectedLocation } from "@/components/SelectedLocation";
import { useLocationSearch } from "@/hooks/useLocationSearch";
import type { Location } from "@/lib/locations";

export function SearchDemo() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Location | null>(null);
  const search = useLocationSearch(query);

  return (
    <div>
      <LocationTypeahead
        query={query}
        onQueryChange={setQuery}
        results={search.results}
        status={search.status}
        error={search.error}
        onSelect={setSelected}
      />
      {selected ? <SelectedLocation location={selected} /> : null}
    </div>
  );
}
