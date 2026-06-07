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
    <section className="grid gap-8 lg:grid-cols-[320px_1fr]">
      <aside className="card border border-base-300 bg-base-100/85 shadow-sm">
        <div className="card-body space-y-4 p-4">
          <label className="form-control grid gap-2 text-sm font-medium text-base-content/80">
            預覽文字
            <input
              className="input input-bordered min-h-11 text-base focus:border-vermilion"
              value={previewText}
              onInput={(event) =>
                setPreviewText((event.currentTarget as HTMLInputElement).value)
              }
            />
          </label>
          <label className="form-control grid gap-2 text-sm font-medium text-base-content/80">
            搜尋字體
            <input
              className="input input-bordered min-h-11 text-base focus:border-vermilion"
              placeholder="篩選選項"
              value={query}
              onInput={(event) =>
                setQuery((event.currentTarget as HTMLInputElement).value)
              }
            />
          </label>
          <label className="form-control grid gap-2 text-sm font-medium text-base-content/80">
            加入字體
            <select
              className="select select-bordered min-h-11 text-base focus:border-vermilion"
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
          <div className="max-h-[520px] space-y-2 overflow-auto pr-1">
            {visibleOptions.map((font) => (
              <label
                className="flex cursor-pointer items-start gap-3 rounded-field border border-transparent p-2 text-sm hover:border-base-300 hover:bg-base-200/70"
                key={font.slug}
              >
                <input
                  checked={selectedSlugs.includes(font.slug)}
                  className="checkbox checkbox-sm checkbox-primary mt-1"
                  type="checkbox"
                  onChange={() => toggleFont(font.slug)}
                />
                <span>
                  <span className="block font-medium text-ink-900 dark:text-ink-50">
                    {font.name}
                  </span>
                  <span className="block text-base-content/65">
                    {categoryLabels[font.category] ?? font.category} · {font.languages.map((language) => GLYPH_LABELS[language.languageCode]).join(", ")}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </div>
      </aside>

      <div className="space-y-5">
        {selectedFonts.length > 0 ? (
          selectedFonts.map((font) => (
            <article className="card border border-base-300 bg-base-100/85 shadow-sm" key={font.slug}>
              <div className="card-body space-y-3 p-5">
                <div>
                  <h2 className="text-xl font-semibold text-ink-900 dark:text-ink-50">
                    {font.name}
                  </h2>
                  <p className="text-sm text-base-content/65">
                    {font.displayName ?? font.author}
                  </p>
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
          ))
        ) : (
          <p className="alert justify-center border-base-300 bg-base-100/85 text-center text-base-content/70">
            請至少選擇一款字體進行比較。
          </p>
        )}
      </div>
    </section>
  );
}
