# Big E 2026 Fair Map

Date: 2026-09-14

## Summary

Add a fairground map to the 2026 food guide so a visitor standing anywhere on the grounds can see where a food area is, see where they are, and get walking directions to a chosen stop. The map uses OpenStreetMap tiles rendered with Leaflet, browser geolocation for the visitor's position, and a hand-off to Apple Maps or Google Maps for turn-by-turn walking routes. Locations and items gain optional coordinates; nothing else in the catalog, search, URL state, or plan modules changes.

This spec supersedes the `src/assets/maps/README.md` note that current locations intentionally have no map association. The retired per-location images stay retired; the build guard in `scripts/verify-no-legacy-map-assets.mjs` is unchanged.

## Problem

Fairground locations are names and one-line descriptions. A visitor at a gate who wants White Hut in the Food Court has no way to learn where the Food Court is relative to them, how far it is, or which way to walk. The existing location page shows a "Map unavailable" placeholder.

## Goals

1. From any item card or location page, one tap opens a map with that stop selected.
2. On the map, one tap shows the visitor's own position and the straight-line distance and direction to the selected stop.
3. One further tap opens walking directions in the phone's maps app.
4. Every fairground area can be placed on the map from data alone, with a visible "approximate" marker for pins that have not been verified on site.
5. The map works on a 390px phone in one-thumb use and degrades cleanly when location permission is denied.

## Non-goals

- In-app turn-by-turn routing. A static site cannot host a routing engine; the phone's maps app does this better.
- Shipping the official Big E illustrated map. It is copyrighted. The map component must accept a georeferenced image overlay later, but no artwork is produced here.
- Offline tiles, caching, or service workers.
- Stand-level coordinates for every item. The schema supports them; seeding them is future data work.
- A persistent navigation bar. That belongs to the August 28 mobile-first revision.

## Verified facts

OpenStreetMap (queried 2026-09-14 via Overpass) maps the fairground as landuse "Eastern States Expo Fairground" and includes, with coordinates: Avenue of States, New England Avenue, Commonwealth Avenue, Springfield Road, Hampden Avenue, East Road, West Road, Young Building, Better Living Center, Mallary Complex, Big E Coliseum, Stroh Building, Brooks Building, and the six state-house buildings. It does not name Food Court, The Front Porch, Craft Common, Industrial Avenue, New England Center, or the Court of Honor Stage.

Nominatim places the Eastern States Exposition at 42.091305, -72.624832 (the Memorial Avenue entrance). The fairground fits inside latitude 42.0880 to 42.0960 and longitude -72.6260 to -72.6100.

## Data model

### Coordinates

A shared Zod schema:

```ts
coordinateSchema = z.object({
  lat: z.number().min(42.0880).max(42.0960),
  lng: z.number().min(-72.6260).max(-72.6100),
  source: z.string().min(1),
  precision: z.enum(["mapped", "estimated"]),
});
```

- `source` records where the number came from, for example `OpenStreetMap way center, 2026-09-14` or `Estimated from location description; verify on site`.
- `precision` is `mapped` when derived from OpenStreetMap geometry and `estimated` when placed by hand. The UI shows an "Approximate" badge for `estimated` pins.
- The latitude and longitude bounds reject anything outside the fairground so a typo cannot place a pin in Agawam.

### Locations

`fairLocationSchema` gains `coordinates: coordinateSchema.optional()`. Every current location is seeded:

| id | lat | lng | precision | basis |
|---|---|---|---|---|
| new-england-avenue | 42.0916 | -72.6163 | mapped | midpoint of the two OSM segments |
| the-front-porch | 42.0916 | -72.6190 | estimated | between the Coliseum and Brooks Building, near the Court of Honor Stage |
| commonwealth-avenue | 42.0913 | -72.6202 | mapped | OSM way center |
| food-court | 42.0905 | -72.6160 | estimated | on East Road between the Mallary Complex and Young Building |
| avenue-of-states | 42.0909 | -72.6216 | mapped | OSM way center |
| craft-common | 42.0918 | -72.6172 | estimated | green space south of the Better Living Center; verify on site |
| east-road | 42.0902 | -72.6167 | mapped | OSM way center |
| west-road | 42.0901 | -72.6192 | mapped | OSM way center |
| springfield-road | 42.0917 | -72.6160 | mapped | OSM way center |
| industrial-avenue | 42.0931 | -72.6172 | estimated | between the Better Living Center and Memorial Avenue |
| hampden-avenue | 42.0916 | -72.6217 | mapped | OSM way center |
| young-building | 42.0913 | -72.6166 | mapped | OSM building center |
| better-living-center | 42.0925 | -72.6169 | mapped | OSM building center |
| new-england-center | 42.0928 | -72.6160 | estimated | indoor building east of the Better Living Center; verify on site |
| state-buildings | 42.0905 | -72.6221 | mapped | centroid of the six OSM state-house buildings |

Estimated pins are a starting point for on-site correction, not a claim. Correcting one means editing `locations.json` and changing `precision` to `mapped` with a new `source`.

### Items

`catalogItemSchema` gains `coordinates: coordinateSchema.optional()` for stand-level precision. No item is seeded now.

### Destination resolution

A pure function `resolveDestination(item | location, locationsById)` returns `{ name, areaName, coordinates } | null`:

1. An item with its own `coordinates` resolves to those, named after the item, with `areaName` from its first known location.
2. Otherwise an item resolves to the coordinates of its first location that has them.
3. A location resolves to its own coordinates.
4. Anything else returns `null`, and no map entry point is rendered for it.

## Map module

New folder `src/features/map/`.

### `geo.ts` (pure, fully unit-tested)

- `distanceMeters(a, b)`: haversine distance.
- `bearingDegrees(a, b)` and `compassWord(degrees)`: eight-point compass word (`north`, `northeast`, and so on).
- `describeWalk(from, to)`: a sentence such as `About 350 m, northeast` (meters under 1 km, otherwise one decimal kilometer).
- `walkingDirectionsUrl(to, platform)`: `https://maps.apple.com/?daddr=LAT,LNG&dirflg=w` when `platform` is `apple`, otherwise `https://www.google.com/maps/dir/?api=1&destination=LAT,LNG&travelmode=walking`. `detectPlatform(userAgent)` returns `apple` for iPhone, iPad, and Mac user agents.
- `resolveDestination` as described above.
- `FAIRGROUND_BOUNDS` and `FAIRGROUND_CENTER` constants.

### `useGeolocation.ts`

A hook returning `{ status, position, error, locate, stop }` where `status` is `idle | requesting | tracking | denied | unavailable`.

- Starts only when `locate()` is called. Nothing runs on mount.
- Uses `watchPosition` with `enableHighAccuracy: true` and clears the watch on `stop()` or unmount.
- `unavailable` when `navigator.geolocation` is missing or the context is not secure.
- `denied` on permission error; other errors keep `tracking` with the last good position and set `error`.
- `position` is `{ lat, lng, accuracyMeters }`.

### `FairMap.tsx`

A Leaflet map via react-leaflet 4.

- OpenStreetMap tile layer with the required attribution. Initial view fits `FAIRGROUND_BOUNDS`; `maxBounds` is a padded version of the same so the visitor cannot pan to the ocean.
- Markers use `L.divIcon` styled in the site palette, avoiding Leaflet's bundler-broken default PNG icons. A marker shows the location's `name` and item count. Estimated pins get a dashed outline and an `Approximate` label in the popup.
- Props: `locations` (only those with coordinates), `itemCounts`, `destination` (optional resolved destination), `userPosition` (optional), `onSelectLocation(id)`, `overlay` (optional `{ url, bounds }` georeferenced image, drawn under markers).
- With a destination, its marker is emphasized and the map pans to include it. With both a destination and a user position, a dashed polyline connects them and the view fits both.
- The user position renders as a dot with an accuracy circle.
- Popups contain the name, item count, a `Browse foods here` link to `/browse?locations=<id>`, and a `Directions` button that selects the location as destination.

### Leaflet CSS and assets

`leaflet/dist/leaflet.css` is imported once in `FairMap.tsx`. No Leaflet image assets are referenced, so the legacy-asset build guard stays green.

## Map page

Route `/map`, added in `App.tsx` above the catch-all. Query parameters:

- `to=<locationId>` selects a location destination.
- `item=<itemId>` selects an item destination via `resolveDestination`.
- Unknown or unresolvable ids are ignored and the page renders with no destination. `item` wins if both are present.

Layout on a phone: the page header, then the map at roughly 60 percent of the viewport height, then a panel. On `lg` and up the map and panel sit side by side with the map filling the remaining height.

### Panel

1. **Find me.** A `Find me` button calls `locate()`. While requesting it shows `Finding you…`. On `denied`, an inline note explains that location access is off and how to re-enable it in the browser; the map stays usable. On `unavailable`, a note says this device or connection cannot share location. While tracking, the button becomes `Stop locating`.
2. **Destination card** (only with a destination). The stop name, area name, an `Approximate` badge for estimated pins, `describeWalk` text when the user position is known or `Tap Find me to see distance` otherwise, a `Walking directions` link (external, `rel="noreferrer"`, opens in a new tab) built by `walkingDirectionsUrl`, and a `Clear destination` button that removes the query parameters.
3. **Areas list.** Every location in `order`, each with its name, item count, a `Show on map` button that sets `to`, and a link to `/location/<id>`. Locations without coordinates sit under a `Not yet placed` heading with only the location link. With the seed data above this group is empty, and the heading is omitted when empty.

Selecting a destination from the panel or a popup updates the URL with `replace` navigation, consistent with the browse page.

## Entry points

- **Item card.** A `Take me there` link to `/map?item=<id>` inside the location section, rendered only when `resolveDestination` returns a value. Compact cards in the August revision keep this link.
- **Location page.** The `LocationMap` placeholder aside is replaced by a `FairMap` showing that location as the destination, plus a `Walking directions` link and an `Open full map` link to `/map?to=<id>`. `src/assets/maps/mapUtils.ts`, its test, and the placeholder-map tests in `LocationDetail.test.tsx` are removed. `src/assets/maps/README.md` is rewritten to say maps are rendered from OpenStreetMap and coordinates live in `locations.json`.
- **My Food Plan.** Each known-location group header gets a `Map` link to `/map?to=<id>`. The `Location TBD` group gets none.
- **Homepage.** A `Fair map` link in the hero next to the search form.
- **Browse page.** A `Fair map` link in the header.

## Error handling

- Geolocation denied or unavailable: inline message, map still interactive.
- Non-secure context: treated as unavailable.
- Tile load failures: Leaflet's default grey tiles; no custom handling.
- Invalid coordinates in data fail catalog validation at build and test time, not at runtime.
- A destination without a user position shows distance-unavailable copy instead of a number.

## Accessibility

- The map container has `role="region"` and `aria-label="Fairground map"`. All destination selection is also reachable from the panel list, so the map itself is never the only path.
- Every button and link is at least 44px tall (`min-h-11`).
- Geolocation status is announced through a `role="status"` region.
- Marker popups are keyboard reachable through Leaflet's default keyboard support; the panel list duplicates their actions.

## Testing

- `geo.test.ts`: distance between two known fairground points within 1 percent; bearing and compass words for the eight directions; `describeWalk` formatting under and over 1 km; both directions URL shapes; platform detection; all four `resolveDestination` cases.
- `useGeolocation.test.ts`: mocked `navigator.geolocation` covering idle on mount, tracking after `locate()`, denied, missing API, and watch cleanup on unmount.
- `catalog.test.ts`: every location coordinate parses; the set of `estimated` locations equals the five listed above so a silent regression to estimated is caught.
- `MapPage.test.tsx` with `FairMap` mocked: no destination by default; `to` and `item` select destinations; unknown ids are ignored; the destination card shows walk text once a position exists; the directions link has the expected href; `Clear destination` empties the query; `Show on map` sets `to` with replacement navigation.
- `ItemCard.test.tsx`: `Take me there` present for a located item, absent for an unlocated one.
- `LocationDetail.test.tsx`: renders the mocked map with the location as destination and a directions link; placeholder tests removed.
- `PlanPage.test.tsx`: group `Map` link present for known locations and absent for TBD.
- Production build passes, including the legacy-asset guard.

## Dependencies

- `leaflet` 1.9.4
- `react-leaflet` 4.2.1 (last major supporting React 18)
- `@types/leaflet` (dev)

## Acceptance criteria

- Opening `/map?item=<a Food Court item>` shows the Food Court pin selected, marked approximate, with a working walking-directions link.
- Tapping `Find me` on a phone over HTTPS shows a position dot and a distance sentence to the selected stop.
- Denying location shows an explanatory note and the map remains usable.
- Every item with a known location shows `Take me there`; unlocated items do not.
- The location page shows the real map instead of the placeholder.
- All tests and the production build pass; no retired map asset is emitted.
