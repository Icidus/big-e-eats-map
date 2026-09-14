import { ChevronDown, ExternalLink, MapPin, Minus, Plus } from "lucide-react";
import { useId, useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { vendorIdForName, type CatalogItem, type FairLocation } from "@/features/catalog/catalog";
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
  const [expanded, setExpanded] = useState(false);
  const detailId = useId();
  const knownLocations = item.locationIds
    .map((locationId) => locationsById.get(locationId))
    .filter((location): location is FairLocation => Boolean(location));
  const isNewVendor = item.tagIds.includes("new-vendor");

  return (
    <article className="relative border border-primary/20 bg-card p-4 shadow-[4px_4px_0_hsl(var(--secondary)/0.3)]">
      <div className="absolute left-0 top-0 h-1 w-full bg-gradient-warm" aria-hidden="true" />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-serif text-lg font-bold leading-tight text-foreground">{item.name}</h2>
          <Link
            to={`/browse?vendors=${encodeURIComponent(vendorIdForName(item.vendor))}`}
            aria-label={`See everything from ${item.vendor}`}
            className="mt-0.5 inline-flex min-h-11 items-center text-sm font-semibold text-muted-foreground underline decoration-primary/35 underline-offset-4 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {item.vendor}
          </Link>
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
          {isInPlan ? "Added" : "Add"}
        </Button>
      </div>

      {(item.dietaryClaims.length > 0 || isNewVendor) ? (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {item.dietaryClaims.map((claim) => (
            <Badge key={claim} variant="outline" className="border-secondary/70 bg-secondary/10 text-[11px]">{titleCase(claim)} · source-reported</Badge>
          ))}
          {isNewVendor ? <Badge variant="outline" className="border-primary/40 bg-primary/5 text-[11px] text-primary">New vendor</Badge> : null}
        </div>
      ) : null}

      <div className="mt-2 flex items-start gap-1.5 text-sm" aria-label="Item location">
        <MapPin className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        {knownLocations.length > 0 ? (
          <span className="flex flex-wrap gap-x-2">
            {knownLocations.map((location) => (
              <Link
                key={location.id}
                to={`/location/${location.id}`}
                className="inline-flex min-h-11 items-center font-semibold text-primary underline decoration-primary/35 underline-offset-4 hover:decoration-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {location.name}
              </Link>
            ))}
          </span>
        ) : <span className="inline-flex min-h-11 items-center font-medium text-muted-foreground">Location not yet announced</span>}
      </div>

      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={detailId}
        aria-label={`More about ${item.name}`}
        onClick={() => setExpanded((current) => !current)}
        className="mt-1 inline-flex min-h-11 items-center gap-1 text-xs font-bold uppercase tracking-wide text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        Details
        <ChevronDown className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")} aria-hidden="true" />
      </button>

      {expanded ? (
        <div id={detailId} className="mt-2 border-t border-dashed border-border pt-3">
          {item.description ? <p className="text-sm leading-6 text-foreground/80">{item.description}</p> : null}
          <div className={cn("flex flex-wrap gap-1.5", item.description && "mt-3")} aria-label="Item tags">
            {item.categoryIds.map((categoryId) => (
              <Link key={categoryId} to={`/browse?categories=${encodeURIComponent(categoryId)}`} className="inline-flex min-h-11 items-center rounded-full border border-secondary/60 bg-secondary/10 px-2.5 text-[11px] font-semibold capitalize text-foreground hover:bg-secondary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{categoryLabels.get(categoryId) ?? categoryId}</Link>
            ))}
            {item.tagIds.map((tagId) => (
              <Link key={tagId} to={`/browse?tags=${encodeURIComponent(tagId)}`} className="inline-flex min-h-11 items-center rounded-full border border-secondary/60 bg-secondary/10 px-2.5 text-[11px] font-semibold capitalize text-foreground hover:bg-secondary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{titleCase(tagId)}</Link>
            ))}
          </div>
          {item.dietaryClaims.length > 0 ? <p className="mt-3 text-xs leading-5 text-muted-foreground">Confirm dietary needs and preparation details with the vendor.</p> : null}
          <a
            href={item.source.url}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex min-h-11 items-center gap-1 text-xs font-semibold text-primary underline decoration-primary/35 underline-offset-4 hover:decoration-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {item.source.publisher}: {item.source.title}<ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
        </div>
      ) : null}
    </article>
  );
}

function titleCase(value: string): string {
  return value.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}
