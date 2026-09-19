import profiles from "@/data/2026/vendor-links.json";
import { catalogItems, vendorOptions, vendorIdForName } from "./catalog";

export const vendorLinksById = new Map(profiles.map((profile) => [vendorIdForName(profile.name), profile.links]));

export const vendorDirectory = vendorOptions.map((vendor) => {
  const items = catalogItems.filter((item) => item.vendor === vendor.name);
  return { ...vendor, items, locationIds: [...new Set(items.flatMap((item) => item.locationIds))] };
});
