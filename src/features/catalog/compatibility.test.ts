import { describe, expect, it } from "vitest";
import { catalogData } from "./catalog";
import { loadPlan, decodeSharedItems } from "@/features/plan/planStore";
import { parseDiscoveryState } from "@/features/discovery/urlState";

const oldId = "big-e-cream-puff-bakery-peanut-butter-cream-puff";
const id = "big-e-bakery-peanut-butter-cream-puff";

describe("catalog consolidation compatibility", () => {
  it("retains saved and checked foods while merging duplicate IDs", () => {
    expect(loadPlan({ getItem: () => JSON.stringify({ itemIds: [oldId, id], checkedIds: [oldId] }) }))
      .toEqual({ itemIds: [id], checkedIds: [id] });
    expect(decodeSharedItems(`${oldId},${id}`, catalogData.itemsById)).toEqual({ itemIds: [id], missingIds: [] });
  });
  it("keeps old vendor and state-building browse links scoped", () => {
    const state = parseDiscoveryState(new URLSearchParams("vendors=moolicious&locations=state-buildings"));
    expect(state.vendorIds).toEqual(["moolicious-farm"]);
    expect(state.locationIds).toEqual(["avenue-of-states"]);
  });
});
