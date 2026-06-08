# DESIGN.md - CJK Fontbook

## Surface Type

Product UI. CJK Fontbook is a typography discovery tool and catalog workbench for filtering, previewing, comparing, and inspecting open-source CJK fonts. The visual system should serve task flow and specimen clarity, not brand spectacle.

## Audience

Designers and developers are the most demanding users, but the product should also serve general users looking for a usable free CJK font. Professional users care about language and regional glyph support, type category, license, Source Han lineage, author and source metadata, custom preview text, and side-by-side comparison. General users need clearer entry points, readable specimens, and labels that do not assume deep font knowledge.

## Brand Voice

Precise, useful, typography-focused. Use Traditional Chinese UI copy that is direct and operational. Keep headings short, labels specific, and helper text limited to what improves the task. The interface should feel more complete than the current plain catalog while staying grounded in font inspection.

## Visual System

### Color Strategy

Use a restrained product palette with more intentional hierarchy than the current plain treatment. The existing daisyUI `winter` theme is the light default and `night` is the dark preference theme. The interface should mostly use daisyUI semantic tokens so components remain consistent across both themes.

Primary action and selection color comes from daisyUI `primary`, currently the winter blue-purple family. Use it for active filters, selected badges, current page controls, and primary emphasis only.

Neutral surfaces use `base-100`, `base-200`, and `base-300` for page background, content panels, table separation, borders, and preview wells. Use contrast between page chrome, filter surfaces, table regions, and specimen wells to make the UI feel composed. Do not introduce large decorative color blocks.

Custom Tailwind color roles are available for controlled accents:

- `ink`: warm neutral ramp for typography-first surfaces and future fine-tuned text/background work
- `vermilion`: link or highlight accent when a warmer editorial cue is useful
- `leaf`: secondary semantic accent when a natural status distinction is needed

Badges use semantic variants:

- Category: `badge-primary`
- Language and glyph coverage: `badge-outline`
- License: `badge-ghost`
- Source Han lineage: `badge-accent`
- Heritage glyphs: `badge-info`

### Typography

UI font: `Inter Variable`, then Inter, then system sans-serif fallback.

Preview font: the inspected font when available through `previewCssUrl`, `cssFontFamily`, emfont.js, or local/system fallback.

Use compact product hierarchy:

- Page titles: `text-2xl font-semibold`
- Section and card titles: `text-lg font-semibold` or daisyUI `card-title text-lg`
- Body copy: `text-base` with `cjk-copy`
- Metadata: `text-sm` or `text-xs` with enough contrast

CJK text should use generous line height. Keep `.cjk-copy` around `line-height: 1.8`; keep `.font-preview-text` around `line-height: 1.9`, `word-break: keep-all`, and `overflow-wrap: anywhere` so mixed CJK and Latin strings stay readable.

### Product Direction

The primary direction is Catalog Workbench. It should feel like a serious font-management surface: efficient filtering, clear metadata, fast scanning, and specimen inspection in one place.

Support two density modes:

- Comfortable mode: the default. Use stronger specimen presence, more breathing room, clearer grouping, and friendlier entry points for broad users.
- Compact mode: the power-user view. Use a denser table, fixed or persistent filters on larger screens, smaller row height, and metadata-first scanning.

Both modes should share the same filters, search query, preview text, pagination, and comparison state. Persist the selected density preference when practical.

### Layout

Use a centered container with responsive padding: `container mx-auto px-4`.

Default page rhythm is a vertical grid with `gap-6` and `py-8`, but future catalog work should add clearer structural hierarchy. The page should not feel like default components stacked together.

Catalog Workbench pages use:

- A compact but more intentional header area with catalog status, search, preview text, and density toggle
- Comfortable mode with specimen-forward rows or cards
- Compact mode with a metadata-first table and persistent filters on larger screens
- Expandable previews for deeper inspection
- Clear pagination using daisyUI `join`
- A comparison affordance that is visible without dominating the catalog

Comparison pages use a control card followed by a responsive preview grid. Limit comparisons to four fonts so the view remains inspectable.

Detail pages use a simple metadata hierarchy: back link, title, badges, stats, definition list, preview, external links, and CSS usage snippet.

### Components

Use daisyUI primitives first: `btn`, `input`, `select`, `textarea`, `range`, `badge`, `card`, `table`, `collapse`, `stats`, `alert`, `mockup-code`, `navbar`, `menu`, `footer`, and `join`.

Cards should remain functional containers for filters, previews, and metadata. Keep borders restrained with `card-border`; avoid decorative shadow stacks. Use stronger internal structure, labels, and spacing so cards do not feel like generic default blocks.

Tables should prioritize scanability. Use `table table-zebra`, clear headings, compact badges, and `overflow-x-auto` for narrow screens. Compact mode can reduce row height and helper text; comfortable mode should expose more specimen content.

Forms should keep labels visible. Search, custom preview text, category, license, Source Han lineage, font size, weight, and density controls should use standard daisyUI form affordances.

Empty and fallback states should be explicit:

- No catalog matches: tell the user to adjust search or filters
- No comparison selected: ask the user to add one to four fonts
- No preview CSS: explain that local or system fallback will be used
- Missing metadata: use clear values such as `未列明` or `未提供描述。`

### Navigation

Use a sticky top header with a restrained border and translucent `base-100` background. Navigation labels are Traditional Chinese: `目錄`, `比較`, `授權`. Keep the product name visible but compact.

The footer should stay minimal: product purpose and canonical site identity only.

## Motion

Motion should be minimal and state-based. Use native component state changes, hover states, and small transitions only when they clarify interaction. Do not add page-load choreography or decorative animation. Any future animation must include a reduced-motion fallback.

## Accessibility

Maintain visible focus states through `:focus-visible`. Preserve the skip link in the layout. Interactive table rows need keyboard support for Enter and Space. Icon-only controls require accessible labels. Form placeholders must not carry essential instructions. Badge color must be paired with text labels.

## Technical Constraints

Astro static output with TypeScript and Preact islands. Tailwind CSS 3.x and daisyUI 5.x are the component foundation. PostgreSQL and Drizzle provide catalog data at build time. Font files are not hosted by the app; previews depend on external CSS URLs, emfont.js, declared CSS families, or local/system fallback.

The default HTML language is `zh-Hant`. Theme selection follows the user's color-scheme preference, mapping light to `winter` and dark to `night`.

## Quality Bar

The UI should feel like a focused typography tool with more polish than a bare catalog. Ship dense but readable controls, stable responsive behavior, legible CJK copy, predictable product components, dual-density catalog views, and specimens that are easy to inspect. Avoid decorative UI decisions that make font comparison harder.
