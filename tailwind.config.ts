import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0A1F3D",
          light: "#1a3a5f",
          lighter: "#2d5280",
        },
        gold: {
          DEFAULT: "#D4A94A",
          bright: "#E8BF5E",
          dark: "#A88536",
        },
        bg: {
          DEFAULT: "#F7F5EF",
          card: "#FFFFFF",
        },
        text: {
          DEFAULT: "#0A1F3D",
          muted: "#5a6b85",
          soft: "#8a97ab",
        },
        border: {
          DEFAULT: "#E5E0D0",
        },
        success: {
          DEFAULT: "#2d8659",
          bg: "#E5F0EA",
        },
        warning: {
          DEFAULT: "#C77700",
          bg: "#FFF2DD",
        },
        danger: {
          DEFAULT: "#A83232",
          bg: "#FBEAEA",
        },
      },
      fontFamily: {
        sans: ["var(--font-heebo)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 20px rgba(10, 31, 61, 0.08)",
        lg: "0 12px 40px rgba(10, 31, 61, 0.15)",
      },
      keyframes: {
        slideUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        pulse: {
          "0%": { boxShadow: "0 0 0 0 rgba(212, 169, 74, 0.5)" },
          "70%": { boxShadow: "0 0 0 12px rgba(212, 169, 74, 0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(212, 169, 74, 0)" },
        },
      },
      animation: {
        "slide-up": "slideUp 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
        "pulse-gold": "pulse 1.2s ease",
      },
    },
  },
  plugins: [],
};

export default config;
