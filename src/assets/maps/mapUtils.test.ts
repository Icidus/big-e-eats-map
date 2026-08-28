import { describe, expect, it } from "vitest";
import { getPlaceholderMapImage, getUnavailableLocationMap } from "./mapUtils";

describe("unavailable location maps", () => {
  it("uses a base-aware generic placeholder without claiming a real map", () => {
    const baseUrl = "/big-e-eats-map/";

    expect(getPlaceholderMapImage(baseUrl)).toBe("/big-e-eats-map/placeholder.svg");
    expect(getUnavailableLocationMap(baseUrl)).toEqual({
      src: "/big-e-eats-map/placeholder.svg",
      isAvailable: false,
    });
  });
});
