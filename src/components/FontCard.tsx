import { Badge } from "./Badge";
import { FontPreview } from "./FontPreview";
import { GLYPH_LABELS, type FontRecord } from "../lib/catalog";

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
    <article className="card card-border h-full bg-base-100">
      <div className="card-body gap-4 p-4">
        <div className="min-w-0">
          <a
            className="card-title text-lg font-semibold hover:text-vermilion"
            href={`/fonts/${font.slug}/`}
          >
            {font.name}
          </a>
          {font.displayName && font.displayName !== font.name ? (
            <p className="mt-1 truncate text-sm text-base-content/60">
              {font.displayName}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-1.5">
          <Badge tone="category">{categoryLabels[font.category] ?? font.category}</Badge>
          <Badge tone="license">{font.license}</Badge>
          {font.languages.map((language) => (
            <Badge tone="language" key={language.languageCode}>
              {GLYPH_LABELS[language.languageCode]}
            </Badge>
          ))}
        </div>

        <FontPreview
          compact
          defaultText={previewText}
          font={font}
          loadOnMount={false}
          showControls={false}
          showDetailLink={false}
          surface="plain"
        />
      </div>
    </article>
  );
}
