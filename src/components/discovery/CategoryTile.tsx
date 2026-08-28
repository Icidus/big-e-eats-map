import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { CategoryId, TagId } from "@/features/catalog/taxonomy";

interface CategoryTileProps {
  id: CategoryId | TagId;
  label: string;
  count: number;
  icon: LucideIcon;
  kind?: "category" | "tag";
}

export function CategoryTile({ id, label, count, icon: Icon, kind = "category" }: CategoryTileProps) {
  const parameter = kind === "tag" ? "tags" : "categories";

  return (
    <Link to={`/browse?${parameter}=${encodeURIComponent(id)}`} className="group flex min-h-32 flex-col justify-between border border-primary/30 bg-card p-4 text-left shadow-[4px_4px_0_hsl(var(--secondary)/0.28)] transition-transform duration-200 hover:-translate-y-0.5 hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4" aria-label={`Browse ${label}, ${count} confirmed ${count === 1 ? "item" : "items"}`}>
      <span className="flex items-start justify-between gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-secondary/25 text-primary"><Icon className="h-5 w-5" aria-hidden="true" /></span><ArrowUpRight className="h-4 w-4 text-primary transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" /></span>
      <span><span className="block font-serif text-xl font-bold leading-tight text-foreground">{label}</span><span className="mt-1 block font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">{count} confirmed</span></span>
    </Link>
  );
}
