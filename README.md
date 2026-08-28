# Big E 2026 Food Guide

A static guide for discovering confirmed 2026 Big E food listings, locating vendors, and building a personal fair-food plan. It is designed for browsing, filtering, sharing a search state, and planning a visit without a server account or database.

## Source and completeness policy

Catalog records are included only when backed by an official Big E source. Each catalog item and editorial collection retains its source publisher, title, URL, and access date in the JSON data. The guide intentionally does not claim to be a complete roster: only confirmed listings are shown, and the catalog is expanded as official information becomes available. Do not add unsourced vendor, menu, location, or availability claims.

## Architecture

This is a Vite, React, TypeScript, and Tailwind static site. The application reads its catalog from versioned JSON files in `src/data/2026/`; `src/features/catalog/` validates and indexes that data at startup. Discovery, URL state, and the local food plan run entirely in the browser. GitHub Pages publishes the generated `dist/` artifact.

## Local development

Use Node.js 20 or later.

```sh
npm ci
npm run dev
```

Useful checks:

```sh
npm test
npm run lint
npm run build
```

## Updating the 2026 data safely

1. Start with an official Big E page and record its publisher, title, URL, and access date in the relevant `source` object.
2. Update `src/data/2026/catalog.json`, `collections.json`, or `locations.json` with only confirmed information. Keep item IDs stable and ensure every referenced location and collection item ID exists.
3. Preserve source attribution and do not present source metadata as public menu copy.
4. Run the focused catalog validation, then the complete checks:

   ```sh
   npm test -- src/data/2026/catalog-content.test.ts
   npm test
   npm run lint
   npm run build
   ```

5. Review the JSON diff for accidental duplicate items, unsupported taxonomy values, or unverified claims before committing.

## GitHub Pages deployment

The GitHub Actions workflow at `.github/workflows/deploy.yml` deploys pushes to `main`. It installs dependencies with `npm ci`, builds the site, copies the built entry point to `dist/404.html` for SPA fallback, uploads the artifact, and deploys it with GitHub Pages. Run the production build locally before merging a deployment change.
