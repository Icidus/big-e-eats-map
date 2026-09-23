# Google Analytics

The production site uses GA4 measurement ID `G-7T271C2QCG`.
The ID is public and is configured in `src/main.tsx`.

`src/features/analytics/analytics.ts` loads the asynchronous Google tag once,
only on `bigeeats.com` and `www.bigeeats.com`. Local previews and the secondary
GitHub Pages site do not send analytics. Google Signals and advertising
personalization signals are disabled in the configuration.

Pageviews use GA4's standard initial configuration and Enhanced Measurement.
In Admin → Data streams → the website → Enhanced measurement → Page views,
keep **Page changes based on browser history events** enabled. There is no
second manual React pageview tracker, so these two approaches cannot double-count
the same navigation. No custom food-save or directions events are added in this change.

To check collection, visit the live site and navigate to Browse and Vendors,
then check Reports → Realtime in GA4. Browser requests to Google's collection
endpoint verify delivery attempts; the GA4 dashboard confirms ingestion.
Ad blockers can prevent tracking.

References:

- [Google tag setup](https://developers.google.com/tag-platform/gtagjs/install)
- [Single-page application measurement](https://developers.google.com/analytics/devguides/collection/ga4/single-page-applications)
