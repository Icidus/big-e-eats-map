# Big E 2026 Mobile-First UI Revision Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rework the discovery UI for one-thumb phone use: category chips plus a bottom filter sheet replace the checkbox panel, item cards compress to ~120px with expand-in-place detail, a persistent nav bar keeps My Plan one tap away, and the homepage shrinks to about two phone screens.

**Architecture:** Presentation-layer revision only. All catalog, search, URL-state, and plan modules keep their current APIs; the one data-layer change is deleting generated boilerplate descriptions from `catalog.json` and making `description` optional. New UI components (`CategoryChips`, `FilterSheet`, `AppNav`) compose the existing `DiscoveryState` → `searchAndFilter` pipeline. `FilterPanel`, `SortSelect`, and `LocationCard` are deleted with their single call sites.

**Tech Stack:** React 18, TypeScript, Vite 5, React Router 6, Tailwind CSS, shadcn/Radix UI, vaul (drawer), Zod, MiniSearch, Vitest, React Testing Library

**Spec:** `docs/superpowers/specs/2026-08-28-mobile-first-ui-revision.md` (presentation revision of `docs/superpowers/specs/2026-08-27-2026-food-discovery-design.md`)

## Global Constraints

- Presentation/interaction changes only: do not change catalog schema semantics (except `description` becoming optional), URL parameter names, search indexing fields, sort rules, OR-within/AND-across facet semantics, or plan storage format.
- `vendors` URL state remains fully supported even though the vendor facet UI is removed.
- Functional controls use plain labels: `Filters`, `Sort`, `Clear all`, `N results`, `My Plan`, `Add` / `Added`. Editorial voice only in heroes, section eyebrows, and empty states.
- Tap targets at least 44px (`min-h-11`); toggle state exposed via `aria-pressed`, expansion via `aria-expanded`, current page via `aria-current`; the page body never scrolls horizontally.
- The dietary disclaimer sentence "Confirm dietary needs and preparation details with the vendor." appears only in the filter sheet's Dietary section and inside expanded card details — never on compact cards.
- Keep the visual identity: existing palette, serif/mono type mix, hard offset shadows.
- Use TDD for each behavior; run `npm test` after each task and a production build before completion.
- Commit after each task with a conventional-commit message ending in the Claude Code co-author trailer.

---

### Task 1: Optional Descriptions and Boilerplate Cleanup

142 of 152 `catalog.json` descriptions are generated boilerplate ("The official 2026 New Foods listing identifies X as an offering from Y") that restates name + vendor and pollutes the search index.

**Files:**
- Modify: `src/features/catalog/schema.ts:19` (make `description` optional)
- Modify: `src/data/2026/catalog.json` (strip boilerplate descriptions)
- Modify: `src/features/discovery/search.ts:111` (guard undefined description)
- Modify: `src/components/discovery/ItemCard.tsx:47` (conditional render; full rewrite comes in Task 5)
- Test: `src/features/catalog/catalog.test.ts` (add assertion)

**Interfaces:**
- Consumes: `catalogItems` from `@/features/catalog/catalog`
- Produces: `CatalogItem.description` is now `string | undefined`. Every later task must treat it as optional.

- [ ] **Step 1: Write the failing test**

Add to the existing `describe` block in `src/features/catalog/catalog.test.ts`:

```ts
it("contains no generated boilerplate descriptions", () => {
  for (const item of catalogItems) {
    if (!item.description) continue;
    expect(item.description).not.toMatch(/identifies .+ as an offering from/i);
  }
});
```

(`catalogItems` is already imported in this file; if not, add it to the existing import from `@/features/catalog/catalog`.)

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/catalog/catalog.test.ts -t "boilerplate"`
Expected: FAIL — a description matching `identifies .+ as an offering from`.

- [ ] **Step 3: Make `description` optional in the schema**

In `src/features/catalog/schema.ts` change the catalog item field (line 19):

```ts
  description: z.string().min(1).optional(),
```

Leave the location (line 30) and collection (line 37) `description` fields required — only catalog items lose theirs.

- [ ] **Step 4: Strip boilerplate from the data**

Run this once from the repo root:

```bash
node -e '
const fs = require("fs");
const path = "src/data/2026/catalog.json";
const items = JSON.parse(fs.readFileSync(path, "utf8"));
for (const item of items) {
  if (item.description && /identifies .+ as an offering from/i.test(item.description)) {
    delete item.description;
  }
}
fs.writeFileSync(path, JSON.stringify(items, null, 2) + "\n");
console.log("kept descriptions:", items.filter(i => i.description).length);
'
```

Expected output: `kept descriptions: 10`.

- [ ] **Step 5: Guard the two consumers of `description`**

`src/features/discovery/search.ts` line 111, inside `createSearchDocument`:

```ts
    description: item.description ?? "",
```

`src/components/discovery/ItemCard.tsx` line 47, replace the unconditional paragraph:

```tsx
      {item.description ? <p className="mt-4 text-sm leading-6 text-foreground/80">{item.description}</p> : null}
```

- [ ] **Step 6: Run the full suite**

Run: `npm test`
Expected: PASS. If any existing test asserted boilerplate description text on a card, update it to assert the item name instead — the boilerplate is gone from the data by design.

- [ ] **Step 7: Commit**

```bash
git add src/features/catalog/schema.ts src/data/2026/catalog.json src/features/discovery/search.ts src/components/discovery/ItemCard.tsx src/features/catalog/catalog.test.ts
git commit -m "data: strip boilerplate catalog descriptions; make description optional"
```

---

### Task 2: Persistent App Navigation

A fixed bottom bar (Home / Browse / My Plan with live count) below `md`, the same links as a slim sticky top bar at `md+`, on every page. Replaces the homepage's bottom plan section (removed in Task 6).

**Files:**
- Create: `src/components/AppNav.tsx`
- Test: `src/components/AppNav.test.tsx`
- Modify: `src/App.tsx` (wrap routes in a shell that renders `AppNav` and reserves bottom padding)

**Interfaces:**
- Consumes: `useFoodPlan()` from `@/features/plan/FoodPlanProvider` (`itemIds: string[]`), `NavLink` from react-router-dom
- Produces: `AppNav` component (no props). `AppRoutes` in `App.tsx` now renders `<AppNav />` above `<Routes>` inside a `div.pb-16.md:pb-0` wrapper — pages need no changes to accommodate it.

- [ ] **Step 1: Write the failing tests**

Create `src/components/AppNav.test.tsx`:

```tsx
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import { FoodPlanProvider } from "@/features/plan/FoodPlanProvider";
import { BrowsePage } from "@/pages/BrowsePage";
import { AppNav } from "./AppNav";

afterEach(cleanup);

function renderNav(path = "/browse") {
  window.localStorage?.clear();
  return render(
    <MemoryRouter initialEntries={[path]}>
      <FoodPlanProvider>
        <AppNav />
        <Routes><Route path="/browse" element={<BrowsePage />} /></Routes>
      </FoodPlanProvider>
    </MemoryRouter>,
  );
}

describe("AppNav", () => {
  it("renders Home, Browse, and My Plan links with a zero count", () => {
    renderNav();
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Browse" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "My Plan, 0 items" })).toBeInTheDocument();
  });

  it("marks the current page with aria-current", () => {
    renderNav("/browse");
    expect(screen.getByRole("link", { name: "Browse" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Home" })).not.toHaveAttribute("aria-current");
  });

  it("updates the plan count when an item is added", async () => {
    const user = userEvent.setup();
    renderNav("/browse?q=Caramel%20Apple");

    await user.click(screen.getByRole("button", { name: /add caramel apple mocktail/i }));

    expect(screen.getByRole("link", { name: "My Plan, 1 item" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/components/AppNav.test.tsx`
Expected: FAIL — `AppNav` module not found.

- [ ] **Step 3: Implement AppNav**

Create `src/components/AppNav.tsx`:

```tsx
import { Compass, Home, MapPinned } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useFoodPlan } from "@/features/plan/FoodPlanProvider";

export function AppNav() {
  const { itemIds } = useFoodPlan();
  const planLabel = `My Plan, ${itemIds.length} ${itemIds.length === 1 ? "item" : "items"}`;

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-primary bg-card pb-[env(safe-area-inset-bottom)] md:sticky md:top-0 md:bottom-auto md:border-b-2 md:border-t-0"
    >
      <div className="mx-auto flex max-w-7xl items-stretch justify-around md:justify-end md:gap-1 md:px-6">
        <AppNavLink to="/" end icon={Home} label="Home" />
        <AppNavLink to="/browse" icon={Compass} label="Browse" />
        <AppNavLink to="/plan" icon={MapPinned} label="My Plan" ariaLabel={planLabel} badge={itemIds.length} />
      </div>
    </nav>
  );
}

function AppNavLink({ to, end, icon: Icon, label, ariaLabel, badge }: {
  to: string;
  end?: boolean;
  icon: typeof Home;
  label: string;
  ariaLabel?: string;
  badge?: number;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      aria-label={ariaLabel ?? label}
      className={({ isActive }) =>
        cn(
          "relative flex min-h-14 min-w-20 flex-col items-center justify-center gap-0.5 px-3 text-[11px] font-bold uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:min-h-11 md:flex-row md:gap-2 md:text-xs",
          isActive ? "text-primary" : "text-muted-foreground hover:text-primary",
        )
      }
    >
      <span className="relative">
        <Icon className="h-5 w-5" aria-hidden="true" />
        {badge !== undefined && badge > 0 ? (
          <span aria-hidden="true" className="absolute -right-2.5 -top-1.5 grid min-w-4 place-items-center rounded-full bg-secondary px-1 font-mono text-[10px] font-bold leading-4 text-secondary-foreground">
            {badge}
          </span>
        ) : null}
      </span>
      <span aria-hidden={ariaLabel !== undefined}>{label}</span>
    </NavLink>
  );
}
```

- [ ] **Step 4: Mount it in the app shell**

In `src/App.tsx`, add the import and change `AppRoutes` (currently lines 15–28) to:

```tsx
import { AppNav } from "@/components/AppNav";

export function AppRoutes() {
  return (
    <div className="pb-16 md:pb-0">
      <AppNav />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/location/:id" element={<LocationDetail />} />
        <Route path="/masslive-favorites" element={<Navigate replace to="/" />} />
        <Route path="/drinks" element={<Navigate replace to="/browse?categories=cocktails,mocktails,beer-cider,nonalcoholic-drinks" />} />
        <Route path="/plan" element={<PlanPage />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
```

The `pb-16` reserves space for the fixed bottom bar on phones (`md:pb-0` because the bar is sticky-top there and occupies normal flow).

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run src/components/AppNav.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 6: Run the full suite and commit**

Run: `npm test`
Expected: PASS.

```bash
git add src/components/AppNav.tsx src/components/AppNav.test.tsx src/App.tsx
git commit -m "feat: persistent bottom/top navigation with live plan count"
```

---

### Task 3: Category Chip Row on Browse

A horizontally scrollable multi-select chip row directly above the results, bound to the same `categories` URL state, showing per-category counts within the rest of the active filter context. Categories with zero items in context are hidden (unless currently selected, so deselection stays possible).

**Files:**
- Create: `src/components/discovery/CategoryChips.tsx`
- Modify: `src/pages/BrowsePage.tsx` (compute counts, render chips above results)
- Test: `src/pages/BrowsePage.test.tsx` (add cases)

**Interfaces:**
- Consumes: `CATEGORIES`, `CategoryId` from `@/features/catalog/taxonomy`; `searchAndFilter` from `@/features/discovery/search`; `cn` from `@/lib/utils`
- Produces: `CategoryChips({ selected, counts, onToggle })` where `selected: readonly CategoryId[]`, `counts: Map<CategoryId, number>`, `onToggle(id: CategoryId): void`. Task 4 keeps this component in place when it restructures the page around it.

- [ ] **Step 1: Write the failing tests**

Add to `src/pages/BrowsePage.test.tsx` (the `renderBrowse`, `renderBrowseInWindow`, and `LocationSearch` helpers already exist there):

```tsx
describe("category chips", () => {
  it("renders pressed state from URL and a per-category count", () => {
    renderBrowse("/browse?categories=desserts");

    const chip = screen.getByRole("button", { name: /^desserts · \d+$/i });
    expect(chip).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: /^burgers · \d+$/i })).toHaveAttribute("aria-pressed", "false");
  });

  it("toggles the categories URL parameter", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/browse?categories=desserts"]}>
        <FoodPlanProvider>
          <Routes><Route path="/browse" element={<><BrowsePage /><LocationSearch /></>} /></Routes>
        </FoodPlanProvider>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: /^burgers · \d+$/i }));
    expect(screen.getByTestId("location-search")).toHaveTextContent("categories=desserts%2Cburgers");

    await user.click(screen.getByRole("button", { name: /^desserts · \d+$/i }));
    expect(screen.getByTestId("location-search")).toHaveTextContent("categories=burgers");
  });

  it("hides categories with no items in the current context", () => {
    renderBrowse("/browse?locations=the-front-porch");
    expect(screen.queryByRole("button", { name: /^seafood/i })).not.toBeInTheDocument();
  });
});
```

(If The Front Porch does have confirmed seafood, pick any category/location pair with zero overlap by inspecting `src/data/2026/catalog.json` — the test's point is a zero-count chip is hidden.)

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/pages/BrowsePage.test.tsx -t "category chips"`
Expected: FAIL — no chip buttons found.

- [ ] **Step 3: Implement CategoryChips**

Create `src/components/discovery/CategoryChips.tsx`:

```tsx
import { CATEGORIES, type CategoryId } from "@/features/catalog/taxonomy";
import { cn } from "@/lib/utils";

interface CategoryChipsProps {
  selected: readonly CategoryId[];
  counts: Map<CategoryId, number>;
  onToggle(id: CategoryId): void;
}

export function CategoryChips({ selected, counts, onToggle }: CategoryChipsProps) {
  const visible = CATEGORIES.filter(([id]) => (counts.get(id) ?? 0) > 0 || selected.includes(id));
  if (!visible.length) return null;

  return (
    <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0" role="group" aria-label="Filter by category">
      <div className="flex w-max gap-2 py-1">
        {visible.map(([id, label]) => {
          const isSelected = selected.includes(id);
          return (
            <button
              key={id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onToggle(id)}
              className={cn(
                "inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isSelected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-primary/35 bg-card text-primary hover:bg-secondary/20",
              )}
            >
              {label}
              <span aria-hidden="true" className={cn("font-mono text-[11px] font-bold", isSelected ? "text-primary-foreground/85" : "text-muted-foreground")}>· {counts.get(id) ?? 0}</span>
              <span className="sr-only">· {counts.get(id) ?? 0}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Wire it into BrowsePage**

In `src/pages/BrowsePage.tsx`:

Add imports:

```tsx
import { CategoryChips } from "@/components/discovery/CategoryChips";
import { CATEGORIES } from "@/features/catalog/taxonomy";
import type { CategoryId } from "@/features/catalog/taxonomy";
```

(`CATEGORIES` is already imported for `categoryLabels`; only add what's missing.)

Inside the component, after the `results` memo:

```tsx
const categoryCounts = useMemo(() => {
  const counts = new Map<CategoryId, number>();
  for (const [categoryId] of CATEGORIES) {
    counts.set(
      categoryId,
      searchAndFilter(catalogItems, { ...state, categoryIds: [categoryId] }, { locations, collectionsById }).length,
    );
  }
  return counts;
}, [state]);

function toggleCategory(categoryId: CategoryId) {
  const categoryIds = state.categoryIds.includes(categoryId)
    ? state.categoryIds.filter((entry) => entry !== categoryId)
    : [...state.categoryIds, categoryId];
  replaceState({ ...state, categoryIds });
}
```

Render the chip row between the selected-filters block and the results section (after the line-69 `<div className="mt-6">…SelectedFilters…</div>`):

```tsx
<div className="mt-4"><CategoryChips selected={state.categoryIds} counts={categoryCounts} onToggle={toggleCategory} /></div>
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run src/pages/BrowsePage.test.tsx`
Expected: PASS, including pre-existing cases.

- [ ] **Step 6: Commit**

```bash
git add src/components/discovery/CategoryChips.tsx src/pages/BrowsePage.tsx src/pages/BrowsePage.test.tsx
git commit -m "feat: category chip row bound to categories URL state"
```

---

### Task 4: Bottom Filter Sheet and Sticky Results Bar

Replace `FilterPanel` (broken desktop `<aside>` + side sheet of ~115 checkboxes) with a vaul bottom sheet: accordion sections for Category, Location, Dietary, Tags — **no Vendor facet** — Sort as radios inside the sheet, and a sticky footer with a live `Show N results` button and `Clear all`. A slim sticky bar above the results holds the count, the `Filters` button (active-filter badge), and the selected-filter chips. Desktop uses the identical UI; the two-column sidebar idea is dropped, not repaired.

**Files:**
- Create: `src/components/discovery/FilterSheet.tsx`
- Delete: `src/components/discovery/FilterPanel.tsx`
- Delete: `src/components/discovery/SortSelect.tsx`
- Modify: `src/pages/BrowsePage.tsx` (restructure toolbar; sticky bar)
- Modify: `src/components/discovery/SelectedFilters.tsx:20` (label "On your tray" → "Active filters")
- Test: `src/pages/BrowsePage.test.tsx` (replace `FilterPanel` import/uses, add sheet cases)

**Interfaces:**
- Consumes: `Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger` from `@/components/ui/drawer`; `Accordion, AccordionContent, AccordionItem, AccordionTrigger` from `@/components/ui/accordion`; `Checkbox` from `@/components/ui/checkbox`; `DiscoveryState`, `SortMode` from `@/features/discovery/types`
- Produces: `FilterSheet({ state, locations, hasUnlocatedItems, resultCount, onStateChange, onClear })` — same props as the old `FilterPanel` plus `resultCount: number`. Sort semantics are unchanged from `SortSelect`: default is relevance with a query, collection order in a collection, else name; choosing "collection" clears `sort` to undefined.

- [ ] **Step 1: Update tests — write the failing cases**

In `src/pages/BrowsePage.test.tsx`, replace the `FilterPanel` import with `FilterSheet` (any existing direct `FilterPanel` renders switch to `FilterSheet` with a `resultCount={0}` prop) and add:

```tsx
import { FilterSheet } from "@/components/discovery/FilterSheet";

describe("filter sheet", () => {
  it("has no vendor facet but keeps vendors URL state working", () => {
    const user = userEvent.setup();
    renderBrowse("/browse?vendors=tripps-farmhouse-cafe");

    expect(screen.getAllByText(/tripp/i).length).toBeGreaterThan(0);
    return user.click(screen.getByRole("button", { name: "Filters" })).then(() => {
      expect(screen.queryByRole("button", { name: /^vendor$/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("checkbox", { name: /tripp/i })).not.toBeInTheDocument();
    });
  });

  it("shows a live result count in the sheet footer", async () => {
    const user = userEvent.setup();
    renderBrowse("/browse?categories=desserts");

    await user.click(screen.getByRole("button", { name: "Filters" }));
    const status = screen.getByRole("status", { name: /result count/i });
    const count = Number(status.textContent?.match(/\d+/)?.[0]);
    expect(screen.getByRole("button", { name: `Show ${count} results` })).toBeInTheDocument();
  });

  it("moves sort into the sheet", async () => {
    const user = userEvent.setup();
    renderBrowse("/browse");

    expect(screen.queryByLabelText(/^sort$/i)).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Filters" }));
    expect(screen.getByRole("radio", { name: "Name A-Z" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Vendor A-Z" })).toBeInTheDocument();
  });

  it("badges the Filters button with the active facet count", () => {
    renderBrowse("/browse?categories=desserts,burgers&tags=fried");
    expect(screen.getByRole("button", { name: "Filters, 3 active" })).toBeInTheDocument();
  });
});
```

Note: vaul's drawer relies on pointer capture APIs jsdom lacks; if `user.click` on the trigger throws, add to `src/test/setup.ts`:

```ts
window.HTMLElement.prototype.setPointerCapture = window.HTMLElement.prototype.setPointerCapture ?? (() => {});
window.HTMLElement.prototype.releasePointerCapture = window.HTMLElement.prototype.releasePointerCapture ?? (() => {});
window.HTMLElement.prototype.hasPointerCapture = window.HTMLElement.prototype.hasPointerCapture ?? (() => false);
window.HTMLElement.prototype.scrollIntoView = window.HTMLElement.prototype.scrollIntoView ?? (() => {});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/pages/BrowsePage.test.tsx -t "filter sheet"`
Expected: FAIL — `FilterSheet` module not found.

- [ ] **Step 3: Implement FilterSheet**

Create `src/components/discovery/FilterSheet.tsx`:

```tsx
import { SlidersHorizontal } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import type { FairLocation } from "@/features/catalog/catalog";
import { CATEGORIES, DIETARY_CLAIMS, TAGS, type CategoryId, type DietaryClaim, type TagId } from "@/features/catalog/taxonomy";
import type { DiscoveryState, SortMode } from "@/features/discovery/types";

interface FilterSheetProps {
  state: DiscoveryState;
  locations: FairLocation[];
  hasUnlocatedItems: boolean;
  resultCount: number;
  onStateChange(state: DiscoveryState): void;
  onClear(): void;
}

export function FilterSheet({ state, locations, hasUnlocatedItems, resultCount, onStateChange, onClear }: FilterSheetProps) {
  const activeCount = state.categoryIds.length + state.locationIds.length + state.dietaryClaims.length + state.tagIds.length + state.vendorIds.length;
  const locationOptions = [
    ...locations.map((location) => ({ id: location.id, label: location.name })),
    ...(hasUnlocatedItems ? [{ id: "tbd", label: "Location TBD" }] : []),
  ];

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button type="button" variant="outline" className="min-h-11" aria-label={activeCount ? `Filters, ${activeCount} active` : "Filters"}>
          <SlidersHorizontal aria-hidden="true" />
          Filters
          {activeCount ? <span aria-hidden="true" className="grid min-w-5 place-items-center rounded-full bg-primary px-1 font-mono text-[11px] font-bold leading-5 text-primary-foreground">{activeCount}</span> : null}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[85svh] bg-background">
        <DrawerHeader className="pb-2 text-left">
          <DrawerTitle>Filters</DrawerTitle>
          <DrawerDescription>Combine as many as you like.</DrawerDescription>
        </DrawerHeader>
        <div className="overflow-y-auto px-4">
          <Accordion type="multiple" defaultValue={["category"]}>
            <FacetSection
              value="category"
              label="Category"
              selectedCount={state.categoryIds.length}
              options={CATEGORIES.map(([id, label]) => ({ id, label }))}
              selected={state.categoryIds}
              onToggle={(id) => onStateChange({ ...state, categoryIds: toggle(state.categoryIds, id as CategoryId) })}
            />
            <FacetSection
              value="location"
              label="Location"
              selectedCount={state.locationIds.length}
              options={locationOptions}
              selected={state.locationIds}
              onToggle={(id) => onStateChange({ ...state, locationIds: toggle(state.locationIds, id) })}
            />
            <FacetSection
              value="dietary"
              label="Dietary"
              selectedCount={state.dietaryClaims.length}
              options={DIETARY_CLAIMS.map((id) => ({ id, label: titleCase(id) }))}
              selected={state.dietaryClaims}
              onToggle={(id) => onStateChange({ ...state, dietaryClaims: toggle(state.dietaryClaims, id as DietaryClaim) })}
              note="Dietary claims are source-reported. Confirm dietary needs and preparation details with the vendor."
            />
            <FacetSection
              value="tags"
              label="Tags"
              selectedCount={state.tagIds.length}
              options={TAGS.map((id) => ({ id, label: titleCase(id) }))}
              selected={state.tagIds}
              onToggle={(id) => onStateChange({ ...state, tagIds: toggle(state.tagIds, id as TagId) })}
            />
            <SortSection state={state} onStateChange={onStateChange} />
          </Accordion>
        </div>
        <div className="sticky bottom-0 flex items-center gap-3 border-t border-primary/25 bg-background p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <DrawerClose asChild>
            <Button type="button" className="min-h-11 flex-1">Show {resultCount} {resultCount === 1 ? "result" : "results"}</Button>
          </DrawerClose>
          <Button type="button" variant="link" size="sm" className="min-h-11 px-2" onClick={onClear}>Clear all</Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function FacetSection({ value, label, selectedCount, options, selected, onToggle, note }: {
  value: string;
  label: string;
  selectedCount: number;
  options: Array<{ id: string; label: string }>;
  selected: readonly string[];
  onToggle(id: string): void;
  note?: string;
}) {
  return (
    <AccordionItem value={value}>
      <AccordionTrigger className="min-h-11 font-serif text-base font-bold">
        <span className="flex items-center gap-2">
          {label}
          {selectedCount ? <span className="grid min-w-5 place-items-center rounded-full bg-primary/10 px-1 font-mono text-[11px] font-bold leading-5 text-primary">{selectedCount}</span> : null}
        </span>
      </AccordionTrigger>
      <AccordionContent>
        {note ? <p className="mb-2 text-xs leading-5 text-muted-foreground">{note}</p> : null}
        <fieldset>
          <legend className="sr-only">{label}</legend>
          <div className="grid gap-1">
            {options.map((option) => (
              <label key={option.id} className="flex min-h-11 cursor-pointer items-center gap-2 rounded px-2 text-sm hover:bg-secondary/15 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                <Checkbox checked={selected.includes(option.id)} onCheckedChange={() => onToggle(option.id)} />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </AccordionContent>
    </AccordionItem>
  );
}

function SortSection({ state, onStateChange }: { state: DiscoveryState; onStateChange(state: DiscoveryState): void }) {
  const defaultSort = state.query ? "relevance" : state.collectionId ? "collection" : "name";
  const normalizedSort = !state.query && state.sort === "relevance" ? undefined : state.sort;
  const value = normalizedSort ?? defaultSort;
  const options: Array<[string, string]> = [
    ...(state.query ? [["relevance", "Relevance"] as [string, string]] : []),
    ...(state.collectionId && !state.query ? [["collection", "Collection order"] as [string, string]] : []),
    ["name", "Name A-Z"],
    ["vendor", "Vendor A-Z"],
    ["location", "Fairground location"],
  ];

  return (
    <AccordionItem value="sort">
      <AccordionTrigger className="min-h-11 font-serif text-base font-bold">Sort</AccordionTrigger>
      <AccordionContent>
        <fieldset>
          <legend className="sr-only">Sort</legend>
          <div className="grid gap-1">
            {options.map(([id, label]) => (
              <label key={id} className="flex min-h-11 cursor-pointer items-center gap-2 rounded px-2 text-sm hover:bg-secondary/15">
                <input
                  type="radio"
                  name="browse-sort"
                  className="h-4 w-4 accent-[hsl(var(--primary))]"
                  checked={value === id}
                  onChange={() => onStateChange({ ...state, sort: id === "collection" ? undefined : (id as SortMode) })}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </AccordionContent>
    </AccordionItem>
  );
}

function toggle<T extends string>(values: readonly T[], value: T): T[] {
  return values.includes(value) ? values.filter((entry) => entry !== value) : [...values, value];
}

function titleCase(value: string): string {
  return value.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}
```

- [ ] **Step 4: Restructure BrowsePage around the sticky bar**

In `src/pages/BrowsePage.tsx`:

- Replace the `FilterPanel` and `SortSelect` imports with `import { FilterSheet } from "@/components/discovery/FilterSheet";`.
- Replace the search `<section>` (old lines 54–67), the selected-filters `<div>` (line 69), and the chip-row `<div>` from Task 3 with:

```tsx
<section className="border border-primary/25 bg-card p-4 shadow-[6px_6px_0_hsl(var(--secondary)/0.32)] sm:p-5" aria-label="Search the food catalog">
  <label className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground" htmlFor="browse-search">Search 2026 food</label>
  <div className="relative mt-2">
    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" aria-hidden="true" />
    <Input
      id="browse-search"
      value={state.query}
      onChange={(event) => replaceState({ ...state, query: event.target.value })}
      placeholder="Try apple, hot honey, or a vendor…"
      className="h-12 border-primary/30 pl-10 text-base"
    />
  </div>
</section>

<div className="sticky top-0 z-30 -mx-4 mt-4 border-b border-primary/25 bg-background/95 px-4 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:mx-0 sm:px-0 md:top-11">
  <div className="flex flex-wrap items-center gap-3">
    <FilterSheet
      state={state}
      locations={locations}
      hasUnlocatedItems={catalogItems.some((item) => item.locationIds.length === 0)}
      resultCount={results.length}
      onStateChange={replaceState}
      onClear={() => replaceState(EMPTY_DISCOVERY_STATE)}
    />
    <p role="status" aria-live="polite" aria-label="Result count" className="text-sm font-semibold text-muted-foreground">{results.length} {results.length === 1 ? "result" : "results"}</p>
  </div>
  <div className="mt-2"><SelectedFilters filters={selectedFilters} onRemove={removeFilter} onClear={() => replaceState(EMPTY_DISCOVERY_STATE)} /></div>
</div>

<div className="mt-4"><CategoryChips selected={state.categoryIds} counts={categoryCounts} onToggle={toggleCategory} /></div>
```

(`md:top-11` keeps the bar below the sticky top nav from Task 2.)

- In the results section header (old lines 72–75), drop the duplicate count paragraph — the sticky bar owns the count now:

```tsx
<div className="border-b border-primary/25 pb-3">
  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-primary">Issued from the fair desk</p>
  <h2 id="browse-results" className="font-serif text-2xl font-bold">Food finder</h2>
</div>
```

- Delete `src/components/discovery/FilterPanel.tsx` and `src/components/discovery/SortSelect.tsx`.

- [ ] **Step 5: Rename the chip-group label**

`src/components/discovery/SelectedFilters.tsx` line 20:

```tsx
      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Active filters</span>
```

- [ ] **Step 6: Run tests, fix fallout, verify pass**

Run: `npx vitest run src/pages/BrowsePage.test.tsx`
Expected: PASS. Pre-existing tests that opened the old side sheet via `aria-label="Open filters"` must target the new `Filters` button; tests asserting the old always-visible desktop checkboxes must now open the sheet first.

Run: `npm test`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add -A src/components/discovery src/pages/BrowsePage.tsx src/pages/BrowsePage.test.tsx src/test/setup.ts
git commit -m "feat: bottom filter sheet with sticky results bar; drop vendor facet UI"
```

---

### Task 5: Compact Expandable Item Cards

Compact card (~120px): name, tappable vendor, location links, compact dietary/new-vendor badges, Add button. Everything else (real description, tappable tags, source link, dietary disclaimer) moves behind an expand-in-place disclosure. Eyebrows (`2026 listing` / `New for 2026`) are removed.

**Files:**
- Rewrite: `src/components/discovery/ItemCard.tsx`
- Test: `src/components/discovery/ItemCard.test.tsx` (rewrite assertions)

**Interfaces:**
- Consumes: unchanged props `ItemCard({ item, locationsById, isInPlan, onAdd, onRemove })`; `vendorIdForName` from `@/features/catalog/catalog`
- Produces: same component signature — `BrowsePage`, `LocationDetail`, and `PlanPage` call sites need no changes. Vendor tap navigates to `/browse?vendors=<vendorId>`; tag taps navigate to `/browse?tags=<tagId>` (tags) or `/browse?categories=<categoryId>` (categories).

- [ ] **Step 1: Rewrite the tests to the compact contract**

Replace the assertions in `src/components/discovery/ItemCard.test.tsx` with (keep any existing render helper; a minimal one is shown):

```tsx
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { itemsById, locationsById } from "@/features/catalog/catalog";
import { ItemCard } from "./ItemCard";

afterEach(cleanup);

const item = itemsById.get("wave-caramel-apple-mocktail")!;

function renderCard(overrides: Partial<Parameters<typeof ItemCard>[0]> = {}) {
  return render(
    <MemoryRouter>
      <ItemCard item={item} locationsById={locationsById} isInPlan={false} onAdd={vi.fn()} onRemove={vi.fn()} {...overrides} />
    </MemoryRouter>,
  );
}

describe("ItemCard", () => {
  it("shows only compact content until expanded", () => {
    renderCard();

    expect(screen.getByRole("heading", { name: item.name })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: `See everything from ${item.vendor}` })).toHaveAttribute("href", expect.stringContaining("/browse?vendors="));
    expect(screen.queryByText(/2026 listing|new for 2026/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /new foods/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/confirm dietary needs/i)).not.toBeInTheDocument();
  });

  it("expands in place to reveal tags, source, and disclaimer", async () => {
    const user = userEvent.setup();
    renderCard();

    const trigger = screen.getByRole("button", { name: `More about ${item.name}` });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: /the big e: new foods/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /apple/i })).toHaveAttribute("href", expect.stringContaining("tags=apple"));
  });

  it("shows a compact source-reported badge for dietary claims", () => {
    const gfItem = [...itemsById.values()].find((entry) => entry.dietaryClaims.includes("gluten-free"))!;
    render(
      <MemoryRouter>
        <ItemCard item={gfItem} locationsById={locationsById} isInPlan={false} onAdd={vi.fn()} onRemove={vi.fn()} />
      </MemoryRouter>,
    );

    expect(screen.getByText("Gluten Free · source-reported")).toBeInTheDocument();
    expect(screen.queryByText(/confirm dietary needs/i)).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/components/discovery/ItemCard.test.tsx`
Expected: FAIL — eyebrow present, source link visible, no expand trigger.

- [ ] **Step 3: Rewrite ItemCard**

Replace `src/components/discovery/ItemCard.tsx` with:

```tsx
import { ChevronDown, ExternalLink, MapPin, Minus, Plus } from "lucide-react";
import { useId, useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { vendorIdForName, type CatalogItem, type FairLocation } from "@/features/catalog/catalog";
import { CATEGORIES } from "@/features/catalog/taxonomy";

interface ItemCardProps {
  item: CatalogItem;
  locationsById: Map<string, FairLocation>;
  isInPlan: boolean;
  onAdd(): void;
  onRemove(): void;
}

const categoryLabels = new Map(CATEGORIES);

export function ItemCard({ item, locationsById, isInPlan, onAdd, onRemove }: ItemCardProps) {
  const [expanded, setExpanded] = useState(false);
  const detailId = useId();
  const knownLocations = item.locationIds
    .map((locationId) => locationsById.get(locationId))
    .filter((location): location is FairLocation => Boolean(location));
  const isNewVendor = item.tagIds.includes("new-vendor");

  return (
    <article className="relative border border-primary/20 bg-card p-4 shadow-[4px_4px_0_hsl(var(--secondary)/0.3)]">
      <div className="absolute left-0 top-0 h-1 w-full bg-gradient-warm" aria-hidden="true" />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-serif text-lg font-bold leading-tight text-foreground">{item.name}</h2>
          <Link
            to={`/browse?vendors=${encodeURIComponent(vendorIdForName(item.vendor))}`}
            aria-label={`See everything from ${item.vendor}`}
            className="mt-0.5 inline-flex min-h-11 items-center text-sm font-semibold text-muted-foreground underline decoration-primary/35 underline-offset-4 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {item.vendor}
          </Link>
        </div>
        <Button
          type="button"
          size="sm"
          variant={isInPlan ? "secondary" : "outline"}
          className="min-h-11 shrink-0"
          aria-label={`${isInPlan ? "Remove" : "Add"} ${item.name} ${isInPlan ? "from" : "to"} plan`}
          onClick={isInPlan ? onRemove : onAdd}
        >
          {isInPlan ? <Minus aria-hidden="true" /> : <Plus aria-hidden="true" />}
          {isInPlan ? "Added" : "Add"}
        </Button>
      </div>

      {(item.dietaryClaims.length > 0 || isNewVendor) ? (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {item.dietaryClaims.map((claim) => (
            <Badge key={claim} variant="outline" className="border-secondary/70 bg-secondary/10 text-[11px]">{titleCase(claim)} · source-reported</Badge>
          ))}
          {isNewVendor ? <Badge variant="outline" className="border-primary/40 bg-primary/5 text-[11px] text-primary">New vendor</Badge> : null}
        </div>
      ) : null}

      <div className="mt-2 flex items-start gap-1.5 text-sm" aria-label="Item location">
        <MapPin className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        {knownLocations.length > 0 ? (
          <span className="flex flex-wrap gap-x-2">
            {knownLocations.map((location) => (
              <Link
                key={location.id}
                to={`/location/${location.id}`}
                className="inline-flex min-h-11 items-center font-semibold text-primary underline decoration-primary/35 underline-offset-4 hover:decoration-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {location.name}
              </Link>
            ))}
          </span>
        ) : <span className="inline-flex min-h-11 items-center font-medium text-muted-foreground">Location not yet announced</span>}
      </div>

      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={detailId}
        aria-label={`More about ${item.name}`}
        onClick={() => setExpanded((current) => !current)}
        className="mt-1 inline-flex min-h-11 items-center gap-1 text-xs font-bold uppercase tracking-wide text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        Details
        <ChevronDown className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")} aria-hidden="true" />
      </button>

      {expanded ? (
        <div id={detailId} className="mt-2 border-t border-dashed border-border pt-3">
          {item.description ? <p className="text-sm leading-6 text-foreground/80">{item.description}</p> : null}
          <div className={cn("flex flex-wrap gap-1.5", item.description && "mt-3")} aria-label="Item tags">
            {item.categoryIds.map((categoryId) => (
              <Link key={categoryId} to={`/browse?categories=${encodeURIComponent(categoryId)}`} className="inline-flex min-h-8 items-center rounded-full border border-secondary/60 bg-secondary/10 px-2.5 text-[11px] font-semibold capitalize text-foreground hover:bg-secondary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{categoryLabels.get(categoryId) ?? categoryId}</Link>
            ))}
            {item.tagIds.map((tagId) => (
              <Link key={tagId} to={`/browse?tags=${encodeURIComponent(tagId)}`} className="inline-flex min-h-8 items-center rounded-full border border-secondary/60 bg-secondary/10 px-2.5 text-[11px] font-semibold capitalize text-foreground hover:bg-secondary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{titleCase(tagId)}</Link>
            ))}
          </div>
          {item.dietaryClaims.length > 0 ? <p className="mt-3 text-xs leading-5 text-muted-foreground">Confirm dietary needs and preparation details with the vendor.</p> : null}
          <a
            href={item.source.url}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex min-h-11 items-center gap-1 text-xs font-semibold text-primary underline decoration-primary/35 underline-offset-4 hover:decoration-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {item.source.publisher}: {item.source.title}<ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
        </div>
      ) : null}
    </article>
  );
}

function titleCase(value: string): string {
  return value.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/components/discovery/ItemCard.test.tsx`
Expected: PASS.

- [ ] **Step 5: Run the full suite, fix fallout**

Run: `npm test`
Expected: PASS. Known fallout: tests asserting card descriptions, per-card source links, or the "In plan" button label ("In plan" → "Added") — update them to the compact contract from Step 1.

- [ ] **Step 6: Commit**

```bash
git add src/components/discovery/ItemCard.tsx src/components/discovery/ItemCard.test.tsx src/pages
git commit -m "feat: compact item cards with expand-in-place detail and vendor tap-to-filter"
```

---

### Task 6: Homepage Compression

Two-column craving tiles at all widths, collections as a horizontal snap-scroll carousel, locations as a compact two-column link list, search submits on Enter without a separate button, and the bottom plan section removed (the nav bar from Task 2 replaces it).

**Files:**
- Modify: `src/pages/Index.tsx`
- Delete: `src/components/LocationCard.tsx` (only call site is Index)
- Test: `src/pages/Index.test.tsx`

**Interfaces:**
- Consumes: existing `catalogItems`, `collections`, `itemsById`, `locations` exports and `CategoryTile`, `CollectionCard`, `CatalogStatusNotice` components (all unchanged)
- Produces: nothing new — page-internal layout only.

- [ ] **Step 1: Write the failing tests**

Add to `src/pages/Index.test.tsx` (reuse its existing render helper; it renders `Index` inside `MemoryRouter` + `FoodPlanProvider`):

```tsx
describe("mobile-first homepage", () => {
  it("has no bottom plan section (the nav bar owns plan access)", () => {
    renderIndex();
    expect(screen.queryByRole("heading", { name: /my food plan/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /view my plan/i })).not.toBeInTheDocument();
  });

  it("has no separate search submit button", () => {
    renderIndex();
    expect(screen.queryByRole("button", { name: /search food guide/i })).not.toBeInTheDocument();
  });

  it("renders locations as compact count links", () => {
    renderIndex();
    const list = screen.getByRole("list", { name: /browse by location/i });
    const links = within(list).getAllByRole("link");
    expect(links.length).toBeGreaterThan(0);
    expect(links[0]).toHaveAccessibleName(/, \d+ confirmed/i);
  });
});
```

(Add `within` to the `@testing-library/react` import if missing.)

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/pages/Index.test.tsx -t "mobile-first"`
Expected: FAIL — plan heading and submit button still present.

- [ ] **Step 3: Apply the layout changes to Index.tsx**

1. **Search form** (lines 49–52): drop the visible submit button, keep implicit Enter submission with an sr-only fallback:

```tsx
            <div className="mt-2">
              <div className="relative"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" aria-hidden="true" /><input id="home-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Apple, hot honey, a vendor…" className="h-12 w-full border-2 border-primary-foreground/75 bg-card px-10 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-primary" /></div>
              <button type="submit" className="sr-only">Search</button>
              <p className="mt-1.5 text-xs text-primary-foreground/80">Press Enter to search the 2026 guide.</p>
            </div>
```

2. **Craving tiles** (line 59): two columns on the smallest screens:

```tsx
<div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
```

3. **Collections** (line 61): horizontal snap-scroll with a peek of the next card:

```tsx
<div className="-mx-4 mt-5 overflow-x-auto px-4 sm:mx-0 sm:px-0">
  <div className="flex w-max snap-x snap-mandatory gap-4 pb-2">
    {collections.map((collection) => (
      <div key={collection.id} className="w-[78vw] max-w-xs shrink-0 snap-start sm:w-80">
        <CollectionCard collection={collection} itemCount={collection.itemIds.filter((id) => itemsById.has(id)).length} />
      </div>
    ))}
  </div>
</div>
```

4. **Locations** (line 65): replace the `LocationCard` grid with a compact list (keep the section heading and intro paragraph):

```tsx
<ul className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4" aria-label="Browse by location">
  {populatedLocations.map(({ location, itemCount }) => (
    <li key={location.id}>
      <Link
        to={`/location/${location.id}`}
        aria-label={`${location.name}, ${itemCount} confirmed ${itemCount === 1 ? "item" : "items"}`}
        className="flex min-h-11 items-center justify-between gap-2 border border-primary/25 bg-card px-3 py-2 text-sm font-semibold text-primary shadow-[2px_2px_0_hsl(var(--secondary)/0.25)] transition-colors hover:bg-secondary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <span className="truncate">{location.name}</span>
        <span className="font-mono text-[10px] font-bold text-muted-foreground" aria-hidden="true">{itemCount}</span>
      </Link>
    </li>
  ))}
</ul>
```

5. **Plan section** (line 67): delete the entire `<section aria-labelledby="plan-heading">`. Remove the now-unused `useFoodPlan` import and `itemIds` destructuring, and the `LocationCard` import.

6. Delete `src/components/LocationCard.tsx`.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/pages/Index.test.tsx`
Expected: PASS, including pre-existing homepage tests (update any that asserted `LocationCard` markup or the plan section).

- [ ] **Step 5: Run the full suite and commit**

Run: `npm test`
Expected: PASS.

```bash
git add src/pages/Index.tsx src/pages/Index.test.tsx
git rm src/components/LocationCard.tsx
git commit -m "feat: compress homepage to mobile-first layout"
```

---

### Task 7: Verification Pass

**Files:** none (verification only; small fixes allowed with their own commits)

- [ ] **Step 1: Lint, test, build**

Run: `npm run lint && npm test && npm run build`
Expected: all pass, build completes (including `scripts/verify-no-legacy-map-assets.mjs`).

- [ ] **Step 2: Visual check at phone size**

Start `npm run dev`, then with a browser at **390×844** check, per the spec's acceptance criteria:

- `/browse?categories=desserts`: at least 4 item cards visible per viewport; category chips scroll horizontally; no horizontal body scroll; sticky bar (count + Filters + active chips) stays visible while scrolling results.
- Filter sheet: opens from the bottom, accordion sections show selected-count badges, **no Vendor section**, footer `Show N results` count changes live as checkboxes toggle, Escape/scrim/swipe all close it and focus returns to the Filters button.
- Card: expand shows tags/source/disclaimer; vendor tap filters to that vendor with a removable `Active filters` chip.
- Bottom nav on every page; adding an item bumps the My Plan badge; nav never covers page content (check the plan page's own buttons).
- Homepage: hero + search, 2-column tiles, collections carousel with peek, flavor picks, compact location list — main sections reachable within ~2 screens of scrolling; no bottom plan section.

- [ ] **Step 3: Visual check at desktop size**

At ≥1280px: no full-height filter column above results; top nav bar sticky with plan count; chips and sheet work identically; browse results in the 2–3 column grid.

- [ ] **Step 4: Commit any fixes and finish**

Use the superpowers:verification-before-completion skill before claiming done. Then follow superpowers:finishing-a-development-branch.

---

## Self-Review Notes

- Spec coverage: chip row (Task 3), filter sheet + sort + vendor removal + sticky bar + microcopy label (Task 4), compact/expandable cards + badges + eyebrow removal + disclaimer placement (Task 5), boilerplate data cleanup + optional description (Task 1), persistent nav + padding (Task 2), homepage compression + search button removal + compact locations (Task 6), verification (Task 7). Spec test list items 1–7 map to Tasks 1, 4, 4, 5, 1, 2, 6 respectively.
- The spec's "hide zero-count chips" and "counts in current context" are implemented via per-category `searchAndFilter` calls (152 items — cheap).
- `FilterSheet` keeps the old `FilterPanel` prop names plus `resultCount` so `BrowsePage` changes stay mechanical.
- Deletions verified single-use by grep: `FilterPanel` (BrowsePage + its test), `SortSelect` (BrowsePage), `LocationCard` (Index).
