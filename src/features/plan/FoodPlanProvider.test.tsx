import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PLAN_STORAGE_KEY } from "./planStore";
import { FoodPlanProvider, useFoodPlan } from "./FoodPlanProvider";

class MemoryStorage implements Pick<Storage, "getItem" | "setItem"> {
  private values = new Map<string, string>();
  throwOnRead = false;
  throwOnWrite = false;

  constructor(initial: Record<string, string> = {}) {
    Object.entries(initial).forEach(([key, value]) => this.values.set(key, value));
  }

  getItem(key: string) {
    if (this.throwOnRead) {
      throw new Error("blocked read");
    }
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    if (this.throwOnWrite) {
      throw new Error("blocked write");
    }
    this.values.set(key, value);
  }
}

function PlanConsumer() {
  const plan = useFoodPlan();

  return (
    <>
      <output data-testid="item-ids">{plan.itemIds.join(",")}</output>
      <output data-testid="checked-ids">{plan.checkedIds.join(",")}</output>
      <output data-testid="has-a">{String(plan.hasItem("a"))}</output>
      <button onClick={() => plan.addItem("a")}>add a</button>
      <button onClick={() => plan.addItem("b")}>add b</button>
      <button onClick={() => plan.removeItem("a")}>remove a</button>
      <button onClick={() => plan.toggleChecked("a")}>toggle a</button>
      <button onClick={() => plan.toggleChecked("missing")}>toggle missing</button>
      <button onClick={() => plan.replaceItems(["b", "a", "b"])}>replace</button>
      <button onClick={() => plan.mergeItems(["a", "c", "a"])}>merge</button>
    </>
  );
}

function renderPlan(storage: MemoryStorage) {
  vi.stubGlobal("localStorage", storage);
  return render(
    <FoodPlanProvider>
      <PlanConsumer />
    </FoodPlanProvider>,
  );
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("FoodPlanProvider", () => {
  it("loads once and updates actions while persisting normalized plan state", () => {
    const storage = new MemoryStorage({
      [PLAN_STORAGE_KEY]: JSON.stringify({ itemIds: ["a"], checkedIds: ["a"] }),
    });
    renderPlan(storage);

    expect(screen.getByTestId("item-ids")).toHaveTextContent("a");
    expect(screen.getByTestId("checked-ids")).toHaveTextContent("a");
    expect(screen.getByTestId("has-a")).toHaveTextContent("true");
    expect(JSON.parse(storage.getItem(PLAN_STORAGE_KEY)!)).toEqual({ itemIds: ["a"], checkedIds: ["a"] });

    fireEvent.click(screen.getByRole("button", { name: "add a" }));
    fireEvent.click(screen.getByRole("button", { name: "add b" }));
    fireEvent.click(screen.getByRole("button", { name: "toggle a" }));

    expect(screen.getByTestId("item-ids")).toHaveTextContent("a,b");
    expect(screen.getByTestId("checked-ids")).toBeEmptyDOMElement();
    expect(JSON.parse(storage.getItem(PLAN_STORAGE_KEY)!)).toEqual({ itemIds: ["a", "b"], checkedIds: [] });
  });

  it("removes associated checks and ignores check toggles for unselected IDs", () => {
    const storage = new MemoryStorage({
      [PLAN_STORAGE_KEY]: JSON.stringify({ itemIds: ["a"], checkedIds: ["a"] }),
    });
    renderPlan(storage);

    fireEvent.click(screen.getByRole("button", { name: "remove a" }));
    fireEvent.click(screen.getByRole("button", { name: "toggle missing" }));

    expect(screen.getByTestId("item-ids")).toBeEmptyDOMElement();
    expect(screen.getByTestId("checked-ids")).toBeEmptyDOMElement();
    expect(screen.getByTestId("has-a")).toHaveTextContent("false");
  });

  it("replaces selected IDs and merges new IDs in first-selection order", () => {
    const storage = new MemoryStorage({
      [PLAN_STORAGE_KEY]: JSON.stringify({ itemIds: ["a"], checkedIds: ["a"] }),
    });
    renderPlan(storage);

    fireEvent.click(screen.getByRole("button", { name: "replace" }));
    expect(screen.getByTestId("item-ids")).toHaveTextContent("b,a");
    expect(screen.getByTestId("checked-ids")).toHaveTextContent("a");

    fireEvent.click(screen.getByRole("button", { name: "merge" }));
    expect(screen.getByTestId("item-ids")).toHaveTextContent("b,a,c");
    expect(screen.getByTestId("checked-ids")).toHaveTextContent("a");
  });

  it("continues updating state when local storage reads or writes throw", () => {
    const storage = new MemoryStorage();
    storage.throwOnRead = true;
    storage.throwOnWrite = true;
    renderPlan(storage);

    fireEvent.click(screen.getByRole("button", { name: "add a" }));

    expect(screen.getByTestId("item-ids")).toHaveTextContent("a");
  });

  it("explains when the plan hook is used outside its provider", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
    try {
      expect(() => render(<PlanConsumer />)).toThrow("useFoodPlan must be used within a FoodPlanProvider");
    } finally {
      consoleError.mockRestore();
    }
  });
});
