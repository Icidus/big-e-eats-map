import { describe, expect, it } from "vitest";
import { escapeHtml, markerIcon } from "./markerIcon";

describe("escapeHtml", () => {
  it("escapes & < > \" '", () => {
    expect(escapeHtml(`& < > " '`)).toBe("&amp; &lt; &gt; &quot; &#39;");
  });
});

describe("markerIcon", () => {
  it("produces html with the escaped label, a count span, and the passed modifier class", () => {
    const icon = markerIcon("Tom & Jerry's", 3, ["is-estimated"]);

    expect(icon.options.html).toContain("Tom &amp; Jerry&#39;s");
    expect(icon.options.html).toContain('fair-map-marker-count">3<');
    expect(icon.options.html).toContain("is-estimated");
  });

  it("omits the count span when count is null", () => {
    const icon = markerIcon("Food Court", null, []);

    expect(icon.options.html).not.toContain("fair-map-marker-count");
  });

  it("drops empty-string modifiers", () => {
    const icon = markerIcon("Destination", null, ["is-destination", ""]);

    expect(icon.options.html).toContain('class="fair-map-marker is-destination">');
  });
});
