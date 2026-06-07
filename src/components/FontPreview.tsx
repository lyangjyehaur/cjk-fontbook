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
        <div className="grid gap-3 rounded-lg border border-ink-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5 md:grid-cols-[1fr_auto_auto] md:items-end">
          <label className="grid gap-1 text-sm font-medium text-ink-700 dark:text-ink-100">
            預覽文字
            <input
              className="min-h-11 rounded-md border border-ink-200 bg-white px-3 text-base text-ink-900 outline-none transition focus:border-vermilion dark:border-white/10 dark:bg-ink-900 dark:text-ink-50"
              value={text}
              onInput={(event) =>
                setText((event.currentTarget as HTMLInputElement).value)
              }
            />
          </label>
          <label className="grid min-w-40 gap-1 text-sm font-medium text-ink-700 dark:text-ink-100">
            字級 {fontSize}px
            <input
              type="range"
              min="24"
              max="88"
              value={fontSize}
              onInput={(event) =>
                setFontSize(Number((event.currentTarget as HTMLInputElement).value))
              }
            />
          </label>
          <label className="grid gap-1 text-sm font-medium text-ink-700 dark:text-ink-100">
            字重
            <select
              className="min-h-11 rounded-md border border-ink-200 bg-white px-3 text-base text-ink-900 dark:border-white/10 dark:bg-ink-900 dark:text-ink-50"
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

      {!loadOnMount && font.previewCssUrl ? (
        <button
          className="rounded-full border border-ink-200 px-4 py-2 text-sm font-medium text-ink-900 transition hover:border-vermilion hover:text-vermilion dark:border-white/10 dark:text-ink-50"
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
        className="min-h-32 overflow-hidden rounded-lg border border-ink-200 bg-white p-5 text-ink-900 shadow-sm dark:border-white/10 dark:bg-ink-900 dark:text-ink-50"
      >
        <p className="break-words transition" style={style}>
          {text}
        </p>
        {!font.previewCssUrl ? (
          <p className="mt-4 text-sm text-ink-700 dark:text-ink-100">
            尚未設定遠端預覽 CSS，正在顯示系統備用字體。
          </p>
        ) : !loaded ? (
          <p className="mt-4 text-sm text-ink-700 dark:text-ink-100">
            尚未載入遠端字體 CSS。
          </p>
        ) : null}
      </div>
    </section>
  );
}
