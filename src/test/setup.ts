import "@testing-library/jest-dom/vitest";

// Some test files opt into the plain "node" environment (no window/DOM at all), so guard
// these jsdom-only shims — this setup file still runs there as a global setupFile.
if (typeof window !== "undefined") {
  // jsdom lacks pointer-capture and scroll APIs that vaul's drawer relies on.
  window.HTMLElement.prototype.setPointerCapture = window.HTMLElement.prototype.setPointerCapture ?? (() => {});
  window.HTMLElement.prototype.releasePointerCapture = window.HTMLElement.prototype.releasePointerCapture ?? (() => {});
  window.HTMLElement.prototype.hasPointerCapture = window.HTMLElement.prototype.hasPointerCapture ?? (() => false);
  window.HTMLElement.prototype.scrollIntoView = window.HTMLElement.prototype.scrollIntoView ?? (() => {});

  // jsdom also lacks matchMedia, which vaul's drawer checks for standalone/PWA display mode.
  window.matchMedia = window.matchMedia ?? ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }) as MediaQueryList);

  // vaul injects a real <style> tag with @keyframes and per-data-state animation-name rules.
  // jsdom's CSSOM matches those selectors (getComputedStyle reports a real, changing
  // animationName), which trips Radix's Presence into an "unmountSuspended" state that waits
  // for a real `animationend` event — an event jsdom never fires, since it has no animation
  // engine. Left alone, closed drawers/dialogs never actually leave the DOM in tests, so
  // focus-restore-on-close assertions hang forever. Reporting "no animation" here restores
  // Presence's synchronous unmount path.
  const nativeGetComputedStyle = window.getComputedStyle.bind(window);
  window.getComputedStyle = ((element: Element, pseudoElt?: string | null) => {
    const style = nativeGetComputedStyle(element, pseudoElt);
    return new Proxy(style, {
      get(target, prop, receiver) {
        if (prop === "animationName") return "none";
        return Reflect.get(target, prop, receiver);
      },
    });
  }) as typeof window.getComputedStyle;
}
