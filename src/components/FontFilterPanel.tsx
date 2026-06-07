import { Fragment } from "preact";
import { ChevronDown, ChevronRight, Search } from "lucide-preact";
import { useMemo, useState } from "preact/hooks";
import type { Category, FontRecord, LanguageCode } from "../lib/catalog";
import {
  CATEGORIES,
  defaultPreviewText,
  GLYPH_LABELS,
  LANGUAGE_CODES,
  LICENSE_FILTERS,
  type LicenseFilter,
} from "../lib/catalog";
import { FontPreview } from "./FontPreview";

interface FontFilterPanelProps {
  fonts: FontRecord[];
}

const optionLabels: Record<string, string> = {
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
  const [selectedGlyphs, setSelectedGlyphs] = useState<LanguageCode[]>([]);
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
      const matchesGlyphs =
        selectedGlyphs.length === 0 ||
        font.languages.some((entry) =>
          selectedGlyphs.includes(entry.languageCode),
        );
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
        matchesGlyphs &&
        matchesCategory &&
        matchesLicense &&
        matchesSourceHan
      );
    });
  }, [category, fonts, license, query, selectedGlyphs, sourceHan]);

  function toggleGlyph(glyph: LanguageCode) {
    setSelectedGlyphs((current) =>
      current.includes(glyph)
        ? current.filter((selectedGlyph) => selectedGlyph !== glyph)
        : [...current, glyph],
    );
  }

  function toggleExpand(slug: string) {
    setExpandedSlug((current) => (current === slug ? null : slug));
  }

  return (
    <section className="space-y-6" aria-labelledby="catalog-heading">
      <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body gap-0 p-5 sm:p-6">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <label className="form-control grid gap-2 text-sm font-medium">
              搜尋字體
              <span className="relative">
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-base-content/45"
                />
                <input
                  className="input input-bordered w-full pl-10"
                  placeholder="Noto, WenKai, Gothic..."
                  value={query}
                  onInput={(event) =>
                    setQuery((event.currentTarget as HTMLInputElement).value)
                  }
                />
              </span>
            </label>

            <label className="form-control grid gap-2 text-sm font-medium">
              自訂預覽文字
              <input
                className="input input-bordered w-full"
                value={previewText}
                onInput={(event) =>
                  setPreviewText(
                    (event.currentTarget as HTMLInputElement).value,
                  )
                }
              />
            </label>
          </div>

          <div className="divider my-5">篩選條件</div>

          <div className="grid gap-5 xl:grid-cols-[minmax(18rem,1.5fr)_repeat(3,minmax(9rem,1fr))]">
            <FilterChips
              label="字形區別"
              selectedGlyphs={selectedGlyphs}
              options={LANGUAGE_CODES}
              optionLabels={GLYPH_LABELS}
              onClear={() => setSelectedGlyphs([])}
              onToggle={toggleGlyph}
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

          <div className="divider my-5"></div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="catalog-heading" className="text-2xl font-semibold">
                字體目錄
              </h2>
              <p className="mt-1 text-sm text-base-content/65">
                顯示 {filteredFonts.length} / {fonts.length} 個字體
              </p>
            </div>
            <div className="stats stats-horizontal border border-base-300 bg-base-100 shadow-none">
              <div className="stat px-4 py-2">
                <div className="stat-title text-xs">目前結果</div>
                <div className="stat-value text-2xl">{filteredFonts.length}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100 shadow-sm">
        <table className="table table-zebra table-pin-rows min-w-[860px]">
          <thead>
            <tr>
              <th>名稱</th>
              <th>分類</th>
              <th>授權</th>
              <th><span>字形區別</span></th>
              <th>思源系</th>
            </tr>
          </thead>
          <tbody>
            {filteredFonts.map((font) => {
              const isExpanded = expandedSlug === font.slug;

              return (
                <Fragment key={font.slug}>
                  <tr
                    className="cursor-pointer transition hover:bg-base-200"
                    onClick={() => toggleExpand(font.slug)}
                    aria-expanded={isExpanded}
                  >
                    <td>
                      <div className="flex items-center gap-3">
                        {isExpanded ? (
                          <ChevronDown
                            aria-hidden="true"
                            className="h-4 w-4 shrink-0 text-base-content/50"
                          />
                        ) : (
                          <ChevronRight
                            aria-hidden="true"
                            className="h-4 w-4 shrink-0 text-base-content/50"
                          />
                        )}
                        <div className="min-w-0">
                          <a
                            className="font-semibold hover:text-primary"
                            href={`/fonts/${font.slug}/`}
                            onClick={(event) => event.stopPropagation()}
                          >
                            {font.name}
                          </a>
                          {font.displayName && font.displayName !== font.name ? (
                            <p className="mt-0.5 max-w-xs truncate text-sm text-base-content/60">
                              {font.displayName}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-primary badge-outline">
                        {optionLabels[font.category] ?? font.category}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-ghost badge-sm">
                        {font.license}
                      </span>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-1.5">
                        {font.languages.map((lang) => (
                          <span
                            className="badge badge-sm badge-outline"
                            key={lang.languageCode}
                          >
                            {GLYPH_LABELS[lang.languageCode]}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      {font.isSourceHanDerivative ? (
                        <span className="badge badge-accent badge-sm">
                          思源系
                        </span>
                      ) : (
                        <span className="text-base-content/35">-</span>
                      )}
                    </td>
                  </tr>
                  {isExpanded ? (
                    <tr>
                      <td colSpan={5} className="bg-base-100 p-4">
                        <FontPreview
                          compact
                          defaultText={previewText}
                          font={font}
                          loadOnMount={true}
                          showControls={true}
                        />
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              );
            })}

            {filteredFonts.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-base-content/60">
                  沒有符合條件的字體。
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
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

interface FilterChipsProps {
  label: string;
  selectedGlyphs: LanguageCode[];
  options: readonly LanguageCode[];
  optionLabels: Record<LanguageCode, string>;
  onClear: () => void;
  onToggle: (value: LanguageCode) => void;
}

function FilterChips({
  label,
  selectedGlyphs,
  options,
  optionLabels,
  onClear,
  onToggle,
}: FilterChipsProps) {
  return (
    <fieldset className="form-control grid gap-2 text-sm font-medium">
      <legend>{label}</legend>
      <form
        className="flex flex-wrap items-center gap-2"
        onSubmit={(event) => event.preventDefault()}
      >
        {options.map((option) => (
          <input
            key={option}
            type="checkbox"
            className="btn btn-sm"
            aria-label={optionLabels[option] ?? option}
            checked={selectedGlyphs.includes(option)}
            onChange={() => onToggle(option)}
          />
        ))}
        <button type="reset" className="btn btn-sm btn-ghost" onClick={onClear}>
          ×<span className="sr-only">清除篩選</span>
        </button>
      </form>
    </fieldset>
  );
}

function FilterSelect({ label, value, options, onChange }: FilterSelectProps) {
  return (
    <label className="form-control grid gap-2 text-sm font-medium">
      {label}
      <select
        className="select select-bordered select-sm"
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
