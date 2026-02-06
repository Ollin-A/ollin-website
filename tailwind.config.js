import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
      },
      colors: {
        "ollin-bg": "#f2efe9",
        "ollin-black": "#111111",
        "ollin-gray": "#666666",
      },
    },
  },
  plugins: [typography],
};
