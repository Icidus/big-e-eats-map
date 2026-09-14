import { ArrowLeft, LocateFixed, MapPin, Navigation, X } from "lucide-react";
import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { catalogItems, itemsById, locations, locationsById, type FairLocation } from "@/features/catalog/catalog";
import { FairMap } from "@/features/map/FairMap";
import { describeWalk, detectPlatform, resolveDestination, walkingDirectionsUrl, type Destination } from "@/features/map/geo";
import { useGeolocation, type GeolocationState } from "@/features/map/useGeolocation";

const itemCounts = new Map<string, number>();
for (const item of catalogItems) {
  for (const locationId of item.locationIds) {
    itemCounts.set(locationId, (itemCounts.get(locationId) ?? 0) + 1);
  }
}

const orderedLocations = [...locations].sort((first, second) => first.order - second.order);

function destinationFromParams(params: URLSearchParams): Destination | null {
  const itemId = params.get("item");
  const item = itemId ? itemsById.get(itemId) : undefined;
  if (item) {
    const destination = resolveDestination(item, locationsById);
    if (destination) return destination;
  }

  const locationId = params.get("to");
  const location = locationId ? locationsById.get(locationId) : undefined;
  if (location) return resolveDestination(location, locationsById);

  return null;
}

function statusMessage(geolocation: GeolocationState): string {
  switch (geolocation.status) {
    case "denied":
      return "Location access is off. Allow location for this site in your browser settings, then tap Find me again.";
    case "unavailable":
      return "This device or connection can't share your location.";
    case "requesting":
      return geolocation.error ?? "Waiting for a location fix…";
    case "tracking":
      return geolocation.error ?? `Showing your position, accurate to about ${Math.round(geolocation.position?.accuracyMeters ?? 0)} m.`;
    default:
      return "Tap Find me to show where you are on the grounds.";
  }
}

export function MapPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const geolocation = useGeolocation();
  const destination = useMemo(() => destinationFromParams(searchParams), [searchParams]);
  const platform = detectPlatform(typeof navigator === "undefined" ? "" : navigator.userAgent);
  const placedLocations = orderedLocations.filter((location) => location.coordinates);
  const unplacedLocations = orderedLocations.filter((location) => !location.coordinates);
  const isLocating = geolocation.status === "requesting" || geolocation.status === "tracking";

  function selectLocation(id: string) {
    setSearchParams({ to: id }, { replace: true });
  }

  function clearDestination() {
    setSearchParams({}, { replace: true });
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(hsl(var(--secondary)/0.15)_1px,transparent_1px)] bg-[size:13px_13px] text-foreground">
      <header className="border-b-4 border-primary bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Button asChild variant="outline" className="min-h-11 border-primary-foreground/60 bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary">
            <Link to="/"><ArrowLeft aria-hidden="true" />Back to 2026 food guide</Link>
          </Button>
          <p className="mt-5 font-mono text-xs font-bold uppercase tracking-[0.24em] text-secondary">The Big E · West Springfield</p>
          <h1 className="mt-2 font-serif text-4xl font-black tracking-tight sm:text-5xl">Fair map</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-primary-foreground/90">Find a food area, see where you are, and get walking directions.</p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:grid lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-8 lg:px-8">
        <div className="h-[60vh] min-h-[320px] border border-primary/25 bg-card shadow-[6px_6px_0_hsl(var(--secondary)/0.32)] lg:sticky lg:top-[calc(2.75rem+1rem)] lg:h-[calc(100vh-2.75rem-2rem)]">
          <FairMap locations={placedLocations} itemCounts={itemCounts} destination={destination} userPosition={geolocation.position} onSelectLocation={selectLocation} />
        </div>

        <aside className="mt-6 space-y-6 lg:mt-0">
          <section className="border border-primary/25 bg-card p-4 shadow-[4px_4px_0_hsl(var(--secondary)/0.25)]" aria-labelledby="map-locate-title">
            <h2 id="map-locate-title" className="font-serif text-xl font-bold">Where you are</h2>
            <Button type="button" className="mt-3 min-h-11 w-full" variant={isLocating ? "secondary" : "default"} onClick={isLocating ? geolocation.stop : geolocation.locate}>
              <LocateFixed aria-hidden="true" />
              {geolocation.status === "requesting" ? "Finding you…" : geolocation.status === "tracking" ? "Stop locating" : "Find me"}
            </Button>
            <p role="status" className="mt-3 text-sm leading-6 text-muted-foreground">{statusMessage(geolocation)}</p>
          </section>

          {destination ? (
            <section className="border-2 border-primary bg-card p-4 shadow-[4px_4px_0_hsl(var(--secondary)/0.4)]" aria-label="Destination">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-primary">Destination</p>
              <h2 className="mt-1 font-serif text-2xl font-bold leading-tight">{destination.name}</h2>
              {destination.areaName ? <p className="mt-1 text-sm font-semibold text-muted-foreground">{destination.areaName}</p> : null}
              {destination.coordinates.precision === "estimated" ? <p className="mt-2 inline-block border border-dashed border-primary/60 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-primary">Approximate</p> : null}
              <p className="mt-3 text-sm font-semibold">{geolocation.position ? describeWalk(geolocation.position, destination.coordinates) : "Tap Find me to see distance"}</p>
              <div className="mt-4 flex flex-col gap-2">
                <Button asChild className="min-h-11">
                  <a href={walkingDirectionsUrl(destination.coordinates, platform)} target="_blank" rel="noreferrer"><Navigation aria-hidden="true" />Walking directions</a>
                </Button>
                <Button type="button" variant="outline" className="min-h-11" onClick={clearDestination}><X aria-hidden="true" />Clear destination</Button>
              </div>
            </section>
          ) : null}

          <section aria-labelledby="map-areas-title">
            <h2 id="map-areas-title" className="font-serif text-xl font-bold">Food areas</h2>
            <ul className="mt-3 divide-y divide-primary/15 border border-primary/20 bg-card">
              {placedLocations.map((location) => <AreaRow key={location.id} location={location} onShow={selectLocation} />)}
            </ul>
            {unplacedLocations.length ? (
              <>
                <h3 className="mt-5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Not yet placed</h3>
                <ul className="mt-2 divide-y divide-primary/15 border border-primary/20 bg-card">
                  {unplacedLocations.map((location) => <AreaRow key={location.id} location={location} />)}
                </ul>
              </>
            ) : null}
          </section>
        </aside>
      </main>
    </div>
  );
}

function AreaRow({ location, onShow }: { location: FairLocation; onShow?(id: string): void }) {
  const count = itemCounts.get(location.id) ?? 0;
  return (
    <li className="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
      <div className="min-w-0">
        <p className="font-semibold">{location.name}</p>
        <p className="text-xs text-muted-foreground">{count} {count === 1 ? "item" : "items"}{location.coordinates?.precision === "estimated" ? " · Approximate" : ""}</p>
      </div>
      <div className="flex items-center gap-1">
        {onShow ? <Button type="button" variant="ghost" size="sm" className="min-h-11" onClick={() => onShow(location.id)} aria-label={`Show ${location.name} on map`}><MapPin aria-hidden="true" />Show on map</Button> : null}
        <Button asChild variant="link" size="sm" className="min-h-11"><Link to={`/location/${location.id}`} aria-label={`${location.name} details`}>Details</Link></Button>
      </div>
    </li>
  );
}
