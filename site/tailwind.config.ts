import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ── Colors: strict mapping from DESIGN.md ──
      colors: {
        // Primary
        "notion-black": "rgba(0,0,0,0.95)",
        "pure-white": "#ffffff",
        "notion-blue": "#0075de",

        // Warm Neutral Scale
        "warm-white": "#f6f5f4",
        "warm-dark": "#31302e",
        "warm-gray-500": "#615d59",
        "warm-gray-300": "#a39e98",

        // Semantic Accent
        teal: "#2a9d99",
        green: "#1aae39",
        orange: "#dd5b00",
        pink: "#ff64c8",
        purple: "#391c57",
        brown: "#523410",

        // Interactive
        "link-blue": "#0075de",
        "link-light-blue": "#62aef0",
        "focus-blue": "#097fe8",
        "badge-blue-bg": "#f2f9ff",
        "badge-blue-text": "#097fe8",

        // Code inline
        "code-inline-text": "#e83e8c",
      },

      // ── Font Family ──
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "system-ui",
          "Segoe UI",
          "Helvetica",
          "Apple Color Emoji",
          "Arial",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "Fira Code",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },

      // ── Font Size (from DESIGN.md typography table) ──
      fontSize: {
        "page-title": ["2.5rem", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" }],
        "h1": ["2rem", { lineHeight: "1.3", letterSpacing: "-0.015em", fontWeight: "700" }],
        "h2": ["1.63rem", { lineHeight: "1.35", letterSpacing: "-0.01em", fontWeight: "700" }],
        "h3": ["1.38rem", { lineHeight: "1.4", letterSpacing: "-0.005em", fontWeight: "600" }],
        "h4": ["1.125rem", { lineHeight: "1.4", letterSpacing: "0", fontWeight: "600" }],
        "body-lg": ["1.125rem", { lineHeight: "1.75", letterSpacing: "0" }],
        "body": ["1rem", { lineHeight: "1.75", letterSpacing: "0" }],
        "body-md": ["1rem", { lineHeight: "1.75", letterSpacing: "0", fontWeight: "500" }],
        "caption": ["0.875rem", { lineHeight: "1.5", letterSpacing: "0" }],
        "badge": ["0.75rem", { lineHeight: "1.33", letterSpacing: "0.125px", fontWeight: "600" }],
        "code": ["0.875rem", { lineHeight: "1.6", letterSpacing: "0" }],
      },

      // ── Spacing (8px base unit scale, extends defaults) ──
      spacing: {
        "1": "4px",
        "2": "8px",
        "3": "12px",
        "4": "16px",
        "5": "20px",
        "6": "24px",
        "8": "32px",
        "12": "48px",
        "16": "64px",
        "24": "96px",
      },

      // ── Border Radius ──
      borderRadius: {
        "btn": "4px",
        "card": "12px",
        "pill": "9999px",
        "search": "8px",
      },

      // ── Shadows: multi-layer low-opacity (from DESIGN.md Section 6) ──
      boxShadow: {
        "card": [
          "0px 4px 18px rgba(0,0,0,0.04)",
          "0px 2.025px 7.84688px rgba(0,0,0,0.027)",
          "0px 0.8px 2.925px rgba(0,0,0,0.02)",
          "0px 0.175px 1.04062px rgba(0,0,0,0.01)",
        ].join(", "),
        "card-hover": [
          "0px 6px 24px rgba(0,0,0,0.06)",
          "0px 3px 10px rgba(0,0,0,0.04)",
          "0px 1px 4px rgba(0,0,0,0.03)",
          "0px 0.25px 1.5px rgba(0,0,0,0.015)",
        ].join(", "),
        "deep": [
          "0px 1px 3px rgba(0,0,0,0.01)",
          "0px 3px 7px rgba(0,0,0,0.02)",
          "0px 7px 15px rgba(0,0,0,0.02)",
          "0px 14px 28px rgba(0,0,0,0.04)",
          "0px 23px 52px rgba(0,0,0,0.05)",
        ].join(", "),
        "whisper": "0px 0px 0px 1px rgba(0,0,0,0.1)",
        "focus-ring": "0 0 0 3px rgba(9,127,232,0.15)",
      },

      // ── Max Width ──
      maxWidth: {
        "content": "720px",
        "content-wide": "800px",
        "sidebar": "280px",
        "toc": "240px",
      },

      // ── Keyframes for transitions ──
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(-4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
