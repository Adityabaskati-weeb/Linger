/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{tsx,ts,jsx,js}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Clash Display", "DM Serif Display", "serif"],
        body: ["DM Sans", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"]
      },
      colors: {
        base: "#08080E",
        elevated: "#0F0F1A",
        overlay: "#16162A",
        interactive: "#1C1C35",
        primary: { DEFAULT: "#6366F1", hover: "#7C7FF5" },
        cyan: { DEFAULT: "#06B6D4" },
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444"
      },
      backgroundImage: {
        "gradient-hero": "linear-gradient(135deg, #6366F1 0%, #06B6D4 100%)",
        "gradient-card": "linear-gradient(145deg, #0F0F1A 0%, #13132A 100%)"
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06)",
        elevated: "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)",
        glow: "0 0 24px rgba(99,102,241,0.35)"
      }
    }
  },
  plugins: []
};
