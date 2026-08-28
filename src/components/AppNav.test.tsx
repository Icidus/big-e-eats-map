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
