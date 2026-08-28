import { Search } from "lucide-react";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { CatalogStatusNotice } from "@/components/discovery/CatalogStatusNotice";
import { FilterPanel } from "@/components/discovery/FilterPanel";
import { ItemCard } from "@/components/discovery/ItemCard";
import { SelectedFilters, type SelectedFilter } from "@/components/discovery/SelectedFilters";
import { SortSelect } from "@/components/discovery/SortSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { catalogItems, collectionsById, locations, locationsById, vendorNamesById } from "@/features/catalog/catalog";
import { CATEGORIES } from "@/features/catalog/taxonomy";
import { searchAndFilter } from "@/features/discovery/search";
import { parseDiscoveryState, serializeDiscoveryState } from "@/features/discovery/urlState";
import { EMPTY_DISCOVERY_STATE, type DiscoveryState, type SortMode } from "@/features/discovery/types";
import { useFoodPlan } from "@/features/plan/FoodPlanProvider";

const categoryLabels = new Map(CATEGORIES);

export function BrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const state = useMemo(() => parseDiscoveryState(searchParams), [searchParams]);
  const results = useMemo(() => searchAndFilter(catalogItems, state, { locations, collectionsById }), [state]);
  const { addItem, hasItem, removeItem } = useFoodPlan();
  const selectedFilters = selectedFiltersFor(state);

  function replaceState(next: DiscoveryState) {
    setSearchParams(serializeDiscoveryState(normalizeDiscoveryState(next)), { replace: true });
  }

  function removeFilter(id: string) {
    if (id === "q") return replaceState({ ...state, query: "" });
    if (id === "collection") return replaceState({ ...state, collectionId: undefined });
    const [kind, value] = id.split(":", 2);
    if (kind === "categories") return replaceState({ ...state, categoryIds: state.categoryIds.filter((entry) => entry !== value) });
    if (kind === "locations") return replaceState({ ...state, locationIds: state.locationIds.filter((entry) => entry !== value) });
    if (kind === "dietary") return replaceState({ ...state, dietaryClaims: state.dietaryClaims.filter((entry) => entry !== value) });
    if (kind === "vendors") return replaceState({ ...state, vendorIds: state.vendorIds.filter((entry) => entry !== value) });
    if (kind === "tags") return replaceState({ ...state, tagIds: state.tagIds.filter((entry) => entry !== value) });
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(hsl(var(--secondary)/0.15)_1px,transparent_1px)] bg-[size:13px_13px] text-foreground">
      <header className="border-b-4 border-primary bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-secondary">The Big E · West Springfield</p>
          <h1 className="mt-2 font-serif text-4xl font-black tracking-tight sm:text-5xl">Browse 2026 Food</h1>
          <p className="mt-3 max-w-2xl text-base leading-6 text-primary-foreground/90">A living field guide to confirmed 2026 food listings—sorted by craving, not guesswork.</p>
        </div>
      </header>
      <CatalogStatusNotice />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="border border-primary/25 bg-card p-4 shadow-[6px_6px_0_hsl(var(--secondary)/0.32)] sm:p-5" aria-label="Search the food catalog">
          <label className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground" htmlFor="browse-search">Search the midway</label>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" aria-hidden="true" />
            <Input
              id="browse-search"
              value={state.query}
              onChange={(event) => replaceState({ ...state, query: event.target.value })}
              placeholder="Try apple, hot honey, or a vendor…"
              className="h-12 border-primary/30 pl-10 text-base"
            />
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3"><FilterPanel state={state} locations={locations} hasUnlocatedItems={catalogItems.some((item) => item.locationIds.length === 0)} onStateChange={replaceState} onClear={() => replaceState(EMPTY_DISCOVERY_STATE)} /><SortSelect state={state} onSortChange={(sort: SortMode | undefined) => replaceState({ ...state, sort })} /></div>
        </section>

        <div className="mt-6"><SelectedFilters filters={selectedFilters} onRemove={removeFilter} onClear={() => replaceState(EMPTY_DISCOVERY_STATE)} /></div>

        <section className="mt-7" aria-labelledby="browse-results">
          <div className="flex items-end justify-between gap-4 border-b border-primary/25 pb-3">
            <div><p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-primary">Issued from the fair desk</p><h2 id="browse-results" className="font-serif text-2xl font-bold">Food finder</h2></div>
            <p role="status" aria-live="polite" className="text-sm font-semibold text-muted-foreground">{results.length} {results.length === 1 ? "item" : "items"} found</p>
          </div>
          {results.length ? <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{results.map((item) => <ItemCard key={item.id} item={item} locationsById={locationsById} isInPlan={hasItem(item.id)} onAdd={() => addItem(item.id)} onRemove={() => removeItem(item.id)} />)}</div> : <div className="mt-5 border border-dashed border-primary/40 bg-card p-8 text-center shadow-[4px_4px_0_hsl(var(--secondary)/0.22)]"><p className="font-serif text-2xl font-bold">No bites in this corner of the fair.</p><p className="mt-2 text-sm text-muted-foreground">Try opening up the field guide to see everything confirmed so far.</p><Button type="button" className="mt-5 min-h-11" onClick={() => replaceState(EMPTY_DISCOVERY_STATE)}>Clear all filters</Button></div>}
        </section>
      </main>
    </div>
  );
}

function selectedFiltersFor(state: DiscoveryState): SelectedFilter[] {
  return [
    ...(state.query ? [{ id: "q", label: `Search: ${state.query}` }] : []),
    ...state.categoryIds.map((id) => ({ id: `categories:${id}`, label: categoryLabels.get(id) ?? id })),
    ...state.locationIds.map((id) => ({ id: `locations:${id}`, label: id === "tbd" ? "Location TBD" : locationsById.get(id)?.name ?? id })),
    ...state.dietaryClaims.map((id) => ({ id: `dietary:${id}`, label: titleCase(id) })),
    ...state.vendorIds.map((id) => ({ id: `vendors:${id}`, label: vendorNamesById.get(id) ?? id })),
    ...state.tagIds.map((id) => ({ id: `tags:${id}`, label: titleCase(id) })),
    ...(state.collectionId ? [{ id: "collection", label: collectionsById.get(state.collectionId)?.title ?? state.collectionId }] : []),
  ];
}

function normalizeDiscoveryState(state: DiscoveryState): DiscoveryState {
  if (!state.query.trim() && state.sort === "relevance") {
    return { ...state, sort: undefined };
  }
  return state;
}

function titleCase(value: string): string {
  return value.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}
