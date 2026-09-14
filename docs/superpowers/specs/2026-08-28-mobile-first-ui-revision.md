# Big E 2026 Mobile-First UI Revision

Date: 2026-08-28

## Summary

Revise the discovery UI shipped from the 2026 food discovery design for phone-first use at the fairgrounds. Replace the checkbox filter panel with category chips and a bottom filter sheet, compress item cards to roughly a quarter of their current height, add a persistent bottom navigation bar with My Food Plan access, and shorten the homepage. Functional controls use plain labels; the editorial voice stays in heroes and section headers.

This revision changes presentation and interaction only. The catalog data model, URL state format, search behavior, plan storage, and content policy from `2026-08-27-2026-food-discovery-design.md` are unchanged, with one data cleanup exception noted below.

## Problems observed

Review of the implemented UI at a 390px viewport and at desktop width found:

1. The desktop filter `<aside>` renders inside the search toolbar's flex row rather than beside the results, so a ~7,000px filter column pushes the entire result grid below it.
2. The filter UI presents ~115 checkboxes across five facets, including one checkbox per vendor (~60). The mobile drawer is the same list in a side sheet.
3. Result cards average ~500px tall. Most of that is a generated boilerplate description that restates the name and vendor, a per-card source link, a repeated three-line dietary disclaimer, and tag chips.
4. The homepage is a ~6,600px single-column scroll: one category tile per row, seven full-height collection cards, and fourteen full-height location cards. My Food Plan access sits at the very bottom.
5. Editorial microcopy ("Craving index", "On your tray", "Issued from the fair desk") labels functional controls.

## Goals

1. Make one-thumb phone use the primary design target; desktop is the adaptation.
2. Let visitors change category filters directly from the results view without opening any drawer.
3. Fit at least four result cards on a 390×844 viewport.
4. Keep My Food Plan reachable from every page in one tap, with a visible item count.
5. Reach every homepage section within roughly two screens of scrolling on a phone.

## Non-goals

- Changing catalog schema, validation, search indexing fields, sort semantics, facet semantics, URL parameter format, or plan storage
- Adding routes, a map view, geolocation, or offline support
- Redesigning the visual identity (palette, typography, shadow style)

## Browse filtering

### Category chip row

A horizontally scrollable chip row sits directly above the results, replacing the always-open facet panel as the primary filter surface.

- One chip per category, in taxonomy order, each showing its label and current result-context count (for example `Desserts · 12`). Categories with zero items in the current context may be hidden.
- Chips are multi-select toggle buttons bound to the same `categories` URL state; selected state is visible and exposed via `aria-pressed`.
- The row scrolls horizontally on overflow; the page body never scrolls horizontally.

### Filter sheet

All remaining facet controls move into a bottom sheet (vaul drawer) opened from a `Filters` button.

- Sections, as collapsible accordions with selected-count badges: Category (same state as the chip row), Location, Dietary, Tags. Sort moves into the sheet as a radio group with the sort rules unchanged.
- The vendor facet is removed from the filter UI entirely. Vendors remain searchable, `vendors` URL state remains supported, and tapping a vendor name on an item card filters to that vendor. An active vendor filter appears as a removable selected-filter chip.
- A sticky sheet footer shows a live `Show N results` apply/close button and a `Clear all` action. Filter changes still apply to URL state immediately; the count in the footer updates live.
- The sheet traps focus, restores it on close, and is dismissible by swipe, scrim tap, and Escape.

### Results header

A slim bar containing the result count, the `Filters` button (with an active-filter count badge), and the selected-filter chips stays sticky below the top of the viewport while results scroll. The search input does not need to be sticky.

### Desktop

Desktop reuses the same chip row, sticky header, and filter sheet at wider spacing; the two-column sidebar layout is removed rather than repaired. The broken inline `<aside>` in the search toolbar is deleted.

## Item cards

### Compact card

The default card shows only: item name, vendor, location links (or `Location not yet announced`), a compact dietary badge when a claim exists (for example `Gluten Free · source-reported`), and the Add/Added plan button. Target height is roughly 120px at 390px width.

Removed from the compact card: the `2026 listing` / `New for 2026` eyebrow, the description, tag chips, the source link, and the per-card dietary disclaimer paragraph. A small `New vendor` badge may appear on items tagged `new-vendor`.

### Expanded detail

Tapping the card body toggles an expand-in-place disclosure (`aria-expanded` on the trigger) containing: the real description when one exists, all tags as tappable filter chips, the source attribution link, and the full dietary disclaimer sentence. The Add button works without expanding.

### Shared disclaimer

The dietary disclaimer ("source-reported; confirm details with the vendor") appears once in the filter sheet's Dietary section and once inside each expanded card detail — never repeated per compact card.

### Data cleanup: boilerplate descriptions

Generated descriptions of the form "The official 2026 New Foods listing identifies X as an offering from Y" restate the name and vendor, and they pollute the search index. Remove them from `catalog.json`, leaving `description` set only where the source supplied real descriptive text. A test asserts no description matches the boilerplate pattern.

## Persistent navigation

- Below the `md` breakpoint, a fixed bottom navigation bar appears on every page with three items: Home, Browse, My Plan. My Plan shows a live count badge of planned items. The current page is marked with `aria-current`.
- At `md` and above, the same three links (with the plan count) render as a slim top navigation bar instead.
- Page content reserves bottom padding so the fixed bar never covers content, including the plan page's own controls.
- The homepage's bottom "My Food Plan" section is removed; the navigation bar replaces it.

## Homepage compression

1. Hero and catalog-status notice: unchanged content; the separate `Search food guide` submit button is removed — the search input navigates to `/browse?q=…` on submit.
2. Category tiles: two-column grid of compact tiles (icon, label, count) instead of one full-width tile per row.
3. Collections: a horizontal snap-scroll carousel of compact cards with the next card partially visible; embla-carousel (already a dependency) or plain CSS scroll-snap.
4. Editor flavor picks: unchanged chip row.
5. Locations: a compact two-column list of location name + confirmed-item count links, replacing the fourteen full-height cards. The existing rule stands: only locations with at least one confirmed 2026 item appear.

## Microcopy

- Functional controls use instant labels: `Filters`, `Sort`, `Clear all`, `N results`, `My Plan`, `Add` / `Added`.
- Editorial voice remains welcome in the hero, section eyebrows, and empty states, but never as the only label on an interactive control.
- The `2026 listing` vs `New for 2026` card eyebrows are removed; `isNewFor2026` stays in the data but is not surfaced per card.

## Accessibility

Carried forward from the base spec and applied to the new surfaces:

- Chip rows are reachable and operable by keyboard; toggle state is programmatic (`aria-pressed`), not color alone.
- The bottom sheet traps and restores focus; the sticky results count remains an `aria-live` status region.
- Bottom/top navigation links have descriptive accessible names and `aria-current`; the plan count badge is announced as part of the link name (for example "My Plan, 3 items").
- Card expansion uses a real button with `aria-expanded`; tap targets remain at least 44px.

## Testing

Update existing page and component tests to the new structure, plus new coverage:

1. Category chips toggle `categories` URL state and reflect selected state.
2. The filter sheet contains no vendor facet; tapping a vendor name on a card sets the `vendors` URL state and shows a removable chip.
3. The sheet footer count matches the current result count as filters change.
4. Compact cards render no description, source link, or disclaimer; expanding reveals description (when present), tags, source link, and disclaimer.
5. No `catalog.json` description matches the boilerplate pattern `identifies .* as an offering from`.
6. The navigation bar renders on all pages with a plan count badge that updates when items are added and removed.
7. The homepage renders no bottom plan section and no locations without confirmed items.

Completion verification: lint, full test suite, production build, and visual checks of homepage, browse, location detail, and plan at 390px and desktop widths.

## Acceptance criteria

- Browse results at 390×844 show at least four item cards per viewport with categories changeable without opening the sheet.
- The desktop browse view has no full-height filter column above the results.
- The vendor facet checkbox list no longer exists anywhere; vendor filtering works via search and card taps.
- My Plan, with a live count, is reachable in one tap from every page at every width.
- The homepage's main sections are reachable within roughly two screens of phone scrolling.
- All previously passing catalog, search, URL-state, and plan tests still pass unchanged in behavior.
