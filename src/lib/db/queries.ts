import { catalogFonts, type FontRecord, type LanguageCode } from "../catalog";

export type FontWithRelations = FontRecord;

export interface LicenseGroup {
  license: string;
  fonts: FontWithRelations[];
}

export async function getAllFonts(): Promise<FontWithRelations[]> {
  return [...catalogFonts].sort((a, b) => a.name.localeCompare(b.name));
}

export async function getFontBySlug(
  slug: string,
): Promise<FontWithRelations | undefined> {
  return catalogFonts.find((font) => font.slug === slug);
}

export async function getFontsByLanguage(
  code: LanguageCode,
): Promise<FontWithRelations[]> {
  const fonts = await getAllFonts();
  return fonts.filter((font) =>
    font.languages.some((language) => language.languageCode === code),
  );
}

export async function getLicenseGroups(): Promise<LicenseGroup[]> {
  const fonts = await getAllFonts();
  const groups = new Map<string, FontWithRelations[]>();

  for (const font of fonts) {
    const group = groups.get(font.license) ?? [];
    group.push(font);
    groups.set(font.license, group);
  }

  return [...groups.entries()]
    .map(([license, groupedFonts]) => ({ license, fonts: groupedFonts }))
    .sort((a, b) => a.license.localeCompare(b.license));
}

export async function getStaticFontSlugs(): Promise<string[]> {
  const fonts = await getAllFonts();
  return fonts.map((font) => font.slug);
}
