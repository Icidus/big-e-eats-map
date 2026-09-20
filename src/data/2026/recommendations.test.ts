import { expect, it } from "vitest";
import { catalogData } from "@/features/catalog/catalog";

it("keeps the complete Instagram taste test separate from the favorites", () => {
  const tasteTest = catalogData.collectionsById.get("masslive-taste-test");
  expect(tasteTest?.itemIds).toHaveLength(22);
  expect(tasteTest?.source?.url).toBe("https://www.instagram.com/p/DdchKszA8YB/");
  expect(tasteTest?.itemIds).toContain("big-e-chocolate-pickle-tacos");
  for (const id of tasteTest?.itemIds ?? []) {
    const item = catalogData.itemsById.get(id);
    expect(item?.description, id).toContain("September 18, 2026");
    expect([item?.source, ...(item?.supportingSources ?? [])].some((source) => source?.url === tasteTest?.source?.url), id).toBe(true);
  }
  expect(catalogData.itemsById.get("jacks-chicken-bacon-ranch-fries")?.description).toMatch(/4\/10.*8\/10.*extra ranch/);
  expect(catalogData.itemsById.get("big-e-chocolate-pickle-tacos")?.vendor).toBe("Chocolate Moonshine");
});

it("preserves MassLive’s ten guide picks and excludes its negatively reviewed taco", () => {
  expect(catalogData.collectionsById.get("masslive-must-try")?.itemIds).toEqual([
    "marion-s-fried-dough-fried-butter", "anna-s-fried-dough-doughco", "crazy-sushi-push-up-sushi",
    "giant-corn-dog-factory-dilly-dilly-dog", "new-england-craft-beer-pub-turducken-sandwich",
    "mackens-sliders-bacon-waffle-slider", "moolicious-moonugs", "the-broccoli-bar-big-sexy-platter",
    "porky-s-bbq-sundae", "angela-s-pizza-giant-mozzarella-stick",
  ]);
  const favorites = catalogData.collectionsById.get("masslive-opening-day");
  expect(favorites?.itemIds).toHaveLength(9);
  expect(favorites?.itemIds).not.toContain("big-e-chocolate-pickle-tacos");
  expect(favorites?.source?.publisher).toBe("MassLive");
});

it("includes exactly the source-backed new-for-2026 foods", () => {
  expect(catalogData.collectionsById.get("new-for-2026")?.itemIds).toEqual(
    catalogData.items.filter((item) => item.isNewFor2026).map((item) => item.id),
  );
});

it("distinguishes the embedded 2025 guide picks from the 2026 opening-day review", () => {
  const older = catalogData.collectionsById.get("masslive-must-try");
  expect(older?.title).toContain("2025");
  expect(older?.description).toContain("2025");
  const current = catalogData.collectionsById.get("masslive-opening-day");
  expect(current?.title).toContain("2026");
  expect(current?.description).toContain("September 19, 2026");
});
