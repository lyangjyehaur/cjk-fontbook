import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const uiFiles = [
  "src/components/FontFilterPanel.tsx",
  "src/components/CompareTool.tsx",
  "src/components/FontPreview.tsx",
  "src/components/Header.astro",
  "src/components/Footer.astro",
  "src/pages/index.astro",
  "src/pages/fonts/[slug].astro",
  "src/pages/compare.astro",
  "src/pages/licenses.astro",
  "src/lib/catalog.ts",
];

function readUiSource() {
  return uiFiles.map((file) => readFileSync(file, "utf8")).join("\n");
}

describe("Traditional Chinese UI copy", () => {
  it("contains localized catalog, navigation, detail, compare, and preview labels", () => {
    const source = readUiSource();

    expect(source).toContain("自訂預覽文字");
    expect(source).toContain("搜尋字體");
    expect(source).toContain('label="字形區別"');
    expect(source).toContain("<span>字形區別</span>");
    expect(source).toContain("傳承字形");
    expect(source).toContain("思源系");
    expect(source).toContain("字體目錄");
    expect(source).toContain("顯示 {filteredFonts.length} / {fonts.length} 個字體");
    expect(source).toContain("字體詳情");
    expect(source).toContain("比較字體");
    expect(source).toContain("授權條款");
    expect(source).toContain("開源中日韓字體");
    expect(source).toContain("探索開源中文字體、日文字體與韓文字體。");
    expect(source).toContain("預覽文字");
    expect(source).toContain("字級");
    expect(source).toContain("字重");
  });

  it("removes the English UI labels requested for localization", () => {
    const source = readUiSource();
    const removedLabels = [
      "Custom preview text",
      "Search fonts",
      "Source Han Derivative",
      "Font Catalog",
      "No fonts match the current filters.",
      "Font detail",
      "Compare Fonts",
      "Licenses",
      "Preview text",
      "Select at least one font to compare.",
    ];

    for (const label of removedLabels) {
      expect(source).not.toContain(label);
    }
  });

  it("does not show glyph distinction filters as language labels", () => {
    const filterPanel = readFileSync("src/components/FontFilterPanel.tsx", "utf8");

    expect(filterPanel).not.toContain('label="語言"');
    expect(filterPanel).not.toContain("<span>語言</span>");
    expect(filterPanel).not.toContain('label="傳承字形"');
    expect(filterPanel).toContain('label="思源系"');
    expect(filterPanel).toContain('label="字形區別"');
    expect(filterPanel).toContain("options={LANGUAGE_CODES}");
    expect(filterPanel).toContain("optionLabels={GLYPH_LABELS}");
    expect(filterPanel).toContain('aria-pressed={selectedGlyphs.includes(option)}');
    expect(filterPanel).toContain("onClear={() => setSelectedGlyphs([])}");
  });
});
