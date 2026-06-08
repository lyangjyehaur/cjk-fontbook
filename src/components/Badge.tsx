import type { ComponentChildren } from "preact";

type BadgeTone =
  | "language"
  | "category"
  | "license"
  | "coverage"
  | "accent"
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
  accent: "badge-outline border-vermilion text-vermilion",
  neutral: "badge-ghost",
};

export function Badge({ tone = "neutral", children }: BadgeProps) {
  return <span className={`badge badge-sm ${toneClass[tone]}`}>{children}</span>;
}
