import type { CatalogItem, FairLocation } from "@/features/catalog/catalog";
import { describe, expect, it } from "vitest";
import {
  EMPTY_PLAN,
  PLAN_STORAGE_KEY,
  decodeSharedItems,
  encodeSharedItems,
  groupPlanItems,
  loadPlan,
  savePlan,
} from "./planStore";

class MemoryStorage implements Pick<Storage, "getItem" | "setItem"> {
  private values = new Map<string, string>();

  constructor(initial: Record<string, string> = {}) {
    Object.entries(initial).forEach(([key, value]) => this.values.set(key, value));
  }

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

const item = (id: string, locationIds: string[] = []): CatalogItem => ({
  id,
  year: 2026,
  name: id,
  vendor: "Test vendor",
  locationIds,
  description: "Test item",
  categoryIds: [],
  tagIds: [],
  dietaryClaims: [],
  isNewFor2026: false,
  source: {
    publisher: "Test publisher",
    title: "Test source",
    url: "https://example.com/test",
    accessedOn: "2026-08-27",
  },
});

const locations: FairLocation[] = [
  { id: "east-road", name: "East Road", description: "", order: 2 },
  { id: "avenue", name: "Avenue", description: "", order: 1 },
];

describe("plan storage", () => {
  it("round-trips a versioned normalized plan", () => {
    const storage = new MemoryStorage();

    savePlan(storage, { itemIds: ["a", "b", "a"], checkedIds: ["b", "c", "b"] });

    expect(loadPlan(storage)).toEqual({ itemIds: ["a", "b"], checkedIds: ["b"] });
  });

  it("returns fresh empty state for missing, blocked, corrupt, or invalid storage", () => {
    expect(loadPlan(new MemoryStorage())).toEqual(EMPTY_PLAN);
    expect(loadPlan({ getItem: () => { throw new Error("blocked"); } })).toEqual(EMPTY_PLAN);
    expect(loadPlan(new MemoryStorage({ [PLAN_STORAGE_KEY]: "{" }))).toEqual(EMPTY_PLAN);
    expect(loadPlan(new MemoryStorage({ [PLAN_STORAGE_KEY]: JSON.stringify({ itemIds: ["a"], checkedIds: "a" }) }))).toEqual(EMPTY_PLAN);

    const loaded = loadPlan(new MemoryStorage());
    loaded.itemIds.push("changed");
    expect(EMPTY_PLAN).toEqual({ itemIds: [], checkedIds: [] });
  });

  it("absorbs storage write failures", () => {
    expect(() => savePlan({ setItem: () => { throw new Error("quota"); } }, { itemIds: ["a"], checkedIds: [] })).not.toThrow();
  });
});

describe("plan sharing", () => {
  it("encodes deduplicated IDs without delimiter ambiguity", () => {
    expect(encodeSharedItems(["salt,pepper", "spicy & sweet", "salt,pepper"])).toBe("salt%2Cpepper,spicy%20%26%20sweet");
  });

  it("decodes known shared IDs, retains order, and reports missing IDs", () => {
    const known = item("known");
    const encoded = encodeSharedItems(["known", "missing", "known", "not/found"]);

    expect(decodeSharedItems(encoded, new Map([["known", known]]))).toEqual({
      itemIds: ["known"],
      missingIds: ["missing", "not/found"],
    });
  });

  it("handles malformed encoded IDs safely", () => {
    expect(decodeSharedItems("known,%E0%A4%A", new Map([["known", item("known")]]))).toEqual({
      itemIds: ["known"],
      missingIds: ["%E0%A4%A"],
    });
  });
});

describe("plan grouping", () => {
  it("groups a multi-location item once under its first location and appends TBD last", () => {
    const multiLocationItem = item("multi", ["east-road", "avenue"]);
    const unknownLocationItem = item("unknown", ["not-a-location"]);
    const noLocationItem = item("none");

    const groups = groupPlanItems([multiLocationItem, unknownLocationItem, noLocationItem], locations);

    expect(groups.map((group) => group.id)).toEqual(["east-road", "tbd"]);
    expect(groups[0]).toMatchObject({ name: "East Road", items: [multiLocationItem] });
    expect(groups[0]).not.toHaveProperty("mapImage");
    expect(groups[1]).toEqual({ id: "tbd", name: "Location TBD", items: [unknownLocationItem, noLocationItem] });
  });

  it("sorts known location groups by fair order instead of selection order", () => {
    const groups = groupPlanItems([item("east", ["east-road"]), item("avenue", ["avenue"])], locations);

    expect(groups.map((group) => group.id)).toEqual(["avenue", "east-road"]);
  });
});
