import { Info } from "lucide-react";

export function CatalogStatusNotice() {
  return (
    <aside className="border-y border-secondary/45 bg-secondary/15 px-4 py-3 text-sm text-foreground" aria-label="Catalog status">
      <div className="mx-auto flex max-w-7xl items-start gap-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        <p><span className="font-semibold">Field notes, 2026:</span> this catalog tracks confirmed 2026 additions. The full fair food roster is not yet published.</p>
      </div>
    </aside>
  );
}
