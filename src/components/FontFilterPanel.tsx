import { ChevronDown, ChevronRight, Search } from "lucide-preact";
import { useMemo, useState } from "preact/hooks";
import type { Category, FontRecord, LanguageCode } from "../lib/catalog";
import {
  CATEGORIES,
  defaultPreviewText,
  LANGUAGE_CODES,
  LICENSE_FILTERS,
  type LicenseFilter,
} from "../lib/catalog";
import { Badge } from "./Badge";
import { FontPreview } from "./FontPreview";

interface FontFilterPanelProps {
  fonts: FontRecord[];
}

function licenseMatches(license: string, filter: LicenseFilter) {
  if (filter === "Other") {
    return !["OFL", "Apache", "MIT"].some((known) =>
      license.toLowerCase().includes(known.toLowerCase()),
    );
  }

  return license.toLowerCase().includes(filter.toLowerCase());
}

export function FontFilterPanel({ fonts }: FontFilterPanelProps) {
  const [query, setQuery] = useState("");
  const [previewText, setPreviewText] = useState(defaultPreviewText);
  const [language, setLanguage] = useState<LanguageCode | "all">("all");
  const [category, setCategory] = useState<Category | "all">("all");
  const [license, setLicense] = useState<LicenseFilter | "all">("all");
  const [sourceHan, setSourceHan] = useState<"all" | "yes" | "no">("all");
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  const filteredFonts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return fonts.filter((font) => {
      const matchesQuery =
        !normalizedQuery ||
        [font.name, font.displayName, font.author, ...font.tags]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(normalizedQuery));
      const matchesLanguage =
        language === "all" ||
        font.languages.some((entry) => entry.languageCode === language);
      const matchesCategory =
        category === "all" || font.category === category;
      const matchesLicense =
        license === "all" || licenseMatches(font.license, license);
      const matchesSourceHan =
        sourceHan === "all" ||
        (sourceHan === "yes" && font.isSourceHanDerivative) ||
        (sourceHan === "no" && !font.isSourceHanDerivative);

      return (
        matchesQuery && matchesLanguage && matchesCategory && matchesLicense && matchesSourceHan
      );
    });
  }, [category, fonts, language, license, query, sourceHan]);

  function toggleExpand(slug: string) {
    setExpandedSlug((prev) => (prev === slug ? null : slug));
  }

  return (
    <section className="space-y-8" aria-labelledby="catalog-heading">
      <div className="grid gap-4 rounded-lg border border-ink-200 bg-white/78 p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.06] lg:grid-cols-[1fr_1fr]">
        <label className="grid gap-2 text-sm font-medium text-ink-700 dark:text-ink-100">
          Custom preview text
          <input
            className="min-h-12 rounded-md border border-ink-200 bg-white px-4 text-base text-ink-900 outline-none transition focus:border-vermilion dark:border-white/10 dark:bg-ink-900 dark:text-ink-50"
            value={previewText}
            onInput={(event) =>
              setPreviewText((event.currentTarget as HTMLInputElement).value)
            }
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-ink-700 dark:text-ink-100">
          Search fonts
          <span className="relative">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-700 dark:text-ink-100"
            />
            <input
              className="min-h-12 w-full rounded-md border border-ink-200 bg-white py-2 pl-10 pr-4 text-base text-ink-900 outline-none transition focus:border-vermilion dark:border-white/10 dark:bg-ink-900 dark:text-ink-50"
              placeholder="Noto, WenKai, Gothic..."
              value={query}
              onInput={(event) =>
                setQuery((event.currentTarget as HTMLInputElement).value)
              }
            />
          </span>
        </label>
        <FilterSelect
          label="Language"
          value={language}
          options={LANGUAGE_CODES}
          onChange={(value) => setLanguage(value as LanguageCode | "all")}
        />
        <FilterSelect
          label="Category"
          value={category}
          options={CATEGORIES}
          onChange={(value) => setCategory(value as Category | "all")}
        />
        <FilterSelect
          label="License"
          value={license}
          options={LICENSE_FILTERS}
          onChange={(value) => setLicense(value as LicenseFilter | "all")}
        />
        <FilterSelect
          label="Source Han Derivative"
          value={sourceHan}
          options={["yes", "no"]}
          onChange={(value) => setSourceHan(value as "all" | "yes" | "no")}
        />
      </div>

      <div className="flex items-end justify-between gap-4">
        <div>
          <h2
            id="catalog-heading"
            className="text-2xl font-semibold tracking-normal text-ink-900 dark:text-ink-50"
          >
            Font Catalog
          </h2>
          <p className="mt-1 text-sm text-ink-700 dark:text-ink-100">
            {filteredFonts.length} of {fonts.length} fonts shown
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-ink-200 dark:border-white/10">
        {/* Header row */}
        <div className="grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-4 bg-ink-100/50 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-ink-700 dark:bg-white/5 dark:text-ink-100">
          <span>Name</span>
          <span className="w-20">Category</span>
          <span className="w-20">License</span>
          <span className="w-16">Languages</span>
          <span className="w-16">思源系</span>
          <span className="w-8" />
        </div>

        {filteredFonts.map((font) => {
          const isExpanded = expandedSlug === font.slug;
          return (
            <div
              key={font.slug}
              className={`border-t border-ink-200 dark:border-white/10 ${
                isExpanded
                  ? "bg-white dark:bg-white/[0.03]"
                  : "bg-white/70 hover:bg-white dark:bg-white/[0.02] dark:hover:bg-white/[0.04]"
              }`}
            >
              {/* Row */}
              <button
                className="grid w-full grid-cols-[1fr_auto_auto_auto_auto_auto] items-center gap-4 px-4 py-3 text-left transition"
                onClick={() => toggleExpand(font.slug)}
                aria-expanded={isExpanded}
              >
                <div className="min-w-0">
                  <a
                    className="text-base font-semibold text-ink-900 hover:text-vermilion dark:text-ink-50"
                    href={`/fonts/${font.slug}/`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {font.name}
                  </a>
                  {font.displayName && font.displayName !== font.name ? (
                    <p className="mt-0.5 truncate text-sm text-ink-700 dark:text-ink-100">
                      {font.displayName}
                    </p>
                  ) : null}
                </div>
                <span className="w-20">
                  <Badge tone="category">{font.category}</Badge>
                </span>
                <span className="w-20">
                  <Badge tone="license">{font.license}</Badge>
                </span>
                <span className="flex w-16 flex-wrap gap-1">
                  {font.languages.map((lang) => (
                    <Badge tone="language" key={lang.languageCode}>
                      {lang.languageCode}
                    </Badge>
                  ))}
                </span>
                <span className="w-16">
                  {font.isSourceHanDerivative ? (
                    <Badge tone="source-han">Yes</Badge>
                  ) : (
                    <span className="text-xs text-ink-200 dark:text-white/20">
                      —
                    </span>
                  )}
                </span>
                <span className="flex w-8 justify-center">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-ink-700 dark:text-ink-100" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-ink-700 dark:text-ink-100" />
                  )}
                </span>
              </button>

              {/* Expanded preview */}
              {isExpanded ? (
                <div className="border-t border-ink-200 px-4 py-5 dark:border-white/10">
                  <FontPreview
                    compact
                    defaultText={previewText}
                    font={font}
                    loadOnMount={true}
                    showControls={true}
                  />
                </div>
              ) : null}
            </div>
          );
        })}

        {filteredFonts.length === 0 ? (
          <p className="px-4 py-8 text-center text-ink-700 dark:text-ink-100">
            No fonts match the current filters.
          </p>
        ) : null}
      </div>
    </section>
  );
}

interface FilterSelectProps {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}

function FilterSelect({ label, value, options, onChange }: FilterSelectProps) {
  return (
    <label className="grid gap-2 text-sm font-medium text-ink-700 dark:text-ink-100">
      {label}
      <select
        className="min-h-12 rounded-md border border-ink-200 bg-white px-4 text-base capitalize text-ink-900 outline-none transition focus:border-vermilion dark:border-white/10 dark:bg-ink-900 dark:text-ink-50"
        value={value}
        onChange={(event) =>
          onChange((event.currentTarget as HTMLSelectElement).value)
        }
      >
        <option value="all">All</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
