/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        canopy: {
          50: "#f2f7f3",
          100: "#dfeee2",
          200: "#bddcc4",
          300: "#93c29e",
          400: "#67a476",
          500: "#48865a",
          600: "#356b46",
          700: "#2b543a",
          800: "#1f3d2a", // primary brand
          900: "#132a1c",
          950: "#0b1a12",
        },
        clay: {
          50: "#fbf7f0",
          100: "#f6ede0",
          200: "#eddabf",
          300: "#e0bf93",
          400: "#d3a267",
          500: "#c68a48",
          600: "#a76e39",
        },
        rust: {
          400: "#e0725c",
          500: "#c1443c",
          600: "#a3352f",
        },
        amber: {
          400: "#e3b23c",
          500: "#d9a441",
        },
        paper: {
          DEFAULT: "#f6f7f4",
          dim: "#eef0ea",
        },
        ink: {
          DEFAULT: "#14201a",
          soft: "#3c4a41",
        },
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(19,42,28,0.06), 0 8px 24px -12px rgba(19,42,28,0.18)",
        glow: "0 0 0 1px rgba(72,134,90,0.16), 0 12px 32px -8px rgba(43,84,58,0.28)",
      },
      backgroundImage: {
        "grain": "radial-gradient(circle at 1px 1px, rgba(19,42,28,0.06) 1px, transparent 0)",
      },
      keyframes: {
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        scanline: "scanline 2.4s ease-in-out infinite",
        floatSlow: "floatSlow 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
