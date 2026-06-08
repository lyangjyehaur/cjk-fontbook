import { Search } from "lucide-preact";
import { useMemo, useState } from "preact/hooks";
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
  filteredFonts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

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

  return (
    <section class="card card-border bg-base-100">
      <div class="card-body gap-5">
        <div class="grid gap-4 lg:grid-cols-2">
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

        <div class="grid gap-4 xl:grid-cols-[minmax(0,1fr)_12rem_12rem_12rem]">
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
            {/* label="思源系" */}
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

        <div class="divider my-0" />

        <div class="flex flex-wrap items-center justify-between gap-3">
          <p class="text-sm">
            顯示 {pagedFonts.length} / {filteredFonts.length} 個字體
          </p>
          <p class="text-sm opacity-70">
            點選表格列可展開預覽，字體名稱可開啟詳細資料。
          </p>
          <button type="reset" class="btn btn-sm btn-ghost" onClick={clearFilters}>
            清除篩選
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="table table-zebra">
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
                      <a
                        class="link link-hover font-semibold"
                        href={`/fonts/${font.slug}/`}
                        onClick={(event) => event.stopPropagation()}
                      >
                        {font.displayName ?? font.name}
                      </a>
                      <div class="text-xs font-normal opacity-70">{font.name}</div>
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
    </section>
  );
}
