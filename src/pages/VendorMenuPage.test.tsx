import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { expect, it } from "vitest";
import { AppRoutes } from "@/App";
import { FoodPlanProvider } from "@/features/plan/FoodPlanProvider";

it("opens a directly linked vendor menu with food and source details", () => {
  render(<MemoryRouter initialEntries={["/vendors/annas-fried-dough"]}><FoodPlanProvider><AppRoutes /></FoodPlanProvider></MemoryRouter>);
  expect(screen.getByRole("heading", { level: 1, name: /Anna’s Fried Dough/ })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Doughco" })).toBeInTheDocument();
  expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute("href", "https://bigeeats.com/vendors/annas-fried-dough");
});
