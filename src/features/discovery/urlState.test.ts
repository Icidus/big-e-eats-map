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
    });

    expect(serialized.toString()).toBe("categories=cocktails");
    expect(parseDiscoveryState(new URLSearchParams("categories=cocktails,bogus,cocktails&locations=tbd,missing,tbd")))
      .toEqual({ ...EMPTY_DISCOVERY_STATE, categoryIds: ["cocktails"], locationIds: ["tbd"] });
  });
});
