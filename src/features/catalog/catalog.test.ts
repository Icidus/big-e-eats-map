import { describe, expect, it } from "vitest";
import { loadCatalogData, vendorIdForName } from "./catalog";

const source = {
  publisher: "The Big E",
  title: "New Foods",
  url: "https://www.thebige.com/p/food2/newfoods",
  accessedOn: "2026-08-27",
};
const location = {
  id: "the-front-porch",
  name: "The Front Porch",
  description: "A fairground food and entertainment area.",
  order: 2,
};
const item = {
  id: "wave-caramel-apple-mocktail",
  year: 2026,
  name: "Caramel Apple Mocktail",
  vendor: "W.A.V.E. Mocktail Bar",
  locationIds: ["the-front-porch"],
  description: "Local apple cider with vanilla, lemon, and caramel.",
  categoryIds: ["mocktails"],
  tagIds: ["drinks", "nonalcoholic", "apple", "fall-flavors"],
  dietaryClaims: [],
  isNewFor2026: true,
  source,
};

describe("loadCatalogData", () => {
  it("accepts a valid 2026 item", () => {
    const data = loadCatalogData({ items: [item], locations: [location], collections: [] });
    expect(data.itemsById.get(item.id)?.name).toBe(item.name);
  });

  it("accepts no location and isNewFor2026 false", () => {
    const data = loadCatalogData({
      items: [{ ...item, id: "returning-item", locationIds: [], isNewFor2026: false }],
      locations: [location],
      collections: [],
    });
    expect(data.items[0].locationIds).toEqual([]);
  });

  it("rejects a non-2026 record", () => {
    expect(() => loadCatalogData({
      items: [{ ...item, year: 2025 }],
      locations: [location],
      collections: [],
    })).toThrow(/2026/);
  });

  it("rejects duplicates and unresolved nonempty references", () => {
    expect(() => loadCatalogData({
      items: [item, { ...item }],
      locations: [location],
      collections: [],
    })).toThrow(/duplicate/i);
    expect(() => loadCatalogData({
      items: [{ ...item, locationIds: ["missing"] }],
      locations: [location],
      collections: [],
    })).toThrow(/location/i);
  });

  it("rejects an unknown collection item", () => {
    expect(() => loadCatalogData({
      items: [item],
      locations: [location],
      collections: [{ id: "picks", title: "Picks", description: "Editor picks", itemIds: ["missing"] }],
    })).toThrow(/collection/i);
  });

  it("rejects an item without a controlled category", () => {
    expect(() => loadCatalogData({
      items: [{ ...item, categoryIds: [] }],
      locations: [location],
      collections: [],
    })).toThrow(/categoryIds/i);
  });

  it("exposes deterministic ordered vendor options and name lookup", () => {
    const data = loadCatalogData({
      items: [item, { ...item, id: "apple-treat", vendor: "Apple Booth" }],
      locations: [location],
      collections: [],
    });

    expect(vendorIdForName("W.A.V.E. Mocktail Bar")).toBe("w-a-v-e-mocktail-bar");
    expect(data.vendorOptions).toEqual([
      { id: "apple-booth", name: "Apple Booth" },
      { id: "w-a-v-e-mocktail-bar", name: "W.A.V.E. Mocktail Bar" },
    ]);
    expect(data.vendorNamesById.get("w-a-v-e-mocktail-bar")).toBe("W.A.V.E. Mocktail Bar");
  });

  it("rejects vendor slug collisions instead of merging different names", () => {
    expect(() => loadCatalogData({
      items: [
        { ...item, vendor: "A & B" },
        { ...item, id: "second-item", vendor: "A and B" },
      ],
      locations: [location],
      collections: [],
    })).toThrow(/vendor slug collision/i);
  });
});
