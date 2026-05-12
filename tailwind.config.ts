import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        border: "hsl(var(--border))",
        accent: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--foreground))" },
        popover: { DEFAULT: "hsl(var(--background))", foreground: "hsl(var(--foreground))" },
        ring: "hsl(var(--ring))",
        brand: {
          50: "#fff1f2",
          100: "#ffe4e6",
          200: "#fecdd3",
          300: "#fda4af",
          400: "#fb7185",
          500: "#f43f5e",
          600: "#e11d48",
          700: "#be123c",
          800: "#9f1239",
          900: "#881337",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
        "card-hover": "0 8px 25px rgba(0,0,0,0.12), 0 4px 10px rgba(0,0,0,0.06)",
        glass: "0 8px 32px rgba(0,0,0,0.08)",
        float: "0 20px 60px rgba(0,0,0,0.15)",
      },
      animation: {
        "fade-up": "fadeUp 0.4s ease-out",
        "fade-in": "fadeIn 0.3s ease-out",
        "accordion-down": "accordionDown 0.2s ease-out",
        "accordion-up": "accordionUp 0.2s ease-out",
        "marquee": "marquee var(--duration) linear infinite",
        "marquee-vertical": "marqueeVertical var(--duration) linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        accordionDown: {
          "0%": { height: "0" },
          "100%": { height: "var(--radix-accordion-content-height)" },
        },
        accordionUp: {
          "0%": { height: "var(--radix-accordion-content-height)" },
          "100%": { height: "0" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(calc(-100% - var(--gap)))" },
        },
        marqueeVertical: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(calc(-100% - var(--gap)))" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
