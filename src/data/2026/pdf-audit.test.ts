import { describe, expect, it } from "vitest";
import { catalogData } from "@/features/catalog/catalog";
import coverage from "./pdf-coverage.json";

describe("PDF source audit", () => {
  it("represents each named menu listing and its source area", () => {
    const missing = coverage.filter((entry) => {
      const item = catalogData.itemsById.get(entry.itemId);
      return !item || item.vendor !== entry.vendor || (entry.locationId && !item.locationIds.includes(entry.locationId));
    });
    expect(missing).toEqual([]);
  });

  it("distinguishes soda and ice cream from alcoholic drinks and savory food", () => {
    const butterbeer = catalogData.itemsById.get("sweet-and-salty-butterbeer");
    expect(butterbeer?.categoryIds).toEqual(["nonalcoholic-drinks"]);
    expect(butterbeer?.tagIds).not.toContain("alcoholic");
    expect(catalogData.itemsById.get("moolicious-moonugs")?.categoryIds).toContain("ice-cream");
    expect(catalogData.itemsById.get("the-nook-strawberry-dubai-cup")?.categoryIds).toContain("desserts");
    for (const id of ["mojito-bar-giant-margaritas", "mojito-bar-rum-buckets", "the-smoking-dragon-bar-smoking-cocktails"]) {
      expect(catalogData.itemsById.get(id)?.categoryIds).toEqual(["cocktails"]);
    }
    expect(catalogData.itemsById.get("downeast-cream-puff-cider")?.categoryIds).toEqual(["beer-cider"]);
  });

  it("shows one cream puff and one Alfredo bomb per vendor", () => {
    expect(catalogData.items.filter((item) => item.name === "Peanut Butter Cream Puff")).toHaveLength(1);
    expect(catalogData.items.filter((item) => /alfredo.*bomb|bomb.*alfredo/i.test(item.name))).toHaveLength(1);
    expect(catalogData.items.some((item) => item.name.startsWith("GF "))).toBe(false);
  });

  it("retains the delayed availability of the S’Macaron", () => {
    expect(catalogData.itemsById.get("vermont-marshmallow-company-s-macaron")?.description).toMatch(/Tuesday/i);
  });
});
