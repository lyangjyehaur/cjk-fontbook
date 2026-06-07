import { ChevronDown, ChevronRight, Search } from "lucide-preact";
import { useMemo, useState } from "preact/hooks";
import type { Category, FontRecord, LanguageCode } from "../lib/catalog";
import {
  CATEGORIES,
  defaultPreviewText,
  LANGUAGE_CODES,
  LICENSE_FILTERS,
  REGION_LABELS,
  type LicenseFilter,
} from "../lib/catalog";
import { Badge } from "./Badge";
import { FontPreview } from "./FontPreview";

interface FontFilterPanelProps {
  fonts: FontRecord[];
}

const listGridClass =
  "grid-cols-[minmax(14rem,1.35fr)_minmax(5.5rem,0.65fr)_minmax(6.5rem,0.7fr)_minmax(10rem,1fr)_2rem]";

const defaultOptionLabels: Record<string, string> = {
  all: "全部",
  yes: "是",
  no: "否",
  Other: "其他",
  sans: "無襯線",
  serif: "襯線",
  rounded: "圓體",
  mono: "等寬",
  handwriting: "手寫",
  pixel: "點陣",
};

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
        (sourceHan === "yes"
          ? font.isSourceHanDerivative
          : !font.isSourceHanDerivative);

      return (
        matchesQuery &&
        matchesLanguage &&
        matchesCategory &&
        matchesLicense &&
        matchesSourceHan
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
          自訂預覽文字
          <input
            className="min-h-12 rounded-md border border-ink-200 bg-white px-4 text-base text-ink-900 outline-none transition focus:border-vermilion dark:border-white/10 dark:bg-ink-900 dark:text-ink-50"
            value={previewText}
            onInput={(event) =>
              setPreviewText((event.currentTarget as HTMLInputElement).value)
            }
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-ink-700 dark:text-ink-100">
          搜尋字體
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
          label="地區"
          value={language}
          options={LANGUAGE_CODES}
          optionLabels={REGION_LABELS}
          onChange={(value) => setLanguage(value as LanguageCode | "all")}
        />
        <FilterSelect
          label="分類"
          value={category}
          options={CATEGORIES}
          onChange={(value) => setCategory(value as Category | "all")}
        />
        <FilterSelect
          label="授權"
          value={license}
          options={LICENSE_FILTERS}
          onChange={(value) => setLicense(value as LicenseFilter | "all")}
        />
        <FilterSelect
          label="思源系"
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
            字體目錄
          </h2>
          <p className="mt-1 text-sm text-ink-700 dark:text-ink-100">
            顯示 {filteredFonts.length} / {fonts.length} 個字體
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-ink-200 dark:border-white/10">
        {/* Header row */}
        <div className={`grid min-w-[760px] ${listGridClass} gap-3 bg-ink-100/50 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-ink-700 dark:bg-white/5 dark:text-ink-100`}>
          <span>名稱</span>
          <span>分類</span>
          <span>授權</span>
          <span>地區</span>
          <span />
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
                className={`grid min-w-[760px] w-full ${listGridClass} items-center gap-3 px-4 py-3 text-left transition`}
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
                <span className="min-w-0">
                  <Badge tone="category">{defaultOptionLabels[font.category] ?? font.category}</Badge>
                </span>
                <span className="min-w-0">
                  <Badge tone="license">{font.license}</Badge>
                </span>
                <span className="flex min-w-0 flex-wrap gap-1">
                  {font.languages.map((lang) => (
                    <Badge tone="language" key={lang.languageCode}>
                      {REGION_LABELS[lang.languageCode]}
                    </Badge>
                  ))}
                  {font.isSourceHanDerivative ? (
                    <Badge tone="language">思源系</Badge>
                  ) : null}
                </span>
                <span className="flex justify-center">
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
            沒有符合條件的字體。
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
  optionLabels?: Record<string, string>;
  onChange: (value: string) => void;
}

function FilterSelect({
  label,
  value,
  options,
  optionLabels = defaultOptionLabels,
  onChange,
}: FilterSelectProps) {
  return (
    <label className="grid gap-2 text-sm font-medium text-ink-700 dark:text-ink-100">
      {label}
      <select
        className="min-h-12 rounded-md border border-ink-200 bg-white px-4 text-base text-ink-900 outline-none transition focus:border-vermilion dark:border-white/10 dark:bg-ink-900 dark:text-ink-50"
        value={value}
        onChange={(event) =>
          onChange((event.currentTarget as HTMLSelectElement).value)
        }
      >
        <option value="all">全部</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {optionLabels[option] ?? option}
          </option>
        ))}
      </select>
    </label>
  );
}
