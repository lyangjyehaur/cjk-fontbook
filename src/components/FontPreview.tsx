import { useEffect, useMemo, useState } from "preact/hooks";
import type { FontRecord } from "../lib/catalog";

interface FontPreviewProps {
  font: FontRecord;
  initialText?: string;
}

const DEFAULT_TEXT = "永東國酬愛鬱靈鷹 かな交じり 한글 Typography";
const FONT_WEIGHTS = ["300", "400", "500", "600", "700"];

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

export default function FontPreview({
  font,
  initialText = DEFAULT_TEXT,
}: FontPreviewProps) {
  const [text, setText] = useState(initialText);
  const [size, setSize] = useState(40);
  const [weight, setWeight] = useState("400");
  const [loaded, setLoaded] = useState(!font.previewCssUrl);

  useEffect(() => {
    setLoaded(!font.previewCssUrl);
    if (!font.previewCssUrl) return;
    ensurePreviewStylesheet(font.previewCssUrl);
    const frame = window.setTimeout(() => setLoaded(true), 300);
    return () => window.clearTimeout(frame);
  }, [font.previewCssUrl]);

  const previewStyle = useMemo(
    () => ({
      fontFamily: loaded ? font.cssFontFamily : undefined,
      fontSize: `${size}px`,
      fontWeight: weight,
    }),
    [font.cssFontFamily, loaded, size, weight],
  );

  return (
    <section class="card card-compact card-border bg-base-100">
      <div class="card-body gap-4">
        <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_16rem]">
          <label class="form-control gap-2">
            <span class="label-text">預覽文字</span>
            <textarea
              class="textarea textarea-bordered min-h-24 w-full cjk-copy"
              value={text}
              onInput={(event) =>
                setText((event.currentTarget as HTMLTextAreaElement).value)
              }
            />
          </label>

          <div class="grid content-start gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <label class="form-control gap-2">
              <span class="label-text">字級：{size}px</span>
              <input
                type="range"
                min="20"
                max="96"
                value={size}
                class="range range-sm range-primary"
                onInput={(event) =>
                  setSize(Number((event.currentTarget as HTMLInputElement).value))
                }
              />
            </label>

            <label class="form-control gap-2">
              <span class="label-text">字重</span>
              <select
                class="select select-bordered select-sm w-full"
                value={weight}
                onChange={(event) =>
                  setWeight((event.currentTarget as HTMLSelectElement).value)
                }
              >
                {FONT_WEIGHTS.map((value) => (
                  <option value={value} key={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {!font.previewCssUrl ? (
          <div role="alert" class="alert alert-info alert-soft">
            <span>此字體沒有可直接載入的網頁預覽 CSS，會以本機或系統後備字體顯示。</span>
          </div>
        ) : null}

        <div
          class={`emfont emfont-${font.slug} rounded-box bg-base-200 p-5 font-preview-text`}
          style={previewStyle}
        >
          {text || "請輸入預覽文字"}
        </div>
      </div>
    </section>
  );
}
