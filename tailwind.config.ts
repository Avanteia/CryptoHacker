import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        term: {
          bg: "#0a0e12",
          panel: "#0d1117",
          border: "#1f2a24",
          green: "#00ff41",
          greendim: "#0a8a2e",
          cyan: "#28e0ff",
          red: "#ff3b3b",
          amber: "#ffb000",
          muted: "#5f7a68",
        },
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Fira Code", "ui-monospace", "monospace"],
      },
      keyframes: {
        blink: { "0%,49%": { opacity: "1" }, "50%,100%": { opacity: "0" } },
        scanline: { "0%": { transform: "translateY(0)" }, "100%": { transform: "translateY(100%)" } },
        flicker: { "0%,100%": { opacity: "1" }, "92%": { opacity: "0.94" }, "94%": { opacity: "1" } },
      },
      animation: {
        blink: "blink 1s step-end infinite",
        scanline: "scanline 8s linear infinite",
        flicker: "flicker 6s infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
