import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

function read(file: string) {
  return readFileSync(file, "utf8");
}

describe("emfont integration", () => {
  it("loads emfont globally before the closing body", () => {
    const layout = read("src/layouts/Layout.astro");

    expect(layout).toContain(
      '<script src="https://font.emtech.cc/emfont.js"></script>',
    );
    expect(layout).toContain("emfont?.init?.();");
    expect(layout.indexOf("emfont.js")).toBeLessThan(layout.indexOf("</body>"));
  });

  it("adds the emfont slug class to the preview text container", () => {
    const preview = read("src/components/FontPreview.tsx");

    expect(preview).toContain("emfont-${font.slug}");
    expect(preview).toContain("fontFamily: loaded ? font.cssFontFamily : undefined");
  });
});
