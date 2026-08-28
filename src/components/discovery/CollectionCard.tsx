import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { EditorialCollection } from "@/features/catalog/catalog";

interface CollectionCardProps {
  collection: EditorialCollection;
  itemCount: number;
}

export function CollectionCard({ collection, itemCount }: CollectionCardProps) {
  return (
    <article className="flex h-full flex-col border border-primary/25 bg-card p-5 shadow-[5px_5px_0_hsl(var(--secondary)/0.22)]">
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-primary">2026 collection · {itemCount} items</p>
      <h3 className="mt-3 font-serif text-2xl font-bold leading-tight text-foreground">{collection.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{collection.description}</p>
      <Link to={`/browse?collection=${encodeURIComponent(collection.id)}`} className="mt-5 inline-flex min-h-11 items-center gap-2 self-start border-b-2 border-secondary pb-1 text-sm font-bold text-primary transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4" aria-label={`Browse ${collection.title}, ${itemCount} confirmed items`}>
        Open collection <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </article>
  );
}
