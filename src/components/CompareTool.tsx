import { useMemo, useState } from "preact/hooks";
import type { FontRecord } from "../lib/catalog";
import { defaultPreviewText, REGION_LABELS } from "../lib/catalog";
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
      <aside className="space-y-4 rounded-lg border border-ink-200 bg-white/78 p-4 dark:border-white/10 dark:bg-white/[0.06]">
        <label className="grid gap-2 text-sm font-medium text-ink-700 dark:text-ink-100">
          預覽文字
          <input
            className="min-h-11 rounded-md border border-ink-200 bg-white px-3 text-base text-ink-900 dark:border-white/10 dark:bg-ink-900 dark:text-ink-50"
            value={previewText}
            onInput={(event) =>
              setPreviewText((event.currentTarget as HTMLInputElement).value)
            }
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-ink-700 dark:text-ink-100">
          搜尋字體
          <input
            className="min-h-11 rounded-md border border-ink-200 bg-white px-3 text-base text-ink-900 dark:border-white/10 dark:bg-ink-900 dark:text-ink-50"
            placeholder="篩選選項"
            value={query}
            onInput={(event) =>
              setQuery((event.currentTarget as HTMLInputElement).value)
            }
          />
        </label>
        <div className="max-h-[520px] space-y-2 overflow-auto pr-1">
          {visibleOptions.map((font) => (
            <label
              className="flex cursor-pointer items-start gap-3 rounded-md border border-transparent p-2 text-sm hover:border-ink-200 hover:bg-white/70 dark:hover:border-white/10 dark:hover:bg-white/5"
              key={font.slug}
            >
              <input
                checked={selectedSlugs.includes(font.slug)}
                className="mt-1"
                type="checkbox"
                onChange={() => toggleFont(font.slug)}
              />
              <span>
                <span className="block font-medium text-ink-900 dark:text-ink-50">
                  {font.name}
                </span>
                <span className="block text-ink-700 dark:text-ink-100">
                  {categoryLabels[font.category] ?? font.category} · {font.languages.map((language) => REGION_LABELS[language.languageCode]).join(", ")}
                </span>
              </span>
            </label>
          ))}
        </div>
      </aside>

      <div className="space-y-5">
        {selectedFonts.length > 0 ? (
          selectedFonts.map((font) => (
            <article className="space-y-3" key={font.slug}>
              <div>
                <h2 className="text-xl font-semibold text-ink-900 dark:text-ink-50">
                  {font.name}
                </h2>
                <p className="text-sm text-ink-700 dark:text-ink-100">
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
            </article>
          ))
        ) : (
          <p className="rounded-lg border border-ink-200 bg-white/70 p-8 text-center text-ink-700 dark:border-white/10 dark:bg-white/5 dark:text-ink-100">
            請至少選擇一款字體進行比較。
          </p>
        )}
      </div>
    </section>
  );
}
