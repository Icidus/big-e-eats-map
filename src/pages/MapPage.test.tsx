import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BrowserRouter, MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { catalogItems, itemsById } from "@/features/catalog/catalog";
import type { FairMapProps } from "@/features/map/FairMap";
import type { GeolocationState } from "@/features/map/useGeolocation";
import { MapPage } from "./MapPage";

const geo = vi.hoisted((): GeolocationState => ({ status: "idle", position: null, error: null, locate: vi.fn(), stop: vi.fn() }));

vi.mock("@/features/map/useGeolocation", () => ({ useGeolocation: () => geo }));
vi.mock("@/features/map/FairMap", () => ({
  FairMap: (props: FairMapProps) => (
    <div data-testid="fair-map" data-destination={props.destination?.id ?? ""} data-user={props.userPosition ? "yes" : "no"} data-locations={props.locations.length}>
      <button type="button" onClick={() => props.onSelectLocation("east-road")}>mock select east road</button>
    </div>
  ),
}));

afterEach(cleanup);
beforeEach(() => {
  geo.status = "idle";
  geo.position = null;
  geo.error = null;
  vi.mocked(geo.locate).mockClear();
});

function LocationSearch() {
  const location = useLocation();
  return <div data-testid="location-search">{location.search}</div>;
}

function renderMap(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes><Route path="/map" element={<><MapPage /><LocationSearch /></>} /></Routes>
    </MemoryRouter>,
  );
}

describe("MapPage back navigation", () => {
  it("falls back to Browse when opened cold", () => {
    renderMap("/map?to=food-court");

    expect(screen.getByRole("link", { name: /browse all food/i })).toHaveAttribute("href", "/browse");
    expect(screen.queryByRole("button", { name: /^back/i })).not.toBeInTheDocument();
  });

  it("returns to the originating page with its label when arrived from inside the app", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/browse?categories=burgers", { pathname: "/map", search: "?item=calabrese-panella", state: { backLabel: "Back to results" } }]}>
        <Routes>
          <Route path="/map" element={<><MapPage /><LocationSearch /></>} />
          <Route path="/browse" element={<div data-testid="browse-page"><LocationSearch /></div>} />
        </Routes>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: "Back to results" }));

    expect(screen.getByTestId("browse-page")).toBeInTheDocument();
    expect(screen.getByTestId("location-search")).toHaveTextContent("?categories=burgers");
  });
});

describe("MapPage", () => {
  it("renders the map and every area without a destination by default", () => {
    renderMap("/map");

    expect(screen.getByRole("heading", { name: /fair map/i })).toBeInTheDocument();
    expect(screen.getByTestId("fair-map")).toHaveAttribute("data-destination", "");
    expect(screen.getAllByRole("button", { name: /show .* on map/i })).toHaveLength(14);
    expect(screen.queryByRole("region", { name: /destination/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/not yet placed/i)).not.toBeInTheDocument();
  });

  it("selects a location destination from the to parameter", () => {
    renderMap("/map?to=food-court");

    const card = screen.getByRole("region", { name: /destination/i });
    expect(within(card).getByRole("heading", { name: "Food Court" })).toBeInTheDocument();
    expect(within(card).getByText("Approximate")).toBeInTheDocument();
    expect(within(card).getByText(/tap find me to see distance/i)).toBeInTheDocument();
    expect(within(card).getByRole("link", { name: /walking directions/i })).toHaveAttribute("href", "https://www.google.com/maps/dir/?api=1&destination=42.0905,-72.616&travelmode=walking");
    expect(screen.getByTestId("fair-map")).toHaveAttribute("data-destination", "food-court");
  });

  it("selects an item destination, leading with the vendor and naming its area", () => {
    renderMap("/map?item=calabrese-panella&to=east-road");

    const card = screen.getByRole("region", { name: /destination/i });
    expect(within(card).getByRole("heading", { name: "Calabrese Market" })).toBeInTheDocument();
    expect(within(card).getByText("Panella")).toBeInTheDocument();
    expect(within(card).getByText("Food Court")).toBeInTheDocument();
    expect(screen.getByTestId("fair-map")).toHaveAttribute("data-destination", "calabrese-panella");
  });

  it("ignores unknown ids", () => {
    renderMap("/map?item=nope&to=nowhere");

    expect(screen.queryByRole("region", { name: /destination/i })).not.toBeInTheDocument();
    expect(screen.getByTestId("fair-map")).toHaveAttribute("data-destination", "");
  });

  it("falls through to the to param when a known item does not resolve to a destination", () => {
    const unlocatedItemId = "test-unlocated-item";
    itemsById.set(unlocatedItemId, { ...catalogItems[0], id: unlocatedItemId, locationIds: [] });

    try {
      renderMap(`/map?item=${unlocatedItemId}&to=east-road`);

      const card = screen.getByRole("region", { name: /destination/i });
      expect(within(card).getByRole("heading", { name: "East Road" })).toBeInTheDocument();
      expect(screen.getByTestId("fair-map")).toHaveAttribute("data-destination", "east-road");
    } finally {
      itemsById.delete(unlocatedItemId);
    }
  });

  it("describes the walk once a position is known", () => {
    geo.status = "tracking";
    geo.position = { lat: 42.0913, lng: -72.6185, accuracyMeters: 10 };
    renderMap("/map?to=food-court");

    expect(screen.getByRole("region", { name: /destination/i })).toHaveTextContent(/About \d+ m, (north|south|east|west)/);
    expect(screen.getByTestId("fair-map")).toHaveAttribute("data-user", "yes");
    expect(screen.getByRole("button", { name: /stop locating/i })).toBeInTheDocument();
  });

  it("starts geolocation only from the Find me button", async () => {
    const user = userEvent.setup();
    renderMap("/map");

    expect(geo.locate).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: /find me/i }));
    expect(geo.locate).toHaveBeenCalledTimes(1);
  });

  it("explains denied and unavailable states", () => {
    geo.status = "denied";
    renderMap("/map");
    expect(screen.getByRole("status")).toHaveTextContent(/location access is off/i);

    cleanup();
    geo.status = "unavailable";
    renderMap("/map");
    expect(screen.getByRole("status")).toHaveTextContent(/can.t share your location/i);
  });

  it("clears the destination and selects areas with replacement navigation", async () => {
    const user = userEvent.setup();
    window.history.replaceState({}, "", "/map?to=food-court");
    render(
      <BrowserRouter>
        <Routes><Route path="/map" element={<><MapPage /><LocationSearch /></>} /></Routes>
      </BrowserRouter>,
    );
    const historyLength = window.history.length;

    await user.click(screen.getByRole("button", { name: /clear destination/i }));
    expect(screen.getByTestId("location-search")).toBeEmptyDOMElement();
    expect(window.history.length).toBe(historyLength);

    await user.click(screen.getByRole("button", { name: "Show East Road on map" }));
    expect(screen.getByTestId("location-search")).toHaveTextContent("?to=east-road");
    expect(window.history.length).toBe(historyLength);

    await user.click(screen.getByRole("button", { name: "mock select east road" }));
    expect(screen.getByTestId("location-search")).toHaveTextContent("?to=east-road");
  });
});

describe('nearby food', () => {
  it('offers location and a manual fallback without requesting location automatically', async () => {
    renderMap('/map?nearby=1');
    const nearby = screen.getByRole('region', { name: 'What’s around me?' });
    expect(geo.locate).not.toHaveBeenCalled();
    expect(within(nearby).getByRole('link', { name: /choose a food area/i })).toHaveAttribute('href', '#map-areas-title');
    await userEvent.setup().click(within(nearby).getByRole('button', { name: /find nearby food/i }));
    expect(geo.locate).toHaveBeenCalledOnce();
  });

  it('lists closest areas first with distances and links to their food', () => {
    geo.status = 'tracking';
    geo.position = { lat: 42.0905, lng: -72.616, accuracyMeters: 10 };
    renderMap('/map?nearby=1');
    const nearby = screen.getByRole('region', { name: 'What’s around me?' });
    const rows = within(nearby).getAllByRole('listitem');
    expect(rows).toHaveLength(3);
    expect(rows[0]).toHaveTextContent('Food Court');
    expect(rows[0]).toHaveTextContent('About 0 m');
    expect(within(rows[0]).getByRole('link', { name: /browse.*food court/i })).toHaveAttribute('href', '/browse?locations=food-court');
    expect(nearby).toHaveTextContent(/approximate/i);
  });

  it('does not call far-away fair food nearby', () => {
    geo.status = 'tracking';
    geo.position = { lat: 40.7, lng: -74, accuracyMeters: 10 };
    renderMap('/map');
    expect(screen.getByRole('region', { name: 'What’s around me?' })).toHaveTextContent(/away from the fairgrounds/i);
  });
});
