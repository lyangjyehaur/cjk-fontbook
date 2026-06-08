import { X } from "lucide-preact";
import { useMemo, useState } from "preact/hooks";
import type { FontRecord } from "../lib/catalog";
import Badge from "./Badge";
import { CATEGORY_LABELS, DEFAULT_PREVIEW, languageBadges } from "./FontFilterPanel";
import FontPreview from "./FontPreview";

interface CompareToolProps {
  fonts: FontRecord[];
}

export default function CompareTool({ fonts }: CompareToolProps) {
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [previewText, setPreviewText] = useState(DEFAULT_PREVIEW);

  const selectedFonts = useMemo(
    () => fonts.filter((font) => selectedSlugs.includes(font.slug)),
    [fonts, selectedSlugs],
  );

  function addFont(slug: string) {
    if (!slug || selectedSlugs.includes(slug)) return;
    setSelectedSlugs((current) => [...current, slug].slice(0, 4));
  }

  function removeFont(slug: string) {
    setSelectedSlugs((current) => current.filter((item) => item !== slug));
  }

  return (
    <section class="grid gap-6">
      <div class="card card-border bg-base-100">
        <div class="card-body gap-4">
          <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <label class="form-control gap-2">
              <span class="label-text">選擇比較字體</span>
              <select
                class="select select-bordered w-full"
                value=""
                onChange={(event) =>
                  addFont((event.currentTarget as HTMLSelectElement).value)
                }
              >
                <option value="">加入字體</option>
                {fonts.map((font) => (
                  <option
                    value={font.slug}
                    key={font.slug}
                    disabled={selectedSlugs.includes(font.slug)}
                  >
                    {font.displayName ?? font.name}
                  </option>
                ))}
              </select>
            </label>

            <label class="form-control gap-2">
              <span class="label-text">比較文字</span>
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

          <div class="flex flex-wrap gap-2">
            {selectedFonts.length === 0 ? (
              <span class="text-sm opacity-70">尚未選取字體。</span>
            ) : (
              selectedFonts.map((font) => (
                <button
                  type="button"
                  class="badge badge-primary gap-2 py-3"
                  key={font.slug}
                  onClick={() => removeFont(font.slug)}
                  aria-label={`移除 ${font.displayName ?? font.name}`}
                >
                  {font.displayName ?? font.name}
                  <X class="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {selectedFonts.length === 0 ? (
        <div role="alert" class="alert alert-info alert-soft">
          <span>請先加入一到四款字體進行並排比較。</span>
        </div>
      ) : (
        <div class="grid gap-4 xl:grid-cols-2">
          {selectedFonts.map((font) => (
            <article class="grid gap-3" key={font.slug}>
              <div class="flex flex-wrap items-center gap-2">
                <h2 class="text-lg font-semibold">{font.displayName ?? font.name}</h2>
                <Badge variant="category">{CATEGORY_LABELS[font.category]}</Badge>
                <Badge variant="license">{font.license}</Badge>
                {font.isSourceHanDerivative ? (
                  <Badge variant="source-han">思源系</Badge>
                ) : null}
              </div>
              <div class="flex flex-wrap gap-1">{languageBadges(font)}</div>
              <FontPreview font={font} initialText={previewText} />
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
