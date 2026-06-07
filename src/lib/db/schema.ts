import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const fonts = pgTable("fonts", {
  id: serial("id").primaryKey(),
  slug: text("slug").unique().notNull(),
  name: text("name").notNull(),
  displayName: text("display_name"),
  description: text("description"),
  license: text("license"),
  sourceUrl: text("source_url"),
  repoUrl: text("repo_url"),
  homepageUrl: text("homepage_url"),
  author: text("author"),
  category: text("category"),
  isVariable: boolean("is_variable").default(false),
  isSourceHanDerivative: boolean("is_source_han_derivative").default(false),
  isHeritageGlyph: boolean("is_heritage_glyph").default(false),
  cssFontFamily: text("css_font_family"),
  previewCssUrl: text("preview_css_url"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const fontLanguages = pgTable("font_languages", {
  id: serial("id").primaryKey(),
  fontId: integer("font_id").references(() => fonts.id, {
    onDelete: "cascade",
  }),
  languageCode: text("language_code").notNull(),
  coverageLevel: text("coverage_level"),
  note: text("note"),
});

export const fontTags = pgTable("font_tags", {
  id: serial("id").primaryKey(),
  fontId: integer("font_id").references(() => fonts.id, {
    onDelete: "cascade",
  }),
  tag: text("tag").notNull(),
});
