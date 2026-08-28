import { readdir, readFile } from "node:fs/promises";
import { extname, join, relative, resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const outputRoot = join(projectRoot, "dist");
const retiredMapBasenames = [
  "avenue-of-states.png",
  "better-living-center.png",
  "commonwealth-avenue.png",
  "craft-common.png",
  "east-road.png",
  "food-court.png",
  "hampden-avenue.png",
  "industrial-avenue.png",
  "new-england-avenue.png",
  "new-england-center.png",
  "nicks-favorites.png",
  "springfield-road.png",
  "state-buildings.png",
  "the-front-porch.png",
  "west-road.png",
  "young-building.png",
];
const retiredMapStems = retiredMapBasenames.map((name) => name.slice(0, -extname(name).length));

async function filesUnder(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesUnder(path) : [path];
  }));
  return nested.flat();
}

const outputFiles = await filesUnder(outputRoot);
const emittedRetiredAssets = outputFiles.filter((path) => {
  const filename = path.split("/").at(-1) ?? "";
  return retiredMapStems.some((stem) => filename === `${stem}.png` || filename.startsWith(`${stem}-`));
});
const textFiles = outputFiles.filter((path) => [".css", ".html", ".js", ".json", ".map", ".svg"].includes(extname(path)));
const legacyReference = new RegExp(`${retiredMapBasenames.map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")}|Nick['’]?s Favorites`, "i");
const referencedRetiredAssets = [];

for (const path of textFiles) {
  if (legacyReference.test(await readFile(path, "utf8"))) {
    referencedRetiredAssets.push(relative(projectRoot, path));
  }
}

if (emittedRetiredAssets.length || referencedRetiredAssets.length) {
  const emitted = emittedRetiredAssets.map((path) => relative(projectRoot, path));
  throw new Error(`Retired annotated map content entered the build: ${[...emitted, ...referencedRetiredAssets].join(", ")}`);
}

console.log(`Legacy map asset scan passed (${outputFiles.length} build files checked).`);
