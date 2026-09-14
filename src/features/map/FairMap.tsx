import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Circle, CircleMarker, ImageOverlay, MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from "react-leaflet";
import type { FairLocation } from "@/features/catalog/schema";
import { cn } from "@/lib/utils";
import { FAIRGROUND_BOUNDS, type Destination, type LatLng } from "./geo";
import type { UserPosition } from "./useGeolocation";

export interface MapOverlay {
  url: string;
  bounds: [[number, number], [number, number]];
}

export interface FairMapProps {
  locations: FairLocation[];
  itemCounts: Map<string, number>;
  destination?: Destination | null;
  userPosition?: UserPosition | null;
  onSelectLocation(id: string): void;
  overlay?: MapOverlay;
  className?: string;
}

const FAIR_BOUNDS = L.latLngBounds([FAIRGROUND_BOUNDS.south, FAIRGROUND_BOUNDS.west], [FAIRGROUND_BOUNDS.north, FAIRGROUND_BOUNDS.east]);
const TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character] ?? character);
}

function markerIcon(label: string, count: number | null, modifiers: string[]): L.DivIcon {
  const countHtml = count === null ? "" : `<span class="fair-map-marker-count">${count}</span>`;
  return L.divIcon({
    className: "fair-map-marker-wrapper",
    html: `<span class="fair-map-marker ${modifiers.join(" ")}">${escapeHtml(label)}${countHtml}</span>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    popupAnchor: [0, -28],
  });
}

function FitView({ destination, userPosition }: { destination?: Destination | null; userPosition?: UserPosition | null }) {
  const map = useMap();
  const destinationKey = destination ? `${destination.coordinates.lat},${destination.coordinates.lng}` : "";
  const userKey = userPosition ? `${userPosition.lat},${userPosition.lng}` : "";

  useEffect(() => {
    if (destination && userPosition) {
      map.fitBounds(L.latLngBounds([destination.coordinates as LatLng, userPosition]), { padding: [48, 48], maxZoom: 18 });
      return;
    }
    if (destination) {
      map.setView(destination.coordinates as LatLng, 17);
      return;
    }
    map.fitBounds(FAIR_BOUNDS, { padding: [16, 16] });
    // Keys change only when coordinates change, so panning does not fight the user.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, destinationKey, userKey]);

  return null;
}

export function FairMap({ locations, itemCounts, destination = null, userPosition = null, onSelectLocation, overlay, className }: FairMapProps) {
  const placed = locations.filter((location): location is FairLocation & { coordinates: NonNullable<FairLocation["coordinates"]> } => Boolean(location.coordinates));
  const line: LatLng[] | null = destination && userPosition ? [userPosition, destination.coordinates as LatLng] : null;

  return (
    <div role="region" aria-label="Fairground map" className={cn("fair-map h-full w-full", className)}>
      <MapContainer bounds={FAIR_BOUNDS} maxBounds={FAIR_BOUNDS.pad(0.5)} minZoom={15} maxZoom={19} scrollWheelZoom className="h-full w-full">
        <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} maxZoom={19} />
        {overlay ? <ImageOverlay url={overlay.url} bounds={overlay.bounds} opacity={0.85} /> : null}
        <FitView destination={destination} userPosition={userPosition} />

        {placed.map((location) => {
          if (destination?.locationId === location.id) return null;
          const count = itemCounts.get(location.id) ?? 0;
          const estimated = location.coordinates.precision === "estimated";
          return (
            <Marker key={location.id} position={location.coordinates as LatLng} icon={markerIcon(location.name, count, estimated ? ["is-estimated"] : [])} keyboard>
              <Popup>
                <p className="font-serif text-base font-bold">{location.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{count} {count === 1 ? "item" : "items"}{estimated ? " · Approximate" : ""}</p>
                <div className="mt-2 flex flex-col gap-1">
                  <Link className="min-h-11 inline-flex items-center font-semibold text-primary underline underline-offset-4" to={`/browse?locations=${encodeURIComponent(location.id)}`}>Browse foods here</Link>
                  <button type="button" className="min-h-11 inline-flex items-center font-semibold text-primary underline underline-offset-4" onClick={() => onSelectLocation(location.id)}>Directions</button>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {destination ? (
          <Marker
            position={destination.coordinates as LatLng}
            icon={markerIcon(destination.name, destination.locationId ? itemCounts.get(destination.locationId) ?? null : null, ["is-destination", destination.coordinates.precision === "estimated" ? "is-estimated" : ""])}
            zIndexOffset={1000}
            keyboard
          >
            <Popup>
              <p className="font-serif text-base font-bold">{destination.name}</p>
              {destination.areaName ? <p className="mt-1 text-xs text-muted-foreground">{destination.areaName}</p> : null}
              {destination.coordinates.precision === "estimated" ? <p className="mt-1 text-xs text-muted-foreground">Approximate</p> : null}
            </Popup>
          </Marker>
        ) : null}

        {userPosition ? (
          <>
            <Circle center={userPosition} radius={Math.max(userPosition.accuracyMeters, 5)} pathOptions={{ color: "#2563eb", weight: 1, fillOpacity: 0.12 }} />
            <CircleMarker center={userPosition} radius={7} pathOptions={{ color: "#ffffff", weight: 2, fillColor: "#2563eb", fillOpacity: 1 }}>
              <Popup>You are here</Popup>
            </CircleMarker>
          </>
        ) : null}

        {line ? <Polyline positions={line} pathOptions={{ color: "#7c2d12", weight: 3, dashArray: "6 8" }} /> : null}
      </MapContainer>
    </div>
  );
}
