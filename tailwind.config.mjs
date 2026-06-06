import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "media",
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter Variable", "Inter", "ui-sans-serif", "system-ui"],
      },
      colors: {
        ink: {
          50: "#f8f7f4",
          100: "#edebe3",
          200: "#d8d2c4",
          700: "#3d3a34",
          900: "#171511",
        },
        vermilion: "#b94a35",
        leaf: "#4f7143",
      },
    },
  },
  plugins: [typography],
};
