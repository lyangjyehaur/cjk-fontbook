import { useEffect, useId, useMemo, useState } from "preact/hooks";
import type { FontRecord } from "../lib/catalog";
import { defaultPreviewText } from "../lib/catalog";

interface FontPreviewProps {
  font: FontRecord;
  defaultText?: string;
  showControls?: boolean;
  compact?: boolean;
  loadOnMount?: boolean;
}

const loadedCssUrls = new Set<string>();

function loadFontCss(url?: string) {
  if (!url || loadedCssUrls.has(url) || typeof document === "undefined") {
    return;
  }

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = url;
  link.dataset.fontbookPreview = "true";
  document.head.appendChild(link);
  loadedCssUrls.add(url);
}

export function FontPreview({
  font,
  defaultText = defaultPreviewText,
  showControls = true,
  compact = false,
  loadOnMount = true,
}: FontPreviewProps) {
  const id = useId();
  const [text, setText] = useState(defaultText);
  const [fontSize, setFontSize] = useState(compact ? 30 : 48);
  const [weight, setWeight] = useState("400");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loadOnMount) {
      loadFontCss(font.previewCssUrl);
      setLoaded(Boolean(font.previewCssUrl));
    }
  }, [font.previewCssUrl, loadOnMount]);

  const style = useMemo(
    () => ({
      fontFamily: loaded ? font.cssFontFamily : undefined,
      fontSize: `${fontSize}px`,
      fontWeight: weight,
      lineHeight: "1.35",
    }),
    [font.cssFontFamily, fontSize, loaded, weight],
  );

  return (
    <section className="space-y-4">
      {showControls ? (
        <div className="card border border-base-300 bg-base-100/80 shadow-sm">
          <div className="card-body grid gap-3 p-4 md:grid-cols-[1fr_auto_auto] md:items-end">
            <label className="form-control grid gap-1 text-sm font-medium text-base-content/80">
              預覽文字
              <textarea
                className="textarea textarea-bordered min-h-11 resize-none text-base focus:border-vermilion"
                rows={1}
              value={text}
              onInput={(event) =>
                setText((event.currentTarget as HTMLTextAreaElement).value)
              }
              />
            </label>
            <label className="form-control grid min-w-40 gap-1 text-sm font-medium text-base-content/80">
              字級 {fontSize}px
              <input
                className="range range-primary range-sm"
                type="range"
                min="24"
                max="88"
                value={fontSize}
                onInput={(event) =>
                  setFontSize(
                    Number((event.currentTarget as HTMLInputElement).value),
                  )
                }
              />
            </label>
            <label className="form-control grid gap-1 text-sm font-medium text-base-content/80">
              字重
              <select
                className="select select-bordered min-h-11 text-base focus:border-vermilion"
                value={weight}
                onChange={(event) =>
                  setWeight((event.currentTarget as HTMLSelectElement).value)
                }
              >
                <option value="400">一般</option>
                <option value="700">粗體</option>
              </select>
            </label>
          </div>
        </div>
      ) : null}

      {!loadOnMount && font.previewCssUrl ? (
        <button
          className="btn btn-outline btn-sm border-ink-200 text-ink-900 hover:border-vermilion hover:bg-vermilion dark:border-white/10 dark:text-ink-50"
          type="button"
          onClick={() => {
            loadFontCss(font.previewCssUrl);
            setLoaded(true);
          }}
          aria-describedby={id}
        >
          預覽
        </button>
      ) : null}

      <div
        id={id}
        className="card min-h-32 overflow-hidden border border-base-300 bg-base-100 text-base-content shadow-sm"
      >
        <div className="card-body p-5">
          <p className="break-words transition" style={style}>
            {text}
          </p>
          {!font.previewCssUrl ? (
            <p className="mt-4 text-sm text-base-content/70">
              尚未設定遠端預覽 CSS，正在顯示系統備用字體。
            </p>
          ) : !loaded ? (
            <p className="mt-4 text-sm text-base-content/70">
              尚未載入遠端字體 CSS。
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
