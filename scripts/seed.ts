import "dotenv/config";
import { eq } from "drizzle-orm";
import { catalogFonts } from "../src/lib/catalog";
import { createDb } from "../src/lib/db";
import { fontLanguages, fonts, fontTags } from "../src/lib/db/schema";

const db = createDb();

for (const font of catalogFonts) {
  const [savedFont] = await db
    .insert(fonts)
    .values({
      slug: font.slug,
      name: font.name,
      displayName: font.displayName,
      description: font.description,
      license: font.license,
      sourceUrl: font.sourceUrl,
      repoUrl: font.repoUrl,
      homepageUrl: font.homepageUrl,
      author: font.author,
      category: font.category,
      isVariable: font.isVariable,
      cssFontFamily: font.cssFontFamily,
      previewCssUrl: font.previewCssUrl,
      notes: font.notes,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: fonts.slug,
      set: {
        name: font.name,
        displayName: font.displayName,
        description: font.description,
        license: font.license,
        sourceUrl: font.sourceUrl,
        repoUrl: font.repoUrl,
        homepageUrl: font.homepageUrl,
        author: font.author,
        category: font.category,
        isVariable: font.isVariable,
        cssFontFamily: font.cssFontFamily,
        previewCssUrl: font.previewCssUrl,
        notes: font.notes,
        updatedAt: new Date(),
      },
    })
    .returning({ id: fonts.id });

  if (!savedFont) {
    throw new Error(`Failed to save font ${font.slug}`);
  }

  await db.delete(fontLanguages).where(eq(fontLanguages.fontId, savedFont.id));
  await db.delete(fontTags).where(eq(fontTags.fontId, savedFont.id));

  if (font.languages.length > 0) {
    await db.insert(fontLanguages).values(
      font.languages.map((language) => ({
        fontId: savedFont.id,
        languageCode: language.languageCode,
        coverageLevel: language.coverageLevel,
        note: language.note,
      })),
    );
  }

  if (font.tags.length > 0) {
    await db.insert(fontTags).values(
      font.tags.map((tag) => ({
        fontId: savedFont.id,
        tag,
      })),
    );
  }
}

console.log(`Seeded ${catalogFonts.length} fonts.`);
