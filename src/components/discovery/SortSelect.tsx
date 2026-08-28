import type { ChangeEvent } from "react";
import type { DiscoveryState, SortMode } from "@/features/discovery/types";

interface SortSelectProps {
  state: DiscoveryState;
  onSortChange(sort: SortMode | undefined): void;
}

export function SortSelect({ state, onSortChange }: SortSelectProps) {
  const defaultSort = state.query ? "relevance" : state.collectionId ? "collection" : "name";
  const normalizedSort = !state.query && state.sort === "relevance" ? undefined : state.sort;
  const value = normalizedSort ?? defaultSort;

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    const next = event.target.value;
    onSortChange(next === "collection" ? undefined : next as SortMode);
  }

  return (
    <label className="flex min-h-11 items-center gap-2 text-sm font-semibold" htmlFor="browse-sort">
      Sort
      <select id="browse-sort" className="min-h-11 rounded-md border border-primary/30 bg-card px-3 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring" value={value} onChange={handleChange}>
        {state.query && <option value="relevance">Relevance</option>}
        {state.collectionId && !state.query && <option value="collection">Collection order</option>}
        <option value="name">Name A-Z</option>
        <option value="vendor">Vendor A-Z</option>
        <option value="location">Fairground location</option>
      </select>
    </label>
  );
}
