import { FAIRGROUND_BOUNDS, type CatalogItem, type FairCoordinates, type FairLocation } from "@/features/catalog/schema";

export { FAIRGROUND_BOUNDS };

export interface LatLng {
  lat: number;
  lng: number;
}

export const FAIRGROUND_CENTER: LatLng = {
  lat: (FAIRGROUND_BOUNDS.south + FAIRGROUND_BOUNDS.north) / 2,
  lng: (FAIRGROUND_BOUNDS.west + FAIRGROUND_BOUNDS.east) / 2,
};

const EARTH_RADIUS_METERS = 6_371_000;
const COMPASS_WORDS = ["north", "northeast", "east", "southeast", "south", "southwest", "west", "northwest"] as const;

export type CompassWord = (typeof COMPASS_WORDS)[number];
export type MapsPlatform = "apple" | "google";

export interface Destination {
  id: string;
  kind: "item" | "location";
  name: string;
  vendor: string | null;
  areaName: string | null;
  locationId: string | null;
  coordinates: FairCoordinates;
}

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function toDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

export function distanceMeters(a: LatLng, b: LatLng): number {
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_METERS * Math.asin(Math.sqrt(h));
}

export function bearingDegrees(a: LatLng, b: LatLng): number {
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);
  const dLng = toRadians(b.lng - a.lng);
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  return (toDegrees(Math.atan2(y, x)) + 360) % 360;
}

export function compassWord(degrees: number): CompassWord {
  const normalized = ((degrees % 360) + 360) % 360;
  return COMPASS_WORDS[Math.round(normalized / 45) % COMPASS_WORDS.length];
}

export function describeWalk(from: LatLng, to: LatLng): string {
  const meters = distanceMeters(from, to);
  const distance = meters < 1000 ? `${Math.round(meters)} m` : `${(meters / 1000).toFixed(1)} km`;
  return `About ${distance}, ${compassWord(bearingDegrees(from, to))}`;
}

export function detectPlatform(userAgent: string): MapsPlatform {
  return /iPhone|iPad|iPod|Macintosh/i.test(userAgent) ? "apple" : "google";
}

export function walkingDirectionsUrl(to: LatLng, platform: MapsPlatform): string {
  const point = `${to.lat},${to.lng}`;
  return platform === "apple"
    ? `https://maps.apple.com/?daddr=${point}&dirflg=w`
    : `https://www.google.com/maps/dir/?api=1&destination=${point}&travelmode=walking`;
}

function isCatalogItem(target: CatalogItem | FairLocation): target is CatalogItem {
  return "locationIds" in target;
}

export function resolveDestination(target: CatalogItem | FairLocation, locationsById: Map<string, FairLocation>): Destination | null {
  if (!isCatalogItem(target)) {
    if (!target.coordinates) return null;
    return { id: target.id, kind: "location", name: target.name, vendor: null, areaName: null, locationId: target.id, coordinates: target.coordinates };
  }

  const knownLocations = target.locationIds
    .map((locationId) => locationsById.get(locationId))
    .filter((location): location is FairLocation => Boolean(location));

  if (target.coordinates) {
    const area = knownLocations[0] ?? null;
    return { id: target.id, kind: "item", name: target.name, vendor: target.vendor, areaName: area?.name ?? null, locationId: area?.id ?? null, coordinates: target.coordinates };
  }

  const placedArea = knownLocations.find((location) => location.coordinates);
  if (!placedArea?.coordinates) return null;
  return { id: target.id, kind: "item", name: target.name, vendor: target.vendor, areaName: placedArea.name, locationId: placedArea.id, coordinates: placedArea.coordinates };
}
