import catalogJson from "@/data/2026/catalog.json";
import collectionsJson from "@/data/2026/collections.json";
import locationsJson from "@/data/2026/locations.json";
import {
  catalogItemSchema,
  editorialCollectionSchema,
  fairLocationSchema,
  type CatalogItem,
  type EditorialCollection,
  type FairLocation,
} from "./schema";

export type { CatalogItem, EditorialCollection, FairLocation } from "./schema";

export interface CatalogData {
  items: CatalogItem[];
  locations: FairLocation[];
  collections: EditorialCollection[];
  itemsById: Map<string, CatalogItem>;
  locationsById: Map<string, FairLocation>;
  collectionsById: Map<string, EditorialCollection>;
}

export function loadCatalogData(raw: {
  items: unknown;
  locations: unknown;
  collections: unknown;
}): CatalogData {
  const items = catalogItemSchema.array().parse(raw.items);
  const locations = fairLocationSchema.array().parse(raw.locations);
  const collections = editorialCollectionSchema.array().parse(raw.collections);

  const itemsById = createIdMap(items, "catalog item");
  const locationsById = createIdMap(locations, "location");
  const collectionsById = createIdMap(collections, "collection");

  for (const item of items) {
    for (const locationId of item.locationIds) {
      if (!locationsById.has(locationId)) {
        throw new Error(`Catalog item "${item.id}" references unknown location "${locationId}".`);
      }
    }
  }

  for (const collection of collections) {
    for (const itemId of collection.itemIds) {
      if (!itemsById.has(itemId)) {
        throw new Error(`Collection "${collection.id}" references unknown catalog item "${itemId}".`);
      }
    }
  }

  return { items, locations, collections, itemsById, locationsById, collectionsById };
}

function createIdMap<T extends { id: string }>(records: T[], entityName: string): Map<string, T> {
  const recordsById = new Map<string, T>();

  for (const record of records) {
    if (recordsById.has(record.id)) {
      throw new Error(`Duplicate ${entityName} ID "${record.id}".`);
    }
    recordsById.set(record.id, record);
  }

  return recordsById;
}

export const catalogData = loadCatalogData({
  items: catalogJson,
  locations: locationsJson,
  collections: collectionsJson,
});

export const { items: catalogItems, locations, collections, itemsById, locationsById, collectionsById } = catalogData;
