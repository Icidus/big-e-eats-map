/**
 * Map utilities for handling map assets
 */

// Type definitions for map assets
export interface MapAsset {
  id: string;
  name: string;
  path: string;
  thumbnail?: string;
  type: 'location' | 'overview' | 'interactive';
}

/**
 * Helper function to generate map asset paths
 */
export const getMapPath = (type: 'locations' | 'overview' | 'thumbnails', filename: string): string => {
  return `/src/assets/maps/${type}/${filename}`;
};

/**
 * Helper function to get location map path from location ID
 */
export const getLocationMapPath = (locationId: string, isThumbnail = false, extension = 'png'): string => {
  const suffix = isThumbnail ? '-thumb' : '';
  const folder = isThumbnail ? 'thumbnails' : 'locations';
  return getMapPath(folder as 'locations' | 'thumbnails', `${locationId}${suffix}.${extension}`);
};

/**
 * Try to import a location map, falling back to placeholder if not found
 */
export const getLocationMapImage = async (locationId: string): Promise<string> => {
  try {
    // Try PNG first (since that's what you uploaded)
    const pngPath = `/src/assets/maps/locations/${locationId}.png`;
    const pngModule = await import(pngPath);
    return pngModule.default;
  } catch {
    try {
      // Fallback to JPG
      const jpgPath = `/src/assets/maps/locations/${locationId}.jpg`;
      const jpgModule = await import(jpgPath);
      return jpgModule.default;
    } catch {
      // Use placeholder if no map found
      return PLACEHOLDER_MAP;
    }
  }
};

/**
 * Check if map exists (you'll need to implement actual file checking logic)
 */
export const mapExists = (path: string): boolean => {
  // This is a placeholder - in a real app you might want to:
  // 1. Pre-generate a list of available maps at build time
  // 2. Use dynamic imports with try/catch
  // 3. Have a manifest file listing available maps
  return false; // Default to false until maps are added
};

/**
 * List of expected location map files based on location IDs
 */
export const expectedLocationMaps = [
  'new-england-avenue',
  'front-porch',
  'commonwealth-avenue',
  'food-court',
  'avenue-of-states',
  'craft-common',
  'east-road',
  'west-road',
  'springfield-road',
  'industrial-avenue',
  'hampden-avenue',
  'young-building',
  'better-living-center',
  'new-england-center',
  'state-buildings'
].map(id => ({
  id,
  locationPath: getLocationMapPath(id),
  thumbnailPath: getLocationMapPath(id, true)
}));

/**
 * Placeholder map image (you can replace this with an actual placeholder)
 */
export const PLACEHOLDER_MAP = '/placeholder.svg';
