import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface SelectedFilter {
  id: string;
  label: string;
}

interface SelectedFiltersProps {
  filters: SelectedFilter[];
  onRemove(id: string): void;
  onClear(): void;
}

export function SelectedFilters({ filters, onRemove, onClear }: SelectedFiltersProps) {
  if (!filters.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Selected filters">
      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Active filters</span>
      {filters.map((filter) => (
        <button key={filter.id} type="button" className="inline-flex min-h-11 items-center gap-1 rounded-full border border-primary/35 bg-primary/10 px-3 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" onClick={() => onRemove(filter.id)} aria-label={`Remove ${filter.label} filter`}>
          {filter.label}<X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      ))}
      <Button type="button" variant="link" size="sm" className="min-h-11 px-2" onClick={onClear}>Clear all</Button>
    </div>
  );
}
