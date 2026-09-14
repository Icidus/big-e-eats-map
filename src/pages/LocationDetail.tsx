import { ArrowLeft, MapPin, Navigation } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { ItemCard } from "@/components/discovery/ItemCard";
import { Button } from "@/components/ui/button";
import { catalogItems, locationsById, type FairLocation } from "@/features/catalog/catalog";
import { FairMap } from "@/features/map/FairMap";
import { detectPlatform, resolveDestination, walkingDirectionsUrl } from "@/features/map/geo";
import { useFoodPlan } from "@/features/plan/FoodPlanProvider";

export default function LocationDetail() {
  const { id } = useParams<{ id: string }>();
  const location = id ? locationsById.get(id) : undefined;
  const { addItem, hasItem, removeItem } = useFoodPlan();

  if (!location) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(hsl(var(--secondary)/0.16)_1px,transparent_1px)] bg-[size:13px_13px] p-4 text-foreground">
        <section className="max-w-md border-2 border-primary bg-card p-7 text-center shadow-[6px_6px_0_hsl(var(--secondary)/0.5)]" aria-labelledby="location-not-found-title">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Map note missing</p>
          <h1 id="location-not-found-title" className="mt-2 font-serif text-3xl font-bold">Location Not Found</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">This fair stop is not in the confirmed 2026 location guide.</p>
          <Button asChild className="mt-6 min-h-11"><Link to="/">Back to 2026 food guide</Link></Button>
        </section>
      </main>
    );
  }

  const items = catalogItems.filter((item) => item.locationIds.includes(location.id));

  return (
    <div className="min-h-screen bg-[radial-gradient(hsl(var(--secondary)/0.16)_1px,transparent_1px)] bg-[size:13px_13px] text-foreground">
      <header className="border-b-4 border-primary bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Button asChild variant="outline" className="min-h-11 border-primary-foreground/60 bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary">
            <Link to="/"><ArrowLeft aria-hidden="true" />Back to 2026 food guide</Link>
          </Button>
          <div className="mt-6 flex items-start gap-3">
            <MapPin className="mt-1 h-6 w-6 shrink-0 text-secondary" aria-hidden="true" />
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">Fairground location</p>
              <h1 className="mt-1 font-serif text-4xl font-black tracking-tight sm:text-5xl">{location.name}</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-primary-foreground/90">{location.description}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-9 sm:px-6 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.65fr)]" aria-labelledby="location-items-title">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Confirmed 2026 additions</p>
            <h2 id="location-items-title" className="mt-1 font-serif text-3xl font-bold tracking-tight">{items.length} item{items.length === 1 ? "" : "s"} at this stop</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Only listings that currently name {location.name} are shown here.</p>
            {items.length ? (
              <div className="mt-6 grid gap-5 xl:grid-cols-2">
                {items.map((item) => <ItemCard key={item.id} item={item} locationsById={locationsById} isInPlan={hasItem(item.id)} onAdd={() => addItem(item.id)} onRemove={() => removeItem(item.id)} />)}
              </div>
            ) : (
              <div className="mt-6 border-2 border-dashed border-primary/45 bg-card p-6 shadow-[4px_4px_0_hsl(var(--secondary)/0.28)]">
                <h3 className="font-serif text-2xl font-bold">Nothing confirmed here yet</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">No 2026 additions are currently confirmed here. This does not mean there is no food at this location—only that the current 2026 catalog does not name an addition here.</p>
                <Button asChild variant="outline" className="mt-5 min-h-11"><Link to="/browse">Browse all confirmed additions</Link></Button>
              </div>
            )}
          </div>

          <LocationMapPanel location={location} itemCount={items.length} />
        </section>
      </main>
    </div>
  );
}

export function LocationMapPanel({ location, itemCount }: { location: FairLocation; itemCount: number }) {
  const destination = resolveDestination(location, locationsById);
  const platform = detectPlatform(typeof navigator === "undefined" ? "" : navigator.userAgent);

  return (
    <aside className="self-start border border-primary/25 bg-card p-5 shadow-[4px_4px_0_hsl(var(--secondary)/0.3)]" aria-label="Location map">
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Location reference</p>
      <h2 id="location-map-title" className="mt-1 font-serif text-2xl font-bold">On the grounds</h2>
      {destination ? (
        <>
          {destination.coordinates.precision === "estimated" ? <p className="mt-2 inline-block border border-dashed border-primary/60 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-primary">Approximate</p> : null}
          <div className="mt-4 h-72 border border-border">
            <FairMap locations={[location]} itemCounts={new Map([[location.id, itemCount]])} destination={destination} onSelectLocation={() => undefined} />
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <Button asChild className="min-h-11">
              <a href={walkingDirectionsUrl(destination.coordinates, platform)} target="_blank" rel="noreferrer"><Navigation aria-hidden="true" />Walking directions</a>
            </Button>
            <Button asChild variant="outline" className="min-h-11"><Link to={`/map?to=${encodeURIComponent(location.id)}`}>Open full map</Link></Button>
          </div>
        </>
      ) : (
        <>
          <div className="mt-4 border border-dashed border-primary/40 bg-muted/45 p-5 text-center">
            <MapPin className="mx-auto h-7 w-7 text-primary" aria-hidden="true" />
            <p className="mt-3 text-sm font-semibold">This location is not yet placed on the map.</p>
          </div>
          <Button asChild variant="outline" className="mt-4 min-h-11"><Link to="/map">Open full map</Link></Button>
        </>
      )}
      <p className="mt-4 text-sm leading-6 text-muted-foreground">Ask fair staff for current directions or accessibility help.</p>
    </aside>
  );
}
