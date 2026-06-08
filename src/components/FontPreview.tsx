import { ExternalLink } from "lucide-preact";
import { useEffect, useId, useMemo, useState } from "preact/hooks";
import type { FontRecord } from "../lib/catalog";
import { defaultPreviewText } from "../lib/catalog";

interface FontPreviewProps {
  font: FontRecord;
  defaultText?: string;
  showControls?: boolean;
  compact?: boolean;
  loadOnMount?: boolean;
  showDetailLink?: boolean;
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
  showDetailLink = true,
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
    <section
      className={`card border border-base-300 bg-base-100 shadow-sm ${
        compact ? "card-compact" : ""
      }`}
    >
      <div className="card-body gap-4">
        {showControls ? (
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_12rem_9rem] lg:items-end">
            <label className="form-control grid gap-2 text-sm font-medium">
              預覽文字
              <textarea
                className="textarea textarea-bordered min-h-20 resize-y"
                rows={compact ? 2 : 3}
                value={text}
                onInput={(event) =>
                  setText((event.currentTarget as HTMLTextAreaElement).value)
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
                max="88"
                value={fontSize}
                onInput={(event) =>
                  setFontSize(
                    Number((event.currentTarget as HTMLInputElement).value),
                  )
                }
              />
            </label>
            <label className="form-control grid gap-2 text-sm font-medium">
              字重
              <select
                className="select select-bordered select-sm"
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
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3">
          {!loadOnMount && font.previewCssUrl ? (
            <button
              className="btn btn-outline btn-sm"
              type="button"
              onClick={() => {
                loadFontCss(font.previewCssUrl);
                setLoaded(true);
              }}
              aria-describedby={id}
            >
              預覽
            </button>
          ) : (
            <span />
          )}

          {showDetailLink ? (
            <a className="btn btn-ghost btn-sm" href={`/fonts/${font.slug}/`}>
              在詳情頁查看
              <ExternalLink aria-hidden="true" className="h-4 w-4" />
            </a>
          ) : null}
        </div>

        <div
          id={id}
          className={`emfont-${font.slug} min-h-36 rounded-box border border-base-300 bg-base-200 p-5`}
        >
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
