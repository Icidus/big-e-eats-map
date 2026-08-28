import { MapPin, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { FairLocation } from "@/features/catalog/catalog";

interface LocationCardProps {
  location: FairLocation;
  itemCount: number;
}

export function LocationCard({ location, itemCount }: LocationCardProps) {
  return (
    <article className="h-full border-l-4 border-secondary bg-card p-4 shadow-[3px_3px_0_hsl(var(--primary)/0.14)]">
      <div className="flex items-start justify-between gap-3"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" /><span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">{itemCount} items</span></div>
      <h3 className="mt-3 font-serif text-xl font-bold leading-tight text-foreground">{location.name}</h3>
      <p className="mt-2 text-sm leading-5 text-muted-foreground">{location.description}</p>
      <Link to={`/browse?locations=${encodeURIComponent(location.id)}`} className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-primary underline decoration-secondary decoration-2 underline-offset-4 hover:text-primary/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4" aria-label={`Browse ${itemCount} confirmed items at ${location.name}`}>
        Browse this stop <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </article>
  );
}
