import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { itemsById, locationsById } from "@/features/catalog/catalog";
import { ItemCard } from "./ItemCard";

afterEach(cleanup);

const item = itemsById.get("wave-caramel-apple-mocktail")!;

function renderCard(overrides: Partial<Parameters<typeof ItemCard>[0]> = {}) {
  return render(
    <MemoryRouter>
      <ItemCard item={item} locationsById={locationsById} isInPlan={false} onAdd={vi.fn()} onRemove={vi.fn()} {...overrides} />
    </MemoryRouter>,
  );
}

describe("ItemCard", () => {
  it("shows only compact content until expanded", () => {
    renderCard();

    expect(screen.getByRole("heading", { name: item.name })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: `See everything from ${item.vendor}` })).toHaveAttribute("href", expect.stringContaining("/browse?vendors="));
    expect(screen.queryByText(/2026 listing|new for 2026/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /new foods/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/confirm dietary needs/i)).not.toBeInTheDocument();
  });

  it("expands in place to reveal tags, source, and disclaimer", async () => {
    const user = userEvent.setup();
    renderCard();

    const trigger = screen.getByRole("button", { name: `More about ${item.name}` });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: /the big e: new foods/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /apple/i })).toHaveAttribute("href", expect.stringContaining("tags=apple"));
  });

  it("shows a compact source-reported badge for dietary claims", () => {
    const gfItem = [...itemsById.values()].find((entry) => entry.dietaryClaims.includes("gluten-free"))!;
    render(
      <MemoryRouter>
        <ItemCard item={gfItem} locationsById={locationsById} isInPlan={false} onAdd={vi.fn()} onRemove={vi.fn()} />
      </MemoryRouter>,
    );

    expect(screen.getByText("Gluten Free · source-reported")).toBeInTheDocument();
    expect(screen.queryByText(/confirm dietary needs/i)).not.toBeInTheDocument();
  });

  it("does not render a description paragraph when the item has none, but still expands tags and source", async () => {
    expect(item.description).toBeUndefined();
    const user = userEvent.setup();
    renderCard();

    await user.click(screen.getByRole("button", { name: `More about ${item.name}` }));

    expect(screen.getByRole("link", { name: /the big e: new foods/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /apple/i })).toBeInTheDocument();
  });

  it("renders the real description when the item has one, and the dietary disclaimer only when claims exist", async () => {
    const describedItem = [...itemsById.values()].find((entry) => typeof entry.description === "string" && entry.description.length > 0)!;
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <ItemCard item={describedItem} locationsById={locationsById} isInPlan={false} onAdd={vi.fn()} onRemove={vi.fn()} />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: `More about ${describedItem.name}` }));

    expect(screen.getByText(describedItem.description!)).toBeInTheDocument();
    if (describedItem.dietaryClaims.length > 0) {
      expect(screen.getByText(/confirm dietary needs and preparation details with the vendor/i)).toBeInTheDocument();
    } else {
      expect(screen.queryByText(/confirm dietary needs and preparation details with the vendor/i)).not.toBeInTheDocument();
    }
  });

  it("gives the expand trigger and all category/tag chip links 44px tap targets", async () => {
    const user = userEvent.setup();
    renderCard();

    const expandTrigger = screen.getByRole("button", { name: `More about ${item.name}` });
    expect(expandTrigger).toHaveClass("min-h-11");

    await user.click(expandTrigger);

    // Collect all chip and source links (filter by href pattern)
    const allLinks = screen.getAllByRole("link");
    const chipAndSourceLinks = allLinks.filter((link) => {
      const href = link.getAttribute("href") || "";
      return href.includes("?tags=") || href.includes("?categories=") || href.includes("thebige.com");
    });

    // Assert all chip and source links have min-h-11
    chipAndSourceLinks.forEach((link) => {
      expect(link).toHaveClass("min-h-11");
    });
  });
});
