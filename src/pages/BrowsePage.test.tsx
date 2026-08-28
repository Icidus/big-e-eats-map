import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import { FilterPanel } from "@/components/discovery/FilterPanel";
import { FoodPlanProvider } from "@/features/plan/FoodPlanProvider";
import { BrowsePage } from "./BrowsePage";

afterEach(cleanup);

function renderBrowse(path: string) {
  window.localStorage?.clear();
  return render(
    <MemoryRouter initialEntries={[path]}>
      <FoodPlanProvider>
        <Routes><Route path="/browse" element={<BrowsePage />} /></Routes>
      </FoodPlanProvider>
    </MemoryRouter>,
  );
}

function LocationSearch() {
  const location = useLocation();
  return <output data-testid="location-search">{location.search}</output>;
}

describe("BrowsePage", () => {
  it("renders URL facets and matching cards", () => {
    renderBrowse("/browse?categories=mocktails&locations=the-front-porch");

    expect(screen.getByRole("heading", { name: /browse 2026 food/i })).toBeInTheDocument();
    expect(screen.getAllByText("Mocktails").length).toBeGreaterThan(0);
    expect(screen.getAllByText("The Front Porch").length).toBeGreaterThan(0);
    expect(screen.getByText("Caramel Apple Mocktail")).toBeInTheDocument();
  });

  it("adds and removes an item from the plan", async () => {
    const user = userEvent.setup();
    renderBrowse("/browse?q=Caramel%20Apple");

    await user.click(screen.getByRole("button", { name: /add caramel apple mocktail/i }));

    expect(screen.getByRole("button", { name: /remove caramel apple mocktail/i })).toBeInTheDocument();
  });

  it("serializes removable chips and Clear all with replacement navigation", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/browse?categories=mocktails&locations=the-front-porch"]}>
        <FoodPlanProvider>
          <Routes><Route path="/browse" element={<BrowsePage />} /></Routes>
          <LocationSearch />
        </FoodPlanProvider>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: /remove mocktails filter/i }));
    expect(screen.getByTestId("location-search")).toHaveTextContent("locations=the-front-porch");

    await user.click(screen.getByRole("button", { name: "Clear all" }));
    expect(screen.getByTestId("location-search")).toBeEmptyDOMElement();
  });

  it("only offers Relevance when a search query exists", () => {
    renderBrowse("/browse");
    expect(screen.queryByRole("option", { name: "Relevance" })).not.toBeInTheDocument();

    cleanup();
    renderBrowse("/browse?q=apple");
    expect(screen.getByRole("option", { name: "Relevance" })).toBeInTheDocument();
  });

  it("offers Location TBD only when unlocated records exist", () => {
    const props = {
      state: { query: "", categoryIds: [], tagIds: [], dietaryClaims: [], locationIds: [] },
      locations: [],
      onStateChange: () => undefined,
      onClear: () => undefined,
    };
    const { rerender } = render(<FilterPanel {...props} hasUnlocatedItems />);
    expect(screen.getByLabelText("Location TBD")).toBeInTheDocument();

    rerender(<FilterPanel {...props} hasUnlocatedItems={false} />);
    expect(screen.queryByLabelText("Location TBD")).not.toBeInTheDocument();
  });

  it("opens mobile filters in a dialog and restores focus on close", async () => {
    const user = userEvent.setup();
    renderBrowse("/browse");
    const trigger = screen.getByRole("button", { name: /open filters/i });
    await user.click(trigger);
    expect(screen.getByRole("dialog", { name: /find your next bite/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(trigger).toHaveFocus();
  });
});
