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
        primary: {
          DEFAULT: "#2C3E5F", // Azul oscuro del logo
          dark: "#1e2b42",
        },
        secondary: {
          DEFAULT: "#3A5734", // Verde oscuro del logo
          dark: "#2d4329",
        },
        accent: {
          DEFAULT: "#D4AF37", // Dorado de la horquilla
          light: "#E5C158",
        },
      },
    },
  },
  plugins: [],
};

export default config;
