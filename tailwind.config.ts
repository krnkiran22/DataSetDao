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
      boxShadow: {
        "glow-pink": "0 0 15px rgba(230, 0, 122, 0.25), 0 0 30px rgba(230, 0, 122, 0.15)",
        "glow-magenta": "0 0 20px rgba(255, 0, 128, 0.3), 0 0 40px rgba(255, 0, 128, 0.2)",
        "sm-glow-pink": "0 0 8px rgba(230, 0, 122, 0.2)",
      },
    },
  },
  plugins: [],
};

export default config;
