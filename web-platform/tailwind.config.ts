import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          DEFAULT: "#030712",
          50: "#111827",
          100: "#0f172a",
          200: "#0b0f19",
          300: "#080c14",
          900: "#030712",
        },
        ice: {
          DEFAULT: "#38bdf8",
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
          glow: "rgba(56, 189, 248, 0.4)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-in-out forwards",
        glow: "glow 2s ease-in-out infinite alternate",
        "ping-slow": "ping 3s cubic-bezier(0, 0, 0.2, 1) infinite",
        pulseGlow: "pulseGlow 2.5s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(56, 189, 248, 0.2), 0 0 10px rgba(56, 189, 248, 0.1)" },
          "100%": { boxShadow: "0 0 20px rgba(56, 189, 248, 0.6), 0 0 30px rgba(56, 189, 248, 0.3)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.6", transform: "scale(1.05)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
