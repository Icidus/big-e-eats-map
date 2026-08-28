// @vitest-environment node

import { describe, expect, it } from "vitest";
import config from "../../vitest.config";

describe("Vitest workspace discovery", () => {
  it("excludes nested Git worktrees while preserving an explicit exclude list", () => {
    const testConfig = (config as { test?: { exclude?: string[] } }).test;

    expect(testConfig?.exclude).toContain("**/.worktrees/**");
  });
});
