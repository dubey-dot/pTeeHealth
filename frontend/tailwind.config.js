/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Dark navy used for the logo mark, active nav pill, and primary
        // buttons (e.g. "Wrap intake"). Sampled from the reference design.
        navy: {
          DEFAULT: "#0F2438",
          light: "#16324A",
        },
        // Muted teal used for the active-tab underline and the pain-score
        // slider accent.
        teal: {
          accent: "#2FB6A9",
        },
        // Page background is a very light blue-gray, distinct from pure
        // white so the cards read as elevated surfaces.
        canvas: "#F5F7FA",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
      },
      borderRadius: {
        card: "1rem",
      },
    },
  },
  plugins: [],
};
