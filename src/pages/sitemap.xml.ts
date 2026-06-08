import type { APIRoute } from "astro";
import { getAllFonts } from "../lib/db/queries";

const SITE_URL = "https://fontbook.dan.tw";

export const GET: APIRoute = async () => {
  const fonts = await getAllFonts();
  const urls = [
    { loc: `${SITE_URL}/`, priority: "1.0" },
    { loc: `${SITE_URL}/compare/`, priority: "0.6" },
    { loc: `${SITE_URL}/licenses/`, priority: "0.5" },
    ...fonts.map((font) => ({
      loc: `${SITE_URL}/fonts/${font.slug}/`,
      priority: "0.8",
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) =>
      `  <url><loc>${url.loc}</loc><priority>${url.priority}</priority></url>`,
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
};
