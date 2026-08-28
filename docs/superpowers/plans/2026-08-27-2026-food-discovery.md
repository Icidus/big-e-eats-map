# Big E 2026 Food Discovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the public 2025 catalog with a source-confirmed 2026 catalog and deliver browse-first discovery, faceted fuzzy search, editorial collections, and an account-free shareable food plan.

**Architecture:** Keep the application as a static React/Vite SPA on GitHub Pages. Load validated JSON into a typed catalog module, run MiniSearch and facet logic entirely in the browser, encode browse state in URL parameters, and persist a food plan in local storage. Pages compose focused catalog, discovery, and plan modules rather than querying the legacy nested location data.

**Tech Stack:** React 18, TypeScript, Vite 5, React Router 6, Tailwind CSS, shadcn/Radix UI, Zod, MiniSearch, Vitest, React Testing Library, jsdom

**Spec:** `docs/superpowers/specs/2026-08-27-2026-food-discovery-design.md`

## Global Constraints

- Public food and drink records must be explicitly confirmed for the 2026 Big E.
- Do not display or search any unconfirmed 2025 food or 2025 recommendation content.
- Keep the site static on GitHub Pages; do not add a database, backend API, authentication, scraper, or recurring infrastructure service.
- Every item must have source attribution with publisher, title, URL, and access date.
- Allow `locationIds: []`; display `Location not yet announced` and group it under `Location TBD` last in My Food Plan.
- Nonempty location IDs, category IDs, tag IDs, dietary claims, and collection item IDs must resolve to controlled values.
- Use explicit categories and tags; delete runtime regex categorization.
- Use OR within one facet and AND across different facets.
- Use React Router links; do not hard-code `/big-e-eats-map` in application links.
- Multi-location items are browsable under every listed location, sort and group by their first listed location, and appear once in My Food Plan.
- Dietary claims are source-backed claims, not inferred allergen guarantees.
- Use TDD for each behavior and run a production build before completion.

---

### Task 1: Test Harness and Validated Catalog Boundary

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `vitest.config.ts`
- Create: `src/test/setup.ts`
- Create: `src/features/catalog/taxonomy.ts`
- Create: `src/features/catalog/schema.ts`
- Create: `src/features/catalog/catalog.ts`
- Create: `src/features/catalog/catalog.test.ts`
- Create: `src/data/2026/catalog.json`
- Create: `src/data/2026/locations.json`
- Create: `src/data/2026/collections.json`

**Interfaces:**
- Produces: `CatalogItem`, `FairLocation`, `EditorialCollection`, `CatalogData`, `loadCatalogData(raw): CatalogData`, `catalogData`, `catalogItems`, `locations`, `collections`, and ID maps
- Consumes: Zod and the 15 venue IDs/map associations plus still-accurate venue-only description text in `src/data/locations.ts`

- [ ] **Step 1: Install dependencies and configure Vitest**

Run:

```bash
npm ci
npm install minisearch
npm install --save-dev vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

Add `"test": "vitest run"` and `"test:watch": "vitest"` to `package.json`. Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  test: { environment: "jsdom", setupFiles: ["./src/test/setup.ts"], css: true },
});
```

Create `src/test/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 2: Write failing catalog tests**

Create `src/features/catalog/catalog.test.ts` with minimal inline data:

```ts
import { describe, expect, it } from "vitest";
import { loadCatalogData } from "./catalog";

const source = {
  publisher: "The Big E", title: "New Foods",
  url: "https://www.thebige.com/p/food2/newfoods", accessedOn: "2026-08-27",
};
const location = {
  id: "the-front-porch", name: "The Front Porch",
  description: "A fairground food and entertainment area.",
  mapImage: "the-front-porch.png", order: 2,
};
const item = {
  id: "wave-caramel-apple-mocktail", year: 2026, name: "Caramel Apple Mocktail",
  vendor: "W.A.V.E. Mocktail Bar", locationIds: ["the-front-porch"],
  description: "Local apple cider with vanilla, lemon, and caramel.",
  categoryIds: ["mocktails"],
  tagIds: ["drinks", "nonalcoholic", "apple", "fall-flavors"],
  dietaryClaims: [], isNewFor2026: true, source,
};

describe("loadCatalogData", () => {
  it("accepts a valid 2026 item", () => {
    const data = loadCatalogData({ items: [item], locations: [location], collections: [] });
    expect(data.itemsById.get(item.id)?.name).toBe(item.name);
  });

  it("accepts no location and isNewFor2026 false", () => {
    const data = loadCatalogData({
      items: [{ ...item, id: "returning-item", locationIds: [], isNewFor2026: false }],
      locations: [location], collections: [],
    });
    expect(data.items[0].locationIds).toEqual([]);
  });

  it("rejects a non-2026 record", () => {
    expect(() => loadCatalogData({
      items: [{ ...item, year: 2025 }], locations: [location], collections: [],
    })).toThrow(/2026/);
  });

  it("rejects duplicates and unresolved nonempty references", () => {
    expect(() => loadCatalogData({
      items: [item, { ...item }], locations: [location], collections: [],
    })).toThrow(/duplicate/i);
    expect(() => loadCatalogData({
      items: [{ ...item, locationIds: ["missing"] }], locations: [location], collections: [],
    })).toThrow(/location/i);
  });

  it("rejects an unknown collection item", () => {
    expect(() => loadCatalogData({
      items: [item], locations: [location],
      collections: [{ id: "picks", title: "Picks", description: "Editor picks", itemIds: ["missing"] }],
    })).toThrow(/collection/i);
  });
});
```

- [ ] **Step 3: Run the test and confirm RED**

Run `npm test -- src/features/catalog/catalog.test.ts`.

Expected: FAIL because `./catalog` does not exist.

- [ ] **Step 4: Define controlled taxonomy and Zod schemas**

Create `taxonomy.ts` with these controlled values:

```ts
export const CATEGORIES = [
  ["cocktails", "Cocktails"], ["mocktails", "Mocktails"], ["beer-cider", "Beer & Cider"],
  ["nonalcoholic-drinks", "Nonalcoholic Drinks"], ["desserts", "Desserts"],
  ["ice-cream", "Ice Cream"], ["donuts-pastries", "Donuts & Pastries"], ["candy", "Candy"],
  ["burgers", "Burgers"], ["hot-dogs-corndogs", "Hot Dogs & Corndogs"],
  ["sandwiches", "Sandwiches"], ["tacos-mexican", "Tacos & Mexican"],
  ["pizza-italian", "Pizza & Italian"], ["barbecue", "Barbecue"],
  ["seafood", "Seafood"], ["potatoes-fries", "Potatoes & Fries"],
  ["breakfast", "Breakfast"], ["snacks-sides", "Snacks & Sides"],
  ["other-savory", "Other Savory"],
] as const;

export const TAGS = [
  "drinks", "alcoholic", "nonalcoholic", "sweet", "savory", "spicy", "fried",
  "food-on-a-stick", "pickle", "birria", "hot-honey", "pumpkin", "apple",
  "fall-flavors", "chocolate", "maple", "bacon", "cheese", "new-vendor",
] as const;
export const DIETARY_CLAIMS = ["gluten-free", "vegetarian", "vegan"] as const;
export type CategoryId = (typeof CATEGORIES)[number][0];
export type TagId = (typeof TAGS)[number];
export type DietaryClaim = (typeof DIETARY_CLAIMS)[number];
```

In `schema.ts`, use `z.literal(2026)` for year, `z.array(...).default([])` for location IDs, `z.boolean()` for `isNewFor2026`, controlled enums for categories/tags/dietary values, and `z.string().url()` for source URLs. Export inferred types.

- [ ] **Step 5: Implement cross-record validation and exports**

Create `catalog.ts` with:

```ts
export interface CatalogData {
  items: CatalogItem[];
  locations: FairLocation[];
  collections: EditorialCollection[];
  itemsById: Map<string, CatalogItem>;
  locationsById: Map<string, FairLocation>;
  collectionsById: Map<string, EditorialCollection>;
}

export function loadCatalogData(raw: {
  items: unknown; locations: unknown; collections: unknown;
}): CatalogData;
```

Parse arrays, reject duplicate IDs, validate every nonempty location reference and every collection item ID, and name the broken entity in errors. Import the three JSON files and export the parsed arrays and maps.

- [ ] **Step 6: Create JSON files and migrate venue metadata**

Create empty `catalog.json` and `collections.json`. Create `locations.json` with map filenames, neutral venue descriptions, and this order:

```text
new-england-avenue, the-front-porch, commonwealth-avenue, food-court,
avenue-of-states, craft-common, east-road, west-road, springfield-road,
industrial-avenue, hampden-avenue, young-building, better-living-center,
new-england-center, state-buildings
```

Retain only durable spatial/venue facts from the old descriptions. Remove named foods/vendors, phrases such as `this year`, and prior-year availability/move claims. Do not copy nested 2025 food data.

- [ ] **Step 7: Verify GREEN and commit**

Run:

```bash
npm test -- src/features/catalog/catalog.test.ts
npm run lint
```

Expected: tests PASS and no new lint errors.

Commit:

```bash
git add package.json package-lock.json vitest.config.ts src/test src/features/catalog src/data/2026
git commit -m "feat: add validated 2026 catalog foundation"
```

---

### Task 2: Source-Confirmed 2026 Content and Collections

**Files:**
- Modify: `src/data/2026/catalog.json`
- Modify: `src/data/2026/collections.json`
- Create: `src/data/2026/catalog-content.test.ts`

**Interfaces:**
- Consumes: `catalogData`, controlled taxonomy, locations, and `https://www.thebige.com/p/food2/newfoods`
- Produces: complete initial item records and ordered collection definitions

- [ ] **Step 1: Write failing source-coverage tests**

Create `catalog-content.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { catalogData } from "@/features/catalog/catalog";

const requiredNewVendors = [
  "Tater Tot Heaven", "Cantina Louie", "Deep-fried Calzones", "Golden K-Dog",
  "K’s Japanese Restaurant Food Court", "McLaughlin Family Homemade Ice Cream",
  "Moose Joose Slush", "Rickey’s Jerky", "Simply Gluten Free", "Spudtastic",
  "Sweet & Salty", "Tripp’s Farmhouse Café",
];

describe("2026 catalog content", () => {
  it("contains only sourced 2026 records", () => {
    expect(catalogData.items.length).toBeGreaterThan(0);
    for (const item of catalogData.items) {
      expect(item.year).toBe(2026);
      expect(item.source.url).toBe("https://www.thebige.com/p/food2/newfoods");
      expect(item.source.accessedOn).toBe("2026-08-27");
    }
  });

  it.each(requiredNewVendors)("includes new vendor %s", (vendor) => {
    expect(catalogData.items.some((item) => item.vendor === vendor)).toBe(true);
  });

  it("does not duplicate a vendor/item identity", () => {
    const keys = catalogData.items.map((item) => `${item.vendor.toLowerCase()}::${item.name.toLowerCase()}`);
    expect(new Set(keys).size).toBe(keys.length);
  });
});
```

- [ ] **Step 2: Run the test and confirm RED**

Run `npm test -- src/data/2026/catalog-content.test.ts`.

Expected: FAIL because the catalog is empty.

- [ ] **Step 3: Translate the official page into individual records**

Use one record per distinctly named item and this mapping only for explicit labels:

```text
New England Ave. -> new-england-avenue
Front Porch -> the-front-porch
Commonwealth Ave. -> commonwealth-avenue
Food Court, East Road -> food-court
Avenue of States -> avenue-of-states
Craft Common -> craft-common
East Road -> east-road
West Road -> west-road
Springfield Road -> springfield-road
Industrial Ave. -> industrial-avenue
Hampden Ave. -> hampden-avenue
Young Building -> young-building
Better Living Center -> better-living-center
```

Use `locationIds: []` for missing/unresolved labels and preserve source order for multiple locations. Review every returning heading below and create records for every explicitly named item. Do not invent a record when a paragraph fails to name its item; as accessed on 2026-08-27, `The Fire House` paragraph is such a case and must be skipped until a source names the food.

```text
The Big E Bakery; All American Craft Beer Bar & Grill; Apple Fries; Barbie’s Ice Cream;
Big Kahuna’s; Boricua Bites; Broccoli Bar; Buni’s Bakery; Butcher Boys; Calabrese Market;
Chocolate Moonshine; Chompers; Cinnamon Saloon; Crave Café; Dolly’s Honky Tonk;
Downeast Cider Garden; Dr. Vegetable; Dribbles; E.B.’s; Kora & Mila's Cookie Dough;
Ferrindino Maple; Fluffy’s Hand Cut Donuts; Granville Country Store; Harpoon Beer Hall;
Hofbrauhaus Beer Garden; Jack’s Fries; Jim’s Deep Fried Taco; Las Kangris Food Truck;
LuAnn’s Bakery; Macho Taco; Meatball Factory; Moolicious Farm;
NOLA Cajun Kitchen & Raw Bar; Poppie’s Fresh Onion Rings; Porky’s BBQ Concessions;
Poutine Gourmet; Rudy’s Pizza; Rudy’s Slush; Sam Adams Beer Garden; Steaming Tender;
Storrowton Soup Shack; The Fire House; The Donut Family;
The Indian Restaurant in the Food Court; The Italian Pavillion; The Mick;
The New England Craft Beer Pub; The Paddock; Tootsie’s Fried Dough; V-One Vodka;
Veggie Patch; W.A.V.E. Mocktail Bar; West Springfield Lions Club;
White Hut in the Food Court; Wurst Haus; Yankee Boy
```

Use this source object for every initial record:

```json
{
  "publisher": "The Big E",
  "title": "New Foods",
  "url": "https://www.thebige.com/p/food2/newfoods",
  "accessedOn": "2026-08-27"
}
```

Paraphrase promotional descriptions. Assign at least one controlled category. Apply dietary claims only when explicit.

- [ ] **Step 4: Add initial ordered collections**

Create these collection IDs using matching catalog IDs:

- `wildest-new-foods`: Uncrusta Double Burger, Wagyu Beef Surf 'n Turf Burger, Sushi Corndog, Birria Bomb, Fried Deviled Eggs.
- `cocktails-and-mocktails`: all cocktail/mocktail items, with Caramel Apple Mocktail and Frozen Margarita Mocktail first.
- `desserts-worth-the-detour`: Peanut Butter Cream Puff, Deep-fried Cheesecake, Cookie Butter Cheesecake Donut, Maple Creemee Bacon Waffle, Campfire on a Stick.
- `gluten-free-fair-food`: only items with explicit source-backed gluten-free claims.
- `fall-flavors`: Fall in a Cup, Apple Cider Slush, Headless Pumpkin Cider, Caramel Apple Mocktail, Pumpkin Spice dirty soda.
- `savory-food-on-a-stick`: only savory records tagged `food-on-a-stick`.

Do not add an Editor's Shortlist until the owner supplies a ranking.

- [ ] **Step 5: Verify GREEN and commit**

Run:

```bash
npm test -- src/features/catalog/catalog.test.ts src/data/2026/catalog-content.test.ts
git diff --check
```

Expected: tests PASS with no duplicate identities, broken references, unsupported taxonomy, or whitespace errors.

Commit:

```bash
git add src/data/2026
git commit -m "data: add source-confirmed 2026 Big E foods"
```

---

### Task 3: Search, Facets, Sorting, and URL State

**Files:**
- Create: `src/features/discovery/types.ts`
- Create: `src/features/discovery/search.ts`
- Create: `src/features/discovery/search.test.ts`
- Create: `src/features/discovery/urlState.ts`
- Create: `src/features/discovery/urlState.test.ts`

**Interfaces:**
- Consumes: catalog types and data
- Produces: `DiscoveryState`, `SortMode`, `searchAndFilter`, `sortItems`, `parseDiscoveryState`, and `serializeDiscoveryState`

- [ ] **Step 1: Define discovery state**

Create `types.ts`:

```ts
import type { CategoryId, DietaryClaim, TagId } from "@/features/catalog/taxonomy";

export type SortMode = "relevance" | "name" | "vendor" | "location";
export interface DiscoveryState {
  query: string;
  categoryIds: CategoryId[];
  tagIds: TagId[];
  dietaryClaims: DietaryClaim[];
  locationIds: string[]; // May contain generated UI sentinel "tbd".
  collectionId?: string;
  sort?: SortMode; // Absent means context default: relevance, collection order, or name.
}
export const EMPTY_DISCOVERY_STATE: DiscoveryState = {
  query: "", categoryIds: [], tagIds: [], dietaryClaims: [], locationIds: [],
};
```

- [ ] **Step 2: Write failing search tests**

Build fixtures for cocktails, desserts, known/unknown locations, and a multi-location item. Assert:

```ts
it("uses OR within categories and AND across locations", () => {
  const results = searchAndFilter(items, {
    ...EMPTY_DISCOVERY_STATE,
    categoryIds: ["cocktails", "desserts"],
    locationIds: ["the-front-porch"],
  }, context);
  expect(results.map((item) => item.id)).toEqual(["front-cocktail", "front-dessert"]);
});

it("finds unknown-location items with the tbd sentinel", () => {
  const results = searchAndFilter(items, {
    ...EMPTY_DISCOVERY_STATE, locationIds: ["tbd"],
  }, context);
  expect(results.map((item) => item.id)).toEqual(["unknown-location"]);
});

it("returns a multi-location item once when either location matches", () => {
  const results = searchAndFilter(items, {
    ...EMPTY_DISCOVERY_STATE, locationIds: ["east-road", "west-road"],
  }, context);
  expect(results.filter((item) => item.id === "multi-location")).toHaveLength(1);
});

it("ranks exact names above fuzzy description matches", () => {
  const results = searchAndFilter(items, {
    ...EMPTY_DISCOVERY_STATE, query: "cream puff", sort: "relevance",
  }, context);
  expect(results[0].name).toMatch(/Cream Puff/);
});

it("supports representative misspellings", () => {
  const results = searchAndFilter(items, {
    ...EMPTY_DISCOVERY_STATE, query: "coctail", sort: "relevance",
  }, context);
  expect(results.some((item) => item.categoryIds.includes("cocktails"))).toBe(true);
});

it("sorts by first location and places TBD last", () => {
  expect(sortItems(items, "location", context).at(-1)?.locationIds).toEqual([]);
  expect(sortItems([multiLocation], "location", context)[0].locationIds[0]).toBe("east-road");
});
```

- [ ] **Step 3: Run search tests and confirm RED**

Run `npm test -- src/features/discovery/search.test.ts`.

Expected: FAIL because discovery functions do not exist.

- [ ] **Step 4: Implement MiniSearch, facets, deduplication, and sorting**

Create `search.ts` with:

```ts
export interface DiscoveryContext {
  locations: FairLocation[];
  collectionsById: Map<string, EditorialCollection>;
}
export function searchAndFilter(
  items: CatalogItem[], state: DiscoveryState, context: DiscoveryContext,
): CatalogItem[];
export function sortItems(
  items: CatalogItem[], mode: SortMode, context: DiscoveryContext,
): CatalogItem[];
```

Index normalized item name, vendor, category labels/tags, location names, and description. Boost in that order. Enable prefix matching and `fuzzy: 0.2` only for queries at least four characters long. Normalize case, curly apostrophes, punctuation, and hyphens before indexing/querying.

Apply collection membership and facets after text lookup. Use `.some` within each facet and `&&` across facets. `tbd` matches only `locationIds.length === 0`. Deduplicate by ID. When `state.sort` is absent, default to relevance for text queries, collection order for an active collection, and item name A-Z otherwise. Explicit sorts are relevance, name, vendor, and first fairground location, with TBD last.

- [ ] **Step 5: Write failing URL-state tests**

```ts
it("round-trips multiselect facets and sort", () => {
  const state = {
    query: "hot honey", categoryIds: ["desserts", "cocktails"], tagIds: ["spicy"],
    dietaryClaims: ["gluten-free"], locationIds: ["the-front-porch", "tbd"],
    collectionId: "fall-flavors", sort: "vendor",
  } satisfies DiscoveryState;
  expect(parseDiscoveryState(serializeDiscoveryState(state))).toEqual(state);
});

it("drops unknown values and defaults to name without a query", () => {
  expect(parseDiscoveryState(new URLSearchParams("categories=bogus&sort=bogus")))
    .toEqual(EMPTY_DISCOVERY_STATE);
});
```

- [ ] **Step 6: Implement stable URL parsing/serialization**

Use parameters `q`, `categories`, `tags`, `dietary`, `locations`, `collection`, and `sort`. Encode multi-select values as comma-separated IDs, retain controlled values plus `tbd`, and omit absent sort overrides. `searchAndFilter` resolves the context-dependent default; URL parsing does not manufacture one.

- [ ] **Step 7: Verify GREEN and commit**

Run `npm test -- src/features/discovery`.

Expected: all discovery tests PASS.

```bash
git add src/features/discovery
git commit -m "feat: add faceted fuzzy food discovery"
```

---

### Task 4: Food Plan State, Sharing, and Grouping

**Files:**
- Create: `src/features/plan/planStore.ts`
- Create: `src/features/plan/planStore.test.ts`
- Create: `src/features/plan/FoodPlanProvider.tsx`
- Create: `src/features/plan/FoodPlanProvider.test.tsx`

**Interfaces:**
- Consumes: catalog item/location types and indexes
- Produces: `PlanState`, `PlanGroup`, storage/share/group helpers, `FoodPlanProvider`, and `useFoodPlan`

- [ ] **Step 1: Write failing plan-store tests**

Use an in-test `MemoryStorage` and assert:

```ts
class MemoryStorage implements Pick<Storage, "getItem" | "setItem"> {
  private values = new Map<string, string>();
  constructor(initial: Record<string, string> = {}) {
    Object.entries(initial).forEach(([key, value]) => this.values.set(key, value));
  }
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, value); }
}

it("round-trips a versioned plan", () => {
  const storage = new MemoryStorage();
  savePlan(storage, { itemIds: ["a", "b"], checkedIds: ["a"] });
  expect(loadPlan(storage)).toEqual({ itemIds: ["a", "b"], checkedIds: ["a"] });
});

it("returns empty state for blocked or corrupt storage", () => {
  expect(loadPlan({ getItem: () => { throw new Error("blocked"); } } as Storage)).toEqual(EMPTY_PLAN);
  expect(loadPlan(new MemoryStorage({ "big-e-food-plan:v1": "{" }))).toEqual(EMPTY_PLAN);
});

it("groups a multi-location item once under its first location and TBD last", () => {
  const groups = groupPlanItems([multiLocationItem, unknownLocationItem], locations);
  expect(groups.map((group) => group.id)).toEqual(["east-road", "tbd"]);
  expect(groups[0].items).toEqual([multiLocationItem]);
});

it("decodes known shared IDs and reports missing IDs", () => {
  expect(decodeSharedItems("known,missing", new Map([["known", item]]))).toEqual({
    itemIds: ["known"], missingIds: ["missing"],
  });
});
```

- [ ] **Step 2: Run tests and confirm RED**

Run `npm test -- src/features/plan/planStore.test.ts`.

Expected: FAIL because plan modules do not exist.

- [ ] **Step 3: Implement pure plan functions**

Create `planStore.ts`:

```ts
export const PLAN_STORAGE_KEY = "big-e-food-plan:v1";
export const EMPTY_PLAN: PlanState = { itemIds: [], checkedIds: [] };
export interface PlanState { itemIds: string[]; checkedIds: string[]; }
export interface PlanGroup {
  id: string; name: string; mapImage?: string; items: CatalogItem[];
}
export function loadPlan(storage: Pick<Storage, "getItem">): PlanState;
export function savePlan(storage: Pick<Storage, "setItem">, state: PlanState): void;
export function encodeSharedItems(itemIds: string[]): string;
export function decodeSharedItems(raw: string, itemsById: Map<string, CatalogItem>): {
  itemIds: string[]; missingIds: string[];
};
export function groupPlanItems(items: CatalogItem[], locations: FairLocation[]): PlanGroup[];
```

Deduplicate while preserving selection order, keep checked IDs only when selected, catch storage/JSON errors, use `locationIds[0]`, order known groups by `FairLocation.order`, and append `{ id: "tbd", name: "Location TBD" }` without a map.

- [ ] **Step 4: Write failing provider tests**

Render a test consumer and assert `addItem`, `removeItem`, `toggleChecked`, `replaceItems`, and `mergeItems` update context and storage. Verify initialization succeeds when local storage throws.

- [ ] **Step 5: Implement provider and hook**

Expose:

```ts
export interface FoodPlanContextValue extends PlanState {
  addItem(id: string): void;
  removeItem(id: string): void;
  toggleChecked(id: string): void;
  replaceItems(ids: string[]): void;
  mergeItems(ids: string[]): void;
  hasItem(id: string): boolean;
}
```

Initialize once from local storage, persist after changes, and fall back to memory when storage fails. Throw a descriptive error when the hook is outside the provider.

- [ ] **Step 6: Verify GREEN and commit**

Run `npm test -- src/features/plan`.

Expected: all plan tests PASS.

```bash
git add src/features/plan
git commit -m "feat: add local shareable food plan state"
```

---

### Task 5: Reusable Discovery UI and Browse Page

**Files:**
- Create: `src/components/discovery/CatalogStatusNotice.tsx`
- Create: `src/components/discovery/ItemCard.tsx`
- Create: `src/components/discovery/ItemCard.test.tsx`
- Create: `src/components/discovery/SelectedFilters.tsx`
- Create: `src/components/discovery/FilterPanel.tsx`
- Create: `src/components/discovery/SortSelect.tsx`
- Create: `src/pages/BrowsePage.tsx`
- Create: `src/pages/BrowsePage.test.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: catalog, discovery, and food-plan interfaces plus shadcn controls
- Produces: reusable item/filter UI, `/browse`, and exported `AppRoutes` for router tests

- [ ] **Step 1: Read the frontend-design skill**

Read `/Users/roconnell/.agents/skills/frontend-design/SKILL.md` completely before UI code. Preserve the approved browse-first hierarchy and existing warm fair palette.

- [ ] **Step 2: Write failing browse integration tests**

Render with `MemoryRouter`, `FoodPlanProvider`, and the real catalog:

```ts
function renderBrowse(path: string) {
  window.localStorage.clear();
  return render(
    <MemoryRouter initialEntries={[path]}>
      <FoodPlanProvider>
        <Routes><Route path="/browse" element={<BrowsePage />} /></Routes>
      </FoodPlanProvider>
    </MemoryRouter>,
  );
}

it("renders URL facets and matching cards", () => {
  renderBrowse("/browse?categories=mocktails&locations=the-front-porch");
  expect(screen.getByRole("heading", { name: /browse 2026 food/i })).toBeInTheDocument();
  expect(screen.getByText("Mocktails")).toBeInTheDocument();
  expect(screen.getByText("The Front Porch")).toBeInTheDocument();
  expect(screen.getByText("Caramel Apple Mocktail")).toBeInTheDocument();
});

it("adds and removes an item from the plan", async () => {
  const user = userEvent.setup();
  renderBrowse("/browse?q=Caramel%20Apple");
  await user.click(screen.getByRole("button", { name: /add caramel apple mocktail/i }));
  expect(screen.getByRole("button", { name: /remove caramel apple mocktail/i })).toBeInTheDocument();
});
```

In `ItemCard.test.tsx`, render an injected `CatalogItem` fixture with `locationIds: []` and assert `Location not yet announced` is visible and there is no location link. Render `FilterPanel` with `hasUnlocatedItems={true}` and `false` in `BrowsePage.test.tsx`; assert the generated `Location TBD` option appears only for `true`.

- [ ] **Step 3: Run the test and confirm RED**

Run `npm test -- src/pages/BrowsePage.test.tsx`.

Expected: FAIL because `BrowsePage` does not exist.

- [ ] **Step 4: Build controlled display/filter components**

- `CatalogStatusNotice`: confirmed 2026 additions; full roster not yet published.
- `ItemCard`: name, vendor, all known location links or `Location not yet announced`, description, useful tags, source link, accessible Add/Remove button.
- `SelectedFilters`: removable chips and Clear all.
- `FilterPanel`: category, location, dietary, and tag facets; generate `Location TBD` only when unlocated items exist; desktop panel plus mobile Sheet.
- `SortSelect`: resolve the displayed default from query/collection context; show Relevance only with a query, and always show Name A-Z, Vendor A-Z, Fairground location.

Give result-count text `role="status"` and `aria-live="polite"`. Use Radix Sheet focus management for the mobile filters and return focus to the trigger on close.

Components receive values/callbacks; they do not own filter state.

- [ ] **Step 5: Implement `BrowsePage` and route**

Parse `useSearchParams`, call `searchAndFilter`, and serialize every change with `setSearchParams(..., { replace: true })`. Render search, result count, chips, filters, sort, item grid, and an empty state with Clear all.

In `App.tsx`, export an `AppRoutes` component containing only `<Routes>`, then make the default `App` wrap `AppRoutes` with providers, `FoodPlanProvider`, and `BrowserRouter basename={import.meta.env.BASE_URL}`. Add `/browse` to `AppRoutes`. Tests can then render `AppRoutes` inside `MemoryRouter` without nesting routers.

- [ ] **Step 6: Verify GREEN and commit**

Run:

```bash
npm test -- src/pages/BrowsePage.test.tsx src/features/discovery src/features/plan
npm run lint
```

Expected: tests PASS and no new lint errors.

```bash
git add src/components/discovery src/pages/BrowsePage.tsx src/pages/BrowsePage.test.tsx src/App.tsx
git commit -m "feat: add 2026 browse and filter experience"
```

---

### Task 6: Browse-First Homepage

**Files:**
- Create: `src/components/discovery/CategoryTile.tsx`
- Create: `src/components/discovery/CollectionCard.tsx`
- Modify: `src/components/LocationCard.tsx`
- Rewrite: `src/pages/Index.tsx`
- Create: `src/pages/Index.test.tsx`
- Modify: `src/index.css`

**Interfaces:**
- Consumes: catalog/taxonomy/collection exports, shared discovery components, and `useFoodPlan`
- Produces: approved browse-first homepage

- [ ] **Step 1: Write failing homepage tests**

```ts
function renderIndex() {
  window.localStorage.clear();
  return render(
    <MemoryRouter>
      <FoodPlanProvider><Index /></FoodPlanProvider>
    </MemoryRouter>,
  );
}

it("leads with 2026 browse entry points", () => {
  renderIndex();
  expect(screen.getByRole("heading", { name: /find your next big e bite/i })).toBeInTheDocument();
  expect(screen.getByRole("searchbox", { name: /search 2026 food/i })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /desserts/i }))
    .toHaveAttribute("href", expect.stringContaining("categories=desserts"));
  expect(screen.getByRole("link", { name: /cocktails/i }))
    .toHaveAttribute("href", expect.stringContaining("categories=cocktails"));
});

it("shows only locations with confirmed items", () => {
  renderIndex();
  for (const location of locations.filter(
    (entry) => !catalogItems.some((item) => item.locationIds.includes(entry.id)),
  )) {
    expect(screen.queryByRole("link", { name: new RegExp(entry.name, "i") }))
      .not.toBeInTheDocument();
  }
});

it("calls flavor shortcuts editor selected, not trending", () => {
  renderIndex();
  expect(screen.getByText(/editor.?s flavor picks/i)).toBeInTheDocument();
  expect(screen.queryByText(/trending/i)).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Run the test and confirm RED**

Run `npm test -- src/pages/Index.test.tsx`.

Expected: FAIL against the 2025 homepage.

- [ ] **Step 3: Build focused browse-entry components**

`CategoryTile` links to `/browse?categories=<id>` and shows a controlled label, icon, and count. `CollectionCard` links to `/browse?collection=<id>` and shows title, description, and count. Rewrite `LocationCard` to accept `FairLocation` and an item count; remove recommendation/vendor assumptions from the old nested model.

- [ ] **Step 4: Rewrite the homepage in approved order**

1. Compact `Big E 2026 Food Guide` hero with `Find your next Big E bite`.
2. Search form navigating to `/browse?q=<encoded query>`.
3. `CatalogStatusNotice`.
4. Craving tiles led by Cocktails, Mocktails, Desserts, Burgers, Potatoes & Fries, and Spicy.
5. Curated 2026 collection cards.
6. Editor's flavor picks: pickle, birria, hot honey, pumpkin, apple, fall flavors.
7. Locations referenced by at least one catalog item.
8. My Food Plan summary/link with saved count.

Keep the existing hero image if contrast remains readable. Remove 2025/recommendation stats and language.

- [ ] **Step 5: Polish responsive/accessibility behavior**

Use existing CSS variables. At 320px width, keep tiles/cards scannable with visible keyboard focus and no hover-only affordances.

- [ ] **Step 6: Verify GREEN and commit**

Run:

```bash
npm test -- src/pages/Index.test.tsx src/pages/BrowsePage.test.tsx
npm run lint
```

Expected: tests PASS and no new lint errors.

```bash
git add src/components/discovery/CategoryTile.tsx src/components/discovery/CollectionCard.tsx src/components/LocationCard.tsx src/pages/Index.tsx src/pages/Index.test.tsx src/index.css
git commit -m "feat: make 2026 discovery the homepage"
```

---

### Task 7: My Food Plan Page and Shared Import

**Files:**
- Create: `src/pages/PlanPage.tsx`
- Create: `src/pages/PlanPage.test.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: food-plan context/helpers, catalog/location indexes, and React Router search params
- Produces: `PlanPage`, fixture-testable `PlanView`, and `/plan` with grouped stops, checks, maps, share URLs, and explicit merge/replace

- [ ] **Step 1: Write failing page tests**

```ts
function renderPlanView(props: Pick<PlanViewProps, "items" | "locations">) {
  return render(
    <MemoryRouter>
      <PlanView
        {...props}
        checkedIds={[]}
        onToggleChecked={() => undefined}
        onRemove={() => undefined}
      />
    </MemoryRouter>,
  );
}

function renderPlan(path: string) {
  window.localStorage.clear();
  return render(
    <MemoryRouter initialEntries={[path]}>
      <FoodPlanProvider>
        <Routes><Route path="/plan" element={<PlanPage />} /></Routes>
      </FoodPlanProvider>
    </MemoryRouter>,
  );
}

it("groups known stops in order and TBD last", () => {
  renderPlanView({ items: [knownEast, unknown, knownFront], locations: fixtureLocations });
  const headings = screen.getAllByRole("heading", { level: 2 }).map((node) => node.textContent);
  expect(headings).toEqual(["The Front Porch", "East Road", "Location TBD"]);
});

it("shows a multi-location item once under its first location", () => {
  renderPlanView({ items: [multiLocation], locations: fixtureLocations });
  expect(screen.getAllByText("Multi-location Treat")).toHaveLength(1);
  expect(screen.getByRole("heading", { name: "East Road" })).toBeInTheDocument();
});

it("requires a choice before applying shared items", () => {
  renderPlan("/plan?items=wave-caramel-apple-mocktail,missing");
  expect(screen.getByRole("button", { name: /replace my plan/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /merge with my plan/i })).toBeInTheDocument();
  expect(screen.getByText(/1 shared item could not be found/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the test and confirm RED**

Run `npm test -- src/pages/PlanPage.test.tsx`.

Expected: FAIL because `PlanPage` does not exist.

- [ ] **Step 3: Implement grouped stops and local actions**

Export this presentational contract:

```ts
export interface PlanViewProps {
  items: CatalogItem[];
  locations: FairLocation[];
  checkedIds: string[];
  onToggleChecked(id: string): void;
  onRemove(id: string): void;
}
export function PlanView(props: PlanViewProps): JSX.Element;
```

Render known groups by `FairLocation.order`, then `Location TBD`. Each item has check/remove controls, vendor, and location. Known groups with `mapImage` expose `View location map`; TBD has no map. `PlanPage` resolves saved IDs from context/catalog and passes them to `PlanView`. The empty plan links to category browsing.

- [ ] **Step 4: Implement share/import behavior**

Build the share URL without duplicating the GitHub Pages basename:

```ts
const baseUrl = new URL(import.meta.env.BASE_URL, window.location.origin);
const shareUrl = new URL("plan", baseUrl);
shareUrl.searchParams.set("items", encodeSharedItems(itemIds));
```

Use `navigator.share` when available and clipboard fallback, with toast feedback.

When `items` exists in the URL, show known/missing counts and Merge/Replace buttons. Do not mutate local state until selection. Remove `items` from the URL after applying.

- [ ] **Step 5: Add route, verify GREEN, and commit**

Add `/plan` to `App.tsx`.

```bash
npm test -- src/pages/PlanPage.test.tsx src/features/plan
npm run lint
```

Expected: tests PASS and no new lint errors.

```bash
git add src/pages/PlanPage.tsx src/pages/PlanPage.test.tsx src/App.tsx
git commit -m "feat: add grouped shareable food plan"
```

---

### Task 8: Location Pages and Legacy Cleanup

**Files:**
- Rewrite: `src/pages/LocationDetail.tsx`
- Create: `src/pages/LocationDetail.test.tsx`
- Create: `src/App.test.tsx`
- Modify: `src/App.tsx`
- Delete: `src/pages/DrinksPage.tsx`
- Delete: `src/pages/MassLiveFavoritesPage.tsx`
- Delete: `src/components/MassLiveFavorites.tsx`
- Delete: `src/data/locations.ts`
- Delete: `src/data/massLiveFavorites.ts`
- Delete: `src/data/categories.ts`
- Modify: `src/assets/maps/mapUtils.ts`

**Interfaces:**
- Consumes: new catalog indexes, `ItemCard`, map assets, and React Router
- Produces: 2026-only location detail and year-neutral legacy redirects

- [ ] **Step 1: Write failing location/route tests**

```ts
function renderLocation(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <FoodPlanProvider>
        <Routes><Route path="/location/:id" element={<LocationDetail />} /></Routes>
      </FoodPlanProvider>
    </MemoryRouter>,
  );
}

it("renders confirmed items for a location", () => {
  renderLocation("/location/the-front-porch");
  expect(screen.getByRole("heading", { name: "The Front Porch" })).toBeInTheDocument();
  expect(screen.getByText("Caramel Apple Mocktail")).toBeInTheDocument();
  expect(screen.queryByText(/MassLive Pick/i)).not.toBeInTheDocument();
});

it("shows an honest zero-item location state", () => {
  renderLocation("/location/new-england-center");
  expect(screen.getByText(/no 2026 additions are currently confirmed here/i)).toBeInTheDocument();
});

it("shows not found for an unknown location", () => {
  renderLocation("/location/not-real");
  expect(screen.getByRole("heading", { name: /location not found/i })).toBeInTheDocument();
});
```

In `App.test.tsx`, render exported `AppRoutes` in `MemoryRouter` with a test component that prints `useLocation().pathname + useLocation().search`. Assert `/drinks` redirects to `/browse?categories=cocktails,mocktails,beer-cider,nonalcoholic-drinks` and `/masslive-favorites` redirects to `/` without rendering 2025 content.

- [ ] **Step 2: Run tests and confirm RED**

Run `npm test -- src/pages/LocationDetail.test.tsx src/App.test.tsx`.

Expected: FAIL against nested 2025 data/routes.

- [ ] **Step 3: Rewrite location detail**

Resolve `locationsById`, filter with `item.locationIds.includes(location.id)`, and render `ItemCard`. Derive map filename from `FairLocation.mapImage`. Use the tested empty state. Remove local food search, recommendations, MassLive matching, and old `Food` types.

- [ ] **Step 4: Replace routes and delete legacy files**

Replace `/drinks` with `<Navigate replace to="/browse?categories=cocktails,mocktails,beer-cider,nonalcoholic-drinks" />`. Redirect `/masslive-favorites` to `/`. Delete the six listed legacy files and update all imports.

In `mapUtils.ts`, correct `front-porch` to `the-front-porch`, remove placeholder `mapExists`, and use a build-time map manifest:

```ts
const mapModules = import.meta.glob<{ default: string }>(
  "/src/assets/maps/locations/*.png",
  { eager: true, query: "?url" },
);

export function getLocationMapImage(mapImage?: string): string {
  if (!mapImage) return PLACEHOLDER_MAP;
  return mapModules[`/src/assets/maps/locations/${mapImage}`]?.default ?? PLACEHOLDER_MAP;
}
```

- [ ] **Step 5: Verify legacy imports are gone**

Run:

```bash
npm test -- src/pages/LocationDetail.test.tsx src/App.test.tsx
rg -n "@/data/(locations|categories|massLiveFavorites)|MassLiveFavorites|DrinksPage" src
```

Expected: tests PASS; `rg` returns no matches.

- [ ] **Step 6: Commit**

```bash
git add src
git commit -m "refactor: remove legacy 2025 catalog paths"
```

---

### Task 9: Copy Guard, Metadata, Documentation, and Verification

**Files:**
- Create: `src/test/noLegacyCopy.test.ts`
- Modify: `index.html`
- Modify: `public/404.html`
- Rewrite: `README.md`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: completed application/build
- Produces: 2026-only public artifact and verification evidence

- [ ] **Step 1: Write the failing scoped copy test**

Recursively read `.ts`, `.tsx`, and `.json` under `src/`, excluding tests and `catalog.json`/`collections.json`. Assert remaining source contains neither `2025` nor `MassLive 2025`. Separately import catalog/collections, strip `source` objects, serialize public fields, and assert the same:

```ts
expect(userVisibleSource).not.toMatch(/\b2025\b|MassLive 2025/i);
expect(JSON.stringify(dataWithoutSourceMetadata)).not.toMatch(/\b2025\b|MassLive 2025/i);
```

This excludes source URL/access-date metadata, documentation, tests, lockfiles, and Git history.

- [ ] **Step 2: Run the test and confirm RED**

Run `npm test -- src/test/noLegacyCopy.test.ts`.

Expected: FAIL until remaining public copy is updated.

- [ ] **Step 3: Update metadata, README, and ignore rules**

Update `index.html` and `public/404.html` to `Big E 2026 Food Guide` and confirmed-2026 language; preserve the SPA redirect script.

Replace Lovable README boilerplate with purpose, source/incompleteness policy, `npm ci`/dev/test/lint/build commands, GitHub Pages deployment, and JSON update instructions. Add `.superpowers/` to `.gitignore`.

- [ ] **Step 4: Run complete automated verification**

```bash
npm test
npm run lint
npm run build
git diff --check
```

Expected: all commands exit 0 and `git diff --check` prints nothing.

- [ ] **Step 5: Perform visual QA**

Run `npm run dev` and check mobile/desktop:

1. Browse-first hierarchy and status notice.
2. Cocktail/dessert category entry points.
3. Multi-select filters and shared browse URL.
4. Typo search such as `coctail`.
5. `Location TBD` card, facet, sort placement, and plan group.
6. Multi-location item once in plan under first location.
7. Collection order and further filtering.
8. Add/remove/check plan and shared Merge/Replace.
9. Populated and empty location pages.
10. Keyboard focus, mobile filter focus restoration, and result-count announcements.

- [ ] **Step 6: Review scope and commit**

Run:

```bash
git status --short
git diff --stat
git diff --check
```

Confirm no database, backend, scraper, authentication, hosting migration, or unrelated refactor.

```bash
git add .gitignore README.md index.html public/404.html src/test/noLegacyCopy.test.ts
git commit -m "docs: finish 2026 food guide refresh"
```

---

## Final Verification Gate

Before claiming completion, invoke `superpowers:verification-before-completion` and run fresh commands:

```bash
npm test
npm run lint
npm run build
git status --short
```

Expected: test, lint, and build exit 0. Explain every intentionally uncommitted file, if any.
