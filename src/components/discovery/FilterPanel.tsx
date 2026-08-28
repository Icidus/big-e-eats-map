import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { vendorOptions, type FairLocation } from "@/features/catalog/catalog";
import { CATEGORIES, DIETARY_CLAIMS, TAGS, type CategoryId, type DietaryClaim, type TagId } from "@/features/catalog/taxonomy";
import type { DiscoveryState } from "@/features/discovery/types";

interface FilterPanelProps {
  state: DiscoveryState;
  locations: FairLocation[];
  hasUnlocatedItems: boolean;
  onStateChange(state: DiscoveryState): void;
  onClear(): void;
}

interface FilterContentsProps extends FilterPanelProps {
  mobile?: boolean;
}

export function FilterPanel(props: FilterPanelProps) {
  return (
    <>
      <aside className="hidden border border-primary/20 bg-card p-5 shadow-[4px_4px_0_hsl(var(--secondary)/0.25)] md:block" aria-label="Filter foods">
        <FilterContents {...props} />
      </aside>
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button type="button" variant="outline" className="min-h-11" aria-label="Open filters"><SlidersHorizontal aria-hidden="true" />Filters</Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[min(92vw,26rem)] overflow-y-auto bg-background p-5">
            <SheetHeader><SheetTitle>Find your next bite</SheetTitle><SheetDescription>Choose as many field-guide markers as you like.</SheetDescription></SheetHeader>
            <div className="mt-6"><FilterContents {...props} mobile /></div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

function FilterContents({ state, locations, hasUnlocatedItems, onStateChange, onClear }: FilterContentsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div><p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-primary">Craving index</p><h2 className="font-serif text-xl font-bold">Filter the field</h2></div>
        <Button type="button" variant="link" size="sm" className="min-h-11 px-2" onClick={onClear}>Clear</Button>
      </div>
      <FacetGroup label="Category" options={CATEGORIES.map(([id, label]) => ({ id, label }))} selected={state.categoryIds} onToggle={(id) => onStateChange({ ...state, categoryIds: toggle(state.categoryIds, id as CategoryId) })} />
      <FacetGroup label="Location" options={[...locations.map((location) => ({ id: location.id, label: location.name })), ...(hasUnlocatedItems ? [{ id: "tbd", label: "Location TBD" }] : [])]} selected={state.locationIds} onToggle={(id) => onStateChange({ ...state, locationIds: toggle(state.locationIds, id) })} />
      <FacetGroup label="Dietary" options={DIETARY_CLAIMS.map((id) => ({ id, label: titleCase(id) }))} selected={state.dietaryClaims} onToggle={(id) => onStateChange({ ...state, dietaryClaims: toggle(state.dietaryClaims, id as DietaryClaim) })} />
      <FacetGroup label="Vendor" options={vendorOptions.map(({ id, name }) => ({ id, label: name }))} selected={state.vendorIds} onToggle={(id) => onStateChange({ ...state, vendorIds: toggle(state.vendorIds, id) })} />
      <FacetGroup label="Tags" options={TAGS.map((id) => ({ id, label: titleCase(id) }))} selected={state.tagIds} onToggle={(id) => onStateChange({ ...state, tagIds: toggle(state.tagIds, id as TagId) })} />
    </div>
  );
}

function FacetGroup({ label, options, selected, onToggle }: { label: string; options: Array<{ id: string; label: string }>; selected: readonly string[]; onToggle(id: string): void }) {
  return <fieldset><legend className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">{label}</legend><div className="grid gap-1">{options.map((option) => <label key={option.id} className="flex min-h-11 cursor-pointer items-center gap-2 rounded px-2 text-sm hover:bg-secondary/15 focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"><Checkbox checked={selected.includes(option.id)} onCheckedChange={() => onToggle(option.id)} /><span>{option.label}</span></label>)}</div></fieldset>;
}

function toggle<T extends string>(values: readonly T[], value: T): T[] {
  return values.includes(value) ? values.filter((entry) => entry !== value) : [...values, value];
}

function titleCase(value: string): string {
  return value.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}
