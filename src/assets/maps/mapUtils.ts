const mapModules = import.meta.glob<{ default: string }>(
  "/src/assets/maps/locations/*.png",
  { eager: true, query: "?url" },
);

export interface LocationMapImage {
  src: string;
  isAvailable: boolean;
}

export function getPlaceholderMapImage(baseUrl = import.meta.env.BASE_URL): string {
  const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return `${normalizedBaseUrl}placeholder.svg`;
}

export const PLACEHOLDER_MAP = getPlaceholderMapImage();

export function getLocationMap(mapImage?: string, baseUrl = import.meta.env.BASE_URL): LocationMapImage {
  const src = mapImage ? mapModules[`/src/assets/maps/locations/${mapImage}`]?.default : undefined;
  return src ? { src, isAvailable: true } : { src: getPlaceholderMapImage(baseUrl), isAvailable: false };
}

export function getLocationMapImage(mapImage?: string): string {
  return getLocationMap(mapImage).src;
}
