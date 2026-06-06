import { describe, expect, it } from "vitest";
import {
  getAllFonts,
  getFontBySlug,
  getFontsByLanguage,
  getLicenseGroups,
} from "../src/lib/db/queries";

describe("catalog queries", () => {
  it("returns the 12 seeded MVP fonts", async () => {
    const fonts = await getAllFonts();

    expect(fonts).toHaveLength(12);
    expect(fonts.map((font) => font.slug)).toContain("lxgw-wenkai");
    expect(fonts.every((font) => font.languages.length > 0)).toBe(true);
  });

  it("finds a font by slug with languages and tags", async () => {
    const font = await getFontBySlug("noto-sans-cjk");

    expect(font?.name).toBe("Noto Sans CJK");
    expect(font?.languages.map((language) => language.languageCode)).toEqual([
      "SC",
      "TC",
      "JP",
      "KR",
    ]);
    expect(font?.tags).toContain("pan-cjk");
  });

  it("filters fonts by language code", async () => {
    const fonts = await getFontsByLanguage("KR");

    expect(fonts.map((font) => font.slug)).toContain("pretendard");
    expect(fonts.map((font) => font.slug)).not.toContain("shippori-mincho");
  });

  it("groups fonts by license", async () => {
    const groups = await getLicenseGroups();

    expect(groups).toHaveLength(1);
    expect(groups[0]?.license).toBe("OFL-1.1");
    expect(groups[0]?.fonts).toHaveLength(12);
  });
});
