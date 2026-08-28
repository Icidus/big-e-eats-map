const mapModules = import.meta.glob<{ default: string }>(
  "/src/assets/maps/locations/*.png",
  { eager: true, query: "?url" },
);

export const PLACEHOLDER_MAP = "/placeholder.svg";

export function getLocationMapImage(mapImage?: string): string {
  if (!mapImage) return PLACEHOLDER_MAP;
  return mapModules[`/src/assets/maps/locations/${mapImage}`]?.default ?? PLACEHOLDER_MAP;
}
