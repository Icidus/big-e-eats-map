import { SlidersHorizontal } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import type { FairLocation } from "@/features/catalog/catalog";
import { CATEGORIES, DIETARY_CLAIMS, TAGS, type CategoryId, type DietaryClaim, type TagId } from "@/features/catalog/taxonomy";
import type { DiscoveryState, SortMode } from "@/features/discovery/types";

interface FilterSheetProps {
  state: DiscoveryState;
  locations: FairLocation[];
  hasUnlocatedItems: boolean;
  resultCount: number;
  onStateChange(state: DiscoveryState): void;
  onClear(): void;
}

export function FilterSheet({ state, locations, hasUnlocatedItems, resultCount, onStateChange, onClear }: FilterSheetProps) {
  const activeCount = state.categoryIds.length + state.locationIds.length + state.dietaryClaims.length + state.tagIds.length + state.vendorIds.length;
  const locationOptions = [
    ...locations.map((location) => ({ id: location.id, label: location.name })),
    ...(hasUnlocatedItems ? [{ id: "tbd", label: "Location TBD" }] : []),
  ];

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button type="button" variant="outline" className="min-h-11" aria-label={activeCount ? `Filters, ${activeCount} active` : "Filters"}>
          <SlidersHorizontal aria-hidden="true" />
          Filters
          {activeCount ? <span aria-hidden="true" className="grid min-w-5 place-items-center rounded-full bg-primary px-1 font-mono text-[11px] font-bold leading-5 text-primary-foreground">{activeCount}</span> : null}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[85svh] bg-background">
        <DrawerHeader className="pb-2 text-left">
          <DrawerTitle>Filters</DrawerTitle>
          <DrawerDescription>Combine as many as you like.</DrawerDescription>
        </DrawerHeader>
        <div className="overflow-y-auto px-4">
          <Accordion type="multiple" defaultValue={["category", "sort"]}>
            <FacetSection
              value="category"
              label="Category"
              selectedCount={state.categoryIds.length}
              options={CATEGORIES.map(([id, label]) => ({ id, label }))}
              selected={state.categoryIds}
              onToggle={(id) => onStateChange({ ...state, categoryIds: toggle(state.categoryIds, id as CategoryId) })}
            />
            <FacetSection
              value="location"
              label="Location"
              selectedCount={state.locationIds.length}
              options={locationOptions}
              selected={state.locationIds}
              onToggle={(id) => onStateChange({ ...state, locationIds: toggle(state.locationIds, id) })}
            />
            <FacetSection
              value="dietary"
              label="Dietary"
              selectedCount={state.dietaryClaims.length}
              options={DIETARY_CLAIMS.map((id) => ({ id, label: titleCase(id) }))}
              selected={state.dietaryClaims}
              onToggle={(id) => onStateChange({ ...state, dietaryClaims: toggle(state.dietaryClaims, id as DietaryClaim) })}
              note="Dietary claims are source-reported. Confirm dietary needs and preparation details with the vendor."
            />
            <FacetSection
              value="tags"
              label="Tags"
              selectedCount={state.tagIds.length}
              options={TAGS.map((id) => ({ id, label: titleCase(id) }))}
              selected={state.tagIds}
              onToggle={(id) => onStateChange({ ...state, tagIds: toggle(state.tagIds, id as TagId) })}
            />
            <SortSection state={state} onStateChange={onStateChange} />
          </Accordion>
        </div>
        <div className="sticky bottom-0 flex items-center gap-3 border-t border-primary/25 bg-background p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <DrawerClose asChild>
            <Button type="button" className="min-h-11 flex-1">Show {resultCount} {resultCount === 1 ? "result" : "results"}</Button>
          </DrawerClose>
          <Button type="button" variant="link" size="sm" className="min-h-11 px-2" onClick={onClear}>Clear all</Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function FacetSection({ value, label, selectedCount, options, selected, onToggle, note }: {
  value: string;
  label: string;
  selectedCount: number;
  options: Array<{ id: string; label: string }>;
  selected: readonly string[];
  onToggle(id: string): void;
  note?: string;
}) {
  return (
    <AccordionItem value={value}>
      <AccordionTrigger className="min-h-11 font-serif text-base font-bold">
        <span className="flex items-center gap-2">
          {label}
          {selectedCount ? <span className="grid min-w-5 place-items-center rounded-full bg-primary/10 px-1 font-mono text-[11px] font-bold leading-5 text-primary">{selectedCount}</span> : null}
        </span>
      </AccordionTrigger>
      <AccordionContent>
        {note ? <p className="mb-2 text-xs leading-5 text-muted-foreground">{note}</p> : null}
        <fieldset>
          <legend className="sr-only">{label}</legend>
          <div className="grid gap-1">
            {options.map((option) => (
              <label key={option.id} className="flex min-h-11 cursor-pointer items-center gap-2 rounded px-2 text-sm hover:bg-secondary/15 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                <Checkbox checked={selected.includes(option.id)} onCheckedChange={() => onToggle(option.id)} />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </AccordionContent>
    </AccordionItem>
  );
}

function SortSection({ state, onStateChange }: { state: DiscoveryState; onStateChange(state: DiscoveryState): void }) {
  const defaultSort = state.query ? "relevance" : state.collectionId ? "collection" : "name";
  const normalizedSort = !state.query && state.sort === "relevance" ? undefined : state.sort;
  const value = normalizedSort ?? defaultSort;
  const options: Array<[string, string]> = [
    ...(state.query ? [["relevance", "Relevance"] as [string, string]] : []),
    ...(state.collectionId && !state.query ? [["collection", "Collection order"] as [string, string]] : []),
    ["name", "Name A-Z"],
    ["vendor", "Vendor A-Z"],
    ["location", "Fairground location"],
  ];

  return (
    <AccordionItem value="sort">
      <AccordionTrigger className="min-h-11 font-serif text-base font-bold">Sort</AccordionTrigger>
      <AccordionContent>
        <fieldset>
          <legend className="sr-only">Sort</legend>
          <div className="grid gap-1">
            {options.map(([id, label]) => (
              <label key={id} className="flex min-h-11 cursor-pointer items-center gap-2 rounded px-2 text-sm hover:bg-secondary/15">
                <input
                  type="radio"
                  name="browse-sort"
                  className="h-4 w-4 accent-[hsl(var(--primary))]"
                  checked={value === id}
                  onChange={() => onStateChange({ ...state, sort: id === "collection" ? undefined : (id as SortMode) })}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </AccordionContent>
    </AccordionItem>
  );
}

function toggle<T extends string>(values: readonly T[], value: T): T[] {
  return values.includes(value) ? values.filter((entry) => entry !== value) : [...values, value];
}

function titleCase(value: string): string {
  return value.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}
