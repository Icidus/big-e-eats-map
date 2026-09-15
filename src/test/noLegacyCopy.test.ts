import { readdir, readFile } from "node:fs/promises";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import catalog from "@/data/2026/catalog.json";
import collections from "@/data/2026/collections.json";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const sourceRoot = join(projectRoot, "src");
const catalogPath = join(sourceRoot, "data/2026/catalog.json");
const collectionsPath = join(sourceRoot, "data/2026/collections.json");
const locationMapRoot = join(sourceRoot, "assets/maps/locations");
const legacyCopy = /\b2025\b|MassLive 2025/i;
const testDirectoryNames = new Set(["test", "tests", "__tests__"]);

async function sourceFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const paths = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? sourceFiles(path) : [path];
    }),
  );

  return paths.flat();
}

function withoutSourceMetadata(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(withoutSourceMetadata);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => key !== "source")
        .map(([key, nestedValue]) => [key, withoutSourceMetadata(nestedValue)]),
    );
  }

  return value;
}

function isTestPath(relativePath: string): boolean {
  const pathSegments = relativePath.split(/[\\/]+/);
  const filename = pathSegments.at(-1) ?? "";

  return (
    pathSegments.slice(0, -1).some((segment) => testDirectoryNames.has(segment)) ||
    /\.(?:test|spec)\.(?:ts|tsx)$/.test(filename)
  );
}

describe("test-path classification", () => {
  it.each([
    ["test/setup.ts", true],
    ["features/x/__tests__/fixture.ts", true],
    ["features\\x\\__tests__\\fixture.ts", true],
    ["features/testing/contest.ts", false],
  ])("classifies %s as a test path: %s", (relativePath, expected) => {
    expect(isTestPath(relativePath)).toBe(expected);
  });
});

describe("public copy", () => {
  it("contains no legacy year in application source", async () => {
    const files = (await sourceFiles(sourceRoot)).filter((path) => {
      const extension = extname(path);
      const fromSourceRoot = relative(sourceRoot, path);
      return (
        [".ts", ".tsx", ".json"].includes(extension) &&
        !isTestPath(fromSourceRoot) &&
        path !== catalogPath &&
        path !== collectionsPath
      );
    });
    const userVisibleSource = (await Promise.all(files.map((path) => readFile(path, "utf8")))).join("\n");

    expect(userVisibleSource).not.toMatch(legacyCopy);
  });

  it("keeps no annotated location image assets in source", async () => {
    const locationMapEntries = await readdir(locationMapRoot);

    expect(locationMapEntries.filter((entry) => extname(entry).toLowerCase() === ".png")).toEqual([]);
    expect(locationMapEntries.some((entry) => entry.toLowerCase().includes(["nicks", "favorites"].join("-")))).toBe(false);
  });

  it("contains no legacy year in catalog public fields", () => {
    const dataWithoutSourceMetadata = withoutSourceMetadata({ catalog, collections });

    expect(JSON.stringify(dataWithoutSourceMetadata)).not.toMatch(legacyCopy);
  });

  it("contains no legacy year in public HTML metadata", async () => {
    const metadataFiles = [join(projectRoot, "index.html")];
    const publicMetadata = (await Promise.all(metadataFiles.map((path) => readFile(path, "utf8")))).join("\n");

    expect(publicMetadata).not.toMatch(legacyCopy);
  });
});
