export const LANGUAGE_CODES = [
  "SC",
  "TC-TW",
  "TC-HK",
  "JP",
  "KR",
  "HERITAGE",
] as const;
export const CATEGORIES = [
  "sans",
  "serif",
  "rounded",
  "mono",
  "handwriting",
  "pixel",
] as const;
export const LICENSE_FILTERS = ["OFL", "Apache", "MIT", "Other"] as const;

export type LanguageCode = (typeof LANGUAGE_CODES)[number];
export type Category = (typeof CATEGORIES)[number];
export type LicenseFilter = (typeof LICENSE_FILTERS)[number];
export type CoverageLevel = "full" | "partial" | "experimental" | "none";

export const GLYPH_LABELS: Record<LanguageCode, string> = {
  SC: "簡體",
  "TC-TW": "繁體（臺灣）",
  "TC-HK": "繁體（香港）",
  JP: "日文",
  KR: "韓文",
  HERITAGE: "傳承字形",
};

export interface FontLanguage {
  languageCode: LanguageCode;
  coverageLevel: CoverageLevel;
  note?: string;
}

export interface FontRecord {
  id: number;
  slug: string;
  name: string;
  displayName?: string;
  description?: string;
  license: string;
  sourceUrl?: string;
  repoUrl?: string;
  homepageUrl?: string;
  author?: string;
  category: Category;
  isVariable: boolean;
  isSourceHanDerivative: boolean;
  cssFontFamily?: string;
  previewCssUrl?: string;
  notes?: string;
  languages: FontLanguage[];
  tags: string[];
}

const panCjkLanguages: FontLanguage[] = [
  { languageCode: "SC", coverageLevel: "full" },
  { languageCode: "TC-TW", coverageLevel: "full" },
  { languageCode: "TC-HK", coverageLevel: "full" },
  { languageCode: "JP", coverageLevel: "full" },
  { languageCode: "KR", coverageLevel: "full" },
];

export const catalogFonts: FontRecord[] = [
  {
    id: 1,
    slug: "noto-sans-cjk",
    name: "Noto Sans CJK",
    displayName: "Noto Sans CJK",
    description:
      "A comprehensive pan-CJK sans serif family developed by Google for Chinese, Japanese, and Korean text.",
    license: "OFL-1.1",
    sourceUrl: "https://fonts.google.com/noto/specimen/Noto+Sans+SC",
    repoUrl: "https://github.com/notofonts/noto-cjk",
    homepageUrl: "https://fonts.google.com/noto",
    author: "Google",
    category: "sans",
    isVariable: false,
    isSourceHanDerivative: false,
    cssFontFamily: "'Noto Sans SC', 'Noto Sans CJK SC', sans-serif",
    previewCssUrl:
      "https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700&display=swap",
    notes:
      "Google Fonts preview uses the Simplified Chinese subset. Other regional glyph sets are available through Noto CJK releases.",
    languages: panCjkLanguages,
    tags: ["pan-cjk", "gothic", "ui"],
  },
  {
    id: 2,
    slug: "noto-serif-cjk",
    name: "Noto Serif CJK",
    displayName: "Noto Serif CJK",
    description:
      "A pan-CJK serif family designed for high-quality long-form Chinese, Japanese, and Korean typography.",
    license: "OFL-1.1",
    sourceUrl: "https://fonts.google.com/noto/specimen/Noto+Serif+SC",
    repoUrl: "https://github.com/notofonts/noto-cjk",
    homepageUrl: "https://fonts.google.com/noto",
    author: "Google",
    category: "serif",
    isVariable: false,
    isSourceHanDerivative: false,
    cssFontFamily: "'Noto Serif SC', 'Noto Serif CJK SC', serif",
    previewCssUrl:
      "https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700&display=swap",
    notes:
      "Google Fonts preview uses the Simplified Chinese subset. Use regional Noto CJK packages for production pan-CJK typesetting.",
    languages: panCjkLanguages,
    tags: ["pan-cjk", "songti", "mincho"],
  },
  {
    id: 3,
    slug: "source-han-sans",
    name: "Source Han Sans",
    displayName: "思源黑體 / 源ノ角ゴシック",
    description:
      "Adobe and Google's open-source pan-CJK sans serif family, distributed as Source Han Sans and Noto Sans CJK.",
    license: "OFL-1.1",
    sourceUrl: "https://github.com/adobe-fonts/source-han-sans",
    repoUrl: "https://github.com/adobe-fonts/source-han-sans",
    homepageUrl: "https://github.com/adobe-fonts/source-han-sans",
    author: "Adobe + Google",
    category: "sans",
    isVariable: false,
    isSourceHanDerivative: false,
    cssFontFamily: "'Source Han Sans', 'Noto Sans CJK SC', sans-serif",
    notes:
      "Same glyph project as Noto Sans CJK with different packaging and naming. No web preview CSS is bundled by this catalog.",
    languages: panCjkLanguages,
    tags: ["pan-cjk", "gothic", "adobe"],
  },
  {
    id: 4,
    slug: "source-han-serif",
    name: "Source Han Serif",
    displayName: "思源宋體 / 源ノ明朝",
    description:
      "Adobe and Google's open-source pan-CJK serif family for editorial and long-form CJK typography.",
    license: "OFL-1.1",
    sourceUrl: "https://source.typekit.com/source-han-serif/",
    repoUrl: "https://github.com/adobe-fonts/source-han-serif",
    homepageUrl: "https://github.com/adobe-fonts/source-han-serif",
    author: "Adobe + Google",
    category: "serif",
    isVariable: false,
    isSourceHanDerivative: false,
    cssFontFamily: "'Source Han Serif', 'Noto Serif CJK SC', serif",
    notes:
      "Same glyph project as Noto Serif CJK with different packaging and naming. No web preview CSS is bundled by this catalog.",
    languages: panCjkLanguages,
    tags: ["pan-cjk", "mincho", "adobe"],
  },
  {
    id: 5,
    slug: "sarasa-gothic",
    name: "Sarasa Gothic",
    displayName: "更紗黑體",
    description:
      "A CJK programming typeface based on Iosevka and Source Han Sans, useful for code and multilingual UI.",
    license: "OFL-1.1",
    sourceUrl: "https://github.com/be5invis/Sarasa-Gothic",
    repoUrl: "https://github.com/be5invis/Sarasa-Gothic",
    author: "be5invis",
    category: "mono",
    isVariable: false,
    isSourceHanDerivative: true,
    cssFontFamily: "'Sarasa Gothic', 'Sarasa Mono SC', monospace",
    notes:
      "The project ships many regional and width variants. Choose the package that matches your script and code style needs.",
    languages: panCjkLanguages,
    tags: ["mono", "programming", "gothic"],
  },
  {
    id: 6,
    slug: "lxgw-wenkai",
    name: "LXGW WenKai",
    displayName: "霞鶩文楷",
    description:
      "A readable open-source Kaiti-style typeface with a warm handwritten texture for Chinese text.",
    license: "OFL-1.1",
    sourceUrl: "https://github.com/lxgw/LxgwWenKai",
    repoUrl: "https://github.com/lxgw/LxgwWenKai",
    author: "LXGW",
    category: "handwriting",
    isVariable: false,
    isSourceHanDerivative: false,
    cssFontFamily: "'LXGW WenKai TC', 'LXGW WenKai', cursive",
    previewCssUrl:
      "https://fonts.googleapis.com/css2?family=LXGW+WenKai+TC:wght@400;700&display=swap",
    notes:
      "Traditional Chinese preview is available through Google Fonts. Simplified Chinese support is partial in this MVP catalog entry.",
    languages: [
      { languageCode: "TC-TW", coverageLevel: "full" },
      { languageCode: "SC", coverageLevel: "partial" },
    ],
    tags: ["kaiti", "handwriting", "reading"],
  },
  {
    id: 7,
    slug: "m-plus-1p",
    name: "M PLUS 1p",
    displayName: "M PLUS 1p",
    description:
      "A geometric Japanese sans serif with a wide weight range and approachable screen texture.",
    license: "OFL-1.1",
    sourceUrl: "https://fonts.google.com/specimen/M+PLUS+1p",
    repoUrl: "https://github.com/coz-m/MPLUS_FONTS",
    author: "Coji Morishita",
    category: "sans",
    isVariable: false,
    isSourceHanDerivative: false,
    cssFontFamily: "'M PLUS 1p', sans-serif",
    previewCssUrl:
      "https://fonts.googleapis.com/css2?family=M+PLUS+1p:wght@400;700&display=swap",
    languages: [{ languageCode: "JP", coverageLevel: "full" }],
    tags: ["japanese", "geometric", "ui"],
  },
  {
    id: 8,
    slug: "zen-kaku-gothic",
    name: "Zen Kaku Gothic",
    displayName: "Zen Kaku Gothic New",
    description:
      "A contemporary Japanese gothic family with clean strokes for headings, UI, and body text.",
    license: "OFL-1.1",
    sourceUrl: "https://fonts.google.com/specimen/Zen+Kaku+Gothic+New",
    repoUrl: "https://github.com/googlefonts/zen-kakugothic",
    author: "Google",
    category: "sans",
    isVariable: false,
    isSourceHanDerivative: false,
    cssFontFamily: "'Zen Kaku Gothic New', sans-serif",
    previewCssUrl:
      "https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@400;700&display=swap",
    languages: [{ languageCode: "JP", coverageLevel: "full" }],
    tags: ["japanese", "gothic", "ui"],
  },
  {
    id: 9,
    slug: "zen-maru-gothic",
    name: "Zen Maru Gothic",
    displayName: "Zen Maru Gothic",
    description:
      "A rounded Japanese gothic family with soft terminals and friendly display character.",
    license: "OFL-1.1",
    sourceUrl: "https://fonts.google.com/specimen/Zen+Maru+Gothic",
    repoUrl: "https://github.com/googlefonts/zen-marugothic",
    author: "Google",
    category: "rounded",
    isVariable: false,
    isSourceHanDerivative: false,
    cssFontFamily: "'Zen Maru Gothic', sans-serif",
    previewCssUrl:
      "https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;700&display=swap",
    languages: [{ languageCode: "JP", coverageLevel: "full" }],
    tags: ["japanese", "rounded", "friendly"],
  },
  {
    id: 10,
    slug: "shippori-mincho",
    name: "Shippori Mincho",
    displayName: "Shippori Mincho",
    description:
      "A refined Japanese mincho typeface inspired by traditional book typography.",
    license: "OFL-1.1",
    sourceUrl: "https://fonts.google.com/specimen/Shippori+Mincho",
    repoUrl: "https://github.com/fontdasu/ShipporiMincho",
    author: "Google",
    category: "serif",
    isVariable: false,
    isSourceHanDerivative: false,
    cssFontFamily: "'Shippori Mincho', serif",
    previewCssUrl:
      "https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;700&display=swap",
    languages: [{ languageCode: "JP", coverageLevel: "full" }],
    tags: ["japanese", "mincho", "books"],
  },
  {
    id: 11,
    slug: "pretendard",
    name: "Pretendard",
    displayName: "Pretendard",
    description:
      "A Korean UI sans serif derived from Inter and Source Han Sans with broad modern interface use.",
    license: "OFL-1.1",
    sourceUrl: "https://cactus.tistory.com/306",
    repoUrl: "https://github.com/orioncactus/pretendard",
    homepageUrl: "https://github.com/orioncactus/pretendard",
    author: "orioncactus",
    category: "sans",
    isVariable: true,
    isSourceHanDerivative: true,
    cssFontFamily: "'Pretendard', sans-serif",
    notes:
      "No external preview CSS is loaded by this MVP. Install or self-host Pretendard for production usage.",
    languages: [{ languageCode: "KR", coverageLevel: "full" }],
    tags: ["korean", "ui", "variable"],
  },
  {
    id: 12,
    slug: "d2coding",
    name: "D2Coding",
    displayName: "D2Coding",
    description:
      "Naver's Korean monospaced coding font, designed for Hangul readability in development tools.",
    license: "OFL-1.1",
    sourceUrl: "https://github.com/naver/d2codingfont",
    repoUrl: "https://github.com/naver/d2codingfont",
    author: "Naver",
    category: "mono",
    isVariable: false,
    isSourceHanDerivative: false,
    cssFontFamily: "'D2 Coding', monospace",
    notes:
      "Google Fonts availability can vary; this MVP leaves remote preview CSS disabled unless a verified CSS endpoint is added.",
    languages: [{ languageCode: "KR", coverageLevel: "full" }],
    tags: ["korean", "mono", "programming"],
  },
  {
    id: 13,
    slug: "maple-mono-nf-cn",
    name: "Maple Mono NF CN",
    displayName: "Maple Mono NF CN",
    description:
      "A clean monospaced font with programming ligatures, supporting Chinese characters.",
    license: "OFL-1.1",
    repoUrl: "https://github.com/subframe7536/maple-font",
    author: "subframe7536",
    category: "mono",
    isVariable: false,
    isSourceHanDerivative: false,
    cssFontFamily: "'Maple Mono NF CN', monospace",
    languages: [
      { languageCode: "SC", coverageLevel: "full" },
      { languageCode: "TC-TW", coverageLevel: "partial" },
    ],
    tags: ["mono", "programming", "chinese"],
  },
  {
    id: 14,
    slug: "zen-old-mincho",
    name: "Zen Old Mincho",
    displayName: "Zen Old Mincho",
    description:
      "A traditional Japanese mincho typeface with classical proportions.",
    license: "OFL-1.1",
    sourceUrl: "https://fonts.google.com/specimen/Zen+Old+Mincho",
    author: "Google",
    category: "serif",
    isVariable: false,
    isSourceHanDerivative: false,
    cssFontFamily: "'Zen Old Mincho', serif",
    previewCssUrl:
      "https://fonts.googleapis.com/css2?family=Zen+Old+Mincho:wght@400;700&display=swap",
    languages: [{ languageCode: "JP", coverageLevel: "full" }],
    tags: ["japanese", "mincho", "classical"],
  },
  {
    id: 15,
    slug: "kosugi",
    name: "Kosugi",
    displayName: "Kosugi",
    description:
      "A clean Japanese gothic typeface designed for screen readability.",
    license: "OFL-1.1",
    sourceUrl: "https://fonts.google.com/specimen/Kosugi",
    author: "Google",
    category: "sans",
    isVariable: false,
    isSourceHanDerivative: false,
    cssFontFamily: "'Kosugi', sans-serif",
    previewCssUrl:
      "https://fonts.googleapis.com/css2?family=Kosugi:wght@400;700&display=swap",
    languages: [{ languageCode: "JP", coverageLevel: "full" }],
    tags: ["japanese", "gothic", "screen"],
  },
  {
    id: 16,
    slug: "kosugi-maru",
    name: "Kosugi Maru",
    displayName: "Kosugi Maru",
    description:
      "A rounded Japanese gothic typeface with soft, friendly character.",
    license: "OFL-1.1",
    sourceUrl: "https://fonts.google.com/specimen/Kosugi+Maru",
    author: "Google",
    category: "rounded",
    isVariable: false,
    isSourceHanDerivative: false,
    cssFontFamily: "'Kosugi Maru', sans-serif",
    previewCssUrl:
      "https://fonts.googleapis.com/css2?family=Kosugi+Maru:wght@400;700&display=swap",
    languages: [{ languageCode: "JP", coverageLevel: "full" }],
    tags: ["japanese", "rounded", "friendly"],
  },
  {
    id: 17,
    slug: "sawarabi-gothic",
    name: "Sawarabi Gothic",
    displayName: "Sawarabi Gothic",
    description:
      "A Japanese gothic typeface with balanced proportions for body text.",
    license: "OFL-1.1",
    sourceUrl: "https://fonts.google.com/specimen/Sawarabi+Gothic",
    author: "Google",
    category: "sans",
    isVariable: false,
    isSourceHanDerivative: false,
    cssFontFamily: "'Sawarabi Gothic', sans-serif",
    previewCssUrl:
      "https://fonts.googleapis.com/css2?family=Sawarabi+Gothic:wght@400;700&display=swap",
    languages: [{ languageCode: "JP", coverageLevel: "full" }],
    tags: ["japanese", "gothic", "body"],
  },
  {
    id: 18,
    slug: "sawarabi-mincho",
    name: "Sawarabi Mincho",
    displayName: "Sawarabi Mincho",
    description:
      "A Japanese mincho typeface inspired by traditional printing.",
    license: "OFL-1.1",
    sourceUrl: "https://fonts.google.com/specimen/Sawarabi+Mincho",
    author: "Google",
    category: "serif",
    isVariable: false,
    isSourceHanDerivative: false,
    cssFontFamily: "'Sawarabi Mincho', serif",
    previewCssUrl:
      "https://fonts.googleapis.com/css2?family=Sawarabi+Mincho:wght@400;700&display=swap",
    languages: [{ languageCode: "JP", coverageLevel: "full" }],
    tags: ["japanese", "mincho", "printing"],
  },
  {
    id: 19,
    slug: "suit",
    name: "SUIT",
    displayName: "SUIT",
    description:
      "A modern Korean sans-serif typeface with clean geometric forms.",
    license: "OFL-1.1",
    repoUrl: "https://github.com/sunn-us/SUIT",
    author: "Spoqa",
    category: "sans",
    isVariable: false,
    isSourceHanDerivative: false,
    cssFontFamily: "'SUIT', sans-serif",
    languages: [{ languageCode: "KR", coverageLevel: "full" }],
    tags: ["korean", "modern", "geometric"],
  },
  {
    id: 20,
    slug: "line-seed",
    name: "LINE Seed",
    displayName: "LINE Seed",
    description: "LINE's corporate typeface, designed for digital interfaces.",
    license: "OFL-1.1",
    repoUrl: "https://github.com/line/fonts",
    author: "LINE Corporation",
    category: "sans",
    isVariable: false,
    isSourceHanDerivative: false,
    cssFontFamily: "'LINE Seed', sans-serif",
    languages: [
      { languageCode: "JP", coverageLevel: "full" },
      { languageCode: "KR", coverageLevel: "full" },
    ],
    tags: ["japanese", "korean", "corporate", "ui"],
  },
  {
    id: 21,
    slug: "ibm-plex-sans-kr",
    name: "IBM Plex Sans KR",
    displayName: "IBM Plex Sans KR",
    description: "IBM's corporate typeface adapted for Korean text.",
    license: "OFL-1.1",
    sourceUrl: "https://fonts.google.com/specimen/IBM+Plex+Sans+KR",
    author: "IBM",
    category: "sans",
    isVariable: false,
    isSourceHanDerivative: false,
    cssFontFamily: "'IBM Plex Sans KR', sans-serif",
    previewCssUrl:
      "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@400;700&display=swap",
    languages: [{ languageCode: "KR", coverageLevel: "full" }],
    tags: ["korean", "corporate", "ui"],
  },
  {
    id: 22,
    slug: "unifont",
    name: "Unifont",
    displayName: "Unifont",
    description:
      "A bitmap font covering all Unicode planes, including CJK characters.",
    license: "GPL-2.0",
    sourceUrl: "https://unifoundry.com/unifont.html",
    author: "GNU Project",
    category: "pixel",
    isVariable: false,
    isSourceHanDerivative: false,
    cssFontFamily: "'Unifont', monospace",
    notes:
      "Bitmap font, not suitable for print. Best for terminal and pixel art.",
    languages: [
      { languageCode: "SC", coverageLevel: "partial" },
      { languageCode: "TC-TW", coverageLevel: "partial" },
      { languageCode: "JP", coverageLevel: "partial" },
      { languageCode: "KR", coverageLevel: "partial" },
    ],
    tags: ["pixel", "unicode", "bitmap"],
  },
  {
    id: 23,
    slug: "unifont-jp",
    name: "Unifont JP",
    displayName: "Unifont JP",
    description:
      "Japanese variant of Unifont with proper glyph forms for Japanese characters.",
    license: "GPL-2.0",
    sourceUrl: "https://unifoundry.com/unifont.html",
    author: "GNU Project",
    category: "pixel",
    isVariable: false,
    isSourceHanDerivative: false,
    cssFontFamily: "'Unifont JP', monospace",
    notes: "Japanese variant with proper glyph forms.",
    languages: [{ languageCode: "JP", coverageLevel: "partial" }],
    tags: ["pixel", "unicode", "bitmap", "japanese"],
  },
  {
    id: 24,
    slug: "wenquanyi-micro-hei",
    name: "WenQuanYi Micro Hei",
    displayName: "文泉驛微米黑",
    description:
      "A Chinese sans-serif typeface designed for screen readability.",
    license: "GPL-2.0",
    sourceUrl: "https://wenq.org/en/",
    author: "WenQuanYi",
    category: "sans",
    isVariable: false,
    isSourceHanDerivative: false,
    cssFontFamily: "'WenQuanYi Micro Hei', sans-serif",
    languages: [
      { languageCode: "SC", coverageLevel: "full" },
      { languageCode: "TC-TW", coverageLevel: "partial" },
    ],
    tags: ["chinese", "screen", "sans"],
  },
  {
    id: 25,
    slug: "source-han-rounded",
    name: "Source Han Rounded",
    displayName: "思源柔黑體 / 源柔ゴシック",
    description:
      "A rounded variant of Source Han Sans, with softer terminals.",
    license: "OFL-1.1",
    repoUrl: "https://github.com/ButTaiwan/SourceHanRounded",
    author: "But Ko",
    category: "rounded",
    isVariable: false,
    isSourceHanDerivative: true,
    cssFontFamily: "'Source Han Rounded', 'Noto Sans CJK SC', sans-serif",
    languages: panCjkLanguages,
    tags: ["rounded", "source-han", "pan-cjk"],
  },
  {
    id: 26,
    slug: "chill-bitmap",
    name: "Chill Bitmap",
    displayName: "寒蟬全宋體",
    description: "A pixel/bitmap Chinese font with retro aesthetic.",
    license: "OFL-1.1",
    author: "寒蟬",
    category: "pixel",
    isVariable: false,
    isSourceHanDerivative: false,
    cssFontFamily: "'Chill Bitmap', monospace",
    languages: [
      { languageCode: "SC", coverageLevel: "full" },
      { languageCode: "TC-TW", coverageLevel: "partial" },
    ],
    tags: ["pixel", "chinese", "retro"],
  },
  {
    id: 27,
    slug: "siv-gothic",
    name: "SIV Gothic",
    displayName: "獅尾黑體",
    description: "A Chinese gothic typeface with clean, modern forms.",
    license: "OFL-1.1",
    repoUrl: "https://github.com/max32002/siv-font",
    author: "Max",
    category: "sans",
    isVariable: false,
    isSourceHanDerivative: false,
    cssFontFamily: "'SIV Gothic', sans-serif",
    languages: [
      { languageCode: "SC", coverageLevel: "full" },
      { languageCode: "TC-TW", coverageLevel: "full" },
    ],
    tags: ["chinese", "gothic", "modern"],
  },
];

export const defaultPreviewText =
  "漢字かな交じり文 · 简体繁體中文 · 한글 테스트";
