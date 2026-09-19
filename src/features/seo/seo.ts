import { catalogItems, locations, locationsById, vendorOptions } from "@/features/catalog/catalog";

export const SITE_URL = "https://bigeeats.com";
export const SITE_NAME = "Big E Eats";
const homeTitle = "Big E 2026 Food Guide, Vendors & Fair Map | Big E Eats";
const homeDescription = `Explore ${catalogItems.length} Big E food and drink listings from ${vendorOptions.length} vendors in West Springfield, Massachusetts. Find new foods, menus and fair locations.`;

export interface PageSeo {
  title: string;
  description: string;
  canonical: string;
  robots: string;
}

export const indexablePaths = [
  "/", "/browse", "/vendors",
  ...vendorOptions.map((vendor) => `/vendors/${vendor.id}`),
  ...locations.map((location) => `/location/${location.id}`),
];

export function getPageSeo(input: string): PageSeo {
  const url = new URL(input, SITE_URL);
  const path = url.pathname.replace(/\/+$/, "") || "/";
  const seo: PageSeo = {
    title: homeTitle,
    description: homeDescription,
    canonical: `${SITE_URL}${path}`,
    robots: "index, follow",
  };
  if (path === "/vendors") {
    seo.title = "Big E 2026 Food Vendors & Menus | Big E Eats";
    seo.description = `Browse ${vendorOptions.length} Big E vendors and food stands. Find their 2026 menus, fair locations and verified website and social links.`;
  } else if (path === "/browse") {
    seo.title = "Browse Big E 2026 Foods & Drinks | Big E Eats";
    seo.description = homeDescription;
  } else if (path.startsWith("/vendors/")) {
    const vendor = vendorOptions.find((entry) => `/vendors/${entry.id}` === path);
    if (!vendor) return notFoundSeo(seo);
    const items = catalogItems.filter((item) => item.vendor === vendor.name);
    const stops = [...new Set(items.flatMap((item) => item.locationIds))].map((id) => locationsById.get(id)?.name).filter(Boolean);
    seo.title = `${vendor.name} at The Big E 2026: Menu | Big E Eats`;
    seo.description = `Explore ${items.length} food and drink listings from ${vendor.name} at The Big E 2026.${stops.length ? ` Find the stand at ${stops.join(", ")}.` : ""} View menu sources and plan your visit.`;
  } else if (path.startsWith("/location/")) {
    const location = locations.find((entry) => `/location/${entry.id}` === path);
    if (!location) return notFoundSeo(seo);
    seo.title = `${location.name} Food at The Big E 2026 | Big E Eats`;
    seo.description = `Find food and drink vendors at ${location.name} at The Big E 2026 in West Springfield. Browse sourced menu listings and find your next fair-food stop.`;
  } else if (path === "/map") {
    seo.title = "Big E 2026 Food Map & Nearby Vendors | Big E Eats";
    seo.description = "Explore food areas at The Big E in West Springfield. Find nearby vendors and plan your walk around the fairgrounds.";
  } else if (path === "/plan") {
    seo.title = "My Big E Food Plan | Big E Eats";
    seo.robots = "noindex, follow";
  } else if (path !== "/") {
    return notFoundSeo(seo);
  }

  // Tracking parameters do not create new pages; search/facet combinations do.
  const filters = ["q", "categories", "locations", "vendors", "tags", "dietary", "collection", "sort"];
  if ((path === "/browse" || path === "/vendors") && filters.some((key) => url.searchParams.has(key))) {
    seo.robots = "noindex, follow";
    const vendor = vendorOptions.find((entry) => entry.id === url.searchParams.get("vendors"));
    if (path === "/browse" && vendor && [...url.searchParams.keys()].filter((key) => filters.includes(key)).length === 1) {
      seo.canonical = `${SITE_URL}/vendors/${vendor.id}`;
    }
  }
  return seo;
}

function notFoundSeo(seo: PageSeo): PageSeo {
  return { ...seo, title: "Page Not Found | Big E Eats", description: "This page is not part of the Big E Eats food guide.", robots: "noindex, follow" };
}

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);
}

export function renderSeoHead(seo: PageSeo): string {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: `${SITE_URL}/`, description: homeDescription, inLanguage: "en-US" },
      { "@type": "WebPage", "@id": seo.canonical, url: seo.canonical, name: seo.title, description: seo.description, isPartOf: { "@id": `${SITE_URL}/#website` }, inLanguage: "en-US" },
    ],
  };
  return `<title>${escapeHtml(seo.title)}</title>
<meta name="description" content="${escapeHtml(seo.description)}" />
<meta name="robots" content="${seo.robots}" />
<link rel="canonical" href="${escapeHtml(seo.canonical)}" />
<meta property="og:title" content="${escapeHtml(seo.title)}" />
<meta property="og:description" content="${escapeHtml(seo.description)}" />
<meta property="og:url" content="${escapeHtml(seo.canonical)}" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="${SITE_NAME}" />
<meta property="og:image" content="${SITE_URL}/icon-512.png" />
<meta property="og:image:width" content="512" />
<meta property="og:image:height" content="512" />
<meta property="og:image:alt" content="Big E Eats food guide" />
<meta name="twitter:card" content="summary" />
<meta name="twitter:title" content="${escapeHtml(seo.title)}" />
<meta name="twitter:description" content="${escapeHtml(seo.description)}" />
<meta name="twitter:image" content="${SITE_URL}/icon-512.png" />
<script type="application/ld+json">${JSON.stringify(structuredData).replace(/</g, "\\u003c")}</script>`;
}
