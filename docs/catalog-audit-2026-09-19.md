# Catalog and usability audit — September 19, 2026

## Result

Reviewed both saved PDFs, including all 16 illustrated guide maps. The previous 584-record import was incomplete and contained duplicate identities, incorrect area assignments, and misleading categories/tags. The corrected catalog contains **686 records across 187 vendor labels**: 126 added, 23 duplicate records merged, and one unsupported “Puerto Rican Empanadas” record replaced by the source's actual listing. Original published item IDs are retained; aliases preserve saved plans and older links.

The regression checklist is `src/data/2026/pdf-coverage.json`: **527 source/area checks** (448 guide-text listings, 69 additional map checks, and all 10 foods explicitly named in the review PDF). Repeated foods at different areas have one catalog record with multiple locations. Source menu names can map to the existing official name, rather than creating another card.

## Source coverage and limits

- **Eater’s Guide, 24 pages:** full menu lists, narrative recommendations, state-building highlights, and additional foods visible only on maps. Examples restored include Pioneer Valley Poppers, Penalty Box Pub, Athletic Brewing, Thanksgiving Nachos, Spic-E Burger, Sloppy Dough, Crookie, and map-only drink specials.
- **Everything we ate, 5 pages:** Chocolate Pickle Tacos, Samoa Doughnut, Maple Jerk Chicken Plate, Del’s Lemonade, Pulled Pork Baked Potato, S’mored Oreo, Alfredo Pasta Bomb, Cheese Dog, Bacalaito, and Apple Nachos.
- The review PDF links to an external interactive list containing more ratings and prices. That list is **not embedded in the PDF**. This audit covers the saved content, not that external list or a fresh survey of every fair vendor.
- Generic phrases such as “full lunch/dinner menu,” “drinks,” “gluten-friendly options,” and serving-container choices are not invented individual dishes. Explicit named offerings are retained, even where the source gives only a generic name such as Pizza or Beer. Broad vegan/gluten-friendly vendor statements are not copied onto every dish.
- The source describes S’Macaron as unavailable for the first four days and returning Tuesday. The catalog now preserves this note.
- The guide is an annual update and includes a stale “2025” heading before its top-ten section. Map-only entries are identified as such in their descriptions; source inclusion is not an independent guarantee of day-of availability.
- State buildings remain grouped under Avenue of States. Directions lead to area pins, not exact stalls; the illustrated vendor arrows have not been converted into surveyed coordinates.

## Corrections

- Butterbeer is a nonalcoholic soda; MooNugs and Moo-Nut are ice cream items. Sweet food names no longer inherit savory tags by default.
- Margaritas, rum buckets, sangria, and holiday/smoking cocktails appear under Cocktails. Cream Puff cider is not a pastry. Greek and Lebanese foods no longer appear under Tacos & Mexican.
- Named flavors and preparation methods now receive the corresponding tags, including maple, bacon, chocolate, pickle, fried, and food-on-a-stick.
- Buni’s, Downeast, Jim’s tacos, and Hot & Fresh Mini Donuts were incorrectly imported under Avenue of States across a PDF page break. Guide listings now use East Road; independently sourced additional locations are retained.
- Repeated locations are restored for the bakery, Super Dog, Moolicious, Butcher Boys, Billie’s, Tootsie’s, and other multi-location vendors.
- Vendor spellings are consolidated where identity is clear; distinct vendors and named variants remain separate. Examples merged include the bakery's peanut butter cream puff, The Mick's Alfredo bomb, the four GF-prefixed duplicates, the NOLA lobster tail, and Ferrindino's waffle.

## Usability

- Retained the existing Home → Browse → Add → My Plan → Map flow and compact expandable cards.
- Removed outdated copy claiming the catalog only covered the initial New Foods announcement.
- Category counts now require one shared filtered pass instead of one full search per category: **two full searches per update instead of 26** including the result search.
- Existing vendor, item, and state-building aliases preserve browse filters, saved/checked items, shared plans, location pages, and map links after consolidation.
- Browser checks at 390px and 1440px verified search, filtering, detail expansion, adding a food, plan persistence after reload, old location links, map tiles, and directions links. No horizontal page overflow was found. Location permission was not required to select a destination.

## Validation

The PDF coverage, categorization, duplicate, availability-note, compatibility, and search-work regression tests pass. Full application tests, production build, TypeScript check, and lint were also run. Lint reports existing React Fast Refresh warnings; the build reports a bundle-size warning. No new user-facing controls were needed for this audit.

## Supplemental classification checks

Historical sources were used only to clarify ambiguous food names, not to assert 2026 availability: [WFSB's description of Moo Bomb](https://www.wfsb.com/2024/08/22/big-e-unveils-new-foods-2024-fair/) and [Amusement Today's description of Beer-A-Misu as a tiramisu-style dessert](https://www.amusementtoday.com/backissues/at_pre_2014_web.pdf). The saved 2026 guide remains the source for their inclusion.
