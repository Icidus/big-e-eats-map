# Google Search setup

The preferred site is **https://bigeeats.com/**. GitHub Pages is a secondary deployment and points its canonical tags at the preferred domain.

## What the build publishes

`npm run build` generates real HTML for the homepage, food browse page, vendor directory, every vendor menu, and each food location. It generates `sitemap.xml` from the same route list and validates every listed page. Catalog updates automatically flow into these pages at the next build. The current catalog generates 204 indexable pages.

Each page has a title, description, canonical URL, Open Graph/Twitter metadata, and factual WebSite/WebPage JSON-LD. No ratings, prices, business ownership, or rich-result eligibility are invented. Search and filter combinations, personal plans, and missing pages use `noindex, follow`. Query-based vendor menus remain usable; the directory links to `/vendors/:id` as the preferred menu URL.

Cloudflare uses `404-page` fallback and `drop-trailing-slash` HTML handling so preferred URLs return content directly and unknown URLs return 404.

The static pages use the same React components as the application. JavaScript enables search, saving, maps, and other interactions. Food content and vendor links are available in the initial HTML. Map and plan routes have their own HTML entry files; `404.html` is a genuine missing-page template. Do not restore the old workflow step that copies the homepage over `404.html`.

## One-time owner steps

1. Open [Google Search Console](https://search.google.com/search-console) and add the **Domain property** `bigeeats.com`, or select it if it is already verified.
2. Follow Google's [ownership verification instructions](https://support.google.com/webmasters/answer/9008080). For a Domain property, add the exact DNS verification record Google supplies through your DNS provider. Keep the verification record after approval. Never commit account credentials.
3. In that property's **Sitemaps** report, submit `https://bigeeats.com/sitemap.xml`. See [Google's sitemap instructions](https://support.google.com/webmasters/answer/7451001).
4. Inspect the homepage and a vendor URL such as `https://bigeeats.com/vendors/annas-fried-dough` with URL Inspection. Run a live test and request indexing for those representative pages. Submit the sitemap for the complete set.
5. Monitor Page indexing, sitemap processing, and performance reports. Submission is a discovery request, not a guarantee of indexing or rankings.

Search Console verification/submission requires the owner's Google account. The application build does not perform either step.

## Validation and maintenance

- `npm test`: route metadata, vendor menus, and existing application behavior.
- `npm run build`: prerendering, source HTML, canonical and sitemap validation, plus legacy-asset checks.
- `BASE_PATH=/big-e-eats-map/ npm run build`: secondary GitHub Pages deployment.
- Check HTTP status, source HTML, and rendered behavior on the preferred domain after deployment. Valid vendor/location pages should return 200; unknown pages should return 404.
- If the preferred domain changes, update `SITE_URL` in `src/features/seo/seo.ts` and the sitemap URL in `public/robots.txt` together, then configure host redirects.
- Keep titles, fair year, menus, citations and location descriptions accurate. Do not update sitemap modification dates just to suggest freshness; the sitemap currently omits `lastmod`.

Implementation follows [Google's JavaScript SEO guidance](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics) and [canonical URL guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).
