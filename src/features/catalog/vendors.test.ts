import { expect, it } from "vitest";
import profiles from "@/data/2026/vendor-links.json";
import { vendorNamesById, vendorIdForName, catalogItems } from "./catalog";
import { vendorDirectory } from "./vendors";

it("links verified profiles to existing vendors using safe, unique external URLs", () => {
  expect(new Set(profiles.map((profile) => profile.name)).size).toBe(profiles.length);
  for (const profile of profiles) {
    expect(vendorNamesById.get(vendorIdForName(profile.name))).toBe(profile.name);
    expect(new Set(profile.links.map((link) => link.url)).size).toBe(profile.links.length);
    for (const link of profile.links) {
      expect(new URL(link.url).protocol).toBe("https:");
      expect(["Instagram", "Facebook", "Website"]).toContain(link.label);
    }
  }
  expect(vendorDirectory.flatMap((vendor) => vendor.items)).toHaveLength(catalogItems.length);
});
