# Big E 2026 Food Discovery Design

Date: 2026-08-27

## Summary

Rework the existing Big E Eats Map into a 2026-only food discovery guide. Keep the application as a static React/Vite site deployed from GitHub, replace the 2025 catalog with source-confirmed 2026 items, and make browsing by craving the primary experience. Add structured facets, typo-tolerant search, editorial collections, and an account-free food plan.

This project does not introduce a database, backend API, scraper, authentication system, new host, or custom domain.

## Background

The current application is a static React/Vite single-page application deployed to GitHub Pages. It has 443 foods embedded in a 2,616-line TypeScript file. Categories are inferred at runtime with regular expressions, search is literal substring matching, and the public copy and MassLive content refer to 2025.

The Big E published its official 2026 New Foods page on August 27, 2026. It identifies 12 new vendors and dozens of additions from returning vendors. The initial 2026 catalog will use that page as its authoritative source:

- https://www.thebige.com/p/food2/newfoods

The official page is a list of confirmed new additions, not the complete 2026 fair menu. The application must say this plainly rather than imply that the initial catalog is comprehensive.

## Goals

1. Publish only food and drink items explicitly confirmed for the 2026 fair.
2. Let visitors begin with broad cravings such as cocktails, desserts, burgers, potatoes, or spicy food.
3. Support multi-select faceted browsing across category, location, dietary attributes, drink type, flavor profile, vendor, and collection.
4. Provide typo-tolerant, ranked search across item, vendor, description, category, tag, and location fields.
5. Offer curated 2026 collections that reuse the same catalog and result cards.
6. Let visitors build, check off, and share a food plan without creating an account.
7. Keep deployment and ongoing infrastructure at the current static-site level.

## Non-goals

- Importing or displaying unconfirmed 2025 menu items
- Displaying 2025 MassLive favorites or other 2025 editorial content
- Building an automated scraper or ingestion review system
- Creating a database, server API, admin interface, or visitor accounts
- Providing turn-by-turn navigation or claiming precise walking optimization
- Inferring dietary safety when a source does not make an explicit claim
- Claiming that the initial New Foods catalog is the complete 2026 vendor roster

## Content policy

### Inclusion

An item may appear when a source explicitly identifies it as available at the 2026 Big E. The initial import uses the official Big E New Foods page only. Later 2026 sources may be added when they explicitly identify the year, vendor, and item.

Every public item must retain source attribution, including publisher, page title, URL, and access date. Descriptions may be edited for length and clarity but must not add unsupported ingredients, dietary claims, prices, or availability information.

### Item granularity

Every distinctly named menu item becomes its own searchable record. Named variants with meaningfully different ingredients become separate records. Minor flavor or topping choices remain in the description when separate cards would add clutter.

Examples:

- `Caramel Apple Mocktail` is one item.
- `Spicy Tuna Push-Up Sushi Pop` and `California Roll Push-Up Sushi Pop` are separate items because the fillings differ.
- A fountain drink with a list of available syrup choices remains one customizable item.

### Dietary claims

Dietary attributes such as `gluten-free` or `vegetarian` are stored only when the source states them explicitly. The application must distinguish a sourced gluten-free claim from ordinary category tagging. It must not infer allergen safety from ingredients.

## Static data model

Use JSON files under `src/data/2026/`, with TypeScript types and Zod validation at the catalog boundary.

### `catalog.json`

Each record contains:

```json
{
  "id": "wave-caramel-apple-mocktail",
  "year": 2026,
  "name": "Caramel Apple Mocktail",
  "vendor": "W.A.V.E. Mocktail Bar",
  "locationIds": ["front-porch"],
  "description": "Local apple cider with vanilla, lemon, and caramel.",
  "categoryIds": ["mocktails"],
  "tagIds": ["drinks", "nonalcoholic", "apple", "fall-flavors"],
  "dietaryClaims": [],
  "isNewFor2026": true,
  "source": {
    "publisher": "The Big E",
    "title": "New Foods",
    "url": "https://www.thebige.com/p/food2/newfoods",
    "accessedOn": "2026-08-27"
  }
}
```

Item IDs are stable slugs based on vendor and item identity. Renaming display text must not silently change an existing ID because saved and shared plans depend on it.

### `locations.json`

Locations retain the existing stable IDs and map-image association. Location descriptions and maps are venue information rather than menu records and may be retained where still accurate. Each catalog location reference must resolve to a known location.

### `collections.json`

Collections contain an ID, title, short description, ordered food IDs, and optional 2026 source attribution. Initial first-party collections may include:

- Wildest New Foods
- Cocktails and Mocktails
- Desserts Worth the Detour
- Gluten-Free Fair Food
- Fall Flavors
- Savory Food on a Stick
- Editor's Shortlist

A future MassLive 2026 guide can be represented as a sourced collection without duplicating catalog items.

### Taxonomy

Categories and tags are explicit controlled values, not runtime regex guesses. Category definitions provide display labels, icons, descriptions, and ordering. A food may have multiple categories where that improves discovery.

The first taxonomy should cover at least:

- Cocktails, mocktails, beer/cider, and nonalcoholic drinks
- Desserts, ice cream, donuts/pastries, and candy
- Burgers, hot dogs/corndogs, sandwiches, tacos, pizza, barbecue, seafood, potatoes/fries, and other savory food
- Gluten-free, vegetarian, and vegan only as sourced dietary claims
- Sweet, savory, spicy, fried, food-on-a-stick, pickle, birria, hot honey, pumpkin, apple, and other useful discovery tags

## Information architecture

### Homepage: browse first

The selected layout leads with inspiration rather than a large result grid:

1. Compact 2026 hero and catalog-status message
2. Prominent global search box
3. "Start with a craving" category tiles
4. Curated 2026 collection cards
5. Trending ingredient or flavor shortcuts
6. Browse-by-location entry points
7. Persistent access to My Food Plan

The page must identify the data as confirmed 2026 additions and explain that the complete fair roster has not yet been published.

### Browse results

Choosing a tile, collection, tag, location, or search suggestion opens a common browse-results route. Its state is represented in URL search parameters so the result view can be bookmarked or shared.

Example:

```text
/browse?categories=cocktails,desserts&locations=front-porch&tags=fall-flavors
```

Within a facet, selections use OR semantics. Across different facets, selections use AND semantics. Therefore, `cocktails,desserts` at `front-porch` means cocktails or desserts that are available at the Front Porch.

The result view includes:

- Current query and selected-filter chips
- A mobile filter drawer and a desktop filter panel
- Result count and sort control
- Empty-state suggestions and a one-action reset
- Reusable item cards

Each item card displays the item name, vendor, location, relevant tags, short description, source attribution, and an Add to My Food Plan action.

### Location pages

Location pages read from the same 2026 catalog and show only confirmed 2026 additions for that location. Existing map assets remain available. A location with no confirmed 2026 items must not display carried-forward 2025 food; it should explain that no 2026 additions are currently confirmed there.

### Legacy routes

- `/drinks` redirects to the browse route with the appropriate drink categories selected.
- The 2025 MassLive route and public navigation are removed. A future 2026 publication collection receives a new or year-neutral route.
- Internal navigation uses React Router links rather than hard-coded GitHub Pages paths.

## Search design

Use MiniSearch to create a client-side index when the catalog module initializes. The catalog is small enough that a server-side search service is unnecessary.

Indexed fields and relative importance:

1. Item name
2. Vendor name
3. Category labels and tags
4. Location name
5. Description

Search enables prefix matching and conservative fuzzy matching. Exact and prefix item-name matches rank above fuzzy vendor or description matches. Facets are applied to search results using the same OR-within/AND-across semantics used for browsing.

Search and filtering must normalize case, punctuation, apostrophes, and common hyphenation differences. Search result highlighting must escape user input and must not construct an unsafe regular expression from raw query text.

## Editorial collections

Collections are ordered lists of catalog IDs, not duplicate food records. They reuse the standard result cards and can be filtered further after opening. First-party collections are labeled as Big E Eats Map collections. Publication-based collections display their source and year.

No 2025 recommendation badge, count, link, or collection may appear in the 2026 application.

## My Food Plan

The food plan requires no account or server persistence.

- Selected food IDs are stored in browser local storage.
- The plan page groups selections by fairground location.
- A deterministic location order provides a practical sequence of stops without claiming GPS optimization.
- Each stop links to its available location map.
- Visitors may check off and remove items.
- Check-off state remains local and is not embedded in shared links.
- A share action creates `/plan?items=<comma-separated-encoded-ids>`.
- Loading a shared plan merges or replaces local selections only after a clear user action.

Unknown or retired IDs in a shared URL are ignored. The page reports how many shared items could not be found instead of failing.

## Components and module boundaries

The implementation should keep data, search state, UI, and plan persistence separate:

- Catalog schema and loader: validate static data and expose typed records.
- Taxonomy: define controlled categories, tags, labels, icons, and order.
- Search module: own MiniSearch configuration, scoring, and facet filtering.
- Browse URL state: parse and serialize query and facet parameters.
- Collection module: resolve ordered item IDs against the catalog.
- Plan module: own local-storage and share-link serialization.
- Reusable UI: category tiles, collection cards, filter controls, item cards, catalog-status notice, and plan controls.

Pages compose these modules but do not reimplement search, grouping, or persistence logic.

## Error handling and validation

Catalog loading must fail loudly in development and tests when:

- A record is not for 2026.
- An ID is duplicated.
- A location, category, tag, collection item, or source field is invalid.
- An item has no category or source.
- A dietary claim uses an uncontrolled value.

Production UI handles empty results, missing maps, invalid URL filters, unavailable plan IDs, and local-storage failures without crashing. Invalid filter values are ignored and removed the next time URL state is serialized.

## Accessibility and responsive behavior

- All filters are usable by keyboard and screen reader.
- Selected filters expose programmatic state, not color alone.
- The mobile filter drawer traps and restores focus correctly.
- Category and collection cards are links or buttons with descriptive accessible names.
- Result counts and filter changes are announced without moving focus unexpectedly.
- Tap targets meet mobile sizing expectations.
- The experience works from small mobile screens through desktop layouts.

## Testing and verification

Add Vitest for unit and integration coverage. Pure modules receive most of the behavioral testing.

Required automated coverage:

1. Catalog schema validation and relationship integrity
2. A hard assertion that every food record has `year: 2026`
3. No public 2025 copy or MassLive 2025 references
4. Category and tag filtering, including OR-within/AND-across semantics
5. Search ranking, prefix matches, punctuation normalization, and representative misspellings
6. Browse URL parsing and serialization
7. Plan local-storage behavior and share-link round trips
8. Recovery from missing shared IDs and storage errors

Completion verification includes linting, the full test suite, a production build, and visual checks of the homepage, browse results, location detail, and food plan at mobile and desktop sizes.

## Delivery sequence

1. Establish tests, catalog schema, taxonomy, and typed data access.
2. Translate the official 2026 New Foods page into validated catalog records.
3. Implement search indexing, facets, and URL state.
4. Build the browse-first homepage and shared browse-results components.
5. Adapt location pages and legacy routes.
6. Add editorial collections.
7. Add My Food Plan and share links.
8. Remove remaining public 2025 content and update metadata.
9. Run automated and visual verification.

## Acceptance criteria

- The deployed site presents itself exclusively as a 2026 guide.
- Every displayed menu item has an explicit 2026 source.
- No unconfirmed 2025 food or 2025 recommendation content is searchable or visible.
- A visitor can browse cocktails, desserts, and other categories without typing.
- A visitor can combine multiple category, location, and attribute filters and share the resulting URL.
- Search tolerates representative misspellings and ranks direct item matches first.
- Collections reuse catalog records and can be filtered further.
- A visitor can create, persist, check off, and share a food plan without an account.
- The application remains a static GitHub Pages deployment with no recurring infrastructure service.

