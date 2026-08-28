import { describe, expect, it } from "vitest";
import { EMPTY_DISCOVERY_STATE, type DiscoveryState } from "./types";
import { parseDiscoveryState, serializeDiscoveryState } from "./urlState";

describe("discovery URL state", () => {
  it("round-trips multiselect facets and sort", () => {
    const state = {
      query: "hot honey",
      categoryIds: ["desserts", "cocktails"],
      tagIds: ["spicy"],
      dietaryClaims: ["gluten-free"],
      locationIds: ["the-front-porch", "tbd"],
      vendorIds: ["w-a-v-e-mocktail-bar"],
      collectionId: "fall-flavors",
      sort: "vendor",
    } satisfies DiscoveryState;

    expect(parseDiscoveryState(serializeDiscoveryState(state))).toEqual(state);
  });

  it("drops unknown values and does not manufacture a default sort", () => {
    expect(parseDiscoveryState(new URLSearchParams(
      "categories=bogus&tags=unknown&dietary=none&locations=nowhere&collection=missing&sort=bogus",
    ))).toEqual(EMPTY_DISCOVERY_STATE);
  });

  it("keeps only supported nonempty values in a stable representation", () => {
    const serialized = serializeDiscoveryState({
      query: "",
      categoryIds: ["cocktails"],
      tagIds: [],
      dietaryClaims: [],
      locationIds: [],
      vendorIds: [],
    });

    expect(serialized.toString()).toBe("categories=cocktails");
    expect(parseDiscoveryState(new URLSearchParams("categories=cocktails,bogus,cocktails&locations=tbd,missing,tbd")))
      .toEqual({ ...EMPTY_DISCOVERY_STATE, categoryIds: ["cocktails"], locationIds: ["tbd"] });
  });

  it("preserves meaningful in-progress query spaces and normalizes whitespace-only input", () => {
    expect(parseDiscoveryState(new URLSearchParams("q=hot+honey")).query).toBe("hot honey");
    expect(parseDiscoveryState(new URLSearchParams("q=hot+")).query).toBe("hot ");
    expect(serializeDiscoveryState({ ...EMPTY_DISCOVERY_STATE, query: "hot " }).get("q")).toBe("hot ");
    expect(parseDiscoveryState(new URLSearchParams("q=+++"))).toEqual(EMPTY_DISCOVERY_STATE);
    expect(serializeDiscoveryState({ ...EMPTY_DISCOVERY_STATE, query: "   " }).has("q")).toBe(false);
  });

  it("drops unknown vendor IDs while round-tripping controlled vendors", () => {
    expect(parseDiscoveryState(new URLSearchParams("vendors=w-a-v-e-mocktail-bar,missing")))
      .toEqual({ ...EMPTY_DISCOVERY_STATE, vendorIds: ["w-a-v-e-mocktail-bar"] });
    expect(serializeDiscoveryState({ ...EMPTY_DISCOVERY_STATE, vendorIds: ["w-a-v-e-mocktail-bar"] }).toString())
      .toBe("vendors=w-a-v-e-mocktail-bar");
  });
});
