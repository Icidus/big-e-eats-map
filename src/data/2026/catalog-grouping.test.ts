import { describe, expect, it } from "vitest";
import { catalogData } from "@/features/catalog/catalog";
import { CATEGORIES, type CategoryId } from "@/features/catalog/taxonomy";

const categoryIds = new Set<string>(CATEGORIES.map(([id]) => id));

function itemsIn(categoryId: CategoryId) {
  return catalogData.items.filter((item) => item.categoryIds.includes(categoryId));
}

function namesMatching(pattern: RegExp) {
  return catalogData.items.filter((item) => pattern.test(item.name));
}

describe("2026 catalog grouping", () => {
  it("defines the fair-day craving categories", () => {
    for (const id of ["fried-dough", "mac-cheese", "chicken-wings", "comfort-bowls", "global-eats", "pretzels-corn"]) {
      expect(categoryIds.has(id)).toBe(true);
    }
  });

  it("keeps the catch-all categories small enough to scan on a phone", () => {
    expect(itemsIn("other-savory").length).toBeLessThanOrEqual(25);
    expect(itemsIn("snacks-sides").length).toBeLessThanOrEqual(56);
    expect(itemsIn("desserts").length).toBeLessThanOrEqual(80);
  });

  it.each<[string, RegExp, CategoryId]>([
    ["barbecue", /\b(bbq|barbecue|brisket|pulled pork|ribs|smokehouse)\b(?!.*\b(dog|potato|poutine|popover|mac)\b)/i, "barbecue"],
    ["fries, tots and potatoes", /\b(fries|tots|poutine|potato(?:es)?|spuds)\b/i, "potatoes-fries"],
    ["mac and cheese", /\bmac\b.*(cheese|attack|melt)|\bmac\s*['’]?n\b/i, "mac-cheese"],
    ["fried dough and funnel cakes", /\b(funnel|fried dough|dough nuggets|beignet|fried oreo|fried candy|fried twinkie|fried cheesecake|fried butter)/i, "fried-dough"],
    ["sandwiches", /\b(sandwich|reuben|panini|po. ?boy|grilled cheese|hoagie)/i, "sandwiches"],
    ["pretzels and corn", /\b(pretzel|corn on|roasted corn|corn in a cup|corn)\b(?!\s*dog)/i, "pretzels-corn"],
    ["chicken tenders and wings", /\b(chicken tender|chicken finger|chicken strip|wings)\b/i, "chicken-wings"],
    ["soups and bowls", /\b(soup|bread bowl|chili|goulash|stew|pot pie|shepherd)/i, "comfort-bowls"],
    ["breakfast", /\bbreakfast\b/i, "breakfast"],
  ])("files %s where a fairgoer would look", (_label, pattern, categoryId) => {
    const matches = namesMatching(pattern).filter((item) => !/sundae|waffle|slider|burger|pizza|taco|corn ?dog|corndog|apple fries|wrap|croquette|pancake|ice cream|cauliflower|dog|burrito|caramel corn/i.test(item.name));
    expect(matches.length).toBeGreaterThan(0);
    for (const item of matches) {
      expect(item.categoryIds, `${item.vendor}: ${item.name}`).toContain(categoryId);
    }
  });

  it("files coffee, lemonade, smoothies and shakes under nonalcoholic drinks rather than desserts", () => {
    const drinks = namesMatching(/\b(coffee|lemonade|latte|smoothie|milkshake|bubble tea|boba|chai|slush|soda|root beer|tea)\b/i)
      .filter((item) => !item.tagIds.includes("alcoholic") && !/sundae|cake|ice cream|shake tots/i.test(item.name));
    expect(drinks.length).toBeGreaterThan(5);
    for (const item of drinks) {
      expect(item.categoryIds, `${item.vendor}: ${item.name}`).toContain("nonalcoholic-drinks");
      expect(item.categoryIds, `${item.vendor}: ${item.name}`).not.toContain("desserts");
    }
  });

  it("files margaritas, mojitos and spiked drinks under cocktails", () => {
    const cocktails = namesMatching(/\b(margarita|mojito|spiked|martini|bellini|sangria)\b/i).filter((item) => !/mocktail|boba/i.test(item.name));
    expect(cocktails.length).toBeGreaterThan(3);
    for (const item of cocktails) {
      expect(item.categoryIds, `${item.vendor}: ${item.name}`).toContain("cocktails");
      expect(item.tagIds, `${item.vendor}: ${item.name}`).toContain("alcoholic");
    }
  });

  it("tags everything called fried as fried", () => {
    for (const item of namesMatching(/\bfried\b/i)) {
      expect(item.tagIds, `${item.vendor}: ${item.name}`).toContain("fried");
    }
  });

  it("does not leave a savory item in a sweets-only category without a savory reason", () => {
    for (const item of itemsIn("desserts")) {
      expect(item.tagIds, `${item.vendor}: ${item.name}`).not.toContain("drinks");
    }
  });

  it("uses one Avenue of States stop for the New England state buildings", () => {
    expect(catalogData.locationsById.has("state-buildings")).toBe(false);
    expect(catalogData.locationsById.get("avenue-of-states")?.description).toMatch(/state/i);
    expect(catalogData.items.filter((item) => item.locationIds.includes("avenue-of-states")).length).toBeGreaterThanOrEqual(85);
  });
});
