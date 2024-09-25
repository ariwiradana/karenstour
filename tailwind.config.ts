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
        lightgray: "#f9f9fb",
        dark: "#101010",
        darkgray: "#6F787F",
        primary: "#81A263",
        admin: {
          primary: "#3366FF",
          success: "#33B747",
          info: "#548EF9",
          warning: "#FFE23F",
          danger: "#FF3B2D",
        },
      },
      fontFamily: {
        unbounded: "Unbounded, sans-serif",
      },
    },
  },
  plugins: [],
};
export default config;
