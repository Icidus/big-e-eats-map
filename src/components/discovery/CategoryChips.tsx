import { CATEGORIES, type CategoryId } from "@/features/catalog/taxonomy";
import { cn } from "@/lib/utils";

interface CategoryChipsProps {
  selected: readonly CategoryId[];
  counts: Map<CategoryId, number>;
  onToggle(id: CategoryId): void;
}

export function CategoryChips({ selected, counts, onToggle }: CategoryChipsProps) {
  const visible = CATEGORIES.filter(([id]) => (counts.get(id) ?? 0) > 0 || selected.includes(id));
  if (!visible.length) return null;

  return (
    <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0" role="group" aria-label="Filter by category">
      <div className="flex w-max gap-2 py-1">
        {visible.map(([id, label]) => {
          const isSelected = selected.includes(id);
          return (
            <button
              key={id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onToggle(id)}
              className={cn(
                "inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isSelected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-primary/35 bg-card text-primary hover:bg-secondary/20",
              )}
            >
              {label}
              {" "}
              <span className={cn("font-mono text-[11px] font-bold", isSelected ? "text-primary-foreground/85" : "text-muted-foreground")}>· {counts.get(id) ?? 0}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
