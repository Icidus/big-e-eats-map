import { cleanup, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import type { CatalogItem } from "@/features/catalog/catalog";
import { ItemCard } from "./ItemCard";

afterEach(cleanup);

const item: CatalogItem = {
  id: "test-treat",
  year: 2026,
  name: "Test Treat",
  vendor: "The Test Kitchen",
  locationIds: [],
  description: "A focused fixture for location honesty.",
  categoryIds: ["desserts"],
  tagIds: ["sweet"],
  dietaryClaims: [],
  isNewFor2026: true,
  source: { publisher: "The Big E", title: "New foods", url: "https://example.com/source", accessedOn: "2026-08-27" },
};

describe("ItemCard", () => {
  it("states when a location is not yet announced without inventing a location link", () => {
    render(
      <MemoryRouter>
        <ItemCard item={item} locationsById={new Map()} isInPlan={false} onAdd={() => undefined} onRemove={() => undefined} />
      </MemoryRouter>,
    );

    expect(screen.getByText("Location not yet announced")).toBeInTheDocument();
    expect(within(screen.getByRole("region", { name: "Item location" })).queryByRole("link")).not.toBeInTheDocument();
  });

  it("labels new records as New for 2026", () => {
    render(
      <MemoryRouter><ItemCard item={item} locationsById={new Map()} isInPlan={false} onAdd={() => undefined} onRemove={() => undefined} /></MemoryRouter>,
    );

    expect(screen.getByText("New for 2026")).toBeInTheDocument();
  });

  it("uses a neutral label for 2026 records that are not new", () => {
    render(
      <MemoryRouter><ItemCard item={{ ...item, isNewFor2026: false }} locationsById={new Map()} isInPlan={false} onAdd={() => undefined} onRemove={() => undefined} /></MemoryRouter>,
    );

    expect(screen.getByText("2026 listing")).toBeInTheDocument();
    expect(screen.queryByText("New for 2026")).not.toBeInTheDocument();
  });

  it("separates source-reported dietary claims from editorial tags", () => {
    render(
      <MemoryRouter><ItemCard item={{ ...item, dietaryClaims: ["gluten-free"] }} locationsById={new Map()} isInPlan={false} onAdd={() => undefined} onRemove={() => undefined} /></MemoryRouter>,
    );

    const tags = screen.getByRole("region", { name: "Item tags" });
    const claims = screen.getByRole("region", { name: "Source-reported dietary claims" });
    expect(within(tags).queryByText("gluten-free")).not.toBeInTheDocument();
    expect(within(claims).getByText("Gluten Free")).toBeInTheDocument();
    expect(within(claims).getByText(/confirm dietary needs and preparation details with the vendor/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /the big e: new foods/i })).toHaveAttribute("href", item.source.url);
  });

  it("omits the dietary-claim disclosure when the source reports no claim", () => {
    render(
      <MemoryRouter><ItemCard item={item} locationsById={new Map()} isInPlan={false} onAdd={() => undefined} onRemove={() => undefined} /></MemoryRouter>,
    );

    expect(screen.queryByRole("region", { name: "Source-reported dietary claims" })).not.toBeInTheDocument();
  });

  it("gives location and source links 44px effective touch targets", () => {
    const knownLocation = { id: "test-kitchen", name: "Test Kitchen", description: "Test", order: 1 };
    render(
      <MemoryRouter><ItemCard item={{ ...item, locationIds: [knownLocation.id] }} locationsById={new Map([[knownLocation.id, knownLocation]])} isInPlan={false} onAdd={() => undefined} onRemove={() => undefined} /></MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: "Test Kitchen" })).toHaveClass("min-h-11");
    expect(screen.getByRole("link", { name: /the big e: new foods/i })).toHaveClass("min-h-11");
  });
});
