import { describe, expect, it } from "vitest";
import {
  LANGUAGE_CODES,
  REGION_LABELS,
  type LanguageCode,
} from "../src/lib/catalog";
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

  it("defines special regions as language codes with localized labels", () => {
    expect(LANGUAGE_CODES).toEqual([
      "SC",
      "TC-TW",
      "TC-HK",
      "JP",
      "KR",
      "HERITAGE",
    ]);
    expect(REGION_LABELS).toEqual({
      SC: "簡體",
      "TC-TW": "繁體（臺灣）",
      "TC-HK": "繁體（香港）",
      JP: "日文",
      KR: "韓文",
      HERITAGE: "傳承字形",
    } satisfies Record<LanguageCode, string>);
  });

  it("finds a font by slug with languages and tags", async () => {
    const font = await getFontBySlug("noto-sans-cjk");

    expect(font?.name).toBe("Noto Sans CJK");
    expect(font?.languages.map((language) => language.languageCode)).toEqual([
      "SC",
      "TC-TW",
      "TC-HK",
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

  it("tracks Source Han derivatives as a font attribute", async () => {
    const fonts = await getAllFonts();

    expect(
      fonts
        .filter((font) => font.isSourceHanDerivative)
        .map((font) => font.slug),
    ).toEqual([
      "pretendard",
      "sarasa-gothic",
    ]);
    expect(
      fonts.some((font) =>
        font.languages.some(
          (language) => String(language.languageCode) === "SOURCE-HAN",
        ),
      ),
    ).toBe(false);
  });

  it("groups fonts by license", async () => {
    const groups = await getLicenseGroups();

    expect(groups).toHaveLength(1);
    expect(groups[0]?.license).toBe("OFL-1.1");
    expect(groups[0]?.fonts).toHaveLength(12);
  });
});
