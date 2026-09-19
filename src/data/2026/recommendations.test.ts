import { expect, it } from "vitest";
import { catalogData } from "@/features/catalog/catalog";

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
