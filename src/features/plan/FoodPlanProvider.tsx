import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { loadPlan, savePlan, type PlanState } from "./planStore";

export interface FoodPlanContextValue extends PlanState {
  addItem(id: string): void;
  removeItem(id: string): void;
  toggleChecked(id: string): void;
  replaceItems(ids: string[]): void;
  mergeItems(ids: string[]): void;
  hasItem(id: string): boolean;
}

const FoodPlanContext = createContext<FoodPlanContextValue | undefined>(undefined);

export function FoodPlanProvider({ children }: { children: ReactNode }) {
  const [plan, setPlan] = useState<PlanState>(() => {
    const storage = getBrowserStorage();
    return storage ? loadPlan(storage) : createEmptyPlan();
  });
  const isInitialPersistence = useRef(true);

  useEffect(() => {
    if (isInitialPersistence.current) {
      isInitialPersistence.current = false;
      return;
    }

    const storage = getBrowserStorage();
    if (storage) {
      savePlan(storage, plan);
    }
  }, [plan]);

  const addItem = useCallback((id: string) => {
    if (!id) {
      return;
    }

    setPlan((current) => current.itemIds.includes(id)
      ? current
      : { itemIds: [...current.itemIds, id], checkedIds: [...current.checkedIds] });
  }, []);

  const removeItem = useCallback((id: string) => {
    setPlan((current) => {
      if (!current.itemIds.includes(id)) {
        return current;
      }

      return {
        itemIds: current.itemIds.filter((itemId) => itemId !== id),
        checkedIds: current.checkedIds.filter((itemId) => itemId !== id),
      };
    });
  }, []);

  const toggleChecked = useCallback((id: string) => {
    setPlan((current) => {
      if (!current.itemIds.includes(id)) {
        return current;
      }

      const checkedIds = current.checkedIds.includes(id)
        ? current.checkedIds.filter((itemId) => itemId !== id)
        : [...current.checkedIds, id];
      return { itemIds: [...current.itemIds], checkedIds };
    });
  }, []);

  const replaceItems = useCallback((ids: string[]) => {
    setPlan((current) => {
      const itemIds = uniqueIds(ids);
      const selectedIds = new Set(itemIds);
      return {
        itemIds,
        checkedIds: current.checkedIds.filter((id) => selectedIds.has(id)),
      };
    });
  }, []);

  const mergeItems = useCallback((ids: string[]) => {
    setPlan((current) => ({
      itemIds: uniqueIds([...current.itemIds, ...ids]),
      checkedIds: [...current.checkedIds],
    }));
  }, []);

  const hasItem = useCallback((id: string) => plan.itemIds.includes(id), [plan.itemIds]);

  const value = useMemo<FoodPlanContextValue>(() => ({
    ...plan,
    addItem,
    removeItem,
    toggleChecked,
    replaceItems,
    mergeItems,
    hasItem,
  }), [addItem, hasItem, mergeItems, plan, removeItem, replaceItems, toggleChecked]);

  return <FoodPlanContext.Provider value={value}>{children}</FoodPlanContext.Provider>;
}

export function useFoodPlan(): FoodPlanContextValue {
  const context = useContext(FoodPlanContext);
  if (!context) {
    throw new Error("useFoodPlan must be used within a FoodPlanProvider.");
  }
  return context;
}

function getBrowserStorage(): Pick<Storage, "getItem" | "setItem"> | undefined {
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

function uniqueIds(ids: string[]): string[] {
  const seen = new Set<string>();
  const unique: string[] = [];

  for (const id of ids) {
    if (typeof id === "string" && id.length > 0 && !seen.has(id)) {
      seen.add(id);
      unique.push(id);
    }
  }

  return unique;
}

function createEmptyPlan(): PlanState {
  return { itemIds: [], checkedIds: [] };
}
