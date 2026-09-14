import { afterEach, describe, expect, it } from "vitest";
import { readBrowseSearch, rememberBrowseSearch } from "./lastBrowse";

const realStorage = Object.getOwnPropertyDescriptor(window, "sessionStorage");

afterEach(() => {
  if (realStorage) Object.defineProperty(window, "sessionStorage", realStorage);
  window.sessionStorage.clear();
});

describe("last browse search", () => {
  it("round-trips a query string and defaults to empty", () => {
    expect(readBrowseSearch()).toBe("");
    rememberBrowseSearch("?categories=desserts");
    expect(readBrowseSearch()).toBe("?categories=desserts");
    rememberBrowseSearch("");
    expect(readBrowseSearch()).toBe("");
  });

  it("survives storage failures", () => {
    const broken = {
      getItem: () => { throw new Error("blocked"); },
      setItem: () => { throw new Error("quota"); },
    };
    Object.defineProperty(window, "sessionStorage", { value: broken, configurable: true });

    expect(() => rememberBrowseSearch("?q=x")).not.toThrow();
    expect(readBrowseSearch()).toBe("");
  });
});
