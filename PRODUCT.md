# Product

## Register

product

## Users

CJK Fontbook serves anyone trying to find practical open-source Chinese, Japanese, and Korean font options, with designers and developers as the most demanding users. Professional users may be narrowing a production font list, checking regional glyph coverage, comparing specimen text, and confirming license terms before adopting a typeface in a website, app, document system, or design file. General users may arrive with a simpler question: which free CJK font looks right for a document, post, presentation, personal project, or learning context.

The product should support both scanning and exploration. Frequent users need font names, categories, language and glyph labels, licensing, source links, preview behavior, and comparison controls to stay visible without decorative friction. Newer users need enough structure, examples, and readable previews to understand the catalog without already knowing font terminology.

## Product Purpose

CJK Fontbook is a static catalog and workbench for discovering, filtering, previewing, and comparing open-source CJK fonts. It is not a download host and not a marketing site. The product exists to reduce the time between "I need a CJK font that fits this project" and "I have a short list I can inspect and test."

Success means a user can search by name, author, or tag; filter by glyph region, category, license, and Source Han lineage; preview custom multilingual text; compare up to four options side by side; and leave with enough metadata to verify the font at its original source.

## Brand Personality

Precise, useful, typography-focused.

The interface should feel like a polished font catalog workbench: calm enough for inspection, structured enough for heavy filtering, and visually considered enough that it does not feel unfinished or overly plain. The fonts are the strongest visual material, so the UI should frame specimens and metadata instead of competing with them. The voice should be professional, direct, and approachable, with Traditional Chinese as the primary interface language.

## Anti-references

Avoid marketing-site patterns: oversized heroes, promotional statistics, decorative illustrations, sales copy, feature-card grids, and loud calls to action.

Avoid visual systems that compete with specimens: heavy gradients, ornamental backgrounds, glass effects, dramatic shadows, novelty controls, or large color fields that make type previews harder to inspect. Also avoid an under-designed catalog that feels like a raw table with default components and no hierarchy.

Avoid generic SaaS dashboard styling that makes the catalog feel like analytics software. The product should feel like a typography reference tool, not a metrics console.

## Design Principles

Make font specimens the primary visual signal. Layout, color, and chrome should support reading, comparing, and inspecting type.

Balance expert scanning with approachable exploration. Users should be able to compare language coverage, category, license, lineage, and preview text without digging through decorative layout, while first-time visitors should still understand where to start.

Use familiar product affordances. Search, filters, tables, pagination, expandable rows, details pages, and comparison tools should behave predictably with clear states.

Respect CJK typography. Traditional Chinese UI and mixed CJK preview strings need sufficient line height, spacing, and responsive room to remain legible.

Support dual density. Default to a comfortable catalog view with stronger specimen presence for broader audiences, and provide a compact workbench view for users who want to scan many fonts quickly.

Preserve restrained identity while increasing finish. Use the existing daisyUI winter/night foundation, but refine layout, hierarchy, density, and specimen presentation so the interface feels intentionally designed rather than merely minimal.

## Accessibility & Inclusion

Target WCAG 2.1 AA for contrast, keyboard operation, visible focus states, semantic navigation, and form controls. Avoid color-only status communication by pairing badges, labels, and text. Keep motion minimal and respect reduced-motion preferences. Ensure dense CJK text, tables, badges, and preview controls remain usable across mobile and desktop screen sizes.
