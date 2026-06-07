import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

function read(file: string) {
  return readFileSync(file, "utf8");
}

describe("DaisyUI integration", () => {
  it("registers DaisyUI and applies the site theme", () => {
    expect(read("tailwind.config.mjs")).toContain("daisyui");
    expect(read("src/layouts/Layout.astro")).toContain('data-theme="winter"');
  });

  it("uses DaisyUI primitives in the main UI components", () => {
    const source = [
      "src/components/FontFilterPanel.tsx",
      "src/components/FontPreview.tsx",
      "src/components/CompareTool.tsx",
      "src/components/FontCard.tsx",
      "src/components/Badge.tsx",
      "src/components/Header.astro",
      "src/components/Footer.astro",
    ]
      .map(read)
      .join("\n");

    for (const className of [
      "card",
      "btn",
      "btn-sm",
      "btn-outline",
      "btn-active",
      "input",
      "select",
      "textarea",
      "range",
      "badge",
      "navbar",
      "footer",
    ]) {
      expect(source).toContain(className);
    }
  });
});
