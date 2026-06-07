import { Search, X } from "lucide-preact";
import { useMemo, useState } from "preact/hooks";
import type { FontRecord } from "../lib/catalog";
import { defaultPreviewText, GLYPH_LABELS } from "../lib/catalog";
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

  const visibleOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return fonts.filter(
      (font) =>
        !normalizedQuery ||
        [font.name, font.displayName, font.author]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(normalizedQuery)),
    );
  }, [fonts, query]);

  const selectedFonts = fonts.filter((font) =>
    selectedSlugs.includes(font.slug),
  );

  function toggleFont(slug: string) {
    setSelectedSlugs((current) =>
      current.includes(slug)
        ? current.filter((selectedSlug) => selectedSlug !== slug)
        : [...current, slug],
    );
  }

  return (
    <section className="space-y-6">
      <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body gap-5">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(14rem,20rem)_minmax(14rem,20rem)]">
            <label className="form-control grid gap-2 text-sm font-medium">
              預覽文字
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
            <label className="form-control grid gap-2 text-sm font-medium">
              搜尋字體
              <span className="relative">
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-base-content/45"
                />
                <input
                  className="input input-bordered w-full pl-10"
                  placeholder="篩選選項"
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
                className="select select-bordered"
                value=""
                onChange={(event) => {
                  const slug = (event.currentTarget as HTMLSelectElement).value;
                  if (slug && !selectedSlugs.includes(slug)) {
                    toggleFont(slug);
                  }
                }}
              >
                <option value="">選擇字體</option>
                {visibleOptions.map((font) => (
                  <option key={font.slug} value={font.slug}>
                    {font.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="divider my-0"></div>

          <div className="flex flex-wrap gap-2">
            {selectedFonts.map((font) => (
              <span className="badge badge-primary gap-2 py-3" key={font.slug}>
                {font.name}
                <button
                  className="grid h-4 w-4 place-items-center rounded-full hover:bg-primary-content/20"
                  type="button"
                  aria-label={`移除 ${font.name}`}
                  onClick={() => toggleFont(font.slug)}
                >
                  <X aria-hidden="true" className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {selectedFonts.length > 0 ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {selectedFonts.map((font) => (
            <article
              className="card border border-base-300 bg-base-100 shadow-sm"
              key={font.slug}
            >
              <div className="card-body gap-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="card-title text-xl">{font.name}</h2>
                    <p className="text-sm text-base-content/60">
                      {font.displayName ?? font.author}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="badge badge-primary badge-outline">
                      {categoryLabels[font.category] ?? font.category}
                    </span>
                    {font.languages.map((language) => (
                      <span
                        className="badge badge-sm badge-outline"
                        key={language.languageCode}
                      >
                        {GLYPH_LABELS[language.languageCode]}
                      </span>
                    ))}
                  </div>
                </div>
                <FontPreview
                  compact
                  defaultText={previewText}
                  font={font}
                  loadOnMount
                  showControls={false}
                />
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="alert alert-info justify-center text-center">
          請至少選擇一款字體進行比較。
        </p>
      )}
    </section>
  );
}
