import { beforeEach, expect, it } from "vitest";
import { initializeAnalytics } from "./analytics";

beforeEach(() => {
  document.querySelectorAll("script[data-google-analytics]").forEach((script) => script.remove());
  delete window.dataLayer;
  delete window.gtag;
});

it("does not load tracking for local development or an unconfigured ID", () => {
  initializeAnalytics("G-TEST123456", "localhost");
  initializeAnalytics("G-TEST123456", "127.0.0.1");
  initializeAnalytics("", "bigeeats.com");
  expect(document.querySelector("script[data-google-analytics]")).toBeNull();
  expect(window.dataLayer).toBeUndefined();
});

it("loads one tag and configures one initial pageview across repeated initialization", () => {
  initializeAnalytics("G-TEST123456", "bigeeats.com");
  initializeAnalytics("G-TEST123456", "bigeeats.com");
  const scripts = document.querySelectorAll<HTMLScriptElement>("script[data-google-analytics]");
  expect(scripts).toHaveLength(1);
  expect(scripts[0].async).toBe(true);
  expect(scripts[0].src).toBe("https://www.googletagmanager.com/gtag/js?id=G-TEST123456");
  const commands = window.dataLayer?.map((command) => Array.from(command as IArguments));
  expect(commands).toEqual([
    ["js", expect.any(Date)],
    ["config", "G-TEST123456", { allow_google_signals: false, allow_ad_personalization_signals: false }],
  ]);
});

it("preserves an existing data layer", () => {
  const existing = { event: "existing-event" };
  window.dataLayer = [existing];
  initializeAnalytics("G-TEST123456", "bigeeats.com");
  expect(window.dataLayer[0]).toBe(existing);
  expect(window.gtag).toBeTypeOf("function");
});
