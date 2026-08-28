import MiniSearch from "minisearch";
import { vendorIdForName, type CatalogItem, type EditorialCollection, type FairLocation } from "@/features/catalog/catalog";
import { CATEGORIES, TAGS } from "@/features/catalog/taxonomy";
import type { DiscoveryState, SortMode } from "./types";

export interface DiscoveryContext {
  locations: FairLocation[];
  collectionsById: Map<string, EditorialCollection>;
}

interface SearchDocument {
  id: string;
  name: string;
  vendor: string;
  taxonomy: string;
  locations: string;
  description: string;
}

const categoryLabels = new Map(CATEGORIES);

export function searchAndFilter(
  items: CatalogItem[],
  state: DiscoveryState,
  context: DiscoveryContext,
): CatalogItem[] {
  const query = normalizeSearchText(state.query);
  const sortMode = state.sort === "relevance" && !query ? "name" : state.sort;
  const catalogItems = uniqueCatalogItems(items);
  const itemsById = new Map(catalogItems.map((item) => [item.id, item]));
  const collection = state.collectionId ? context.collectionsById.get(state.collectionId) : undefined;
  const collectionItems = collection
    ? collection.itemIds.map((itemId) => itemsById.get(itemId)).filter(isCatalogItem)
    : catalogItems;
  const relevance = query ? searchItems(catalogItems, query, context) : new Map<string, number>();
  const textMatches = query
    ? Array.from(relevance, ([itemId, score]) => ({ item: itemsById.get(itemId), score })).filter(isScoredItem)
    : collectionItems.map((item) => ({ item, score: 0 }));

  const filtered = deduplicateById(textMatches)
    .filter(({ item }) => !collection || collection.itemIds.includes(item.id))
    .filter(({ item }) => matchesFacets(item, state));

  if (sortMode === "relevance" || (!sortMode && query)) {
    return filtered.sort((left, right) => right.score - left.score || compareNames(left.item, right.item)).map(({ item }) => item);
  }

  const resultItems = filtered.map(({ item }) => item);
  if (sortMode) {
    return sortItems(resultItems, sortMode, context);
  }

  if (collection) {
    return resultItems;
  }

  return sortItems(resultItems, "name", context);
}

export function sortItems(items: CatalogItem[], mode: SortMode, context: DiscoveryContext): CatalogItem[] {
  const copy = [...items];

  if (mode === "relevance") {
    return copy;
  }

  if (mode === "name") {
    return copy.sort(compareNames);
  }

  if (mode === "vendor") {
    return copy.sort((left, right) => compareText(left.vendor, right.vendor) || compareNames(left, right));
  }

  const locationsById = new Map(context.locations.map((location) => [location.id, location]));
  return copy.sort((left, right) => {
    const orderDifference = firstLocationOrder(left, locationsById) - firstLocationOrder(right, locationsById);
    return orderDifference || compareNames(left, right);
  });
}

function searchItems(items: CatalogItem[], query: string, context: DiscoveryContext): Map<string, number> {
  const locationsById = new Map(context.locations.map((location) => [location.id, location]));
  const index = new MiniSearch<SearchDocument>({
    fields: ["name", "vendor", "taxonomy", "locations", "description"],
    storeFields: ["id"],
    tokenize: (value) => normalizeSearchText(value).split(/\s+/).filter(Boolean),
    processTerm: normalizeSearchText,
  });

  index.addAll(items.map((item) => createSearchDocument(item, locationsById)));

  return new Map(index.search(query, {
    boost: { name: 12, vendor: 7, taxonomy: 5, locations: 3, description: 1 },
    prefix: true,
    fuzzy: query.length >= 4 ? 0.2 : false,
    combineWith: "AND",
  }).map((result) => [String(result.id), result.score]));
}

function createSearchDocument(item: CatalogItem, locationsById: Map<string, FairLocation>): SearchDocument {
  return {
    id: item.id,
    name: item.name,
    vendor: item.vendor,
    taxonomy: [
      ...item.categoryIds.map((categoryId) => categoryLabels.get(categoryId) ?? categoryId),
      ...item.tagIds.map((tagId) => TAGS.includes(tagId) ? tagId : ""),
    ].join(" "),
    locations: item.locationIds.map((locationId) => locationsById.get(locationId)?.name ?? "").join(" "),
    description: item.description,
  };
}

function matchesFacets(item: CatalogItem, state: DiscoveryState): boolean {
  return (!state.categoryIds.length || state.categoryIds.some((id) => item.categoryIds.includes(id)))
    && (!state.tagIds.length || state.tagIds.some((id) => item.tagIds.includes(id)))
    && (!state.dietaryClaims.length || state.dietaryClaims.some((claim) => item.dietaryClaims.includes(claim)))
    && (!state.locationIds.length || matchesLocations(item, state.locationIds))
    && (!state.vendorIds.length || state.vendorIds.includes(vendorIdForName(item.vendor)));
}

function matchesLocations(item: CatalogItem, locationIds: string[]): boolean {
  return locationIds.some((locationId) => locationId === "tbd"
    ? item.locationIds.length === 0
    : item.locationIds.includes(locationId));
}

function deduplicateById(items: Array<{ item: CatalogItem; score: number }>): Array<{ item: CatalogItem; score: number }> {
  const seenIds = new Set<string>();
  return items.filter(({ item }) => {
    if (seenIds.has(item.id)) return false;
    seenIds.add(item.id);
    return true;
  });
}

function uniqueCatalogItems(items: CatalogItem[]): CatalogItem[] {
  const seenIds = new Set<string>();
  return items.filter((item) => {
    if (seenIds.has(item.id)) return false;
    seenIds.add(item.id);
    return true;
  });
}

function firstLocationOrder(item: CatalogItem, locationsById: Map<string, FairLocation>): number {
  return locationsById.get(item.locationIds[0] ?? "")?.order ?? Number.POSITIVE_INFINITY;
}

function compareNames(left: CatalogItem, right: CatalogItem): number {
  return compareText(left.name, right.name) || left.id.localeCompare(right.id);
}

function compareText(left: string, right: string): number {
  return left.localeCompare(right, undefined, { sensitivity: "base" });
}

function isCatalogItem(item: CatalogItem | undefined): item is CatalogItem {
  return item !== undefined;
}

function isScoredItem(entry: { item: CatalogItem | undefined; score: number }): entry is { item: CatalogItem; score: number } {
  return entry.item !== undefined;
}

export function normalizeSearchText(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase()
    .replace(/[\u2018\u2019\u201a\u201b\u2032]/g, "'")
    .replace(/'/g, "")
    .replace(/[\u2010-\u2015-]+/g, " ")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}
