import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import type { FairMapProps } from "@/features/map/FairMap";
import { FoodPlanProvider } from "@/features/plan/FoodPlanProvider";
import LocationDetail, { LocationMapPanel } from "./LocationDetail";

vi.mock("@/features/map/FairMap", () => ({
  FairMap: (props: FairMapProps) => <div data-testid="fair-map" data-destination={props.destination?.id ?? ""} data-locations={props.locations.map((location) => location.id).join(",")} />,
}));

afterEach(cleanup);

function renderLocation(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <FoodPlanProvider>
        <Routes><Route path="/location/:id" element={<LocationDetail />} /></Routes>
      </FoodPlanProvider>
    </MemoryRouter>,
  );
}

describe("LocationDetail", () => {
  it("renders only confirmed catalog items for a location", () => {
    renderLocation("/location/the-front-porch");

    expect(screen.getByRole("heading", { name: "The Front Porch" })).toBeInTheDocument();
    expect(screen.getByText("Caramel Apple Mocktail")).toBeInTheDocument();
    expect(screen.queryByText(/MassLive Pick/i)).not.toBeInTheDocument();
  });

  it.each(["new-england-avenue", "better-living-center", "hampden-avenue", "avenue-of-states"])("shows a multi-location item exactly once at %s", (locationId) => {
    renderLocation(`/location/${locationId}`);

    expect(screen.getAllByText("Peanut Butter Cream Puff")).toHaveLength(1);
  });

  it("does not carry unrelated confirmed items into a location", () => {
    renderLocation("/location/the-front-porch");

    expect(screen.queryByText("Tater Tot Buckets")).not.toBeInTheDocument();
  });

  it("adds and removes a location item from the food plan", async () => {
    const user = userEvent.setup();
    renderLocation("/location/the-front-porch");

    await user.click(screen.getByRole("button", { name: /add caramel apple mocktail to plan/i }));
    expect(screen.getByRole("button", { name: /remove caramel apple mocktail from plan/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /remove caramel apple mocktail from plan/i }));
    expect(screen.getByRole("button", { name: /add caramel apple mocktail to plan/i })).toBeInTheDocument();
  });

  it("shows an honest zero-item location state", () => {
    renderLocation("/location/new-england-center");

    expect(screen.getByText(/no 2026 additions are currently confirmed here/i)).toBeInTheDocument();
  });

  it("shows a useful not-found state for an unknown location", () => {
    renderLocation("/location/not-real");

    expect(screen.getByRole("heading", { name: /location not found/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /back to 2026 food guide/i })).toHaveAttribute("href", "/");
  });

  it("shows the real map with the location selected and a directions link", () => {
    renderLocation("/location/the-front-porch");

    const panel = screen.getByRole("complementary", { name: /location map/i });
    expect(within(panel).getByTestId("fair-map")).toHaveAttribute("data-destination", "the-front-porch");
    expect(within(panel).getByText("Approximate")).toBeInTheDocument();
    expect(within(panel).getByRole("link", { name: /walking directions/i })).toHaveAttribute("href", expect.stringContaining("destination=42.0916,-72.619"));
    expect(within(panel).getByRole("link", { name: /open full map/i })).toHaveAttribute("href", "/map?to=the-front-porch");
    expect(screen.queryByText(/map is not currently available/i)).not.toBeInTheDocument();
  });

  it("stays honest for a location without coordinates", () => {
    render(
      <MemoryRouter>
        <LocationMapPanel location={{ id: "mystery", name: "Mystery Corner", description: "Test", order: 99 }} itemCount={0} />
      </MemoryRouter>,
    );

    expect(screen.getByText(/not yet placed on the map/i)).toBeInTheDocument();
    expect(screen.queryByTestId("fair-map")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /open full map/i })).toHaveAttribute("href", "/map");
  });
});
