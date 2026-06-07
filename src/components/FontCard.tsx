import { Badge } from "./Badge";
import { FontPreview } from "./FontPreview";
import type { FontRecord } from "../lib/catalog";

interface FontCardProps {
  font: FontRecord;
  previewText: string;
}

const categoryLabels: Record<string, string> = {
  sans: "無襯線",
  serif: "襯線",
  rounded: "圓體",
  mono: "等寬",
  handwriting: "手寫",
  pixel: "點陣",
};

export function FontCard({ font, previewText }: FontCardProps) {
  return (
    <article className="flex h-full flex-col gap-5 rounded-lg border border-ink-200 bg-white/82 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-vermilion/40 hover:shadow-md dark:border-white/10 dark:bg-white/[0.06]">
      <div className="space-y-3">
        <div>
          <a
            className="text-xl font-semibold text-ink-900 hover:text-vermilion dark:text-ink-50"
            href={`/fonts/${font.slug}/`}
          >
            {font.name}
          </a>
          {font.displayName && font.displayName !== font.name ? (
            <p className="mt-1 text-sm text-ink-700 dark:text-ink-100">
              {font.displayName}
            </p>
          ) : null}
        </div>
        <p className="line-clamp-3 text-sm leading-6 text-ink-700 dark:text-ink-100">
          {font.description}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge tone="category">{categoryLabels[font.category] ?? font.category}</Badge>
        <Badge tone="license">{font.license}</Badge>
        {font.isSourceHanDerivative ? (
          <Badge tone="source-han">思源系</Badge>
        ) : null}
        {font.languages.map((language) => (
          <Badge tone="language" key={language.languageCode}>
            {language.languageCode}
          </Badge>
        ))}
      </div>

      <div className="mt-auto">
        <FontPreview
          compact
          defaultText={previewText}
          font={font}
          loadOnMount={false}
          showControls={false}
        />
      </div>
    </article>
  );
}
