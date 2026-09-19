import { describe, expect, it } from "vitest";
import { getPageSeo, indexablePaths, renderSeoHead } from "./seo";

describe("search engine metadata", () => {
  it("gives vendor menus their own canonical, title and description", () => {
    const seo = getPageSeo("/vendors/annas-fried-dough");
    expect(seo.title).toContain("Anna’s Fried Dough");
    expect(seo.canonical).toBe("https://bigeeats.com/vendors/annas-fried-dough");
    expect(seo.description).toContain("East Road");
    expect(seo.robots).toBe("index, follow");
    expect(indexablePaths).toContain("/vendors/annas-fried-dough");
  });

  it("keeps search/filter and private plan URLs out of the index", () => {
    for (const url of ["/browse?q=chicken", "/browse?vendors=annas-fried-dough", "/vendors?q=Anna", "/plan?items=abc"]) {
      expect(getPageSeo(url).robots, url).toBe("noindex, follow");
    }
    expect(getPageSeo("/browse?vendors=annas-fried-dough").canonical).toBe("https://bigeeats.com/vendors/annas-fried-dough");
    expect(indexablePaths).not.toContain("/plan");
  });

  it("ignores tracking parameters and normalizes trailing slashes", () => {
    expect(getPageSeo("/vendors/annas-fried-dough/?utm_source=test")).toEqual(getPageSeo("/vendors/annas-fried-dough"));
  });

  it("does not index missing vendors or unknown routes", () => {
    for (const url of ["/vendors/missing", "/location/missing", "/missing"]) {
      expect(getPageSeo(url).robots).toBe("noindex, follow");
      expect(indexablePaths).not.toContain(url);
    }
  });

  it("outputs escaped metadata and factual site structured data", () => {
    const head = renderSeoHead(getPageSeo("/"));
    expect(head).toContain('rel="canonical" href="https://bigeeats.com/"');
    expect(head).toContain('application/ld+json');
    expect(head).toContain('"@type":"WebSite"');
    expect(head).not.toContain('AggregateRating');
    expect(renderSeoHead({ ...getPageSeo("/"), title: 'A < B & "C"' })).toContain('A &lt; B &amp; &quot;C&quot;');
  });
});
