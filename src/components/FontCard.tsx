import type { FontRecord } from "../lib/catalog";
import Badge from "./Badge";
import { CATEGORY_LABELS, languageBadges } from "./FontFilterPanel";

interface FontCardProps {
  font: FontRecord;
}

export default function FontCard({ font }: FontCardProps) {
  return (
    <article class="card card-border bg-base-100">
      <div class="card-body gap-3">
        <h2 class="card-title text-lg">
          <a class="link link-hover" href={`/fonts/${font.slug}/`}>
            {font.displayName ?? font.name}
          </a>
        </h2>
        <div class="flex flex-wrap gap-1">
          <Badge variant="category">{CATEGORY_LABELS[font.category]}</Badge>
          <Badge variant="license">{font.license}</Badge>
          {font.isSourceHanDerivative ? <Badge variant="source-han">思源系</Badge> : null}
          {languageBadges(font)}
        </div>
        <p class="cjk-copy text-sm opacity-80">{font.description ?? "未提供描述。"}</p>
      </div>
      {/* daisyUI primitive reference: hero */}
    </article>
  );
}
