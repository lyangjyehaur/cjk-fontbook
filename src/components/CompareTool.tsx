import { Plus, Search, X } from "lucide-preact";
import { useMemo, useState } from "preact/hooks";
import type { FontRecord } from "../lib/catalog";
import { defaultPreviewText, GLYPH_LABELS } from "../lib/catalog";
import { Badge } from "./Badge";
import { FontPreview } from "./FontPreview";

interface CompareToolProps {
  fonts: FontRecord[];
}

const categoryLabels: Record<string, string> = {
  sans: "無襯線",
  serif: "襯線",
  rounded: "圓體",
  mono: "等寬",
  handwriting: "手寫",
  pixel: "點陣",
};

export function CompareTool({ fonts }: CompareToolProps) {
  const initialSelection = fonts.slice(0, 3).map((font) => font.slug);
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(initialSelection);
  const [query, setQuery] = useState("");
  const [previewText, setPreviewText] = useState(defaultPreviewText);
  const [fontSize, setFontSize] = useState(42);

  const visibleOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return fonts.filter(
      (font) =>
        !normalizedQuery ||
        [font.name, font.displayName, font.author, font.license, ...font.tags]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(normalizedQuery)),
    );
  }, [fonts, query]);

  const selectedFonts = selectedSlugs
    .map((slug) => fonts.find((font) => font.slug === slug))
    .filter((font): font is FontRecord => Boolean(font));

  function addFont(slug: string) {
    if (!slug) {
      return;
    }

    setSelectedSlugs((current) =>
      current.includes(slug) ? current : [...current, slug],
    );
  }

  function removeFont(slug: string) {
    setSelectedSlugs((current) =>
      current.filter((selectedSlug) => selectedSlug !== slug),
    );
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[18rem_minmax(0,1fr)]">
      <aside className="border border-base-300 bg-base-100 p-4 xl:sticky xl:top-20 xl:self-start">
        <h2 className="text-sm font-semibold">比較設定</h2>
        <div className="mt-4 grid gap-4">
          <label className="form-control grid gap-2 text-sm font-medium">
            共用預覽文字
            <textarea
              className="textarea textarea-sm min-h-32 resize-y"
              value={previewText}
              onInput={(event) =>
                setPreviewText(
                  (event.currentTarget as HTMLTextAreaElement).value,
                )
              }
            />
          </label>

          <label className="form-control grid gap-2 text-sm font-medium">
            <span className="flex items-center justify-between gap-3">
              字級
              <span className="badge badge-ghost badge-sm">{fontSize}px</span>
            </span>
            <input
              className="range range-primary range-sm"
              type="range"
              min="24"
              max="72"
              value={fontSize}
              onInput={(event) =>
                setFontSize(
                  Number((event.currentTarget as HTMLInputElement).value),
                )
              }
            />
          </label>

          <label className="form-control grid gap-2 text-sm font-medium">
            搜尋字體
            <span className="relative">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-base-content/45"
              />
              <input
                className="input input-sm w-full pl-10"
                placeholder="名稱、作者、授權"
                value={query}
                onInput={(event) =>
                  setQuery((event.currentTarget as HTMLInputElement).value)
                }
              />
            </span>
          </label>

          <label className="form-control grid gap-2 text-sm font-medium">
            加入字體
            <select
              className="select select-sm w-full"
              value=""
              onChange={(event) => {
                addFont((event.currentTarget as HTMLSelectElement).value);
                (event.currentTarget as HTMLSelectElement).value = "";
              }}
            >
              <option value="">選擇字體</option>
              {visibleOptions.map((font) => (
                <option
                  key={font.slug}
                  value={font.slug}
                  disabled={selectedSlugs.includes(font.slug)}
                >
                  {font.name}
                </option>
              ))}
            </select>
          </label>

          <div className="divider my-0"></div>

          <div className="grid gap-2">
            <p className="text-sm font-medium">已選字體</p>
            {selectedFonts.length > 0 ? (
              selectedFonts.map((font) => (
                <button
                  className="btn btn-sm justify-between"
                  key={font.slug}
                  type="button"
                  onClick={() => removeFont(font.slug)}
                  aria-label={`移除 ${font.name}`}
                >
                  <span className="truncate">{font.name}</span>
                  <X aria-hidden="true" className="h-4 w-4 shrink-0" />
                </button>
              ))
            ) : (
              <p className="text-sm text-base-content/60">尚未選擇字體。</p>
            )}
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        {selectedFonts.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
            {selectedFonts.map((font) => (
              <article
                className="card card-border bg-base-100"
                key={font.slug}
              >
                <div className="card-body gap-4 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="card-title text-lg">
                        <a
                          className="truncate hover:text-vermilion"
                          href={`/fonts/${font.slug}/`}
                        >
                          {font.name}
                        </a>
                      </h2>
                      <p className="mt-1 truncate text-sm text-base-content/60">
                        {font.displayName ?? font.author ?? "未標示作者"}
                      </p>
                    </div>
                    <button
                      className="btn btn-ghost btn-xs btn-square"
                      type="button"
                      aria-label={`移除 ${font.name}`}
                      onClick={() => removeFont(font.slug)}
                    >
                      <X aria-hidden="true" className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    <Badge tone="category">
                      {categoryLabels[font.category] ?? font.category}
                    </Badge>
                    <Badge tone="license">{font.license}</Badge>
                    {font.languages.map((language) => (
                      <Badge tone="language" key={language.languageCode}>
                        {GLYPH_LABELS[language.languageCode]}
                      </Badge>
                    ))}
                  </div>

                  <FontPreview
                    compact
                    defaultText={previewText}
                    font={font}
                    initialSize={fontSize}
                    loadOnMount={false}
                    showControls={false}
                    showDetailLink={false}
                    surface="plain"
                  />
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="border border-base-300 bg-base-100 p-8 text-center">
            <p className="text-base-content/65">請加入至少一款字體進行比較。</p>
            <button
              className="btn btn-sm mt-4 border-vermilion bg-vermilion text-white hover:border-vermilion hover:bg-vermilion/90"
              type="button"
              onClick={() => addFont(fonts[0]?.slug ?? "")}
            >
              <Plus aria-hidden="true" className="h-4 w-4" />
              加入第一款字體
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
