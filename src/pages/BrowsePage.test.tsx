import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter, MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import { FilterSidebar } from "@/components/discovery/FilterPanel";
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

function renderBrowseInWindow(path: string) {
  window.history.replaceState({}, "", path);
  return render(
    <BrowserRouter>
      <FoodPlanProvider>
        <Routes><Route path="/browse" element={<BrowsePage />} /></Routes>
      </FoodPlanProvider>
    </BrowserRouter>,
  );
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

    await user.click(screen.getByRole("button", { name: /remove caramel apple mocktail/i }));
    expect(screen.getByRole("button", { name: /add caramel apple mocktail/i })).toBeInTheDocument();
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

    expect(screen.getByRole("button", { name: /remove mocktails filter/i })).toHaveClass("min-h-11");
    expect(screen.getByRole("button", { name: "Clear all" })).toHaveClass("min-h-11");

    await user.click(screen.getByRole("button", { name: /remove mocktails filter/i }));
    expect(screen.getByTestId("location-search")).toHaveTextContent("locations=the-front-porch");

    await user.click(screen.getByRole("button", { name: "Clear all" }));
    expect(screen.getByTestId("location-search")).toBeEmptyDOMElement();
  });

  it("renders the desktop filter sidebar beside the results, not inside the search toolbar", () => {
    renderBrowse("/browse?collection=wildest-new-foods");

    const toolbar = screen.getByRole("region", { name: "Search the food catalog" });
    const sidebar = screen.getByRole("complementary", { name: "Filter foods" });
    const results = screen.getByRole("region", { name: /food finder/i });

    expect(toolbar).not.toContainElement(sidebar);
    expect(sidebar).not.toContainElement(toolbar);
    expect(sidebar).not.toContainElement(results);
    expect(within(toolbar).getByRole("button", { name: /open filters/i })).toBeInTheDocument();
  });

  it("only offers Relevance when a search query exists", () => {
    renderBrowse("/browse");
    expect(screen.queryByRole("option", { name: "Relevance" })).not.toBeInTheDocument();

    cleanup();
    renderBrowse("/browse?q=apple");
    expect(screen.getByRole("option", { name: "Relevance" })).toBeInTheDocument();
  });

  it("clears an explicit relevance sort when its query is removed", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/browse?q=apple"]}>
        <FoodPlanProvider>
          <Routes><Route path="/browse" element={<BrowsePage />} /></Routes>
          <LocationSearch />
        </FoodPlanProvider>
      </MemoryRouter>,
    );

    await user.selectOptions(screen.getByLabelText("Sort"), "name");
    await user.selectOptions(screen.getByLabelText("Sort"), "relevance");
    await user.clear(screen.getByLabelText("Search the midway"));

    expect(screen.queryByRole("option", { name: "Relevance" })).not.toBeInTheDocument();
    expect(screen.getByLabelText("Sort")).toHaveValue("name");
    expect(screen.getByTestId("location-search")).not.toHaveTextContent("sort=relevance");
  });

  it("normalizes relevance when its query chip is removed", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/browse?q=apple&sort=relevance"]}>
        <FoodPlanProvider>
          <Routes><Route path="/browse" element={<BrowsePage />} /></Routes>
          <LocationSearch />
        </FoodPlanProvider>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: /remove search: apple filter/i }));

    expect(screen.getByTestId("location-search")).toBeEmptyDOMElement();
    expect(screen.getByLabelText("Sort")).toHaveValue("name");
  });

  it("replaces browser history entries for discovery updates", async () => {
    const user = userEvent.setup();
    renderBrowseInWindow("/browse?categories=mocktails&locations=the-front-porch");
    const historyLength = window.history.length;

    await user.click(screen.getByRole("button", { name: /remove mocktails filter/i }));
    expect(window.history.length).toBe(historyLength);

    await user.click(screen.getByRole("button", { name: "Clear all" }));
    expect(window.history.length).toBe(historyLength);
  });

  it("offers Location TBD only when unlocated records exist", () => {
    const props = {
      state: { query: "", categoryIds: [], tagIds: [], dietaryClaims: [], locationIds: [], vendorIds: [] },
      locations: [],
      onStateChange: () => undefined,
      onClear: () => undefined,
    };
    const { rerender } = render(<FilterSidebar {...props} hasUnlocatedItems />);
    expect(screen.getByLabelText("Location TBD")).toBeInTheDocument();

    rerender(<FilterSidebar {...props} hasUnlocatedItems={false} />);
    expect(screen.queryByLabelText("Location TBD")).not.toBeInTheDocument();
  });

  it("preserves a multiword query while typing each character into URL-backed state", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/browse"]}>
        <FoodPlanProvider>
          <Routes><Route path="/browse" element={<BrowsePage />} /></Routes>
          <LocationSearch />
        </FoodPlanProvider>
      </MemoryRouter>,
    );

    const search = screen.getByLabelText("Search the midway");
    await user.type(search, "hot honey");

    expect(search).toHaveValue("hot honey");
    expect(screen.getByTestId("location-search")).toHaveTextContent("q=hot+honey");
    expect(screen.getByText("Hot Honey and Bacon Poutine")).toBeInTheDocument();
  });

  it("filters by a controlled vendor and exposes a removable vendor chip", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/browse"]}>
        <FoodPlanProvider>
          <Routes><Route path="/browse" element={<BrowsePage />} /></Routes>
          <LocationSearch />
        </FoodPlanProvider>
      </MemoryRouter>,
    );

    await user.click(screen.getByLabelText("W.A.V.E. Mocktail Bar"));

    expect(screen.getByTestId("location-search")).toHaveTextContent("vendors=w-a-v-e-mocktail-bar");
    expect(screen.getByText("Caramel Apple Mocktail")).toBeInTheDocument();
    expect(screen.queryByText("Tater Tot Buckets")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /remove w\.a\.v\.e\. mocktail bar filter/i }));
    expect(screen.getByTestId("location-search")).not.toHaveTextContent("vendors=");
    expect(screen.getByText("Tater Tot Buckets")).toBeInTheDocument();
  });

  it("gives representative filter rows and the Sheet close control 44px targets", async () => {
    const user = userEvent.setup();
    renderBrowse("/browse");

    expect(screen.getByLabelText("Cocktails").closest("label")).toHaveClass("min-h-11");
    await user.click(screen.getByRole("button", { name: /open filters/i }));
    expect(screen.getByRole("button", { name: "Close" })).toHaveClass("min-h-11", "min-w-11");
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
