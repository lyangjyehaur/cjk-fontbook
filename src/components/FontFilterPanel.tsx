import { Fragment } from "preact";
import { ChevronDown, ChevronRight, RotateCcw, Search } from "lucide-preact";
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
import { Badge } from "./Badge";
import { FontPreview } from "./FontPreview";

interface FontFilterPanelProps {
  fonts: FontRecord[];
}

const PAGE_SIZE = 20;

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
  const [currentPage, setCurrentPage] = useState(1);

  const filteredFonts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return fonts.filter((font) => {
      const matchesQuery =
        !normalizedQuery ||
        [font.name, font.displayName, font.author, font.license, ...font.tags]
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

  const totalPages = Math.max(1, Math.ceil(filteredFonts.length / PAGE_SIZE));
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pagedFonts = filteredFonts.slice(pageStart, pageStart + PAGE_SIZE);
  const visiblePageItems = useMemo<(number | "ellipsis")[]>(() => {
    const pageNumbers = new Set(
      [1, currentPage - 1, currentPage, currentPage + 1, totalPages].filter(
        (page) => page >= 1 && page <= totalPages,
      ),
    );
    const sortedPageNumbers = [...pageNumbers].sort((a, b) => a - b);

    return sortedPageNumbers.flatMap((page, index) => {
      const previousPage = sortedPageNumbers[index - 1];
      return previousPage !== undefined && page - previousPage > 1
        ? ["ellipsis", page]
        : [page];
    });
  }, [currentPage, totalPages]);

  function resetPage() {
    setCurrentPage(1);
  }

  function resetFilters() {
    setQuery("");
    setSelectedGlyphs([]);
    setCategory("all");
    setLicense("all");
    setSourceHan("all");
    setExpandedSlug(null);
    setCurrentPage(1);
  }

  function toggleGlyph(glyph: LanguageCode) {
    resetPage();
    setSelectedGlyphs((current) =>
      current.includes(glyph)
        ? current.filter((selectedGlyph) => selectedGlyph !== glyph)
        : [...current, glyph],
    );
  }

  return (
    <section
      className="grid gap-6 lg:grid-cols-[17rem_minmax(0,1fr)]"
      aria-labelledby="catalog-heading"
    >
      <aside className="lg:sticky lg:top-20 lg:self-start" aria-label="字體篩選">
        <div className="border border-base-300 bg-base-100 p-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold">篩選</h2>
            <button
              type="button"
              className="btn btn-ghost btn-xs"
              onClick={resetFilters}
            >
              <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />
              重設
            </button>
          </div>

          <div className="mt-4 grid gap-4">
            <label className="form-control grid gap-2 text-sm font-medium">
              搜尋
              <span className="relative">
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-base-content/45"
                />
                <input
                  className="input input-sm w-full pl-10"
                  placeholder="名稱、作者、標籤"
                  value={query}
                  onInput={(event) => {
                    resetPage();
                    setQuery((event.currentTarget as HTMLInputElement).value);
                  }}
                />
              </span>
            </label>

            <label className="form-control grid gap-2 text-sm font-medium">
              預覽文字
              <textarea
                className="textarea textarea-sm min-h-28 resize-y"
                value={previewText}
                onInput={(event) =>
                  setPreviewText(
                    (event.currentTarget as HTMLTextAreaElement).value,
                  )
                }
              />
            </label>

            <FilterSelect
              label="分類"
              value={category}
              options={CATEGORIES}
              onChange={(value) => {
                resetPage();
                setCategory(value as Category | "all");
              }}
            />
            <FilterSelect
              label="授權"
              value={license}
              options={LICENSE_FILTERS}
              onChange={(value) => {
                resetPage();
                setLicense(value as LicenseFilter | "all");
              }}
            />
            <FilterSelect
              label="思源系"
              value={sourceHan}
              options={["yes", "no"]}
              onChange={(value) => {
                resetPage();
                setSourceHan(value as "all" | "yes" | "no");
              }}
            />

              <FilterChips
                label="字形區別"
                selectedGlyphs={selectedGlyphs}
                options={LANGUAGE_CODES}
                optionLabels={GLYPH_LABELS}
                onClear={() => {
                  resetPage();
                  setSelectedGlyphs([]);
                }}
                onToggle={toggleGlyph}
              />
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="catalog-heading" className="text-lg font-semibold">
              字體目錄
            </h2>
            <p className="mt-1 text-sm text-base-content/65">
              顯示 {pagedFonts.length} / {filteredFonts.length}，總計 {fonts.length} 款
            </p>
          </div>
          <p className="text-sm text-base-content/65">
            點開列首按鈕查看同列預覽。
          </p>
        </div>

        <div className="overflow-x-auto border border-base-300 bg-base-100">
          <table className="table table-sm min-w-[920px]">
            <thead>
              <tr>
                <th className="w-10"></th>
                <th>名稱</th>
                <th>分類</th>
                <th>授權</th>
                <th><span>字形區別</span></th>
                <th>作者</th>
                <th>思源系</th>
              </tr>
            </thead>
            <tbody>
              {pagedFonts.map((font) => {
                const isExpanded = expandedSlug === font.slug;

                return (
                  <Fragment key={font.slug}>
                    <tr className="align-top hover:bg-base-200">
                      <td>
                        <button
                          type="button"
                          className="btn btn-ghost btn-xs btn-square"
                          aria-label={`${isExpanded ? "收合" : "展開"} ${font.name} 預覽`}
                          aria-expanded={isExpanded}
                          onClick={() =>
                            setExpandedSlug(isExpanded ? null : font.slug)
                          }
                        >
                          {isExpanded ? (
                            <ChevronDown aria-hidden="true" className="h-4 w-4" />
                          ) : (
                            <ChevronRight aria-hidden="true" className="h-4 w-4" />
                          )}
                        </button>
                      </td>
                      <td>
                        <a
                          className="font-semibold hover:text-vermilion focus:text-vermilion"
                          href={`/fonts/${font.slug}/`}
                        >
                          {font.name}
                        </a>
                        {font.displayName && font.displayName !== font.name ? (
                          <p className="mt-0.5 max-w-sm truncate text-sm text-base-content/60">
                            {font.displayName}
                          </p>
                        ) : null}
                      </td>
                      <td>
                        <Badge tone="category">
                          {optionLabels[font.category] ?? font.category}
                        </Badge>
                      </td>
                      <td>
                        <Badge tone="license">{font.license}</Badge>
                      </td>
                      <td>
                        <div className="flex flex-wrap gap-1.5">
                          {font.languages.map((lang) => (
                            <Badge tone="language" key={lang.languageCode}>
                              {GLYPH_LABELS[lang.languageCode]}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="text-base-content/70">
                        {font.author ?? "未知"}
                      </td>
                      <td>
                        {font.isSourceHanDerivative ? (
                          <Badge tone="accent">是</Badge>
                        ) : (
                          <span className="text-base-content/35">否</span>
                        )}
                      </td>
                    </tr>
                    {isExpanded ? (
                      <tr>
                        <td colSpan={7} className="bg-base-100 p-0">
                          <div className="collapse collapse-open">
                            <div className="collapse-content p-4">
                              <FontPreview
                                compact
                                defaultText={previewText}
                                font={font}
                                loadOnMount={false}
                                showControls={false}
                                surface="plain"
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                );
              })}

              {pagedFonts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-base-content/60">
                    沒有符合條件的字體。
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-base-content/60">
            第 {currentPage} / {totalPages} 頁
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="btn btn-sm btn-outline"
              aria-label="上一頁"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              上一頁
            </button>
            {visiblePageItems.map((item, index) =>
              item === "ellipsis" ? (
                <span
                  key={`ellipsis-${index}`}
                  className="btn btn-sm btn-disabled"
                >
                  ...
                </span>
              ) : (
                <button
                  key={item}
                  type="button"
                  className={`btn btn-sm ${item === currentPage ? "border-vermilion bg-vermilion text-white hover:border-vermilion hover:bg-vermilion/90" : "btn-outline"}`}
                  aria-current={item === currentPage ? "page" : undefined}
                  aria-label={`前往第 ${item} 頁`}
                  onClick={() => setCurrentPage(item)}
                >
                  {item}
                </button>
              ),
            )}
            <button
              type="button"
              className="btn btn-sm btn-outline"
              aria-label="下一頁"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              下一頁
            </button>
          </div>
        </div>
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
      <div className="grid gap-1.5">
        {options.map((option) => {
          const checked = selectedGlyphs.includes(option);
          return (
            <label
              key={option}
              className={`btn btn-sm justify-start ${checked ? "border-vermilion bg-vermilion text-white hover:border-vermilion hover:bg-vermilion/90" : "btn-outline"}`}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={checked}
                aria-label={optionLabels[option] ?? option}
                onChange={() => onToggle(option)}
              />
              {optionLabels[option] ?? option}
            </label>
          );
        })}
        {selectedGlyphs.length > 0 ? (
          <button type="reset" className="btn btn-ghost btn-sm justify-start" onClick={onClear}>
            清除篩選
          </button>
        ) : null}
      </div>
    </fieldset>
  );
}

function FilterSelect({ label, value, options, onChange }: FilterSelectProps) {
  return (
    <label className="form-control grid gap-2 text-sm font-medium">
      {label}
      <select
        className="select select-sm w-full"
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
