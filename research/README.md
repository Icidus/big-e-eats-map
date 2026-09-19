# Vendor research workflow

This is a supervised research queue for all 187 catalog vendor names. It generates work packets and stores evidence; it does **not** automatically search the web, scrape Instagram, schedule background jobs, or edit the food catalog. Run the packets with the assistant's search/browser tools, then import the reviewed findings.

## Current state

- Batches 001–015: 150 vendor records checked.
- Five earlier pilot reviews imported; 155 vendor records checked in total.
- Batch 016: ten vendors reserved in `next-batch.json`; these are still pending.
- Two confirmed missing items from Bear’s: Bucket of Moinks and Bear Necessit-E Sandwich. See `report-2026.md` for exact citations, price evidence, and location details.
- Batch 002: confirmed hot popovers with three butter choices at Delaney’s, Rhode Island-style calamari at Friskie Fries, and six crème brûlée flavors at Crème Bru LA. Exact post citations are in the report.
- Batch 003: It’s Kelewele 31 has seven named food/drink offerings; Joey’s confirms four hand-pie fillings plus whoopie pies. Findings and limitations are in the report.
- September 19 promotion: 16 sourced foods/drinks added (702 catalog entries total), existing Crème Bru LA and Tripp’s descriptions enriched, and verified profile/site links published for 19 vendors. See `promoted-items-2026-09-19.json`. Research findings retain their original wording as an evidence log.

- Batch 004 published: three NH Building foods added (705 entries), five food descriptions updated, and five vendor profiles added (24 vendors with verified links). Rickey’s jerky corrected to savory snacks. See `promoted-items-2026-09-19-batch-004.json`.

- Batch 005 published: Sweet Talkin’ Jalapeño Dip, regular slush and Dragon Fruit Spritz added (708 entries); seven descriptions enriched; seven vendor profiles linked (31 total). Unresolved operator identities remain unlinked. See `promoted-items-2026-09-19-batch-005.json`.

- Batch 006 published: Maple Bacon Mac & Cheese, Timberyard Honey Blueberry Ale and The Connecticut Dog added (711 entries); nine descriptions enriched; nine vendor profiles linked (40 total). Main Street Deli now links its dedicated fair accounts. See `promoted-items-2026-09-19-batch-006.json`.

- Batch 007 published: 5 listings added (716 total), 2 descriptions enriched, 8 vendor profiles linked (48 total). See `promoted-items-2026-09-19-batch-007.json`.

- Batch 008 published: 1 listings added (717 total), 15 descriptions enriched, 5 vendor profiles linked (53 total). See `promoted-items-2026-09-19-batch-008.json`.

- Batch 009 published: 7 listings added (724 total), 7 descriptions enriched, 8 vendor profiles linked (61 total). See `promoted-items-2026-09-19-batch-009.json`.

- Batch 010 published: 4 listings added (728 total), 6 descriptions enriched, 6 vendor profiles linked (66 total). See `promoted-items-2026-09-19-batch-010.json`.

- Batch 011 published: 3 listings added (731 total), 6 descriptions enriched, 3 vendor profiles linked (69 total). See `promoted-items-2026-09-19-batch-011.json`.

- Batch 012 published: 2 listings added (733 total), 3 descriptions enriched, 4 vendor profiles linked (73 total). See `promoted-items-2026-09-19-batch-012.json`.

- Batch 013 published: 7 listings added (740 total), 3 descriptions enriched, 7 vendor profiles linked (80 total). See `promoted-items-2026-09-19-batch-013.json`.

- Batch 014 published: 3 listings added (743 total), 5 descriptions enriched, 6 vendor profiles linked (86 total). See `promoted-items-2026-09-19-batch-014.json`.

- Batch 015 published: 4 listings added (747 total), 6 descriptions enriched, 7 vendor profiles linked (93 total). See `promoted-items-2026-09-19-batch-015.json`.

## Commands

Run from the repository root with Python 3 (standard library only):

```sh
python3 scripts/vendor_research.py sync
python3 scripts/vendor_research.py batch --size 10 > research/next-batch.json
python3 scripts/vendor_research.py record research/reviews/batch-002.json
python3 scripts/vendor_research.py report > research/report-2026.md
python3 -m unittest discover -s scripts/tests
```

`sync` refreshes each vendor's catalog items without erasing reviews or batches. Vendor IDs are research-local; they are not app route IDs. Removed vendors retain their history but are not selected for new batches.

`batch` resumes the oldest incomplete batch, even if you request a different size. Completed vendors are omitted from its packet. Once all vendors in a batch have a review, the next invocation selects another batch. Pending vendors are ordered by item count, then name. The packet contains existing foods, suggested searches, the previous review, and a review template. No review is recorded merely by generating a packet.

`record` accepts one review or a JSON array. Invalid imports do not write to disk. Re-importing the identical review is a no-op, including during a later rescan. Use a new scope/date or findings for a new review. Queue writes use an atomic replacement; use one writer at a time (there is no multi-process lock).

For a later pass:

```sh
python3 scripts/vendor_research.py batch --size 10 --recheck-before 2026-09-20
```

After finishing any active batch, this selects unreviewed vendors or vendors last checked before the date. Known accounts and previous findings remain available. Review newer posts first, but revisit unresolved older leads too: a thumbnail scan or inaccessible page is not a complete historical cutoff.

## How to work a packet

1. Search the vendor name with Big E and social terms. Verify ownership through vendor-website links, matching profile information, or reliable business profiles. Generic labels such as “Cotton Candy Stall” may need an operator name before an account can be found.
2. Inspect the public profile and record the scope: number/date range of visible posts, captions opened, any access restriction. Use thumbnails only to identify posts worth opening. Open promising post permalinks and read the vendor caption and publication date; comments, inferred image descriptions, and search snippets alone do not confirm a dish.
3. Compare named food against the packet and the full catalog, including spelling variants and alternate vendor names. An existing generic “BBQ” listing does not represent every named sandwich. Record potential duplicates explicitly.
4. Save paraphrased facts, not copied captions, in `research/reviews/`. Keep the exact source URL. Use `confirmed` only with dated vendor/fair evidence explicitly tied to The Big E 2026. General menus, other fairs, undated information, and press-only leads stay `lead` until corroborated. Never infer dietary claims from food names or customer questions.
5. Import the review. Add confirmed, relevant missing foods to `src/data/2026/catalog.json` during each batch, with exact source citations. Enrich existing entries instead of duplicating flavors or synonyms; preserve existing source citations using `supportingSources`. Add verified accounts/sites to `src/data/2026/vendor-links.json`. Keep unresolved leads in research only. For current official fair pages explicitly listing 2026 menus, use the page as direct catalog evidence and record the access date; never invent a publication date to satisfy the dated-post research schema. Keep undated-page findings distinguished in the research notes. Record promoted IDs in a dated `promoted-items-*.json` file, run catalog tests, then sync the queue and regenerate the report. Price and opening-hours observations are dated and may change. Commit and push each validated batch before researching the next batch, per the user’s September 19 instruction.

Review statuses describe this attempt: `reviewed`, `inaccessible`, or `no-account-found`. The latter means the limited searches were unsuccessful, not that no account exists. Notes must distinguish a profile/grid scan from a caption review. Existing pilot examples and batch 001 are valid import templates.

Finding fields: `detail`, `url`, `confidence` (`lead` or `confirmed`), `kind` (`confirmation`, `new-item`, `detail`, `location`), `publishedOn`, `event`, `year`, `sourceType`. Optional `itemName`, `quantity`, and `priceUSD` support review. Confirmed findings require a publication date, event `The Big E`, year `2026`, and source type `vendor` or `fair`. These are metadata checks, not automated fact verification.

Account fields: `url`, `verified`, and, when verified, `evidenceUrl` and `evidence`. Review fields: `vendorId`, `checkedAt`, `status`, `searches`, `notes`, `accounts`, `findings`.

Keep `vendors-2026.json` as the durable state, `reviews/` as importable research records, and `report-2026.md` as the generated readable summary. Rebuild `next-batch.json` after recording progress. None of these files are imported by the visitor-facing app.
