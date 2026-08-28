import { ExternalLink, MapPin, Minus, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CatalogItem, FairLocation } from "@/features/catalog/catalog";
import { CATEGORIES } from "@/features/catalog/taxonomy";

interface ItemCardProps {
  item: CatalogItem;
  locationsById: Map<string, FairLocation>;
  isInPlan: boolean;
  onAdd(): void;
  onRemove(): void;
}

const categoryLabels = new Map(CATEGORIES);

export function ItemCard({ item, locationsById, isInPlan, onAdd, onRemove }: ItemCardProps) {
  const knownLocations = item.locationIds
    .map((locationId) => locationsById.get(locationId))
    .filter((location): location is FairLocation => Boolean(location));
  const tags = [...item.categoryIds.map((id) => categoryLabels.get(id) ?? id), ...item.tagIds];
  const listingLabel = item.isNewFor2026 ? "New for 2026" : "2026 listing";

  return (
    <article className="group relative flex min-h-72 flex-col overflow-hidden border border-primary/20 bg-card p-5 shadow-[5px_5px_0_hsl(var(--secondary)/0.3)] transition-transform duration-200 motion-safe:hover:-translate-y-0.5">
      <div className="absolute left-0 top-0 h-1 w-full bg-gradient-warm" aria-hidden="true" />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="mb-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-primary">{listingLabel}</p>
          <h2 className="font-serif text-2xl font-bold leading-tight text-foreground">{item.name}</h2>
          <p className="mt-1 text-sm font-semibold text-muted-foreground">{item.vendor}</p>
        </div>
        <Button
          type="button"
          size="sm"
          variant={isInPlan ? "secondary" : "outline"}
          className="min-h-11 shrink-0"
          aria-label={`${isInPlan ? "Remove" : "Add"} ${item.name} ${isInPlan ? "from" : "to"} plan`}
          onClick={isInPlan ? onRemove : onAdd}
        >
          {isInPlan ? <Minus aria-hidden="true" /> : <Plus aria-hidden="true" />}
          {isInPlan ? "In plan" : "Add"}
        </Button>
      </div>

      {item.description ? <p className="mt-4 text-sm leading-6 text-foreground/80">{item.description}</p> : null}

      <section className="mt-4 flex flex-wrap gap-1.5" aria-label="Item tags">
        {tags.map((tag) => (
          <Badge key={tag} variant="outline" className="border-secondary/60 bg-secondary/10 text-[11px] capitalize">{tag}</Badge>
        ))}
      </section>

      {item.dietaryClaims.length > 0 ? (
        <section className="mt-4 border-l-2 border-secondary bg-secondary/10 px-3 py-2" aria-label="Source-reported dietary claims">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-primary">Source-reported dietary {item.dietaryClaims.length === 1 ? "claim" : "claims"}</p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {item.dietaryClaims.map((claim) => <Badge key={claim} variant="outline">{titleCase(claim)}</Badge>)}
          </div>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">Confirm dietary needs and preparation details with the vendor.</p>
        </section>
      ) : null}

      <div className="mt-auto border-t border-dashed border-border pt-4">
        <section className="flex items-start gap-2 text-sm" aria-label="Item location">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          {knownLocations.length > 0 ? (
            <span className="flex flex-wrap gap-x-2 gap-y-1">
              {knownLocations.map((location) => (
                <Link className="inline-flex min-h-11 items-center font-semibold text-primary underline decoration-primary/35 underline-offset-4 hover:decoration-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" to={`/location/${location.id}`} key={location.id}>{location.name}</Link>
              ))}
            </span>
          ) : <span className="font-medium text-muted-foreground">Location not yet announced</span>}
        </section>
        <a className="mt-3 inline-flex min-h-11 items-center gap-1 text-xs font-semibold text-primary underline decoration-primary/35 underline-offset-4 hover:decoration-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" href={item.source.url} target="_blank" rel="noreferrer">
          {item.source.publisher}: {item.source.title}<ExternalLink className="h-3 w-3" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}

function titleCase(value: string): string {
  return value.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}
