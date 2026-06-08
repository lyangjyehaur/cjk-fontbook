import {
  AlignJustify,
  Check,
  LayoutList,
  Plus,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-preact";
import { useEffect, useMemo, useState } from "preact/hooks";
import type { Category, FontRecord, LanguageCode } from "../lib/catalog";
import { CATEGORIES, GLYPH_LABELS, LANGUAGE_CODES } from "../lib/catalog";
import Badge from "./Badge";
import FontPreview from "./FontPreview";

interface FontFilterPanelProps {
  fonts: FontRecord[];
}

interface ChipGroupProps<T extends string> {
  label: string;
  options: readonly T[];
  optionLabels: Record<T, string>;
  selected: T[];
  onToggle: (option: T) => void;
}

const CATEGORY_LABELS: Record<Category, string> = {
  sans: "黑體",
  serif: "宋明體",
  rounded: "圓體",
  mono: "等寬",
  handwriting: "手寫",
  pixel: "點陣",
};

const SOURCE_HAN_OPTIONS = [
  { value: "all", label: "全部" },
  { value: "yes", label: "思源衍生" },
  { value: "no", label: "非思源衍生" },
] as const;

const PAGE_SIZE = 20;
const DEFAULT_PREVIEW = "永東國酬愛鬱靈鷹 かな交じり 한글 Typography";
const VIEW_MODE_STORAGE_KEY = "cjk-fontbook-view-mode";
const COMPARE_SHORTLIST_STORAGE_KEY = "cjk-fontbook-compare-shortlist";
const COMPARE_SHORTLIST_LIMIT = 4;

type ViewMode = "comfortable" | "compact";

function ensurePreviewStylesheet(url: string) {
  if (typeof document === "undefined") return;
  const id = `font-preview-${btoa(url).replace(/=+$/g, "")}`;
  if (document.getElementById(id)) return;

  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = url;
  document.head.appendChild(link);
}

function licenseBucket(license: string) {
  if (license.includes("OFL")) return "OFL";
  if (license.includes("Apache")) return "Apache";
  if (license.includes("MIT")) return "MIT";
  return "Other";
}

function pageItems(currentPage: number, pageCount: number) {
  const pages = new Set([1, pageCount, currentPage - 1, currentPage, currentPage + 1]);
  return [...pages]
    .filter((page) => page >= 1 && page <= pageCount)
    .sort((a, b) => a - b)
    .reduce<(number | "ellipsis")[]>((items, page) => {
      const previous = items[items.length - 1];
      if (typeof previous === "number" && page - previous > 1) items.push("ellipsis");
      items.push(page);
      return items;
    }, []);
}

function languageBadges(font: FontRecord) {
  return font.languages.map((language) => (
    <Badge
      key={language.languageCode}
      variant={language.languageCode === "HERITAGE" ? "heritage" : "language"}
    >
      {GLYPH_LABELS[language.languageCode]}
    </Badge>
  ));
}

export { CATEGORY_LABELS, DEFAULT_PREVIEW, languageBadges };

function ChipGroup<T extends string>({
  label,
  options,
  optionLabels,
  selected,
  onToggle,
}: ChipGroupProps<T>) {
  return (
    <fieldset class="form-control gap-2">
      <legend class="label-text">
        <span>{label}</span>
      </legend>
      {/* <span>字形區別</span> */}
      <div class="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = selected.includes(option);
          return (
            <label
              class={`btn btn-sm btn-outline ${active ? "btn-primary" : ""}`}
              key={option}
            >
              <input
                type="checkbox"
                class="sr-only"
                checked={active}
                aria-label={optionLabels[option] ?? option}
                onChange={() => onToggle(option)}
              />
              {optionLabels[option] ?? option}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export default function FontFilterPanel({ fonts }: FontFilterPanelProps) {
  const [query, setQuery] = useState("");
  const [previewText, setPreviewText] = useState(DEFAULT_PREVIEW);
  const [selectedGlyphs, setSelectedGlyphs] = useState<LanguageCode[]>([]);
  const [category, setCategory] = useState("all");
  const [license, setLicense] = useState("all");
  const [sourceHan, setSourceHan] = useState("all");
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>("comfortable");
  const [compareSlugs, setCompareSlugs] = useState<string[]>([]);

  useEffect(() => {
    const storedMode = window.localStorage.getItem(VIEW_MODE_STORAGE_KEY);
    if (storedMode === "comfortable" || storedMode === "compact") {
      setViewMode(storedMode);
    }

    const storedCompareSlugs = window.localStorage.getItem(
      COMPARE_SHORTLIST_STORAGE_KEY,
    );
    if (!storedCompareSlugs) return;

    try {
      const parsed = JSON.parse(storedCompareSlugs);
      if (Array.isArray(parsed)) {
        setCompareSlugs(
          parsed
            .filter((slug): slug is string => typeof slug === "string")
            .slice(0, COMPARE_SHORTLIST_LIMIT),
        );
      }
    } catch {
      window.localStorage.removeItem(COMPARE_SHORTLIST_STORAGE_KEY);
    }
  }, []);

  const filteredFonts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    return fonts.filter((font) => {
      const searchable = [
        font.name,
        font.displayName,
        font.author,
        font.license,
        font.tags.join(" "),
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase();

      const matchesQuery = !normalizedQuery || searchable.includes(normalizedQuery);
      const matchesLanguages =
        selectedGlyphs.length === 0 ||
        selectedGlyphs.every((code) =>
          font.languages.some((language) => language.languageCode === code),
        );
      const matchesCategory = category === "all" || font.category === category;
      const matchesLicense = license === "all" || licenseBucket(font.license) === license;
      const matchesSourceHan =
        sourceHan === "all" ||
        (sourceHan === "yes" && font.isSourceHanDerivative) ||
        (sourceHan === "no" && !font.isSourceHanDerivative);

      return (
        matchesQuery &&
        matchesLanguages &&
        matchesCategory &&
        matchesLicense &&
        matchesSourceHan
      );
    });
  }, [category, fonts, selectedGlyphs, license, query, sourceHan]);

  const pageCount = Math.max(1, Math.ceil(filteredFonts.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, pageCount);
  const pagedFonts = filteredFonts.slice(
    (safeCurrentPage - 1) * PAGE_SIZE,
    safeCurrentPage * PAGE_SIZE,
  );
  const visiblePageItems = pageItems(safeCurrentPage, pageCount);
  const pagedFontSlugs = new Set(pagedFonts.map((font) => font.slug));
  const visibleFonts = pagedFonts;
  const visiblePreviewCssUrls = visibleFonts
    .map((font) => font.previewCssUrl)
    .filter(Boolean)
    .join("|");
  const compareFonts = compareSlugs
    .map((slug) => fonts.find((font) => font.slug === slug))
    .filter((font): font is FontRecord => Boolean(font));

  useEffect(() => {
    for (const font of visibleFonts) {
      if (font.previewCssUrl) ensurePreviewStylesheet(font.previewCssUrl);
    }
  }, [visiblePreviewCssUrls]);

  function resetPage(next: () => void) {
    next();
    setCurrentPage(1);
    setExpandedSlug(null);
  }

  function toggleLanguage(code: LanguageCode) {
    resetPage(() => {
      setSelectedGlyphs((current) =>
        current.includes(code)
          ? current.filter((item) => item !== code)
          : [...current, code],
      );
    });
  }

  function clearFilters() {
    setQuery("");
    setSelectedGlyphs([]);
    setCategory("all");
    setLicense("all");
    setSourceHan("all");
    setCurrentPage(1);
    setExpandedSlug(null);
  }

  function updateViewMode(mode: ViewMode) {
    setViewMode(mode);
    window.localStorage.setItem(VIEW_MODE_STORAGE_KEY, mode);
    setExpandedSlug(null);
  }

  function updateCompareSlugs(nextSlugs: string[]) {
    const limitedSlugs = nextSlugs.slice(0, COMPARE_SHORTLIST_LIMIT);
    setCompareSlugs(limitedSlugs);
    window.localStorage.setItem(
      COMPARE_SHORTLIST_STORAGE_KEY,
      JSON.stringify(limitedSlugs),
    );
  }

  function addToCompare(slug: string) {
    if (compareSlugs.includes(slug)) return;
    updateCompareSlugs([...compareSlugs, slug]);
  }

  function removeFromCompare(slug: string) {
    updateCompareSlugs(compareSlugs.filter((item) => item !== slug));
  }

  function renderCompareButton(font: FontRecord, sizeClass = "btn-sm") {
    const selected = compareSlugs.includes(font.slug);
    const disabled = !selected && compareSlugs.length >= COMPARE_SHORTLIST_LIMIT;
    return (
      <button
        type="button"
        class={`btn ${sizeClass} ${selected ? "btn-primary" : "btn-outline"}`}
        disabled={disabled}
        aria-pressed={selected}
        onClick={(event) => {
          event.stopPropagation();
          if (selected) {
            removeFromCompare(font.slug);
          } else {
            addToCompare(font.slug);
          }
        }}
      >
        {selected ? (
          <Check class="h-4 w-4" aria-hidden="true" />
        ) : (
          <Plus class="h-4 w-4" aria-hidden="true" />
        )}
        {selected ? "已加入" : "加入比較"}
      </button>
    );
  }

  function renderFilterControls(layout: "wide" | "sidebar") {
    const primaryGridClass =
      layout === "sidebar" ? "grid gap-4" : "grid gap-4 lg:grid-cols-2";
    const secondaryGridClass =
      layout === "sidebar"
        ? "grid gap-4"
        : "grid gap-4 xl:grid-cols-[minmax(0,1fr)_12rem_12rem_12rem]";

    return (
      <div class="grid gap-5">
      <div class={primaryGridClass}>
        <label class="form-control gap-2">
          <span class="label-text">搜尋字體</span>
          <label class="input input-bordered flex w-full items-center gap-2">
            <Search class="h-4 w-4 opacity-70" aria-hidden="true" />
            <input
              type="search"
              class="grow"
              placeholder="輸入名稱、作者或標籤"
              value={query}
              onInput={(event) =>
                resetPage(() =>
                  setQuery((event.currentTarget as HTMLInputElement).value),
                )
              }
            />
          </label>
        </label>

        <label class="form-control gap-2">
          <span class="label-text">自訂預覽文字</span>
          <input
            type="text"
            class="input input-bordered w-full"
            value={previewText}
            onInput={(event) =>
              setPreviewText((event.currentTarget as HTMLInputElement).value)
            }
          />
        </label>
      </div>

      <div class={secondaryGridClass}>
        <ChipGroup
          label="字形區別"
          options={LANGUAGE_CODES}
          optionLabels={GLYPH_LABELS}
          selected={selectedGlyphs}
          onToggle={toggleLanguage}
        />

        <label class="form-control gap-2">
          <span class="label-text">分類</span>
          <select
            class="select select-sm select-bordered w-full"
            value={category}
            onChange={(event) =>
              resetPage(() =>
                setCategory((event.currentTarget as HTMLSelectElement).value),
              )
            }
          >
            <option value="all">全部</option>
            {CATEGORIES.map((item) => (
              <option value={item} key={item}>
                {CATEGORY_LABELS[item]}
              </option>
            ))}
          </select>
        </label>

        <label class="form-control gap-2">
          <span class="label-text">授權</span>
          <select
            class="select select-sm select-bordered w-full"
            value={license}
            onChange={(event) =>
              resetPage(() =>
                setLicense((event.currentTarget as HTMLSelectElement).value),
              )
            }
          >
            <option value="all">全部</option>
            <option value="OFL">OFL</option>
            <option value="Apache">Apache</option>
            <option value="MIT">MIT</option>
            <option value="Other">其他</option>
          </select>
        </label>

        <label class="form-control gap-2">
          <span class="label-text">思源系</span>
          <select
            class="select select-sm select-bordered w-full"
            value={sourceHan}
            onChange={(event) =>
              resetPage(() =>
                setSourceHan((event.currentTarget as HTMLSelectElement).value),
              )
            }
          >
            {SOURCE_HAN_OPTIONS.map((option) => (
              <option value={option.value} key={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
    );
  }

  return (
    <section class={`grid gap-5 ${compareFonts.length > 0 ? "pb-28" : ""}`}>
      <div class="card card-border bg-base-100">
        <div class="card-body gap-5">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div class="grid gap-1">
              <div class="flex flex-wrap items-center gap-2">
                <SlidersHorizontal class="h-4 w-4 opacity-70" aria-hidden="true" />
                <h2 class="text-lg font-semibold">Catalog Workbench</h2>
              </div>
              <p class="max-w-2xl text-sm opacity-75">
                用同一組條件切換舒適與緊湊檢視，先縮小清單，再檢查 specimen。
              </p>
            </div>

            <div class="grid gap-2">
              <span class="label-text">檢視密度</span>
              <div class="join">
                <button
                  type="button"
                  class={`join-item btn btn-sm ${
                    viewMode === "comfortable" ? "btn-active" : ""
                  }`}
                  aria-pressed={viewMode === "comfortable"}
                  onClick={() => updateViewMode("comfortable")}
                >
                  <LayoutList class="h-4 w-4" aria-hidden="true" />
                  舒適
                </button>
                <button
                  type="button"
                  class={`join-item btn btn-sm ${
                    viewMode === "compact" ? "btn-active" : ""
                  }`}
                  aria-pressed={viewMode === "compact"}
                  onClick={() => updateViewMode("compact")}
                >
                  <AlignJustify class="h-4 w-4" aria-hidden="true" />
                  緊湊
                </button>
              </div>
            </div>
          </div>

          {viewMode === "comfortable" ? renderFilterControls("wide") : null}

        </div>
      </div>

      <div
        class={
          viewMode === "compact"
            ? "grid gap-5 xl:grid-cols-[18rem_minmax(0,1fr)]"
            : "grid gap-5"
        }
      >
      {viewMode === "compact" ? (
        <aside class="card card-border bg-base-100 xl:sticky xl:top-20 xl:self-start">
          <div class="card-body gap-4">
            <div class="grid gap-1">
              <h3 class="text-base font-semibold">篩選條件</h3>
              <p class="text-sm opacity-70">固定條件欄，適合大量掃描字體 metadata。</p>
            </div>
            {renderFilterControls("sidebar")}
          </div>
        </aside>
      ) : null}

      <div class="card card-border min-w-0 bg-base-100">
        <div class="card-body gap-4">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <p class="text-sm">
              顯示 {pagedFonts.length} / {filteredFonts.length} 個字體
            </p>
            <p class="text-sm opacity-70">
              {viewMode === "compact"
                ? "緊湊模式適合快速掃描，點選表格列可展開預覽。"
                : "舒適模式會直接露出 specimen，方便初步比較字體氣質。"}
            </p>
            <button type="reset" class="btn btn-sm btn-ghost" onClick={clearFilters}>
              清除篩選
            </button>
          </div>

        {viewMode === "compact" ? (
          <div class="overflow-x-auto">
            <table class="table table-sm table-zebra">
              <thead>
                <tr>
                  <th>名稱</th>
                  <th>分類</th>
                  <th>授權</th>
                  <th>字形區別</th>
                  <th>思源系</th>
                </tr>
              </thead>
              <tbody>
                {filteredFonts.map((font) => {
                  const isCurrentPageFont = pagedFontSlugs.has(font.slug);
                  return (
                  <>
                    <tr
                      key={font.slug}
                      class={`cursor-pointer hover ${isCurrentPageFont ? "" : "hidden"}`}
                      tabIndex={0}
                      onClick={() =>
                        setExpandedSlug(expandedSlug === font.slug ? null : font.slug)
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          setExpandedSlug(
                            expandedSlug === font.slug ? null : font.slug,
                          );
                        }
                      }}
                    >
                    <th>
                        <div class="grid gap-2">
                          <div>
                            <a
                              class="link link-hover font-semibold"
                              href={`/fonts/${font.slug}/`}
                              onClick={(event) => event.stopPropagation()}
                            >
                              {font.displayName ?? font.name}
                            </a>
                            <div class="text-xs font-normal opacity-70">
                              {font.name}
                            </div>
                          </div>
                          {renderCompareButton(font, "btn-xs")}
                        </div>
                      </th>
                      <td>
                        <Badge variant="category">{CATEGORY_LABELS[font.category]}</Badge>
                      </td>
                      <td>
                        <Badge variant="license">{font.license}</Badge>
                      </td>
                      <td>
                        <div class="flex flex-wrap gap-1">{languageBadges(font)}</div>
                      </td>
                      <td>
                        {font.isSourceHanDerivative ? (
                          <Badge variant="source-han">思源系</Badge>
                        ) : (
                          <span class="text-sm opacity-70">否</span>
                        )}
                      </td>
                    </tr>
                    {expandedSlug === font.slug ? (
                      <tr class={isCurrentPageFont ? "" : "hidden"}>
                        <td colSpan={5}>
                          <FontPreview font={font} initialText={previewText} />
                        </td>
                      </tr>
                    ) : null}
                  </>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div class="grid gap-3">
            {visibleFonts.map((font) => (
              <article
                class="rounded-box border border-base-300 bg-base-100 p-4 transition-colors hover:bg-base-200/40"
                key={font.slug}
              >
                <div class="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(24rem,0.9fr)]">
                  <div class="grid content-start gap-3">
                    <div class="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 class="text-lg font-semibold">
                          <a class="link link-hover" href={`/fonts/${font.slug}/`}>
                            {font.displayName ?? font.name}
                          </a>
                        </h3>
                        <p class="text-xs opacity-70">{font.name}</p>
                      </div>
                      <div class="flex flex-wrap gap-2">
                        {renderCompareButton(font)}
                        <a class="btn btn-sm btn-outline" href={`/fonts/${font.slug}/`}>
                          詳細資料
                        </a>
                      </div>
                    </div>

                    <dl class="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                      <div>
                        <dt class="text-xs opacity-60">分類</dt>
                        <dd class="font-medium">{CATEGORY_LABELS[font.category]}</dd>
                      </div>
                      <div>
                        <dt class="text-xs opacity-60">授權</dt>
                        <dd class="font-medium">{font.license}</dd>
                      </div>
                      <div>
                        <dt class="text-xs opacity-60">思源系</dt>
                        <dd class="font-medium">
                          {font.isSourceHanDerivative ? "是" : "否"}
                        </dd>
                      </div>
                      <div>
                        <dt class="text-xs opacity-60">作者</dt>
                        <dd class="truncate font-medium">{font.author ?? "未列明"}</dd>
                      </div>
                    </dl>

                    <div class="flex flex-wrap gap-1">
                      <Badge variant="category">{CATEGORY_LABELS[font.category]}</Badge>
                      <Badge variant="license">{font.license}</Badge>
                      {font.isSourceHanDerivative ? (
                        <Badge variant="source-han">思源系</Badge>
                      ) : null}
                      {languageBadges(font)}
                    </div>

                    <p class="cjk-copy text-sm opacity-80">
                      {font.description ?? "未提供描述。"}
                    </p>
                  </div>

                  <div
                    class={`emfont emfont-${font.slug} rounded-box bg-base-200 p-5 font-preview-text text-3xl`}
                    style={{
                      fontFamily: font.cssFontFamily,
                      fontWeight: "400",
                    }}
                  >
                    {previewText || DEFAULT_PREVIEW}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {visibleFonts.length === 0 ? (
          <div role="alert" class="alert alert-info alert-soft">
            <span>沒有符合條件的字體，請調整搜尋或篩選條件。</span>
          </div>
        ) : null}

        <div class="flex justify-center">
          <div className="join">
            <button
              type="button"
              className="join-item btn btn-sm"
              aria-label="上一頁"
              disabled={safeCurrentPage === 1}
              onClick={() => {
                setCurrentPage(Math.max(1, safeCurrentPage - 1));
                setExpandedSlug(null);
              }}
            >
              上一頁
            </button>
            {visiblePageItems.map((item, index) =>
              item === "ellipsis" ? (
                <button
                  type="button"
                  className="join-item btn btn-sm btn-disabled"
                  disabled
                  key={`ellipsis-${index}`}
                >
                  ...
                </button>
              ) : (
                <button
                  type="button"
                  className={`join-item btn btn-sm ${
                    item === safeCurrentPage ? "btn-active" : ""
                  }`}
                  aria-label={`前往第 ${item} 頁`}
                  key={item}
                  onClick={() => {
                    setCurrentPage(item);
                    setExpandedSlug(null);
                  }}
                >
                  {item}
                </button>
              ),
            )}
            <button
              type="button"
              className="join-item btn btn-sm"
              aria-label="下一頁"
              disabled={safeCurrentPage === pageCount}
              onClick={() => {
                setCurrentPage(Math.min(pageCount, safeCurrentPage + 1));
                setExpandedSlug(null);
              }}
            >
              下一頁
            </button>
          </div>
        </div>
        </div>
      </div>
      </div>
      {compareFonts.length > 0 ? (
        <div class="fixed inset-x-0 bottom-0 z-40 border-t border-base-300 bg-base-100/95 backdrop-blur">
          <div class="container mx-auto flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div class="grid gap-1">
              <h3 class="text-sm font-semibold">比較清單</h3>
              <p class="text-xs opacity-70">
                已選 {compareFonts.length} / {COMPARE_SHORTLIST_LIMIT} 款字體。
              </p>
            </div>
            <div class="hidden flex-1 flex-wrap gap-2 sm:flex">
              {compareFonts.map((font) => (
                <button
                  type="button"
                  class="badge badge-primary gap-2 py-3"
                  key={font.slug}
                  onClick={() => removeFromCompare(font.slug)}
                  aria-label={`從比較清單移除 ${font.displayName ?? font.name}`}
                >
                  {font.displayName ?? font.name}
                  <X class="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              ))}
            </div>
            <a class="btn btn-sm btn-primary" href="/compare/">
              查看比較
            </a>
          </div>
        </div>
      ) : null}
    </section>
  );
}
