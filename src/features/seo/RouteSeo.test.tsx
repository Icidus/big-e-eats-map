import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { Link, MemoryRouter } from "react-router-dom";
import { RouteSeo } from "./RouteSeo";

afterEach(cleanup);
it("updates metadata on navigation without duplicate canonicals or stale noindex", () => {
  render(<MemoryRouter initialEntries={["/browse?q=chicken"]}><RouteSeo /><Link to="/vendors/annas-fried-dough">Anna</Link><Link to="/">Home</Link></MemoryRouter>);
  expect(document.querySelector('meta[name="robots"]')).toHaveAttribute("content", "noindex, follow");
  fireEvent.click(screen.getByText("Anna"));
  expect(document.title).toContain("Anna’s Fried Dough");
  expect(document.querySelector('meta[name="robots"]')).toHaveAttribute("content", "index, follow");
  expect(document.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
  fireEvent.click(screen.getByText("Home"));
  expect(document.title).toContain("Food Guide");
  expect(document.querySelectorAll('script[type="application/ld+json"]')).toHaveLength(1);
});
