import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        blueprint: {
          bg: "#0B2545",
          grid: "#173A6B",
          paper: "#F3F1EA",
          ink: "#0B2545",
          slate: "#8CA3C4",
          amber: "#D4A24C",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "blueprint-grid":
          "linear-gradient(#173A6B 1px, transparent 1px), linear-gradient(90deg, #173A6B 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "32px 32px",
      },
    },
  },
  plugins: [],
};
export default config;
