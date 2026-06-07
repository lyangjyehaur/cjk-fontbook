import type { ComponentChildren } from "preact";

type BadgeTone =
  | "language"
  | "category"
  | "license"
  | "coverage"
  | "neutral";

interface BadgeProps {
  tone?: BadgeTone;
  children: ComponentChildren;
}

const toneClass: Record<BadgeTone, string> = {
  language: "badge-success badge-outline",
  category: "badge-primary badge-outline",
  license: "badge-neutral badge-outline",
  coverage: "badge-info badge-outline",
  neutral: "badge-ghost",
};

export function Badge({ tone = "neutral", children }: BadgeProps) {
  return <span className={`badge badge-sm ${toneClass[tone]}`}>{children}</span>;
}
