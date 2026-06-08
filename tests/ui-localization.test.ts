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
    expect(source).toContain("顯示 {pagedFonts.length} / {filteredFonts.length} 個字體");
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
    expect(filterPanel).toContain('<span class="label-text">思源系</span>');
    expect(filterPanel).toContain('label="字形區別"');
    expect(filterPanel).toContain("options={LANGUAGE_CODES}");
    expect(filterPanel).toContain("optionLabels={GLYPH_LABELS}");
    expect(filterPanel).toContain('type="checkbox"');
    expect(filterPanel).toContain("aria-label={optionLabels[option] ?? option}");
    expect(filterPanel).toContain('type="reset"');
    expect(filterPanel).toContain("清除篩選");
    expect(filterPanel).not.toContain('aria-pressed={selectedGlyphs.includes(option)}');
    expect(filterPanel).not.toContain(">全部</button>");
  });

  it("contains localized density mode labels for the catalog workbench", () => {
    const filterPanel = readFileSync("src/components/FontFilterPanel.tsx", "utf8");

    expect(filterPanel).toContain("Catalog Workbench");
    expect(filterPanel).toContain("檢視密度");
    expect(filterPanel).toContain("舒適");
    expect(filterPanel).toContain("緊湊");
    expect(filterPanel).toContain("緊湊模式適合快速掃描");
    expect(filterPanel).toContain("舒適模式會直接露出 specimen");
  });

  it("contains localized compare shortlist workflow labels", () => {
    const filterPanel = readFileSync("src/components/FontFilterPanel.tsx", "utf8");
    const compareTool = readFileSync("src/components/CompareTool.tsx", "utf8");

    expect(filterPanel).toContain("COMPARE_SHORTLIST_STORAGE_KEY");
    expect(filterPanel).toContain("加入比較");
    expect(filterPanel).toContain("已加入");
    expect(filterPanel).toContain("比較清單");
    expect(filterPanel).toContain("查看比較");
    expect(filterPanel).toContain("fixed inset-x-0 bottom-0");
    expect(filterPanel).toContain("pb-28");
    expect(compareTool).toContain("COMPARE_SHORTLIST_STORAGE_KEY");
    expect(compareTool).toContain("localStorage.getItem(COMPARE_SHORTLIST_STORAGE_KEY)");
    expect(compareTool).toContain("從目錄帶入的比較清單");
  });

  it("contains localized compare workbench labels", () => {
    const compareTool = readFileSync("src/components/CompareTool.tsx", "utf8");

    expect(compareTool).toContain("Comparison Workbench");
    expect(compareTool).toContain("比較控制");
    expect(compareTool).toContain("並排檢視");
    expect(compareTool).toContain("共同文字");
    expect(compareTool).toContain("比較字級");
    expect(compareTool).toContain("清空比較");
    expect(compareTool).toContain("grid gap-4 xl:grid-cols-[18rem_minmax(0,1fr)]");
  });

  it("contains localized detail and license workbench labels", () => {
    const detailPage = readFileSync("src/pages/fonts/[slug].astro", "utf8");
    const licensesPage = readFileSync("src/pages/licenses.astro", "utf8");

    expect(detailPage).toContain("Detail Workbench");
    expect(detailPage).toContain("快速操作");
    expect(detailPage).toContain("字體識別");
    expect(detailPage).toContain("主要預覽");
    expect(detailPage).toContain("外部資源");
    expect(detailPage).toContain("使用片段");
    expect(detailPage).toContain("xl:grid-cols-[18rem_minmax(0,1fr)]");

    expect(licensesPage).toContain("License Workbench");
    expect(licensesPage).toContain("授權總覽");
    expect(licensesPage).toContain("授權分組");
    expect(licensesPage).toContain("總字體數");
    expect(licensesPage).toContain("licenseGroups.reduce");
  });
});
