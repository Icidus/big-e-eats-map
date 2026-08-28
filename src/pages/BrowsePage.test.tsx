import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter, MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import { FilterSheet } from "@/components/discovery/FilterSheet";
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

  it("only offers Relevance when a search query exists", async () => {
    const user = userEvent.setup();
    renderBrowse("/browse");
    await user.click(screen.getByRole("button", { name: "Filters" }));
    expect(screen.queryByRole("radio", { name: "Relevance" })).not.toBeInTheDocument();

    cleanup();
    renderBrowse("/browse?q=apple");
    await user.click(screen.getByRole("button", { name: "Filters" }));
    expect(screen.getByRole("radio", { name: "Relevance" })).toBeInTheDocument();
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

    await user.click(screen.getByRole("button", { name: "Filters" }));
    await user.click(screen.getByRole("radio", { name: "Name A-Z" }));
    await user.click(screen.getByRole("radio", { name: "Relevance" }));
    await user.click(screen.getByRole("button", { name: /show \d+ results?/i }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    await user.clear(screen.getByLabelText("Search 2026 food"));

    await user.click(screen.getByRole("button", { name: "Filters" }));
    expect(screen.queryByRole("radio", { name: "Relevance" })).not.toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Name A-Z" })).toBeChecked();
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
    await user.click(screen.getByRole("button", { name: "Filters" }));
    expect(screen.getByRole("radio", { name: "Name A-Z" })).toBeChecked();
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

  it("offers Location TBD only when unlocated records exist", async () => {
    const user = userEvent.setup();
    const props = {
      state: { query: "", categoryIds: [], tagIds: [], dietaryClaims: [], locationIds: [], vendorIds: [] },
      locations: [],
      resultCount: 0,
      onStateChange: () => undefined,
      onClear: () => undefined,
    };
    const { rerender } = render(<FilterSheet {...props} hasUnlocatedItems />);
    await user.click(screen.getByRole("button", { name: "Filters" }));
    await user.click(screen.getByRole("button", { name: "Location" }));
    expect(screen.getByLabelText("Location TBD")).toBeInTheDocument();

    rerender(<FilterSheet {...props} hasUnlocatedItems={false} />);
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

    const search = screen.getByLabelText("Search 2026 food");
    await user.type(search, "hot honey");

    expect(search).toHaveValue("hot honey");
    expect(screen.getByTestId("location-search")).toHaveTextContent("q=hot+honey");
    expect(screen.getByText("Hot Honey and Bacon Poutine")).toBeInTheDocument();
  });

  it("supports a vendor filter via URL state and exposes a removable vendor chip even with no vendor facet UI", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/browse?vendors=w-a-v-e-mocktail-bar"]}>
        <FoodPlanProvider>
          <Routes><Route path="/browse" element={<BrowsePage />} /></Routes>
          <LocationSearch />
        </FoodPlanProvider>
      </MemoryRouter>,
    );

    expect(screen.getByText("Caramel Apple Mocktail")).toBeInTheDocument();
    expect(screen.queryByText("Tater Tot Buckets")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /remove w\.a\.v\.e\. mocktail bar filter/i }));
    expect(screen.getByTestId("location-search")).not.toHaveTextContent("vendors=");
    expect(screen.getByText("Tater Tot Buckets")).toBeInTheDocument();
  });

  it("gives representative filter rows and the sheet's close control 44px targets", async () => {
    const user = userEvent.setup();
    renderBrowse("/browse");

    await user.click(screen.getByRole("button", { name: "Filters" }));
    expect(screen.getByLabelText("Cocktails").closest("label")).toHaveClass("min-h-11");
    expect(screen.getByRole("button", { name: /^show \d+ results?$/i })).toHaveClass("min-h-11");
  });

  it("opens mobile filters in a dialog and restores focus on close", async () => {
    const user = userEvent.setup();
    renderBrowse("/browse");
    const trigger = screen.getByRole("button", { name: "Filters" });
    await user.click(trigger);
    expect(screen.getByRole("dialog", { name: "Filters" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^show \d+ results?$/i }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

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
});

describe("filter sheet", () => {
  it("has no vendor facet but keeps vendors URL state working", () => {
    const user = userEvent.setup();
    renderBrowse("/browse?vendors=tripps-farmhouse-cafe");

    expect(screen.getAllByText(/tripp/i).length).toBeGreaterThan(0);
    return user.click(screen.getByRole("button", { name: /^filters/i })).then(() => {
      expect(screen.queryByRole("button", { name: /^vendor$/i })).not.toBeInTheDocument();
      expect(screen.queryByRole("checkbox", { name: /tripp/i })).not.toBeInTheDocument();
    });
  });

  it("shows a live result count in the sheet footer", async () => {
    const user = userEvent.setup();
    renderBrowse("/browse?categories=desserts");

    await user.click(screen.getByRole("button", { name: /^filters/i }));
    const status = screen.getByRole("status", { name: /result count/i });
    const initialCount = Number(status.textContent?.match(/\d+/)?.[0]);
    expect(screen.getByRole("button", { name: `Show ${initialCount} results` })).toBeInTheDocument();

    // Toggling a facet without closing the sheet should update the footer count live,
    // in step with the same aria-live status the sticky bar shows.
    await user.click(screen.getByLabelText("Burgers"));

    await waitFor(() => {
      const updatedCount = Number(status.textContent?.match(/\d+/)?.[0]);
      expect(updatedCount).not.toBe(initialCount);
      expect(screen.getByRole("button", { name: `Show ${updatedCount} results` })).toBeInTheDocument();
    });
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
