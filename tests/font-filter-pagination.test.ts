import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync("src/components/FontFilterPanel.tsx", "utf8");

describe("FontFilterPanel pagination", () => {
  it("paginates filtered results while keeping counts based on all fonts", () => {
    expect(source).toContain("const PAGE_SIZE = 20");
    expect(source).toContain("const [currentPage, setCurrentPage] = useState(1)");
    expect(source).toContain("filteredFonts.slice(");
    expect(source).toContain("pagedFontSlugs.has(font.slug)");
    expect(source).toContain("filteredFonts.map((font)");
    expect(source).toContain('isCurrentPageFont ? "" : "hidden"');
    expect(source).toContain("顯示 {pagedFonts.length} / {filteredFonts.length} 個字體");
    expect(source).toContain("第 {currentPage} 頁，共 {totalPages} 頁");
    expect(source).toContain('className="join"');
  });
});
