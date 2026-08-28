import type { CatalogItem, FairLocation } from "@/features/catalog/catalog";

export const PLAN_STORAGE_KEY = "big-e-food-plan:v1";

export interface PlanState {
  itemIds: string[];
  checkedIds: string[];
}

export interface PlanGroup {
  id: string;
  name: string;
  mapImage?: string;
  items: CatalogItem[];
}

export const EMPTY_PLAN: PlanState = { itemIds: [], checkedIds: [] };

export function loadPlan(storage: Pick<Storage, "getItem">): PlanState {
  try {
    const stored = storage.getItem(PLAN_STORAGE_KEY);
    if (!stored) {
      return createEmptyPlan();
    }

    const parsed: unknown = JSON.parse(stored);
    return isPlanState(parsed) ? normalizePlan(parsed) : createEmptyPlan();
  } catch {
    return createEmptyPlan();
  }
}

export function savePlan(storage: Pick<Storage, "setItem">, state: PlanState): void {
  try {
    storage.setItem(PLAN_STORAGE_KEY, JSON.stringify(normalizePlan(state)));
  } catch {
    // Persistence is optional: callers retain their in-memory plan state.
  }
}

export function encodeSharedItems(itemIds: string[]): string {
  return uniqueIds(itemIds).map(encodeURIComponent).join(",");
}

export function decodeSharedItems(
  raw: string,
  itemsById: Map<string, CatalogItem>,
): { itemIds: string[]; missingIds: string[] } {
  const itemIds: string[] = [];
  const missingIds: string[] = [];
  const seen = new Set<string>();

  for (const encodedId of raw.split(",")) {
    if (!encodedId) {
      continue;
    }

    const id = decodeId(encodedId);
    if (!id || seen.has(id)) {
      continue;
    }
    seen.add(id);

    if (itemsById.has(id)) {
      itemIds.push(id);
    } else {
      missingIds.push(id);
    }
  }

  return { itemIds, missingIds };
}

export function groupPlanItems(items: CatalogItem[], locations: FairLocation[]): PlanGroup[] {
  const locationsById = new Map(locations.map((location) => [location.id, location]));
  const knownGroups = new Map<string, CatalogItem[]>();
  const tbdItems: CatalogItem[] = [];

  for (const item of items) {
    const location = locationsById.get(item.locationIds[0]);
    if (!location) {
      tbdItems.push(item);
      continue;
    }

    const groupItems = knownGroups.get(location.id) ?? [];
    groupItems.push(item);
    knownGroups.set(location.id, groupItems);
  }

  const groups = [...knownGroups.entries()]
    .map(([id, groupItems]) => {
      const location = locationsById.get(id)!;
      return { id, name: location.name, mapImage: location.mapImage, items: groupItems };
    })
    .sort((first, second) => locationsById.get(first.id)!.order - locationsById.get(second.id)!.order);

  if (tbdItems.length > 0) {
    groups.push({ id: "tbd", name: "Location TBD", items: tbdItems });
  }

  return groups;
}

function isPlanState(value: unknown): value is PlanState {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as PlanState;
  return isIdList(candidate.itemIds) && isIdList(candidate.checkedIds);
}

function isIdList(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((id) => typeof id === "string");
}

function normalizePlan(state: PlanState): PlanState {
  const itemIds = uniqueIds(state.itemIds);
  const selectedIds = new Set(itemIds);

  return {
    itemIds,
    checkedIds: uniqueIds(state.checkedIds).filter((id) => selectedIds.has(id)),
  };
}

function uniqueIds(ids: string[]): string[] {
  const seen = new Set<string>();
  const unique: string[] = [];

  for (const id of ids) {
    if (typeof id !== "string" || !id || seen.has(id)) {
      continue;
    }
    seen.add(id);
    unique.push(id);
  }

  return unique;
}

function createEmptyPlan(): PlanState {
  return { itemIds: [], checkedIds: [] };
}

function decodeId(encodedId: string): string {
  try {
    return decodeURIComponent(encodedId);
  } catch {
    return encodedId;
  }
}
