import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: [
          "-apple-system",
          "SF Pro Display",
          "BlinkMacSystemFont",
          "Inter",
          "system-ui",
          "sans-serif",
        ],
        body: [
          "-apple-system",
          "SF Pro Text",
          "BlinkMacSystemFont",
          "Inter",
          "system-ui",
          "sans-serif",
        ],
        mono: [
          "SF Mono",
          "Monaco",
          "Cascadia Code",
          "Courier New",
          "monospace",
        ],
      },
      fontSize: {
        "display-xl": ["4.5rem", { lineHeight: "1.1" }],
        "display-l": ["3.5rem", { lineHeight: "1.1" }],
        "display-m": ["3rem", { lineHeight: "1.1" }],
        "heading-1": ["2.5rem", { lineHeight: "1.2" }],
        "heading-2": ["2rem", { lineHeight: "1.2" }],
        "heading-3": ["1.5rem", { lineHeight: "1.2" }],
        "heading-4": ["1.25rem", { lineHeight: "1.2" }],
        "body-lg": ["1.125rem", { lineHeight: "1.6" }],
        body: ["1rem", { lineHeight: "1.6" }],
        "body-sm": ["0.875rem", { lineHeight: "1.6" }],
        caption: ["0.75rem", { lineHeight: "1.4" }],
      },
      colors: {
        background: {
          base: "#0A0A0F",
          elevated: "#13131A",
          surface: "#1C1C1E",
          overlay: "#2C2C2E",
        },
        foreground: {
          primary: "#FFFFFF",
          secondary: "#E0E0E0",
          tertiary: "#98989D",
          disabled: "#636366",
        },
        accent: {
          pink: "#E6007A",
          magenta: "#FF006B",
          mesh: "#FF0080",
          green: "#30D158",
          orange: "#FF9F0A",
          red: "#FF453A",
          teal: "#64D2FF",
          indigo: "#5E5CE6",
        },
        border: {
          subtle: "rgba(230, 0, 122, 0.15)",
          DEFAULT: "rgba(230, 0, 122, 0.2)",
          strong: "rgba(230, 0, 122, 0.4)",
        },
        glass: {
          bg: "rgba(19, 19, 26, 0.8)",
        },
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        "2xl": "32px",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2)",
        md: "0 4px 6px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2)",
        lg: "0 10px 15px rgba(0, 0, 0, 0.3), 0 4px 6px rgba(0, 0, 0, 0.2)",
        xl: "0 20px 25px rgba(0, 0, 0, 0.4), 0 10px 10px rgba(0, 0, 0, 0.3)",
        "glow-pink":
          "0 0 20px rgba(230, 0, 122, 0.4), 0 0 40px rgba(230, 0, 122, 0.2)",
        "glow-magenta":
          "0 0 30px rgba(255, 0, 128, 0.5), 0 0 60px rgba(255, 0, 128, 0.3)",
        "glow-green":
          "0 0 20px rgba(48, 209, 88, 0.3), 0 0 40px rgba(48, 209, 88, 0.1)",
        "glow-orange":
          "0 0 20px rgba(255, 159, 10, 0.3), 0 0 40px rgba(255, 159, 10, 0.1)",
      },
    },
  },
  plugins: [],
};

export default config;
