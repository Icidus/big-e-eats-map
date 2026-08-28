import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { MemoryRouter, useLocation, useNavigate } from "react-router-dom";
import { FoodPlanProvider } from "@/features/plan/FoodPlanProvider";
import { AppRoutes } from "./App";

afterEach(cleanup);

function RouteLocation() {
  const location = useLocation();
  return <output data-testid="route-location">{`${location.pathname}${location.search}`}</output>;
}

function BackButton() {
  const navigate = useNavigate();
  return <button type="button" onClick={() => navigate(-1)}>Back</button>;
}

function renderRoutes(path: string, initialEntries = [path]) {
  return render(
    <MemoryRouter initialEntries={initialEntries} initialIndex={initialEntries.length - 1}>
      <FoodPlanProvider>
        <AppRoutes />
        <RouteLocation />
        <BackButton />
      </FoodPlanProvider>
    </MemoryRouter>,
  );
}

describe("legacy public routes", () => {
  it("replaces drinks with the 2026 drink-category browse route", async () => {
    const user = userEvent.setup();
    renderRoutes("/drinks", ["/browse", "/drinks"]);

    expect(screen.getByTestId("route-location")).toHaveTextContent(/^\/browse\?categories=cocktails,mocktails,beer-cider,nonalcoholic-drinks$/);

    await user.click(screen.getByRole("button", { name: "Back" }));
    expect(screen.getByTestId("route-location")).toHaveTextContent(/^\/browse$/);
  });

  it("replaces MassLive favorites with the 2026 guide home", async () => {
    const user = userEvent.setup();
    renderRoutes("/masslive-favorites", ["/browse", "/masslive-favorites"]);

    expect(screen.getByTestId("route-location")).toHaveTextContent(/^\/$/);
    expect(screen.queryByText(/MassLive Favorites/i)).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Back" }));
    expect(screen.getByTestId("route-location")).toHaveTextContent(/^\/browse$/);
  });
});
