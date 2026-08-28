import { describe, expect, it } from "vitest";
import type { CatalogItem, EditorialCollection, FairLocation } from "@/features/catalog/catalog";
import { EMPTY_DISCOVERY_STATE } from "./types";
import { searchAndFilter, sortItems, type DiscoveryContext } from "./search";

const source = {
  publisher: "The Big E",
  title: "New Foods",
  url: "https://www.thebige.com/p/food2/newfoods",
  accessedOn: "2026-08-27",
};

const locations: FairLocation[] = [
  { id: "the-front-porch", name: "The Front Porch", description: "Porch", mapImage: "porch.png", order: 2 },
  { id: "east-road", name: "East Road", description: "East", mapImage: "east.png", order: 7 },
  { id: "west-road", name: "West Road", description: "West", mapImage: "west.png", order: 8 },
];

function item(overrides: Partial<CatalogItem> & Pick<CatalogItem, "id" | "name">): CatalogItem {
  return {
    id: overrides.id,
    year: 2026,
    name: overrides.name,
    vendor: "Fair Vendor",
    locationIds: [],
    description: "A fair food.",
    categoryIds: ["other-savory"],
    tagIds: [],
    dietaryClaims: [],
    isNewFor2026: true,
    source,
    ...overrides,
  };
}

const frontCocktail = item({
  id: "front-cocktail", name: "Front Porch Cocktail", vendor: "Alpha Drinks", locationIds: ["the-front-porch"],
  categoryIds: ["cocktails"], tagIds: ["drinks", "alcoholic"],
});
const frontDessert = item({
  id: "front-dessert", name: "Front Porch Sundae", vendor: "Zulu Sweets", locationIds: ["the-front-porch"],
  categoryIds: ["desserts"], tagIds: ["sweet"],
});
const multiLocation = item({
  id: "multi-location", name: "Roadside Cocktail", locationIds: ["east-road", "west-road"],
  categoryIds: ["cocktails"], tagIds: ["drinks"],
});
const unknownLocation = item({ id: "unknown-location", name: "Mystery Treat" });
const creamPuff = item({
  id: "cream-puff", name: "Peanut Butter Cream Puff", locationIds: ["east-road"],
  categoryIds: ["desserts"], tagIds: ["sweet"],
});
const descriptionMatch = item({
  id: "description-match", name: "Cinnamon Donut", vendor: "Creem Poff Kitchen",
  locationIds: ["west-road"], description: "A cocktail-style creem poff topping.",
  categoryIds: ["desserts"], tagIds: ["sweet"],
});
const punctuationItem = item({
  id: "punctuation-item", name: "O'Malley's Frozen-Cider", locationIds: ["west-road"],
  categoryIds: ["nonalcoholic-drinks"], tagIds: ["drinks"],
});
const items = [frontCocktail, frontDessert, multiLocation, unknownLocation, creamPuff, descriptionMatch, punctuationItem];
const collection: EditorialCollection = {
  id: "front-picks", title: "Front Picks", description: "Front Porch choices.",
  itemIds: ["front-dessert", "front-cocktail"], source,
};
const context: DiscoveryContext = { locations, collectionsById: new Map([[collection.id, collection]]) };
const nameOrder = ["description-match", "front-cocktail", "front-dessert", "unknown-location", "punctuation-item", "cream-puff", "multi-location"];

describe("searchAndFilter", () => {
  it("uses OR within categories and AND across locations", () => {
    const results = searchAndFilter(items, {
      ...EMPTY_DISCOVERY_STATE, categoryIds: ["cocktails", "desserts"], locationIds: ["the-front-porch"],
    }, context);

    expect(results.map((result) => result.id)).toEqual(["front-cocktail", "front-dessert"]);
  });

  it("finds unknown-location items with the tbd sentinel", () => {
    const results = searchAndFilter(items, { ...EMPTY_DISCOVERY_STATE, locationIds: ["tbd"] }, context);

    expect(results.map((result) => result.id)).toEqual(["unknown-location"]);
  });

  it("returns a multi-location item once when either location matches", () => {
    const results = searchAndFilter(items, {
      ...EMPTY_DISCOVERY_STATE, locationIds: ["east-road", "west-road"],
    }, context);

    expect(results.filter((result) => result.id === "multi-location")).toHaveLength(1);
  });

  it("ranks exact names above fuzzy description and vendor matches", () => {
    const results = searchAndFilter(items, { ...EMPTY_DISCOVERY_STATE, query: "cream puff", sort: "relevance" }, context);

    expect(results[0]?.name).toMatch(/Cream Puff/);
  });

  it("handles duplicate IDs in text searches without returning duplicates", () => {
    const results = searchAndFilter([...items, { ...frontCocktail }], {
      ...EMPTY_DISCOVERY_STATE, query: "front porch cocktail",
    }, context);

    expect(results.map((result) => result.id)).toEqual(["front-cocktail"]);
  });

  it("supports representative misspellings", () => {
    const results = searchAndFilter(items, { ...EMPTY_DISCOVERY_STATE, query: "coctail", sort: "relevance" }, context);

    expect(results.some((result) => result.categoryIds.includes("cocktails"))).toBe(true);
  });

  it("normalizes punctuation and supports prefixes", () => {
    expect(searchAndFilter(items, { ...EMPTY_DISCOVERY_STATE, query: "O’Malley’s frozen ci" }, context))
      .toContainEqual(punctuationItem);
  });

  it("keeps collection order before further filtering", () => {
    expect(searchAndFilter(items, { ...EMPTY_DISCOVERY_STATE, collectionId: "front-picks" }, context).map((result) => result.id))
      .toEqual(["front-dessert", "front-cocktail"]);
  });

  it("defaults to name A-Z without a query or collection", () => {
    expect(searchAndFilter(items, EMPTY_DISCOVERY_STATE, context).map((result) => result.id)).toEqual(nameOrder);
  });

  it("defaults a text query to relevance when sort is absent", () => {
    expect(searchAndFilter(items, { ...EMPTY_DISCOVERY_STATE, query: "cream puff" }, context)[0]?.id).toBe("cream-puff");
  });

  it("uses explicit name and vendor sorts instead of collection order", () => {
    const state = { ...EMPTY_DISCOVERY_STATE, collectionId: "front-picks" };

    expect(searchAndFilter(items, { ...state, sort: "name" }, context).map((result) => result.id))
      .toEqual(["front-cocktail", "front-dessert"]);
    expect(searchAndFilter(items, { ...state, sort: "vendor" }, context).map((result) => result.id))
      .toEqual(["front-cocktail", "front-dessert"]);
  });

  it("falls back to name A-Z for relevance without a query", () => {
    expect(searchAndFilter(items, { ...EMPTY_DISCOVERY_STATE, sort: "relevance" }, context).map((result) => result.id))
      .toEqual(nameOrder);
  });
});

describe("sortItems", () => {
  it("sorts by first location and places TBD last", () => {
    expect(sortItems(items, "location", context).at(-1)?.locationIds).toEqual([]);
    expect(sortItems([multiLocation], "location", context)[0]?.locationIds[0]).toBe("east-road");
  });
});
