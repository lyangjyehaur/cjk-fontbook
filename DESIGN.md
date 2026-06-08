# DESIGN.md — CJK Fontbook

## Surface Type
Product surface. This is a font discovery tool, not a marketing site. Design serves the product: helping users find, compare, and preview CJK fonts.

## Audience
Designers and developers looking for open-source CJK (Chinese, Japanese, Korean) fonts for their projects. They care about:
- Finding fonts that support specific languages/regions
- Previewing how fonts look with their own text
- Understanding font licenses
- Comparing multiple fonts side by side

## Brand Voice
- Clean, minimal, typography-focused
- The fonts ARE the design — UI should not compete with font previews
- Professional but approachable
- 繁體中文 UI (Traditional Chinese)

## Visual System

### Color Strategy
- **Primary**: Deep blue-purple (#491eff / DaisyUI winter primary)
- **Neutral**: Warm grays (ink palette: #f8f7f4 → #171511)
- **Accent**: Vermilion (#b94a35) for links and interactive highlights
- **Success/Info**: DaisyUI defaults (green, blue badges)

### Typography
- **UI font**: Inter Variable (system font fallback)
- **Preview font**: Dynamic — each font is previewed in its own typeface
- **Scale**: Tailwind's default type scale
- **CJK text**: Ensure proper line-height (1.8-2.0) for CJK readability

### Layout Principles
- **Spacious**: Generous whitespace, CJK text needs breathing room
- **Grid-based**: Table layout for font catalog, card layout for comparisons
- **Responsive**: Mobile-first, but font preview works best on desktop
- **Minimal borders**: Use background color and spacing for separation

### Component Patterns
- **Font cards/rows**: Clean, minimal, with metadata badges
- **Filter panel**: Collapsible, with multi-select chips for character sets
- **Preview area**: Large text area with font-size/weight controls
- **Badges**: Color-coded for category (primary), language (outline), license (neutral)

## Motion
- Minimal animations
- Hover effects on cards: subtle translate-y
- Filter transitions: smooth height changes
- Font loading: no flash of unstyled text (show system font until loaded)

## Constraints
- Static site (Astro SSG) — no server-side rendering
- Font files are NOT hosted — previews use Google Fonts CSS, emfont.js, or click-to-load
- All content in Traditional Chinese (繁體中文)
- DaisyUI 5.x + Tailwind CSS 3.x
