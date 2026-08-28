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
const legacyCopy = /\b2025\b|MassLive 2025/i;

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

describe("public copy", () => {
  it("contains no legacy year in application source", async () => {
    const files = (await sourceFiles(sourceRoot)).filter((path) => {
      const extension = extname(path);
      const fromSourceRoot = relative(sourceRoot, path);
      const isTest =
        fromSourceRoot.includes("/test/") ||
        /(?:^|\/)__tests__\/|\.(?:test|spec)\.(?:ts|tsx)$/.test(fromSourceRoot);
      return (
        [".ts", ".tsx", ".json"].includes(extension) &&
        !isTest &&
        path !== catalogPath &&
        path !== collectionsPath
      );
    });
    const userVisibleSource = (await Promise.all(files.map((path) => readFile(path, "utf8")))).join("\n");

    expect(userVisibleSource).not.toMatch(legacyCopy);
  });

  it("contains no legacy year in catalog public fields", () => {
    const dataWithoutSourceMetadata = withoutSourceMetadata({ catalog, collections });

    expect(JSON.stringify(dataWithoutSourceMetadata)).not.toMatch(legacyCopy);
  });

  it("contains no legacy year in public HTML metadata", async () => {
    const metadataFiles = [join(projectRoot, "index.html"), join(projectRoot, "public/404.html")];
    const publicMetadata = (await Promise.all(metadataFiles.map((path) => readFile(path, "utf8")))).join("\n");

    expect(publicMetadata).not.toMatch(legacyCopy);
  });
});
