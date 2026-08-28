import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { FoodPlanProvider } from "@/features/plan/FoodPlanProvider";
import LocationDetail from "./LocationDetail";

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

  it("shows a multi-location item at each confirmed stop", () => {
    renderLocation("/location/new-england-avenue");

    expect(screen.getByText("Peanut Butter Cream Puff")).toBeInTheDocument();
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
});
