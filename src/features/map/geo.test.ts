import { describe, expect, it } from "vitest";
import type { CatalogItem, FairLocation } from "@/features/catalog/schema";
import {
  bearingDegrees,
  compassWord,
  describeWalk,
  detectPlatform,
  distanceMeters,
  FAIRGROUND_CENTER,
  resolveDestination,
  walkingDirectionsUrl,
} from "./geo";

const youngBuilding = { lat: 42.0912512, lng: -72.6166043 };
const betterLivingCenter = { lat: 42.0925352, lng: -72.6168572 };

describe("distanceMeters", () => {
  it("returns zero for the same point", () => {
    expect(distanceMeters(youngBuilding, youngBuilding)).toBe(0);
  });

  it("measures the Young Building to Better Living Center walk within a few meters", () => {
    const meters = distanceMeters(youngBuilding, betterLivingCenter);
    expect(meters).toBeGreaterThan(140);
    expect(meters).toBeLessThan(150);
  });
});

describe("bearingDegrees and compassWord", () => {
  const step = 0.001;
  const lngStep = step / Math.cos((FAIRGROUND_CENTER.lat * Math.PI) / 180);

  it.each([
    ["north", step, 0],
    ["northeast", step, lngStep],
    ["east", 0, lngStep],
    ["southeast", -step, lngStep],
    ["south", -step, 0],
    ["southwest", -step, -lngStep],
    ["west", 0, -lngStep],
    ["northwest", step, -lngStep],
  ])("resolves %s", (word, dLat, dLng) => {
    const to = { lat: FAIRGROUND_CENTER.lat + dLat, lng: FAIRGROUND_CENTER.lng + dLng };
    expect(compassWord(bearingDegrees(FAIRGROUND_CENTER, to))).toBe(word);
  });

  it("wraps degrees outside 0 to 360", () => {
    expect(compassWord(359)).toBe("north");
    expect(compassWord(-90)).toBe("west");
    expect(compassWord(450)).toBe("east");
  });
});

describe("describeWalk", () => {
  it("uses meters under a kilometer", () => {
    const to = { lat: FAIRGROUND_CENTER.lat + 0.002, lng: FAIRGROUND_CENTER.lng };
    expect(describeWalk(FAIRGROUND_CENTER, to)).toMatch(/^About 22\d m, north$/);
  });

  it("uses one-decimal kilometers at a kilometer or more", () => {
    const to = { lat: FAIRGROUND_CENTER.lat - 0.012, lng: FAIRGROUND_CENTER.lng };
    expect(describeWalk(FAIRGROUND_CENTER, to)).toBe("About 1.3 km, south");
  });
});

describe("directions", () => {
  it("detects Apple platforms from the user agent", () => {
    expect(detectPlatform("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)")).toBe("apple");
    expect(detectPlatform("Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0)")).toBe("apple");
    expect(detectPlatform("Mozilla/5.0 (Linux; Android 14; Pixel 8)")).toBe("google");
    expect(detectPlatform("Mozilla/5.0 (darwin) AppleWebKit/537.36 jsdom/30.0.1")).toBe("google");
  });

  it("builds walking directions URLs for both platforms", () => {
    const to = { lat: 42.0905, lng: -72.616 };
    expect(walkingDirectionsUrl(to, "apple")).toBe("https://maps.apple.com/?daddr=42.0905,-72.616&dirflg=w");
    expect(walkingDirectionsUrl(to, "google")).toBe("https://www.google.com/maps/dir/?api=1&destination=42.0905,-72.616&travelmode=walking");
  });
});

describe("resolveDestination", () => {
  const source = { publisher: "Test", title: "Test", url: "https://example.com", accessedOn: "2026-09-14" };
  const mapped = { lat: 42.0916, lng: -72.619, source: "test", precision: "mapped" as const };
  const estimated = { lat: 42.0905, lng: -72.616, source: "test", precision: "estimated" as const };
  const frontPorch: FairLocation = { id: "the-front-porch", name: "The Front Porch", description: "", order: 1, coordinates: mapped };
  const foodCourt: FairLocation = { id: "food-court", name: "Food Court", description: "", order: 2, coordinates: estimated };
  const unplaced: FairLocation = { id: "unplaced", name: "Unplaced", description: "", order: 3 };
  const locationsById = new Map([[frontPorch.id, frontPorch], [foodCourt.id, foodCourt], [unplaced.id, unplaced]]);
  const item: CatalogItem = {
    id: "panella", year: 2026, name: "Panella", vendor: "Calabrese Market", locationIds: ["food-court"],
    description: "Chickpea fritter.", categoryIds: ["sandwiches"], tagIds: [], dietaryClaims: [], isNewFor2026: false, source,
  };

  it("prefers an item's own coordinates and names its area", () => {
    const stand = { lat: 42.0906, lng: -72.6161, source: "on-site", precision: "mapped" as const };
    expect(resolveDestination({ ...item, coordinates: stand }, locationsById)).toEqual({
      id: "panella", kind: "item", name: "Panella", vendor: "Calabrese Market", areaName: "Food Court", locationId: "food-court", coordinates: stand,
    });
  });

  it("falls back to the first located area of an item", () => {
    expect(resolveDestination({ ...item, locationIds: ["unplaced", "the-front-porch"] }, locationsById)).toEqual({
      id: "panella", kind: "item", name: "Panella", vendor: "Calabrese Market", areaName: "The Front Porch", locationId: "the-front-porch", coordinates: mapped,
    });
  });

  it("resolves a location to itself", () => {
    expect(resolveDestination(foodCourt, locationsById)).toEqual({
      id: "food-court", kind: "location", name: "Food Court", vendor: null, areaName: null, locationId: "food-court", coordinates: estimated,
    });
  });

  it("returns null when nothing is placed", () => {
    expect(resolveDestination({ ...item, locationIds: [] }, locationsById)).toBeNull();
    expect(resolveDestination({ ...item, locationIds: ["unplaced"] }, locationsById)).toBeNull();
    expect(resolveDestination(unplaced, locationsById)).toBeNull();
  });
});
