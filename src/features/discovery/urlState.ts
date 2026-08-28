import { collections, locations } from "@/features/catalog/catalog";
import { CATEGORIES, DIETARY_CLAIMS, TAGS, type CategoryId, type DietaryClaim, type TagId } from "@/features/catalog/taxonomy";
import { EMPTY_DISCOVERY_STATE, type DiscoveryState, type SortMode } from "./types";

const categoryIds = CATEGORIES.map(([id]) => id);
const collectionIds = collections.map((collection) => collection.id);
const locationIds = locations.map((location) => location.id);
const sortModes = ["relevance", "name", "vendor", "location"] as const;

export function parseDiscoveryState(parameters: URLSearchParams): DiscoveryState {
  const query = parameters.get("q")?.trim() ?? "";
  const collectionId = readControlledValue(parameters, "collection", collectionIds);
  const sort = readControlledValue(parameters, "sort", sortModes);

  return {
    query,
    categoryIds: readControlledValues(parameters, "categories", categoryIds) as CategoryId[],
    tagIds: readControlledValues(parameters, "tags", TAGS) as TagId[],
    dietaryClaims: readControlledValues(parameters, "dietary", DIETARY_CLAIMS) as DietaryClaim[],
    locationIds: readControlledValues(parameters, "locations", [...locationIds, "tbd"]),
    ...(collectionId ? { collectionId } : {}),
    ...(sort ? { sort: sort as SortMode } : {}),
  };
}

export function serializeDiscoveryState(state: DiscoveryState): URLSearchParams {
  const parameters = new URLSearchParams();
  const query = state.query.trim();

  if (query) parameters.set("q", query);
  setList(parameters, "categories", state.categoryIds, categoryIds);
  setList(parameters, "tags", state.tagIds, TAGS);
  setList(parameters, "dietary", state.dietaryClaims, DIETARY_CLAIMS);
  setList(parameters, "locations", state.locationIds, [...locationIds, "tbd"]);
  if (state.collectionId && collectionIds.includes(state.collectionId)) parameters.set("collection", state.collectionId);
  if (state.sort && sortModes.includes(state.sort)) parameters.set("sort", state.sort);

  return parameters;
}

function readControlledValue<T extends string>(
  parameters: URLSearchParams,
  key: string,
  allowedValues: readonly T[],
): T | undefined {
  const value = parameters.get(key);
  return value && allowedValues.includes(value as T) ? value as T : undefined;
}

function readControlledValues<T extends string>(
  parameters: URLSearchParams,
  key: string,
  allowedValues: readonly T[],
): T[] {
  return unique(parameters.getAll(key)
    .flatMap((value) => value.split(","))
    .filter((value): value is T => allowedValues.includes(value as T)));
}

function setList<T extends string>(
  parameters: URLSearchParams,
  key: string,
  values: readonly string[],
  allowedValues: readonly T[],
): void {
  const supportedValues = unique(values.filter((value): value is T => allowedValues.includes(value as T)));
  if (supportedValues.length) parameters.set(key, supportedValues.join(","));
}

function unique<T>(values: readonly T[]): T[] {
  return [...new Set(values)];
}

export { EMPTY_DISCOVERY_STATE };
