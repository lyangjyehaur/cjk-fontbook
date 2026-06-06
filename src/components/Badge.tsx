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
  language:
    "border-leaf/25 bg-leaf/10 text-leaf dark:border-leaf/40 dark:bg-leaf/20 dark:text-green-200",
  category:
    "border-vermilion/25 bg-vermilion/10 text-vermilion dark:border-vermilion/40 dark:bg-vermilion/20 dark:text-orange-200",
  license:
    "border-ink-200 bg-ink-100 text-ink-700 dark:border-white/15 dark:bg-white/10 dark:text-ink-100",
  coverage:
    "border-sky-300/50 bg-sky-100 text-sky-800 dark:border-sky-300/30 dark:bg-sky-300/10 dark:text-sky-100",
  neutral:
    "border-ink-200 bg-white/70 text-ink-700 dark:border-white/10 dark:bg-white/5 dark:text-ink-100",
};

export function Badge({ tone = "neutral", children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${toneClass[tone]}`}
    >
      {children}
    </span>
  );
}
