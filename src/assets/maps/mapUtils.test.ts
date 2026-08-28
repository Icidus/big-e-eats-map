import { describe, expect, it } from "vitest";
import { getLocationMap, getPlaceholderMapImage } from "./mapUtils";

describe("location map manifest", () => {
  it("resolves a catalog map through the eager manifest", () => {
    const map = getLocationMap("the-front-porch.png");

    expect(map.isAvailable).toBe(true);
    expect(map.src).toMatch(/the-front-porch.*\.png/);
  });

  it("uses a base-aware placeholder when no catalog map resolves", () => {
    const baseUrl = "/big-e-eats-map/";

    expect(getPlaceholderMapImage(baseUrl)).toBe("/big-e-eats-map/placeholder.svg");
    expect(getLocationMap("missing-map.png", baseUrl)).toEqual({
      src: "/big-e-eats-map/placeholder.svg",
      isAvailable: false,
    });
    expect(getLocationMap(undefined, baseUrl)).toEqual({
      src: "/big-e-eats-map/placeholder.svg",
      isAvailable: false,
    });
  });
});
