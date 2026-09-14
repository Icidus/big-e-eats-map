# Maps Directory

Fairground maps are rendered at runtime from OpenStreetMap tiles by `src/features/map/FairMap.tsx`. Location pins come from the `coordinates` field on each record in `src/data/2026/locations.json`; pins marked `"precision": "estimated"` were placed from location descriptions and should be corrected on site.

The subdirectories here are intentionally empty. Previously annotated food maps were retired because their vendor labels were not confirmed for the current catalog, and `scripts/verify-no-legacy-map-assets.mjs` fails the build if any of them reappear. A georeferenced venue image may be layered over the tiles through the `overlay` prop on `FairMap` once its labels are vetted and its use is permitted.
