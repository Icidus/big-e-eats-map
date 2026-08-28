import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import type { CatalogItem } from "@/features/catalog/catalog";
import { ItemCard } from "./ItemCard";

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
    expect(screen.queryByRole("link", { name: /location/i })).not.toBeInTheDocument();
  });
});
