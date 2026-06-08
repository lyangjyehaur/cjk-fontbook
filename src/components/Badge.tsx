import type { ComponentChildren } from "preact";

export type BadgeVariant =
  | "category"
  | "language"
  | "license"
  | "source-han"
  | "heritage";

const variantClass: Record<BadgeVariant, string> = {
  category: "badge-primary",
  language: "badge-outline",
  license: "badge-ghost",
  "source-han": "badge-accent",
  heritage: "badge-info",
};

interface BadgeProps {
  variant: BadgeVariant;
  children: ComponentChildren;
  className?: string;
}

export default function Badge({
  variant,
  children,
  className = "",
}: BadgeProps) {
  return (
    <span class={`badge badge-sm ${variantClass[variant]} ${className}`}>
      {children}
    </span>
  );
}
