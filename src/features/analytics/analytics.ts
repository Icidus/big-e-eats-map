declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** GA4 Enhanced Measurement handles subsequent browser-history pageviews. */
export function initializeAnalytics(measurementId: string, hostname = window.location.hostname) {
  if (!/^G-[A-Z0-9]+$/.test(measurementId) || !["bigeeats.com", "www.bigeeats.com"].includes(hostname)) return;
  if (document.querySelector("script[data-google-analytics]")) return;

  window.dataLayer ??= [];
  window.gtag ??= function () { window.dataLayer!.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });

  const script = document.createElement("script");
  script.async = true;
  script.dataset.googleAnalytics = measurementId;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.append(script);
}
