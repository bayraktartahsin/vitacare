import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0b0d12",
        panel: "#11141b",
        panel2: "#161a23",
        line: "#222633",
        ink: "#e7e9ee",
        ink2: "#9aa1ad",
        accent: "#7aa2f7",
        warn: "#e0af68",
        ok: "#9ece6a",
        bad: "#f7768e",
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
