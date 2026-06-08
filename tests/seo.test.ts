import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { GET as robotsGet } from "../src/pages/robots.txt";
import { GET as sitemapGet } from "../src/pages/sitemap.xml";

function read(file: string) {
  return readFileSync(file, "utf8");
}

describe("SEO metadata", () => {
  it("renders sitemap and generic OG metadata from the shared layout", () => {
    const layout = read("src/layouts/Layout.astro");

    expect(layout).toContain('<link rel="sitemap" href="/sitemap.xml" />');
    expect(layout).toContain(
      '<meta property="og:image" content="https://fontbook.dan.tw/og-image.png" />',
    );
    expect(layout).toContain('type="application/ld+json"');
    expect(layout).toContain("JSON.stringify");
  });

  it("provides font detail Dataset JSON-LD", () => {
    const fontPage = read("src/pages/fonts/[slug].astro");

    expect(fontPage).toContain('"@type": "Dataset"');
    expect(fontPage).toContain("schemaOrg={schemaOrg}");
    expect(fontPage).toContain("font.tags");
  });

  it("generates a static sitemap with production URLs", async () => {
    const response = await sitemapGet({} as Parameters<typeof sitemapGet>[0]);
    const xml = await response.text();

    expect(response.headers.get("Content-Type")).toBe("application/xml");
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain("<loc>https://fontbook.dan.tw/</loc>");
    expect(xml).toContain("<loc>https://fontbook.dan.tw/compare/</loc>");
    expect(xml).toContain("<loc>https://fontbook.dan.tw/licenses/</loc>");
    expect(xml).toContain("<loc>https://fontbook.dan.tw/fonts/lxgw-wenkai/</loc>");
  });

  it("exposes robots.txt with sitemap location", async () => {
    const response = await robotsGet({} as Parameters<typeof robotsGet>[0]);
    const text = await response.text();

    expect(response.headers.get("Content-Type")).toBe("text/plain");
    expect(text).toBe(`User-agent: *
Allow: /
Sitemap: https://fontbook.dan.tw/sitemap.xml
`);
  });
});
