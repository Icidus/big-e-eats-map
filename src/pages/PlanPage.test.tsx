import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BrowserRouter, MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import type { CatalogItem, FairLocation } from "@/features/catalog/catalog";
import { FoodPlanProvider, useFoodPlan } from "@/features/plan/FoodPlanProvider";
import { PlanPage, PlanView } from "./PlanPage";

const source = { publisher: "Test", title: "Test source", url: "https://example.com", accessedOn: "2026-08-27" };
const item = (id: string, name: string, locationIds: string[] = []): CatalogItem => ({
  id, name, locationIds, vendor: "Test vendor", year: 2026, description: "Test description",
  categoryIds: [], tagIds: [], dietaryClaims: [], isNewFor2026: false, source,
});
const fixtureLocations: FairLocation[] = [
  { id: "front", name: "The Front Porch", description: "", mapImage: "front.png", order: 1 },
  { id: "east", name: "East Road", description: "", mapImage: "east.png", order: 2 },
];
const knownEast = item("east-item", "East Treat", ["east"]);
const knownFront = item("front-item", "Front Treat", ["front"]);
const unknown = item("unknown-item", "Unknown Treat", ["missing"]);
const multiLocation = item("multi-item", "Multi-location Treat", ["east", "front"]);

class MemoryStorage implements Storage {
  private values = new Map<string, string>();
  get length() { return this.values.size; }
  clear() { this.values.clear(); }
  getItem(key: string) { return this.values.get(key) ?? null; }
  key(index: number) { return [...this.values.keys()][index] ?? null; }
  removeItem(key: string) { this.values.delete(key); }
  setItem(key: string, value: string) { this.values.set(key, value); }
}

beforeEach(() => {
  vi.stubGlobal("localStorage", new MemoryStorage());
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function renderPlanView(props: Pick<React.ComponentProps<typeof PlanView>, "items" | "locations">) {
  return render(
    <MemoryRouter>
      <PlanView {...props} checkedIds={[]} onToggleChecked={() => undefined} onRemove={() => undefined} />
    </MemoryRouter>,
  );
}

function PlanState() {
  const { itemIds } = useFoodPlan();
  return <output data-testid="plan-ids">{itemIds.join(",")}</output>;
}

function LocationSearch() {
  const location = useLocation();
  return <output data-testid="location-search">{location.search}</output>;
}

function renderPlan(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <FoodPlanProvider>
        <Routes><Route path="/plan" element={<PlanPage />} /></Routes>
        <PlanState />
        <LocationSearch />
      </FoodPlanProvider>
    </MemoryRouter>,
  );
}

function renderPlanInWindow(path: string) {
  window.history.replaceState({}, "", path);
  return render(
    <BrowserRouter>
      <FoodPlanProvider>
        <Routes><Route path="/plan" element={<PlanPage />} /></Routes>
        <LocationSearch />
      </FoodPlanProvider>
    </BrowserRouter>,
  );
}

describe("PlanView", () => {
  it("groups known stops in fair order and puts TBD last", () => {
    renderPlanView({ items: [knownEast, unknown, knownFront], locations: fixtureLocations });
    expect(screen.getAllByRole("heading", { level: 2 }).map((node) => node.textContent)).toEqual([
      "The Front Porch", "East Road", "Location TBD",
    ]);
  });

  it("shows a multi-location item once under its first location", () => {
    renderPlanView({ items: [multiLocation], locations: fixtureLocations });
    expect(screen.getAllByText("Multi-location Treat")).toHaveLength(1);
    expect(screen.getByRole("heading", { name: "East Road" })).toBeInTheDocument();
  });

  it("has descriptive check and remove controls and only maps known mapped groups", async () => {
    const user = userEvent.setup();
    const onToggleChecked = vi.fn();
    const onRemove = vi.fn();
    render(
      <MemoryRouter><PlanView items={[knownFront, unknown]} locations={fixtureLocations} checkedIds={[knownFront.id]} onToggleChecked={onToggleChecked} onRemove={onRemove} /></MemoryRouter>,
    );
    expect(screen.getByRole("checkbox", { name: "Mark Front Treat as not visited" })).toBeChecked();
    expect(screen.getByRole("link", { name: "View location map for The Front Porch" })).toHaveAttribute("href", "/location/front");
    expect(screen.queryByRole("link", { name: /location tbd/i })).not.toBeInTheDocument();
    await user.click(screen.getByRole("checkbox", { name: "Mark Front Treat as not visited" }));
    await user.click(screen.getByRole("button", { name: "Remove Front Treat from my plan" }));
    expect(onToggleChecked).toHaveBeenCalledWith(knownFront.id);
    expect(onRemove).toHaveBeenCalledWith(knownFront.id);
  });

  it("offers useful browse links when the plan is empty", () => {
    renderPlanView({ items: [], locations: fixtureLocations });
    expect(screen.getByRole("link", { name: /browse all food/i })).toHaveAttribute("href", "/browse");
    expect(screen.getByRole("link", { name: /browse drinks/i })).toHaveAttribute("href", "/browse?categories=drinks");
  });
});

describe("PlanPage shared plans", () => {
  it("requires a choice before applying shared items and reports known and missing counts", () => {
    renderPlan("/plan?items=wave-caramel-apple-mocktail,missing");
    expect(screen.getByRole("button", { name: /replace my plan/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /merge with my plan/i })).toBeInTheDocument();
    expect(screen.getByText(/1 shared item could not be found/i)).toBeInTheDocument();
    expect(screen.getByTestId("plan-ids")).toBeEmptyDOMElement();
  });

  it("merges shared known IDs and removes only items while retaining unrelated params", async () => {
    const user = userEvent.setup();
    renderPlan("/plan?ref=friend&items=wave-caramel-apple-mocktail");
    await user.click(screen.getByRole("button", { name: /merge with my plan/i }));
    expect(screen.getByTestId("plan-ids")).toHaveTextContent("wave-caramel-apple-mocktail");
    expect(screen.getByTestId("location-search")).toHaveTextContent("?ref=friend");
    expect(screen.getByText(/added 1 shared item/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /merge with my plan/i })).not.toBeInTheDocument();
  });

  it("replaces the import URL history entry after applying shared items", async () => {
    const user = userEvent.setup();
    renderPlanInWindow("/plan?items=wave-caramel-apple-mocktail&ref=friend");
    const historyLength = window.history.length;

    await user.click(screen.getByRole("button", { name: /merge with my plan/i }));

    expect(window.history.length).toBe(historyLength);
    expect(screen.getByTestId("location-search")).toHaveTextContent("?ref=friend");
  });

  it("replaces rather than merges a pre-existing local plan", async () => {
    const user = userEvent.setup();
    window.localStorage.setItem("big-e-food-plan:v1", JSON.stringify({ itemIds: ["wave-carrot-cake"], checkedIds: ["wave-carrot-cake"] }));
    renderPlan("/plan?items=wave-caramel-apple-mocktail");
    await user.click(screen.getByRole("button", { name: /replace my plan/i }));
    expect(screen.getByTestId("plan-ids")).toHaveTextContent("wave-caramel-apple-mocktail");
  });

  it("handles a shared set with no known items without mutating the plan", () => {
    renderPlan("/plan?items=missing-only");
    expect(screen.getByText(/0 shared items are available/i)).toBeInTheDocument();
    expect(screen.getByTestId("plan-ids")).toBeEmptyDOMElement();
  });

  it("uses the navigator share URL without checked state", async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { share });
    const user = userEvent.setup();
    window.localStorage.setItem("big-e-food-plan:v1", JSON.stringify({ itemIds: ["wave-caramel-apple-mocktail"], checkedIds: ["wave-caramel-apple-mocktail"] }));
    renderPlan("/plan");
    await user.click(screen.getByRole("button", { name: /share my plan/i }));
    const url = share.mock.calls[0][0].url;
    expect(url).toBe(`${new URL("plan", new URL(import.meta.env.BASE_URL, window.location.origin))}?items=wave-caramel-apple-mocktail`);
    expect(url).not.toContain("checked");
  });

  it("reports an honest failure when native sharing is rejected", async () => {
    vi.stubGlobal("navigator", { share: vi.fn().mockRejectedValue(new Error("cancelled")) });
    const user = userEvent.setup();
    window.localStorage.setItem("big-e-food-plan:v1", JSON.stringify({ itemIds: ["wave-caramel-apple-mocktail"], checkedIds: [] }));
    renderPlan("/plan");
    await user.click(screen.getByRole("button", { name: /share my plan/i }));
    expect(await screen.findByText(/was not shared/i)).toBeInTheDocument();
  });
});
