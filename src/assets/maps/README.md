# Maps Directory

This directory contains map images and assets for the Big E food locations.

## Directory Structure

```
maps/
├── locations/          # Individual location maps
│   ├── new-england-avenue.jpg
│   ├── front-porch.jpg
│   ├── commonwealth-avenue.jpg
│   └── ...
├── overview/           # General fair maps
│   ├── full-fair-map.jpg
│   ├── food-areas-overview.jpg
│   └── parking-map.jpg
├── interactive/        # Interactive map assets
│   ├── markers/
│   └── overlays/
└── thumbnails/         # Smaller versions for cards
    ├── new-england-avenue-thumb.jpg
    ├── front-porch-thumb.jpg
    └── ...
```

## File Naming Convention

- Location maps: `{location-id}.jpg` (matching the location ID from locations.ts)
- Thumbnails: `{location-id}-thumb.jpg`
- Overview maps: descriptive names like `full-fair-map.jpg`

## Supported Formats

- `.jpg` - Primary format for photographs and detailed maps
- `.png` - For maps with transparency or simple graphics
- `.svg` - For scalable vector maps (if available)

## Usage

Maps can be imported in components like:

```typescript
import newEnglandAvenueMap from '@/assets/maps/locations/new-england-avenue.jpg';
import newEnglandAvenueThumb from '@/assets/maps/thumbnails/new-england-avenue-thumb.jpg';
```