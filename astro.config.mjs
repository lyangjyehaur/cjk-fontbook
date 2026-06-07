import preact from "@astrojs/preact";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",
  integrations: [preact(), tailwind()],
  site: "https://fontbook.dan.tw",
});
