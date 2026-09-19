import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { catalogItems, collections, locations } from "@/features/catalog/catalog";
import { FoodPlanProvider } from "@/features/plan/FoodPlanProvider";
import { PLAN_STORAGE_KEY } from "@/features/plan/planStore";
import Index from "./Index";

const standardCollections = collections.filter((collection) => !["masslive-must-try", "masslive-opening-day", "new-for-2026"].includes(collection.id));

afterEach(cleanup);

const storage = new Map<string, string>();

beforeEach(() => {
  storage.clear();
  Object.defineProperty(window, "localStorage", {
    configurable: true,
    value: {
      clear: () => storage.clear(),
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
    },
  });
});

function LocationDisplay() {
  const location = useLocation();
  return <output data-testid="location">{`${location.pathname}${location.search}`}</output>;
}

function renderIndex(planItemIds: string[] = []) {
  window.localStorage.clear();
  if (planItemIds.length) {
    window.localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify({ itemIds: planItemIds, checkedIds: [] }));
  }

  return render(
    <MemoryRouter initialEntries={["/"]}>
      <FoodPlanProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/browse" element={<LocationDisplay />} />
          <Route path="/plan" element={<LocationDisplay />} />
        </Routes>
      </FoodPlanProvider>
    </MemoryRouter>,
  );
}

describe("Index", () => {
  it("leads with 2026 browse entry points", () => {
    renderIndex();

    expect(screen.getByRole("heading", { name: /find your next big e bite/i })).toBeInTheDocument();
    expect(screen.getByRole("searchbox", { name: /search 2026 food/i })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /desserts/i }).find((link) => link.getAttribute("href")?.includes("categories=desserts"))).toBeDefined();
    expect(screen.getAllByRole("link", { name: /fried dough/i }).find((link) => link.getAttribute("href")?.includes("categories=fried-dough"))).toBeDefined();
  });

  it("sends an encoded search to Browse", async () => {
    const user = userEvent.setup();
    renderIndex();

    await user.type(screen.getByRole("searchbox", { name: /search 2026 food/i }), "apple & cinnamon");
    await user.click(screen.getByRole("button", { name: /search food guide/i }));

    expect(screen.getByTestId("location")).toHaveTextContent("/browse?q=apple+%26+cinnamon");
  });

  it("sends a blank search to Browse without a query", async () => {
    const user = userEvent.setup();
    renderIndex();

    await user.click(screen.getByRole("button", { name: /search food guide/i }));

    expect(screen.getByTestId("location")).toHaveTextContent("/browse");
  });

  it("shows all curated collections in their declared order", () => {
    renderIndex();

    const titles = screen.getAllByRole("heading", { level: 3 }).map((heading) => heading.textContent);
    expect(titles.filter((title) => standardCollections.some((collection) => collection.title === title))).toEqual(standardCollections.map((collection) => collection.title));
  });

  it("uses actual catalog counts in browse links", () => {
    renderIndex();
    const friedDoughCount = catalogItems.filter((item) => item.categoryIds.includes("fried-dough")).length;
    const friedDough = screen.getByRole("link", { name: `Browse Fried Dough & Funnel Cakes, ${friedDoughCount} confirmed items` });

    expect(friedDough).toHaveAttribute("href", "/browse?categories=fried-dough");
    expect(screen.getByRole("link", { name: /browse .* confirmed items at the front porch/i })).toHaveAttribute("href", "/browse?locations=the-front-porch");
  });

  it("leads with the six biggest fair-day cravings as category tiles", () => {
    renderIndex();

    for (const [id, label] of [["fried-dough", "Fried Dough & Funnel Cakes"], ["desserts", "Desserts"], ["potatoes-fries", "Potatoes & Fries"], ["burgers", "Burgers"], ["global-eats", "Global Eats"], ["nonalcoholic-drinks", "Coffee & Cold Drinks"]]) {
      expect(screen.getByRole("link", { name: new RegExp(`^Browse ${label.replace(/[&]/g, "&")}, \\d+ confirmed items$`) })).toHaveAttribute("href", `/browse?categories=${id}`);
    }
    expect(screen.queryByRole("link", { name: /^browse cocktails,/i })).not.toBeInTheDocument();
  });

  it("routes every flavor pick, including Spicy, through tag filters", () => {
    renderIndex();

    for (const [tag, label] of [["spicy", "Spicy"], ["pickle", "Pickle"], ["birria", "Birria"], ["hot-honey", "Hot honey"], ["pumpkin", "Pumpkin"], ["apple", "Apple"], ["fall-flavors", "Fall flavors"]]) {
      expect(screen.getByRole("link", { name: label })).toHaveAttribute("href", `/browse?tags=${tag}`);
    }
  });

  it("resolves every collection link and displayed count from its declared items", () => {
    renderIndex();

    for (const collection of standardCollections) {
      const count = collection.itemIds.filter((id) => catalogItems.some((item) => item.id === id)).length;
      const collectionLink = screen.getByRole("link", { name: `Browse ${collection.title}, ${count} confirmed items` });
      expect(collectionLink).toHaveAttribute("href", `/browse?collection=${collection.id}`);
      expect(within(collectionLink.closest("article")!).getByText(`2026 collection · ${count} items`)).toBeInTheDocument();
    }
  });

  it("shows only locations with confirmed items", () => {
    renderIndex();

    for (const location of locations.filter((entry) => catalogItems.some((item) => item.locationIds.includes(entry.id)))) {
      const count = catalogItems.filter((item) => item.locationIds.includes(location.id)).length;
      expect(screen.getByRole("link", { name: `Browse ${count} confirmed items at ${location.name}` })).toHaveAttribute("href", `/browse?locations=${location.id}`);
    }

    for (const location of locations.filter((entry) => !catalogItems.some((item) => item.locationIds.includes(entry.id)))) {
      expect(screen.queryByRole("link", { name: new RegExp(location.name, "i") })).not.toBeInTheDocument();
    }
  });

  it("keeps browse sections in the editorial entry order", () => {
    renderIndex();

    const landmarks = [...document.querySelectorAll("header, aside[aria-label='Catalog status'], main > section")];
    expect(landmarks.map((element) => element.getAttribute("aria-labelledby") ?? element.tagName.toLowerCase())).toEqual([
      "header", "aside", "masslive-heading", "new-foods-heading", "cravings-heading", "collections-heading", "flavor-heading", "locations-heading", "plan-heading",
    ]);
    expect(landmarks[0]).toHaveTextContent(/find your next big e bite/i);
    expect(landmarks[0]).toHaveTextContent(/search 2026 food/i);
  });

  it("calls flavor shortcuts editor selected, not trending", () => {
    renderIndex();

    expect(screen.getByText(/editor.?s flavor picks/i)).toBeInTheDocument();
    expect(screen.queryByText(/trending/i)).not.toBeInTheDocument();
  });

  it("summarizes the current food plan", () => {
    renderIndex([catalogItems[0].id, catalogItems[1].id]);

    expect(screen.getByRole("link", { name: /my food plan.*2 saved/i })).toHaveAttribute("href", "/plan");
  });

  it("links to the fair map from the hero", () => {
    renderIndex();
    expect(within(screen.getByRole("banner")).getByRole("link", { name: /fair map/i })).toHaveAttribute("href", "/map");
  });
});

describe("home food spotlights", () => {
  it("promotes MassLive picks before cravings and links to both recommendation lists", () => {
    renderIndex();
    const section = screen.getByRole("region", { name: "MassLive’s must-try foods" });
    expect(within(section).getByText("Fried Butter")).toBeInTheDocument();
    expect(within(section).getByText("MooNugs")).toBeInTheDocument();
    expect(within(section).getByRole("link", { name: /all 10 must-try picks/i })).toHaveAttribute("href", "/browse?collection=masslive-must-try");
    expect(within(section).getByRole("link", { name: /opening-day favorites/i })).toHaveAttribute("href", "/browse?collection=masslive-opening-day");
  });

  it("offers a dedicated new-food section and saves a featured pick directly", async () => {
    const user = userEvent.setup();
    renderIndex();
    const section = screen.getByRole("region", { name: "New for 2026" });
    expect(within(section).getByRole("link", { name: /all .* new foods/i })).toHaveAttribute("href", "/browse?collection=new-for-2026");
    const add = within(section).getAllByRole("button", { name: /^add .* to plan/i })[0];
    await user.click(add);
    expect(within(section).getAllByRole("button", { name: /^remove .* from plan/i })).toHaveLength(1);
    expect(screen.getByRole("link", { name: /my food plan.*1 saved/i })).toBeInTheDocument();
  });
});

it('links to both MassLive articles and nearby food from home', () => {
  renderIndex();
  expect(screen.getByRole('link', { name: /read masslive’s opening-day review/i })).toHaveAttribute('href', expect.stringContaining('/everything-we-ate-at-the-big-e-'));
  expect(screen.getByRole('link', { name: 'What’s around me?' })).toHaveAttribute('href', '/map?nearby=1');
});
