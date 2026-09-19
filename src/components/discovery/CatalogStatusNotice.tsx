import { Info } from "lucide-react";

export function CatalogStatusNotice() {
  return (
    <aside className="border-y border-secondary/45 bg-secondary/15 px-4 py-3 text-sm text-foreground" aria-label="Catalog status">
      <div className="mx-auto flex max-w-7xl items-start gap-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        <p><span className="font-semibold">Updated September 19:</span> food and drink listings from The Big E, vendor menus, and MassLive’s Eater’s Guide. Open a food’s details for its source; menus and availability can change.</p>
      </div>
    </aside>
  );
}
