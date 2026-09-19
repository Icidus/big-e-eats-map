import aliases from "@/data/2026/aliases.json";

// Keep shared links and saved plans working when duplicate catalog records merge.
export function resolveCatalogAlias(kind: keyof typeof aliases, id: string): string {
  const entries: Record<string, string> = aliases[kind];
  return Object.prototype.hasOwnProperty.call(entries, id) ? entries[id] : id;
}
