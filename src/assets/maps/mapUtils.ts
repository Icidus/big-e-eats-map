export interface LocationMapImage {
  src: string;
  isAvailable: boolean;
}

export function getPlaceholderMapImage(baseUrl = import.meta.env.BASE_URL): string {
  const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return `${normalizedBaseUrl}placeholder.svg`;
}

export const PLACEHOLDER_MAP = getPlaceholderMapImage();

export function getUnavailableLocationMap(baseUrl = import.meta.env.BASE_URL): LocationMapImage {
  return { src: getPlaceholderMapImage(baseUrl), isAvailable: false };
}
