import { X } from "lucide-preact";
import { useEffect, useMemo, useState } from "preact/hooks";
import type { FontRecord } from "../lib/catalog";
import Badge from "./Badge";
import { CATEGORY_LABELS, DEFAULT_PREVIEW, languageBadges } from "./FontFilterPanel";

interface CompareToolProps {
  fonts: FontRecord[];
}

const COMPARE_SHORTLIST_STORAGE_KEY = "cjk-fontbook-compare-shortlist";
const COMPARE_SHORTLIST_LIMIT = 4;

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

export default function CompareTool({ fonts }: CompareToolProps) {
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [previewText, setPreviewText] = useState(DEFAULT_PREVIEW);
  const [previewSize, setPreviewSize] = useState(40);

  useEffect(() => {
    const storedSlugs = window.localStorage.getItem(COMPARE_SHORTLIST_STORAGE_KEY);
    if (!storedSlugs) return;

    try {
      const parsed = JSON.parse(storedSlugs);
      if (Array.isArray(parsed)) {
        setSelectedSlugs(
          parsed
            .filter((slug): slug is string => typeof slug === "string")
            .filter((slug) => fonts.some((font) => font.slug === slug))
            .slice(0, COMPARE_SHORTLIST_LIMIT),
        );
      }
    } catch {
      window.localStorage.removeItem(COMPARE_SHORTLIST_STORAGE_KEY);
    }
  }, [fonts]);

  const selectedFonts = useMemo(
    () =>
      selectedSlugs
        .map((slug) => fonts.find((font) => font.slug === slug))
        .filter((font): font is FontRecord => Boolean(font)),
    [fonts, selectedSlugs],
  );
  const selectedPreviewCssUrls = selectedFonts
    .map((font) => font.previewCssUrl)
    .filter(Boolean)
    .join("|");

  useEffect(() => {
    for (const font of selectedFonts) {
      if (font.previewCssUrl) ensurePreviewStylesheet(font.previewCssUrl);
    }
  }, [selectedPreviewCssUrls]);

  function updateSelectedSlugs(nextSlugs: string[]) {
    const limitedSlugs = nextSlugs.slice(0, COMPARE_SHORTLIST_LIMIT);
    setSelectedSlugs(limitedSlugs);
    window.localStorage.setItem(
      COMPARE_SHORTLIST_STORAGE_KEY,
      JSON.stringify(limitedSlugs),
    );
  }

  function addFont(slug: string) {
    if (!slug || selectedSlugs.includes(slug)) return;
    updateSelectedSlugs([...selectedSlugs, slug]);
  }

  function removeFont(slug: string) {
    updateSelectedSlugs(selectedSlugs.filter((item) => item !== slug));
  }

  function clearSelection() {
    updateSelectedSlugs([]);
  }

  return (
    <section class="grid gap-4 xl:grid-cols-[18rem_minmax(0,1fr)]">
      <aside class="card card-border bg-base-100 xl:sticky xl:top-20 xl:self-start">
        <div class="card-body gap-5">
          <div class="grid gap-1">
            <h2 class="text-lg font-semibold">Comparison Workbench</h2>
            <p class="text-sm opacity-70">
              用同一段文字和字級檢查候選字體的比例、筆畫密度與閱讀節奏。
            </p>
          </div>

          <div class="grid gap-4">
            <h3 class="text-sm font-semibold">比較控制</h3>
            <label class="form-control gap-2">
              <span class="label-text">選擇比較字體</span>
              <select
                class="select select-sm select-bordered w-full"
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
              <span class="label-text">共同文字</span>
              <textarea
                class="textarea textarea-bordered min-h-24 w-full cjk-copy"
                value={previewText}
                onInput={(event) =>
                  setPreviewText((event.currentTarget as HTMLTextAreaElement).value)
                }
              />
            </label>

            <label class="form-control gap-2">
              <span class="label-text">比較字級：{previewSize}px</span>
              <input
                type="range"
                min="24"
                max="88"
                value={previewSize}
                class="range range-sm range-primary"
                onInput={(event) =>
                  setPreviewSize(Number((event.currentTarget as HTMLInputElement).value))
                }
              />
            </label>
          </div>

          <div class="grid gap-2">
            {selectedFonts.length === 0 ? (
              <span class="text-sm opacity-70">尚未選取字體。</span>
            ) : (
              <div class="grid gap-2">
                <span class="text-sm font-medium">從目錄帶入的比較清單</span>
                <div class="flex flex-wrap gap-2">
                  {selectedFonts.map((font) => (
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
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            class="btn btn-sm btn-ghost"
            disabled={selectedFonts.length === 0}
            onClick={clearSelection}
          >
            清空比較
          </button>
        </div>
      </aside>

      <div class="grid min-w-0 gap-4">
        <div class="card card-border bg-base-100">
          <div class="card-body gap-1">
            <h2 class="text-lg font-semibold">並排檢視</h2>
            <p class="text-sm opacity-70">
              最多比較 {COMPARE_SHORTLIST_LIMIT} 款，所有 specimen 共用左側控制。
            </p>
          </div>
        </div>

        {selectedFonts.length === 0 ? (
          <div role="alert" class="alert alert-info alert-soft">
            <span>請先加入一到四款字體進行並排比較。</span>
          </div>
        ) : (
          <div class="grid gap-4 xl:grid-cols-2">
          {selectedFonts.map((font) => (
            <article class="card card-border bg-base-100" key={font.slug}>
              <div class="card-body gap-4">
                <div class="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 class="text-lg font-semibold">
                      {font.displayName ?? font.name}
                    </h3>
                    <p class="text-xs opacity-70">{font.name}</p>
                  </div>
                  <button
                    type="button"
                    class="btn btn-xs btn-ghost"
                    onClick={() => removeFont(font.slug)}
                    aria-label={`移除 ${font.displayName ?? font.name}`}
                  >
                    <X class="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>

                <dl class="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt class="text-xs opacity-60">分類</dt>
                    <dd class="font-medium">{CATEGORY_LABELS[font.category]}</dd>
                  </div>
                  <div>
                    <dt class="text-xs opacity-60">授權</dt>
                    <dd class="font-medium">{font.license}</dd>
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

                <div
                  class={`emfont emfont-${font.slug} rounded-box bg-base-200 p-5 font-preview-text`}
                  style={{
                    fontFamily: font.cssFontFamily,
                    fontSize: `${previewSize}px`,
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
      </div>
    </section>
  );
}
